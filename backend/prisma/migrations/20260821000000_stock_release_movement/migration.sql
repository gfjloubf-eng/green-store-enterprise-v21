-- Allow explicit release movements when an order reservation is canceled.
-- PostgreSQL enum additions are transactional-safe when added before table writes.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'StockMovementType' AND e.enumlabel = 'RELEASE'
  ) THEN
    ALTER TYPE "StockMovementType" ADD VALUE 'RELEASE';
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS "stock_movements_createdAt_idx" ON "stock_movements"("createdAt");
CREATE INDEX IF NOT EXISTS "stock_movements_type_createdAt_idx" ON "stock_movements"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "inventories_warehouseId_available_idx" ON "inventories"("warehouseId", "available");

ALTER TABLE "inventories"
  ADD CONSTRAINT "inventories_non_negative_quantities"
  CHECK ("quantity" >= 0 AND "reserved" >= 0 AND "available" >= 0 AND "reserved" <= "quantity");

ALTER TABLE "stock_movements"
  ADD CONSTRAINT "stock_movements_positive_quantity"
  CHECK ("quantity" > 0);

ALTER TABLE "stock_movements"
  ADD CONSTRAINT "stock_movements_reference_required_for_operations"
  CHECK ("type" IN ('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'RESERVATION', 'RELEASE') AND "quantity" > 0);
