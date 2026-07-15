import { prisma } from "@/lib/db/client";

/** Identifies which company a Centro phone number belongs to. */
export async function findCompanyByPhoneNumber(phoneNumber: string) {
  const integration = await prisma.phoneIntegration.findUnique({
    where: { phoneNumber },
    include: { company: true },
  });

  return integration?.company ?? null;
}
