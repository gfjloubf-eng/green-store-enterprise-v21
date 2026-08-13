import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  sku?: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  total: number;
  product?: {
    id: string;
    name: string;
    image?: string | null;
    sku?: string | null;
  } | null;
}

export interface Order {
  id: string;
  tenantId?: string | null;
  storeId?: string | null;
  branchId?: string | null;
  customerId?: string | null;
  code: string;
  status: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED' | 'RETURNED' | 'REFUNDED';
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  placedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: {
    id: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
  } | null;
}

export interface PaginatedOrders {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function createOrder(data?: { shippingAddressId?: string; notes?: string }): Promise<Order> {
  const res = await fetchWithAuth('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data || {}),
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

export async function getOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  customerId?: string;
}): Promise<PaginatedOrders> {
  const q = new URLSearchParams();
  if (params?.page) q.append('page', String(params.page));
  if (params?.limit) q.append('limit', String(params.limit));
  if (params?.status && params.status !== 'ALL') q.append('status', params.status);
  if (params?.search) q.append('search', params.search);
  if (params?.customerId) q.append('customerId', params.customerId);

  const queryStr = q.toString() ? `?${q.toString()}` : '';
  const res = await fetchWithAuth(`/orders${queryStr}`, {
    method: 'GET',
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

export async function getOrderById(id: string): Promise<Order> {
  const res = await fetchWithAuth(`/orders/${id}`, {
    method: 'GET',
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

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  const res = await fetchWithAuth(`/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
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

export async function cancelOrder(id: string): Promise<Order> {
  const res = await fetchWithAuth(`/orders/${id}/cancel`, {
    method: 'POST',
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
