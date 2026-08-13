/* ============================================================
   GSDS v1.1 — Stock Movement Entity (Domain Model)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Future-proof movement model
   ============================================================
   StockMovementEntity is designed to support future Sales,
   Purchases and Adjustments without breaking changes.
   Each movement references a product by productId and records
   a type, direction, quantity delta, locations, and optional
   source reference (e.g. order ID, purchase ID, adjustment ID).
   ============================================================ */

import type { MovementType, MovementStatus } from '../types/inventory';

/**
 * Movement direction — derived from type.
 * Adjustment and transfer are neutral (internal balance changes).
 */
export type MovementDirection = 'in' | 'out' | 'adjustment';

/**
 * Map a movement type to its direction.
 * Pure helper — stock_in/purchase = in; stock_out/sale = out;
 * adjustment/transfer = adjustment (stock moves within warehouse).
 */
export function getMovementDirection(type: MovementType): MovementDirection {
  switch (type) {
    case 'stock_in':
    case 'purchase':
      return 'in';
    case 'stock_out':
    case 'sale':
      return 'out';
    case 'adjustment':
    case 'transfer':
    default:
      return 'adjustment';
  }
}

/**
 * StockMovementEntity — Full domain model for a stock movement.
 */
export interface StockMovementEntity {
  /** Unique identifier */
  id: string;
  /** Reference to the ProductEntity */
  productId: string;
  /** Movement type */
  type: MovementType;
  /** Movement status */
  status: MovementStatus;
  /** Signed quantity delta (+in / -out) */
  quantity: number;
  /** Source location (for in/adjustment) */
  fromLocation?: { id: string; name: string };
  /** Destination location (for out/transfer) */
  toLocation?: { id: string; name: string };
  /** External reference (future: sale ID, purchase ID, etc.) */
  reference?: string;
  /** Human-readable reason / note */
  reason?: string;
  /** User who performed the movement (future milestone) */
  createdBy?: string;
  /** Movement date ISO string */
  performedAt: string;
  /** Created date ISO string */
  createdAt: string;
}

/**
 * Create a new stock movement entity with generated fields.
 * Used by the service layer to construct movements.
 */
export function createStockMovementEntity(
  data: Omit<StockMovementEntity, 'id' | 'createdAt'>,
): StockMovementEntity {
  const now = new Date().toISOString();
  return {
    ...data,
    id: `mv-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: now,
  };
}

