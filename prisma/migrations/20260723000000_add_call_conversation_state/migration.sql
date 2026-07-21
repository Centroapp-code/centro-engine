-- AlterTable
ALTER TABLE "calls" ADD COLUMN     "conversationState" JSONB NOT NULL DEFAULT '{}';
