-- DropIndex
DROP INDEX "ai_agents_companyId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ai_agents_companyId_key" ON "ai_agents"("companyId");
