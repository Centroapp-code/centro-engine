-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('PENDING', 'ANALYZED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CallCategory" AS ENUM ('SALES', 'VENDOR', 'PARTNERSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "OpportunityPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST');

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_companyId_fkey";

-- AlterTable
ALTER TABLE "calls" DROP COLUMN "summary",
ADD COLUMN     "status" "CallStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "leads";

-- DropEnum
DROP TYPE "LeadStatus";

-- CreateTable
CREATE TABLE "call_analyses" (
    "id" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "category" "CallCategory" NOT NULL DEFAULT 'OTHER',
    "summary" TEXT,
    "recommendation" TEXT,
    "opportunityScore" INTEGER,
    "extractedInfo" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "callId" TEXT,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "opportunityType" TEXT,
    "score" INTEGER,
    "priority" "OpportunityPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "OpportunityStatus" NOT NULL DEFAULT 'NEW',
    "recommendedAction" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "call_analyses_callId_key" ON "call_analyses"("callId");

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_callId_key" ON "opportunities"("callId");

-- CreateIndex
CREATE INDEX "opportunities_companyId_idx" ON "opportunities"("companyId");

-- AddForeignKey
ALTER TABLE "call_analyses" ADD CONSTRAINT "call_analyses_callId_fkey" FOREIGN KEY ("callId") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_callId_fkey" FOREIGN KEY ("callId") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

