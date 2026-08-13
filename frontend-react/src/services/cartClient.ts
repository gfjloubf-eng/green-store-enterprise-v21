import { fetchWithAuth } from './authClient';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    id: string;
    name: string;
    sellingPrice: number;
    image?: string;
  };
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
}

export async function getCart(): Promise<Cart | null> {
  const res = await fetchWithAuth('/cart', { method: 'GET' });
  if (!res.ok) {
    if (res.status === 404) return null;
    const errPayload = await res.json().catch(() => null);
    const err: any = new Error(errPayload?.error?.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const payload = await res.json();
  return payload?.data ?? null;
}

export async function addItemToCart(productId: string, quantity = 1): Promise<Cart> {
  const res = await fetchWithAuth('/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) {
    const errPayload = await res.json().catch(() => null);
    const err: any = new Error(errPayload?.error?.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const payload = await res.json();
  return payload?.data;
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  const res = await fetchWithAuth(`/cart/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    const errPayload = await res.json().catch(() => null);
    const err: any = new Error(errPayload?.error?.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const payload = await res.json();
  return payload?.data;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const res = await fetchWithAuth(`/cart/items/${itemId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errPayload = await res.json().catch(() => null);
    const err: any = new Error(errPayload?.error?.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const payload = await res.json();
  return payload?.data;
}

export async function clearCart(): Promise<void> {
  const res = await fetchWithAuth('/cart', {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errPayload = await res.json().catch(() => null);
    const err: any = new Error(errPayload?.error?.message ?? `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
}

