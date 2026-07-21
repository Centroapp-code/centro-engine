import { NextResponse } from "next/server";
import { findCallByProviderCallId, updateConversationState } from "@/services/phone";
import {
  getPublicRequestUrl,
  parseTwilioParams,
  sayAndGatherTwiml,
  sayAndHangupTwiml,
  verifyTwilioSignature,
} from "@/services/phone/providers";
import {
  continueConversation,
  getActiveAgent,
  getIndustryProfile,
  type ConversationState,
} from "@/services/ai";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

// Same shared pool of Twilio source IPs as the other webhooks, but one call
// generates several of these — one per conversation turn — so this stays
// generous enough that a normal multi-turn call never plausibly trips it,
// while still blunting a direct flood against this public endpoint.
const RATE_LIMIT = { limit: 120, windowMs: 60_000 };

// Hard cap on conversation length: bounds both OpenAI cost and how long a
// real caller can be kept on the phone, even if the model never produces
// its own [[END_CALL]] signal.
const MAX_TURNS = 10;

// How long we'll wait on a single OpenAI turn before treating it as failed.
// A ~700-950 token system prompt plus growing turn history means occasional
// p95/p99 completions legitimately take this long even under normal load —
// this is a realistic ceiling, not just a generous guess, and still leaves
// headroom under Twilio's own ~15s webhook timeout.
const OPENAI_TIMEOUT_MS = 10_000;

// After this many consecutive OpenAI failures on the same call, stop
// retrying and end the call gracefully instead of looping forever.
const MAX_CONSECUTIVE_FAILURES = 2;

const MAX_TURNS_CLOSING_MESSAGE =
  "Thank you for all of that information. I have what I need for now, and someone from our team will follow up if it's relevant. Have a great day!";

const OPENAI_RETRY_MESSAGE =
  "I'm sorry, I'm having trouble right now — let me just take a message. Please go ahead.";

const OPENAI_HANGUP_MESSAGE =
  "I'm sorry, we're experiencing a technical issue on our end. Someone from our team will follow up. Goodbye.";

/** conversationState also carries route-level bookkeeping (failure streak) alongside the turn history conversation.ts owns. */
type StoredConversationState = ConversationState & {
  consecutiveFailures?: number;
};

function parseStoredState(value: unknown): StoredConversationState {
  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { messages?: unknown }).messages)
  ) {
    return value as StoredConversationState;
  }
  return { messages: [] };
}

export async function POST(request: Request) {
  if (!checkRateLimit({ route: "twilio_gather", request, ...RATE_LIMIT })) {
    return sayAndHangupTwiml("We're unable to process this call right now. Please try again shortly.");
  }

  const params = await parseTwilioParams(request);
  const signature = request.headers.get("x-twilio-signature");

  if (!verifyTwilioSignature({ signature, url: getPublicRequestUrl(request), params })) {
    logger.warn("twilio.gather.invalid_signature");
    return new NextResponse("Invalid signature", { status: 403 });
  }

  if (!params.CallSid) {
    logger.warn("twilio.gather.missing_call_sid");
    return sayAndHangupTwiml("We're unable to process this call right now. Goodbye.");
  }

  try {
    const call = await findCallByProviderCallId(params.CallSid);

    if (!call) {
      logger.warn("twilio.gather.call_not_found", { callSid: params.CallSid });
      return sayAndHangupTwiml("We're unable to continue this call. Goodbye.");
    }

    // Independent reads, both keyed only on call.companyId — run in
    // parallel rather than as two sequential round trips.
    const [agent, industryProfile] = await Promise.all([
      getActiveAgent(call.companyId),
      getIndustryProfile(call.companyId),
    ]);

    if (!agent) {
      logger.warn("twilio.gather.no_active_agent", {
        callSid: params.CallSid,
        companyId: call.companyId,
      });
      return sayAndHangupTwiml("No agent is currently available to continue this call. Goodbye.");
    }
    const stored = parseStoredState(call.conversationState);

    const speech = params.SpeechResult?.trim();
    const confidence = params.Confidence ? Number.parseFloat(params.Confidence) : null;

    // Metadata only — never the SpeechResult text itself, per the "no call
    // transcripts in logs" rule in lib/logger.ts. Logged unconditionally
    // (including the empty case, previously not logged at all) so a
    // Twilio speech-detection miss is diagnosable from logs going forward.
    logger.info("twilio.gather.speech_received", {
      callSid: params.CallSid,
      companyId: call.companyId,
      hasSpeech: Boolean(speech),
      speechLength: speech?.length ?? 0,
      confidence: confidence !== null && Number.isFinite(confidence) ? confidence : null,
    });

    if (!speech) {
      // Gather completed with no usable speech — don't spend an OpenAI call
      // on nothing, just ask the caller to repeat themselves.
      return sayAndGatherTwiml("I'm sorry, I didn't catch that — could you repeat that?");
    }

    const turnsSoFar = stored.messages.filter((message) => message.role === "user").length;

    if (turnsSoFar + 1 > MAX_TURNS) {
      const nextState: StoredConversationState = {
        messages: [
          ...stored.messages,
          { role: "user", content: speech },
          { role: "assistant", content: MAX_TURNS_CLOSING_MESSAGE },
        ],
        consecutiveFailures: 0,
      };
      await updateConversationState({ providerCallId: params.CallSid, conversationState: nextState });

      logger.info("twilio.gather.max_turns_reached", {
        callSid: params.CallSid,
        companyId: call.companyId,
      });

      return sayAndHangupTwiml(MAX_TURNS_CLOSING_MESSAGE);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

    try {
      const turn = await continueConversation({
        companyName: call.company.name,
        agent,
        industryProfile,
        state: { messages: stored.messages },
        callerSpeech: speech,
        signal: controller.signal,
      });

      const nextState: StoredConversationState = { ...turn.state, consecutiveFailures: 0 };
      await updateConversationState({ providerCallId: params.CallSid, conversationState: nextState });

      logger.info("twilio.gather.turn_completed", {
        callSid: params.CallSid,
        companyId: call.companyId,
        done: turn.done,
      });

      return turn.done ? sayAndHangupTwiml(turn.message) : sayAndGatherTwiml(turn.message);
    } catch (error) {
      const consecutiveFailures = (stored.consecutiveFailures ?? 0) + 1;
      const nextState: StoredConversationState = {
        messages: [
          ...stored.messages,
          { role: "user", content: speech },
          {
            role: "assistant",
            content: consecutiveFailures >= MAX_CONSECUTIVE_FAILURES ? OPENAI_HANGUP_MESSAGE : OPENAI_RETRY_MESSAGE,
          },
        ],
        consecutiveFailures,
      };
      await updateConversationState({ providerCallId: params.CallSid, conversationState: nextState });

      logger.error("twilio.gather.openai_failed", {
        callSid: params.CallSid,
        companyId: call.companyId,
        consecutiveFailures,
        aborted: error instanceof Error && error.name === "AbortError",
        message: error instanceof Error ? error.message : "unknown error",
      });

      return consecutiveFailures >= MAX_CONSECUTIVE_FAILURES
        ? sayAndHangupTwiml(OPENAI_HANGUP_MESSAGE)
        : sayAndGatherTwiml(OPENAI_RETRY_MESSAGE);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    logger.error("twilio.gather.failed", {
      callSid: params.CallSid,
      message: error instanceof Error ? error.message : "unknown error",
    });
    return sayAndHangupTwiml("We're experiencing a technical issue. Please try again later.");
  }
}
