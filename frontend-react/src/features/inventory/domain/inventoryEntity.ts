/* ============================================================
   GSDS v1.1 — Inventory Entity (Domain Model)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Pure domain model, no framework dependencies
   ============================================================
   InventoryEntity is the canonical inventory domain model.
   It references a ProductEntity by productId only.
   Product information is NOT duplicated inside inventory.
   Product details are resolved through ProductService.
   ============================================================ */

import type { InventoryStatus, InventoryLocation } from '../types/inventory';

/**
 * InventoryEntity — Full domain model for an inventory record.
 * References ProductEntity by productId.
 */
export interface InventoryEntity {
  /** Unique identifier */
  id: string;
  /** Reference to the ProductEntity (no product data duplication) */
  productId: string;
  /** Current stock quantity on hand */
  quantityOnHand: number;
  /** Quantity committed to open orders (reserved) */
  quantityReserved: number;
  /** Minimum stock threshold */
  minStock: number;
  /** Maximum stock threshold */
  maxStock: number;
  /** Physical storage location */
  location: InventoryLocation;
  /** Derived stock status */
  status: InventoryStatus;
  /** Last movement date ISO string */
  lastMovementAt: string;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Compute the derived stock status from quantity and thresholds.
 * Pure helper — no side effects.
 */
export function computeInventoryStatus(
  quantityOnHand: number,
  minStock: number,
  maxStock: number,
): InventoryStatus {
  if (quantityOnHand <= 0) return 'out_of_stock';
  if (maxStock > 0 && quantityOnHand > maxStock) return 'overstocked';
  if (minStock > 0 && quantityOnHand <= minStock) return 'low_stock';
  return 'in_stock';
}

/**
 * Create a new inventory entity with generated fields.
 */
export function createInventoryEntity(
  data: Omit<InventoryEntity, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
): InventoryEntity {
  const now = new Date().toISOString();
  const status = computeInventoryStatus(
    data.quantityOnHand,
    data.minStock,
    data.maxStock,
  );
  return {
    ...data,
    status,
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    lastMovementAt: data.lastMovementAt ?? now,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an inventory entity with partial data.
 * Automatically recomputes the derived status and refreshes updatedAt.
 */
export function updateInventoryEntity(
  entity: InventoryEntity,
  updates: Partial<Omit<InventoryEntity, 'id' | 'createdAt'>>,
): InventoryEntity {
  const merged = {
    ...entity,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return {
    ...merged,
    status: computeInventoryStatus(
      merged.quantityOnHand,
      merged.minStock,
      merged.maxStock,
    ),
  };
}

