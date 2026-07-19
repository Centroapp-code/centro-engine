"use server";

import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";
import { auth, requireCustomerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export type OnboardingActionState = {
  status: "idle" | "success" | "error";
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

export async function completeOnboarding(
  input: OnboardingInput
): Promise<OnboardingActionState> {
  const company = await requireCustomerCompany();
  const { userId } = await auth();

  if (!userId) {
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

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { onboardingCompleted: true },
    });
  } catch {
    return { status: "error", message: "Failed to save your setup. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");

  return { status: "success" };
}
