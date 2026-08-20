ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "produceKey" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "products_produceKey_key" ON "products"("produceKey") WHERE "produceKey" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "product_families" (
  "id" TEXT PRIMARY KEY,
  "familyKey" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3)
);
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "familyId" TEXT;
DO $$ BEGIN
  ALTER TABLE "products" ADD CONSTRAINT "products_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "product_families"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TABLE IF NOT EXISTS "educational_articles" (
  "id" TEXT PRIMARY KEY,
  "familyId" TEXT,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "body" TEXT NOT NULL,
  "articleType" TEXT NOT NULL DEFAULT 'BENEFITS',
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "coverImageUrl" TEXT,
  "coverImageSourceUrl" TEXT,
  "coverImageLicense" TEXT,
  "sourceUrls" JSONB,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP(3),
  CONSTRAINT "educational_articles_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "product_families"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "article_products" (
  "id" TEXT PRIMARY KEY,
  "articleId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  CONSTRAINT "article_products_articleId_productId_key" UNIQUE ("articleId", "productId"),
  CONSTRAINT "article_products_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "educational_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "article_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "educational_articles_familyId_status_idx" ON "educational_articles"("familyId", "status");
CREATE INDEX IF NOT EXISTS "article_products_productId_idx" ON "article_products"("productId");
CREATE TABLE IF NOT EXISTS "consultation_requests" (
  "id" TEXT PRIMARY KEY,
  "contactName" TEXT NOT NULL,
  "contactPhone" TEXT,
  "contactEmail" TEXT,
  "goal" TEXT NOT NULL,
  "dietaryRestrictions" TEXT,
  "preferredContactTime" TEXT,
  "consent" BOOLEAN NOT NULL DEFAULT false,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "consultation_requests_status_createdAt_idx" ON "consultation_requests"("status", "createdAt");

INSERT INTO "product_families" ("id", "familyKey", "name", "description") VALUES
  ('education-family-apple', 'apple', 'التفاح', 'معلومات عامة ومقارنة أصناف التفاح.'),
  ('education-family-orange', 'orange', 'البرتقال', 'معلومات عامة ومقارنة أصناف البرتقال.')
ON CONFLICT ("familyKey") DO NOTHING;
INSERT INTO "educational_articles" ("id", "familyId", "slug", "title", "summary", "body", "articleType", "status", "sourceUrls") VALUES
  ('education-article-apple-basics', 'education-family-apple', 'apple-basics', 'دليل مبسط عن التفاح', 'معلومات غذائية عامة عن التفاح وطرق حفظه.', 'يقدم التفاح أليافًا وماءً ومغذيات متنوعة ضمن نظام غذائي متوازن. تختلف القيم حسب الصنف والحجم، ولا يُعد هذا المحتوى تشخيصًا أو علاجًا.', 'BENEFITS', 'PUBLISHED', '[]'::jsonb),
  ('education-article-orange-basics', 'education-family-orange', 'orange-basics', 'دليل مبسط عن البرتقال', 'معلومات عامة عن البرتقال واستخدامه في الغذاء اليومي.', 'البرتقال فاكهة غنية بالماء وتحتوي على فيتامينات ومركبات نباتية. تختلف الاحتياجات بين الأشخاص، واستشر مختصًا عند وجود حالة صحية خاصة.', 'BENEFITS', 'PUBLISHED', '[]'::jsonb)
ON CONFLICT ("slug") DO NOTHING;
