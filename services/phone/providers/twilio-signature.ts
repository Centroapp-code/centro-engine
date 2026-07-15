import twilio from "twilio";

/**
 * Verifies a webhook request actually came from Twilio, using the
 * X-Twilio-Signature header and TWILIO_AUTH_TOKEN. Both webhook routes must
 * call this before acting on the request body.
 */
export function verifyTwilioSignature({
  signature,
  url,
  params,
}: {
  signature: string | null;
  url: string;
  params: Record<string, string>;
}): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken || !signature) {
    return false;
  }
  return twilio.validateRequest(authToken, signature, url, params);
}
