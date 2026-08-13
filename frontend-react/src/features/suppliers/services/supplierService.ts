/* ============================================================
   GSDS v1.1 — SupplierService (Service Layer)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — In-memory mock service
   ============================================================
   Framework-agnostic service layer.
   No React, no HTTP, no fetch, no axios.
   All data is in-memory mock data only.

   Methods:
   - getAll()      — Get all suppliers
   - getById()     — Get a single supplier by ID
   - create()      — Create a new supplier
   - update()      — Update an existing supplier
   - delete()      — Delete a supplier
   - search()      — Search suppliers by query
   - filter()      — Filter suppliers by criteria
   - sort()        — Sort suppliers by column
   - paginate()    — Paginate a supplier list
   ============================================================ */

import type { SupplierEntity } from '../domain/supplierEntity';
import { createSupplierEntity, updateSupplierEntity } from '../domain/supplierEntity';
import type { SupplierDTO } from '../domain/supplierDTO';
import { toDTO, toDTOList } from '../domain/supplierDTO';
import type { SupplierFilterModel } from '../domain/supplierFilterModel';
import {
  DEFAULT_SUPPLIER_FILTER_MODEL,
  applySupplierFilters,
  applySupplierSort,
  applySupplierPagination,
} from '../domain/supplierFilterModel';
import { toTableModelList, type SupplierTableModel } from '../domain/supplierTableModel';
import { MOCK_SUPPLIERS, getMockSupplierCities } from '../mock/suppliers';
import type { SupplierCategory } from '../types/supplier';

/* ─── Mock Data Store ──────────────────────────────────────── */

/**
 * In-memory supplier store.
 * Initialized from the existing mock data.
 * All mutations (create, update, delete) operate on this store.
 */
class SupplierStore {
  private entities: Map<string, SupplierEntity>;

  constructor() {
    this.entities = new Map();
    this.initializeFromMockData();
  }

  /**
   * Initialize the store from the existing MOCK_SUPPLIERS array.
   */
  private initializeFromMockData(): void {
    for (const mock of MOCK_SUPPLIERS) {
      this.entities.set(mock.id, {
        ...mock,
        category: { ...mock.category },
        contact: { ...mock.contact },
      });
    }
  }

  /** Get all entities */
  getAll(): SupplierEntity[] {
    return Array.from(this.entities.values());
  }

  /** Get one entity by ID */
  getById(id: string): SupplierEntity | undefined {
    return this.entities.get(id);
  }

  /** Add a new entity */
  add(entity: SupplierEntity): void {
    this.entities.set(entity.id, entity);
  }

  /** Update an existing entity */
  update(id: string, updated: SupplierEntity): boolean {
    if (!this.entities.has(id)) return false;
    this.entities.set(id, updated);
    return true;
  }

  /** Delete an entity by ID */
  delete(id: string): boolean {
    return this.entities.delete(id);
  }
}

/* ─── Singleton Store Instance ─────────────────────────────── */

const store = new SupplierStore();

/* ─── SupplierService ──────────────────────────────────────── */

export const SupplierService = {
  /**
   * Get all suppliers as DTOs.
   */
  getAll(): SupplierDTO[] {
    return toDTOList(store.getAll());
  },

  /**
   * Get a single supplier by ID.
   * Returns undefined if not found.
   */
  getById(id: string): SupplierDTO | undefined {
    const entity = store.getById(id);
    return entity ? toDTO(entity) : undefined;
  },

  /**
   * Create a new supplier.
   * Accepts the raw entity data (without id/timestamps).
   * Returns the created DTO.
   */
  create(
    data: Omit<SupplierEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): SupplierDTO {
    const entity = createSupplierEntity(data);
    store.add(entity);
    return toDTO(entity);
  },

  /**
   * Update an existing supplier.
   * Accepts partial updates.
   * Returns the updated DTO, or undefined if not found.
   */
  update(
    id: string,
    updates: Partial<Omit<SupplierEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): SupplierDTO | undefined {
    const existing = store.getById(id);
    if (!existing) return undefined;
    const updated = updateSupplierEntity(existing, updates);
    store.update(id, updated);
    return toDTO(updated);
  },

  /**
   * Delete a supplier by ID.
   * Returns true if deleted, false if not found.
   */
  delete(id: string): boolean {
    return store.delete(id);
  },

  /**
   * Search suppliers by text query.
   * Searches name, code, email, city and contact name.
   */
  search(query: string): SupplierDTO[] {
    if (!query.trim()) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.contact.name.toLowerCase().includes(q),
    );
  },

  /**
   * Filter suppliers by criteria.
   * Returns filtered list of DTOs.
   */
  filter(criteria: SupplierFilterModel): SupplierDTO[] {
    return applySupplierFilters(this.getAll(), criteria);
  },

  /**
   * Sort suppliers by column and direction.
   * Returns sorted list of DTOs.
   */
  sort(
    suppliers: SupplierDTO[],
    sortBy: SupplierFilterModel['sortBy'],
    sortDirection: SupplierFilterModel['sortDirection'],
  ): SupplierDTO[] {
    return applySupplierSort(suppliers, sortBy, sortDirection);
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
    return applySupplierPagination(items, page, size);
  },

  /**
   * Get suppliers as table models (for the SupplierTable component).
   * Convenience method that combines filter + sort + paginate.
   */
  getTableData(
    filters: SupplierFilterModel,
  ): {
    suppliers: SupplierTableModel[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const filtered = this.filter(filters);
    const sorted = this.sort(filtered, filters.sortBy, filters.sortDirection);
    const paginated = this.paginate(sorted, 1, filters.rowsPerPage);
    return {
      suppliers: toTableModelList(paginated.data),
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  },

  /**
   * Get a summary for the dashboard.
   */
  getSummary(): {
    totalSuppliers: number;
    activeSuppliers: number;
    pendingSuppliers: number;
    totalPurchases: number;
    totalProducts: number;
    avgRating: number;
  } {
    const all = store.getAll();
    const rated = all.filter((s) => s.rating != null && s.rating > 0);
    return {
      totalSuppliers: all.length,
      activeSuppliers: all.filter((s) => s.status === 'active').length,
      pendingSuppliers: all.filter((s) => s.status === 'pending').length,
      totalPurchases: all.reduce((sum, s) => sum + s.totalPurchases, 0),
      totalProducts: all.reduce((sum, s) => sum + s.productCount, 0),
      avgRating: rated.length
        ? rated.reduce((sum, s) => sum + (s.rating ?? 0), 0) / rated.length
        : 0,
    };
  },

  /**
   * Get recent suppliers (newest first) for the dashboard.
   */
  getRecentSuppliers(limit = 4): SupplierTableModel[] {
    const sorted = [...store.getAll()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return toTableModelList(toDTOList(sorted.slice(0, limit)));
  },

  /**
   * Get top suppliers by total purchases for the dashboard.
   */
  getTopSuppliers(limit = 4): SupplierTableModel[] {
    const sorted = [...store.getAll()].sort(
      (a, b) => b.totalPurchases - a.totalPurchases,
    );
    return toTableModelList(toDTOList(sorted.slice(0, limit)));
  },

  /**
   * Get category breakdown for the dashboard.
   */
  getCategoryBreakdown(): { id: string; name: string; count: number }[] {
    const counts = new Map<string, { id: string; name: string; count: number }>();
    for (const s of store.getAll()) {
      const existing = counts.get(s.category.id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(s.category.id, {
          id: s.category.id,
          name: s.category.name,
          count: 1,
        });
      }
    }
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  },

  /**
   * Get available supplier categories.
   */
  getCategories(): SupplierCategory[] {
    return MOCK_SUPPLIERS.reduce<SupplierCategory[]>((acc, s) => {
      if (!acc.some((c) => c.id === s.category.id)) {
        const cat = s.category;
        acc.push({
          id: cat.id,
          name: cat.name,
          supplierCount: store
            .getAll()
            .filter((x) => x.category.id === cat.id).length,
          totalPurchases: store
            .getAll()
            .filter((x) => x.category.id === cat.id)
            .reduce((sum, x) => sum + x.totalPurchases, 0),
          createdAt: '2025-01-10T08:00:00Z',
          updatedAt: '2025-03-20T10:00:00Z',
        });
      }
      return acc;
    }, []);
  },

  /**
   * Get available supplier cities (for the city filter).
   */
  getCities(): string[] {
    return getMockSupplierCities();
  },

  /**
   * Get the default filter model.
   */
  getDefaultFilter(): SupplierFilterModel {
    return { ...DEFAULT_SUPPLIER_FILTER_MODEL };
  },
};

