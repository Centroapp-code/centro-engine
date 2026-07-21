import OpenAI from "openai";
import { env } from "@/lib/env";
import type { ConversationState } from "./conversation";

const OPENAI_MODEL = "gpt-4o-mini";

/** The subset of AIAgent this module needs. */
export type AnalysisAgentConfig = {
  /** Json column; expected shape is string[], validated defensively. */
  screeningQuestions: unknown;
};

/**
 * The subset of IndustryProfile this module needs — deliberately broader
 * than conversation.ts's IndustryContext. scoringPriorities and goals are
 * used here to weight opportunity scoring; they're intentionally excluded
 * from the live conversation prompt (see conversation.ts), so this is a
 * separate type rather than a shared/extended one, to keep that boundary
 * enforced by the type system, not just convention.
 */
export type AnalysisIndustryContext = {
  industry: string;
  vendorCategories: unknown;
  terminology: unknown;
  scoringPriorities: unknown;
  goals: unknown;
} | null;

export type CallCategory = "VENDOR" | "PARTNERSHIP" | "OTHER";
export type OpportunityPriority = "LOW" | "MEDIUM" | "HIGH";

export type ExtractedInfo = {
  callerName: string | null;
  companyName: string | null;
  email: string | null;
  phone: string | null;
  offering: string | null;
  pricing: string | null;
  otherDetails: string | null;
};

export type ScreeningQuestionAnswer = {
  question: string;
  answer: string | null;
};

export type CallAnalysisResult = {
  category: CallCategory;
  summary: string;
  extractedInfo: ExtractedInfo;
  screeningQuestionAnswers: ScreeningQuestionAnswer[];
  opportunityScore: number;
  opportunityPriority: OpportunityPriority;
  recommendedAction: string;
};

let openaiClient: OpenAI | undefined;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not set. Required for post-call analysis — see ENVIRONMENT.md."
      );
    }
    openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function toTerminologyRecord(value: unknown): Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const entries = Object.entries(value as Record<string, unknown>).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].trim().length > 0
  );
  return Object.fromEntries(entries);
}

const BASE_SYSTEM_PROMPT = (companyName: string) => `You are Centro's post-call analysis engine. You will be given the full
transcript of a phone call in which Centro's AI receptionist answered an
unsolicited vendor, sales, or partner call on behalf of ${companyName}, plus
this company's own configuration for what matters to them.

The call has already ended — your only job is to read the transcript and
produce a structured analysis of it. You are not talking to anyone and must
not generate any conversational reply.

Your analysis must include:

1. category — classify the call as exactly one of VENDOR, PARTNERSHIP, or
   OTHER, based on what the caller was actually offering or proposing.
2. summary — a brief, neutral, factual summary of what the call was about
   (2-4 sentences).
3. extractedInfo — pull out only information the caller actually stated in
   the transcript: their name, their company name, a callback email, a
   callback phone number, what they're offering, any pricing or claimed
   savings they mentioned, and any other business-relevant detail. If the
   transcript does not clearly contain a piece of information, leave that
   field null — never guess, infer, or fabricate a plausible-sounding value
   to fill a gap.
   For the callback phone number specifically: if the caller explicitly
   confirms it's the same number they're calling from (e.g. "same as this
   number," "yeah, same one"), leave the phone field null and set
   phoneIsSameAsCallerId to true instead — do not guess or copy in a number
   yourself. Only set phoneIsSameAsCallerId to true when the caller actually
   said something confirming this; if phone was never addressed in the call
   at all, phone stays null and phoneIsSameAsCallerId stays false. These are
   different situations and must not be conflated.
4. screeningQuestionAnswers — for each of ${companyName}'s specific
   screening questions listed below, state the caller's answer if the
   transcript contains one, or null if it doesn't.
5. opportunityScore — an integer from 0 to 100 rating how much this call is
   worth ${companyName}'s attention, weighted specifically by the scoring
   priorities and goals listed below — not a generic sense of "how good a
   salesperson this caller was."
6. opportunityPriority — LOW, MEDIUM, or HIGH, consistent with the score.
7. recommendedAction — a short, concrete next step for ${companyName} (e.g.
   "Forward to procurement for a rate comparison" or "No action needed —
   not relevant to current priorities").

Transcripts may be imperfect: some turns may reflect speech-recognition
errors, mishearings, or garbled/nonsensical fragments (e.g. a turn that
reads only "To someone."). Do your best with what's actually there. Never
use a garbled turn to invent information that was likely intended but not
actually captured — treat an unclear turn as missing information, not as a
puzzle to solve.`;

function buildTenantOverlay(
  companyName: string,
  agent: AnalysisAgentConfig,
  industryProfile: AnalysisIndustryContext
): string {
  const vendorCategories = toStringArray(industryProfile?.vendorCategories);
  const terminology = toTerminologyRecord(industryProfile?.terminology);
  const scoringPriorities = toStringArray(industryProfile?.scoringPriorities);
  const goals = toStringArray(industryProfile?.goals);
  const screeningQuestions = toStringArray(agent.screeningQuestions);

  const lines: string[] = [
    "Company-specific context for this analysis:",
    `- Company: ${companyName}`,
    `- Industry: ${industryProfile?.industry ?? "Not specified"}`,
    `- Vendor/partner categories ${companyName} cares about: ${
      vendorCategories.length > 0 ? vendorCategories.join(", ") : "Not specified"
    }`,
  ];

  if (Object.keys(terminology).length > 0) {
    const formatted = Object.entries(terminology)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    lines.push(`- This company's own terms for common concepts — prefer these words when they apply: ${formatted}`);
  }

  lines.push(
    `- What matters most when scoring a call for ${companyName}, in priority order: ${
      scoringPriorities.length > 0 ? scoringPriorities.join("; ") : "Not specified"
    }`,
    `- ${companyName}'s broader goals for this system: ${goals.length > 0 ? goals.join("; ") : "Not specified"}`,
    ""
  );

  if (screeningQuestions.length > 0) {
    lines.push(
      `${companyName}'s specific screening questions to check answers for:`,
      ...screeningQuestions.map((question, index) => `${index + 1}. ${question}`)
    );
  } else {
    lines.push(`${companyName} has no company-specific screening questions configured.`);
  }

  return lines.join("\n");
}

function buildSystemPrompt(
  companyName: string,
  agent: AnalysisAgentConfig,
  industryProfile: AnalysisIndustryContext
): string {
  return `${BASE_SYSTEM_PROMPT(companyName)}\n\n${buildTenantOverlay(companyName, agent, industryProfile)}`;
}

function renderTranscript(conversation: ConversationState): string {
  return conversation.messages
    .map((message) => `${message.role === "assistant" ? "Centro" : "Caller"}: ${message.content}`)
    .join("\n");
}

const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    category: { type: "string", enum: ["VENDOR", "PARTNERSHIP", "OTHER"] },
    summary: { type: "string" },
    extractedInfo: {
      type: "object",
      properties: {
        callerName: { type: ["string", "null"] },
        companyName: { type: ["string", "null"] },
        email: { type: ["string", "null"] },
        phone: { type: ["string", "null"] },
        offering: { type: ["string", "null"] },
        pricing: { type: ["string", "null"] },
        otherDetails: { type: ["string", "null"] },
      },
      required: ["callerName", "companyName", "email", "phone", "offering", "pricing", "otherDetails"],
      additionalProperties: false,
    },
    // Not part of ExtractedInfo/persisted output — consumed inside
    // analyzeCall() to resolve extractedInfo.phone against the call's own
    // known caller ID, then discarded. See analyzeCall() below.
    phoneIsSameAsCallerId: { type: "boolean" },
    screeningQuestionAnswers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: ["string", "null"] },
        },
        required: ["question", "answer"],
        additionalProperties: false,
      },
    },
    opportunityScore: { type: "integer" },
    opportunityPriority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
    recommendedAction: { type: "string" },
  },
  required: [
    "category",
    "summary",
    "extractedInfo",
    "phoneIsSameAsCallerId",
    "screeningQuestionAnswers",
    "opportunityScore",
    "opportunityPriority",
    "recommendedAction",
  ],
  additionalProperties: false,
} as const;

export type AnalyzeCallParams = {
  companyName: string;
  agent: AnalysisAgentConfig;
  industryProfile: AnalysisIndustryContext;
  conversation: ConversationState;
  /** Call.callerPhone — known ground truth, used to resolve phoneIsSameAsCallerId. */
  callerPhone: string;
};

/** The raw shape the model returns — phoneIsSameAsCallerId is resolved and discarded before this becomes CallAnalysisResult. */
type RawAnalysisResponse = Omit<CallAnalysisResult, "extractedInfo"> & {
  extractedInfo: ExtractedInfo;
  phoneIsSameAsCallerId: boolean;
};

/**
 * Produces the structured post-call analysis (CallAnalysis + Opportunity
 * fields) for a completed call. Pure function — transcript and config in,
 * structured data out. No DB reads or writes here; the caller (the
 * call-status webhook, via services/phone/call-store.ts) is responsible
 * for persistence.
 *
 * Throws on any OpenAI failure (network error, timeout, refusal, or a
 * response that doesn't parse as the expected JSON) rather than returning
 * a partial or guessed result — the caller decides what "failed" means
 * (logging, not retrying in a loop, etc.), this function never papers over
 * a failure with fabricated data.
 */
export async function analyzeCall(params: AnalyzeCallParams): Promise<CallAnalysisResult> {
  const systemPrompt = buildSystemPrompt(params.companyName, params.agent, params.industryProfile);
  const transcript = renderTranscript(params.conversation);

  const completion = await getOpenAIClient().chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Call transcript:\n\n${transcript}` },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "call_analysis",
        strict: true,
        schema: RESPONSE_JSON_SCHEMA,
      },
    },
  });

  const choice = completion.choices[0];

  if (!choice || choice.finish_reason === "content_filter") {
    throw new Error(`Post-call analysis was refused or filtered (finish_reason: ${choice?.finish_reason}).`);
  }

  const raw = choice.message?.content;
  if (!raw) {
    throw new Error("Post-call analysis returned no content.");
  }

  const parsed = JSON.parse(raw) as RawAnalysisResponse;
  const { phoneIsSameAsCallerId, ...result } = parsed;

  return {
    ...result,
    extractedInfo: {
      ...result.extractedInfo,
      phone: result.extractedInfo.phone ?? (phoneIsSameAsCallerId ? params.callerPhone : null),
    },
  };
}
