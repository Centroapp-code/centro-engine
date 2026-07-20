import { NextResponse } from "next/server";
import { completeCallRecord } from "@/services/phone";
import { parseTwilioParams, verifyTwilioSignature } from "@/services/phone/providers";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

// A single call can generate several status callbacks (initiated, ringing,
// answered, completed), and Twilio retries this callback on failed delivery
// — both count against the same shared pool of Twilio source IPs. Kept
// generous so normal volume, including retries, never plausibly trips it;
// a 429 here just tells Twilio to back off, which is how its own retry
// schedule is designed to be used, not something that breaks it.
const RATE_LIMIT = { limit: 120, windowMs: 60_000 };

export async function POST(request: Request) {
  if (!checkRateLimit({ route: "twilio_call_status", request, ...RATE_LIMIT })) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const params = await parseTwilioParams(request);
  const signature = request.headers.get("x-twilio-signature");

  if (!verifyTwilioSignature({ signature, url: request.url, params })) {
    logger.warn("twilio.call_status.invalid_signature");
    return new NextResponse("Invalid signature", { status: 403 });
  }

  if (!params.CallSid) {
    logger.warn("twilio.call_status.missing_call_sid");
    return new NextResponse(null, { status: 204 });
  }

  if (params.CallStatus !== "completed") {
    return new NextResponse(null, { status: 204 });
  }

  const parsedDuration = params.CallDuration ? Number.parseInt(params.CallDuration, 10) : 0;
  const duration = Number.isFinite(parsedDuration) && parsedDuration >= 0 ? parsedDuration : 0;

  try {
    const result = await completeCallRecord({
      providerCallId: params.CallSid,
      duration,
    });

    if (result.count === 0) {
      // Not necessarily an error — e.g. the status callback could in
      // principle race the incoming-call webhook's own DB write — but
      // silently dropping it entirely would hide a real data gap.
      logger.warn("twilio.call_status.no_matching_call", { callSid: params.CallSid });
    } else {
      logger.info("twilio.call_status.completed", { callSid: params.CallSid });
    }
  } catch (error) {
    logger.error("twilio.call_status.failed", {
      callSid: params.CallSid,
      message: error instanceof Error ? error.message : "unknown error",
    });
    // Still 204 — Twilio doesn't read this response's body, and there's no
    // useful instruction to give it back for a status callback.
  }

  return new NextResponse(null, { status: 204 });
}
