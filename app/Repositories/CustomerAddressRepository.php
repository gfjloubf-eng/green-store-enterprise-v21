<?php

namespace App\Repositories;

use App\Core\Database;
use PDO;

class CustomerAddressRepository
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
            'INSERT INTO customer_addresses (
                customer_id,
                label,
                recipient_name,
                phone,
                country,
                city,
                district,
                street,
                building,
                floor,
                landmark,
                latitude,
                longitude,
                is_default,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $data['customer_id'],
            $data['label'],
            $data['recipient_name'],
            array_key_exists('phone', $data) ? $data['phone'] : null,
            array_key_exists('country', $data) ? $data['country'] : null,
            array_key_exists('city', $data) ? $data['city'] : null,
            array_key_exists('district', $data) ? $data['district'] : null,
            array_key_exists('street', $data) ? $data['street'] : null,
            array_key_exists('building', $data) ? $data['building'] : null,
            array_key_exists('floor', $data) ? $data['floor'] : null,
            array_key_exists('landmark', $data) ? $data['landmark'] : null,
            array_key_exists('latitude', $data) ? $data['latitude'] : null,
            array_key_exists('longitude', $data) ? $data['longitude'] : null,
            (int)$data['is_default'],
            $data['created_at'],
            $data['updated_at'],
        ]);

        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE customer_addresses
             SET label = ?,
                 recipient_name = ?,
                 phone = ?,
                 country = ?,
                 city = ?,
                 district = ?,
                 street = ?,
                 building = ?,
                 floor = ?,
                 landmark = ?,
                 latitude = ?,
                 longitude = ?,
                 is_default = ?,
                 updated_at = ?,
                 created_at = COALESCE(created_at, ?)
             WHERE id = ?'
        );

        $stmt->execute([
            $data['label'],
            $data['recipient_name'],
            array_key_exists('phone', $data) ? $data['phone'] : null,
            array_key_exists('country', $data) ? $data['country'] : null,
            array_key_exists('city', $data) ? $data['city'] : null,
            array_key_exists('district', $data) ? $data['district'] : null,
            array_key_exists('street', $data) ? $data['street'] : null,
            array_key_exists('building', $data) ? $data['building'] : null,
            array_key_exists('floor', $data) ? $data['floor'] : null,
            array_key_exists('landmark', $data) ? $data['landmark'] : null,
            array_key_exists('latitude', $data) ? $data['latitude'] : null,
            array_key_exists('longitude', $data) ? $data['longitude'] : null,
            (int)$data['is_default'],
            $data['updated_at'],
            $data['created_at'],
            $id,
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM customer_addresses WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM customer_addresses WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findAllByCustomerId(int $customerId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY id DESC');
        $stmt->execute([$customerId]);
        return $stmt->fetchAll();
    }

    public function findDefaultByCustomerId(int $customerId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM customer_addresses WHERE customer_id = ? AND is_default = 1 ORDER BY id DESC LIMIT 1');
        $stmt->execute([$customerId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function unsetDefaultExcept(int $customerId, int $addressId): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE customer_addresses SET is_default = 0 WHERE customer_id = ? AND id <> ?'
        );
        $stmt->execute([$customerId, $addressId]);
    }
}

