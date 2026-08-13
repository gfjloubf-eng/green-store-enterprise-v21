<?php

namespace App\Services;

use App\Repositories\ProductRepository;

class ProductService
{
    private ProductRepository $productRepository;

    public function __construct(?ProductRepository $productRepository = null)
    {
        $this->productRepository = $productRepository ?? new ProductRepository();
    }

    /**
     * Retrieve a single product with trusted price data.
     *
     * Business orchestration only: delegates DB access to ProductRepository.
     * Validation is handled by the Validation Layer (save_order.php / Validation::validate).
     */
    public function getProductOrNull(int $productId): ?array
    {
        return $this->productRepository->findByIdWithPrice($productId);
    }

    public function createProduct(array $input): int
    {
        $name = (string)($input['name'] ?? '');
        $aliases = (string)($input['aliases'] ?? '');
        $description = (string)($input['description'] ?? '');

        $sku = isset($input['sku']) ? (string)$input['sku'] : null;
        $barcode = isset($input['barcode']) ? (string)$input['barcode'] : null;

        if ($sku !== null && $sku !== '' && $this->productRepository->existsBySku($sku)) {
            throw new \Exception('SKU موجود مسبقاً.');
        }

        if ($barcode !== null && $barcode !== '' && $this->productRepository->existsByBarcode($barcode)) {
            throw new \Exception('الباركود موجود مسبقاً.');
        }

        $now = date('Y-m-d H:i:s');

        $img = (string)($input['img'] ?? ($input['image'] ?? ''));
        $image = (string)($input['image'] ?? ($input['img'] ?? ''));

        $stockQuantity = isset($input['stock_quantity']) ? (int)$input['stock_quantity'] : (int)($input['stock'] ?? 0);
        $stock = $stockQuantity; // keep both columns in sync

        $type = (string)($input['type'] ?? 'خضار');
        $price = (float)($input['price'] ?? 0);
        $costPrice = (float)($input['cost_price'] ?? 0);
        $status = (string)($input['status'] ?? 'active');

        $created_at = (string)($input['created_at'] ?? $now);
        $updated_at = (string)($input['updated_at'] ?? $now);

        return $this->productRepository->create([
            'name' => $name,
            'aliases' => $aliases,
            'barcode' => $barcode,
            'sku' => $sku,
            'description' => $description,
            'price' => $price,
            'cost_price' => $costPrice,
            'stock_quantity' => $stockQuantity,
            'img' => $img,
            'image' => $image,
            'status' => $status,
            'type' => $type,
            'created_at' => $created_at,
            'updated_at' => $updated_at,
            'stock' => $stock,
        ]);
    }

    public function updateProduct(int $id, array $input): void
    {
        if ($id <= 0) {
            throw new \Exception('معرف المنتج غير صالح.');
        }

        $existing = $this->productRepository->findById($id);
        if (!$existing) {
            throw new \Exception('المنتج غير موجود.');
        }

        $sku = array_key_exists('sku', $input) ? (string)$input['sku'] : (string)($existing['sku'] ?? '');
        $barcode = array_key_exists('barcode', $input) ? (string)$input['barcode'] : (string)($existing['barcode'] ?? '');

        if ($sku !== '' && $this->productRepository->existsBySku($sku, $id)) {
            throw new \Exception('SKU موجود مسبقاً.');
        }

        if ($barcode !== '' && $this->productRepository->existsByBarcode($barcode, $id)) {
            throw new \Exception('الباركود موجود مسبقاً.');
        }

        $now = date('Y-m-d H:i:s');

        $name = array_key_exists('name', $input) ? (string)$input['name'] : (string)$existing['name'];
        $aliases = array_key_exists('aliases', $input) ? (string)$input['aliases'] : (string)$existing['aliases'];
        $description = array_key_exists('description', $input) ? (string)$input['description'] : (string)$existing['description'];

        $price = array_key_exists('price', $input) ? (float)$input['price'] : (float)$existing['price'];
        $costPrice = array_key_exists('cost_price', $input) ? (float)$input['cost_price'] : (float)($existing['cost_price'] ?? 0);

        $stockQuantity = array_key_exists('stock_quantity', $input)
            ? (int)$input['stock_quantity']
            : (int)($existing['stock_quantity'] ?? ($existing['stock'] ?? 0));

        $img = array_key_exists('img', $input) ? (string)$input['img'] : (string)($existing['img'] ?? '');
        $image = array_key_exists('image', $input) ? (string)$input['image'] : (string)($existing['image'] ?? $img);

        $status = array_key_exists('status', $input) ? (string)$input['status'] : (string)($existing['status'] ?? 'active');
        $type = array_key_exists('type', $input) ? (string)$input['type'] : (string)($existing['type'] ?? 'خضار');

        $created_at = (string)($existing['created_at'] ?? $now);
        $updated_at = $now;

        $this->productRepository->update($id, [
            'name' => $name,
            'aliases' => $aliases,
            'barcode' => $barcode !== '' ? $barcode : null,
            'sku' => $sku !== '' ? $sku : null,
            'description' => $description,
            'price' => $price,
            'cost_price' => $costPrice,
            'stock_quantity' => $stockQuantity,
            'img' => $img,
            'image' => $image,
            'status' => $status,
            'type' => $type,
            'created_at' => $created_at,
            'updated_at' => $updated_at,
            'stock' => $stockQuantity,
        ]);
    }

    public function deleteProduct(int $id): void
    {
        if ($id <= 0) {
            throw new \Exception('معرف المنتج غير صالح.');
        }

        $existing = $this->productRepository->findById($id);
        if (!$existing) {
            throw new \Exception('المنتج غير موجود.');
        }

        $this->productRepository->delete($id);
    }

    public function getProductOrNullForResponse(int $id): ?array
    {
        $p = $this->productRepository->findById($id);
        if (!$p) {
            return null;
        }

        // Backward compatibility mapping: do NOT remove existing keys.
        if (array_key_exists('stock_quantity', $p) && (!array_key_exists('stock', $p) || $p['stock'] === null)) {
            $p['stock'] = $p['stock_quantity'];
        }

        if (array_key_exists('image', $p) && (!array_key_exists('img', $p) || $p['img'] === null)) {
            $p['img'] = $p['image'];
        }

        return $p;
    }

    public function listProducts(): array
    {
        $rows = $this->productRepository->findAll();

        foreach ($rows as &$p) {
            if (array_key_exists('stock_quantity', $p)) {
                $p['stock'] = $p['stock_quantity'];
            }
            if (array_key_exists('image', $p)) {
                $p['img'] = $p['image'];
            }
        }

        return $rows;
    }

    /**
     * Exact behavior for api.php action=products.
     * Returns raw DB rows (no field transformation) to preserve backward compatibility.
     */
    public function searchProductsRaw(string $q): array
    {
        $q = trim($q);
        if ($q === '') {
            return $this->productRepository->findAll();
        }

        return $this->productRepository->findAllBySearchQuery($q);
    }

    /**
     * Exact behavior for api.php action=product.
     * Returns raw SELECT * row (no field transformation) to preserve backward compatibility.
     */
    public function getProductRawOrNull(int $productId): ?array
    {
        return $this->productRepository->findRawById($productId);
    }


    /**
     * Prepare trusted line items for business operations (e.g., order creation).
     *
     * Expected input shape (validated elsewhere):
     * - each item: ['id' => int, 'qty' => int]
     *
     * Returns:
     * - array of trusted products: ['id','name','price','qty','line_total']
     */
    public function prepareTrustedLineItems(array $items): array
    {
        $trusted = [];

        foreach ($items as $item) {
            $productId = (int)($item['id'] ?? 0);
            $quantity = (int)($item['qty'] ?? ($item['quantity'] ?? 0));

            $dbProduct = $this->productRepository->findByIdWithPrice($productId);
            if (!$dbProduct) {
                throw new \Exception('أحد المنتجات المطلوبة غير متوفر في النظام.');
            }

            $lineTotal = ((float)$dbProduct['price']) * $quantity;

            $trusted[] = [
                'id' => (int)$dbProduct['id'],
                'name' => (string)$dbProduct['name'],
                'price' => (float)$dbProduct['price'],
                'qty' => $quantity,
                'line_total' => $lineTotal,
            ];
        }

        return $trusted;
    }

    public function calculateTotalFromTrustedLineItems(array $trustedLineItems): float
    {
        $total = 0.0;

        foreach ($trustedLineItems as $line) {
            $total += (float)($line['line_total'] ?? 0);
        }

        return $total;
    }
}


