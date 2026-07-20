import { NextResponse } from "next/server";
import twilio from "twilio";
import {
  getPhoneProvider,
  findCompanyByPhoneNumber,
  createCallRecord,
} from "@/services/phone";
import { parseTwilioParams, verifyTwilioSignature } from "@/services/phone/providers";
import { getActiveAgent, startConversation } from "@/services/ai";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

function twiml(response: InstanceType<typeof twilio.twiml.VoiceResponse>) {
  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

/** A safe, professional TwiML fallback — never a raw 500 to a live caller. */
function errorTwiml(message: string) {
  const response = new twilio.twiml.VoiceResponse();
  response.say(message);
  response.hangup();
  return twiml(response);
}

// Twilio's own webhook traffic comes from a shared pool of Twilio IPs, and
// a single caller can legitimately place several calls in a row — so this
// stays generous enough to never plausibly trip on real usage at this
// scale, while still blunting a direct flood against this public endpoint.
// Checked before parsing the request body, so a flood is rejected as
// cheaply as possible.
const RATE_LIMIT = { limit: 60, windowMs: 60_000 };

export async function POST(request: Request) {
  if (!checkRateLimit({ route: "twilio_incoming_call", request, ...RATE_LIMIT })) {
    return errorTwiml("We're unable to process this call right now. Please try again shortly.");
  }

  const params = await parseTwilioParams(request);
  const signature = request.headers.get("x-twilio-signature");

  if (!verifyTwilioSignature({ signature, url: request.url, params })) {
    logger.warn("twilio.incoming_call.invalid_signature");
    return new NextResponse("Invalid signature", { status: 403 });
  }

  if (!params.CallSid || !params.From || !params.To) {
    logger.warn("twilio.incoming_call.missing_required_params", {
      hasCallSid: Boolean(params.CallSid),
      hasFrom: Boolean(params.From),
      hasTo: Boolean(params.To),
    });
    return errorTwiml("We're unable to process this call right now. Goodbye.");
  }

  try {
    const response = new twilio.twiml.VoiceResponse();

    // 1. Identify company — Centro never replaces a company's own phone
    // system, so every incoming call must map to a company via the Centro
    // number their phone menu forwarded it to.
    const provider = getPhoneProvider("TWILIO");
    const incoming = await provider.receiveCall(params);
    const company = await findCompanyByPhoneNumber(incoming.to);

    if (!company) {
      logger.warn("twilio.incoming_call.unrecognized_number", { callSid: params.CallSid });
      response.say("This number is not configured. Goodbye.");
      response.hangup();
      return twiml(response);
    }

    // 2. Load AI agent configuration
    const agent = await getActiveAgent(company.id);

    if (!agent) {
      logger.warn("twilio.incoming_call.no_active_agent", {
        callSid: params.CallSid,
        companyId: company.id,
      });
      response.say("No agent is currently available for this call. Goodbye.");
      response.hangup();
      return twiml(response);
    }

    // 3. Start conversation
    const turn = startConversation(agent);

    // 4. Store call information
    await createCallRecord({
      companyId: company.id,
      providerCallId: incoming.providerCallId,
      callerPhone: incoming.from,
    });

    logger.info("twilio.incoming_call.answered", {
      callSid: params.CallSid,
      companyId: company.id,
    });

    response.say(turn.message);
    return twiml(response);
  } catch (error) {
    logger.error("twilio.incoming_call.failed", {
      callSid: params.CallSid,
      message: error instanceof Error ? error.message : "unknown error",
    });
    return errorTwiml("We're experiencing a technical issue. Please try again later.");
  }
}
