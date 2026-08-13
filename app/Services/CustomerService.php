<?php

namespace App\Services;

use App\Repositories\CustomerRepository;
use Exception;

class CustomerService
{
    private CustomerRepository $customerRepository;

    public function __construct(?CustomerRepository $customerRepository = null)
    {
        $this->customerRepository = $customerRepository ?? new CustomerRepository();
    }

    public function createCustomer(array $input): int
    {
        $firstName = (string)($input['first_name'] ?? '');
        $lastName = (string)($input['last_name'] ?? '');
        $fullName = trim($firstName . ' ' . $lastName);

        $phone = (string)($input['phone'] ?? '');
        $email = (string)($input['email'] ?? '');

        $status = (string)($input['status'] ?? 'active');

        $passwordHash = array_key_exists('password_hash', $input) ? $input['password_hash'] : null;
        $notes = array_key_exists('notes', $input) ? $input['notes'] : null;

        if ($this->customerRepository->existsByPhone($phone)) {
            throw new Exception('الهاتف موجود مسبقاً.');
        }
        if ($this->customerRepository->existsByEmail($email)) {
            throw new Exception('البريد الالكتروني موجود مسبقاً.');
        }

        $now = date('Y-m-d H:i:s');
        $customerCode = $this->generateUniqueCustomerCode();

        return $this->customerRepository->create([
            'customer_code' => $customerCode,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'full_name' => $fullName,
            'phone' => $phone,
            'email' => $email,
            'password_hash' => $passwordHash,
            'status' => $status,
            'notes' => $notes,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function updateCustomer(int $id, array $input): void
    {
        if ($id <= 0) {
            throw new Exception('معرف العميل غير صالح.');
        }

        $existing = $this->customerRepository->findById($id);
        if (!$existing) {
            throw new Exception('العميل غير موجود.');
        }

        $firstName = array_key_exists('first_name', $input) ? (string)$input['first_name'] : (string)($existing['first_name'] ?? '');
        $lastName = array_key_exists('last_name', $input) ? (string)$input['last_name'] : (string)($existing['last_name'] ?? '');
        $fullName = trim($firstName . ' ' . $lastName);

        $phone = array_key_exists('phone', $input) ? (string)$input['phone'] : (string)($existing['phone'] ?? '');
        $email = array_key_exists('email', $input) ? (string)$input['email'] : (string)($existing['email'] ?? '');

        $status = array_key_exists('status', $input) ? (string)$input['status'] : (string)($existing['status'] ?? 'active');

        $passwordHash = array_key_exists('password_hash', $input) ? $input['password_hash'] : ($existing['password_hash'] ?? null);
        $notes = array_key_exists('notes', $input) ? $input['notes'] : ($existing['notes'] ?? null);

        if ($this->customerRepository->existsByPhone($phone, $id)) {
            throw new Exception('الهاتف موجود مسبقاً.');
        }
        if ($this->customerRepository->existsByEmail($email, $id)) {
            throw new Exception('البريد الالكتروني موجود مسبقاً.');
        }

        $now = date('Y-m-d H:i:s');

        $this->customerRepository->update($id, [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'full_name' => $fullName,
            'phone' => $phone,
            'email' => $email,
            'password_hash' => $passwordHash,
            'status' => $status,
            'notes' => $notes,
            'updated_at' => $now,
            'created_at' => (string)($existing['created_at'] ?? $now),
        ]);
    }

    public function deleteCustomer(int $id): void
    {
        if ($id <= 0) {
            throw new Exception('معرف العميل غير صالح.');
        }

        $existing = $this->customerRepository->findById($id);
        if (!$existing) {
            throw new Exception('العميل غير موجود.');
        }

        $this->customerRepository->delete($id);
    }

    public function getCustomer(int $id): ?array
    {
        return $this->customerRepository->findById($id);
    }

    public function listCustomers(): array
    {
        return $this->customerRepository->findAll();
    }

    private function generateUniqueCustomerCode(): string
    {
        // Immutable ERP identifier generated server-side.
        // Format: CUST-YYYYMMDD-XXXXXX
        $tries = 0;
        while ($tries < 30) {
            $tries++;
            $date = date('Ymd');
            $rand = bin2hex(random_bytes(3)); // 6 hex chars
            $code = 'CUST-' . $date . '-' . strtoupper($rand);

            if (!$this->customerRepository->existsByCustomerCode($code)) {
                return $code;
            }
        }

        throw new Exception('تعذر توليد customer_code بشكل فريد.');
    }
}

