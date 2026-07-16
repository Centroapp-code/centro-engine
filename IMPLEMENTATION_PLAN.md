# Centro Implementation Plan

> Living document. Update after each major milestone — don't let this drift from the codebase like CLAUDE.md's vision has.

## Current Project Status

Foundation, auth, marketing site, and dashboard UI shells are built and look production-ready. Underneath, the app runs entirely on mock data with no live database wiring and no real AI. The Twilio call path is the one place with real infrastructure, but it only plays a static greeting — no speech capture, no LLM, no scoring. In short: **UI layer done, data/intelligence layer not started.**

## Completed Milestones

- [x] Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui (`@base-ui/react` variant) foundation
- [x] Marketing site (`app/(marketing)`) — gatekeeper positioning, hero/how-it-works/features/pricing/FAQ
- [x] Clerk authentication — sign up/in/out, `CUSTOMER`/`ADMIN` roles via `publicMetadata`, route protection in `proxy.ts`
- [x] Prisma schema + 2 migrations (`20260715000000_init`, `20260716000000_add_call_provider_id`) against Postgres
- [x] Customer dashboard shell — Overview, Calls, Opportunities, Analytics, Settings (all mock-data driven)
- [x] Admin dashboard shell — Companies list, company detail (mock-data driven)
- [x] `services/phone` — `PhoneProvider` interface + registry + real `TwilioPhoneProvider`
- [x] Twilio webhooks (`/api/twilio/incoming-call`, `/api/twilio/call-status`) — signature-verified, write real `Call` rows, single static `<Say>` greeting
- [x] Deployment groundwork — README, `.env.example`, `postinstall: prisma generate`

## Current Milestone

**M1 — Make the dashboard real.** Wire customer/admin dashboards to Postgres via Prisma, scoped per company, replacing `lib/mock/*`. This is blocked on user/company provisioning (below), so that's the actual first step.

## Remaining Roadmap

### Phase 1 — SaaS Foundation (in progress)
1. Provision `User` + `Company` + `CompanyMember` on Clerk `user.created` (currently only sets role metadata — no DB row is ever created)
2. Replace `lib/mock/dashboard.ts` and `lib/mock/admin.ts` usage with company-scoped Prisma queries, page by page (Overview → Calls → Opportunities → Analytics → Settings → Admin)
3. Decide build-vs-buy on **Clerk Organizations** vs. the hand-rolled `CompanyMember` table before extending multi-tenancy further
4. Schema additions needed to match CLAUDE.md's workflow (see Technical Debt below)

### Phase 2 — AI Intelligence (not started)
- Add an LLM SDK (none installed yet) and give `services/ai/conversation.ts` real logic beyond returning the static greeting
- Structured extraction: industry, company size, decision-maker, timeline, business needs
- Opportunity scoring, priority, recommended action generation
- Auto-generated call summaries (`Call.summary` is currently always null)

### Phase 3 — Voice Platform (partially started)
- Add `<Gather input="speech">` to the Twilio flow so caller responses are actually captured (currently the call plays one greeting and ends)
- Multi-turn conversation state across webhook requests
- Call recording

### Phase 4 — Integrations (not started)
- `services/crm/index.ts` is a one-line stub — build out interface + registry (mirror `services/phone`'s pattern) once a real CRM target is scheduled
- Slack/Teams/email notifications

### Phase 5 — Advanced Intelligence (not started)
- Custom/industry-specific scoring models, historical analytics

## Technical Debt

- **No `Lead`/`Opportunity` ↔ `Call` relation** — schema has no `callId` FK, so once real data exists there's no way to trace an opportunity back to its originating call
- **Missing fields CLAUDE.md's workflow requires**: on `Call` — caller company, industry, company size, decision-maker requested, timeline, business needs, call category; on `Lead` — opportunity type/category, priority (distinct from status), recommended action text
- **`Company` has no `settings` field** despite being listed in CLAUDE.md's entity description
- **`CompanyMember` has no `role`** (owner vs. member) — every membership is currently equivalent
- **`services/crm` has no scaffolding** at all, inconsistent with the fully-built `services/phone`

## Known Issues

- Every dashboard/admin page renders from `lib/mock/*` — confirmed zero Prisma usage in `app/dashboard/**` and `app/admin/**`
- No application code path creates a `User`, `Company`, or `CompanyMember` row — a real Clerk signup has no DB presence today
- Twilio flow is one-way: plays `agent.greeting` via `<Say>` and ends the call; `AIAgent.qualificationQuestions` is stored in the schema but never asked
- `Call.transcript` and `Call.summary` are always written as `null` — nothing populates them
- No OpenAI/LLM package installed anywhere in `package.json`
- Marketing copy frames the product narrower ("sales calls/pitches") than CLAUDE.md's broader "business call intelligence" (vendors, partners, any business opportunity) — cosmetic, low priority

## Recommended Development Order

1. User/company provisioning on signup (unblocks everything else)
2. Company-scoped Prisma queries replacing mock data, one dashboard page at a time
3. Schema additions (`Lead.callId`, extracted-info fields, priority/recommendation) — do alongside step 2, not after
4. Clerk Organizations decision
5. First real AI conversation turn (`<Gather>` → LLM → structured extraction → score/summary)
6. Admin dashboard depth (usage, subscriptions, monitoring) — CLAUDE.md itself marks these "future capabilities"

## Future Features

- Live call transfer to a team member for high-priority opportunities
- CRM push integrations (Salesforce, HubSpot)
- Notification channels (Slack, Teams, email)
- Custom/industry-specific scoring models
- Historical trend analytics beyond the current 7-day view

## Next Immediate Task

Implement Clerk `user.created` webhook provisioning: create a `User` row, a default `Company`, and a `CompanyMember` linking them, so a real signup has a DB presence before any dashboard query can be made real.
