import { NextResponse } from "next/server";
import twilio from "twilio";

/** Where every "keep the conversation going" TwiML response points Twilio next. */
export const GATHER_ACTION_PATH = "/api/twilio/gather";

// A single voice for every <Say> in the app, so Centro sounds consistent
// across every TwiML response. Neural voices sound materially more natural
// than Twilio's default (non-neural) voice — worth the switch for anything
// a real caller hears.
const SAY_VOICE = "Polly.Joanna-Neural";

export function twimlResponse(response: InstanceType<typeof twilio.twiml.VoiceResponse>) {
  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

/**
 * <Say>message</Say> followed by <Hangup/>. Used for both a natural,
 * successful end of call and an unrecoverable error — a live caller should
 * never get a raw error page or dead air either way.
 */
export function sayAndHangupTwiml(message: string) {
  const response = new twilio.twiml.VoiceResponse();
  response.say({ voice: SAY_VOICE }, message);
  response.hangup();
  return twimlResponse(response);
}

function gatherAttributes() {
  return {
    input: ["speech" as const],
    action: GATHER_ACTION_PATH,
    method: "POST" as const,
    // How long to wait for the caller to start speaking at all before
    // giving up (Twilio's own default is 5s), and speechTimeout: "auto"
    // for Twilio's adaptive end-of-speech detection.
    timeout: 7,
    speechTimeout: "auto" as const,
  };
}

/**
 * <Say>message</Say> inside a <Gather> that posts the caller's next reply
 * to GATHER_ACTION_PATH. A Gather-level "no response" (Twilio detects no
 * speech at all — whether genuine silence or its speech recognizer simply
 * failing to produce a usable result) never reaches our server at all, so
 * it can't be retried from route code; it has to be handled here, in the
 * TwiML itself. So a failed first Gather falls through to a second Gather
 * with a rephrased prompt rather than hanging up immediately — only a
 * second consecutive miss falls through to the goodbye line and <Hangup/>.
 * This mirrors the OpenAI-failure "two strikes" guardrail in the gather
 * route, but for this separate, Twilio-side failure mode.
 */
export function sayAndGatherTwiml(message: string) {
  const response = new twilio.twiml.VoiceResponse();

  const gather = response.gather(gatherAttributes());
  gather.say({ voice: SAY_VOICE }, message);

  const retryGather = response.gather(gatherAttributes());
  retryGather.say({ voice: SAY_VOICE }, "Sorry, I didn't catch that — could you repeat that?");

  response.say({ voice: SAY_VOICE }, "We didn't receive a response. Goodbye.");
  response.hangup();
  return twimlResponse(response);
}
