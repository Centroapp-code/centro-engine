"use server";

import { revalidatePath } from "next/cache";
import { requireCustomerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db/client";

export type AgentConfigActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function parseQuestions(formData: FormData): string[] {
  return formData
    .getAll("qualificationQuestions")
    .map((value) => String(value).trim())
    .filter(Boolean);
}

export async function updateAgentConfig(
  _prevState: AgentConfigActionState,
  formData: FormData
): Promise<AgentConfigActionState> {
  const company = await requireCustomerCompany();

  const name = String(formData.get("name") ?? "").trim();
  const greeting = String(formData.get("greeting") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const personality = String(formData.get("personality") ?? "").trim();
  const transferRules = String(formData.get("transferRules") ?? "").trim();
  const qualificationQuestions = parseQuestions(formData);

  if (!name) {
    return { status: "error", message: "Agent name is required." };
  }
  if (!greeting) {
    return { status: "error", message: "Greeting is required." };
  }

  const data = {
    name,
    greeting,
    instructions,
    personality: personality || null,
    transferRules: transferRules || null,
    qualificationQuestions,
  };

  try {
    const existing = await prisma.aIAgent.findFirst({
      where: { companyId: company.id },
      orderBy: { id: "asc" },
    });

    if (existing) {
      await prisma.aIAgent.update({ where: { id: existing.id }, data });
    } else {
      await prisma.aIAgent.create({ data: { ...data, companyId: company.id } });
    }
  } catch {
    return { status: "error", message: "Failed to save changes. Please try again." };
  }

  revalidatePath("/dashboard/settings");

  return { status: "success", message: "Changes saved." };
}
