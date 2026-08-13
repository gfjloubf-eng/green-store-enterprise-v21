import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  provider: string;
  providerReference?: string | null;
  idempotencyKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function createPayment(data: {
  orderId: string;
  paymentMethod: string;
  idempotencyKey?: string;
}): Promise<PaymentTransaction> {
  const res = await fetchWithAuth('/payments/create', {
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

export async function getPaymentForOrder(orderId: string): Promise<PaymentTransaction | null> {
  const res = await fetchWithAuth(`/payments/order/${orderId}`, { method: 'GET' });

  if (res.status === 404) return null;
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function verifyPayment(data: {
  paymentId: string;
  status?: string;
  providerReference?: string;
}): Promise<PaymentTransaction> {
  const res = await fetchWithAuth('/payments/verify', {
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
