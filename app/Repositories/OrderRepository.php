<?php
namespace App\Repositories;

use App\Core\Database;

class OrderRepository
{
    private \PDO $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    /**
     * @param array $validProducts
     */

    public function createOrder(
        string $customerName,
        string $customerEmail,
        string $customerPhone,
        array $validProducts,
        float $calculatedTotal,
        string $deliveryAddr,
        $lat,
        $lng
    ): int {
        $products_json = json_encode($validProducts, JSON_UNESCAPED_UNICODE);

        $stmt_insert = $this->pdo->prepare(
            "INSERT INTO orders (customer_name, customer_email, customer_phone, products_json, total, delivery_addr, lat, lng)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt_insert->execute([
            $customerName,
            $customerEmail,
            $customerPhone,
            $products_json,
            $calculatedTotal,
            $deliveryAddr,
            $lat,
            $lng
        ]);

        $order_id = $this->pdo->lastInsertId();
        return (int)$order_id;
    }
}

