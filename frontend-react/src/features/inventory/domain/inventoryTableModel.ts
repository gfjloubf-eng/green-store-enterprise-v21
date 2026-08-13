/* ============================================================
   GSDS v1.1 — Inventory Table Model (Domain)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Table view model layer
   ============================================================
   Reuses InventorySummary (the table view model from types).
   No duplication — InventorySummary is the canonical table type.
   This module provides mapping helpers from domain models to the
   table-friendly InventorySummary interface, resolving product
   details through the ProductService (not duplicated).
   ============================================================ */

import type { InventorySummary } from '../types/inventory';
import type { InventoryDTO } from './inventoryDTO';

/**
 * InventoryTableModel — Alias for InventorySummary.
 */
export type InventoryTableModel = InventorySummary;

/**
 * Resolver type for product display info.
 * Provided by the service layer using ProductService.
 */
export interface ProductLookup {
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
}

/**
 * Map an InventoryDTO + product lookup to an InventoryTableModel.
 */
export function toTableModel(
  dto: InventoryDTO,
  product: ProductLookup,
): InventoryTableModel {
  return {
    id: dto.id,
    productId: dto.productId,
    productName: product.productName,
    sku: product.sku,
    barcode: product.barcode,
    quantityOnHand: dto.quantityOnHand,
    quantityReserved: dto.quantityReserved,
    quantityAvailable: dto.quantityAvailable,
    minStock: dto.minStock,
    maxStock: dto.maxStock,
    location: dto.location,
    status: dto.status,
    lastMovementAt: dto.lastMovementAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * Map an array of InventoryDTOs + lookup map to InventoryTableModels.
 */
export function toTableModelList(
  dtos: InventoryDTO[],
  lookup: (productId: string) => ProductLookup,
): InventoryTableModel[] {
  return dtos.map((dto) => toTableModel(dto, lookup(dto.productId)));
}

