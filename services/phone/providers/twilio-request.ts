/** Parses Twilio's application/x-www-form-urlencoded webhook body. */
export async function parseTwilioParams(request: Request): Promise<Record<string, string>> {
  const raw = await request.text();
  return Object.fromEntries(new URLSearchParams(raw));
}
