import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface DashboardKpis {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  openSupportTickets: number;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const res = await fetchWithAuth('/reports/dashboard', { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function getSalesReport(params?: { startDate?: string; endDate?: string; status?: string }): Promise<any> {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetchWithAuth(`/reports/sales?${query}`, { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function getProductAnalytics(): Promise<any> {
  const res = await fetchWithAuth('/reports/products', { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function getInventoryAnalytics(): Promise<any> {
  const res = await fetchWithAuth('/reports/inventory', { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function getCustomerAnalytics(): Promise<any> {
  const res = await fetchWithAuth('/reports/customers', { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function getPaymentAnalytics(): Promise<any> {
  const res = await fetchWithAuth('/reports/payments', { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}
