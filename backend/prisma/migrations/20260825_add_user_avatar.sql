-- Qutoof Nature: optional user profile avatar
-- Safe migration: nullable column; existing users remain valid.
BEGIN;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

COMMIT;

-- Verification:
-- SELECT "avatarUrl" FROM "users" LIMIT 5;

-- Rollback only if explicitly required:
-- ALTER TABLE "users" DROP COLUMN IF EXISTS "avatarUrl";
