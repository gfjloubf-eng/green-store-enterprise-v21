<?php
require_once __DIR__ . '/../models/ProductModel.php';

class ProductController {
    private $productModel;

    public function __construct() {
        $this->productModel = new ProductModel();
    }

    public function getProducts($query = '') {
        if ($query) {
            return $this->productModel->searchProducts($query);
        } else {
            return $this->productModel->getAllProducts();
        }
    }

    public function getProduct($id) {
        return $this->productModel->getProductById($id);
    }
}
?>
