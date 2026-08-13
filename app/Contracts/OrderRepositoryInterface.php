<?php
namespace App\Contracts;

interface OrderRepositoryInterface
{
    public function createOrder(
        string $customerName,
        string $customerEmail,
        string $customerPhone,
        array $validProducts,
        float $calculatedTotal,
        string $deliveryAddr,
        $lat,
        $lng
    ): int;
}

