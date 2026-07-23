import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

/**
 * Hit on a schedule by an external scheduler (see ENVIRONMENT.md) to keep
 * Neon's compute from suspending due to inactivity — Vercel's own Cron
 * Jobs can't run more often than once/day on the Hobby plan, which isn't
 * frequent enough to prevent Neon's ~5 minute idle autosuspend. Runs a
 * trivial query, nothing else; the fast-fail connectionTimeoutMillis in
 * lib/db/client.ts is the safety net for whenever this still isn't enough
 * (network blips, the external scheduler itself failing/pausing).
 */
export async function GET(request: Request) {
  const secret = request.headers.get("x-keep-alive-secret");

  if (!env.KEEP_ALIVE_SECRET || secret !== env.KEEP_ALIVE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    logger.error("keep_alive.failed", {
      message: error instanceof Error ? error.message : "unknown error",
    });
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
