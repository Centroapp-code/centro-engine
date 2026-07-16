import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import type { Company } from "@/lib/db/generated/client";
import { ensureUserWithCompany } from "@/lib/db/provisioning";

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
 * Requires an authenticated user with a company, redirecting to sign-in
 * otherwise. Use in customer dashboard server components/layouts.
 */
export async function requireCustomerCompany(): Promise<Company> {
  const company = await getCurrentCompany();
  if (!company) {
    redirect("/sign-in");
  }
  return company;
}
