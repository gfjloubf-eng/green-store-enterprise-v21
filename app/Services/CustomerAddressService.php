<?php

namespace App\Services;

use App\Repositories\CustomerAddressRepository;
use App\Repositories\CustomerRepository;
use Exception;

class CustomerAddressService
{
    private CustomerAddressRepository $addressRepository;
    private CustomerRepository $customerRepository;

    public function __construct(
        ?CustomerAddressRepository $addressRepository = null,
        ?CustomerRepository $customerRepository = null
    ) {
        $this->addressRepository = $addressRepository ?? new CustomerAddressRepository();
        $this->customerRepository = $customerRepository ?? new CustomerRepository();
    }

    public function createAddress(int $customerId, array $input): int
    {
        if ($customerId <= 0) {
            throw new Exception('معرف العميل غير صالح.');
        }

        $customer = $this->customerRepository->findById($customerId);
        if (!$customer) {
            throw new Exception('العميل غير موجود.');
        }

        $now = date('Y-m-d H:i:s');

        $isDefault = array_key_exists('is_default', $input) ? (int)$input['is_default'] : 0;

        $addressData = [
            'customer_id' => $customerId,
            'label' => (string)($input['label'] ?? ''),
            'recipient_name' => (string)($input['recipient_name'] ?? ''),
            'phone' => array_key_exists('phone', $input) ? ($input['phone'] === null ? null : (string)$input['phone']) : null,
            'country' => array_key_exists('country', $input) ? ($input['country'] === null ? null : (string)$input['country']) : null,
            'city' => array_key_exists('city', $input) ? ($input['city'] === null ? null : (string)$input['city']) : null,
            'district' => array_key_exists('district', $input) ? ($input['district'] === null ? null : (string)$input['district']) : null,
            'street' => array_key_exists('street', $input) ? ($input['street'] === null ? null : (string)$input['street']) : null,
            'building' => array_key_exists('building', $input) ? ($input['building'] === null ? null : (string)$input['building']) : null,
            'floor' => array_key_exists('floor', $input) ? ($input['floor'] === null ? null : (string)$input['floor']) : null,
            'landmark' => array_key_exists('landmark', $input) ? ($input['landmark'] === null ? null : (string)$input['landmark']) : null,
            'latitude' => array_key_exists('latitude', $input) ? ($input['latitude'] === null ? null : $input['latitude']) : null,
            'longitude' => array_key_exists('longitude', $input) ? ($input['longitude'] === null ? null : $input['longitude']) : null,
            'is_default' => $isDefault ? 1 : 0,
            'created_at' => $now,
            'updated_at' => $now,
        ];

        $newId = $this->addressRepository->create($addressData);

        if ($isDefault) {
            // Enforce single default per customer.
            $this->addressRepository->unsetDefaultExcept($customerId, $newId);
        }

        return $newId;
    }

    public function updateAddress(int $id, array $input): void
    {
        if ($id <= 0) {
            throw new Exception('معرف العنوان غير صالح.');
        }

        $existing = $this->addressRepository->findById($id);
        if (!$existing) {
            throw new Exception('العنوان غير موجود.');
        }

        $customerId = (int)($existing['customer_id'] ?? 0);

        $now = date('Y-m-d H:i:s');

        $isDefault = array_key_exists('is_default', $input) ? (int)$input['is_default'] : (int)($existing['is_default'] ?? 0);

        $this->addressRepository->update($id, [
            'label' => array_key_exists('label', $input) ? (string)$input['label'] : (string)($existing['label'] ?? ''),
            'recipient_name' => array_key_exists('recipient_name', $input) ? (string)$input['recipient_name'] : (string)($existing['recipient_name'] ?? ''),
            'phone' => array_key_exists('phone', $input) ? ($input['phone'] === null ? null : (string)$input['phone']) : ($existing['phone'] ?? null),
            'country' => array_key_exists('country', $input) ? ($input['country'] === null ? null : (string)$input['country']) : ($existing['country'] ?? null),
            'city' => array_key_exists('city', $input) ? ($input['city'] === null ? null : (string)$input['city']) : ($existing['city'] ?? null),
            'district' => array_key_exists('district', $input) ? ($input['district'] === null ? null : (string)$input['district']) : ($existing['district'] ?? null),
            'street' => array_key_exists('street', $input) ? ($input['street'] === null ? null : (string)$input['street']) : ($existing['street'] ?? null),
            'building' => array_key_exists('building', $input) ? ($input['building'] === null ? null : (string)$input['building']) : ($existing['building'] ?? null),
            'floor' => array_key_exists('floor', $input) ? ($input['floor'] === null ? null : (string)$input['floor']) : ($existing['floor'] ?? null),
            'landmark' => array_key_exists('landmark', $input) ? ($input['landmark'] === null ? null : (string)$input['landmark']) : ($existing['landmark'] ?? null),
            'latitude' => array_key_exists('latitude', $input) ? ($input['latitude'] === null ? null : $input['latitude']) : ($existing['latitude'] ?? null),
            'longitude' => array_key_exists('longitude', $input) ? ($input['longitude'] === null ? null : $input['longitude']) : ($existing['longitude'] ?? null),
            'is_default' => $isDefault ? 1 : 0,
            'updated_at' => $now,
            'created_at' => (string)($existing['created_at'] ?? $now),
        ]);

        if ($isDefault) {
            $this->addressRepository->unsetDefaultExcept($customerId, $id);
        }
    }

    public function deleteAddress(int $id): void
    {
        if ($id <= 0) {
            throw new Exception('معرف العنوان غير صالح.');
        }

        $existing = $this->addressRepository->findById($id);
        if (!$existing) {
            throw new Exception('العنوان غير موجود.');
        }

        $this->addressRepository->delete($id);
    }

    public function listAddresses(int $customerId): array
    {
        if ($customerId <= 0) {
            throw new Exception('معرف العميل غير صالح.');
        }

        $customer = $this->customerRepository->findById($customerId);
        if (!$customer) {
            throw new Exception('العميل غير موجود.');
        }

        return $this->addressRepository->findAllByCustomerId($customerId);
    }

    public function getDefaultAddress(int $customerId): ?array
    {
        if ($customerId <= 0) {
            throw new Exception('معرف العميل غير صالح.');
        }

        return $this->addressRepository->findDefaultByCustomerId($customerId);
    }
}

