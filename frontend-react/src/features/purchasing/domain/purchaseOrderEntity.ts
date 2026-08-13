/* ============================================================
   GSDS v1.1 — PurchaseOrderEntity (Domain Model)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Pure domain model, no framework dependencies
   ============================================================
   PurchaseOrderEntity is the canonical purchase order domain model.
   All other models (DTO, Table, Filter) derive from this.
   ============================================================ */

import type { PurchaseStatus, SupplierRef } from '../types/purchasing';
import type { PurchaseItemEntity } from './purchaseItemEntity';

/**
 * PurchaseOrderEntity — Full domain model for a purchase order.
 * This is the single source of truth for all purchase order data.
 */
export interface PurchaseOrderEntity {
  /** Unique identifier */
  id: string;
  /** Purchase order code (human readable reference, e.g. PO-001) */
  code: string;
  /** Supplier reference */
  supplier: SupplierRef;
  /** Order lifecycle status */
  status: PurchaseStatus;
  /** Line items on this order */
  items: PurchaseItemEntity[];
  /** Subtotal before tax/discount */
  subtotal: number;
  /** Total tax amount */
  taxTotal: number;
  /** Total discount amount */
  discountTotal: number;
  /** Grand total (subtotal + tax - discount) */
  total: number;
  /** Expected delivery date ISO string (optional) */
  expectedAt?: string;
  /** Order date ISO string */
  orderedAt: string;
  /** Internal notes (optional) */
  notes?: string;
  /** Timestamp of the last status transition (optional) */
  statusChangedAt?: string;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Create a new purchase order entity with generated fields.
 * Used by the service layer to construct entities from form data.
 */
export function createPurchaseOrderEntity(
  data: Omit<PurchaseOrderEntity, 'id' | 'createdAt' | 'updatedAt'>,
): PurchaseOrderEntity {
  const now = new Date().toISOString();
  return {
    ...data,
    id: `po-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an existing purchase order entity with partial data.
 * Automatically refreshes the updatedAt timestamp.
 */
export function updatePurchaseOrderEntity(
  entity: PurchaseOrderEntity,
  updates: Partial<Omit<PurchaseOrderEntity, 'id' | 'createdAt' | 'updatedAt'>>,
): PurchaseOrderEntity {
  return {
    ...entity,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}
