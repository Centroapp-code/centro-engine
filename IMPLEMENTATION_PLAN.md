# Centro Implementation Plan

> Living document. Update after each major milestone — don't let this drift from the codebase like CLAUDE.md's vision once did.

## Current Project Status

The SaaS foundation is real, not a shell: real signup provisioning, four of five customer dashboard pages backed by company-scoped Prisma queries against Neon Postgres, and a seed system to populate realistic demo data. What's left before AI Intelligence (Phase 2) can start in earnest is finishing the last dashboard page (Settings) and closing a couple of consistency gaps (error boundaries, admin dashboard). No AI/LLM logic exists yet anywhere — that's the deliberate next phase, not an oversight.

## Completed Milestones

- [x] Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui (`@base-ui/react` variant) foundation
- [x] Marketing site (`app/(marketing)`) — gatekeeper positioning, hero/how-it-works/features/pricing/FAQ
- [x] Clerk authentication — sign up/in/out, `CUSTOMER`/`ADMIN` roles via `publicMetadata`, route protection in `proxy.ts`
- [x] **User/company provisioning** — `ensureUserWithCompany()` (`lib/db/provisioning.ts`) upserts a `User` + default `Company` + `CompanyMember` on first sign-in and via the Clerk `user.created` webhook; `getCurrentUser()`/`getCurrentCompany()`/`requireCustomerCompany()` helpers in `lib/auth/company.ts`
- [x] **Database migrated to Neon Postgres** — connection verified end-to-end (raw `pg`, Prisma Client, and a full `npm run build`), `sslmode=require` handled correctly by `pg-connection-string`
- [x] **Schema: Call → CallAnalysis → Opportunity** — `Lead` renamed to `Opportunity` with `callId` FK back to its originating `Call`, `priority`/`opportunityType`/`recommendedAction` added; new `CallAnalysis` model (`category`, `summary`, `recommendation`, `opportunityScore`, `extractedInfo` JSON) holds the AI's read on a call, kept separate from the raw `Call` record; `Call.status` lifecycle (`PENDING`/`ANALYZED`/`ARCHIVED`) added
- [x] **Customer dashboard — Overview**: real stats (`getOverviewStats`), recent calls, recent activity feed; Suspense + skeleton loading state
- [x] **Customer dashboard — Calls**: real company-scoped list with `CallAnalysis` join; loading skeleton; null-safe placeholders ("AI analysis pending," "No transcript recorded")
- [x] **Customer dashboard — Opportunities**: real list with priority/status badges and AI recommendation column; loading skeleton; **route-scoped `error.tsx`** (the only dashboard page with one so far)
- [x] **Customer dashboard — Analytics**: real stat cards + the two existing charts (call volume, opportunity status) fed real data; existing chart components kept as-is (only their type imports were swapped); empty states for both charts
- [x] **Development seed system** (`prisma/seed.ts`) — idempotent upserts create one demo company, one demo user, and 7 calls covering every `CallCategory`, `OpportunityPriority`, and `OpportunityStatus`, plus the "not yet analyzed" and "no caller name" edge cases; wired into `prisma.config.ts`'s `migrations.seed`; refuses to run when `NODE_ENV=production`
- [x] `services/phone` — `PhoneProvider` interface + registry + real `TwilioPhoneProvider`
- [x] Twilio webhooks (`/api/twilio/incoming-call`, `/api/twilio/call-status`) — signature-verified, write real `Call` rows, single static `<Say>` greeting
- [x] Deployment groundwork — README, `.env.example` (Neon-style template), `ENVIRONMENT.md`, `postinstall: prisma generate`

## Current Architecture

- **Auth**: Clerk (`proxy.ts` middleware + `lib/auth/*` server-side guards) → `lib/db/provisioning.ts` bridges every signed-in Clerk user to a Prisma `User`/`Company`/`CompanyMember` row, lazily and idempotently.
- **Dashboard data pattern** (Overview/Calls/Opportunities/Analytics, all identical shape):
  `app/dashboard/<page>/page.tsx` (static header only) → `<Suspense fallback={<...Skeleton />}>` → `components/dashboard/<page>-content.tsx` (async server component: `requireCustomerCompany()` then one or more `lib/db/queries/<page>.ts` calls, all company-scoped).
- **Query layer**: `lib/db/queries/{overview,calls,opportunities,analytics}.ts` — plain async functions taking `companyId`, no ORM leakage into components.
- **Settings** is the one dashboard page still on the old pattern: a single synchronous page reading `lib/mock/dashboard.ts` directly, with a client-side form (`AgentConfigForm`) that doesn't persist.
- **Phone**: `services/phone` (provider-agnostic interface + Twilio implementation) writes real `Call` rows on inbound webhooks, but the AI conversation is still a single static greeting — no `<Gather>`, no multi-turn state.
- **AI**: `services/ai` exists only as a stub (`startConversation()` returns the static greeting); no LLM SDK is installed.

## Current Database State

Schema (`prisma/schema.prisma`), migrated via 3 committed migrations (`20260715000000_init`, `20260716000000_add_call_provider_id`, `20260717000000_call_analysis_and_opportunity`), verified against the live Neon database (`_prisma_migrations` confirms all 3 applied, table list matches exactly):

- `User`, `Company`, `CompanyMember` — auth/tenancy backbone, fully wired to real signups
- `AIAgent`, `PhoneIntegration` — modeled, not yet read/written by any dashboard page (Settings is still mock)
- `Call` — raw record (transcript, duration, caller info, lifecycle `status`)
- `CallAnalysis` — one-to-one with `Call`, the AI's structured read (currently only populated by the seed script — no real analysis pipeline writes here yet)
- `Opportunity` — one-to-one optional with `Call` via `callId`, carries `score`/`priority`/`status`/`recommendedAction`/`opportunityType`

The database is otherwise empty aside from seed data (`seed-demo-company` + 7 calls) — no real customer traffic yet.

## Remaining Roadmap

### Phase 1 — SaaS Foundation (nearly done)
1. Wire Settings' Company profile + Phone number sections to real `Company`/`PhoneIntegration` reads
2. Persist `AgentConfigForm` against the real `AIAgent` model — the first *write* path in the customer dashboard (needs a server action; everything shipped so far has been read-only)
3. Add `error.tsx` to Overview, Calls, and Analytics (Opportunities already has one) — closes the one inconsistency in an otherwise uniform pattern
4. Decide build-vs-buy on **Clerk Organizations** vs. the hand-rolled `CompanyMember` table before extending multi-tenancy further (e.g. inviting a second user to a company — no invite flow exists today)
5. Schema additions CLAUDE.md's Settings spec still needs and has no model for: qualification rules, routing preferences, notifications, integrations

### Phase 2 — AI Intelligence (not started)
- Add an LLM SDK (none installed yet) and give `services/ai/conversation.ts` real logic beyond the static greeting
- Populate `CallAnalysis` from real calls: category, summary, recommendation, `opportunityScore`, `extractedInfo` (industry, company size, decision-maker, timeline, business needs)
- Opportunity creation/scoring/priority derived from analysis, not hand-seeded

### Phase 3 — Voice Platform (partially started)
- Add `<Gather input="speech">` to the Twilio flow so caller responses are actually captured (currently one greeting, then the call ends)
- Multi-turn conversation state across webhook requests
- Call recording

### Phase 4 — Integrations (not started)
- `services/crm/index.ts` is a one-line stub — build out interface + registry (mirror `services/phone`'s pattern) once a real CRM target is scheduled
- Slack/Teams/email notifications

### Phase 5 — Advanced Intelligence (not started)
- Custom/industry-specific scoring models, historical analytics beyond the current 7-day window

## Next Recommended Milestone

**Finish Settings** — wire the Company profile and Phone number sections to real `Company`/`PhoneIntegration` queries (read-only, matching how the other four pages started), then persist `AgentConfigForm` via a server action against `AIAgent`. This closes out Phase 1 entirely and gives the app its first real write path outside the Twilio webhooks — a natural, low-risk warm-up before Phase 2's AI work introduces the first LLM calls.
