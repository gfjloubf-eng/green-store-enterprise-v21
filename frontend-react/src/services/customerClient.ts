import { fetchWithAuth, parseJsonSafe } from './authClient';
import { getOrders, type Order } from './orderClient';

export interface Customer {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  createdAt?: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string | null;
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const res = await fetchWithAuth('/users?role=CUSTOMER', { method: 'GET' });
    const payload = await parseJsonSafe(res);
    if (res.ok && Array.isArray(payload?.data)) {
      return payload.data.map((u: any) => ({
        id: u.id,
        fullName: u.fullName || u.displayName || 'عميل المتجر',
        email: u.email,
        phone: u.phone,
        createdAt: u.createdAt,
        totalOrders: u._count?.orders ?? 0,
        totalSpent: u.totalSpent ?? 0,
        lastOrderAt: u.lastOrderAt,
      }));
    }
  } catch (e) {
    console.warn('Backend customer API unavailable, extracting from orders store:', e);
  }

  // Fallback: derive customer profiles from existing orders
  const allOrdersRes = await getOrders({ limit: 100 });
  const orders = allOrdersRes.items || [];
  const customerMap = new Map<string, Customer>();

  for (const ord of orders) {
    const custId = ord.customerId || ord.customer?.id || 'cust-default';
    const custName = ord.customer?.fullName || 'عميل المتجر';
    const custEmail = ord.customer?.email || null;
    const custPhone = ord.customer?.phone || null;

    const existing = customerMap.get(custId);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += ord.total;
      if (!existing.lastOrderAt || new Date(ord.createdAt) > new Date(existing.lastOrderAt)) {
        existing.lastOrderAt = ord.createdAt;
      }
    } else {
      customerMap.set(custId, {
        id: custId,
        fullName: custName,
        email: custEmail,
        phone: custPhone,
        createdAt: ord.createdAt,
        totalOrders: 1,
        totalSpent: ord.total,
        lastOrderAt: ord.createdAt,
      });
    }
  }

  return Array.from(customerMap.values());
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const customers = await getCustomers();
  return customers.find((c) => c.id === id) || null;
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  const allOrdersRes = await getOrders({ limit: 100 });
  const orders = allOrdersRes.items || [];
  return orders.filter(
    (ord) => ord.customerId === customerId || ord.customer?.id === customerId,
  );
}
