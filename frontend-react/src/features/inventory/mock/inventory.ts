/* ============================================================
   GSDS v1.1 — Inventory Mock Data
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — In-memory data for UI development
   ============================================================
   Inventory references products by productId only.
   Product details are resolved through ProductService.
   ============================================================ */

import type { InventoryEntity } from '../domain/inventoryEntity';
import { computeInventoryStatus } from '../domain/inventoryEntity';
import type { StockMovementEntity } from '../domain/stockMovementEntity';

/**
 * Mock inventory locations.
 */
export const MOCK_LOCATIONS = [
  { id: 'loc-1', name: 'Main Warehouse', type: 'warehouse' as const },
  { id: 'loc-2', name: 'Chilled Storage', type: 'warehouse' as const },
  { id: 'loc-3', name: 'Store Shelf A', type: 'shelf' as const },
  { id: 'loc-4', name: 'Store Shelf B', type: 'shelf' as const },
  { id: 'loc-5', name: 'Front Display', type: 'display' as const },
];

/**
 * Build a mock inventory entity for a product.
 * Uses productId only — no product data duplication.
 */
function buildInventory(
  id: string,
  productId: string,
  quantityOnHand: number,
  quantityReserved: number,
  minStock: number,
  maxStock: number,
  locationId: string,
  lastMovementAt: string,
  createdAt: string,
): InventoryEntity {
  const location = MOCK_LOCATIONS.find((l) => l.id === locationId) ?? MOCK_LOCATIONS[0];
  return {
    id,
    productId,
    quantityOnHand,
    quantityReserved,
    minStock,
    maxStock,
    location,
    status: computeInventoryStatus(quantityOnHand, minStock, maxStock),
    lastMovementAt,
    createdAt,
    updatedAt: lastMovementAt,
  };
}

/**
 * Mock inventory records (one per product in MOCK_PRODUCTS).
 */
export const MOCK_INVENTORY: InventoryEntity[] = [
  buildInventory('inv-001', 'prod-001', 150, 10, 20, 300, 'loc-1', '2025-03-20T10:30:00Z', '2025-01-15T08:00:00Z'),
  buildInventory('inv-002', 'prod-002', 80, 5, 25, 200, 'loc-2', '2025-03-18T14:00:00Z', '2025-01-20T09:00:00Z'),
  buildInventory('inv-003', 'prod-003', 200, 0, 30, 250, 'loc-3', '2025-03-15T11:00:00Z', '2025-02-01T07:30:00Z'),
  buildInventory('inv-004', 'prod-004', 0, 0, 15, 120, 'loc-2', '2025-03-10T09:00:00Z', '2025-02-10T06:00:00Z'),
  buildInventory('inv-005', 'prod-005', 45, 8, 20, 100, 'loc-5', '2025-03-22T16:00:00Z', '2025-02-15T10:00:00Z'),
  buildInventory('inv-006', 'prod-006', 300, 15, 40, 400, 'loc-1', '2025-03-21T12:00:00Z', '2025-02-20T08:00:00Z'),
  buildInventory('inv-007', 'prod-007', 0, 0, 10, 80, 'loc-1', '2025-01-15T10:00:00Z', '2024-11-01T08:00:00Z'),
  buildInventory('inv-008', 'prod-008', 120, 3, 20, 150, 'loc-3', '2025-03-23T09:00:00Z', '2025-03-01T07:00:00Z'),
  buildInventory('inv-009', 'prod-009', 60, 6, 25, 140, 'loc-2', '2025-03-05T10:00:00Z', '2025-03-05T10:00:00Z'),
  buildInventory('inv-010', 'prod-010', 250, 20, 30, 300, 'loc-1', '2025-03-24T11:00:00Z', '2025-03-10T08:00:00Z'),
];

/**
 * Mock stock movements.
 * Designed to support future Sales, Purchases and Adjustments.
 */
export const MOCK_MOVEMENTS: StockMovementEntity[] = [
  {
    id: 'mv-001',
    productId: 'prod-001',
    type: 'stock_in',
    status: 'completed',
    quantity: 50,
    toLocation: { id: 'loc-1', name: 'Main Warehouse' },
    reference: 'PO-2025-001',
    reason: 'Initial stock purchase',
    performedAt: '2025-03-20T10:30:00Z',
    createdAt: '2025-03-20T10:30:00Z',
  },
  {
    id: 'mv-002',
    productId: 'prod-002',
    type: 'stock_in',
    status: 'completed',
    quantity: 30,
    toLocation: { id: 'loc-2', name: 'Chilled Storage' },
    reference: 'PO-2025-002',
    reason: 'Chilled goods delivery',
    performedAt: '2025-03-18T14:00:00Z',
    createdAt: '2025-03-18T14:00:00Z',
  },
  {
    id: 'mv-003',
    productId: 'prod-005',
    type: 'transfer',
    status: 'completed',
    quantity: 12,
    fromLocation: { id: 'loc-1', name: 'Main Warehouse' },
    toLocation: { id: 'loc-5', name: 'Front Display' },
    reference: 'TR-2025-011',
    reason: 'Move to front display',
    performedAt: '2025-03-22T16:00:00Z',
    createdAt: '2025-03-22T16:00:00Z',
  },
  {
    id: 'mv-004',
    productId: 'prod-008',
    type: 'stock_out',
    status: 'completed',
    quantity: -15,
    fromLocation: { id: 'loc-3', name: 'Store Shelf A' },
    reference: 'SO-2025-034',
    reason: 'Retail sale',
    performedAt: '2025-03-23T09:00:00Z',
    createdAt: '2025-03-23T09:00:00Z',
  },
  {
    id: 'mv-005',
    productId: 'prod-004',
    type: 'adjustment',
    status: 'completed',
    quantity: -20,
    fromLocation: { id: 'loc-2', name: 'Chilled Storage' },
    reference: 'ADJ-2025-008',
    reason: 'Spoilage write-off',
    performedAt: '2025-03-10T09:00:00Z',
    createdAt: '2025-03-10T09:00:00Z',
  },
  {
    id: 'mv-006',
    productId: 'prod-010',
    type: 'stock_in',
    status: 'completed',
    quantity: 80,
    toLocation: { id: 'loc-1', name: 'Main Warehouse' },
    reference: 'PO-2025-003',
    reason: 'Weekly restock',
    performedAt: '2025-03-24T11:00:00Z',
    createdAt: '2025-03-24T11:00:00Z',
  },
  {
    id: 'mv-007',
    productId: 'prod-006',
    type: 'transfer',
    status: 'completed',
    quantity: 25,
    fromLocation: { id: 'loc-1', name: 'Main Warehouse' },
    toLocation: { id: 'loc-4', name: 'Store Shelf B' },
    reference: 'TR-2025-012',
    reason: 'Shelf restock',
    performedAt: '2025-03-21T12:00:00Z',
    createdAt: '2025-03-21T12:00:00Z',
  },
  {
    id: 'mv-008',
    productId: 'prod-007',
    type: 'stock_out',
    status: 'completed',
    quantity: -10,
    fromLocation: { id: 'loc-1', name: 'Main Warehouse' },
    reference: 'SO-2025-035',
    reason: 'Retail sale',
    performedAt: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'mv-009',
    productId: 'prod-009',
    type: 'adjustment',
    status: 'pending',
    quantity: -5,
    fromLocation: { id: 'loc-2', name: 'Chilled Storage' },
    reference: 'ADJ-2025-009',
    reason: 'Damage report pending review',
    performedAt: '2025-03-25T08:00:00Z',
    createdAt: '2025-03-25T08:00:00Z',
  },
  {
    id: 'mv-010',
    productId: 'prod-003',
    type: 'stock_in',
    status: 'completed',
    quantity: 40,
    toLocation: { id: 'loc-3', name: 'Store Shelf A' },
    reference: 'PO-2025-004',
    reason: 'Fresh herbs restock',
    performedAt: '2025-03-15T11:00:00Z',
    createdAt: '2025-03-15T11:00:00Z',
  },
];

/**
 * Get a mock movement by ID.
 */
export function getMockMovementById(id: string): StockMovementEntity | undefined {
  return MOCK_MOVEMENTS.find((m) => m.id === id);
}

