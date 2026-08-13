import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface PublicSettings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  supportPhone: string;
  address: string;
  currency: string;
  taxPercentage: number;
  defaultShippingFee: number;
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const envUrl = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:3000';
  const res = await fetch(`${envUrl.replace(/\/+$/, '')}/settings/public`);
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    throw new Error(message);
  }
  return payload?.data;
}

export async function getAdminSettings(): Promise<Record<string, string>> {
  const res = await fetchWithAuth('/admin/settings', { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function updateAdminSettings(settings: Record<string, string>): Promise<Record<string, string>> {
  const res = await fetchWithAuth('/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
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
