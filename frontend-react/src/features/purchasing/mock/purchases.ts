/* ============================================================
   GSDS v1.1 — Purchase Mock Data
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.6 — In-memory data for UI development
   ============================================================
   Purchase orders are standalone domain records. They reference
   products via productId and suppliers via supplierId only.
   No product or supplier duplication.
   ============================================================ */

import type { PurchaseOrderEntity } from '../domain/purchaseOrderEntity';
import type { PurchaseItemEntity } from '../domain/purchaseItemEntity';

/**
 * Build a purchase item entity.
 */
function buildItem(
  id: string,
  productId: string,
  quantity: number,
  unitCost: number,
  taxRate: number,
  quantityReceived = 0,
): PurchaseItemEntity {
  const discount = 0;
  const lineTotal = quantity * unitCost;
  return {
    id,
    productId,
    quantity,
    quantityReceived,
    unitCost,
    taxRate,
    discount,
    lineTotal,
  };
}

/**
 * Build a purchase order entity from items.
 * Computes subtotal, taxTotal, discountTotal and total.
 */
function buildOrder(
  id: string,
  code: string,
  supplierId: string,
  supplierName: string,
  status: PurchaseOrderEntity['status'],
  items: PurchaseItemEntity[],
  expectedAt: string | undefined,
  orderedAt: string,
  createdAt: string,
  updatedAt: string,
): PurchaseOrderEntity {
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const taxTotal = items.reduce(
    (sum, i) => sum + (i.lineTotal * i.taxRate) / 100,
    0,
  );
  const discountTotal = items.reduce((sum, i) => sum + i.discount, 0);
  return {
    id,
    code,
    supplier: { id: supplierId, name: supplierName },
    status,
    items,
    subtotal,
    taxTotal,
    discountTotal,
    total: subtotal + taxTotal - discountTotal,
    expectedAt,
    orderedAt,
    notes: '',
    createdAt,
    updatedAt,
  };
}

/**
 * Mock purchase orders (8 orders across suppliers).
 */
export const MOCK_PURCHASES: PurchaseOrderEntity[] = [
  buildOrder(
    'po-001', 'PO-001', 'sup-001', 'Green Farm Produce Co.', 'received',
    [
      buildItem('poi-001', 'prod-001', 50, 1.5, 5, 50),
      buildItem('poi-002', 'prod-006', 80, 0.6, 5, 80),
    ],
    '2025-03-20T10:00:00Z', '2025-03-10T08:00:00Z', '2025-03-10T08:00:00Z', '2025-03-21T09:00:00Z',
  ),
  buildOrder(
    'po-002', 'PO-002', 'sup-003', 'Organic Valley Supplies', 'approved',
    [
      buildItem('poi-003', 'prod-003', 100, 0.5, 5),
      buildItem('poi-004', 'prod-008', 120, 0.4, 5),
    ],
    '2025-03-28T10:00:00Z', '2025-03-18T11:00:00Z', '2025-03-18T11:00:00Z', '2025-03-19T14:00:00Z',
  ),
  buildOrder(
    'po-003', 'PO-003', 'sup-002', 'Nature\'s Best Farms', 'partially_received',
    [
      buildItem('poi-005', 'prod-002', 40, 2.0, 5, 25),
      buildItem('poi-006', 'prod-010', 60, 0.7, 5, 60),
    ],
    '2025-03-25T10:00:00Z', '2025-03-15T09:00:00Z', '2025-03-15T09:00:00Z', '2025-03-20T12:00:00Z',
  ),
  buildOrder(
    'po-004', 'PO-004', 'sup-006', 'EcoGrow Beverages', 'pending',
    [
      buildItem('poi-007', 'prod-005', 30, 3.0, 5),
      buildItem('poi-008', 'prod-007', 45, 1.2, 5),
    ],
    '2025-04-02T10:00:00Z', '2025-03-22T10:00:00Z', '2025-03-22T10:00:00Z', '2025-03-22T10:00:00Z',
  ),
  buildOrder(
    'po-005', 'PO-005', 'sup-004', 'Fresh Harvest Dairy', 'draft',
    [
      buildItem('poi-009', 'prod-004', 60, 0.8, 5),
      buildItem('poi-010', 'prod-009', 40, 1.0, 5),
    ],
    undefined, '2025-03-24T09:00:00Z', '2025-03-24T09:00:00Z', '2025-03-24T09:00:00Z',
  ),
  buildOrder(
    'po-006', 'PO-006', 'sup-008', 'GreenPack Packaging', 'cancelled',
    [
      buildItem('poi-011', 'prod-001', 20, 1.5, 5),
    ],
    '2025-03-12T10:00:00Z', '2025-03-05T08:00:00Z', '2025-03-05T08:00:00Z', '2025-03-06T09:00:00Z',
  ),
  buildOrder(
    'po-007', 'PO-007', 'sup-001', 'Green Farm Produce Co.', 'received',
    [
      buildItem('poi-012', 'prod-006', 100, 0.6, 5, 100),
      buildItem('poi-013', 'prod-010', 50, 0.7, 5, 50),
    ],
    '2025-03-16T10:00:00Z', '2025-03-08T08:00:00Z', '2025-03-08T08:00:00Z', '2025-03-17T09:00:00Z',
  ),
  buildOrder(
    'po-008', 'PO-008', 'sup-010', 'CoolChain Logistics', 'approved',
    [
      buildItem('poi-014', 'prod-004', 30, 0.8, 5),
    ],
    '2025-04-05T10:00:00Z', '2025-03-25T09:00:00Z', '2025-03-25T09:00:00Z', '2025-03-26T10:00:00Z',
  ),
];

/**
 * Get a single mock purchase order by ID.
 */
export function getMockPurchaseById(id: string): PurchaseOrderEntity | undefined {
  return MOCK_PURCHASES.find((p) => p.id === id);
}

/**
 * Get all mock supplier IDs referenced by purchase orders.
 */
export function getMockPurchaseSupplierIds(): string[] {
  return Array.from(new Set(MOCK_PURCHASES.map((p) => p.supplier.id))).sort();
}
