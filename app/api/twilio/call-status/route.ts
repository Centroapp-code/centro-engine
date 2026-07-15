import { NextResponse } from "next/server";
import { completeCallRecord } from "@/services/phone";
import { parseTwilioParams, verifyTwilioSignature } from "@/services/phone/providers";

export async function POST(request: Request) {
  const params = await parseTwilioParams(request);
  const signature = request.headers.get("x-twilio-signature");

  if (!verifyTwilioSignature({ signature, url: request.url, params })) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  if (params.CallStatus === "completed" && params.CallSid) {
    await completeCallRecord({
      providerCallId: params.CallSid,
      duration: params.CallDuration ? parseInt(params.CallDuration, 10) : 0,
    });
  }

  return new NextResponse(null, { status: 204 });
}
