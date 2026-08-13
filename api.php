<?php
require_once __DIR__ . '/app/autoload.php';

use App\Core\Database;
use App\Core\Response;

$db = Database::getInstance();
$pdo = $db->getConnection();

$action = $_GET['action'] ?? 'list';

try {
    switch ($action) {
        case 'products':
            $q = trim((string)($_GET['q'] ?? ''));

            if ($q !== '') {
                $stmt = $pdo->prepare(
                    'SELECT * FROM products WHERE name LIKE ? OR aliases LIKE ? ORDER BY name'
                );
                $stmt->execute(["%$q%", "%$q%"]);
            } else {
                $stmt = $pdo->query('SELECT * FROM products ORDER BY name');
            }

            Response::success('success', ['products' => $stmt->fetchAll()]);
            break;

        case 'product':
            $id = (int)($_GET['id'] ?? 0);

            if ($id <= 0) {
                Response::validationError('validation error', [
                    ['field' => 'id', 'message' => 'معرف المنتج غير صالح.']
                ]);
            }

            $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
            $stmt->execute([$id]);
            $product = $stmt->fetch();

            if (!$product) {
                Response::notFound('not found', ['product' => null]);
            }

            Response::success('success', ['product' => $product]);
            break;

        case 'locations':
            $stmt = $pdo->query('SELECT * FROM locations');
            Response::success('success', ['locations' => $stmt->fetchAll()]);
            break;

        case 'orders':
            $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 20');
            Response::success('success', ['orders' => $stmt->fetchAll()]);
            break;

        default:
            Response::error('عملية غير معروفة');
    }
} catch (Exception $e) {
    Response::serverError($e->getMessage());
}



