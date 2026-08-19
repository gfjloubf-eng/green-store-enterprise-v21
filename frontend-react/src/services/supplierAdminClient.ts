import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface AdminSupplier {
  id: string;
  name: string;
  code?: string | null;
  contactsCount: number;
  addressesCount: number;
  purchaseOrdersCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminSupplierInput {
  name: string;
  code?: string | null;
}

interface ApiErrorPayload {
  error?: { message?: string; code?: string };
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

function toError(payload: ApiErrorPayload | null, response: Response): ApiError {
  const error = new Error(payload?.error?.message || `${response.statusText || 'فشل الطلب'} (${response.status})`) as ApiError;
  error.status = response.status;
  error.code = payload?.error?.code;
  return error;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithAuth(path, init);
  const payload = await parseJsonSafe(response);
  if (!response.ok) throw toError(payload, response);
  return (payload?.data ?? payload) as T;
}

export async function getAdminSuppliers(options: { search?: string; page?: number; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (options.search?.trim()) params.set('search', options.search.trim());
  params.set('page', String(options.page ?? 1));
  params.set('limit', String(options.limit ?? 100));
  const result = await request<{ items?: AdminSupplier[]; data?: AdminSupplier[]; total?: number; page?: number; limit?: number }>(`/admin/suppliers?${params.toString()}`);
  const items = Array.isArray(result.items) ? result.items : Array.isArray(result.data) ? result.data : [];
  return { items, total: result.total ?? items.length, page: result.page ?? options.page ?? 1, limit: result.limit ?? options.limit ?? 100 };
}

export function createAdminSupplier(input: AdminSupplierInput) { return request<AdminSupplier>('/admin/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }); }
export function updateAdminSupplier(id: string, input: Partial<AdminSupplierInput>) { return request<AdminSupplier>(`/admin/suppliers/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }); }
export async function deleteAdminSupplier(id: string) { await request<unknown>(`/admin/suppliers/${encodeURIComponent(id)}`, { method: 'DELETE' }); }
