<?php

namespace App\Repositories;

use App\Core\Database;
use PDO;

class CustomerRepository
{
    private PDO $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function create(array $data): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO customers (
                customer_code,
                first_name,
                last_name,
                full_name,
                phone,
                email,
                password_hash,
                status,
                notes,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $data['customer_code'],
            $data['first_name'],
            $data['last_name'],
            $data['full_name'],
            $data['phone'],
            $data['email'],
            array_key_exists('password_hash', $data) ? $data['password_hash'] : null,
            $data['status'],
            array_key_exists('notes', $data) ? $data['notes'] : null,
            $data['created_at'],
            $data['updated_at'],
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE customers
             SET first_name = ?,
                 last_name = ?,
                 full_name = ?,
                 phone = ?,
                 email = ?,
                 password_hash = ?,
                 status = ?,
                 notes = ?,
                 updated_at = ?,
                 created_at = COALESCE(created_at, ?)
             WHERE id = ?'
        );

        $stmt->execute([
            $data['first_name'],
            $data['last_name'],
            $data['full_name'],
            $data['phone'],
            $data['email'],
            array_key_exists('password_hash', $data) ? $data['password_hash'] : null,
            $data['status'],
            array_key_exists('notes', $data) ? $data['notes'] : null,
            $data['updated_at'],
            $data['created_at'],
            $id,
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM customers WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM customers WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM customers ORDER BY id DESC');
        return $stmt->fetchAll();
    }

    public function existsByPhone(string $phone, ?int $excludeId = null): bool
    {
        if ($excludeId !== null) {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM customers WHERE phone = ? AND id <> ?');
            $stmt->execute([$phone, $excludeId]);
        } else {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM customers WHERE phone = ?');
            $stmt->execute([$phone]);
        }

        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }

    public function existsByEmail(string $email, ?int $excludeId = null): bool
    {
        if ($excludeId !== null) {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM customers WHERE email = ? AND id <> ?');
            $stmt->execute([$email, $excludeId]);
        } else {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM customers WHERE email = ?');
            $stmt->execute([$email]);
        }

        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }

    public function existsByCustomerCode(string $customerCode, ?int $excludeId = null): bool
    {
        if ($excludeId !== null) {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM customers WHERE customer_code = ? AND id <> ?');
            $stmt->execute([$customerCode, $excludeId]);
        } else {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM customers WHERE customer_code = ?');
            $stmt->execute([$customerCode]);
        }

        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }
}

