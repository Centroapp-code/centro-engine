/**
 * Minimal structured logging — JSON lines to stdout/stderr, no dependency.
 * Callers are responsible for only passing safe fields: no secrets, no
 * phone numbers, no emails, no call transcripts. Prefer opaque identifiers
 * (Call SID, internal company/user IDs) for correlation instead.
 */
type LogFields = Record<string, string | number | boolean | null | undefined>;

function write(level: "info" | "warn" | "error", event: string, fields?: LogFields) {
  const line = JSON.stringify({ level, event, time: new Date().toISOString(), ...fields });
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (event: string, fields?: LogFields) => write("info", event, fields),
  warn: (event: string, fields?: LogFields) => write("warn", event, fields),
  error: (event: string, fields?: LogFields) => write("error", event, fields),
};
