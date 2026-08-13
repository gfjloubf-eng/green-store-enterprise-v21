/* ============================================================
   GSDS v1.1 — Product Filter Model (Domain)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Reusable filter criteria model
   ============================================================
   Reuses the existing ProductFilters type from the types layer.
   This keeps backward compatibility while adding domain-level
   filter operations.
   
   No duplication — ProductFilters is the canonical filter type.
   ============================================================ */

import type { ProductFilters } from '../types/product';
import type { ProductDTO } from './productDTO';

/**
 * ProductFilterModel — Re-export of ProductFilters for domain clarity.
 * This creates a clean domain alias without duplicating the interface.
 */
export type ProductFilterModel = ProductFilters;

/**
 * Default filter values.
 */
export const DEFAULT_FILTER_MODEL: ProductFilterModel = {
  search: '',
  categoryId: null,
  brandId: null,
  status: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  rowsPerPage: 10,
};

/**
 * Apply all filters to a list of products.
 * Pure function — no side effects.
 */
export function applyFilters(
  products: ProductDTO[],
  filters: ProductFilterModel,
): ProductDTO[] {
  let result = [...products];

  /* ── Search ────────────────────────────────────── */
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    );
  }

  /* ── Category ──────────────────────────────────── */
  if (filters.categoryId) {
    result = result.filter((p) => p.category.id === filters.categoryId);
  }

  /* ── Brand ─────────────────────────────────────── */
  if (filters.brandId) {
    result = result.filter((p) => p.brand.id === filters.brandId);
  }

  /* ── Status ────────────────────────────────────── */
  if (filters.status !== 'all') {
    result = result.filter((p) => p.status === filters.status);
  }

  return result;
}

/**
 * Sort products by a given column and direction.
 * Pure function — no side effects.
 */
export function applySort(
  products: ProductDTO[],
  sortBy: ProductFilterModel['sortBy'],
  sortDirection: ProductFilterModel['sortDirection'],
): ProductDTO[] {
  const sorted = [...products].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'barcode':
        cmp = a.barcode.localeCompare(b.barcode);
        break;
      case 'sku':
        cmp = a.sku.localeCompare(b.sku);
        break;
      case 'category':
        cmp = a.category.name.localeCompare(b.category.name);
        break;
      case 'brand':
        cmp = a.brand.name.localeCompare(b.brand.name);
        break;
      case 'unit':
        cmp = a.unit.name.localeCompare(b.unit.name);
        break;
      case 'purchasePrice':
        cmp = a.purchasePrice - b.purchasePrice;
        break;
      case 'sellingPrice':
        cmp = a.sellingPrice - b.sellingPrice;
        break;
      case 'stock':
        cmp = a.stock - b.stock;
        break;
      case 'createdAt':
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        cmp = 0;
    }
    return sortDirection === 'asc' ? cmp : -cmp;
  });

  return sorted;
}

/**
 * Paginate a list of products.
 * Pure function — no side effects.
 */
export function applyPagination<T>(
  items: T[],
  page: number,
  size: number,
): { data: T[]; total: number; page: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.ceil(total / size) || 1;
  const start = (page - 1) * size;
  const data = items.slice(start, start + size);

  return { data, total, page, totalPages };
}

