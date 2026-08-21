/* ============================================================
   GSDS v1.1 — ProductService (Service Layer)
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3 — In-memory mock service
   ============================================================
   Framework-agnostic service layer.
   No React, no HTTP, no fetch, no axios.
   All data is in-memory mock data only.
   
   Methods:
   - getAll()      — Get all products
   - getById()     — Get a single product by ID
   - create()      — Create a new product
   - update()      — Update an existing product
   - delete()      — Delete a product
   - search()      — Search products by query
   - filter()      — Filter products by criteria
   - sort()        — Sort products by column
   - paginate()    — Paginate a product list
   ============================================================ */

import type { ProductStatus } from '../types/product';
import type { ProductEntity } from '../domain/productEntity';
import { createProductEntity, updateProductEntity } from '../domain/productEntity';
import type { ProductDTO } from '../domain/productDTO';
import { toDTO, toDTOList } from '../domain/productDTO';
import type { ProductFilterModel } from '../domain/productFilterModel';
import { applyFilters, applySort, applyPagination } from '../domain/productFilterModel';
import { toTableModelList, type ProductTableModel } from '../domain/productTableModel';
import { MOCK_PRODUCTS } from '../mock/products';

import { isAuthorizedStaffOrAdmin, getApiBase, parseJsonSafe } from '@/services/authClient';

/* ─── Backend DTO Mapper (Read-Only) ────────────────────────── */

function mapBackendProductToEntity(item: any): ProductEntity {
  const priceVal = Number(item.sellingPrice ?? item.price ?? 0);
  return {
    id: String(item.id || item.productId || ''),
    name: String(item.name || item.nameAr || 'منتج'),
    nameAr: item.nameAr ? String(item.nameAr) : (item.name ? String(item.name) : 'منتج'),
    sku: String(item.sku || ''),
    barcode: String(item.barcode || item.sku || ''),
    category: typeof item.category === 'object' && item.category !== null ? item.category : { id: 'cat-1', name: String(item.category || 'عام'), slug: 'general', icon: 'ShoppingBag' },
    brand: typeof item.brand === 'object' && item.brand !== null ? item.brand : { id: 'brand-1', name: 'قطوف الطبيعة', logo: '' },
    unit: typeof item.unit === 'object' && item.unit !== null ? item.unit : { id: 'unit-1', name: String(item.unit || 'كيلو'), symbol: 'كجم' },
    description: String(item.description || ''),
    purchasePrice: Number(item.purchasePrice ?? priceVal),
    sellingPrice: priceVal,
    compareAtPrice: item.compareAtPrice ? Number(item.compareAtPrice) : undefined,
    offer: item.offer ? item.offer : undefined,
    tax: 0,
    discount: Number(item.discount || item.offer?.discountValue || 0),
    stock: Number(item.stock ?? item.quantity ?? 0),
    minStock: Number(item.minStock || 0),
    maxStock: Number(item.maxStock || 0),
    trackInventory: true,
    image: String(item.image || item.imageUrl || item.url || ''),
    status: (item.status === 'inactive' || item.status === 'out_of_stock' || item.status === 'active') ? item.status : 'active',
    produceKey: String(item.produceKey || item.slug || ''),
    createdAt: String(item.createdAt || new Date().toISOString()),
    updatedAt: String(item.updatedAt || new Date().toISOString()),
  };
}

/* ─── Mock Data Store ──────────────────────────────────────── */

/**
 * In-memory product store.
 * Initialized from the existing mock data.
 * All mutations (create, update, delete) operate on this store.
 */
class ProductStore {
  private entities: Map<string, ProductEntity>;

  constructor() {
    this.entities = new Map();
    this.initializeFromMockData();
  }

  /**
   * Initialize the store from the existing MOCK_PRODUCTS array.
   * Maps ProductSummary → ProductEntity for backward compatibility.
   */
  private initializeFromMockData(): void {
    for (const mock of MOCK_PRODUCTS) {
      this.entities.set(mock.id, {
        id: mock.id,
        name: mock.name,
        nameAr: mock.nameAr,
        sku: mock.sku,
        barcode: mock.barcode,
        category: { ...mock.category },
        brand: { ...mock.brand },
        unit: { ...mock.unit },
        description: '',
        purchasePrice: mock.purchasePrice,
        sellingPrice: mock.sellingPrice,
        compareAtPrice: mock.compareAtPrice,
        offer: mock.offer ? { ...mock.offer } : undefined,
        tax: 0,
        discount: mock.offer?.discountValue || 0,
        stock: mock.stock,
        minStock: 0,
        maxStock: 0,
        trackInventory: true,
        image: mock.image,
        status: mock.status,
        produceKey: mock.produceKey,
        createdAt: mock.createdAt,
        updatedAt: mock.updatedAt,
      });
    }
  }

  /** Get all entities */
  getAll(): ProductEntity[] {
    return Array.from(this.entities.values());
  }

  /** Get one entity by ID */
  getById(id: string): ProductEntity | undefined {
    return this.entities.get(id);
  }

  /** Add a new entity */
  add(entity: ProductEntity): void {
    this.entities.set(entity.id, entity);
  }

  /** Update an existing entity */
  update(id: string, updated: ProductEntity): boolean {
    if (!this.entities.has(id)) return false;
    this.entities.set(id, updated);
    return true;
  }

  /** Delete an entity by ID */
  delete(id: string): boolean {
    return this.entities.delete(id);
  }
}

/* ─── Singleton Store Instance ─────────────────────────────── */

const store = new ProductStore();

/* ─── ProductService ───────────────────────────────────────── */

export const ProductService = {
  /**
   * Get all products as DTOs.
   * Returns current store state with safe background backend sync attempt.
   */
  getAll(): ProductDTO[] {
    this.syncAllFromBackend().catch(() => {});
    return toDTOList(store.getAll());
  },

  /**
   * Get a single product by ID.
   * Returns undefined if not found.
   */
  getById(id: string): ProductDTO | undefined {
    const entity = store.getById(id);
    return entity ? toDTO(entity) : undefined;
  },

  /**
   * Async fetch all products from Backend API with local fallback.
   */
  async syncAllFromBackend(): Promise<ProductDTO[]> {
    try {
      const res = await fetch(`${getApiBase()}/products`);
      if (res.ok) {
        const payload = await parseJsonSafe(res);
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : null);
        if (list && list.length > 0) {
          for (const item of list) {
            const entity = mapBackendProductToEntity(item);
            if (entity.id && entity.name) {
              store.add(entity);
            }
          }
        }
      }
    } catch {
      // Safe fallback: Local store remains active
    }
    return toDTOList(store.getAll());
  },

  /**
   * Async fetch single product by ID from Backend API with local fallback.
   */
  async syncByIdFromBackend(id: string): Promise<ProductDTO | undefined> {
    try {
      const res = await fetch(`${getApiBase()}/products/${id}`);
      if (res.ok) {
        const payload = await parseJsonSafe(res);
        const item = payload?.data || payload;
        if (item && item.id && item.name) {
          const entity = mapBackendProductToEntity(item);
          store.add(entity);
        }
      }
    } catch {
      // Safe fallback: Local store remains active
    }
    return this.getById(id);
  },

  /**
   * Create a product through the authenticated backend API.
   * The local method below remains for compatibility with older screens.
   */
  async createRemote(data: {
    name: string;
    produceKey: string;
    sku: string;
    description?: string;
    imageUrl?: string;
    imageAltText?: string;
    categoryId?: string;
    brandId?: string;
    unitId?: string;
    isPublished?: boolean;
  }): Promise<ProductDTO> {
    if (!isAuthorizedStaffOrAdmin()) throw new Error('غير مصرح: هذه العملية تتطلب صلاحيات إدارة المتجر');
    const { fetchWithAuth } = await import('@/services/authClient');
    const res = await fetchWithAuth('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name.trim(),
        slug: data.produceKey.trim(),
        produceKey: data.produceKey.trim(),
        sku: data.sku.trim(),
        description: data.description?.trim() || undefined,
        imageUrl: data.imageUrl || undefined,
        imageAltText: data.imageAltText?.trim() || data.name.trim(),
        categoryId: data.categoryId || undefined,
        brandId: data.brandId || undefined,
        unitId: data.unitId || undefined,
        isPublished: data.isPublished ?? true,
      }),
    });
    const payload = await parseJsonSafe(res);
    if (!res.ok) throw new Error(payload?.error?.message || payload?.error || `HTTP ${res.status}`);
    return toDTO(mapBackendProductToEntity(payload?.data || payload));
  },

  /** Update a product through the authenticated backend API. */
  async updateRemote(id: string, data: {
    name?: string;
    produceKey?: string;
    sku?: string;
    description?: string;
    imageUrl?: string;
    imageAltText?: string;
    categoryId?: string;
    brandId?: string;
    unitId?: string;
    isPublished?: boolean;
  }): Promise<ProductDTO> {
    if (!isAuthorizedStaffOrAdmin()) throw new Error('غير مصرح: هذه العملية تتطلب صلاحيات إدارة المتجر');
    const { fetchWithAuth } = await import('@/services/authClient');
    const body: Record<string, unknown> = { ...data };
    if (typeof body.produceKey === 'string') {
      body.slug = body.produceKey.trim();
      body.produceKey = body.produceKey.trim();
    }
    const res = await fetchWithAuth(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = await parseJsonSafe(res);
    if (!res.ok) throw new Error(payload?.error?.message || payload?.error || `HTTP ${res.status}`);
    return toDTO(mapBackendProductToEntity(payload?.data || payload));
  },

  /**
   * Create a new product.
   * Accepts the raw entity data (without id/timestamps).
   * Returns the created DTO.
   */
  create(
    data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): ProductDTO {
    if (!isAuthorizedStaffOrAdmin()) {
      throw new Error('غير مصرح: هذه العملية تتطلب صلاحيات إدارة المتجر');
    }
    const entity = createProductEntity(data);
    store.add(entity);
    return toDTO(entity);
  },

  /**
   * Update an existing product.
   * Accepts partial updates.
   * Returns the updated DTO, or undefined if not found.
   */
  update(
    id: string,
    updates: Partial<Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>>,
  ): ProductDTO | undefined {
    if (!isAuthorizedStaffOrAdmin()) {
      throw new Error('غير مصرح: هذه العملية تتطلب صلاحيات إدارة المتجر');
    }
    const existing = store.getById(id);
    if (!existing) return undefined;
    const updated = updateProductEntity(existing, updates);
    store.update(id, updated);
    return toDTO(updated);
  },

  /**
   * Delete a product by ID.
   * Returns true if deleted, false if not found.
   */
  delete(id: string): boolean {
    if (!isAuthorizedStaffOrAdmin()) {
      throw new Error('غير مصرح: هذه العملية تتطلب صلاحيات إدارة المتجر');
    }
    return store.delete(id);
  },

  /**
   * Search products by text query.
   * Searches name, barcode, and SKU.
   */
  search(query: string): ProductDTO[] {
    if (!query.trim()) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    );
  },

  /**
   * Filter products by criteria.
   * Returns filtered list of DTOs.
   */
  filter(criteria: ProductFilterModel): ProductDTO[] {
    return applyFilters(this.getAll(), criteria);
  },

  /**
   * Sort products by column and direction.
   * Returns sorted list of DTOs.
   */
  sort(
    products: ProductDTO[],
    sortBy: ProductFilterModel['sortBy'],
    sortDirection: ProductFilterModel['sortDirection'],
  ): ProductDTO[] {
    return applySort(products, sortBy, sortDirection);
  },

  /**
   * Paginate a list of items.
   * Works with any array type.
   */
  paginate<T>(
    items: T[],
    page: number,
    size: number,
  ): { data: T[]; total: number; page: number; totalPages: number } {
    return applyPagination(items, page, size);
  },

  /**
   * Get products as table models (for the ProductTable component).
   * Convenience method that combines filter + sort + paginate.
   */
  getTableData(
    filters: ProductFilterModel,
  ): {
    products: ProductTableModel[];
    total: number;
    page: number;
    totalPages: number;
  } {
    const filtered = this.filter(filters);
    const sorted = this.sort(filtered, filters.sortBy, filters.sortDirection);
    const paginated = this.paginate(sorted, 1, filters.rowsPerPage);
    return {
      products: toTableModelList(paginated.data),
      total: paginated.total,
      page: paginated.page,
      totalPages: paginated.totalPages,
    };
  },

  /**
   * Fetch products from real backend API: GET /products
   * Uses fetchWithAuth for automatic token attachment and 401/403 handling.
   */
  async getApiTableData(filters: ProductFilterModel): Promise<{
    products: ProductTableModel[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { fetchWithAuth } = await import('@/services/authClient');
    const params = new URLSearchParams();
    if (filters.rowsPerPage) params.set('limit', String(filters.rowsPerPage));
    if (filters.search) params.set('search', filters.search);

    const queryStr = params.toString();
    const url = `/products${queryStr ? `?${queryStr}` : ''}`;
    const res = await fetchWithAuth(url, { method: 'GET' });
    if (!res.ok) {
      const errPayload = await res.json().catch(() => null);
      const err: any = new Error(errPayload?.error?.message ?? `HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }

    const payload = await res.json();
    const rawItems: any[] = Array.isArray(payload?.data) ? payload.data : [];
    const totalCount = payload?.meta?.total ?? rawItems.length;

    const mapped: ProductTableModel[] = rawItems.map((item) => ({
      id: String(item.id),
      name: item.name ?? '',
      sku: item.sku ?? '',
      barcode: item.barcode ?? item.sku ?? '',
      category: { id: item.categoryId ?? 'c1', name: 'General' },
      brand: { id: item.brandId ?? 'b1', name: 'Generic' },
      unit: { id: item.unitId ?? 'u1', name: 'Piece', abbreviation: 'pc' },
      purchasePrice: item.purchasePrice ?? 0,
      sellingPrice: item.sellingPrice ?? 0,
      stock: item.stock ?? 0,
      status: (item.isPublished ? 'active' : 'draft') as ProductStatus,
      createdAt: item.createdAt ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? new Date().toISOString(),
    }));

    if (mapped.length > 0) {
      return {
        products: mapped,
        total: totalCount,
        page: payload?.meta?.page ?? 1,
        totalPages: payload?.meta?.totalPages ?? 1,
      };
    }

    return this.getTableData(filters);
  },
};

