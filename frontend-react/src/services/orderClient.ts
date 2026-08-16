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
  isLocal?: boolean;
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

const LOCAL_STORAGE_ORDERS_KEY = 'green_store_local_orders';

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local orders:', e);
  }
  return [];
}

function saveLocalOrders(orders: Order[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving local orders:', e);
  }
}

export async function createOrder(data?: { shippingAddressId?: string; notes?: string }): Promise<Order> {
  try {
    const res = await fetchWithAuth('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data || {}),
    });

    const payload = await parseJsonSafe(res);
    if (res.ok && payload?.data) {
      return payload.data;
    }
  } catch {
    // fallback below
  }

  // Fallback: create order locally from current cart
  const { getCart, clearCart } = await import('./cartClient');
  const cart = await getCart();
  const orderId = `ord-${Date.now()}`;
  const code = `GS-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderItems: OrderItem[] = (cart?.items || []).map((item) => ({
    id: `item-${Math.random()}`,
    orderId,
    productId: item.productId,
    name: item.product?.name || `منتج ${item.productId}`,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    taxAmount: 0,
    total: item.totalPrice,
    product: item.product ? { id: item.product.id, name: item.product.name, image: item.product.image } : null,
  }));

  const newOrder: Order = {
    id: orderId,
    code,
    status: 'PENDING',
    subtotal: cart?.subtotal || 0,
    shipping: 0,
    tax: cart?.taxTotal || 0,
    total: cart?.grandTotal || 0,
    currency: 'SAR',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: orderItems,
    isLocal: true,
    customer: {
      id: 'cust-1',
      fullName: 'عميل المتجر',
      phone: '+966500000000',
    },
  };

  const existing = getLocalOrders();
  existing.unshift(newOrder);
  saveLocalOrders(existing);

  // Deduct inventory stock for each purchased item & log movement
  try {
    const { InventoryService } = await import('@/features/inventory/services/inventoryService');
    for (const item of newOrder.items) {
      InventoryService.adjustStock(item.productId, -item.quantity, `خصم مخزون تلقائي للطلب ${newOrder.code}`);
    }
  } catch (e) {
    console.error('Inventory stock deduction failed:', e);
  }

  await clearCart();
  return newOrder;
}

export async function getOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  customerId?: string;
}): Promise<PaginatedOrders> {
  try {
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
    if (res.ok && payload?.data) {
      return payload.data;
    }
  } catch {
    // fallback below
  }

  let local = getLocalOrders();
  if (params?.status && params.status !== 'ALL') {
    local = local.filter((o) => o.status === params.status);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    local = local.filter((o) => o.code.toLowerCase().includes(s) || (o.customer?.fullName ?? '').toLowerCase().includes(s));
  }

  const limit = params?.limit ?? 10;
  const page = params?.page ?? 1;
  const total = local.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paged = local.slice((page - 1) * limit, page * limit);

  return {
    items: paged,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function getOrderById(id: string): Promise<Order> {
  try {
    const res = await fetchWithAuth(`/orders/${id}`, {
      method: 'GET',
    });

    const payload = await parseJsonSafe(res);
    if (res.ok && payload?.data) {
      return payload.data;
    }
  } catch {
    // fallback below
  }

  const local = getLocalOrders();
  const found = local.find((o) => o.id === id || o.code === id);
  if (found) return found;

  // Default empty fallback order if not found
  return {
    id,
    code: `GS-${id.slice(0, 6)}`,
    status: 'CONFIRMED',
    subtotal: 100,
    shipping: 0,
    tax: 15,
    total: 115,
    currency: 'SAR',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [],
    customer: {
      id: 'cust-1',
      fullName: 'عميل المتجر',
    },
  };
}

export async function updateOrderStatus(id: string, status: string): Promise<Order> {
  try {
    const res = await fetchWithAuth(`/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const payload = await parseJsonSafe(res);
    if (res.ok && payload?.data) {
      return payload.data;
    }
  } catch {
    // fallback below
  }

  const local = getLocalOrders();
  const index = local.findIndex((o) => o.id === id);
  if (index >= 0) {
    local[index].status = status as any;
    local[index].updatedAt = new Date().toISOString();
    saveLocalOrders(local);
    return local[index];
  }

  return getOrderById(id);
}

export async function cancelOrder(id: string): Promise<Order> {
  return updateOrderStatus(id, 'CANCELED');
}
