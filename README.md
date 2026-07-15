# Centro

Centro is an AI-powered sales phone agent SaaS. Companies route their
existing "Press 6 for Sales" phone menu option to Centro, which answers
inbound sales calls, qualifies the caller, collects contact details, scores
the lead, summarizes the call, and transfers qualified leads to a human
sales rep.

The project has two main parts:

- **Marketing site** — explains the product, pricing, and handles sign-up/login.
- **Centro dashboard** — where customers configure their AI agent, phone
  routing, and view calls, transcripts, and leads.
- **Admin app** — internal tool for Centro staff to manage customers,
  companies, subscriptions, and usage.

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

```
app/
  (marketing)/     Public marketing pages
  dashboard/       Customer dashboard (protected)
  admin/           Internal admin app (protected)
  api/             API route handlers
  sign-in/         Clerk sign-in
  sign-up/         Clerk sign-up
  api/webhooks/clerk/  Assigns the default CUSTOMER role on sign-up
proxy.ts           Clerk middleware — protects /dashboard and /admin,
                   and enforces CUSTOMER → /dashboard, ADMIN → /admin

components/
  ui/              Reusable shadcn/ui components
  auth/            AppHeader, SignOutButton — shared dashboard/admin chrome

lib/
  db/              Prisma client singleton + generated client
  auth/            Clerk server helpers, roles, and route guards
  utils.ts         Shared utilities

services/
  ai/              OpenAI-based qualification, scoring, summarization
  phone/           Twilio Voice call handling
  crm/             CRM integrations for pushing qualified leads

prisma/
  schema.prisma    Database schema
```

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

3. Push the Prisma schema to your database once `DATABASE_URL` is set:

   ```bash
   npx prisma db push
   ```

4. Complete the one-time Clerk Dashboard setup described in
   [ENVIRONMENT.md](./ENVIRONMENT.md#roles-customer--admin) — a session
   token claim for roles, and a webhook endpoint for the `CLERK_WEBHOOK_SECRET`.
   For local development, use the Clerk CLI or a tunnel (e.g. `ngrok`) so
   Clerk can reach `http://localhost:3000/api/webhooks/clerk`.

5. Run the dev server:

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
   Environment Variables, using production credentials (production Clerk
   keys, a production Postgres `DATABASE_URL`, live OpenAI/Twilio keys).
4. `npm install` runs `postinstall` → `prisma generate` automatically on
   Vercel, so the generated Prisma client is always in sync with
   `prisma/schema.prisma` — no manual step needed.
5. Database schema changes should be applied with `npx prisma migrate deploy`
   (or `db push` during early development) against the production database
   before or as part of the deploy — Vercel does not run this automatically.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
