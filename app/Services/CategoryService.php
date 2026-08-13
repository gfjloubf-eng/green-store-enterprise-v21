<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Exception;

class CategoryService
{
    private CategoryRepository $categoryRepository;

    public function __construct(?CategoryRepository $categoryRepository = null)
    {
        $this->categoryRepository = $categoryRepository ?? new CategoryRepository();
    }

    public function createCategory(array $input): int
    {
        $name = (string)($input['name'] ?? '');
        $slug = (string)($input['slug'] ?? '');
        $description = array_key_exists('description', $input) ? ($input['description'] === null ? null : (string)$input['description']) : null;
        $status = (string)($input['status'] ?? 'active');
        $sortOrder = isset($input['sort_order']) ? (int)$input['sort_order'] : 0;

        if ($this->categoryRepository->existsBySlug($slug)) {
            // api.php maps this exact Arabic substring to conflict
            throw new Exception('الاسلاگ موجود مسبقاً.');
        }

        $now = date('Y-m-d H:i:s');

        return $this->categoryRepository->create([
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'status' => $status,
            'sort_order' => $sortOrder,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function updateCategory(int $id, array $input): void
    {
        if ($id <= 0) {
            throw new Exception('معرف التصنيف غير صالح.');
        }

        $existing = $this->categoryRepository->findById($id);
        if (!$existing) {
            throw new Exception('التصنيف غير موجود.');
        }

        $name = array_key_exists('name', $input) ? (string)$input['name'] : (string)($existing['name'] ?? '');
        $slug = array_key_exists('slug', $input) ? (string)$input['slug'] : (string)($existing['slug'] ?? '');
        $description = array_key_exists('description', $input)
            ? ($input['description'] === null ? null : (string)$input['description'])
            : ($existing['description'] ?? null);

        $status = array_key_exists('status', $input) ? (string)$input['status'] : (string)($existing['status'] ?? 'active');
        $sortOrder = array_key_exists('sort_order', $input) ? (int)$input['sort_order'] : (int)($existing['sort_order'] ?? 0);

        if ($this->categoryRepository->existsBySlug($slug, $id)) {
            throw new Exception('الاسلاگ موجود مسبقاً.');
        }

        $now = date('Y-m-d H:i:s');

        $this->categoryRepository->update($id, [
            'name' => $name,
            'slug' => $slug,
            'description' => $description,
            'status' => $status,
            'sort_order' => $sortOrder,
            'updated_at' => $now,
            'created_at' => (string)($existing['created_at'] ?? $now),
        ]);
    }

    public function deleteCategory(int $id): void
    {
        if ($id <= 0) {
            throw new Exception('معرف التصنيف غير صالح.');
        }

        $existing = $this->categoryRepository->findById($id);
        if (!$existing) {
            throw new Exception('التصنيف غير موجود.');
        }

        $this->categoryRepository->delete($id);
    }

    public function getCategory(int $id): ?array
    {
        return $this->categoryRepository->findById($id);
    }

    public function listCategories(): array
    {
        return $this->categoryRepository->findAll();
    }
}

