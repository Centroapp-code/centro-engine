# PROJECT_STATUS.md

# Centro

**Version:** v0.1 Foundation Complete  
**Last Updated:** July 2026

---

# Project Vision

Centro is an AI-powered vendor call intelligence platform.

Companies receive many unsolicited sales and vendor calls every day from:

- Suppliers
- Service providers
- Software companies
- Logistics providers
- Consultants
- Partners

Most of these calls are interruptions, but some contain valuable opportunities.

Centro connects to existing company phone systems and acts as an AI receptionist and business intelligence layer.

Centro answers vendor and sales calls, gathers information, analyzes conversations, and identifies which opportunities deserve attention.

Centro transforms business calls into:

- Call summaries
- Vendor intelligence
- Opportunity scores
- Cost-saving opportunities
- Business recommendations
- Follow-up priorities

Centro is not primarily an AI salesperson.

The AI's role is:

- Professional receptionist
- Information collector
- Business analyst
- Opportunity evaluator

The long-term goal is to become the intelligence layer companies use to understand and optimize vendor conversations.

---

# Current Status

✅ Foundation Phase Complete

Current focus:

- Production stability
- Secure authentication
- Multi-tenant architecture
- Professional onboarding
- Dashboard framework
- Deployment pipeline

The AI conversation and intelligence engine has NOT been started yet.

---

# Tech Stack

Frontend

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Authentication

- Clerk

Database

- PostgreSQL
- Neon

ORM

- Prisma

Deployment

- Vercel

Phone

- Twilio (basic infrastructure only)

AI

- OpenAI (planned)

Version Control

- Git
- GitHub

---

# Architecture

Centro follows a multi-tenant SaaS architecture.

Each customer owns:

Company
    ├── Users
    ├── AI Configuration
    ├── Calls
    ├── Call Analysis
    ├── Opportunities
    └── Settings

Every database query is scoped to companyId.

No customer should ever have access to another customer's data.

---

# Authentication Flow

Clerk handles:

- Sign Up
- Sign In
- Sessions
- Middleware
- Organizations (future)

Provisioning Flow

User signs up

↓

ensureUserWithCompany()

↓

User record

↓

Company record

↓

CompanyMember record

↓

Redirect to onboarding

↓

Complete onboarding

↓

Dashboard

Authentication is production-ready.

---

# Onboarding

Professional multi-step onboarding wizard.

Current questions include:

- Company name
- Industry
- Company size
- Website
- Primary business goals
- Business priorities
- Communication preferences

Results populate:

Company

AI configuration

User onboarding status

The onboarding flow is complete.

Future onboarding improvements may include:

- Existing vendor information
- Business categories
- Current providers
- Evaluation criteria

---

# Dashboard

Completed pages:

- Overview
- Calls
- Analytics
- Opportunities
- Settings

Dashboard includes:

- Sidebar
- Layout
- Authentication
- Error boundaries
- Loading states

Current analytics are placeholders until AI and Twilio are connected.

Future dashboard purpose:

Review and prioritize analyzed vendor conversations.

---

# Database

Current models include:

User

Company

CompanyMember

AIAgent

Call

CallAnalysis

Opportunity

The database design should remain flexible for multiple industries.

Future models may include:

- Vendor
- VendorCategory
- ExistingProvider
- Recommendation
- IndustryProfile

Database migrations are synchronized.

Production schema matches local schema.

---

# Deployment

Hosting

Vercel

Database

Neon PostgreSQL

Authentication

Clerk Production

Build Pipeline

prisma migrate deploy

↓

next build

↓

Deploy

Environment variables validated at startup.

---

# Security

Completed

✅ Multi-tenant authorization

✅ Clerk middleware

✅ Server-only environment variables

✅ Typed environment validation

✅ Structured logging

✅ Error boundaries

✅ API error handling

✅ Webhook validation

✅ Twilio signature verification

✅ Clerk webhook verification

✅ Rate limiting

No known production security issues.

---

# Coding Standards

Always

- TypeScript
- Server Components by default
- Client Components only when required
- Prisma through centralized database layer
- Environment variables through lib/env.ts
- Company-scoped queries
- Reusable UI components
- Production-first code

Never

- Access process.env directly
- Bypass company authorization
- Duplicate business logic
- Store secrets in client code
- Introduce mock data into production features
- Hardcode logic for only one industry

---

# Development Workflow

For every completed feature:

git status

↓

npm run build

↓

Manual local testing

↓

git add .

↓

git commit

↓

git push

Verify:

- Vercel deployment
- Neon database
- Clerk
- Build logs

---

# Current Environment

Production services:

✅ Vercel

✅ Neon

✅ Clerk

Twilio account exists but production voice integration has not begun.

---

# Remaining Technical Debt

Minor:

- Monitoring (Sentry)
- Global distributed rate limiting
- Automated tests
- Health endpoint improvements
- Composite database indexes

None block AI development.

---

# Roadmap

## Phase 2

AI Phone Intelligence Platform

- Twilio phone integration
- Incoming vendor/sales calls
- Call lifecycle management
- AI receptionist
- Speech pipeline
- Call transcription
- Conversation analysis
- Information extraction
- Vendor identification
- Opportunity scoring
- Call summaries
- Dashboard intelligence

---

## Phase 3

Business Intelligence Layer

- Industry-aware analysis

- Vendor comparisons

- Existing provider comparisons

- Cost-saving insights

- Business recommendations

- Analytics improvements

- CRM/ERP/procurement integrations

---

## Phase 4

SaaS Platform

- Billing

- Stripe

- Plans

- Team management

- Usage limits

- Multiple phone numbers

- Multiple AI configurations

- Enterprise features

---

# Design Philosophy

Every feature should satisfy:

1. Production-ready

2. Secure

3. Multi-tenant

4. Scalable

5. Maintainable

Avoid shortcuts that create technical debt.

Build a strong foundation first, then add intelligent capabilities.

---

# Current State

Foundation Complete.

The next development phase begins with building Centro's AI-powered phone intelligence platform.