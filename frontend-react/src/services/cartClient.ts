import { fetchWithAuth } from './authClient';
import { ProductService } from '@/features/products/services/productService';
import { calculateEffectivePrice } from '@/features/products/services/offerService';

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

const LOCAL_STORAGE_CART_KEY = 'green_store_local_cart';

function getLocalCart(): Cart {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local cart:', e);
  }
  return {
    id: 'local-cart',
    userId: 'guest',
    items: [],
    subtotal: 0,
    taxTotal: 0,
    grandTotal: 0,
  };
}

function saveLocalCart(cart: Cart): Cart {
  try {
    let subtotal = 0;
    cart.items.forEach((item) => {
      item.totalPrice = item.unitPrice * item.quantity;
      subtotal += item.totalPrice;
    });
    cart.subtotal = Math.round(subtotal * 100) / 100;
    cart.taxTotal = Math.round(subtotal * 0.15 * 100) / 100;
    cart.grandTotal = Math.round((cart.subtotal + cart.taxTotal) * 100) / 100;
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    return cart;
  } catch (e) {
    console.error('Error saving local cart:', e);
    return cart;
  }
}

export async function getCart(): Promise<Cart | null> {
  try {
    const res = await fetchWithAuth('/cart', { method: 'GET' });
    if (!res.ok) {
      return getLocalCart();
    }
    const payload = await res.json();
    return payload?.data ?? getLocalCart();
  } catch {
    return getLocalCart();
  }
}

export async function addItemToCart(productId: string, quantity = 1, productDetails?: { name: string; sellingPrice: number; image?: string }): Promise<Cart> {
  const prod = ProductService.getById(productId);
  const effectivePrice = prod
    ? calculateEffectivePrice(prod).finalPrice
    : (productDetails?.sellingPrice ?? 10);

  if (prod && prod.stock <= 0) {
    throw new Error('عذراً، هذا المنتج نفد من المخزون حالياً');
  }

  try {
    const res = await fetchWithAuth('/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload?.data) return payload.data;
    }
  } catch {
    // fallback below
  }

  const localCart = getLocalCart();
  const existingIndex = localCart.items.findIndex((item) => item.productId === productId || item.product?.id === productId);

  const availableStock = prod ? prod.stock : 999;
  
  if (existingIndex >= 0) {
    const currentQty = localCart.items[existingIndex].quantity;
    const newQty = Math.min(availableStock, currentQty + quantity);
    localCart.items[existingIndex].quantity = newQty;
    localCart.items[existingIndex].unitPrice = effectivePrice;
    localCart.items[existingIndex].totalPrice = effectivePrice * newQty;
  } else {
    const finalQty = Math.min(availableStock, Math.max(1, quantity));
    localCart.items.push({
      id: `item-${Date.now()}`,
      productId,
      quantity: finalQty,
      unitPrice: effectivePrice,
      totalPrice: effectivePrice * finalQty,
      product: {
        id: productId,
        name: prod?.name ?? productDetails?.name ?? `منتج ${productId}`,
        sellingPrice: effectivePrice,
        image: prod?.image ?? productDetails?.image,
      },
    });
  }

  return saveLocalCart(localCart);
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  try {
    const res = await fetchWithAuth(`/cart/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload?.data) return payload.data;
    }
  } catch {
    // fallback below
  }

  const localCart = getLocalCart();
  const itemIndex = localCart.items.findIndex((i) => i.id === itemId);
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      localCart.items.splice(itemIndex, 1);
    } else {
      const prodId = localCart.items[itemIndex].productId || localCart.items[itemIndex].product?.id;
      const prod = prodId ? ProductService.getById(prodId) : undefined;
      const availableStock = prod ? prod.stock : 999;
      const cappedQty = Math.min(availableStock, Math.max(1, quantity));
      localCart.items[itemIndex].quantity = cappedQty;
      localCart.items[itemIndex].totalPrice = localCart.items[itemIndex].unitPrice * cappedQty;
    }
  }

  return saveLocalCart(localCart);
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  try {
    const res = await fetchWithAuth(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload?.data) return payload.data;
    }
  } catch {
    // fallback below
  }

  const localCart = getLocalCart();
  localCart.items = localCart.items.filter((i) => i.id !== itemId);
  return saveLocalCart(localCart);
}

export async function clearCart(): Promise<void> {
  try {
    await fetchWithAuth('/cart', {
      method: 'DELETE',
    });
  } catch {
    // fallback below
  }

  localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
}

