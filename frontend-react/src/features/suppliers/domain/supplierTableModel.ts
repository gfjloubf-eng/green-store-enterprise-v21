/* ============================================================
   GSDS v1.1 — Supplier Table Model (Domain)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Table view model layer
   ============================================================
   Reuses SupplierSummary (the existing table view model).
   No duplication — SupplierSummary is the canonical table type.

   This module provides mapping helpers from domain models
   to the table-friendly SupplierSummary interface.
   ============================================================ */

import type { SupplierSummary } from '../types/supplier';
import type { SupplierDTO } from './supplierDTO';

/**
 * SupplierTableModel — Alias for SupplierSummary.
 * Keeps the domain layer explicit about table view models.
 */
export type SupplierTableModel = SupplierSummary;

/**
 * Map a SupplierDTO to a SupplierTableModel (SupplierSummary).
 */
export function toTableModel(dto: SupplierDTO): SupplierTableModel {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    category: dto.category,
    contact: dto.contact,
    email: dto.email,
    phone: dto.phone,
    city: dto.city,
    country: dto.country,
    status: dto.status,
    productCount: dto.productCount,
    totalPurchases: dto.totalPurchases,
    lastOrderAt: dto.lastOrderAt,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * Map an array of SupplierDTOs to SupplierTableModels.
 */
export function toTableModelList(dtos: SupplierDTO[]): SupplierTableModel[] {
  return dtos.map(toTableModel);
}

