# Centro

Centro is an AI-powered vendor call intelligence SaaS. Companies route
unsolicited vendor, supplier, and partner calls (freight companies,
software vendors, service providers, consultants, and other unsolicited
business callers) to Centro, which answers the call as a professional
receptionist, extracts structured information from the conversation,
analyzes its business relevance, and scores it as a potential business
improvement opportunity — not a sales lead.

Centro is **not** an AI sales representative, and opportunities surfaced by
Centro are **not** a sales pipeline. Centro's job is to protect employees'
time from low-value interruptions while making sure genuinely valuable
vendor conversations (a better freight rate, a relevant piece of software, a
real cost-saving opportunity) don't get lost.

The project has two main parts:

- **Marketing site** — explains the product, pricing, and handles sign-up/login.
- **Centro dashboard** — where customers configure their AI receptionist,
  phone routing, and view calls, transcripts, and opportunities.
- **Admin app** — internal tool for Centro staff to manage customers,
  companies, subscriptions, and usage.

  ## Current Project Status (Checkpoint)

Last updated: July 2026

### Completed

✅ Marketing website
- Landing page completed
- Product messaging implemented
- Footer updated with sales contact:
  - sales@centroengine.com
- Pricing section converted to "Coming Soon" preview
- Prepared sections for future branded imagery/assets

✅ Authentication
- Clerk authentication implemented
- Sign up / Sign in flows implemented
- User provisioning connected with Prisma
- Multi-tenancy handled through Company + CompanyMember models

✅ Database & Backend
- Neon PostgreSQL connected
- Prisma ORM configured
- Prisma singleton pattern implemented
- Database connection verified successfully

Verified:
- Prisma → Neon connection works
- Company records can be queried successfully

✅ Customer Dashboard
Implemented:
- Dashboard layout
- Calls section
- Opportunities section
- Analytics section
- Company-based data structure

### Current Infrastructure

| Service | Status |
| --- | --- |
| GitHub | Connected |
| Vercel | Connected |
| Neon PostgreSQL | Connected |
| Prisma | Configured |
| Clerk | Configured |

### Current Blocker

Production authentication issue:

Website:
https://centroengine.com

Issue:
- Local authentication works.
- Production signup/sign-in returns: `ERROR 225175667`

Root cause (confirmed): `centroengine.com` is running Clerk **Development**
keys (`pk_test_.../sk_test_...`). Confirmed directly against the live site —
both `/` and `/sign-in` return `x-clerk-auth-reason: dev-browser-missing` on
every fresh request. Development instances only work natively on
`localhost`; on a real custom domain the required "dev browser" handshake
isn't supported for production traffic and fails, which is what surfaces as
this error. `CLERK_WEBHOOK_SECRET` is also unset, which independently breaks
the `user.created` webhook (fails closed with a 500, so nothing insecure
happens — the app just falls back to lazily provisioning on first dashboard
visit instead).

Fix required (Clerk Dashboard + Vercel config only, no code changes) — see
[ENVIRONMENT.md § Production instance setup](./ENVIRONMENT.md#production-instance-setup-required-before-a-live-custom-domain-works)
for the exact steps:
1. Create a Clerk **Production** instance and verify `centroengine.com`.
2. Set the new `pk_live_`/`sk_live_` pair in Vercel, scoped to Production.
3. Create a **production** webhook endpoint and set its own
   `CLERK_WEBHOOK_SECRET`, scoped to Production.
4. Redeploy.

Do not begin AI/Twilio development until production authentication is stable.

---

## Next Development Phases

### Phase 1 — AI Intelligence (Next)

Build:

1. Industry / Vendor Intelligence Configuration
   - Company information
   - Industry profile (configurable, not hardcoded)
   - Relevant vendor categories
   - Scoring weights and criteria
   - Receptionist personality/greeting

2. AI Conversation Engine
   - OpenAI integration
   - Context-aware conversations
   - Vendor information capture (identity, offering, pricing, claimed
     savings, relevant details)

3. AI Analytics
   - Call summaries
   - Opportunity scoring
   - Business impact / potential savings analysis

### Phase 2 — Voice Integration

Twilio account needed here.

Build:
- Phone number provisioning
- Incoming call routing
- Speech-to-text
- AI voice responses
- Call recordings/transcripts

### Phase 3 — SaaS Features

Future:
- Billing
- Subscription management
- Usage tracking
- Customer onboarding
- Enterprise features
- CRM/ERP/procurement integrations (future extension, not core product)

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Backend | Next.js server actions and API routes |
| Database | PostgreSQL + Prisma ORM |
| Hosting | Vercel |
| Auth | Clerk |
| AI | OpenAI API |
| Phone | Twilio Voice API |

## Project structure

Inbound vendor/sales call
-> forwarded to a Centro phone number
-> Centro AI receptionist answers

Twilio is configured to call two webhooks (see
[ENVIRONMENT.md](./ENVIRONMENT.md#phone-twilio-voice) for setup):

- **`/api/twilio/incoming-call`** — on each new call: identifies the company
  from the `To` number (`PhoneIntegration`), loads its active `AIAgent`,
  speaks the greeting, and creates a `Call` row.
- **`/api/twilio/call-status`** — on call completion, fills in the `Call`
  row's `duration`.

Both routes are thin: signature verification, form parsing, and TwiML live
in `services/phone/providers/twilio-*`, while company lookup and agent
loading are plain service functions (`services/phone`, `services/ai`) that
know nothing about Twilio. Swapping providers means writing a new
`PhoneProvider` implementation, not touching the routes.

## Getting started

1. Install dependencies:

```bash
   npm install
```

2. Copy the environment template and fill in your own values (see
   [ENVIRONMENT.md](./ENVIRONMENT.md) for what each variable does and where
   to get it):

```bash
   cp .env.example .env
```

3. Apply the committed migrations to your database once `DATABASE_URL` is set:

```bash
   npx prisma migrate deploy
```

   When you change `prisma/schema.prisma` yourself, generate a new migration
   with `npx prisma migrate dev --name <description>` instead (requires
   `SHADOW_DATABASE_URL` — see [ENVIRONMENT.md](./ENVIRONMENT.md)).

4. Seed realistic demo data (a demo company, a demo customer user, inbound
   calls, AI analyses, and opportunities) so the customer dashboard has
   something to show:

```bash
   npx prisma db seed
```

   Safe to re-run — every row is upserted against a stable id, so seeding
   again updates the same demo records instead of duplicating them. The
   script refuses to run when `NODE_ENV=production`, as a safeguard against
   seeding a live database. See `prisma/seed.ts` for exactly what it creates.

   The seeded demo user has no real Clerk session, so signing in as
   yourself won't show this data automatically (your own sign-in provisions
   its own separate company). To view the seeded data in the dashboard,
   open `npx prisma studio`, find your own `User` row, and add a
   `CompanyMember` row linking your `userId` to `companyId: "seed-demo-company"`.

5. Complete the one-time Clerk Dashboard setup described in
   [ENVIRONMENT.md](./ENVIRONMENT.md#roles-customer--admin) — a session
   token claim for roles, and a webhook endpoint for the `CLERK_WEBHOOK_SECRET`.
   For local development, use the Clerk CLI or a tunnel (e.g. `ngrok`) so
   Clerk can reach `http://localhost:3000/api/webhooks/clerk`.

6. Run the dev server:

```bash
   npm run dev
```

   Open [http://localhost:3000](http://localhost:3000).

## Connecting this project to GitHub

This repo is already initialized locally (`git init` has been run and the
initial commit exists). To push it to GitHub:

1. Create a new, empty repository on GitHub (do **not** initialize it with a
   README, license, or `.gitignore` — this project already has its own).
2. Add it as a remote and push:

```bash
   git remote add origin https://github.com/<your-org-or-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
```

3. Verify on GitHub that `.env` and `lib/db/generated` were **not** uploaded
   — both are excluded via `.gitignore`. Only `.env.example` should appear.

## Preparing for Vercel deployment

The project is structured to deploy on Vercel with no custom configuration,
but deployment itself is a separate, explicit step — this section is
preparation only.

When you're ready to deploy:

1. Push the repo to GitHub (above).
2. In Vercel, import the GitHub repository as a new project. Vercel
   auto-detects Next.js — the default build (`next build`) and install
   (`npm install`) commands work as-is.
3. Before the first deploy, add every variable listed in
   [ENVIRONMENT.md](./ENVIRONMENT.md) under Project → Settings →
   Environment Variables, using production credentials (a production
   Postgres `DATABASE_URL`, live OpenAI/Twilio keys, and — critically — a
   Clerk **Production** instance's `pk_live_`/`sk_live_` keys, not the
   `pk_test_`/`sk_test_` pair used for local development. A custom domain
   cannot authenticate against a Development instance; see
   [ENVIRONMENT.md § Production instance setup](./ENVIRONMENT.md#production-instance-setup-required-before-a-live-custom-domain-works)
   for the full walkthrough, including the separate production webhook and
   `CLERK_WEBHOOK_SECRET`).
4. `npm install` runs `postinstall` → `prisma generate` automatically on
   Vercel, so the generated Prisma client is always in sync with
   `prisma/schema.prisma` — no manual step needed.
5. Migrations apply automatically as part of every Vercel deploy — see
   "Deployment pipeline" below. No manual `prisma migrate deploy` step is
   needed, and there's no way to ship a deploy that skips it.

## Deployment pipeline

Vercel runs a special `vercel-build` script instead of `build` when one is
present in `package.json` — this project defines one specifically so
migrations can never be forgotten again (a real incident this project has
already hit once: a deploy shipped ahead of its migrations, and the app
failed in production with `P2021: table "users" does not exist`).

```json
"build": "next build",
"vercel-build": "prisma migrate deploy && next build"
```

**Build-time order, on every Vercel deploy:**

1. `npm install` → triggers `postinstall` → `prisma generate` (regenerates
   the Prisma Client from `prisma/schema.prisma`, so it's always in sync
   with the committed schema before anything else runs).
2. Vercel detects `vercel-build` and runs it instead of `build`:
   1. `prisma migrate deploy` — applies any migrations under
      `prisma/migrations/` that aren't yet recorded in the production
      database's `_prisma_migrations` table, in order. Uses the same
      `DATABASE_URL` configured for the Production environment. Doesn't
      touch a shadow database (that's only for `prisma migrate dev`) and
      needs no separate credentials.
   2. The `&&` means a migration failure **stops the deploy immediately** —
      `next build` never runs, so Vercel never promotes new application
      code to run against a database schema it doesn't match. This is what
      makes skipping a migration structurally impossible: this script,
      not a person remembering a manual step, is what runs on every deploy.
   3. `next build` — only runs once migrations have succeeded.
3. Vercel deploys the build output, but doesn't yet route any traffic to it.

**Runtime startup order, on every cold start of the deployed app** (a new
serverless instance spinning up, independent of the build above):

1. Next.js's `instrumentation.ts` `register()` hook runs, once, before the
   instance accepts any request. In the Node.js runtime only, it calls
   `validateEnv()` (`lib/env.ts`) — if a required environment variable is
   missing, the instance throws immediately and fails to boot, rather than
   serving traffic that would fail unpredictably later. See
   [ENVIRONMENT.md § Validation](./ENVIRONMENT.md#validation).
2. Only after that succeeds does the instance begin serving requests:
   `proxy.ts` middleware runs per-request for protected routes, and
   `lib/db/client.ts`'s Prisma Client singleton is created lazily on first
   use.

Because the database schema is guaranteed migrated *before* `next build`
even runs (step 2.1 above), and environment variables are validated
*before* any instance serves traffic (runtime step 1), there's no ordering
gap where new application code could run against a stale schema or a
missing credential.

**One thing to verify yourself, not something this change can guarantee**:
if a Preview deployment's environment variables happen to point at the
*same* `DATABASE_URL` as Production (rather than its own database/branch),
`vercel-build` will run `prisma migrate deploy` against production from a
preview deploy too. This is almost certainly not your setup if you're using
Neon's per-branch databases as intended, but it's worth confirming in
Vercel's environment variable scoping (Production vs. Preview) rather than
assuming.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)