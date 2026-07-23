import "server-only";

const REQUIRED_KEYS = [
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SECRET",
] as const;

// Not required yet — Twilio/OpenAI integration hasn't started. Typed as
// `string | undefined` so calling code is forced to handle their absence
// until that work begins; nothing here makes them mandatory.
const OPTIONAL_KEYS = [
  "OPENAI_API_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "KEEP_ALIVE_SECRET",
] as const;

type RequiredKey = (typeof REQUIRED_KEYS)[number];
type OptionalKey = (typeof OPTIONAL_KEYS)[number];

export type Env = Record<RequiredKey, string> & Partial<Record<OptionalKey, string>>;

/**
 * Typed, centralized access to server-only environment variables. Reading
 * this module never throws by itself — required keys are cast to `string`
 * because validateEnv() (below) is guaranteed to have already run by the
 * time any request handler executes (see instrumentation.ts). This keeps
 * `next build`'s static route analysis working even when a variable is
 * genuinely absent locally: the module can still be imported everywhere it
 * needs to be, since nothing here actually reads process.env at values a
 * route's top-level module code depends on for compiling — only inside
 * request-time function bodies, by which point validation has run.
 *
 * Server-only (enforced by the `server-only` import above — importing this
 * from a "use client" component fails the build): these are secrets or DB
 * credentials that must never reach the browser bundle.
 */
export const env: Env = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY as string,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || undefined,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || undefined,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || undefined,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || undefined,
  KEEP_ALIVE_SECRET: process.env.KEEP_ALIVE_SECRET || undefined,
};

/**
 * Throws if any required environment variable is missing. Called once, at
 * server startup, from instrumentation.ts — never at module import time —
 * so a missing variable fails the deployment loudly and immediately,
 * instead of surfacing later as a confusing error deep inside Prisma,
 * Clerk, or a webhook handler.
 */
export function validateEnv(): void {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Set them in .env for local development, or in your deployment " +
        "platform's environment variables for production. See ENVIRONMENT.md."
    );
  }
}
