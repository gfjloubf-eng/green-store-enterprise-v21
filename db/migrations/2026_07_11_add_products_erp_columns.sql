-- Additive, backward-compatible migration for ERP Products module.
-- Does NOT drop/rename columns.
-- Execute manually in phpMyAdmin or via your migration runner.

ALTER TABLE products
  ADD COLUMN sku VARCHAR(100) NULL,
  ADD COLUMN barcode VARCHAR(100) NULL,
  ADD COLUMN cost_price DECIMAL(10,2) NULL DEFAULT 0.00,
  ADD COLUMN stock_quantity INT NULL DEFAULT 0,
  ADD COLUMN image VARCHAR(255) NULL,
  ADD COLUMN status VARCHAR(50) NULL DEFAULT 'active',
  ADD COLUMN updated_at TIMESTAMP NULL DEFAULT NULL;

