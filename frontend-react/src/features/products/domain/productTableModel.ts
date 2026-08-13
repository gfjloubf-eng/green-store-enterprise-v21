/* ============================================================
   GSDS v1.1 — Product Table Model (Domain)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — Table view model layer
   ============================================================
   Reuses ProductSummary (the existing table view model).
   No duplication — ProductSummary is the canonical table type.
   
   This module provides mapping helpers from domain models
   to the table-friendly ProductSummary interface.
   ============================================================ */

import type { ProductSummary } from '../types/product';
import type { ProductDTO } from './productDTO';

/**
 * ProductTableModel — Alias for ProductSummary.
 * Keeps the domain layer explicit about table view models.
 */
export type ProductTableModel = ProductSummary;

/**
 * Map a ProductDTO to a ProductTableModel (ProductSummary).
 */
export function toTableModel(dto: ProductDTO): ProductTableModel {
  return {
    id: dto.id,
    image: dto.image,
    barcode: dto.barcode,
    sku: dto.sku,
    name: dto.name,
    category: dto.category,
    brand: dto.brand,
    unit: dto.unit,
    purchasePrice: dto.purchasePrice,
    sellingPrice: dto.sellingPrice,
    stock: dto.stock,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * Map an array of ProductDTOs to ProductTableModels.
 */
export function toTableModelList(dtos: ProductDTO[]): ProductTableModel[] {
  return dtos.map(toTableModel);
}

