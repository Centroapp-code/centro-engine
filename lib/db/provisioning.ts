import { prisma } from "@/lib/db/client";
import { DEFAULT_ROLE } from "@/lib/auth/roles";

type ClerkIdentity = {
  clerkId: string;
  email: string;
};

function defaultCompanyName(email: string): string {
  const domain = email.split("@")[1] ?? "";
  const label = domain.split(".")[0];
  return label ? `${label[0].toUpperCase()}${label.slice(1)}` : "My Company";
}

/**
 * Ensures a Prisma User exists for this Clerk identity and belongs to at
 * least one Company. Safe to call on every sign-in: upserts the user by
 * clerkId, and only creates a Company/CompanyMember the first time one
 * doesn't already exist.
 */
export async function ensureUserWithCompany({ clerkId, email }: ClerkIdentity) {
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: { email },
    create: { clerkId, email, role: DEFAULT_ROLE },
    include: { companyMemberships: { include: { company: true } } },
  });

  if (user.companyMemberships.length > 0) {
    return user;
  }

  const membership = await prisma.$transaction(async (tx) => {
    const existing = await tx.companyMember.findFirst({
      where: { userId: user.id },
      include: { company: true },
    });
    if (existing) {
      return existing;
    }

    const company = await tx.company.create({
      data: { name: defaultCompanyName(email) },
    });

    return tx.companyMember.create({
      data: { userId: user.id, companyId: company.id },
      include: { company: true },
    });
  });

  return { ...user, companyMemberships: [membership] };
}
