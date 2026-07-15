import { NextResponse } from "next/server";
import twilio from "twilio";
import {
  getPhoneProvider,
  findCompanyByPhoneNumber,
  createCallRecord,
} from "@/services/phone";
import { parseTwilioParams, verifyTwilioSignature } from "@/services/phone/providers";
import { getActiveAgent, startConversation } from "@/services/ai";

function twiml(response: InstanceType<typeof twilio.twiml.VoiceResponse>) {
  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(request: Request) {
  const params = await parseTwilioParams(request);
  const signature = request.headers.get("x-twilio-signature");

  if (!verifyTwilioSignature({ signature, url: request.url, params })) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const response = new twilio.twiml.VoiceResponse();

  // 1. Identify company — Centro never replaces a company's own phone
  // system, so every incoming call must map to a company via the Centro
  // number their phone menu forwarded it to.
  const provider = getPhoneProvider("TWILIO");
  const incoming = await provider.receiveCall(params);
  const company = await findCompanyByPhoneNumber(incoming.to);

  if (!company) {
    response.say("This number is not configured. Goodbye.");
    response.hangup();
    return twiml(response);
  }

  // 2. Load AI agent configuration
  const agent = await getActiveAgent(company.id);

  if (!agent) {
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

  response.say(turn.message);

  return twiml(response);
}
