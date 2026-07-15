-- AlterTable
ALTER TABLE "calls" ADD COLUMN     "providerCallId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "calls_providerCallId_key" ON "calls"("providerCallId");
