# Centro Project Context

## Product

Centro is an AI-powered sales gatekeeper and business call intelligence SaaS.

Centro connects to a company's existing phone system and acts as an intelligent first layer for inbound business calls.

Example:

A company adds Centro to their existing phone menu:

"Press 4 for Sales"

When a salesperson, vendor, partner, or business opportunity calls, Centro answers the call, understands the purpose of the conversation, qualifies the opportunity, and provides actionable intelligence to the company.

Centro helps companies:

- Reduce interruptions from low-value sales calls
- Protect employee time
- Capture valuable business opportunities
- Understand who is contacting them
- Prioritize important conversations
- Make better decisions about follow-ups

---

# Core Product Workflow

1. A company receives an inbound business/sales call.
2. Caller selects the sales option from the existing phone system.
3. Centro AI agent answers the call.
4. Centro collects relevant information:

- Caller name
- Caller company
- Industry
- Product/service offered
- Reason for contacting
- Company size
- Existing customers/use cases
- Decision maker requested
- Timeline
- Business needs

5. Centro analyzes the conversation.
6. AI generates:

- Call summary
- Opportunity score
- Priority level
- Recommended next action
- Extracted business information

7. Customer reviews everything inside the Centro dashboard.
8. High-value opportunities can be transferred to the appropriate team member.

---

# Product Positioning

Centro is NOT a traditional AI receptionist.

Centro is an AI sales gatekeeper that helps companies filter, understand, and prioritize inbound business conversations.

The main value proposition:

"Centro turns every inbound sales call into structured business intelligence."

---

# Platform Structure

Centro has two separate dashboard experiences.

---

# Customer Dashboard

Used by companies paying for Centro.

Purpose:

Provide customers with visibility into all inbound business calls and AI-generated insights.

Customers should be able to view:

- Calls
- Caller/company information
- Call summaries
- Transcripts
- Opportunity scores
- AI recommendations
- Rankings
- Analytics
- Settings

Main sections:

## Dashboard Overview

Shows:

- Total calls
- Qualified opportunities
- High-priority opportunities
- Average opportunity score
- Recent activity

## Calls

Shows:

- Caller
- Company
- Call category
- Date/time
- Duration
- Score
- Status

Each call should include:

- Summary
- Extracted information
- AI recommendation
- Transcript

## Opportunities

Shows:

- Company
- Opportunity type
- Score
- Priority
- Recommended action

## Analytics

Shows:

- Call volume
- Opportunity trends
- Average scores
- Common industries/categories
- Performance insights

## Settings

Allows customers to configure:

- Company profile
- Qualification rules
- Routing preferences
- Notifications
- Integrations

---

# Admin Dashboard

Internal Centro platform dashboard.

Purpose:

Manage the SaaS platform.

Future capabilities:

- Customer accounts
- Subscription management
- Usage monitoring
- Call monitoring
- AI performance monitoring
- System health
- Troubleshooting

---

# Current Development Status

Completed:

[x] Next.js application foundation  
[x] Marketing website  
[x] Clerk authentication  
[x] Prisma/database setup  
[x] Vercel deployment  
[x] Customer dashboard foundation  

Current focus:

Continue building Centro as a SaaS platform.

Prioritize:

1. Customer dashboard improvements
2. Database architecture
3. Mock call/opportunity data
4. AI analysis workflow
5. Voice AI integration

---

# Future Product Roadmap

## Phase 1 - SaaS Foundation

- Complete customer dashboard
- Create production database models
- Store companies, users, calls, and opportunities
- Implement permissions and organizations

## Phase 2 - AI Intelligence

- AI call analysis
- Automatic summaries
- Information extraction
- Opportunity scoring
- Recommendations

## Phase 3 - Voice Platform

- Twilio phone routing
- AI voice agent
- Real-time conversations
- Live call transfers
- Transcription

## Phase 4 - Integrations

- Salesforce
- HubSpot
- Slack
- Microsoft Teams
- Email notifications

## Phase 5 - Advanced Intelligence

- Custom scoring models
- Industry-specific qualification
- AI recommendations
- Historical analytics

---

# Database Direction

Design future database models around:

Company
|
Users
|
Calls
|
Call Analysis
|
Opportunities


Important entities:

## Company

Represents a Centro customer.

Examples:

- Company name
- Industry
- Settings
- Phone configuration

## Call

Represents an inbound business call.

Examples:

- Caller information
- Company contacted from
- Duration
- Transcript
- Summary
- Score
- Status

## Opportunity

Represents the business value of a call.

Examples:

- Company
- Category
- Score
- Priority
- Recommendation
- Status

---

# Current Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- PostgreSQL
- Clerk Authentication
- Twilio
- Vercel

---

# Development Rules

- Keep MVP simple.
- Build incrementally.
- Avoid unnecessary dependencies.
- Do not over-engineer.
- Use reusable components.
- Follow modern B2B SaaS design patterns.
- Do not refactor unrelated files.
- Do not modify working features unless necessary.
- Before making changes, inspect the existing implementation.
- Prefer practical solutions over complex architecture.
- Use mock data when integrations are not ready.
- Consider future AI and voice capabilities when designing components and database models.
- Maintain consistency with the Centro brand and product vision.