import { prisma } from "@/lib/db/client";
import type { NewCallParams, CompleteCallParams } from "./types";

/**
 * Persists call information. Separate from PhoneProvider because storage is
 * Centro's own concern, not something a phone provider does.
 */
export function createCallRecord(params: NewCallParams) {
  return prisma.call.create({
    data: {
      companyId: params.companyId,
      providerCallId: params.providerCallId,
      callerPhone: params.callerPhone,
    },
  });
}

/** Fills in the outcome of a call once the provider reports it as complete. */
export function completeCallRecord(params: CompleteCallParams) {
  return prisma.call.updateMany({
    where: { providerCallId: params.providerCallId },
    data: { duration: params.duration },
  });
}
