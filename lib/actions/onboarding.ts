"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { auth, getCurrentCompany } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export type OnboardingActionState = {
  status: "idle" | "error";
  message?: string;
};

export type OnboardingInput = {
  companyName: string;
  industry: string;
  companySize: string;
  salesTeamSize: string;
  goals: string[];
  targetCustomer: string;
  customerNotes: string;
  agentTone: string;
  conversationPriorities: string[];
};

function validate(input: OnboardingInput): string | null {
  if (!input.companyName.trim()) return "Company name is required.";
  if (!input.industry) return "Please select an industry.";
  if (!input.companySize) return "Please select your company size.";
  if (!input.salesTeamSize) return "Please select your sales team size.";
  if (input.goals.length === 0) return "Please select at least one goal.";
  if (!input.targetCustomer) return "Please select your typical customer type.";
  if (!input.agentTone) return "Please select an agent tone.";
  if (input.conversationPriorities.length === 0) {
    return "Please select at least one conversation priority.";
  }
  return null;
}

/**
 * Completes onboarding and, on success, redirects straight to /dashboard —
 * a server-side redirect, not a client reload+push. This is deliberate:
 * /dashboard's gate (requireCustomerCompany) reads User.onboardingCompleted
 * directly from Postgres, which this function just committed to in the same
 * request. There is nothing to wait for — no Clerk token refresh, no client
 * effect, no timing window to reason about.
 *
 * Uses getCurrentCompany() rather than requireCustomerCompany(): the latter
 * now enforces onboarding completion, and calling it here — before
 * onboarding is done — would immediately redirect back to /onboarding
 * instead of ever completing it.
 *
 * Idempotent: safe to call more than once for the same company (refresh
 * mid-flow, a double-submit, or two tabs). Company.update always targets
 * the same row; AIAgent.upsert is keyed on the unique companyId constraint;
 * User.update is keyed on the unique clerkId. Repeated calls overwrite with
 * the latest submitted values — never duplicate rows.
 */
export async function completeOnboarding(
  input: OnboardingInput
): Promise<OnboardingActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { status: "error", message: "You must be signed in to continue." };
  }

  const company = await getCurrentCompany();
  if (!company) {
    return { status: "error", message: "You must be signed in to continue." };
  }

  const validationError = validate(input);
  if (validationError) {
    return { status: "error", message: validationError };
  }

  const companyName = input.companyName.trim();
  const notes = input.customerNotes.trim();

  const greeting = `Thanks for calling ${companyName}! I'm an AI assistant screening sales calls for this team. Who am I speaking with, and what are you calling about?`;
  const instructions = `${companyName} operates in the ${input.industry} industry. During every call, prioritize: ${input.conversationPriorities.join(", ")}.`;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: company.id },
        data: {
          name: companyName,
          industry: input.industry,
          companySize: input.companySize,
          salesTeamSize: input.salesTeamSize,
          primaryGoal: input.goals[0] ?? null,
          priorities: input.goals,
          targetCustomer: input.targetCustomer,
          notes: notes || null,
        },
      });

      await tx.aIAgent.upsert({
        where: { companyId: company.id },
        update: { personality: input.agentTone, instructions },
        create: {
          companyId: company.id,
          name: "Centro Agent",
          greeting,
          instructions,
          personality: input.agentTone,
        },
      });

      await tx.user.update({
        where: { clerkId: userId },
        data: { onboardingCompleted: true },
      });
    });
  } catch (error) {
    console.error("[onboarding] Failed to save company/agent/user data:", error);
    return { status: "error", message: "Failed to save your setup. Please try again." };
  }

  // The database write above is the source of truth and already committed —
  // onboarding has succeeded regardless of what happens below. This sync is
  // a best-effort optimization only (see proxy.ts), so a failure here must
  // never be reported to the user as a failed save, and must never block
  // the redirect. If it fails, the claim simply stays stale/absent — the
  // next dashboard request still resolves correctly via the DB-backed gate.
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { onboardingCompleted: true },
    });
  } catch (error) {
    console.error("[onboarding] Saved to database but failed to sync Clerk metadata:", error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  redirect("/dashboard");
}
