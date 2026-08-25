-- Qutoof Nature: product logistics metadata
-- Safe migration: all columns are nullable for backward compatibility.
BEGIN;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "weightValue" DOUBLE PRECISION;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "weightUnit" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "packageLength" DOUBLE PRECISION;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "packageWidth" DOUBLE PRECISION;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "packageHeight" DOUBLE PRECISION;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "shippingWeight" DOUBLE PRECISION;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "shippingClass" TEXT;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_logistics_values_nonnegative') THEN
    ALTER TABLE "products" ADD CONSTRAINT "products_logistics_values_nonnegative"
      CHECK ("weightValue" IS NULL OR "weightValue" >= 0)
      NOT VALID;
  END IF;
END $$;
COMMIT;
-- Rollback:
-- ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_logistics_values_nonnegative";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "shippingClass";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "shippingWeight";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "packageHeight";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "packageWidth";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "packageLength";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "weightUnit";
-- ALTER TABLE "products" DROP COLUMN IF EXISTS "weightValue";
