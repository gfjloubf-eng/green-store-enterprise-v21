-- Additive Customers foundation extension.
ALTER TABLE "customers"
  ADD COLUMN "customerCode" TEXT,
  ADD COLUMN "fullName" TEXT,
  ADD COLUMN "passwordHash" TEXT,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "notes" TEXT;

UPDATE "customers"
SET "customerCode" = 'LEGACY-' || "id",
    "fullName" = trim("firstName" || ' ' || "lastName")
WHERE "customerCode" IS NULL OR "fullName" IS NULL;

ALTER TABLE "customers"
  ALTER COLUMN "customerCode" SET NOT NULL,
  ALTER COLUMN "fullName" SET NOT NULL;

CREATE UNIQUE INDEX "customers_customerCode_key" ON "customers"("customerCode");
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

ALTER TABLE "customer_addresses"
  ADD COLUMN "label" TEXT,
  ADD COLUMN "recipientName" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "district" TEXT,
  ADD COLUMN "street" TEXT,
  ADD COLUMN "building" TEXT,
  ADD COLUMN "floor" TEXT,
  ADD COLUMN "landmark" TEXT,
  ADD COLUMN "latitude" DOUBLE PRECISION,
  ADD COLUMN "longitude" DOUBLE PRECISION,
  ADD COLUMN "isDefault" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "updatedAt" TIMESTAMP(3);

UPDATE "customer_addresses" ca
SET "recipientName" = trim(c."firstName" || ' ' || c."lastName"),
    "phone" = coalesce(c."phone", ''),
    "country" = a."country",
    "city" = a."city",
    "district" = coalesce(a."state", ''),
    "street" = a."line1",
    "label" = a."label",
    "latitude" = a."latitude",
    "longitude" = a."longitude",
    "updatedAt" = CURRENT_TIMESTAMP
FROM "customers" c, "addresses" a
WHERE ca."customerId" = c."id"
  AND a."id" = ca."addressId";

ALTER TABLE "customer_addresses"
  ALTER COLUMN "recipientName" SET NOT NULL,
  ALTER COLUMN "phone" SET NOT NULL,
  ALTER COLUMN "country" SET NOT NULL,
  ALTER COLUMN "city" SET NOT NULL,
  ALTER COLUMN "district" SET NOT NULL,
  ALTER COLUMN "street" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL;
