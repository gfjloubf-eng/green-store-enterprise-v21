/* ============================================================
   GSDS v1.1 â€” Purchase Filter Model (Domain)
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Reusable filter criteria model
   ============================================================
   Reuses the PurchaseFilters type from the types layer.
   This keeps backward compatibility while adding domain-level
   filter operations.

   No duplication â€” PurchaseFilters is the canonical filter type.
   ============================================================ */

import type { PurchaseFilters } from '../types/purchasing';
import type { PurchaseDTO } from './purchaseDTO';

/**
 * PurchaseFilterModel â€” Re-export of PurchaseFilters for domain clarity.
 */
export type PurchaseFilterModel = PurchaseFilters;

/**
 * Default filter values.
 */
export const DEFAULT_PURCHASE_FILTER_MODEL: PurchaseFilterModel = {
  search: '',
  status: 'all',
  supplierId: null,
  sortBy: 'code',
  sortDirection: 'asc',
  rowsPerPage: 10,
};

/**
 * Apply all filters to a list of purchase orders.
 * Pure function â€” no side effects.
 */
export function applyPurchaseFilters(
  orders: PurchaseDTO[],
  filters: PurchaseFilterModel,
): PurchaseDTO[] {
  let result = [...orders];

  /* â”€â”€ Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.code.toLowerCase().includes(q) ||
        o.supplier.name.toLowerCase().includes(q),
    );
  }

  /* â”€â”€ Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (filters.status !== 'all') {
    result = result.filter((o) => o.status === filters.status);
  }

  /* â”€â”€ Supplier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  if (filters.supplierId) {
    result = result.filter((o) => o.supplier.id === filters.supplierId);
  }

  return result;
}

/**
 * Sort purchase orders by a given column and direction.
 * Pure function â€” no side effects.
 */
export function applyPurchaseSort(
  orders: PurchaseDTO[],
  sortBy: PurchaseFilterModel['sortBy'],
  sortDirection: PurchaseFilterModel['sortDirection'],
): PurchaseDTO[] {
  const sorted = [...orders].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'code':
        cmp = a.code.localeCompare(b.code);
        break;
      case 'supplier':
        cmp = a.supplier.name.localeCompare(b.supplier.name);
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
      case 'itemCount':
        cmp = a.items.length - b.items.length;
        break;
      case 'totalQuantity':
        cmp =
          a.items.reduce((s, i) => s + i.quantity, 0) -
          b.items.reduce((s, i) => s + i.quantity, 0);
        break;
      case 'totalCost':
        cmp = a.total - b.total;
        break;
      case 'expectedAt':
        cmp =
          new Date(a.expectedAt ?? 0).getTime() -
          new Date(b.expectedAt ?? 0).getTime();
        break;
      case 'orderedAt':
        cmp = new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime();
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
 * Pure function â€” no side effects. Works with any array type.
 */
export function applyPurchasePagination<T>(
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
