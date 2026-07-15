# Environment Variables

Copy `.env.example` to `.env` for local development. Never commit `.env` —
it is already excluded via `.gitignore`.

```bash
cp .env.example .env
```

When deploying, set the same variables in the Vercel project settings
(Project → Settings → Environment Variables) for each environment
(Production, Preview, Development) instead of committing them.

## Database

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. Format: `postgresql://user:password@host:5432/dbname?schema=public`. For local dev, run Postgres locally or use `npx prisma dev`. For production, use a hosted Postgres provider (Vercel Postgres, Neon, Supabase, RDS, etc). |
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
| `TWILIO_ACCOUNT_SID` | Account identifier. |
| `TWILIO_AUTH_TOKEN` | Server-only secret used to authenticate API requests. |
| `TWILIO_PHONE_NUMBER` | The Twilio number Centro answers calls on, in E.164 format (e.g. `+15551234567`). |

## Notes

- Variables prefixed `NEXT_PUBLIC_` are inlined into the client bundle at
  build time — only use that prefix for values safe to expose publicly.
  Every other variable here is server-only and must stay out of client code.
- After changing `DATABASE_URL` locally, run `npx prisma generate` (also
  runs automatically via `postinstall` after `npm install`).
