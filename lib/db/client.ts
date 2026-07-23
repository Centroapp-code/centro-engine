import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import { env } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Neon's serverless compute can suspend after inactivity and take an
// unpredictable amount of time to resume (a real incident: a cold compute
// once took 75+ seconds to accept a connection, and Twilio's own webhook
// timeout is ~15s). Without an explicit timeout, `pg` waits indefinitely
// (its own default is 0 — no timeout) for a connection, which can leave a
// live caller in dead air well past Twilio's own patience. Bounding this to
// 5s makes a slow/suspended compute fail fast and predictably instead —
// callers of prisma should catch this and respond gracefully rather than
// retry (see isConnectionTimeoutError below and its usage in the Twilio
// webhook routes). A keep-alive ping (see app/api/internal/keep-alive)
// is the primary defense against hitting this at all; this timeout is the
// safety net for when that still isn't enough (network blips, the
// keep-alive scheduler itself failing/pausing, etc).
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** True if `error` is a Prisma error caused by the connectionTimeoutMillis above expiring. */
export function isConnectionTimeoutError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ETIMEDOUT"
  );
}
