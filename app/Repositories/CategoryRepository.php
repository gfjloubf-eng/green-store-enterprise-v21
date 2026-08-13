<?php

namespace App\Repositories;

use App\Core\Database;
use PDO;

class CategoryRepository
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
            'INSERT INTO categories (name, slug, description, status, sort_order, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, COALESCE(?, NOW()), COALESCE(?, NOW()))'
        );

        $stmt->execute([
            $data['name'],
            $data['slug'],
            $data['description'],
            $data['status'],
            $data['sort_order'],
            $data['created_at'],
            $data['updated_at'],
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE categories
             SET name = ?, slug = ?, description = ?, status = ?, sort_order = ?,
                 updated_at = ?, created_at = COALESCE(created_at, ?)
             WHERE id = ?'
        );

        $stmt->execute([
            $data['name'],
            $data['slug'],
            $data['description'],
            $data['status'],
            $data['sort_order'],
            $data['updated_at'],
            $data['created_at'],
            $id,
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
        return $stmt->fetchAll();
    }

    public function existsBySlug(string $slug, ?int $excludeId = null): bool
    {
        if ($excludeId !== null) {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM categories WHERE slug = ? AND id <> ?');
            $stmt->execute([$slug, $excludeId]);
        } else {
            $stmt = $this->pdo->prepare('SELECT COUNT(*) AS c FROM categories WHERE slug = ?');
            $stmt->execute([$slug]);
        }

        $row = $stmt->fetch();
        return (int)($row['c'] ?? 0) > 0;
    }
}

