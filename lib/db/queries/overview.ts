import { prisma } from "@/lib/db/client";

export type OverviewStats = {
  totalCalls: number;
  qualifiedOpportunities: number;
  highPriorityOpportunities: number;
  avgOpportunityScore: number | null;
};

export async function getOverviewStats(companyId: string): Promise<OverviewStats> {
  const [totalCalls, qualifiedOpportunities, highPriorityOpportunities, scoreAggregate] =
    await Promise.all([
      prisma.call.count({ where: { companyId } }),
      prisma.opportunity.count({ where: { companyId, status: "QUALIFIED" } }),
      prisma.opportunity.count({ where: { companyId, priority: "HIGH" } }),
      prisma.opportunity.aggregate({
        where: { companyId, score: { not: null } },
        _avg: { score: true },
      }),
    ]);

  return {
    totalCalls,
    qualifiedOpportunities,
    highPriorityOpportunities,
    avgOpportunityScore:
      scoreAggregate._avg.score !== null
        ? Math.round(scoreAggregate._avg.score)
        : null,
  };
}

export type OverviewRecentCall = {
  id: string;
  callerName: string | null;
  summary: string | null;
  date: string;
};

export async function getRecentCalls(
  companyId: string,
  limit = 3
): Promise<OverviewRecentCall[]> {
  const calls = await prisma.call.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { analysis: true },
  });

  return calls.map((call) => ({
    id: call.id,
    callerName: call.callerName,
    summary: call.analysis?.summary ?? null,
    date: call.createdAt.toISOString(),
  }));
}

export type OverviewActivityItem = {
  id: string;
  type: "call" | "opportunity";
  message: string;
  timestamp: string;
};

function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export async function getRecentActivity(
  companyId: string,
  limit = 5
): Promise<OverviewActivityItem[]> {
  const [calls, opportunities] = await Promise.all([
    prisma.call.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.opportunity.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);

  const callActivity: OverviewActivityItem[] = calls.map((call) => ({
    id: `call_${call.id}`,
    type: "call",
    message: `Call answered from ${call.callerPhone}${
      call.callerName ? ` (${call.callerName})` : ""
    }`,
    timestamp: call.createdAt.toISOString(),
  }));

  const opportunityActivity: OverviewActivityItem[] = opportunities.map((opportunity) => ({
    id: `opportunity_${opportunity.id}`,
    type: "opportunity",
    message:
      opportunity.score !== null
        ? `${opportunity.name ?? "New opportunity"} scored ${opportunity.score} — marked ${titleCase(opportunity.status)}`
        : `${opportunity.name ?? "New opportunity"} captured as a new opportunity`,
    timestamp: opportunity.createdAt.toISOString(),
  }));

  return [...callActivity, ...opportunityActivity]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
