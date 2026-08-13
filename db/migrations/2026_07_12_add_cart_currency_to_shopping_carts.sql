-- Additive migration: Add cart currency support (Sprint 9.1)
-- IMPORTANT: Do NOT modify previous shopping cart migration.

ALTER TABLE shopping_carts
  ADD COLUMN currency CHAR(3) NOT NULL DEFAULT 'YER';

