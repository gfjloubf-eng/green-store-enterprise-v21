import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface DeliveryDriver {
  id: string;
  name: string;
  phone?: string | null;
  vehicleInfo?: string | null;
  deliveriesCount: number;
  createdAt?: string | null;
}

export interface DeliveryDriverInput {
  name: string;
  phone?: string | null;
  vehicleInfo?: string | null;
}

interface ApiErrorPayload {
  error?: { message?: string; code?: string };
}

interface ApiError extends Error {
  status?: number;
  code?: string;
}

function apiError(payload: ApiErrorPayload | null, response: Response): ApiError {
  const message = payload?.error?.message || (response.statusText ? `${response.statusText} (${response.status})` : `فشل الطلب (${response.status})`);
  const error = new Error(message) as ApiError;
  error.status = response.status;
  error.code = payload?.error?.code;
  return error;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithAuth(path, init);
  const payload = await parseJsonSafe(response);
  if (!response.ok) throw apiError(payload, response);
  return (payload?.data ?? payload) as T;
}

export async function getDeliveryDrivers(options: { search?: string; page?: number; limit?: number } = {}): Promise<{ items: DeliveryDriver[]; total: number; page: number; limit: number }> {
  const params = new URLSearchParams();
  if (options.search?.trim()) params.set('search', options.search.trim());
  if (options.page) params.set('page', String(options.page));
  if (options.limit) params.set('limit', String(options.limit));
  const result = await request<{ items?: DeliveryDriver[]; data?: DeliveryDriver[]; total?: number; page?: number; limit?: number }>(`/delivery/drivers?${params.toString()}`);
  const items = Array.isArray(result.items) ? result.items : Array.isArray(result.data) ? result.data : [];
  return { items, total: result.total ?? items.length, page: result.page ?? options.page ?? 1, limit: result.limit ?? options.limit ?? 25 };
}

export function getDeliveryDriver(id: string): Promise<DeliveryDriver> {
  return request<DeliveryDriver>(`/delivery/drivers/${encodeURIComponent(id)}`);
}

export function createDeliveryDriver(input: DeliveryDriverInput): Promise<DeliveryDriver> {
  return request<DeliveryDriver>('/delivery/drivers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
}

export function updateDeliveryDriver(id: string, input: Partial<DeliveryDriverInput>): Promise<DeliveryDriver> {
  return request<DeliveryDriver>(`/delivery/drivers/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
}

export async function deleteDeliveryDriver(id: string): Promise<void> {
  await request<unknown>(`/delivery/drivers/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
