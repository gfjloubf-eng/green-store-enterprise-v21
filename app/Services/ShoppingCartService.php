<?php

namespace App\Services;

use App\Repositories\ShoppingCartRepository;
use Exception;

class ShoppingCartService
{
    private ShoppingCartRepository $repo;

    private const STATE_ACTIVE = 'ACTIVE';
    private const STATE_CHECKED_OUT = 'CHECKED_OUT';
    private const STATE_ABANDONED = 'ABANDONED';

    private const ALLOWED_STATES = [
        self::STATE_ACTIVE,
        self::STATE_CHECKED_OUT,
        self::STATE_ABANDONED,
    ];

    private const TRANSITIONS = [
        self::STATE_ACTIVE => [
            self::STATE_CHECKED_OUT => true,
            self::STATE_ABANDONED => true,
        ],
    ];

    public function __construct(?ShoppingCartRepository $repo = null)
    {
        $this->repo = $repo ?? new ShoppingCartRepository();
    }


    // -------------------- Totals (service-owned) --------------------

    private function buildEmptyTotals(): array
    {
        return [
            'subtotal' => 0.00,
            'discount_total' => 0.00,
            'tax_total' => 0.00,
            'grand_total' => 0.00,
        ];
    }

    private function recalculateTotalsFromItems(array $items): array
    {
        $subtotal = 0.0;
        foreach ($items as $it) {
            $subtotal += (float)($it['line_total'] ?? 0);
        }

        $discountTotal = 0.0; // Sprint 9: not implemented
        $taxTotal = 0.0; // Sprint 9: not implemented

        $grandTotal = $subtotal - $discountTotal + $taxTotal;

        return [
            'subtotal' => round($subtotal, 2),
            'discount_total' => round($discountTotal, 2),
            'tax_total' => round($taxTotal, 2),
            'grand_total' => round($grandTotal, 2),
        ];
    }

    private function recalcAndPersistTotals(int $cartId): array
    {
        $items = $this->repo->listCartItems($cartId);
        $totals = $this->recalculateTotalsFromItems($items);
        $this->repo->updateCartTotals($cartId, $totals);
        return $totals;
    }

    private function getCartPayload(?array $cart, array $items): array
    {
        return [
            'cart' => $cart,
            'cart_items' => $items,
        ];
    }

    // -------------------- Customer/cart ownership --------------------

    public function createCart(int $customerId): array
    {
        if ($customerId <= 0) {
            throw new Exception('customer_id غير صالح.');
        }
        if (!$this->repo->customerExists($customerId)) {
            throw new Exception('العميل غير موجود.');
        }

        $existing = $this->repo->findActiveCartByCustomerId($customerId);
        if ($existing) {
            // Business rule: one ACTIVE cart per customer.
            return $this->activeCart($customerId);
        }

        $totals = $this->buildEmptyTotals();
        $cartId = $this->repo->createCart($customerId, 'ACTIVE', $totals);

        // Currency is handled by DB default (Sprint 9.1).

        $cart = $this->repo->findCartById($cartId);
        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($cart, $items);
    }

    public function activeCart(int $customerId): ?array
    {
        if ($customerId <= 0) {
            throw new Exception('customer_id غير صالح.');
        }
        if (!$this->repo->customerExists($customerId)) {
            throw new Exception('العميل غير موجود.');
        }

        $cart = $this->repo->findActiveCartByCustomerId($customerId);
        if (!$cart) {
            return null;
        }

        $items = $this->repo->listCartItems((int)$cart['id']);
        return $this->getCartPayload($cart, $items);
    }

    // -------------------- Cart State Machine (service-owned) --------------------

    /**
     * Validates and performs a cart state transition.
     * Repository persists only; all rules live in the service.
     */
    public function transitionCartState(int $cartId, string $toState): array
    {
        if ($cartId <= 0) {
            throw new Exception('cart_id غير صالح.');
        }

        $toState = trim($toState);
        $this->validateStateInput($toState);

        $cart = $this->repo->findCartById($cartId);
        if (!$cart) {
            throw new Exception('السلة غير موجودة.');
        }

        $fromState = (string)($cart['status'] ?? self::STATE_ACTIVE);
        $this->validateTransitionAllowed($fromState, $toState);

        $this->repo->updateCartStatus($cartId, $toState);

        // Return the updated cart payload for future consumption.
        $freshCart = $this->repo->findCartById($cartId);
        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($freshCart, $items);
    }

    private function validateStateInput(string $state): void
    {
        if (!in_array($state, self::ALLOWED_STATES, true)) {
            throw new Exception('حالة السلة غير صالحة.');
        }
    }

    private function validateTransitionAllowed(string $fromState, string $toState): void
    {
        if (!isset(self::TRANSITIONS[$fromState][$toState])) {
            throw new Exception('انتقال حالة السلة غير مسموح.');
        }
    }

    // -------------------- Cart operations --------------------


    public function addProduct(int $customerId, int $productId, int $quantity): array
    {
        if ($customerId <= 0) {
            throw new Exception('customer_id غير صالح.');
        }
        if ($productId <= 0) {
            throw new Exception('product_id غير صالح.');
        }
        if ($quantity <= 0) {
            throw new Exception('quantity يجب أن يكون عددًا صحيحًا موجبًا.');
        }

        if (!$this->repo->customerExists($customerId)) {
            throw new Exception('العميل غير موجود.');
        }
        if (!$this->repo->productExists($productId)) {
            throw new Exception('المنتج غير موجود.');
        }

        $cart = $this->repo->findActiveCartByCustomerId($customerId);
        if (!$cart) {
            $created = $this->createCart($customerId);
            $cart = $created['cart'];
        }

        $cartId = (int)$cart['id'];

        $existingItem = $this->repo->findCartItem($cartId, $productId);

        if ($existingItem) {
            // Business rule: one row per product; increase quantity.
            $newQty = (int)$existingItem['quantity'] + $quantity;

            // Architectural rule: line_total must use stored unit_price.
            $storedUnitPrice = (float)$existingItem['unit_price'];
            $lineTotal = $storedUnitPrice * $newQty;

            $this->repo->updateCartItemQuantityAndLineTotal(
                $cartId,
                $productId,
                $newQty,
                $storedUnitPrice,
                $lineTotal
            );
        } else {
            // Copy current product price into unit_price.
            $currentPrice = $this->repo->findProductPriceById($productId);
            if ($currentPrice === null) {
                throw new Exception('تعذر جلب سعر المنتج.');
            }

            $lineTotal = $currentPrice * $quantity;
            $this->repo->insertCartItem($cartId, $productId, $quantity, $currentPrice, $lineTotal);
        }

        // Recalculate totals (service-owned) and persist.
        $this->recalcAndPersistTotals($cartId);

        $freshCart = $this->repo->findCartById($cartId);
        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($freshCart, $items);
    }

    public function updateCartItem(int $customerId, int $productId, int $quantity): array
    {
        if ($customerId <= 0) {
            throw new Exception('customer_id غير صالح.');
        }
        if ($productId <= 0) {
            throw new Exception('product_id غير صالح.');
        }
        if ($quantity <= 0) {
            throw new Exception('quantity يجب أن يكون عددًا صحيحًا موجبًا.');
        }

        $cart = $this->repo->findActiveCartByCustomerId($customerId);
        if (!$cart) {
            throw new Exception('سلة العميل غير موجودة.');
        }

        $cartId = (int)$cart['id'];

        $existingItem = $this->repo->findCartItem($cartId, $productId);
        if (!$existingItem) {
            throw new Exception('العنصر غير موجود داخل السلة.');
        }

        // Keep stored unit_price.
        $storedUnitPrice = (float)$existingItem['unit_price'];
        $lineTotal = $storedUnitPrice * $quantity;

        $this->repo->updateCartItemQuantityAndLineTotal(
            $cartId,
            $productId,
            $quantity,
            $storedUnitPrice,
            $lineTotal
        );

        $this->recalcAndPersistTotals($cartId);

        $freshCart = $this->repo->findCartById($cartId);
        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($freshCart, $items);
    }

    public function removeProduct(int $customerId, int $productId): array
    {
        if ($customerId <= 0) {
            throw new Exception('customer_id غير صالح.');
        }
        if ($productId <= 0) {
            throw new Exception('product_id غير صالح.');
        }

        $cart = $this->repo->findActiveCartByCustomerId($customerId);
        if (!$cart) {
            throw new Exception('سلة العميل غير موجودة.');
        }

        $cartId = (int)$cart['id'];

        $this->repo->removeCartItem($cartId, $productId);

        // Business rule: Removing the final item leaves cart ACTIVE.
        // So we do not change cart status.

        $this->recalcAndPersistTotals($cartId);

        $freshCart = $this->repo->findCartById($cartId);
        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($freshCart, $items);
    }

    public function clearCart(int $customerId): array
    {
        if ($customerId <= 0) {
            throw new Exception('customer_id غير صالح.');
        }

        $cart = $this->repo->findActiveCartByCustomerId($customerId);
        if (!$cart) {
            throw new Exception('سلة العميل غير موجودة.');
        }

        $cartId = (int)$cart['id'];
        $this->repo->clearCartItems($cartId);

        $this->recalcAndPersistTotals($cartId);

        $freshCart = $this->repo->findCartById($cartId);
        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($freshCart, $items);
    }

    // -------------------- Read helpers for API --------------------

    public function cart(int $cartId): array
    {
        if ($cartId <= 0) {
            throw new Exception('cart_id غير صالح.');
        }

        $cart = $this->repo->findCartById($cartId);
        if (!$cart) {
            throw new Exception('السلة غير موجودة.');
        }

        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($cart, $items);
    }

    public function cartItems(int $cartId): array
    {
        if ($cartId <= 0) {
            throw new Exception('cart_id غير صالح.');
        }

        $cart = $this->repo->findCartById($cartId);
        if (!$cart) {
            throw new Exception('السلة غير موجودة.');
        }

        $items = $this->repo->listCartItems($cartId);
        return $this->getCartPayload($cart, $items);
    }
}

