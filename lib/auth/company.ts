import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import type { Company } from "@/lib/db/generated/client";
import { ensureUserWithCompany } from "@/lib/db/provisioning";
import { resolveOnboardingCompleted } from "@/lib/db/onboarding-status";

/**
 * The signed-in user's Prisma record, provisioning it (and a default
 * Company/CompanyMember, if none exists yet) on first access. Returns null
 * when signed out.
 */
export async function getCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return null;
  }

  return ensureUserWithCompany({ clerkId: clerkUser.id, email });
}

/** The signed-in user's first company, or null if signed out. */
export async function getCurrentCompany(): Promise<Company | null> {
  const user = await getCurrentUser();
  return user?.companyMemberships[0]?.company ?? null;
}

/**
 * Requires an authenticated user with a company AND completed onboarding.
 * The database (User.onboardingCompleted, checked via
 * resolveOnboardingCompleted) is the sole source of truth for the
 * onboarding decision — this never depends on Clerk session claims, so it's
 * correct on the very first request after completion, with no propagation
 * delay to reason about.
 *
 * Use in customer dashboard server components/pages only. Do NOT use this
 * from the onboarding flow itself (the onboarding page or its completion
 * server action) — onboarding isn't finished yet while those run, so this
 * would immediately redirect back to /onboarding before it can ever
 * complete. Use getCurrentUser()/getCurrentCompany() there instead.
 */
export async function requireCustomerCompany(): Promise<Company> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const company = user.companyMemberships[0]?.company;
  if (!company) {
    // Shouldn't happen — ensureUserWithCompany() guarantees a company — but
    // fail safe to sign-in rather than rendering with no company to scope to.
    redirect("/sign-in");
  }

  const completed = await resolveOnboardingCompleted({
    clerkId: user.clerkId,
    userId: user.id,
    onboardingCompleted: user.onboardingCompleted,
    email: user.email,
    company,
  });

  if (!completed) {
    redirect("/onboarding");
  }

  return company;
}
