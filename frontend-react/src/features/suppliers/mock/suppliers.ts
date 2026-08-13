/* ============================================================
   GSDS v1.1 — Supplier Mock Data
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — In-memory data for UI development
   ============================================================
   Suppliers are standalone domain records. They reference
   products via productCount aggregates only (no product
   duplication). Purchase/order links will be added in the
   Purchasing milestone.
   ============================================================ */

import type { SupplierEntity } from '../domain/supplierEntity';
import type { SupplierCategory } from '../types/supplier';

/**
 * Mock supplier categories.
 */
export const MOCK_SUPPLIER_CATEGORIES: SupplierCategory[] = [
  {
    id: 'scat-1',
    name: 'Fresh Produce',
    description: 'Vegetables, fruits and fresh herbs suppliers',
    supplierCount: 3,
    totalPurchases: 184500,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-03-20T10:00:00Z',
  },
  {
    id: 'scat-2',
    name: 'Dairy & Chilled',
    description: 'Milk, yogurt and chilled goods suppliers',
    supplierCount: 2,
    totalPurchases: 96500,
    createdAt: '2025-01-12T09:00:00Z',
    updatedAt: '2025-03-18T11:00:00Z',
  },
  {
    id: 'scat-3',
    name: 'Beverages',
    description: 'Juices, teas and bottled drinks suppliers',
    supplierCount: 2,
    totalPurchases: 74000,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-03-22T09:00:00Z',
  },
  {
    id: 'scat-4',
    name: 'Packaging',
    description: 'Boxes, bags and packaging materials suppliers',
    supplierCount: 2,
    totalPurchases: 41200,
    createdAt: '2025-01-18T08:30:00Z',
    updatedAt: '2025-03-15T14:00:00Z',
  },
  {
    id: 'scat-5',
    name: 'Logistics',
    description: 'Transportation and cold-chain logistics partners',
    supplierCount: 1,
    totalPurchases: 28000,
    createdAt: '2025-01-20T12:00:00Z',
    updatedAt: '2025-03-10T16:00:00Z',
  },
];

/**
 * Build a mock supplier entity.
 */
function buildSupplier(
  id: string,
  code: string,
  name: string,
  categoryId: string,
  contactName: string,
  contactRole: string,
  email: string,
  phone: string,
  city: string,
  country: string,
  status: SupplierEntity['status'],
  productCount: number,
  totalPurchases: number,
  rating: number,
  paymentTerms: string,
  currency: string,
  lastOrderAt: string | undefined,
  createdAt: string,
  updatedAt: string,
): SupplierEntity {
  const category =
    MOCK_SUPPLIER_CATEGORIES.find((c) => c.id === categoryId) ??
    MOCK_SUPPLIER_CATEGORIES[0];
  return {
    id,
    code,
    name,
    category: { id: category.id, name: category.name },
    contact: {
      name: contactName,
      role: contactRole,
      email,
      phone,
    },
    email,
    phone,
    address: `${Math.floor(Math.random() * 200) + 1} ${city} St.`,
    city,
    country,
    taxId: `VAT-${Math.floor(100000 + Math.random() * 899999)}`,
    paymentTerms,
    currency,
    creditLimit: totalPurchases * 0.25,
    rating,
    status,
    notes: '',
    productCount,
    totalPurchases,
    lastOrderAt,
    createdAt,
    updatedAt,
  };
}

/**
 * Mock suppliers (10 suppliers across categories).
 */
export const MOCK_SUPPLIERS: SupplierEntity[] = [
  buildSupplier('sup-001', 'SUP-001', 'Green Farm Produce Co.', 'scat-1', 'Ahmed Hassan', 'Sales Manager', 'ahmed@greenfarm.example', '+971 50 111 2233', 'Dubai', 'UAE', 'active', 12, 48200, 5, 'Net 30', 'AED', '2025-03-20T10:30:00Z', '2025-01-10T08:00:00Z', '2025-03-22T09:00:00Z'),
  buildSupplier('sup-002', 'SUP-002', 'Nature\'s Best Farms', 'scat-1', 'Layla Mahmoud', 'Key Account Manager', 'layla@naturesbest.example', '+971 55 222 3344', 'Abu Dhabi', 'UAE', 'active', 8, 65300, 4, 'Net 45', 'AED', '2025-03-18T14:00:00Z', '2025-01-12T09:00:00Z', '2025-03-20T11:00:00Z'),
  buildSupplier('sup-003', 'SUP-003', 'Organic Valley Supplies', 'scat-1', 'Omar Farouk', 'Owner', 'omar@organicvalley.example', '+971 56 333 4455', 'Sharjah', 'UAE', 'active', 6, 71000, 5, 'Net 30', 'AED', '2025-03-15T11:00:00Z', '2025-01-15T10:00:00Z', '2025-03-21T08:00:00Z'),
  buildSupplier('sup-004', 'SUP-004', 'Fresh Harvest Dairy', 'scat-2', 'Mariam Khalil', 'Operations Lead', 'mariam@freshharvest.example', '+971 50 444 5566', 'Dubai', 'UAE', 'active', 5, 54200, 4, 'Net 15', 'AED', '2025-03-18T14:00:00Z', '2025-01-20T08:30:00Z', '2025-03-19T10:00:00Z'),
  buildSupplier('sup-005', 'SUP-005', 'Chilled Distribution LLC', 'scat-2', 'Yousef Nasser', 'Fleet Manager', 'yousef@chilleddist.example', '+971 52 555 6677', 'Ajman', 'UAE', 'inactive', 3, 42300, 3, 'Net 60', 'AED', '2025-02-10T09:00:00Z', '2025-01-25T11:00:00Z', '2025-03-05T10:00:00Z'),
  buildSupplier('sup-006', 'SUP-006', 'EcoGrow Beverages', 'scat-3', 'Sara Adel', 'Brand Manager', 'sara@ecogrow.example', '+971 54 666 7788', 'Dubai', 'UAE', 'active', 4, 38500, 4, 'Net 30', 'AED', '2025-03-24T11:00:00Z', '2025-02-01T09:00:00Z', '2025-03-24T11:00:00Z'),
  buildSupplier('sup-007', 'SUP-007', 'Premium Tea Imports', 'scat-3', 'Khaled Mansour', 'Import Specialist', 'khaled@premiumtea.example', '+971 55 777 8899', 'Dubai', 'UAE', 'pending', 2, 35500, 0, 'Net 30', 'AED', undefined, '2025-02-05T10:00:00Z', '2025-03-10T12:00:00Z'),
  buildSupplier('sup-008', 'SUP-008', 'GreenPack Packaging', 'scat-4', 'Huda Salem', 'Account Executive', 'huda@greenpack.example', '+971 50 888 9900', 'Ras Al Khaimah', 'UAE', 'active', 7, 25600, 4, 'Net 45', 'AED', '2025-03-12T09:00:00Z', '2025-02-10T08:00:00Z', '2025-03-16T09:00:00Z'),
  buildSupplier('sup-009', 'SUP-009', 'EcoBox Solutions', 'scat-4', 'Tariq Aziz', 'Sales Director', 'tariq@ecobox.example', '+971 52 999 0011', 'Sharjah', 'UAE', 'suspended', 2, 15600, 2, 'Net 30', 'AED', '2025-01-20T08:00:00Z', '2025-02-12T11:00:00Z', '2025-03-02T10:00:00Z'),
  buildSupplier('sup-010', 'SUP-010', 'CoolChain Logistics', 'scat-5', 'Nadia Omar', 'Logistics Coordinator', 'nadia@coolchain.example', '+971 56 111 2233', 'Dubai', 'UAE', 'active', 1, 28000, 5, 'Net 60', 'AED', '2025-03-20T10:30:00Z', '2025-02-15T09:00:00Z', '2025-03-20T10:30:00Z'),
];

/**
 * Get a single mock supplier by ID.
 */
export function getMockSupplierById(id: string): SupplierEntity | undefined {
  return MOCK_SUPPLIERS.find((s) => s.id === id);
}

/**
 * Get all mock supplier cities (for the city filter).
 */
export function getMockSupplierCities(): string[] {
  return Array.from(new Set(MOCK_SUPPLIERS.map((s) => s.city))).sort();
}

