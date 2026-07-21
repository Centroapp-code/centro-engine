import { NextResponse, after } from "next/server";
import { completeCallRecord, findCallByProviderCallId } from "@/services/phone";
import {
  getPublicRequestUrl,
  parseTwilioParams,
  verifyTwilioSignature,
} from "@/services/phone/providers";
import {
  analyzeCall,
  getActiveAgent,
  getIndustryProfile,
  saveCallAnalysis,
  type ConversationState,
} from "@/services/ai";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

// A single call can generate several status callbacks (initiated, ringing,
// answered, completed), and Twilio retries this callback on failed delivery
// — both count against the same shared pool of Twilio source IPs. Kept
// generous so normal volume, including retries, never plausibly trips it;
// a 429 here just tells Twilio to back off, which is how its own retry
// schedule is designed to be used, not something that breaks it.
const RATE_LIMIT = { limit: 120, windowMs: 60_000 };

function parseConversationState(value: unknown): ConversationState {
  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { messages?: unknown }).messages)
  ) {
    return value as ConversationState;
  }
  return { messages: [] };
}

/**
 * Runs post-call analysis and persists the result. Called from an after()
 * callback below, so it executes once the 204 has already been sent to
 * Twilio — a slow or failed OpenAI call here can never delay or break the
 * status callback itself.
 */
async function runPostCallAnalysis(callSid: string) {
  const call = await findCallByProviderCallId(callSid);

  if (!call) {
    logger.warn("twilio.call_status.analysis_call_not_found", { callSid });
    return;
  }

  const conversation = parseConversationState(call.conversationState);

  // A call that rang and ended before the caller ever said anything (e.g.
  // it dropped during the very first Gather) still has a Call row with
  // just the greeting in its conversationState — no actual conversation
  // to analyze. Skip rather than spend an OpenAI call on nothing.
  const hasConversation = conversation.messages.some((message) => message.role === "user");

  if (!hasConversation) {
    logger.info("twilio.call_status.no_conversation_to_analyze", {
      callSid,
      companyId: call.companyId,
    });
    return;
  }

  const [agent, industryProfile] = await Promise.all([
    getActiveAgent(call.companyId),
    getIndustryProfile(call.companyId),
  ]);

  if (!agent) {
    logger.warn("twilio.call_status.analysis_no_active_agent", {
      callSid,
      companyId: call.companyId,
    });
    return;
  }

  const analysis = await analyzeCall({
    companyName: call.company.name,
    agent,
    industryProfile,
    conversation,
    callerPhone: call.callerPhone,
  });

  await saveCallAnalysis({ callId: call.id, companyId: call.companyId, analysis });

  logger.info("twilio.call_status.analysis_completed", {
    callSid,
    companyId: call.companyId,
    opportunityScore: analysis.opportunityScore,
  });
}

export async function POST(request: Request) {
  if (!checkRateLimit({ route: "twilio_call_status", request, ...RATE_LIMIT })) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const params = await parseTwilioParams(request);
  const signature = request.headers.get("x-twilio-signature");

  if (!verifyTwilioSignature({ signature, url: getPublicRequestUrl(request), params })) {
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

  const callSid = params.CallSid;
  after(async () => {
    try {
      await runPostCallAnalysis(callSid);
    } catch (error) {
      logger.error("twilio.call_status.analysis_failed", {
        callSid,
        message: error instanceof Error ? error.message : "unknown error",
      });
    }
  });

  return new NextResponse(null, { status: 204 });
}
