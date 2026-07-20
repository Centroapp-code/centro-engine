# Centro Project Context

## Product

Centro is an AI-powered vendor call intelligence and business insights SaaS.

Centro helps companies handle the large volume of unsolicited sales and vendor calls they receive every day.

Companies receive calls from:

- Vendors
- Service providers
- Suppliers
- Software companies
- Logistics providers
- Consultants
- Partners

Many of these calls are interruptions, but some contain valuable business opportunities.

Centro acts as an AI receptionist and intelligence layer.

Centro answers vendor and sales calls, gathers relevant information, analyzes conversations, and identifies which opportunities deserve attention.

Centro transforms business calls into:

- Call summaries
- Vendor intelligence
- Opportunity scores
- Cost-saving opportunities
- Business recommendations
- Follow-up priorities

Centro is not primarily a sales representative.

The AI's role is:

- Professional receptionist
- Information collector
- Business analyst
- Opportunity evaluator

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

The dashboard should evolve into a business intelligence center where companies review and prioritize vendor conversations.

## Admin Dashboard

Internal Centro management.

Future:

- Customers
- Usage
- Billing
- System monitoring

---

# Core Workflow

Vendor/Sales Call

↓

Company Phone System

↓

Twilio

↓

Centro AI Receptionist

↓

Conversation Transcript

↓

AI Analysis Engine

↓

Information Extraction:

- Vendor/company information
- Product or service offered
- Industry/category
- Pricing information
- Claimed benefits
- Business impact
- Relevant details

↓

Opportunity Scoring

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

AI:
- OpenAI (planned)

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
[x] Overview page
[x] Calls page
[x] Opportunities page
[x] Analytics page
[x] Call → CallAnalysis → Opportunity schema
[x] Development seed data system
[x] Vendor-call-intelligence realignment (schema, services, onboarding, dashboard, admin, marketing copy, seed data — see Database Design Principles below for the current schema)

---

# Current Product State

Centro has moved from prototype stage into SaaS foundation stage.

The application currently supports:

- Authenticated users
- Customer companies
- Database-backed dashboards
- Company-scoped data
- Foundation for AI call intelligence

The next focus is building the AI intelligence layer.

Centro must understand business conversations and convert them into actionable insights.

The AI should not act as a salesperson.

The AI should act as:

- Professional receptionist
- Information collector
- Business analyst
- Opportunity evaluator

---

# Next Development Phase

## AI Phone Intelligence Platform

Build:

- Twilio phone integration
- AI receptionist conversations
- Speech capture
- Call transcription
- Vendor/company extraction
- Industry classification
- Information extraction
- AI summaries
- Business impact analysis
- Opportunity scoring
- Dashboard intelligence

---

# Future Roadmap

## Voice AI

- Twilio voice conversations
- Speech capture
- AI responses
- Live transfers
- Custom conversation workflows

## Intelligence Layer

- Industry-specific analysis
- Vendor comparisons
- Existing provider comparisons
- Cost-saving recommendations
- Business impact scoring
- Market insights

## Integrations

Future integrations:

- CRM systems
- ERP systems
- Procurement systems
- Vendor management platforms
- Slack
- Email notifications

## Advanced Features

- Custom AI agent configuration
- Multiple phone numbers
- Advanced analytics
- Usage tracking
- Billing
- Enterprise features

---

# Industry Flexibility

Centro must support multiple industries.

The platform should not be designed around one specific industry.

Examples:

## Manufacturing

Potential calls:

- Freight providers
- Material suppliers
- Equipment vendors
- Software providers

Potential insights:

- Cost savings
- Capacity improvements
- Better supplier options
- Operational improvements


## Healthcare

Potential calls:

- Medical suppliers
- Service providers
- Technology vendors

Potential insights:

- Cost comparisons
- Vendor evaluation
- Operational improvements


## Construction

Potential calls:

- Equipment providers
- Contractors
- Material suppliers

Potential insights:

- Pricing opportunities
- Availability
- Vendor recommendations


## Technology Companies

Potential calls:

- Software vendors
- Consulting companies
- Service providers

Potential insights:

- Tool comparisons
- Cost optimization
- Feature evaluation

Industry-specific intelligence should be configurable.

Avoid hardcoding business logic around one industry.

The core system should focus on:

- Understanding conversations
- Extracting structured information
- Evaluating opportunities
- Providing recommendations

---

# Database Design Principles

Centro should maintain a flexible, scalable data model.

Avoid designing around a single industry.

Prefer general concepts such as:

- Company
- Industry
- Call
- Vendor
- Vendor Category
- Call Analysis
- Opportunity
- Existing Provider
- Recommendation

Industry-specific intelligence should be implemented through configurable logic rather than separate hardcoded systems.

Currently implemented (as of the vendor-call-intelligence realignment):

- `IndustryProfile` — one per `Company`, holds `industry`, `vendorCategories`, `scoringPriorities`, `goals`, and `terminology` as configuration data, so industry-specific behavior never needs to be hardcoded in application code.
- `CallCategory` enum: `VENDOR | PARTNERSHIP | OTHER`.
- `OpportunityStatus` enum: `NEW | REVIEWED | FLAGGED | DISMISSED` — informational triage on a business opportunity, not a sales pipeline or deal-stage funnel.

---

# Development Rules

- Keep MVP simple.
- Build incrementally.
- Use production-quality implementations.
- Avoid unnecessary dependencies.
- Use reusable components.
- Keep database models scalable.
- Protect customer data isolation.
- Do not expose secrets.
- Do not hardcode environment variables.
- Test locally before pushing.
- Do not refactor unrelated code.
- Before major changes, inspect existing implementation.
- Before architectural changes, explain the approach, risks, and alternatives.
- Update documentation after major milestones.

---

# Feature Development Process

Before implementing major features:

1. Explain the proposed architecture.
2. Explain why it fits the existing system.
3. Identify security considerations.
4. Identify scalability considerations.
5. Identify possible risks and tradeoffs.
6. Wait for approval before making major architectural decisions.

Do not make assumptions that create technical debt.

---

# Extensibility

Centro should be built as a long-term SaaS platform.

Future features should be added through:

- Modular components
- Reusable services
- Clear database relationships
- Maintainable architecture
- Configurable industry logic

Avoid building one-off solutions.

Build Centro as a platform that can support thousands of companies across different industries.