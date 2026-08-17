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

export async function createOrder(data?: { shippingAddressId?: string; notes?: string; idempotencyKey?: string }): Promise<Order> {
  const key = data?.idempotencyKey || `idem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  try {
    const res = await fetchWithAuth('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': key,
      },
      body: JSON.stringify({ ...(data || {}), idempotencyKey: key }),
    });

    const payload = await parseJsonSafe(res);
    if (res.ok && payload) {
      const orderData = payload.data || payload;
      if (orderData && (orderData.id || orderData.code)) {
        const mapped = mapBackendOrderToOrder(orderData);
        const { clearCart } = await import('./cartClient');
        await clearCart();
        return mapped;
      }
    } else if (res.status >= 400 && res.status < 500) {
      const message = payload?.error?.message || 'تعذر إتمام الطلب من السيرفر. يرجى مراجعة عناصر السلة.';
      throw new Error(message);
    }
  } catch (err: any) {
    if (err?.message && !err.message.includes('fetch') && !err.message.includes('Network')) {
      throw err;
    }
    // Fallback below for offline/local environment
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

function mapBackendOrderToOrder(item: any): Order {
  return {
    id: String(item.id || item.orderId || ''),
    tenantId: item.tenantId || null,
    storeId: item.storeId || null,
    branchId: item.branchId || null,
    customerId: item.customerId || null,
    code: String(item.code || item.orderCode || `GS-${String(item.id || '').slice(0, 6)}`),
    status: item.status || 'PENDING',
    subtotal: Number(item.subtotal || 0),
    shipping: Number(item.shipping || 0),
    tax: Number(item.tax || 0),
    total: Number(item.total || 0),
    currency: String(item.currency || 'SAR'),
    placedAt: item.placedAt || item.createdAt || null,
    createdAt: String(item.createdAt || new Date().toISOString()),
    updatedAt: String(item.updatedAt || new Date().toISOString()),
    isLocal: Boolean(item.isLocal),
    items: Array.isArray(item.items) ? item.items.map((i: any) => ({
      id: String(i.id || Math.random()),
      orderId: String(i.orderId || item.id || ''),
      productId: String(i.productId || ''),
      variantId: i.variantId || null,
      sku: i.sku || null,
      name: String(i.name || i.productName || 'منتج'),
      quantity: Number(i.quantity || 1),
      unitPrice: Number(i.unitPrice || i.price || 0),
      taxAmount: Number(i.taxAmount || 0),
      total: Number(i.total || (i.quantity * i.unitPrice) || 0),
      product: i.product ? {
        id: String(i.product.id),
        name: String(i.product.name),
        image: i.product.image || i.product.imageUrl || null,
        sku: i.product.sku || null,
      } : null,
    })) : [],
    customer: item.customer ? {
      id: String(item.customer.id),
      fullName: String(item.customer.fullName || item.customer.name || 'عميل'),
      email: item.customer.email || null,
      phone: item.customer.phone || null,
    } : null,
  };
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
    if (res.ok && payload) {
      const rawItems = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : (payload?.items || null));
      if (rawItems) {
        const mappedItems = rawItems.map(mapBackendOrderToOrder);
        const total = Number(payload.total || mappedItems.length);
        const limit = params?.limit ?? 10;
        const page = params?.page ?? 1;
        const totalPages = payload.totalPages ? Number(payload.totalPages) : (Math.ceil(total / limit) || 1);
        return {
          items: mappedItems,
          total,
          page,
          limit,
          totalPages,
        };
      }
    }
  } catch {
    // fallback below
  }

  let local = getLocalOrders();
  if (params?.customerId) {
    local = local.filter((o) => o.customerId === params.customerId || o.customer?.id === params.customerId);
  }
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
    if (res.ok && payload) {
      const raw = payload?.data || payload;
      if (raw && (raw.id || raw.code)) {
        return mapBackendOrderToOrder(raw);
      }
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
