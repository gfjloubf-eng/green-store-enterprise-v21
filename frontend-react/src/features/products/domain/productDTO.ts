/* ============================================================
   GSDS v1.1 — Product DTO (Data Transfer Object)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Service layer contract interface
   ============================================================
   ProductDTO is the data contract between the service layer
   and consumers (pages, hooks, components).
   
   It intentionally mirrors ProductEntity to avoid unnecessary
   mapping, but is kept separate so the entity can evolve
   without breaking external consumers.
   ============================================================ */

import type { ProductEntity } from './productEntity';
import type { ProductStatus, ProductOffer } from '../types/product';

/**
 * ProductDTO — Data Transfer Object for service layer responses.
 * Structured identically to ProductEntity for this milestone.
 * Can be transformed independently in future milestones.
 */
export interface ProductDTO {
  id: string;
  name: string;
  nameAr?: string;
  sku: string;
  barcode: string;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  unit: { id: string; name: string; abbreviation: string };
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  compareAtPrice?: number;
  offer?: ProductOffer;
  tax: number;
  discount: number;
  stock: number;
  minStock: number;
  maxStock: number;
  trackInventory: boolean;
  image?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Map a ProductEntity to a ProductDTO.
 */
export function toDTO(entity: ProductEntity): ProductDTO {
  return { ...entity };
}

/**
 * Map a ProductDTO back to a ProductEntity.
 * Since they share the same shape, this is a pass-through.
 * In future milestones, this may include validation or transformation.
 */
export function fromDTO(dto: ProductDTO): ProductEntity {
  return { ...dto };
}

/**
 * Map an array of entities to an array of DTOs.
 */
export function toDTOList(entities: ProductEntity[]): ProductDTO[] {
  return entities.map(toDTO);
}

