import { prisma } from "@/lib/db/client";
import type { Prisma } from "@/lib/db/generated/client";
import type { NewCallParams, CompleteCallParams, UpdateConversationStateParams } from "./types";

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
      ...(params.conversationState !== undefined
        ? { conversationState: params.conversationState as Prisma.InputJsonValue }
        : {}),
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

/**
 * Loads a call (including its live conversation turn history) by the
 * provider's own call id. Includes the company relation since the live
 * conversation loop needs the company name for prompt assembly.
 */
export function findCallByProviderCallId(providerCallId: string) {
  return prisma.call.findUnique({
    where: { providerCallId },
    include: { company: true },
  });
}

/** Persists the updated turn history for the live conversation loop. */
export function updateConversationState(params: UpdateConversationStateParams) {
  return prisma.call.updateMany({
    where: { providerCallId: params.providerCallId },
    data: { conversationState: params.conversationState as Prisma.InputJsonValue },
  });
}
