-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "salesTeamSize" TEXT,
ADD COLUMN     "primaryGoal" TEXT,
ADD COLUMN     "priorities" JSONB,
ADD COLUMN     "targetCustomer" TEXT,
ADD COLUMN     "notes" TEXT;
