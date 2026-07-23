import { NextResponse } from "next/server";
import {
  getPhoneProvider,
  findCompanyByPhoneNumber,
  createCallRecord,
} from "@/services/phone";
import {
  getPublicRequestUrl,
  parseTwilioParams,
  sayAndGatherTwiml,
  sayAndHangupTwiml,
  verifyTwilioSignature,
} from "@/services/phone/providers";
import { getActiveAgent, startConversation } from "@/services/ai";
import { isConnectionTimeoutError } from "@/lib/db/client";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

// Twilio's own webhook traffic comes from a shared pool of Twilio IPs, and
// a single caller can legitimately place several calls in a row — so this
// stays generous enough to never plausibly trip on real usage at this
// scale, while still blunting a direct flood against this public endpoint.
// Checked before parsing the request body, so a flood is rejected as
// cheaply as possible.
const RATE_LIMIT = { limit: 60, windowMs: 60_000 };

export async function POST(request: Request) {
  if (!checkRateLimit({ route: "twilio_incoming_call", request, ...RATE_LIMIT })) {
    return sayAndHangupTwiml("We're unable to process this call right now. Please try again shortly.");
  }

  const params = await parseTwilioParams(request);
  const signature = request.headers.get("x-twilio-signature");

  if (!verifyTwilioSignature({ signature, url: getPublicRequestUrl(request), params })) {
    logger.warn("twilio.incoming_call.invalid_signature");
    return new NextResponse("Invalid signature", { status: 403 });
  }

  if (!params.CallSid || !params.From || !params.To) {
    logger.warn("twilio.incoming_call.missing_required_params", {
      hasCallSid: Boolean(params.CallSid),
      hasFrom: Boolean(params.From),
      hasTo: Boolean(params.To),
    });
    return sayAndHangupTwiml("We're unable to process this call right now. Goodbye.");
  }

  try {
    // TEMPORARY diagnostic timing — investigating a 14.7s application-code
    // request this morning, suspected Neon cold-start after an idle
    // overnight gap. Remove once confirmed/resolved.
    const tStart = performance.now();

    // 1. Identify company — Centro never replaces a company's own phone
    // system, so every incoming call must map to a company via the Centro
    // number their phone menu forwarded it to.
    const provider = getPhoneProvider("TWILIO");
    const incoming = await provider.receiveCall(params);
    const tReceiveCall = performance.now();

    const company = await findCompanyByPhoneNumber(incoming.to);
    const tCompanyLookup = performance.now();

    if (!company) {
      logger.warn("twilio.incoming_call.unrecognized_number", { callSid: params.CallSid });
      return sayAndHangupTwiml("This number is not configured. Goodbye.");
    }

    // 2. Load AI agent configuration
    const agent = await getActiveAgent(company.id);
    const tAgentLookup = performance.now();

    if (!agent) {
      logger.warn("twilio.incoming_call.no_active_agent", {
        callSid: params.CallSid,
        companyId: company.id,
      });
      return sayAndHangupTwiml("No agent is currently available for this call. Goodbye.");
    }

    // 3. Start conversation — synchronous, no OpenAI call happens here;
    // startConversation() just returns the agent's configured greeting.
    const turn = startConversation(agent);
    const tConversationStart = performance.now();

    // 4. Store call information, including the initial conversation state
    // (the greeting as the first assistant turn) so /api/twilio/gather has
    // turn history to build on once the caller replies.
    await createCallRecord({
      companyId: company.id,
      providerCallId: incoming.providerCallId,
      callerPhone: incoming.from,
      conversationState: turn.state,
    });
    const tCreateCall = performance.now();

    logger.info("twilio.incoming_call.timing", {
      callSid: params.CallSid,
      companyId: company.id,
      receiveCallMs: Math.round(tReceiveCall - tStart),
      companyLookupMs: Math.round(tCompanyLookup - tReceiveCall),
      agentLookupMs: Math.round(tAgentLookup - tCompanyLookup),
      conversationStartMs: Math.round(tConversationStart - tAgentLookup),
      createCallMs: Math.round(tCreateCall - tConversationStart),
      totalMs: Math.round(tCreateCall - tStart),
    });

    logger.info("twilio.incoming_call.answered", {
      callSid: params.CallSid,
      companyId: company.id,
    });

    return sayAndGatherTwiml(turn.message);
  } catch (error) {
    logger.error("twilio.incoming_call.failed", {
      callSid: params.CallSid,
      message: error instanceof Error ? error.message : "unknown error",
    });

    // A slow/suspended DB connection (see connectionTimeoutMillis in
    // lib/db/client.ts) fails fast and predictably rather than hanging —
    // no retry, just a distinct, honest message for this specific case.
    if (isConnectionTimeoutError(error)) {
      return sayAndHangupTwiml("We're sorry, please try your call again in a moment.");
    }

    return sayAndHangupTwiml("We're experiencing a technical issue. Please try again later.");
  }
}
