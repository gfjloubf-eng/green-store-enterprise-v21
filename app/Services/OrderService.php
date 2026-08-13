<?php

namespace App\Services;

use App\Repositories\OrderRepository;

class OrderService
{

    /**
     * Orchestrates order business logic.
     *
     * IMPORTANT: No HTTP/Response calls, no JSON/HTTP parsing, no transaction handling.
     * save_order.php (Validation Layer) must validate request + each product item.
     */
    public function createOrder(array $input): int
    {
        $products = $input['products'] ?? [];
        $customer_name = $input['customer_name'] ?? null;
        $customer_email = $input['customer_email'] ?? null;
        $customer_phone = $input['customer_phone'] ?? null;
        $delivery_addr = $input['delivery_addr'] ?? null;
        $lat = $input['lat'] ?? null;
        $lng = $input['lng'] ?? null;

        // Use ProductService to centralize product line-item preparation.
        $productService = new ProductService();
        $trustedLineItems = $productService->prepareTrustedLineItems($products);
        $calculated_total = $productService->calculateTotalFromTrustedLineItems($trustedLineItems);

        $orderRepository = new OrderRepository();

        return $orderRepository->createOrder(
            $customer_name,
            $customer_email,
            $customer_phone,
            $trustedLineItems,
            (float)$calculated_total,
            $delivery_addr,
            $lat,
            $lng
        );
    }
}






