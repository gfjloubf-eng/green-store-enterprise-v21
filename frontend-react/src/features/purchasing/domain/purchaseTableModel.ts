/* ============================================================
   GSDS v1.1 â€” Purchase Table Model (Domain)
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Table view model layer
   ============================================================
   Reuses PurchaseOrderSummary (the existing table view model).
   No duplication â€” PurchaseOrderSummary is the canonical table type.

   This module provides mapping helpers from domain models
   to the table-friendly PurchaseOrderSummary interface.
   ============================================================ */

import type { PurchaseOrderSummary } from '../types/purchasing';
import type { PurchaseDTO } from './purchaseDTO';

/**
 * PurchaseTableModel â€” Alias for PurchaseOrderSummary.
 * Keeps the domain layer explicit about table view models.
 */
export type PurchaseTableModel = PurchaseOrderSummary;

/**
 * Map a PurchaseDTO to a PurchaseTableModel (PurchaseOrderSummary).
 */
export function toTableModel(dto: PurchaseDTO): PurchaseTableModel {
  return {
    id: dto.id,
    code: dto.code,
    supplier: dto.supplier,
    status: dto.status,
    itemCount: dto.items.length,
    totalQuantity: dto.items.reduce((sum, i) => sum + i.quantity, 0),
    totalCost: dto.total,
    expectedAt: dto.expectedAt,
    orderedAt: dto.orderedAt,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * Map an array of PurchaseDTOs to PurchaseTableModels.
 */
export function toTableModelList(dtos: PurchaseDTO[]): PurchaseTableModel[] {
  return dtos.map(toTableModel);
}
