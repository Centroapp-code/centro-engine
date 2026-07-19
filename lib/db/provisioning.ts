import { prisma } from "@/lib/db/client";
import { Prisma } from "@/lib/db/generated/client";
import { DEFAULT_ROLE } from "@/lib/auth/roles";

type ClerkIdentity = {
  clerkId: string;
  email: string;
};

export function defaultCompanyName(email: string): string {
  const domain = email.split("@")[1] ?? "";
  const label = domain.split(".")[0];
  return label ? `${label[0].toUpperCase()}${label.slice(1)}` : "My Company";
}

const userWithCompanies = {
  include: { companyMemberships: { include: { company: true } } },
} as const;

/**
 * Upserts the User row by clerkId. Two truly concurrent first-time calls
 * for the same brand-new clerkId (e.g. the Clerk webhook and the first
 * dashboard visit) can both attempt the create branch; the loser re-reads
 * the winner's row instead of surfacing a spurious unique-constraint error.
 */
async function upsertUser({ clerkId, email }: ClerkIdentity) {
  try {
    return await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: { clerkId, email, role: DEFAULT_ROLE },
      ...userWithCompanies,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return prisma.user.findUniqueOrThrow({ where: { clerkId }, ...userWithCompanies });
    }
    throw error;
  }
}

/**
 * Ensures a Prisma User exists for this Clerk identity and belongs to at
 * least one Company. Safe to call on every sign-in: upserts the user by
 * clerkId, and only creates a Company/CompanyMember the first time one
 * doesn't already exist.
 */
export async function ensureUserWithCompany({ clerkId, email }: ClerkIdentity) {
  const user = await upsertUser({ clerkId, email });

  if (user.companyMemberships.length > 0) {
    return user;
  }

  const membership = await prisma.$transaction(async (tx) => {
    // Serializes concurrent first-time provisioning for the same user (e.g.
    // the Clerk webhook and the first dashboard visit racing each other) so
    // only one of them creates the default company. The lock is
    // transaction-scoped and releases automatically on commit/rollback.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${user.id}))`;

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
