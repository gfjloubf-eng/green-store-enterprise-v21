-- Qutoof Nature: product freshness and origin metadata
-- Safe migration: all new columns are nullable, so existing products remain valid.
BEGIN;

ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "originCountry" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "harvestDate" TIMESTAMPTZ;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "expiryDate" TIMESTAMPTZ;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "storageInstructions" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "qualityGrade" TEXT;

-- Reject impossible date ordering only when both values are present.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_expiry_after_harvest_check'
  ) THEN
    ALTER TABLE "products"
      ADD CONSTRAINT "products_expiry_after_harvest_check"
      CHECK ("harvestDate" IS NULL OR "expiryDate" IS NULL OR "expiryDate" >= "harvestDate");
  END IF;
END $$;

COMMIT;

-- Verification query:
-- SELECT "originCountry", "harvestDate", "expiryDate", "storageInstructions", "qualityGrade"
-- FROM "products" LIMIT 5;

-- Rollback (only if explicitly required):
-- ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_expiry_after_harvest_check";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "qualityGrade";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "storageInstructions";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "expiryDate";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "harvestDate";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "originCountry";
