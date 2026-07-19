import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/client";
import { defaultCompanyName } from "@/lib/db/provisioning";
import type { Company } from "@/lib/db/generated/client";

function hasPopulatedOnboardingFields(company: Company): boolean {
  return Boolean(
    company.industry ||
      company.companySize ||
      company.salesTeamSize ||
      company.primaryGoal ||
      company.priorities ||
      company.targetCustomer ||
      company.notes
  );
}

/**
 * Grandfathers companies with meaningful setup data that predates onboarding
 * tracking (e.g. configured through Settings before this feature existed, or
 * created directly in the database) so they aren't forced through the
 * wizard. Only genuinely new, unconfigured companies see onboarding.
 *
 * Company scoped: only ever reads/writes the caller's own company and user
 * row, both already resolved by the authenticated caller.
 */
export async function resolveOnboardingCompleted({
  clerkId,
  userId,
  onboardingCompleted,
  email,
  company,
}: {
  clerkId: string;
  userId: string;
  onboardingCompleted: boolean;
  email: string;
  company: Company;
}): Promise<boolean> {
  if (onboardingCompleted) {
    return true;
  }

  const hasCustomName = company.name !== defaultCompanyName(email);
  const hasAgent = (await prisma.aIAgent.findUnique({ where: { companyId: company.id } })) !== null;
  const hasFields = hasPopulatedOnboardingFields(company);

  if (!hasCustomName && !hasAgent && !hasFields) {
    return false;
  }

  await prisma.user.update({ where: { id: userId }, data: { onboardingCompleted: true } });

  const client = await clerkClient();
  await client.users.updateUserMetadata(clerkId, {
    publicMetadata: { onboardingCompleted: true },
  });

  return true;
}
