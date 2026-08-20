import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface InventoryItem {
  id: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  product?: {
    id: string;
    name: string;
    sku?: string | null;
  } | null;
  warehouse?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  inventoryId: string;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RESERVATION' | 'RELEASE';
  quantity: number;
  referenceId?: string | null;
  createdAt: string;
  inventory?: {
    product?: {
      id: string;
      name: string;
    } | null;
    warehouse?: {
      id: string;
      name: string;
    } | null;
  } | null;
  performedBy?: {
    id: string;
    displayName?: string | null;
    email: string;
  } | null;
}

export interface PaginatedInventory {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getInventory(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<PaginatedInventory> {
  const q = new URLSearchParams();
  if (params?.page) q.append('page', String(params.page));
  if (params?.limit) q.append('limit', String(params.limit));
  if (params?.status && params.status !== 'ALL') q.append('status', params.status);
  if (params?.search) q.append('search', params.search);

  const queryStr = q.toString() ? `?${q.toString()}` : '';
  const res = await fetchWithAuth(`/inventory${queryStr}`, { method: 'GET' });

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  const data = payload?.data;
  const pagination = data?.pagination ?? {};
  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
      ? data
      : [];

  return {
    items,
    total: Number(pagination.total ?? data?.total ?? items.length),
    page: Number(pagination.page ?? data?.page ?? params?.page ?? 1),
    limit: Number(pagination.limit ?? data?.limit ?? params?.limit ?? (items.length || 1)),
    totalPages: Number(pagination.totalPages ?? data?.totalPages ?? 1),
  };
}

export async function adjustStock(data: {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason?: string;
}): Promise<InventoryItem> {
  const res = await fetchWithAuth('/inventory/adjust', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export interface PaginatedStockMovements {
  movements: StockMovement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getStockMovements(inventoryId?: string): Promise<PaginatedStockMovements> {
  const q = inventoryId ? `?inventoryId=${encodeURIComponent(inventoryId)}` : '';
  const res = await fetchWithAuth(`/inventory/movements${q}`, { method: 'GET' });

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }

  const data = payload?.data ?? {};
  const pagination = data?.pagination ?? {};
  const movements = Array.isArray(data?.movements)
    ? data.movements
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
        ? data
        : [];

  return {
    movements,
    total: Number(pagination.total ?? data?.total ?? movements.length),
    page: Number(pagination.page ?? data?.page ?? 1),
    limit: Number(pagination.limit ?? data?.limit ?? (movements.length || 1)),
    totalPages: Number(pagination.totalPages ?? data?.totalPages ?? 1),
  };
}
