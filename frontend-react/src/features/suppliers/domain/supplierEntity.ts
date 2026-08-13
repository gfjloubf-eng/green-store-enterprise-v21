/* ============================================================
   GSDS v1.1 — Supplier Entity (Domain Model)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Pure domain model, no framework dependencies
   ============================================================
   SupplierEntity is the canonical supplier domain model.
   All other models (DTO, Table, Filter) derive from this.
   ============================================================ */

import type { SupplierStatus, SupplierCategoryRef, SupplierContact } from '../types/supplier';

/**
 * SupplierEntity — Full domain model for a supplier.
 * This is the single source of truth for all supplier data.
 */
export interface SupplierEntity {
  /** Unique identifier */
  id: string;
  /** Supplier code (human readable reference, e.g. SUP-001) */
  code: string;
  /** Supplier display name */
  name: string;
  /** Supplier category reference */
  category: SupplierCategoryRef;
  /** Primary contact information */
  contact: SupplierContact;
  /** Primary email address (denormalised for convenience) */
  email: string;
  /** Primary phone number (denormalised for convenience) */
  phone: string;
  /** Street address (optional) */
  address?: string;
  /** Supplier city */
  city: string;
  /** Supplier country */
  country: string;
  /** Tax identifier / VAT number (optional) */
  taxId?: string;
  /** Payment terms (e.g. Net 30) */
  paymentTerms: string;
  /** Preferred currency code */
  currency: string;
  /** Credit limit (optional) */
  creditLimit?: number;
  /** Supplier rating 1–5 (optional) */
  rating?: number;
  /** Supplier status */
  status: SupplierStatus;
  /** Internal notes (optional) */
  notes?: string;
  /** Number of products supplied */
  productCount: number;
  /** Total purchase value (mock aggregate) */
  totalPurchases: number;
  /** Last order date ISO string (optional) */
  lastOrderAt?: string;
  /** Created date ISO string */
  createdAt: string;
  /** Updated date ISO string */
  updatedAt: string;
}

/**
 * Create a new supplier entity with generated fields.
 * Used by the service layer to construct entities from form data.
 */
export function createSupplierEntity(
  data: Omit<SupplierEntity, 'id' | 'createdAt' | 'updatedAt'>,
): SupplierEntity {
  const now = new Date().toISOString();
  return {
    ...data,
    id: `sup-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update an existing supplier entity with partial data.
 * Automatically refreshes the updatedAt timestamp.
 */
export function updateSupplierEntity(
  entity: SupplierEntity,
  updates: Partial<Omit<SupplierEntity, 'id' | 'createdAt' | 'updatedAt'>>,
): SupplierEntity {
  return {
    ...entity,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

