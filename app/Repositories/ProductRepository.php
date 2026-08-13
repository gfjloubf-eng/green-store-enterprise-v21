<?php

namespace App\Repositories;

use App\Core\Database;
use PDO;

class ProductRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    /**
     * Fetch product row with the same columns used by save_order.php.
     * Returns null if not found.
     */
    public function findByIdWithPrice(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, name, price FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM products ORDER BY name');
        return $stmt->fetchAll();
    }

    /**
     * Search products using the exact same logic previously executed in api.php.
     * When $q is empty, returns the same as findAll().
     */
    public function findAllBySearchQuery(string $q): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM products WHERE name LIKE ? OR aliases LIKE ? ORDER BY name'
        );
        $stmt->execute(["%$q%", "%$q%"]);
        return $stmt->fetchAll();
    }

    /**
     * Fetch product by id using SELECT * output (no transformation).
     * Returns null if not found.
     */
    public function findRawById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }


    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO products (name, aliases, barcode, sku, description, price, cost_price, stock_quantity, img, image, status, stock, type, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW()), COALESCE(?, NOW()))'
        );

        $stmt->execute([
            $data['name'],
            $data['aliases'],
            $data['barcode'],
            $data['sku'],
            $data['description'],
            $data['price'],
            $data['cost_price'],
            $data['stock_quantity'],
            $data['img'],
            $data['image'],
            $data['status'],
            $data['type'],
            $data['created_at'],
            $data['updated_at'],
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE products
             SET name = ?, aliases = ?, barcode = ?, sku = ?, description = ?, price = ?, cost_price = ?, stock_quantity = ?, img = ?, image = ?, status = ?, type = ?, updated_at = ?, created_at = COALESCE(created_at, ?)
             WHERE id = ?'
        );

        $stmt->execute([
            $data['name'],
            $data['aliases'],
            $data['barcode'],
            $data['sku'],
            $data['description'],
            $data['price'],
            $data['cost_price'],
            $data['stock_quantity'],
            $data['img'],
            $data['image'],
            $data['status'],
            $data['type'],
            $data['updated_at'],
            $data['created_at'],
            $id,
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function existsBySku(string $sku, ?int $excludeId = null): bool
    {
        if ($excludeId !== null) {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM products WHERE sku = ? AND id <> ?');
            $stmt->execute([$sku, $excludeId]);
        } else {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM products WHERE sku = ?');
            $stmt->execute([$sku]);
        }

        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }

    public function existsByBarcode(string $barcode, ?int $excludeId = null): bool
    {
        if ($excludeId !== null) {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM products WHERE barcode = ? AND id <> ?');
            $stmt->execute([$barcode, $excludeId]);
        } else {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM products WHERE barcode = ?');
            $stmt->execute([$barcode]);
        }

        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }
}


