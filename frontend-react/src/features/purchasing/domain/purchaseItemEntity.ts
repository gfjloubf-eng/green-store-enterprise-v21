/* ============================================================
   GSDS v1.1 — PurchaseItemEntity (Domain Model)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Pure domain model, no framework dependencies
   ============================================================
   A single line item on a purchase order.
   ============================================================ */

/**
 * PurchaseItemEntity — Full domain model for a purchase order line item.
 */
export interface PurchaseItemEntity {
  /** Unique identifier */
  id: string;
  /** Reference to the ProductEntity */
  productId: string;
  /** Quantity ordered */
  quantity: number;
  /** Quantity received so far (for partial receiving) */
  quantityReceived: number;
  /** Unit cost per item */
  unitCost: number;
  /** Optional tax rate (0–100) */
  taxRate: number;
  /** Optional discount per item */
  discount: number;
  /** Line total (quantity * unitCost) */
  lineTotal: number;
}

/**
 * Create a new purchase item entity with a generated id.
 * Used by the service layer to construct line items.
 */
export function createPurchaseItemEntity(
  data: Omit<PurchaseItemEntity, 'id' | 'quantityReceived'>,
): PurchaseItemEntity {
  return {
    ...data,
    id: `poi-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    quantityReceived: 0,
  };
}

/**
 * Update a purchase item entity with partial data.
 */
export function updatePurchaseItemEntity(
  entity: PurchaseItemEntity,
  updates: Partial<Omit<PurchaseItemEntity, 'id'>>,
): PurchaseItemEntity {
  return { ...entity, ...updates };
}
