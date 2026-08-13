/* ============================================================
   GSDS v1.1 — Supplier Filter Model (Domain)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Reusable filter criteria model
   ============================================================
   Reuses the SupplierFilters type from the types layer.
   This keeps backward compatibility while adding domain-level
   filter operations.

   No duplication — SupplierFilters is the canonical filter type.
   ============================================================ */

import type { SupplierFilters } from '../types/supplier';
import type { SupplierDTO } from './supplierDTO';

/**
 * SupplierFilterModel — Re-export of SupplierFilters for domain clarity.
 */
export type SupplierFilterModel = SupplierFilters;

/**
 * Default filter values.
 */
export const DEFAULT_SUPPLIER_FILTER_MODEL: SupplierFilterModel = {
  search: '',
  status: 'all',
  categoryId: null,
  city: null,
  sortBy: 'name',
  sortDirection: 'asc',
  rowsPerPage: 10,
};

/**
 * Apply all filters to a list of suppliers.
 * Pure function — no side effects.
 */
export function applySupplierFilters(
  suppliers: SupplierDTO[],
  filters: SupplierFilterModel,
): SupplierDTO[] {
  let result = [...suppliers];

  /* ── Search ────────────────────────────────────── */
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.contact.name.toLowerCase().includes(q),
    );
  }

  /* ── Status ────────────────────────────────────── */
  if (filters.status !== 'all') {
    result = result.filter((s) => s.status === filters.status);
  }

  /* ── Category ──────────────────────────────────── */
  if (filters.categoryId) {
    result = result.filter((s) => s.category.id === filters.categoryId);
  }

  /* ── City ──────────────────────────────────────── */
  if (filters.city) {
    result = result.filter((s) => s.city === filters.city);
  }

  return result;
}

/**
 * Sort suppliers by a given column and direction.
 * Pure function — no side effects.
 */
export function applySupplierSort(
  suppliers: SupplierDTO[],
  sortBy: SupplierFilterModel['sortBy'],
  sortDirection: SupplierFilterModel['sortDirection'],
): SupplierDTO[] {
  const sorted = [...suppliers].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'code':
        cmp = a.code.localeCompare(b.code);
        break;
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'category':
        cmp = a.category.name.localeCompare(b.category.name);
        break;
      case 'contact':
        cmp = a.contact.name.localeCompare(b.contact.name);
        break;
      case 'email':
        cmp = a.email.localeCompare(b.email);
        break;
      case 'phone':
        cmp = a.phone.localeCompare(b.phone);
        break;
      case 'city':
        cmp = a.city.localeCompare(b.city);
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
      case 'productCount':
        cmp = a.productCount - b.productCount;
        break;
      case 'totalPurchases':
        cmp = a.totalPurchases - b.totalPurchases;
        break;
      case 'lastOrderAt':
        cmp =
          new Date(a.lastOrderAt ?? 0).getTime() -
          new Date(b.lastOrderAt ?? 0).getTime();
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
 * Paginate a list of items.
 * Pure function — no side effects. Works with any array type.
 */
export function applySupplierPagination<T>(
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

