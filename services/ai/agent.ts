import { prisma } from "@/lib/db/client";

/** Loads the active AI agent configuration for a company. */
export function getActiveAgent(companyId: string) {
  return prisma.aIAgent.findFirst({ where: { companyId, active: true } });
}

/** Loads a company's industry configuration, if it's completed onboarding. */
export function getIndustryProfile(companyId: string) {
  return prisma.industryProfile.findUnique({ where: { companyId } });
}
