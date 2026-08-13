/* ============================================================
   GSDS v1.1 — Inventory Filter Model (Domain)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Reusable filter criteria model
   ============================================================
   Reuses the InventoryFilters type from the types layer.
   No duplication — InventoryFilters is the canonical filter type.
   ============================================================ */

import type { InventoryFilters } from '../types/inventory';
import type { InventoryDTO } from './inventoryDTO';

/**
 * InventoryFilterModel — Re-export of InventoryFilters for domain clarity.
 */
export type InventoryFilterModel = InventoryFilters;

/**
 * Default inventory filter values.
 */
export const DEFAULT_INVENTORY_FILTER_MODEL: InventoryFilterModel = {
  search: '',
  status: 'all',
  locationId: null,
  sortBy: 'quantityOnHand',
  sortDirection: 'desc',
  rowsPerPage: 10,
};

/**
 * Apply all filters to a list of inventory DTOs.
 * Pure function — no side effects.
 */
export function applyInventoryFilters(
  inventory: InventoryDTO[],
  filters: InventoryFilterModel,
): InventoryDTO[] {
  let result = [...inventory];

  /* ── Search ────────────────────────────────────── */
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (item) =>
        item.productId.toLowerCase().includes(q) ||
        item.location.name.toLowerCase().includes(q),
    );
  }

  /* ── Status ────────────────────────────────────── */
  if (filters.status !== 'all') {
    result = result.filter((item) => item.status === filters.status);
  }

  /* ── Location ──────────────────────────────────── */
  if (filters.locationId) {
    result = result.filter((item) => item.location.id === filters.locationId);
  }

  return result;
}

/**
 * Sort inventory by a given column and direction.
 * Pure function — no side effects.
 */
export function applyInventorySort(
  inventory: InventoryDTO[],
  sortBy: InventoryFilterModel['sortBy'],
  sortDirection: InventoryFilterModel['sortDirection'],
): InventoryDTO[] {
  const sorted = [...inventory].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case 'quantityOnHand':
        cmp = a.quantityOnHand - b.quantityOnHand;
        break;
      case 'quantityReserved':
        cmp = a.quantityReserved - b.quantityReserved;
        break;
      case 'quantityAvailable':
        cmp = a.quantityAvailable - b.quantityAvailable;
        break;
      case 'location':
        cmp = a.location.name.localeCompare(b.location.name);
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
      case 'lastMovementAt':
        cmp = new Date(a.lastMovementAt).getTime() - new Date(b.lastMovementAt).getTime();
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
export function applyInventoryPagination<T>(
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

