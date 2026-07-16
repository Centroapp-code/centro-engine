import { prisma } from "@/lib/db/client";

export type CallListItem = {
  id: string;
  callerName: string | null;
  callerPhone: string;
  date: string;
  duration: number | null;
  summary: string | null;
  transcript: string | null;
};

export async function getCompanyCalls(companyId: string): Promise<CallListItem[]> {
  const calls = await prisma.call.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    include: { analysis: true },
  });

  return calls.map((call) => ({
    id: call.id,
    callerName: call.callerName,
    callerPhone: call.callerPhone,
    date: call.createdAt.toISOString(),
    duration: call.duration,
    summary: call.analysis?.summary ?? null,
    transcript: call.transcript,
  }));
}
