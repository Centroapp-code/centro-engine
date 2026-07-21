/** Parses Twilio's application/x-www-form-urlencoded webhook body. */
export async function parseTwilioParams(request: Request): Promise<Record<string, string>> {
  const raw = await request.text();
  return Object.fromEntries(new URLSearchParams(raw));
}

/**
 * Reconstructs the public-facing URL Twilio actually called, for use with
 * verifyTwilioSignature. `request.url` reflects whatever URL the app
 * server sees internally, which behind any reverse proxy (ngrok locally,
 * Vercel's edge network in production) is not the same URL Twilio signed
 * — that mismatch fails every signature check even with a correct auth
 * token. `x-forwarded-proto`/`x-forwarded-host` are the standard headers
 * both ngrok and Vercel set to the original public request, so they're
 * used here instead of trusting request.url's own scheme/host. Falls back
 * to the plain `host` header, then to request.url itself, so this still
 * behaves sanely if a request ever arrives with no forwarding headers set.
 */
export function getPublicRequestUrl(request: Request): string {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  const url = new URL(request.url);
  if (forwardedProto) url.protocol = `${forwardedProto.split(",")[0].trim()}:`;
  if (forwardedHost) url.host = forwardedHost.split(",")[0].trim();

  return url.toString();
}
