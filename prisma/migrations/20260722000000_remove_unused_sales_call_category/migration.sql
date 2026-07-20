-- AlterEnum
BEGIN;
CREATE TYPE "CallCategory_new" AS ENUM ('VENDOR', 'PARTNERSHIP', 'OTHER');
ALTER TABLE "public"."call_analyses" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "call_analyses" ALTER COLUMN "category" TYPE "CallCategory_new" USING ("category"::text::"CallCategory_new");
ALTER TYPE "CallCategory" RENAME TO "CallCategory_old";
ALTER TYPE "CallCategory_new" RENAME TO "CallCategory";
DROP TYPE "public"."CallCategory_old";
ALTER TABLE "call_analyses" ALTER COLUMN "category" SET DEFAULT 'OTHER';
COMMIT;

