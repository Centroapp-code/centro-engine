// Mock data standing in for real Prisma-backed queries until the
// dashboard is wired up to the database.

export type MockOverviewStats = {
  totalCalls: number;
  leadsGenerated: number;
  qualifiedLeads: number;
  conversionRate: number;
};

export const mockOverviewStats: MockOverviewStats = {
  totalCalls: 482,
  leadsGenerated: 216,
  qualifiedLeads: 93,
  conversionRate: 19.3,
};

export type MockAgentConfig = {
  name: string;
  greeting: string;
  companyDescription: string;
  productsServices: string;
  qualificationQuestions: string[];
};

export const mockAgentConfig: MockAgentConfig = {
  name: "Centro Agent",
  greeting:
    "Thanks for calling! I'm Centro, an AI sales assistant. How can I help you today?",
  companyDescription:
    "Acme Inc. builds workflow automation software for mid-market logistics companies.",
  productsServices:
    "Route Optimizer, Fleet Dashboard, and Dispatch Copilot subscription plans.",
  qualificationQuestions: [
    "What problem are you hoping to solve?",
    "How many vehicles or shipments do you manage per month?",
    "What's your timeline for making a decision?",
    "Who else is involved in this decision?",
  ],
};

export type MockCall = {
  id: string;
  callerName: string | null;
  callerPhone: string;
  date: string;
  duration: number;
  transcript: string;
  summary: string;
};

export const mockCalls: MockCall[] = [
  {
    id: "call_1",
    callerName: "Jordan Reyes",
    callerPhone: "+1 (555) 201-4432",
    date: "2026-07-13T15:20:00Z",
    duration: 274,
    transcript:
      "Agent: Thanks for calling Acme, this is Centro. How can I help?\nCaller: Hi, we're looking for a way to track our delivery fleet in real time.\nAgent: Great, how many vehicles are you currently managing?\nCaller: About 40 trucks across two states.\nAgent: Got it. What's driving the search right now — cost, visibility, or something else?\nCaller: Mostly visibility. We keep missing delivery windows.\nAgent: Understood. I'll pass this along to a specialist who can walk you through Fleet Dashboard.",
    summary:
      "Caller manages 40 trucks across two states and needs better real-time visibility to avoid missed delivery windows. Strong fit for Fleet Dashboard.",
  },
  {
    id: "call_2",
    callerName: "Priya Nair",
    callerPhone: "+1 (555) 887-2210",
    date: "2026-07-12T18:05:00Z",
    duration: 132,
    transcript:
      "Agent: Thanks for calling Acme, this is Centro. How can I help?\nCaller: Just gathering pricing info for now.\nAgent: Sure — can I ask what size fleet you're working with?\nCaller: We don't have one yet, just researching for a project next year.\nAgent: Understood, I'll send over some material for later.",
    summary:
      "Early-stage researcher, no active fleet yet, evaluating for a project next year. Low urgency.",
  },
  {
    id: "call_3",
    callerName: null,
    callerPhone: "+1 (555) 334-9981",
    date: "2026-07-12T09:42:00Z",
    duration: 61,
    transcript:
      "Agent: Thanks for calling Acme, this is Centro. How can I help?\nCaller: Wrong number, sorry.\nAgent: No problem, have a good day.",
    summary: "Misdialed call, no sales opportunity.",
  },
  {
    id: "call_4",
    callerName: "Marcus Chen",
    callerPhone: "+1 (555) 662-7734",
    date: "2026-07-11T21:15:00Z",
    duration: 398,
    transcript:
      "Agent: Thanks for calling Acme, this is Centro. How can I help?\nCaller: We need to replace our current dispatch software, it's too manual.\nAgent: Understood. How many dispatchers are on your team today?\nCaller: Six, handling around 300 shipments a day.\nAgent: What's your target timeline?\nCaller: We'd like something in place within the quarter.\nAgent: Great, I'll connect you with a specialist to scope Dispatch Copilot.",
    summary:
      "Team of 6 dispatchers handling 300 shipments/day wants to replace manual dispatch software within the quarter. High-intent, ready for Dispatch Copilot demo.",
  },
];

export type MockLeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "WON"
  | "LOST";

export type MockLead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  score: number | null;
  status: MockLeadStatus;
  createdAt: string;
};

export const mockLeads: MockLead[] = [
  {
    id: "lead_1",
    name: "Jordan Reyes",
    email: "jordan.reyes@example.com",
    phone: "+1 (555) 201-4432",
    score: 88,
    status: "QUALIFIED",
    createdAt: "2026-07-13T15:24:00Z",
  },
  {
    id: "lead_2",
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    phone: "+1 (555) 662-7734",
    score: 94,
    status: "QUALIFIED",
    createdAt: "2026-07-11T21:20:00Z",
  },
  {
    id: "lead_3",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+1 (555) 887-2210",
    score: 34,
    status: "CONTACTED",
    createdAt: "2026-07-12T18:10:00Z",
  },
  {
    id: "lead_4",
    name: "Dana Whitfield",
    email: "dana.whitfield@example.com",
    phone: "+1 (555) 552-9021",
    score: 61,
    status: "NEW",
    createdAt: "2026-07-14T10:05:00Z",
  },
  {
    id: "lead_5",
    name: "Sam Okafor",
    email: null,
    phone: "+1 (555) 118-6620",
    score: null,
    status: "LOST",
    createdAt: "2026-07-09T13:47:00Z",
  },
];
