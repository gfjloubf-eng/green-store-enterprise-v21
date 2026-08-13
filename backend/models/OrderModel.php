<?php

class OrderModel {
    private $pdo;

    public function __construct() {
        $this->pdo = \App\Core\Database::getInstance()->getConnection();
    }

    public function getAllOrders($limit = 20) {
        $stmt = $this->pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT " . (int)$limit);
        return $stmt->fetchAll();
    }

    public function createOrder($customer_name, $customer_email, $customer_phone, $products_json, $total, $delivery_addr, $lat, $lng) {
        $stmt = $this->pdo->prepare("INSERT INTO orders (customer_name, customer_email, customer_phone, products_json, total, delivery_addr, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $result = $stmt->execute([$customer_name, $customer_email, $customer_phone, $products_json, $total, $delivery_addr, $lat, $lng]);

        if ($result) {
            return $this->pdo->lastInsertId();
        }
        return false;
    }
}
?>

