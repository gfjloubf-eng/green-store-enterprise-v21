/* ============================================================
   GSDS v1.1 — InventoryService (Service Layer)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — In-memory mock service
   ============================================================
   Framework-agnostic service layer.
   No React, no HTTP, no fetch, no axios.
   All data is in-memory mock data only.

   Reuses ProductService for product information.
   Inventory records reference products by productId only.

   Methods:
   - getInventory()         — Get all inventory records
   - getMovementHistory()   — Get all stock movements
   - adjustStock()          — Adjust stock for a product
   - transferStock()        — Transfer stock between locations
   - getLowStock()          — Get low-stock items
   - getOutOfStock()        — Get out-of-stock items
   - search()               — Search inventory by query
   - filter()               — Filter inventory by criteria
   - sort()                 — Sort inventory by column
   - paginate()             — Paginate an inventory list
   ============================================================ */

import type { InventoryEntity } from '../domain/inventoryEntity';
import { updateInventoryEntity } from '../domain/inventoryEntity';
import type { StockMovementEntity } from '../domain/stockMovementEntity';
import { createStockMovementEntity } from '../domain/stockMovementEntity';
import type { InventoryDTO } from '../domain/inventoryDTO';
import { toDTO as toInventoryDTO, toDTOList as toInventoryDTOList } from '../domain/inventoryDTO';
import type { MovementDTO } from '../domain/movementDTO';
import { toDTOList as toMovementDTOList } from '../domain/movementDTO';
import type { InventoryFilterModel } from '../domain/inventoryFilterModel';
import {
  DEFAULT_INVENTORY_FILTER_MODEL,
  applyInventoryFilters,
  applyInventorySort,
  applyInventoryPagination,
} from '../domain/inventoryFilterModel';
import type { ProductLookup } from '../domain/inventoryTableModel';
import { toTableModelList } from '../domain/inventoryTableModel';
import type { InventoryTableModel } from '../domain/inventoryTableModel';
import { ProductService } from '@/features/products/services/productService';
import { isAuthorizedStaffOrAdmin, fetchWithAuth, parseJsonSafe } from '@/services/authClient';
import { MOCK_INVENTORY, MOCK_MOVEMENTS } from '../mock/inventory';
import type { MovementType, MovementStatus, InventoryLocation } from '../types/inventory';

/* ─── Backend DTO Mapper (Read-Only) ────────────────────────── */

function mapBackendInventoryToEntity(item: any): InventoryEntity {
  const qOnHand = Number(item.quantityOnHand ?? item.quantity ?? item.availableQuantity ?? 0);
  const qReserved = Number(item.quantityReserved ?? item.reservedQuantity ?? item.reserved ?? 0);
  const minStk = Number(item.minStock ?? item.lowStockThreshold ?? 10);
  const maxStk = Number(item.maxStock ?? 100);
  const now = new Date().toISOString();

  return {
    id: String(item.id || `inv-${item.productId || Math.random()}`),
    productId: String(item.productId || item.product?.id || ''),
    quantityOnHand: qOnHand,
    quantityReserved: qReserved,
    minStock: minStk,
    maxStock: maxStk,
    location: typeof item.location === 'object' && item.location !== null ? item.location : { id: String(item.warehouseId || 'loc-1'), name: item.warehouse?.name || 'Main Warehouse', type: 'warehouse' },
    status: item.status || (qOnHand === 0 ? 'out_of_stock' : qOnHand <= minStk ? 'low_stock' : 'in_stock'),
    lastMovementAt: String(item.lastMovementAt || item.updatedAt || now),
    createdAt: String(item.createdAt || now),
    updatedAt: String(item.updatedAt || now),
  };
}

/* ─── Mock Data Store ──────────────────────────────────────── */

/**
 * In-memory inventory store.
 * Initialized from the mock data.
 * Mutations (adjust, transfer) operate on this store.
 */
class InventoryStore {
  private entities: Map<string, InventoryEntity>;
  private movements: Map<string, StockMovementEntity>;

  constructor() {
    this.entities = new Map();
    this.movements = new Map();
    this.initializeFromMockData();
  }

  private initializeFromMockData(): void {
    for (const entity of MOCK_INVENTORY) {
      this.entities.set(entity.id, { ...entity, location: { ...entity.location } });
    }
    for (const movement of MOCK_MOVEMENTS) {
      this.movements.set(movement.id, { ...movement });
    }
  }

  getAllEntities(): InventoryEntity[] {
    return Array.from(this.entities.values());
  }

  getEntityByProductId(productId: string): InventoryEntity | undefined {
    return Array.from(this.entities.values()).find((e) => e.productId === productId);
  }

  getEntityById(id: string): InventoryEntity | undefined {
    return this.entities.get(id);
  }

  upsert(entity: InventoryEntity): void {
    this.entities.set(entity.id, entity);
  }

  getAllMovements(): StockMovementEntity[] {
    return Array.from(this.movements.values());
  }

  addMovement(movement: StockMovementEntity): void {
    this.movements.set(movement.id, movement);
  }
}

/* ─── Singleton Store Instance ─────────────────────────────── */

const store = new InventoryStore();

/* ─── Product Lookup Resolver ──────────────────────────────── */

/**
 * Resolve product display info through ProductService.
 * Inventory never duplicates product data.
 */
function resolveProductLookup(productId: string): ProductLookup {
  const product = ProductService.getById(productId);
  return {
    productId,
    productName: product?.name ?? productId,
    sku: product?.sku ?? '—',
    barcode: product?.barcode ?? '—',
  };
}

/* ─── InventoryService ─────────────────────────────────────── */

export const InventoryService = {
  /**
   * Get all inventory records as DTOs.
   * Dynamically includes products from ProductService so all products have inventory state.
   */
  getInventory(): InventoryDTO[] {
    this.syncFromBackendApi().catch(() => {});
    const invEntities = store.getAllEntities();
    const invProductIds = new Set(invEntities.map((e) => e.productId));
    const allProducts = ProductService.getAll();

    for (const p of allProducts) {
      if (!invProductIds.has(p.id)) {
        const now = new Date().toISOString();
        const minStock = p.minStock || 10;
        const maxStock = p.maxStock || 100;
        invEntities.push({
          id: `inv-${p.id}`,
          productId: p.id,
          quantityOnHand: p.stock,
          quantityReserved: 0,
          minStock,
          maxStock,
          location: { id: 'loc-1', name: 'Main Warehouse', type: 'warehouse' },
          status: p.stock === 0 ? 'out_of_stock' : p.stock <= minStock ? 'low_stock' : 'in_stock',
          lastMovementAt: p.createdAt || now,
          createdAt: p.createdAt || now,
          updatedAt: p.updatedAt || now,
        });
      }
    }

    return toInventoryDTOList(invEntities);
  },

  /**
   * Async fetch inventory records from Backend API with safe fallback to local store.
   */
  async syncFromBackendApi(): Promise<InventoryDTO[]> {
    try {
      const res = await fetchWithAuth('/inventory?limit=1000', { method: 'GET' });
      if (res.ok) {
        const payload = await parseJsonSafe(res);
        const list = Array.isArray(payload?.data?.items)
          ? payload.data.items
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];
        for (const item of list) {
          const entity = mapBackendInventoryToEntity(item);
          if (entity.productId) store.upsert(entity);
        }
      }
    } catch {
      // Safe fallback: Local store remains active when the API is unavailable.
    }
    return this.getInventory();
  },

  /**
   * Get all stock movements as DTOs, newest first.
   */
  getMovementHistory(): MovementDTO[] {
    return toMovementDTOList(store.getAllMovements()).sort(
      (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime(),
    );
  },

  /**
   * Adjust stock for a product.
   * delta can be positive (stock in) or negative (stock out).
   * Syncs back with ProductService and logs a movement record.
   */
  adjustStock(
    productId: string,
    delta: number,
    reason: string,
    locationId?: string,
  ): InventoryDTO | undefined {
    if (!isAuthorizedStaffOrAdmin()) {
      throw new Error('غير مصرح: تعديل المخزون يتطلب صلاحيات إدارية');
    }
    const now = new Date().toISOString();
    let entity = store.getEntityByProductId(productId);
    if (!entity) {
      const prod = ProductService.getById(productId);
      if (!prod) return undefined;
      entity = {
        id: `inv-${productId}`,
        productId,
        quantityOnHand: prod.stock,
        quantityReserved: 0,
        minStock: prod.minStock || 10,
        maxStock: prod.maxStock || 100,
        location: { id: locationId || 'loc-1', name: locationId || 'Main Warehouse', type: 'warehouse' },
        status: prod.stock === 0 ? 'out_of_stock' : prod.stock <= (prod.minStock || 10) ? 'low_stock' : 'in_stock',
        lastMovementAt: now,
        createdAt: now,
        updatedAt: now,
      };
    }

    const newQuantity = Math.max(0, entity.quantityOnHand + delta);
    const updated = updateInventoryEntity(entity, {
      quantityOnHand: newQuantity,
      lastMovementAt: now,
    });
    store.upsert(updated);

    // Sync back to ProductService
    ProductService.update(productId, { stock: newQuantity });

    const movementType = delta < 0 ? 'stock_out' : 'stock_in';

    const movement: StockMovementEntity = createStockMovementEntity({
      productId,
      type: movementType as any,
      status: 'completed',
      quantity: delta,
      fromLocation: locationId ? { id: locationId, name: locationId } : undefined,
      reason,
      performedAt: new Date().toISOString(),
    });
    store.addMovement(movement);

    return toInventoryDTO(updated);
  },

  /**
   * Transfer stock between locations.
   * Moves quantity from source location to destination location.
   * Creates a movement record.
   */
  transferStock(
    productId: string,
    quantity: number,
    fromLocation: { id: string; name: string },
    toLocation: { id: string; name: string },
  ): InventoryDTO | undefined {
    const entity = store.getEntityByProductId(productId);
    if (!entity || entity.quantityOnHand < quantity) return undefined;

    const updated = updateInventoryEntity(entity, {
      quantityOnHand: entity.quantityOnHand,
      lastMovementAt: new Date().toISOString(),
    });
    store.upsert(updated);

    const movement: StockMovementEntity = createStockMovementEntity({
      productId,
      type: 'transfer',
      status: 'completed',
      quantity,
      fromLocation,
      toLocation,
      reason: 'Transfer between locations',
      performedAt: new Date().toISOString(),
    });
    store.addMovement(movement);

    return toInventoryDTO(updated);
  },

  /**
   * Get low-stock inventory items as table models.
   */
  getLowStock(): InventoryTableModel[] {
    const lowStockEntities = store
      .getAllEntities()
      .filter((e) => e.status === 'low_stock');
    return toTableModelList(
      toInventoryDTOList(lowStockEntities),
      resolveProductLookup,
    );
  },

  /**
   * Get out-of-stock inventory items as table models.
   */
  getOutOfStock(): InventoryTableModel[] {
    const outEntities = store
      .getAllEntities()
      .filter((e) => e.status === 'out_of_stock');
    return toTableModelList(
      toInventoryDTOList(outEntities),
      resolveProductLookup,
    );
  },

  /**
   * Search inventory by text query.
   * Searches productId, product name, SKU, barcode and location.
   */
  search(query: string): InventoryDTO[] {
    if (!query.trim()) return this.getInventory();
    const q = query.toLowerCase();
    return this.getInventory().filter((item) => {
      const product = resolveProductLookup(item.productId);
      return (
        item.productId.toLowerCase().includes(q) ||
        product.productName.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.barcode.toLowerCase().includes(q) ||
        item.location.name.toLowerCase().includes(q)
      );
    });
  },

  /**
   * Filter inventory by criteria.
   */
  filter(criteria: InventoryFilterModel): InventoryDTO[] {
    return applyInventoryFilters(this.getInventory(), criteria);
  },

  /**
   * Sort inventory by column and direction.
   */
  sort(
    inventory: InventoryDTO[],
    sortBy: InventoryFilterModel['sortBy'],
    sortDirection: InventoryFilterModel['sortDirection'],
  ): InventoryDTO[] {
    return applyInventorySort(inventory, sortBy, sortDirection);
  },

  /**
   * Paginate a list of items.
   */
  paginate<T>(
    items: T[],
    page: number,
    size: number,
  ): { data: T[]; total: number; page: number; totalPages: number } {
    return applyInventoryPagination(items, page, size);
  },

  /**
   * Get inventory as table models (for InventoryTable component).
   * Combines filter + sort + paginate.
   */
  getTableData(
    filters: InventoryFilterModel,
  ): {
    inventory: InventoryTableModel[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const filtered = this.filter(filters);
    const sorted = this.sort(filtered, filters.sortBy, filters.sortDirection);
    const paginated = this.paginate(sorted, 1, filters.rowsPerPage);
    return {
      inventory: toTableModelList(paginated.data, resolveProductLookup),
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  },

  /**
   * Get a summary for the dashboard.
   */
  getSummary(): {
    totalProducts: number;
    totalUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    overstockedCount: number;
  } {
    const all = store.getAllEntities();
    return {
      totalProducts: all.length,
      totalUnits: all.reduce((sum, e) => sum + e.quantityOnHand, 0),
      lowStockCount: all.filter((e) => e.status === 'low_stock').length,
      outOfStockCount: all.filter((e) => e.status === 'out_of_stock').length,
      overstockedCount: all.filter((e) => e.status === 'overstocked').length,
    };
  },

  /**
   * Get recent movements for the dashboard.
   */
  getRecentMovements(limit = 6): MovementDTO[] {
    return this.getMovementHistory().slice(0, limit);
  },

  /**
   * Get available locations (from mock).
   */
  getLocations(): InventoryLocation[] {
    return [
      { id: 'loc-1', name: 'Main Warehouse', type: 'warehouse' },
      { id: 'loc-2', name: 'Chilled Storage', type: 'warehouse' },
      { id: 'loc-3', name: 'Store Shelf A', type: 'shelf' },
      { id: 'loc-4', name: 'Store Shelf B', type: 'shelf' },
      { id: 'loc-5', name: 'Front Display', type: 'display' },
    ];
  },

  /**
   * Get movement types.
   */
  getMovementTypes(): MovementType[] {
    return ['stock_in', 'stock_out', 'adjustment', 'transfer', 'sale', 'purchase'];
  },

  /**
   * Get movement statuses.
   */
  getMovementStatuses(): MovementStatus[] {
    return ['pending', 'completed', 'cancelled'];
  },

  /**
   * Get the default filter model.
   */
  getDefaultFilter(): InventoryFilterModel {
    return { ...DEFAULT_INVENTORY_FILTER_MODEL };
  },
};

