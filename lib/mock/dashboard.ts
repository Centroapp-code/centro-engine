// Mock data standing in for real Prisma-backed queries until the
// dashboard is wired up to the database.

export type MockOverviewStats = {
  totalCalls: number;
  opportunitiesCaptured: number;
  qualifiedOpportunities: number;
  avgOpportunityScore: number;
};

export const mockOverviewStats: MockOverviewStats = {
  totalCalls: 482,
  opportunitiesCaptured: 216,
  qualifiedOpportunities: 93,
  avgOpportunityScore: 62,
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
      "Agent: Thanks for calling Acme, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: Hi, I'm with a logistics data platform — we'd love to show your team real-time fleet visibility tooling.\nAgent: Got it. Is this a cold outreach or is someone here expecting your call?\nCaller: Cold outreach, but I think it's a strong fit.\nAgent: Understood. What's the rough budget or pricing range for this?\nCaller: Enterprise plans start around $2,000/month.\nAgent: I'll pass this along with a summary — someone may follow up if it's a priority right now.",
    summary:
      "Vendor pitching a real-time fleet visibility platform, cold outreach, ~$2,000/month enterprise pricing. Overlaps with existing Fleet Dashboard tooling — low priority unless there's a clear gap.",
  },
  {
    id: "call_2",
    callerName: "Priya Nair",
    callerPhone: "+1 (555) 887-2210",
    date: "2026-07-12T18:05:00Z",
    duration: 132,
    transcript:
      "Agent: Thanks for calling Acme, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: Just gathering info for a swag/promotional products vendor.\nAgent: Understood — is there a specific person expecting this outreach?\nCaller: No, general outreach.\nAgent: Got it, I'll log this as a low-priority vendor inquiry.",
    summary:
      "Promotional products vendor, general cold outreach, no internal contact expecting it. Low priority.",
  },
  {
    id: "call_3",
    callerName: null,
    callerPhone: "+1 (555) 334-9981",
    date: "2026-07-12T09:42:00Z",
    duration: 61,
    transcript:
      "Agent: Thanks for calling Acme, this is Centro screening sales calls for the team. Who am I speaking with?\nCaller: Sorry, wrong number.\nAgent: No problem, have a good day.",
    summary: "Misdialed call, not a sales opportunity.",
  },
  {
    id: "call_4",
    callerName: "Marcus Chen",
    callerPhone: "+1 (555) 662-7734",
    date: "2026-07-11T21:15:00Z",
    duration: 398,
    transcript:
      "Agent: Thanks for calling Acme, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: I'm following up on a referral from your VP of Ops — we do dispatch software implementation consulting.\nAgent: Great, that helps. What's the rough scope and budget for an engagement like this?\nCaller: Typically $15-30k for a quarter-long engagement.\nAgent: Understood, this sounds relevant given the referral — I'll flag it as high priority for the team to review.",
    summary:
      "Dispatch software implementation consultant, referred by the VP of Ops, $15-30k quarterly engagement. Warm referral — high priority, worth a live follow-up.",
  },
];

export type MockOpportunityStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "WON"
  | "LOST";

export type MockOpportunity = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  score: number | null;
  status: MockOpportunityStatus;
  createdAt: string;
};

export const mockOpportunities: MockOpportunity[] = [
  {
    id: "opp_1",
    name: "Jordan Reyes",
    email: "jordan.reyes@example.com",
    phone: "+1 (555) 201-4432",
    score: 41,
    status: "CONTACTED",
    createdAt: "2026-07-13T15:24:00Z",
  },
  {
    id: "opp_2",
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    phone: "+1 (555) 662-7734",
    score: 94,
    status: "QUALIFIED",
    createdAt: "2026-07-11T21:20:00Z",
  },
  {
    id: "opp_3",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+1 (555) 887-2210",
    score: 18,
    status: "LOST",
    createdAt: "2026-07-12T18:10:00Z",
  },
  {
    id: "opp_4",
    name: "Dana Whitfield",
    email: "dana.whitfield@example.com",
    phone: "+1 (555) 552-9021",
    score: 76,
    status: "NEW",
    createdAt: "2026-07-14T10:05:00Z",
  },
  {
    id: "opp_5",
    name: "Sam Okafor",
    email: null,
    phone: "+1 (555) 118-6620",
    score: 88,
    status: "WON",
    createdAt: "2026-07-09T13:47:00Z",
  },
  {
    id: "opp_6",
    name: "Leah Fontaine",
    email: "leah.fontaine@example.com",
    phone: "+1 (555) 774-2093",
    score: 55,
    status: "NEW",
    createdAt: "2026-07-14T09:12:00Z",
  },
  {
    id: "opp_7",
    name: "Theo Bracken",
    email: "theo.bracken@example.com",
    phone: "+1 (555) 330-8871",
    score: 29,
    status: "NEW",
    createdAt: "2026-07-13T08:40:00Z",
  },
  {
    id: "opp_8",
    name: "Renata Kovac",
    email: "renata.kovac@example.com",
    phone: "+1 (555) 902-1145",
    score: 47,
    status: "CONTACTED",
    createdAt: "2026-07-12T16:33:00Z",
  },
  {
    id: "opp_9",
    name: "Oliver Bassett",
    email: null,
    phone: "+1 (555) 447-6602",
    score: 22,
    status: "LOST",
    createdAt: "2026-07-10T11:02:00Z",
  },
  {
    id: "opp_10",
    name: "Grace Odusanya",
    email: "grace.odusanya@example.com",
    phone: "+1 (555) 205-3387",
    score: 81,
    status: "QUALIFIED",
    createdAt: "2026-07-11T14:15:00Z",
  },
];

/** Number of opportunities per status, in a fixed funnel display order. */
export function getOpportunityStatusCounts(): { status: MockOpportunityStatus; count: number }[] {
  const order: MockOpportunityStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];
  return order.map((status) => ({
    status,
    count: mockOpportunities.filter((opp) => opp.status === status).length,
  }));
}

export type MockActivityItem = {
  id: string;
  type: "call" | "opportunity" | "score";
  message: string;
  timestamp: string;
};

export const mockRecentActivity: MockActivityItem[] = [
  {
    id: "activity_1",
    type: "opportunity",
    message: "Dana Whitfield scored as a new opportunity",
    timestamp: "2026-07-14T10:05:00Z",
  },
  {
    id: "activity_2",
    type: "call",
    message: "Call answered from +1 (555) 201-4432 (Jordan Reyes)",
    timestamp: "2026-07-13T15:20:00Z",
  },
  {
    id: "activity_3",
    type: "score",
    message: "Marcus Chen's opportunity scored 94 — marked Qualified",
    timestamp: "2026-07-11T21:22:00Z",
  },
  {
    id: "activity_4",
    type: "call",
    message: "Call answered from +1 (555) 887-2210 (Priya Nair)",
    timestamp: "2026-07-12T18:05:00Z",
  },
  {
    id: "activity_5",
    type: "score",
    message: "Priya Nair's opportunity scored 18 — marked Lost",
    timestamp: "2026-07-12T18:12:00Z",
  },
];

export const mockRecommendations: string[] = [
  "Marcus Chen's opportunity scored 94 and came from a warm referral — follow up live today.",
  "3 of the last 10 calls were cold vendor outreach with no internal contact expecting them — consider tightening the qualifying question on referrals.",
  "Average opportunity score dipped this week — review the qualification questions for missed context.",
];

export type MockDailyCallVolume = {
  date: string;
  count: number;
};

export const mockCallVolume: MockDailyCallVolume[] = [
  { date: "2026-07-08", count: 9 },
  { date: "2026-07-09", count: 14 },
  { date: "2026-07-10", count: 11 },
  { date: "2026-07-11", count: 18 },
  { date: "2026-07-12", count: 7 },
  { date: "2026-07-13", count: 16 },
  { date: "2026-07-14", count: 12 },
];
