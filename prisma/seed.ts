/**
 * Development seed data for Centro.
 *
 * Populates a demo company with a realistic mix of calls, AI analyses, and
 * opportunities so the customer dashboard can be exercised against real
 * database queries instead of `lib/mock/*`. Every row is upserted against a
 * stable id/unique field, so running this script repeatedly updates the
 * same demo records instead of piling up duplicates.
 *
 * Run with `npx prisma db seed` (see README.md for details). Refuses to run
 * when NODE_ENV=production as a safeguard against touching a live database.
 *
 * The demo user has no real Clerk session, so signing in as yourself won't
 * show this data automatically — your own sign-in provisions its own
 * separate company (see lib/db/provisioning.ts). To view the seeded data in
 * the dashboard, link your real user to the demo company instead, e.g. via
 * Prisma Studio (`npx prisma studio`): find your `User` row, then add a
 * `CompanyMember` row with your `userId` and `companyId: "seed-demo-company"`.
 */
import { prisma } from "../lib/db/client";
import type {
  CallCategory,
  CallStatus,
  OpportunityPriority,
  OpportunityStatus,
} from "../lib/db/generated/enums";

if (process.env.NODE_ENV === "production") {
  throw new Error(
    "Refusing to run prisma/seed.ts with NODE_ENV=production. This seed is for local/dev/demo databases only."
  );
}

const DEMO_COMPANY_ID = "seed-demo-company";
const DEMO_USER_CLERK_ID = "seed-demo-customer";

type SeedCall = {
  providerCallId: string;
  callerName: string | null;
  callerPhone: string;
  duration: number;
  transcript: string;
  status: CallStatus;
  analysis?: {
    category: CallCategory;
    summary: string;
    recommendation: string;
    opportunityScore: number;
    extractedInfo: Record<string, string | null>;
  };
  opportunity?: {
    email: string | null;
    opportunityType: string;
    score: number;
    priority: OpportunityPriority;
    status: OpportunityStatus;
    recommendedAction: string;
  };
};

const SEED_CALLS: SeedCall[] = [
  {
    providerCallId: "seed-call-1",
    callerName: "Jordan Reyes",
    callerPhone: "+15552014432",
    duration: 274,
    status: "ANALYZED",
    transcript:
      "Agent: Thanks for calling Demo Company, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: Hi, I'm with a logistics data platform — we'd love to show your team real-time fleet visibility tooling.\nAgent: Got it. Is this a cold outreach or is someone here expecting your call?\nCaller: Cold outreach, but I think it's a strong fit.\nAgent: Understood. What's the rough budget or pricing range for this?\nCaller: Enterprise plans start around $2,000/month.\nAgent: I'll pass this along with a summary — someone may follow up if it's a priority right now.",
    analysis: {
      category: "VENDOR",
      summary:
        "Vendor pitching a real-time fleet visibility platform, cold outreach, ~$2,000/month enterprise pricing. Overlaps with existing fleet tooling.",
      recommendation:
        "Low priority — overlaps with tooling the team already owns unless a clear gap is identified.",
      opportunityScore: 41,
      extractedInfo: {
        callerCompany: "RouteSight",
        industry: "Logistics Technology",
        productService: "Real-time fleet visibility platform",
        reasonForContacting: "Cold outreach demo request",
        companySize: null,
        existingCustomersOrUseCases: null,
        decisionMakerRequested: null,
        timeline: null,
        businessNeeds: "Overlaps with existing fleet dashboard tooling",
      },
    },
    opportunity: {
      email: "jordan.reyes@routesight.example.com",
      opportunityType: "Vendor Pitch",
      score: 41,
      priority: "LOW",
      status: "CONTACTED",
      recommendedAction:
        "Low priority — overlaps with existing fleet dashboard tooling unless a clear gap emerges.",
    },
  },
  {
    providerCallId: "seed-call-2",
    callerName: "Priya Nair",
    callerPhone: "+15558872210",
    duration: 132,
    status: "PENDING",
    transcript:
      "Agent: Thanks for calling Demo Company, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: Just gathering info for a promotional products vendor.\nAgent: Understood — is there a specific person expecting this outreach?\nCaller: No, general outreach.\nAgent: Got it, I'll log this and pass it along.",
    // No analysis yet — exercises the "AI analysis pending" placeholder in the UI.
  },
  {
    providerCallId: "seed-call-3",
    callerName: null,
    callerPhone: "+15553349981",
    duration: 61,
    status: "ARCHIVED",
    transcript:
      "Agent: Thanks for calling Demo Company, this is Centro. Who am I speaking with?\nCaller: Sorry, wrong number.\nAgent: No problem, have a good day.",
    // No analysis or opportunity — a misdial, exercises the "Unknown caller" path.
  },
  {
    providerCallId: "seed-call-4",
    callerName: "Marcus Chen",
    callerPhone: "+15556627734",
    duration: 398,
    status: "ANALYZED",
    transcript:
      "Agent: Thanks for calling Demo Company, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: I'm following up on a referral from your VP of Ops — we do dispatch software implementation consulting.\nAgent: Great, that helps. What's the rough scope and budget for an engagement like this?\nCaller: Typically $15-30k for a quarter-long engagement.\nAgent: Understood, this sounds relevant given the referral — I'll flag it as high priority for the team to review.",
    analysis: {
      category: "PARTNERSHIP",
      summary:
        "Dispatch software implementation consultant, referred by the VP of Ops, $15-30k quarterly engagement.",
      recommendation: "Warm referral — schedule a live follow-up this week.",
      opportunityScore: 94,
      extractedInfo: {
        callerCompany: "Chen Dispatch Consulting",
        industry: "Logistics Consulting",
        productService: "Dispatch software implementation consulting",
        reasonForContacting: "Referral from VP of Ops",
        companySize: "Boutique consultancy",
        existingCustomersOrUseCases: null,
        decisionMakerRequested: "VP of Ops",
        timeline: "Quarter-long engagement",
        businessNeeds: "Implementation support for dispatch software rollout",
      },
    },
    opportunity: {
      email: "marcus.chen@example.com",
      opportunityType: "Partnership Referral",
      score: 94,
      priority: "HIGH",
      status: "QUALIFIED",
      recommendedAction: "Warm referral from the VP of Ops — schedule a live follow-up this week.",
    },
  },
  {
    providerCallId: "seed-call-5",
    callerName: "Dana Whitfield",
    callerPhone: "+15555529021",
    duration: 210,
    status: "ANALYZED",
    transcript:
      "Agent: Thanks for calling Demo Company, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: Hi, I'm reaching out about a regional logistics conference — we have sponsorship packages available.\nAgent: Got it. What's included and what's the price range?\nCaller: Booth space plus a speaking slot, packages start at $5,000.\nAgent: I'll pass this along — it's not a product pitch but could be worth a look.",
    analysis: {
      category: "OTHER",
      summary:
        "Conference sponsorship pitch (booth + speaking slot) for a regional logistics conference, packages from $5,000.",
      recommendation: "Not a product pitch — worth a quick look if marketing has budget for event sponsorships.",
      opportunityScore: 76,
      extractedInfo: {
        callerCompany: "Logistics Forward Conference",
        industry: "Events",
        productService: "Conference sponsorship package",
        reasonForContacting: "Sponsorship sales",
        companySize: null,
        existingCustomersOrUseCases: null,
        decisionMakerRequested: null,
        timeline: "Conference date not yet confirmed",
        businessNeeds: "Marketing/brand visibility, not a product need",
      },
    },
    opportunity: {
      email: "dana.whitfield@example.com",
      opportunityType: "Business Opportunity",
      score: 76,
      priority: "MEDIUM",
      status: "NEW",
      recommendedAction: "Promising fit for marketing — needs a qualification call before prioritizing.",
    },
  },
  {
    providerCallId: "seed-call-6",
    callerName: "Sam Okafor",
    callerPhone: "+15551186620",
    duration: 305,
    status: "ANALYZED",
    transcript:
      "Agent: Thanks for calling Demo Company, this is Centro. Who am I speaking with and what are you calling about?\nCaller: Hi, I'm already a customer — I want to talk about expanding to a second warehouse location.\nAgent: Great, I'll flag this as an existing customer expansion request for the account team.",
    analysis: {
      category: "SALES",
      summary: "Existing customer requesting an account expansion to a second warehouse location.",
      recommendation: "Existing customer expansion — route directly to the account team.",
      opportunityScore: 88,
      extractedInfo: {
        callerCompany: "Okafor Freight",
        industry: "Logistics",
        productService: "Account expansion to a second warehouse location",
        reasonForContacting: "Existing customer expansion",
        companySize: null,
        existingCustomersOrUseCases: "Existing customer, single warehouse today",
        decisionMakerRequested: null,
        timeline: null,
        businessNeeds: "Support for a second warehouse location",
      },
    },
    opportunity: {
      email: "sam.okafor@example.com",
      opportunityType: "Account Expansion",
      score: 88,
      priority: "HIGH",
      status: "WON",
      recommendedAction: "Closed — expansion deal signed with the account team.",
    },
  },
  {
    providerCallId: "seed-call-7",
    callerName: "Oliver Bassett",
    callerPhone: "+15554476602",
    duration: 96,
    status: "ANALYZED",
    transcript:
      "Agent: Thanks for calling Demo Company, this is Centro screening sales calls for the team. Who am I speaking with and what are you calling about?\nCaller: I'm with a fuel card provider, wanted to see if you'd switch providers.\nAgent: Understood — is there a specific person expecting this outreach?\nCaller: No, cold outreach.\nAgent: Got it, I'll log this as a low-priority vendor inquiry.",
    analysis: {
      category: "VENDOR",
      summary: "Fuel card provider, cold outreach, no existing relationship or internal contact.",
      recommendation: "Not a fit — no budget alignment or internal sponsor, close out.",
      opportunityScore: 22,
      extractedInfo: {
        callerCompany: "FleetFuel Cards",
        industry: "Fleet Payments",
        productService: "Fuel card program",
        reasonForContacting: "Cold outreach, provider switch pitch",
        companySize: null,
        existingCustomersOrUseCases: null,
        decisionMakerRequested: null,
        timeline: null,
        businessNeeds: null,
      },
    },
    opportunity: {
      email: null,
      opportunityType: "Vendor Pitch",
      score: 22,
      priority: "LOW",
      status: "LOST",
      recommendedAction: "Not a fit — no budget alignment, close out.",
    },
  },
];

async function main() {
  const company = await prisma.company.upsert({
    where: { id: DEMO_COMPANY_ID },
    update: {},
    create: {
      id: DEMO_COMPANY_ID,
      name: "Demo Company",
      industry: "Logistics",
    },
  });

  const user = await prisma.user.upsert({
    where: { clerkId: DEMO_USER_CLERK_ID },
    update: {},
    create: {
      clerkId: DEMO_USER_CLERK_ID,
      email: "demo.customer@centroengine.com",
      role: "CUSTOMER",
    },
  });

  await prisma.companyMember.upsert({
    where: { userId_companyId: { userId: user.id, companyId: company.id } },
    update: {},
    create: { userId: user.id, companyId: company.id },
  });

  for (const seedCall of SEED_CALLS) {
    const call = await prisma.call.upsert({
      where: { providerCallId: seedCall.providerCallId },
      update: {},
      create: {
        providerCallId: seedCall.providerCallId,
        companyId: company.id,
        callerName: seedCall.callerName,
        callerPhone: seedCall.callerPhone,
        duration: seedCall.duration,
        transcript: seedCall.transcript,
        status: seedCall.status,
      },
    });

    if (seedCall.analysis) {
      await prisma.callAnalysis.upsert({
        where: { callId: call.id },
        update: {},
        create: {
          callId: call.id,
          category: seedCall.analysis.category,
          summary: seedCall.analysis.summary,
          recommendation: seedCall.analysis.recommendation,
          opportunityScore: seedCall.analysis.opportunityScore,
          extractedInfo: seedCall.analysis.extractedInfo,
        },
      });
    }

    if (seedCall.opportunity) {
      await prisma.opportunity.upsert({
        where: { callId: call.id },
        update: {},
        create: {
          callId: call.id,
          companyId: company.id,
          name: seedCall.callerName,
          email: seedCall.opportunity.email,
          phone: seedCall.callerPhone,
          opportunityType: seedCall.opportunity.opportunityType,
          score: seedCall.opportunity.score,
          priority: seedCall.opportunity.priority,
          status: seedCall.opportunity.status,
          recommendedAction: seedCall.opportunity.recommendedAction,
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log(`  Company: ${company.name} (${company.id})`);
  console.log(`  User:    ${user.email} (clerkId: ${user.clerkId})`);
  console.log(`  Calls:   ${SEED_CALLS.length} seeded`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
