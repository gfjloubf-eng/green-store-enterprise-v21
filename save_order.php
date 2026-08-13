<?php

require_once __DIR__ . '/app/autoload.php';

use App\Core\Database;
use App\Core\Response;
use App\Core\Validation;

$db = Database::getInstance();
$pdo = $db->getConnection();



if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('الطريقة غير مسموحة. الرجاء استخدام POST.', [], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    Response::validationError('validation error', [
        ['field' => 'input', 'message' => 'بيانات الطلب غير مكتملة أو السلة فارغة.']
    ]);
}

// -------- Validation-only (no DB, no transactions) --------
if (!$input) {

    Response::validationError('validation error', [
        ['field' => 'input', 'message' => 'بيانات الطلب غير مكتملة أو السلة فارغة.']
    ]);
}

// Backward-compat: ensure the request continues only after emitting JSON.
// (Response::validationError exits via Response::emit)


$schema = [
    'customer_name' => ['required', 'string'],
    'customer_email' => ['required', 'email'],
    'customer_phone' => ['required', 'string'],
    'delivery_addr' => ['required', 'string'],
    'products' => ['required', 'array'],
    'lat' => [['rule' => 'nullable'], 'numeric'],
    'lng' => [['rule' => 'nullable'], 'numeric'],
];

// Note: Validating products contents (id/qty per item) requires iterating arrays,
// but the *rules* themselves remain delegated to Validation::validate().

$validationResult = Validation::validate($input, $schema);
if (!$validationResult->passed()) {
    // Preserve frontend behavior as much as possible: keep same Arabic messages قدر الإمكان
    $errors = $validationResult->errors();

    // If products missing/empty, keep the previous message
    foreach ($errors as &$err) {
        if (($err['field'] ?? null) === 'products') {
            $err['message'] = 'بيانات الطلب غير مكتملة أو السلة فارغة.';
        }
    }

    Response::validationError('validation error', $errors);
}

// ---- Per-item products validation (Validation Layer only) ----
// Required Arabic messages must match Sprint 4 spec exactly.
$products = $input['products'];

// Safety: reject non-array/empty products early (preserve existing Arabic message via schema override)
if (!is_array($products) || count($products) === 0) {
    Response::validationError('validation error', [
        ['field' => 'products', 'message' => 'بيانات الطلب غير مكتملة أو السلة فارغة.']
    ]);
}

$perItemErrors = [];
foreach ($products as $idx => $item) {
    $rawProductId = (is_array($item) && array_key_exists('id', $item)) ? $item['id'] : null;
    $hasQty = is_array($item) && array_key_exists('qty', $item);
    $hasQuantity = is_array($item) && array_key_exists('quantity', $item);
    $rawQuantity = $hasQty ? $item['qty'] : ($hasQuantity ? $item['quantity'] : null);

    $productIdValidation = Validation::validate(
        ['id' => $rawProductId],
        ['id' => ['required', 'integer']],
        ['index' => $idx]
    );

    if (!$productIdValidation->passed() || (int)$rawProductId <= 0) {
        $perItemErrors[] = ['field' => 'products', 'message' => 'معرف المنتج غير صالح أو مفقود.'];
        continue;
    }

    $qtyValidation = Validation::validate(
        ['qty' => $rawQuantity],
        ['qty' => ['required', 'integer']],
        ['index' => $idx]
    );

    if (!$qtyValidation->passed() || (int)$rawQuantity <= 0) {
        $perItemErrors[] = ['field' => 'products', 'message' => 'الكمية المطلوبة غير صالحة.'];
        continue;
    }
}

if (!empty($perItemErrors)) {
    // Keep response shape: validationError('validation error', errors)
    Response::validationError('validation error', $perItemErrors);
}


// At this point validation has passed, so expected fields exist.
$customer_name = $input['customer_name'];


$customer_email = $input['customer_email'];
$customer_phone = $input['customer_phone'];
$delivery_addr = $input['delivery_addr'];
$lat = $input['lat'] ?? null;
$lng = $input['lng'] ?? null;

// NOTE: per-item products validation is performed above (Validation Layer only).



try {
    // بدء المعاملة (Business Logic unchanged)
    $pdo->beginTransaction();

    $orderService = new \App\Services\OrderService();
    $order_id = $orderService->createOrder([
        'customer_name' => $customer_name,
        'customer_email' => $customer_email,
        'customer_phone' => $customer_phone,
        'delivery_addr' => $delivery_addr,
        'products' => $products,
        'lat' => $lat,
        'lng' => $lng,
    ]);

    $pdo->commit();

    Response::success('تم استلام وتأكيد الطلب بنجاح.', ['order_id' => $order_id]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Order Process Error: " . $e->getMessage());

    $user_message = "عذراً، حدث خطأ أثناء معالجة الطلب. الرجاء التأكد من صحة بيانات السلة أو المحاولة لاحقاً.";

    $known_errors = ["معرف المنتج غير صالح أو مفقود.", "الكمية المطلوبة غير صالحة.", "أحد المنتجات المطلوبة غير متوفر في النظام."];
    if (in_array($e->getMessage(), $known_errors)) {
        $user_message = $e->getMessage();
    }

    Response::error($user_message, [], 400);
}
?>

