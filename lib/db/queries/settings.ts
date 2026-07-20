import { prisma } from "@/lib/db/client";

export type CompanyProfile = {
  name: string;
  industry: string | null;
};

export async function getCompanyProfile(companyId: string): Promise<CompanyProfile> {
  return prisma.company.findUniqueOrThrow({
    where: { id: companyId },
    select: { name: true, industry: true },
  });
}

export type PhoneIntegrationInfo = {
  phoneNumber: string;
  provider: string;
  status: string;
};

export async function getPhoneIntegration(
  companyId: string
): Promise<PhoneIntegrationInfo | null> {
  const integration = await prisma.phoneIntegration.findFirst({
    where: { companyId },
    orderBy: { id: "asc" },
  });

  if (!integration) {
    return null;
  }

  return {
    phoneNumber: integration.phoneNumber,
    provider: integration.provider,
    status: integration.status,
  };
}

export type AgentConfig = {
  name: string;
  greeting: string;
  instructions: string;
  personality: string;
  transferRules: string;
  screeningQuestions: string[];
};

const DEFAULT_AGENT_CONFIG: AgentConfig = {
  name: "Centro Agent",
  greeting:
    "Thanks for calling! I'm an AI assistant screening sales calls for this team. Who am I speaking with, and what are you calling about?",
  instructions: "",
  personality: "",
  transferRules: "",
  screeningQuestions: [],
};

export async function getAgentConfig(companyId: string): Promise<AgentConfig> {
  const agent = await prisma.aIAgent.findFirst({
    where: { companyId },
    orderBy: { id: "asc" },
  });

  if (!agent) {
    return DEFAULT_AGENT_CONFIG;
  }

  return {
    name: agent.name,
    greeting: agent.greeting,
    instructions: agent.instructions,
    personality: agent.personality ?? "",
    transferRules: agent.transferRules ?? "",
    screeningQuestions: Array.isArray(agent.screeningQuestions)
      ? (agent.screeningQuestions as string[])
      : [],
  };
}
