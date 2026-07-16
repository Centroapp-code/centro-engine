# Centro Project Context

## Product

Centro is an AI-powered sales gatekeeper and business call intelligence SaaS.

Centro connects to existing company phone systems and handles inbound business calls.

Example:

"Press 4 for Sales"

Centro answers, qualifies the caller, analyzes the conversation, and provides structured intelligence to the company.

Centro transforms inbound calls into:

- Call summaries
- Opportunity scores
- Business insights
- Recommended actions

---

# Current Architecture

Centro has three main systems:

## Marketing Website

Public website explaining Centro.

## Customer Dashboard

Used by paying companies.

Features:

- Overview
- Calls
- Opportunities
- Analytics
- Settings

## Admin Dashboard

Internal Centro management.

Future:

- Customers
- Usage
- Billing
- System monitoring

---

# Core Workflow

Inbound Call

↓

Twilio Phone System

↓

Centro AI Agent

↓

Transcript

↓

AI Analysis

↓

Opportunity Score

↓

Customer Dashboard

---

# Current Tech Stack

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Next.js server actions/API routes
- Prisma ORM

Database:
- PostgreSQL
- Neon

Authentication:
- Clerk

Voice:
- Twilio

Hosting:
- Vercel

---

# Current Completed Features

[x] Marketing website
[x] Customer dashboard UI
[x] Admin dashboard foundation
[x] Clerk authentication
[x] Prisma setup
[x] Neon PostgreSQL
[x] Vercel deployment
[x] User/company SaaS foundation
[x] Company data isolation
[x] Dashboard connected to database
[x] Calls page
[x] Opportunities page
[x] Analytics page

---

# Current Product State

Centro has moved from prototype stage into SaaS foundation stage.

The application currently supports:

- Authenticated users
- Customer companies
- Database-backed dashboards
- Company-scoped data

The next focus is AI intelligence.

---

# Next Development Phase

## AI Intelligence Layer

Build:

- OpenAI integration
- Call transcription
- Call summaries
- Information extraction
- Opportunity scoring
- AI recommendations

---

# Future Roadmap

## Voice AI

- Twilio voice conversations
- Speech capture
- AI responses
- Live transfers

## Integrations

- Salesforce
- HubSpot
- Slack
- Email notifications

## Advanced Features

- Custom qualification workflows
- AI agent configuration
- Analytics improvements
- Multiple phone numbers

---

# Development Rules

- Keep MVP simple.
- Build incrementally.
- Avoid unnecessary dependencies.
- Use reusable components.
- Keep database models scalable.
- Protect customer data isolation.
- Do not expose secrets.
- Do not hardcode environment variables.
- Test locally before pushing.
- Do not refactor unrelated code.
- Before major changes, inspect existing implementation.
- Update documentation after major milestones.

---

# Extensibility

Centro should be built as a long-term SaaS platform.

Future features should be added through:

- Modular components
- Reusable services
- Clear database relationships
- Maintainable architecture

Avoid building one-off solutions.