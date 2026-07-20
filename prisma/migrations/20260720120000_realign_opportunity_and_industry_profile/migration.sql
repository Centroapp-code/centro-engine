-- AlterEnum
BEGIN;
CREATE TYPE "OpportunityStatus_new" AS ENUM ('NEW', 'REVIEWED', 'FLAGGED', 'DISMISSED');
ALTER TABLE "public"."opportunities" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "opportunities" ALTER COLUMN "status" TYPE "OpportunityStatus_new" USING ("status"::text::"OpportunityStatus_new");
ALTER TYPE "OpportunityStatus" RENAME TO "OpportunityStatus_old";
ALTER TYPE "OpportunityStatus_new" RENAME TO "OpportunityStatus";
DROP TYPE "public"."OpportunityStatus_old";
ALTER TABLE "opportunities" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "ai_agents" DROP COLUMN "qualificationQuestions",
ADD COLUMN     "screeningQuestions" JSONB NOT NULL DEFAULT '[]',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "primaryGoal",
DROP COLUMN "priorities",
DROP COLUMN "salesTeamSize",
DROP COLUMN "targetCustomer",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "opportunities" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "industry_profiles" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "vendorCategories" JSONB NOT NULL DEFAULT '[]',
    "scoringPriorities" JSONB NOT NULL DEFAULT '[]',
    "terminology" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "industry_profiles_companyId_key" ON "industry_profiles"("companyId");

-- AddForeignKey
ALTER TABLE "industry_profiles" ADD CONSTRAINT "industry_profiles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

