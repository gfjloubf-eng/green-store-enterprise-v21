/* ============================================================
   GSDS v1.1 — PurchasingService (Service Layer)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — In-memory mock service
   ============================================================
   Framework-agnostic service layer.
   No React, no HTTP, no fetch, no axios.
   All data is in-memory mock data only.

   Reuses ProductService for product information and
   SupplierService for supplier information.

   Methods:
   - getAll()       — Get all purchase orders
   - getById()      — Get a single purchase order by ID
   - create()       — Create a new purchase order
   - update()       — Update an existing purchase order
   - cancel()       — Cancel a purchase order
   - receive()      — Receive goods for a purchase order
   - returnItems()  — Return items from a purchase order
   - search()       — Search purchase orders by query
   - filter()       — Filter purchase orders by criteria
   - sort()         — Sort purchase orders by column
   - paginate()     — Paginate a purchase order list
   ============================================================ */

import type { PurchaseOrderEntity } from '../domain/purchaseOrderEntity';
import {
  createPurchaseOrderEntity,
  updatePurchaseOrderEntity,
} from '../domain/purchaseOrderEntity';
import type { PurchaseItemEntity } from '../domain/purchaseItemEntity';
import { createPurchaseItemEntity } from '../domain/purchaseItemEntity';
import type { PurchaseDTO } from '../domain/purchaseDTO';
import { toDTO, toDTOList } from '../domain/purchaseDTO';
import type { PurchaseFilterModel } from '../domain/purchaseFilterModel';
import {
  DEFAULT_PURCHASE_FILTER_MODEL,
  applyPurchaseFilters,
  applyPurchaseSort,
  applyPurchasePagination,
} from '../domain/purchaseFilterModel';
import { toTableModelList, type PurchaseTableModel } from '../domain/purchaseTableModel';
import { MOCK_PURCHASES, getMockPurchaseSupplierIds } from '../mock/purchases';
import { SupplierService } from '@/features/suppliers/services/supplierService';
import { ProductService } from '@/features/products/services/productService';
import type { PurchaseStatus, SupplierRef } from '../types/purchasing';

/* ─── Mock Data Store ──────────────────────────────────────── */

/**
 * In-memory purchase order store.
 * Initialized from the existing mock data.
 * All mutations (create, update, cancel, receive, return) operate on this store.
 */
class PurchaseStore {
  private entities: Map<string, PurchaseOrderEntity>;

  constructor() {
    this.entities = new Map();
    this.initializeFromMockData();
  }

  /**
   * Initialize the store from the existing MOCK_PURCHASES array.
   */
  private initializeFromMockData(): void {
    for (const mock of MOCK_PURCHASES) {
      this.entities.set(mock.id, {
        ...mock,
        supplier: { ...mock.supplier },
        items: mock.items.map((item) => ({ ...item })),
      });
    }
  }

  /** Get all entities */
  getAll(): PurchaseOrderEntity[] {
    return Array.from(this.entities.values());
  }

  /** Get one entity by ID */
  getById(id: string): PurchaseOrderEntity | undefined {
    return this.entities.get(id);
  }

  /** Add a new entity */
  add(entity: PurchaseOrderEntity): void {
    this.entities.set(entity.id, entity);
  }

  /** Update an existing entity */
  update(id: string, updated: PurchaseOrderEntity): boolean {
    if (!this.entities.has(id)) return false;
    this.entities.set(id, updated);
    return true;
  }
}

/* ─── Singleton Store Instance ─────────────────────────────── */

const store = new PurchaseStore();

/* ─── Helpers ──────────────────────────────────────────────── */

/**
 * Compute order totals from items.
 */
function computeTotals(items: PurchaseItemEntity[]) {
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const taxTotal = items.reduce(
    (sum, i) => sum + (i.lineTotal * i.taxRate) / 100,
    0,
  );
  const discountTotal = items.reduce((sum, i) => sum + i.discount, 0);
  return { subtotal, taxTotal, discountTotal, total: subtotal + taxTotal - discountTotal };
}

/* ─── PurchasingService ────────────────────────────────────── */

export const PurchasingService = {
  /**
   * Get all purchase orders as DTOs.
   */
  getAll(): PurchaseDTO[] {
    return toDTOList(store.getAll());
  },

  /**
   * Get a single purchase order by ID.
   * Returns undefined if not found.
   */
  getById(id: string): PurchaseDTO | undefined {
    const entity = store.getById(id);
    return entity ? toDTO(entity) : undefined;
  },

  /**
   * Create a new purchase order.
   * Accepts the raw entity data (without id/timestamps).
   * Returns the created DTO.
   */
  create(
    data: Omit<PurchaseOrderEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): PurchaseDTO {
    const entity = createPurchaseOrderEntity(data);
    store.add(entity);
    return toDTO(entity);
  },

  /**
   * Update an existing purchase order.
   * Accepts partial updates.
   * Returns the updated DTO, or undefined if not found.
   */
  update(
    id: string,
    updates: Partial<Omit<PurchaseOrderEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): PurchaseDTO | undefined {
    const existing = store.getById(id);
    if (!existing) return undefined;
    const updated = updatePurchaseOrderEntity(existing, updates);
    store.update(id, updated);
    return toDTO(updated);
  },

  /**
   * Cancel a purchase order.
   * Sets status to 'cancelled' and records the status change time.
   * Returns the updated DTO, or undefined if not found.
   */
  cancel(id: string): PurchaseDTO | undefined {
    const existing = store.getById(id);
    if (!existing) return undefined;
    const updated = updatePurchaseOrderEntity(existing, {
      status: 'cancelled',
      statusChangedAt: new Date().toISOString(),
    });
    store.update(id, updated);
    return toDTO(updated);
  },

  /**
   * Receive goods for a purchase order.
   * Accepts a map of productId -> received quantity.
   * Updates item.quantityReceived and marks the order as
   * received / partially_received depending on completion.
   * Returns the updated DTO, or undefined if not found.
   */
  receive(
    id: string,
    receivedByProduct: Record<string, number>,
  ): PurchaseDTO | undefined {
    const existing = store.getById(id);
    if (!existing) return undefined;

    const items = existing.items.map((item) => {
      const received = receivedByProduct[item.productId] ?? item.quantityReceived;
      return {
        ...item,
        quantityReceived: Math.min(item.quantity, received),
      };
    });

    const allReceived = items.every((i) => i.quantityReceived >= i.quantity);
    const anyReceived = items.some((i) => i.quantityReceived > 0);

    const status: PurchaseStatus = allReceived
      ? 'received'
      : anyReceived
        ? 'partially_received'
        : existing.status;

    const updated = updatePurchaseOrderEntity(existing, {
      items,
      status,
      statusChangedAt: new Date().toISOString(),
    });
    store.update(id, updated);
    return toDTO(updated);
  },

  /**
   * Return items from a purchase order.
   * Reduces the received quantity for the specified products.
   * Returns the updated DTO, or undefined if not found.
   */
  returnItems(
    id: string,
    returnedByProduct: Record<string, number>,
  ): PurchaseDTO | undefined {
    const existing = store.getById(id);
    if (!existing) return undefined;

    const items = existing.items.map((item) => {
      const returned = returnedByProduct[item.productId] ?? 0;
      return {
        ...item,
        quantityReceived: Math.max(0, item.quantityReceived - returned),
      };
    });

    const anyReceived = items.some((i) => i.quantityReceived > 0);
    const status: PurchaseStatus = anyReceived
      ? 'partially_received'
      : existing.status;

    const updated = updatePurchaseOrderEntity(existing, {
      items,
      status,
      statusChangedAt: new Date().toISOString(),
    });
    store.update(id, updated);
    return toDTO(updated);
  },

  /**
   * Search purchase orders by text query.
   * Searches code and supplier name.
   */
  search(query: string): PurchaseDTO[] {
    if (!query.trim()) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(
      (o) =>
        o.code.toLowerCase().includes(q) ||
        o.supplier.name.toLowerCase().includes(q),
    );
  },

  /**
   * Filter purchase orders by criteria.
   * Returns filtered list of DTOs.
   */
  filter(criteria: PurchaseFilterModel): PurchaseDTO[] {
    return applyPurchaseFilters(this.getAll(), criteria);
  },

  /**
   * Sort purchase orders by column and direction.
   * Returns sorted list of DTOs.
   */
  sort(
    orders: PurchaseDTO[],
    sortBy: PurchaseFilterModel['sortBy'],
    sortDirection: PurchaseFilterModel['sortDirection'],
  ): PurchaseDTO[] {
    return applyPurchaseSort(orders, sortBy, sortDirection);
  },

  /**
   * Paginate a list of items.
   * Works with any array type.
   */
  paginate<T>(
    items: T[],
    page: number,
    size: number,
  ): { data: T[]; total: number; page: number; totalPages: number } {
    return applyPurchasePagination(items, page, size);
  },

  /**
   * Get purchase orders as table models (for the PurchaseTable component).
   * Convenience method that combines filter + sort + paginate.
   */
  getTableData(
    filters: PurchaseFilterModel,
  ): {
    orders: PurchaseTableModel[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const filtered = this.filter(filters);
    const sorted = this.sort(filtered, filters.sortBy, filters.sortDirection);
    const paginated = this.paginate(sorted, 1, filters.rowsPerPage);
    return {
      orders: toTableModelList(paginated.data),
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  },

  /**
   * Get available suppliers referenced by purchase orders.
   */
  getSuppliers(): SupplierRef[] {
    const ids = getMockPurchaseSupplierIds();
    return ids
      .map((id) => {
        const dto = SupplierService.getById(id);
        return dto ? { id: dto.id, name: dto.name } : undefined;
      })
      .filter((s): s is SupplierRef => Boolean(s));
  },

  /**
   * Get a summary for the dashboard.
   */
  getSummary(): {
    totalOrders: number;
    pendingOrders: number;
    approvedOrders: number;
    receivedOrders: number;
    totalSpend: number;
    itemsOrdered: number;
  } {
    const all = store.getAll();
    return {
      totalOrders: all.length,
      pendingOrders: all.filter((o) => o.status === 'pending').length,
      approvedOrders: all.filter((o) => o.status === 'approved').length,
      receivedOrders: all.filter((o) => o.status === 'received').length,
      totalSpend: all.reduce((sum, o) => sum + o.total, 0),
      itemsOrdered: all.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
        0,
      ),
    };
  },

  /**
   * Get recent purchase orders (newest first) for the dashboard.
   */
  getRecentOrders(limit = 4): PurchaseTableModel[] {
    const sorted = [...store.getAll()].sort(
      (a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime(),
    );
    return toTableModelList(toDTOList(sorted.slice(0, limit)));
  },

  /**
   * Get status breakdown for the dashboard.
   */
  getStatusBreakdown(): { id: string; name: string; count: number }[] {
    const counts = new Map<string, { id: string; name: string; count: number }>();
    for (const o of store.getAll()) {
      const existing = counts.get(o.status);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(o.status, { id: o.status, name: o.status, count: 1 });
      }
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  },

  /**
   * Get the default filter model.
   */
  getDefaultFilter(): PurchaseFilterModel {
    return { ...DEFAULT_PURCHASE_FILTER_MODEL };
  },

  /**
   * Get available products for the create order form.
   */
  getProducts(): { id: string; name: string }[] {
    return ProductService.getAll().map((p) => ({ id: p.id, name: p.name }));
  },

  /**
   * Create a line item entity from input.
   */
  createItem(data: {
    productId: string;
    quantity: number;
    unitCost: number;
    taxRate?: number;
    discount?: number;
  }): PurchaseItemEntity {
    return createPurchaseItemEntity({
      productId: data.productId,
      quantity: data.quantity,
      unitCost: data.unitCost,
      taxRate: data.taxRate ?? 0,
      discount: data.discount ?? 0,
      lineTotal: data.quantity * data.unitCost,
    });
  },

  /**
   * Recompute order totals from a set of items.
   */
  computeTotals(items: PurchaseItemEntity[]): {
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    total: number;
  } {
    return computeTotals(items);
  },
};
