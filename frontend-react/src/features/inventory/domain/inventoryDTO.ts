/* ============================================================
   GSDS v1.1 — Inventory DTO (Data Transfer Object)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Service layer contract interface
   ============================================================
   InventoryDTO is the data contract between the inventory service
   and consumers (pages, hooks, components).
   ============================================================ */

import type { InventoryEntity } from './inventoryEntity';
import type { InventoryStatus, InventoryLocation } from '../types/inventory';

/**
 * InventoryDTO — Data Transfer Object for service layer responses.
 * Mirrors InventoryEntity to avoid unnecessary mapping, but kept
 * separate so the entity can evolve without breaking consumers.
 */
export interface InventoryDTO {
  id: string;
  productId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  minStock: number;
  maxStock: number;
  location: InventoryLocation;
  status: InventoryStatus;
  lastMovementAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Map an InventoryEntity to an InventoryDTO.
 * Computes quantityAvailable from on-hand minus reserved.
 */
export function toDTO(entity: InventoryEntity): InventoryDTO {
  return {
    ...entity,
    quantityAvailable: entity.quantityOnHand - entity.quantityReserved,
  };
}

/**
 * Map an InventoryDTO back to an InventoryEntity.
 * quantityAvailable is derived and excluded from the entity.
 */
export function fromDTO(dto: InventoryDTO): InventoryEntity {
  const rest = { ...dto };
  delete (rest as Partial<InventoryDTO>).quantityAvailable;
  return rest as Omit<InventoryDTO, 'quantityAvailable'>;
}

/**
 * Map an array of entities to an array of DTOs.
 */
export function toDTOList(entities: InventoryEntity[]): InventoryDTO[] {
  return entities.map(toDTO);
}

