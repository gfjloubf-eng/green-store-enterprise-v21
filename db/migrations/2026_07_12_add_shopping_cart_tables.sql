-- Additive migration: Shopping Cart Module (Sprint 9)

-- shopping_carts
CREATE TABLE shopping_carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  status VARCHAR(20) NOT NULL,

  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  discount_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  tax_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_shopping_carts_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE,

  KEY idx_shopping_carts_customer_id (customer_id),
  KEY idx_shopping_carts_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- shopping_cart_items
CREATE TABLE shopping_cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,

  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  line_total DECIMAL(12,2) NOT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_shopping_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_shopping_cart_items_cart_product (cart_id, product_id),
  KEY idx_shopping_cart_items_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


