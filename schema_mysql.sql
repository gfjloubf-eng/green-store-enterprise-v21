-- MySQL Schema for green_store DB (Run in phpMyAdmin)
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  aliases TEXT,
  type ENUM('خضار', 'فاكهة') DEFAULT 'خضار',
  price DECIMAL(10,2) DEFAULT 0.00,
  img VARCHAR(255),
  description TEXT,
  stock INT DEFAULT 0,
  sugar_g DECIMAL(5,2),
  vitamins VARCHAR(255),
  potassium_high TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL, -- hashed
  phone VARCHAR(20),
  addr TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  products_json JSON, -- [{"id":1,"qty":2},...]
  total DECIMAL(10,2),
  status ENUM('pending','preparing','delivering','delivered','cancelled') DEFAULT 'pending',
  delivery_addr TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  addr TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  radius_km DECIMAL(5,2) DEFAULT 10
);

-- Insert products (adapted from old schema)
INSERT INTO products (name, aliases, type, price, img, description, sugar_g, vitamins, potassium_high) VALUES
('خيار طازج', 'خيار', 'خضار', 2.50, 'photo/pinterest_1761835345414.jpg', 'خيار طازج ومنعش', 1.7, 'K', 0),
('طماطم عضوية', 'بندورة', 'خضار', 3.00, 'photo/pinterest_1761835353985.jpg', 'طماطم عضوية غنية بفيتامين C', 3.9, 'C,K', 0),
('تفاح أحمر', 'تفاح', 'فاكهة', 4.20, 'photo/pinterest_1761835345414(1).jpg', 'تفاح أحمر محلي', 10, 'C', 0),
('فلفل ملون', 'فلفل', 'خضار', 3.50, 'photo/Bell_Peppers__All_About_Them.jpg', 'فلفل ملون طازج', 5.3, 'C,A', 0),
('موز', 'موز يمني', 'فاكهة', 2.80, '', 'الموز مصدر غني بالبوتاسيوم', 12, 'B6,C', 1),
('رمان', 'رمان يمني', 'فاكهة', 5.00, '', 'رمان مفيد للقلب', 13, 'C,K', 0);

-- Sample locations
INSERT INTO locations (name, addr, lat, lng) VALUES
('موقع التوصيل الرئيسي', 'وسط المدينة', 15.5527, 48.5227), -- Sanaa approx
('فرع الشمال', 'شمال المدينة', 15.6000, 48.5000),
('فرع الجنوب', 'جنوب المدينة', 15.5000, 48.5500);

-- Run: phpMyAdmin > green_store > Import this file.

