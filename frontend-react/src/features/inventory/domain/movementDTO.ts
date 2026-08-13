/* ============================================================
   GSDS v1.1 — Movement DTO (Data Transfer Object)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Service layer contract interface
   ============================================================
   MovementDTO is the data contract between the inventory service
   and consumers for stock movement records.
   ============================================================ */

import type { StockMovementEntity } from './stockMovementEntity';
import type { MovementType, MovementStatus } from '../types/inventory';

/**
 * MovementDTO — Data Transfer Object for stock movements.
 */
export interface MovementDTO {
  id: string;
  productId: string;
  type: MovementType;
  status: MovementStatus;
  quantity: number;
  fromLocation?: { id: string; name: string };
  toLocation?: { id: string; name: string };
  reference?: string;
  reason?: string;
  createdBy?: string;
  performedAt: string;
  createdAt: string;
}

/**
 * Map a StockMovementEntity to a MovementDTO.
 */
export function toDTO(entity: StockMovementEntity): MovementDTO {
  return { ...entity };
}

/**
 * Map an array of entities to an array of DTOs.
 */
export function toDTOList(entities: StockMovementEntity[]): MovementDTO[] {
  return entities.map(toDTO);
}

