<?php

namespace App\Repositories;

use App\Core\Database;
use PDO;

class ShoppingCartRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    // -------------------- Cart SQL --------------------

    public function createCart(int $customerId, string $status, array $totals): int
    {
        $stmt = $this->pdo->prepare(
'INSERT INTO shopping_carts (customer_id, status, currency, subtotal, discount_total, tax_total, grand_total, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())'
        );

        $stmt->execute([
            $customerId,
            $status,
            'YER',
            (float)($totals['subtotal'] ?? 0),
            (float)($totals['discount_total'] ?? 0),
            (float)($totals['tax_total'] ?? 0),
            (float)($totals['grand_total'] ?? 0),
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function findActiveCartByCustomerId(int $customerId): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM shopping_carts WHERE customer_id = ? AND status = ? ORDER BY id DESC LIMIT 1'
        );
        $stmt->execute([$customerId, 'ACTIVE']);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findCartById(int $cartId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM shopping_carts WHERE id = ?');
        $stmt->execute([$cartId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function updateCartTotals(int $cartId, array $totals): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE shopping_carts
             SET subtotal = ?, discount_total = ?, tax_total = ?, grand_total = ?, updated_at = NOW()
             WHERE id = ?'
        );

        $stmt->execute([
            (float)($totals['subtotal'] ?? 0),
            (float)($totals['discount_total'] ?? 0),
            (float)($totals['tax_total'] ?? 0),
            (float)($totals['grand_total'] ?? 0),
            $cartId,
        ]);
    }

    // -------------------- Cart Items SQL --------------------

    public function findCartItem(int $cartId, int $productId): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM shopping_cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1'
        );
        $stmt->execute([$cartId, $productId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function insertCartItem(int $cartId, int $productId, int $quantity, float $unitPrice, float $lineTotal): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO shopping_cart_items (cart_id, product_id, quantity, unit_price, line_total, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())'
        );
        $stmt->execute([$cartId, $productId, $quantity, $unitPrice, $lineTotal]);
        return (int)$this->pdo->lastInsertId();
    }

    public function updateCartItemQuantityAndLineTotal(int $cartId, int $productId, int $quantity, float $unitPrice, float $lineTotal): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE shopping_cart_items
             SET quantity = ?, unit_price = ?, line_total = ?, updated_at = NOW()
             WHERE cart_id = ? AND product_id = ?'
        );
        $stmt->execute([$quantity, $unitPrice, $lineTotal, $cartId, $productId]);
    }

    public function removeCartItem(int $cartId, int $productId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM shopping_cart_items WHERE cart_id = ? AND product_id = ?');
        $stmt->execute([$cartId, $productId]);
    }

    public function clearCartItems(int $cartId): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM shopping_cart_items WHERE cart_id = ?');
        $stmt->execute([$cartId]);
    }

    public function listCartItems(int $cartId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM shopping_cart_items WHERE cart_id = ? ORDER BY id ASC'
        );
        $stmt->execute([$cartId]);
        return $stmt->fetchAll();
    }

    public function countCartItems(int $cartId): int
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM shopping_cart_items WHERE cart_id = ?');
        $stmt->execute([$cartId]);
        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0);
    }

    // -------------------- Product lookup --------------------

    public function findProductPriceById(int $productId): ?float
    {
        $stmt = $this->pdo->prepare('SELECT price FROM products WHERE id = ?');
        $stmt->execute([$productId]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return (float)$row['price'];
    }

    public function productExists(int $productId): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM products WHERE id = ?');
        $stmt->execute([$productId]);
        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }

    // -------------------- Customer lookup --------------------

    public function updateCartStatus(int $cartId, string $status): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE shopping_carts
             SET status = ?, updated_at = NOW()
             WHERE id = ?'
        );
        $stmt->execute([$status, $cartId]);
    }

    public function customerExists(int $customerId): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM customers WHERE id = ?');
        $stmt->execute([$customerId]);
        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }
}


