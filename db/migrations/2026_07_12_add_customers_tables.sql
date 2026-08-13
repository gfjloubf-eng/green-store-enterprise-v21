-- Additive migration: Customers + Customer Addresses (Sprint 8)

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,

  customer_code VARCHAR(30) NOT NULL,

  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(201) NOT NULL,

  phone VARCHAR(30) NOT NULL,
  email VARCHAR(190) NOT NULL,

  password_hash VARCHAR(255) NULL,

  status VARCHAR(20) NOT NULL,
  notes TEXT NULL,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_customers_customer_code (customer_code),
  UNIQUE KEY uq_customers_phone (phone),
  UNIQUE KEY uq_customers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer addresses table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,

  customer_id INT NOT NULL,

  label VARCHAR(60) NOT NULL,
  recipient_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NULL,

  country VARCHAR(80) NULL,
  city VARCHAR(80) NULL,
  district VARCHAR(80) NULL,
  street VARCHAR(120) NULL,
  building VARCHAR(40) NULL,
  floor VARCHAR(40) NULL,
  landmark VARCHAR(120) NULL,

  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,

  is_default TINYINT(1) NOT NULL DEFAULT 0,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_customer_addresses_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE CASCADE,

  KEY idx_customer_addresses_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


