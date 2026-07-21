import { prisma } from "@/lib/db/client";
import type { Prisma } from "@/lib/db/generated/client";
import type { CallAnalysisResult } from "./analysis";

export type SaveCallAnalysisParams = {
  callId: string;
  companyId: string;
  analysis: CallAnalysisResult;
};

/**
 * Persists a completed post-call analysis — CallAnalysis + Opportunity, and
 * marks the Call as analyzed — in one transaction. Kept separate from
 * analysis.ts, which stays a pure function with no DB access, mirroring the
 * existing conversation.ts (pure) / call-store.ts (persistence) split.
 */
export function saveCallAnalysis(params: SaveCallAnalysisParams) {
  const { callId, companyId, analysis } = params;

  const extractedInfo = {
    ...analysis.extractedInfo,
    screeningQuestionAnswers: analysis.screeningQuestionAnswers,
  } as Prisma.InputJsonValue;

  return prisma.$transaction([
    prisma.call.update({
      where: { id: callId },
      data: { status: "ANALYZED" },
    }),
    prisma.callAnalysis.create({
      data: {
        callId,
        category: analysis.category,
        summary: analysis.summary,
        recommendation: analysis.recommendedAction,
        opportunityScore: analysis.opportunityScore,
        extractedInfo,
      },
    }),
    prisma.opportunity.create({
      data: {
        companyId,
        callId,
        opportunityType: analysis.category,
        name: analysis.extractedInfo.callerName,
        email: analysis.extractedInfo.email,
        phone: analysis.extractedInfo.phone,
        score: analysis.opportunityScore,
        priority: analysis.opportunityPriority,
        recommendedAction: analysis.recommendedAction,
      },
    }),
  ]);
}
