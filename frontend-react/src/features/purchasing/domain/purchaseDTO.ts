/* ============================================================
   GSDS v1.1 — PurchaseDTO (Data Transfer Object)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — Service layer contract interface
   ============================================================
   PurchaseDTO is the data contract between the service layer
   and consumers (pages, hooks, components).

   It intentionally mirrors PurchaseOrderEntity to avoid
   unnecessary mapping, but is kept separate so the entity can
   evolve without breaking external consumers.
   ============================================================ */

import type { PurchaseOrderEntity } from './purchaseOrderEntity';
import type { PurchaseItemDTO } from './purchaseItemDTO';
import type { PurchaseStatus, SupplierRef } from '../types/purchasing';

/**
 * PurchaseDTO — Data Transfer Object for service layer responses.
 * Structured identically to PurchaseOrderEntity for this milestone.
 */
export interface PurchaseDTO {
  id: string;
  code: string;
  supplier: SupplierRef;
  status: PurchaseStatus;
  items: PurchaseItemDTO[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  expectedAt?: string;
  orderedAt: string;
  notes?: string;
  statusChangedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Map a PurchaseOrderEntity to a PurchaseDTO.
 */
export function toDTO(entity: PurchaseOrderEntity): PurchaseDTO {
  return {
    ...entity,
    items: entity.items.map((item) => ({ ...item })),
  };
}

/**
 * Map a PurchaseDTO back to a PurchaseOrderEntity.
 * Since they share the same shape, this is a pass-through.
 */
export function fromDTO(dto: PurchaseDTO): PurchaseOrderEntity {
  return {
    ...dto,
    items: dto.items.map((item) => ({ ...item })),
  };
}

/**
 * Map an array of entities to an array of DTOs.
 */
export function toDTOList(entities: PurchaseOrderEntity[]): PurchaseDTO[] {
  return entities.map(toDTO);
}
