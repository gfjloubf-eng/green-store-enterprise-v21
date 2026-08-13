/* ============================================================
   GSDS v1.1 — Supplier DTO (Data Transfer Object)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Service layer contract interface
   ============================================================
   SupplierDTO is the data contract between the service layer
   and consumers (pages, hooks, components).

   It intentionally mirrors SupplierEntity to avoid unnecessary
   mapping, but is kept separate so the entity can evolve
   without breaking external consumers.
   ============================================================ */

import type { SupplierEntity } from './supplierEntity';
import type {
  SupplierStatus,
  SupplierCategoryRef,
  SupplierContact,
} from '../types/supplier';

/**
 * SupplierDTO — Data Transfer Object for service layer responses.
 * Structured identically to SupplierEntity for this milestone.
 * Can be transformed independently in future milestones.
 */
export interface SupplierDTO {
  id: string;
  code: string;
  name: string;
  category: SupplierCategoryRef;
  contact: SupplierContact;
  email: string;
  phone: string;
  address?: string;
  city: string;
  country: string;
  taxId?: string;
  paymentTerms: string;
  currency: string;
  creditLimit?: number;
  rating?: number;
  status: SupplierStatus;
  notes?: string;
  productCount: number;
  totalPurchases: number;
  lastOrderAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Map a SupplierEntity to a SupplierDTO.
 */
export function toDTO(entity: SupplierEntity): SupplierDTO {
  return { ...entity };
}

/**
 * Map a SupplierDTO back to a SupplierEntity.
 * Since they share the same shape, this is a pass-through.
 * In future milestones, this may include validation or transformation.
 */
export function fromDTO(dto: SupplierDTO): SupplierEntity {
  return { ...dto };
}

/**
 * Map an array of entities to an array of DTOs.
 */
export function toDTOList(entities: SupplierEntity[]): SupplierDTO[] {
  return entities.map(toDTO);
}

