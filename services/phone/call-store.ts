import { prisma } from "@/lib/db/client";
import type { CallRecord } from "./types";

/**
 * Persists call information. Separate from PhoneProvider because storage is
 * Centro's own concern, not something a phone provider does.
 */
export function storeCallInfo(record: CallRecord) {
  return prisma.call.create({
    data: {
      companyId: record.companyId,
      callerPhone: record.callerPhone,
      callerName: record.callerName,
      duration: record.duration,
      transcript: record.transcript,
      summary: record.summary,
    },
  });
}
