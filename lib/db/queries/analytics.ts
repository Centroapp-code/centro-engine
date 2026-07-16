import { prisma } from "@/lib/db/client";
import type { OpportunityStatus } from "@/lib/db/generated/enums";

const CALL_VOLUME_WINDOW_DAYS = 7;

export type DailyCallVolume = {
  date: string;
  count: number;
};

/** Inbound call counts per day for the trailing window, zero-filled for days with no calls. */
export async function getCallVolume(companyId: string): Promise<DailyCallVolume[]> {
  const start = new Date();
  start.setDate(start.getDate() - (CALL_VOLUME_WINDOW_DAYS - 1));
  start.setHours(0, 0, 0, 0);

  const calls = await prisma.call.findMany({
    where: { companyId, createdAt: { gte: start } },
    select: { createdAt: true },
  });

  const counts = new Map<string, number>();
  for (let i = 0; i < CALL_VOLUME_WINDOW_DAYS; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    counts.set(day.toISOString().slice(0, 10), 0);
  }

  for (const call of calls) {
    const key = call.createdAt.toISOString().slice(0, 10);
    if (counts.has(key)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}

export type OpportunityStatusCount = {
  status: OpportunityStatus;
  count: number;
};

const STATUS_ORDER: OpportunityStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

/** Opportunity counts per pipeline status, in a fixed funnel display order. */
export async function getOpportunityStatusCounts(
  companyId: string
): Promise<OpportunityStatusCount[]> {
  const grouped = await prisma.opportunity.groupBy({
    by: ["status"],
    where: { companyId },
    _count: { _all: true },
  });

  const countsByStatus = new Map(grouped.map((group) => [group.status, group._count._all]));

  return STATUS_ORDER.map((status) => ({
    status,
    count: countsByStatus.get(status) ?? 0,
  }));
}
