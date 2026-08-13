/* ============================================================
   GSDS v1.1 — PurchaseItemDTO (Data Transfer Object)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Service layer contract interface
   ============================================================
   PurchaseItemDTO is the data contract for a single line item
   on a purchase order. Mirrors PurchaseItemEntity.
   ============================================================ */

import type { PurchaseItemEntity } from './purchaseItemEntity';

/**
 * PurchaseItemDTO — Data Transfer Object for line items.
 */
export interface PurchaseItemDTO {
  id: string;
  productId: string;
  quantity: number;
  quantityReceived: number;
  unitCost: number;
  taxRate: number;
  discount: number;
  lineTotal: number;
}

/**
 * Map a PurchaseItemEntity to a PurchaseItemDTO.
 */
export function toDTO(item: PurchaseItemEntity): PurchaseItemDTO {
  return { ...item };
}

/**
 * Map a PurchaseItemDTO back to a PurchaseItemEntity.
 */
export function fromDTO(dto: PurchaseItemDTO): PurchaseItemEntity {
  return { ...dto };
}

/**
 * Map an array of item entities to an array of item DTOs.
 */
export function toDTOList(items: PurchaseItemEntity[]): PurchaseItemDTO[] {
  return items.map(toDTO);
}
