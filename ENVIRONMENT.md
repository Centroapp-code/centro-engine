# Environment Variables

Copy `.env.example` to `.env` for local development. Never commit `.env` —
it is already excluded via `.gitignore`.

```bash
cp .env.example .env
```

When deploying, set the same variables in the Vercel project settings
(Project → Settings → Environment Variables) for each environment
(Production, Preview, Development) instead of committing them.

## Validation

`lib/env.ts` centralizes and validates every server-only variable listed
below. `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`,
`CLERK_SECRET_KEY`, and `CLERK_WEBHOOK_SECRET` are required — importing
`lib/env.ts` throws immediately if any of them are missing, instead of
failing later inside Prisma, Clerk, or a webhook handler. `instrumentation.ts`
imports it once at server startup, so a missing variable fails the
deployment loudly rather than surfacing as a confusing error on whichever
request happens to hit it first.

`OPENAI_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and
`TWILIO_PHONE_NUMBER` are tracked as **optional** — typed `string | undefined`
— since those integrations haven't started yet. Server code should read all
of these through `env` (`import { env } from "@/lib/env"`), never
`process.env` directly.

## Database

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma — for both the app at runtime **and** `prisma migrate deploy` during the build (see [README § Deployment pipeline](./README.md#deployment-pipeline)), since `prisma.config.ts` only supports one `url`, not a separate migration-only URL. Centro runs on [Neon](https://neon.tech) — format: `postgresql://user:password@<endpoint>.neon.tech/<db>?sslmode=require`. Neon requires `sslmode=require` on every connection. Use the **direct** (non-pooled, no `-pooler` suffix) endpoint here — Prisma Migrate needs a direct connection (its migration lock doesn't reliably work through PgBouncer's transaction-mode pooler), and the direct endpoint is fine for the app's own query volume at this stage. If connection-limit pressure ever becomes a real issue under load, that's a deliberate future change (e.g. a separate migration-only URL), not something to default into now. |
| `SHADOW_DATABASE_URL` | Optional. Only used by `prisma migrate dev` to create/reset a throwaway shadow database when generating new migrations locally. Not needed for `prisma migrate deploy` or in production. |

## Authentication (Clerk)

Get these from the [Clerk Dashboard](https://dashboard.clerk.com) → your application → API Keys.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key, safe to expose to the browser. |
| `CLERK_SECRET_KEY` | Server-only secret key. Never expose to the client. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | App route for the sign-in page. Defaults to `/sign-in`. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | App route for the sign-up page. Defaults to `/sign-up`. |
| `CLERK_WEBHOOK_SECRET` | Signing secret for the `user.created` webhook at `/api/webhooks/clerk`, which assigns the default `CUSTOMER` role to every new sign-up. Get it from Dashboard → Webhooks → your endpoint → Signing Secret, after creating an endpoint pointed at `https://<your-domain>/api/webhooks/clerk` subscribed to the `user.created` event. |

Clerk provides separate key pairs for development and production instances —
use the matching pair for each Vercel environment, and create a separate
webhook endpoint (with its own signing secret) per environment.

### Production instance setup (required before a live custom domain works)

A Clerk **Development** instance (`pk_test_...`/`sk_test_...`) only works
natively on `localhost`. On any other domain it falls back to a "dev browser"
simulated-session handshake, which is not supported for real traffic and
fails outright on a custom domain — this is the cause behind a
`dev-browser-missing` auth failure on a deployed site. A live custom domain
**requires** a Clerk **Production** instance, which is a separate, one-time
setup step Clerk does not create automatically:

1. **Clerk Dashboard** → your application → create a **Production**
   instance (Clerk gates this behind domain verification, separate from the
   Development instance you've been using).
2. **Verify domain ownership** for your production domain by adding the
   DNS TXT/CNAME records Clerk provides, in your DNS provider.
3. Once verified, Clerk issues a new **`pk_live_...` / `sk_live_...`** key
   pair tied to that production instance — this is distinct from, and
   never interchangeable with, your `pk_test_`/`sk_test_` pair.
4. In **Vercel** → Project Settings → Environment Variables, set
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to the new
   `pk_live_`/`sk_live_` values, **scoped to the Production environment
   only**. Leave `pk_test_`/`sk_test_` set for Preview/Development so local
   work is unaffected.
5. The production instance has its **own webhook** and its **own signing
   secret** — it does not share one with the development instance. Create a
   new endpoint (Dashboard → Webhooks, on the production instance) pointed
   at `https://<your-production-domain>/api/webhooks/clerk`, subscribed to
   `user.created`, and set its signing secret as `CLERK_WEBHOOK_SECRET`
   scoped to the Production environment in Vercel.
6. **Redeploy** — Vercel does not hot-swap environment variables into an
   already-built deployment; trigger a new deployment so the live instance
   picks up the new keys.
7. Repeat the [session token claim](#roles-customer--admin) step on the
   *production* instance too — session token customization is
   per-instance, not shared with development.

### Roles (CUSTOMER / ADMIN)

Centro stores each user's role in Clerk's `publicMetadata.role`. Two
one-time setup steps are required in the Clerk Dashboard — they can't be
done from code:

1. **Session token claim**: Dashboard → Configure → Sessions → Customize
   session token → add `{"metadata": "{{user.public_metadata}}"}`. Without
   this, `sessionClaims.metadata` is empty and every user is treated as the
   default `CUSTOMER` role.
2. **Promoting an admin**: new sign-ups always default to `CUSTOMER` (set by
   the webhook above). To make someone an `ADMIN`, open Dashboard → Users →
   the user → Metadata → Public metadata, and set:
   ```json
   { "role": "ADMIN" }
   ```
   There is no self-serve way to become an admin — this is intentional.

## AI (OpenAI)

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Server-only secret from the [OpenAI Platform](https://platform.openai.com/api-keys). Powers call qualification, lead scoring, and summarization in `services/ai`. |

## Phone (Twilio Voice)

Get these from the [Twilio Console](https://console.twilio.com).

| Variable | Description |
| --- | --- |
| `TWILIO_ACCOUNT_SID` | Account identifier. Reserved for provisioning/transfer/end-call features, not used yet. |
| `TWILIO_AUTH_TOKEN` | Server-only secret. Used today to verify the `X-Twilio-Signature` header on both webhooks below, so every incoming request is confirmed to actually come from Twilio. |
| `TWILIO_PHONE_NUMBER` | Reserved for provisioning a number via the API; not used by the webhooks, which identify the company from the `To` number Twilio sends on each request instead. |

### Webhooks

Point a Twilio phone number's Voice configuration at:

- **A call comes in** → `https://<your-domain>/api/twilio/incoming-call`
- **Call status changes** → `https://<your-domain>/api/twilio/call-status`

Both require `TWILIO_AUTH_TOKEN` to be set — requests with a missing or
invalid signature are rejected with `403` before any business logic runs.
For local development, use a tunnel (e.g. `ngrok`) so Twilio can reach
`http://localhost:3000`.

## Notes

- Variables prefixed `NEXT_PUBLIC_` are inlined into the client bundle at
  build time — only use that prefix for values safe to expose publicly.
  Every other variable here is server-only and must stay out of client code.
- After changing `DATABASE_URL` locally, run `npx prisma generate` (also
  runs automatically via `postinstall` after `npm install`).
