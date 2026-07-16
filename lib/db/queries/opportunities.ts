import { prisma } from "@/lib/db/client";
import type { OpportunityPriority, OpportunityStatus } from "@/lib/db/generated/enums";

export type OpportunityListItem = {
  id: string;
  name: string | null;
  score: number | null;
  priority: OpportunityPriority;
  status: OpportunityStatus;
  recommendedAction: string | null;
  createdAt: string;
};

export async function getCompanyOpportunities(
  companyId: string
): Promise<OpportunityListItem[]> {
  const opportunities = await prisma.opportunity.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });

  return opportunities.map((opportunity) => ({
    id: opportunity.id,
    name: opportunity.name,
    score: opportunity.score,
    priority: opportunity.priority,
    status: opportunity.status,
    recommendedAction: opportunity.recommendedAction,
    createdAt: opportunity.createdAt.toISOString(),
  }));
}
