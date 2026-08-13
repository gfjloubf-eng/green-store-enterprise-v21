<?php


class ProductModel {
    private $db;

    public function __construct() {
        $this->db = \App\Core\Database::getInstance();
    }

    public function getAllProducts() {
        $stmt = $this->db->query("SELECT * FROM products ORDER BY name");
        return $stmt->fetchAll();
    }

    public function searchProducts($query) {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE name LIKE ? OR aliases LIKE ? ORDER BY name");
        $stmt->execute(["%$query%", "%$query%"]);
        return $stmt->fetchAll();
    }

    public function getProductById($id) {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    // For calculating prices securely
    public function getProductsByIds($ids) {
        if (empty($ids)) return [];
        $in = str_repeat('?,', count($ids) - 1) . '?';
        $stmt = $this->db->prepare("SELECT id, price FROM products WHERE id IN ($in)");
        $stmt->execute($ids);
        return $stmt->fetchAll();
    }
}
?>
