// Mock data standing in for real Prisma-backed queries until the admin
// dashboard is wired up to the database.

export type MockCompanyStatus = "ACTIVE" | "TRIAL" | "SUSPENDED";

export type MockAdminAgent = {
  id: string;
  name: string;
  active: boolean;
};

export type MockAdminPhoneNumber = {
  id: string;
  phoneNumber: string;
  provider: string;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
};

export type MockAdminUsage = {
  totalCalls: number;
  totalOpportunities: number;
  flaggedOpportunities: number;
};

export type MockAdminCompany = {
  id: string;
  name: string;
  industry: string;
  userCount: number;
  createdAt: string;
  status: MockCompanyStatus;
  agents: MockAdminAgent[];
  phoneNumbers: MockAdminPhoneNumber[];
  usage: MockAdminUsage;
};

export const mockAdminCompanies: MockAdminCompany[] = [
  {
    id: "company_1",
    name: "Acme Inc",
    industry: "Logistics",
    userCount: 4,
    createdAt: "2026-03-02T10:00:00Z",
    status: "ACTIVE",
    agents: [
      { id: "agent_1", name: "Centro Agent", active: true },
      { id: "agent_2", name: "After Hours Agent", active: false },
    ],
    phoneNumbers: [
      { id: "phone_1", phoneNumber: "+1 (555) 201-9000", provider: "Twilio", status: "ACTIVE" },
    ],
    usage: { totalCalls: 482, totalOpportunities: 216, flaggedOpportunities: 93 },
  },
  {
    id: "company_2",
    name: "Northwind Traders",
    industry: "Wholesale",
    userCount: 2,
    createdAt: "2026-04-18T14:30:00Z",
    status: "TRIAL",
    agents: [{ id: "agent_3", name: "Northwind Agent", active: true }],
    phoneNumbers: [
      { id: "phone_2", phoneNumber: "+1 (555) 442-1180", provider: "Twilio", status: "PENDING" },
    ],
    usage: { totalCalls: 37, totalOpportunities: 12, flaggedOpportunities: 3 },
  },
  {
    id: "company_3",
    name: "Bluepeak Roofing",
    industry: "Home Services",
    userCount: 6,
    createdAt: "2025-11-09T09:15:00Z",
    status: "ACTIVE",
    agents: [
      { id: "agent_4", name: "Bluepeak Agent", active: true },
    ],
    phoneNumbers: [
      { id: "phone_3", phoneNumber: "+1 (555) 771-4420", provider: "Twilio", status: "ACTIVE" },
      { id: "phone_4", phoneNumber: "+1 (555) 771-4421", provider: "Twilio", status: "ACTIVE" },
    ],
    usage: { totalCalls: 1204, totalOpportunities: 588, flaggedOpportunities: 241 },
  },
  {
    id: "company_4",
    name: "Fernwood Dental Group",
    industry: "Healthcare",
    userCount: 3,
    createdAt: "2026-06-27T11:45:00Z",
    status: "SUSPENDED",
    agents: [{ id: "agent_5", name: "Fernwood Agent", active: false }],
    phoneNumbers: [
      { id: "phone_5", phoneNumber: "+1 (555) 990-3341", provider: "Twilio", status: "INACTIVE" },
    ],
    usage: { totalCalls: 58, totalOpportunities: 21, flaggedOpportunities: 6 },
  },
];

export function getMockCompanyById(id: string): MockAdminCompany | undefined {
  return mockAdminCompanies.find((company) => company.id === id);
}
