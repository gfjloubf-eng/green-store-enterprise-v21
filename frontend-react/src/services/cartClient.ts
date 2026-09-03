/* ============================================================
   cartClient — Single storage/operations gateway for the cart
   Green Store Enterprise v2 (customer storefront)
   ============================================================
   Every cart mutation in the app goes through this module.

   Policy:
   - Guest (no access token): cart lives in localStorage only — no network,
     survives refresh, no demo products ever enter it.
   - Signed-in user: the backend cart is the only source of truth.
     If a server call fails we THROW an Arabic error; we never silently fall
     back to localStorage and never fake a success.
   - All prices are validated before any write (see storefrontValidation).
     Invalid prices are never coerced to 0.01; zero-price products cannot be
     added, cannot enter the local cart, checkout or order messages.
   - Server cart payloads are enriched with catalog display prices when the
     server reports a zero/absent unit price (display only — the backend
     remains the final authority when the order is created).
   - Totals are computed by the shared storefrontCommerce breakdown
     (tax 15% + delivery 3 YER once) so every surface shows the same numbers.
   ============================================================ */

import { fetchWithAuth, getStoredAccessToken, parseJsonSafe } from './authClient';
import { ProductService } from '@/features/products/services/productService';
import { calculateEffectivePrice } from '@/features/products/services/offerService';
import {
  computeCartBreakdown,
  roundCurrency,
  safePrice,
  capQuantityToStock,
  isFinitePositive,
  CART_ERROR_MESSAGES,
} from '@/lib/storefrontCommerce';
import { getOrderability, isRealProductId } from '@/lib/storefrontValidation';

/* ─── Types (customer-facing cart shape) ─────────────────── */

export interface CartItemProductView {
  id: string;
  name: string;
  sellingPrice: number;
  image?: string;
  category?: { id: string; name: string };
  unit?: { id: string; name: string; abbreviation: string };
}

export interface CartItem {
  /** Line id — server cart item id, or a generated id for guest lines. */
  id: string;
  productId: string;
  quantity: number;
  /** Final unit price shown to the customer (after any active offer). */
  unitPrice: number;
  /** Original (compare-at) unit price used for the savings line. */
  originalUnitPrice?: number;
  totalPrice: number;
  product?: CartItemProductView;
}

export interface Cart {
  id: string;
  userId?: string;
  mode: 'guest' | 'account';
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  deliveryTotal: number;
  savings: number;
  grandTotal: number;
  totalQuantity: number;
}

/* ─── Events & local storage helpers (guest only) ─────────── */

export const CART_UPDATED_EVENT = 'green_store_cart_updated';

export function notifyCartUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }
}

const LOCAL_STORAGE_CART_KEY = 'green_store_local_cart';

/** True when the current viewer is a guest (no stored access token). */
export function isGuestCartMode(): boolean {
  if (typeof window === 'undefined') return true;
  return !getStoredAccessToken();
}

function emptyGuestCart(): Cart {
  return {
    id: 'local-cart',
    userId: 'guest',
    mode: 'guest',
    items: [],
    subtotal: 0,
    taxTotal: 0,
    deliveryTotal: 0,
    savings: 0,
    grandTotal: 0,
    totalQuantity: 0,
  };
}

/** Price/product lookup source for display enrichment. */
interface CatalogLike {
  name?: string;
  image?: string;
  sellingPrice?: number;
  compareAtPrice?: number;
  offer?: unknown;
  category?: { id?: string; name?: string };
  unit?: { id?: string; name?: string; abbreviation?: string };
}

interface RawItemLike {
  id?: string;
  productId?: string;
  quantity?: number;
  unitPrice?: number;
  product?: {
    id?: string;
    name?: string;
    image?: string | null;
    sellingPrice?: number;
    category?: { id?: string; name?: string } | null;
    unit?: { id?: string; name?: string; abbreviation?: string } | null;
  } | null;
}

/**
 * Build the display fields for one line.
 * - unitPrice      : effective (offer-aware) catalog price when available,
 *                    otherwise the stored price.
 * - originalUnitPrice : compare-at/original price when an offer is active.
 */
function resolveLineDisplay(
  catalog: CatalogLike | undefined,
  rawProduct: RawItemLike['product'],
  storedPrice: number,
): { unitPrice: number; originalUnitPrice: number; product: CartItemProductView } {
  let unitPrice = safePrice(storedPrice);
  let originalUnitPrice = unitPrice;

  let name = rawProduct?.name;
  let image = rawProduct?.image ?? undefined;
  let category = rawProduct?.category ?? undefined;
  let unit = rawProduct?.unit ?? undefined;

  if (catalog) {
    const calc = calculateEffectivePrice(catalog as { sellingPrice: number });
    if (calc.hasActiveOffer && isFinitePositive(calc.finalPrice)) {
      unitPrice = calc.finalPrice;
      originalUnitPrice = safePrice(calc.originalPrice) || calc.finalPrice;
    } else if (isFinitePositive(catalog.sellingPrice)) {
      unitPrice = catalog.sellingPrice;
      const compareAt = safePrice(catalog.compareAtPrice);
      originalUnitPrice = compareAt > catalog.sellingPrice ? compareAt : catalog.sellingPrice;
    }
    if (!name) name = catalog.name;
    if (!image) image = catalog.image;
    if (!category?.name && catalog.category?.name) category = catalog.category;
    if (!unit?.name && catalog.unit?.name) unit = catalog.unit;
  }

  const product: CartItemProductView = {
    id: String(rawProduct?.id || ''),
    name: String(name || 'منتج'),
    sellingPrice: unitPrice,
  };
  if (image) product.image = image;
  if (category?.name) {
    product.category = { id: String(category.id || ''), name: String(category.name) };
  }
  if (unit?.name) {
    product.unit = {
      id: String(unit.id || ''),
      name: String(unit.name),
      abbreviation: String(unit.abbreviation || ''),
    };
  }

  return { unitPrice, originalUnitPrice, product };
}

/** Recompute every totals field of a cart from its lines. */
function applyBreakdown(cart: Cart): void {
  const breakdown = computeCartBreakdown(
    cart.items.map((item) => ({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      originalUnitPrice: item.originalUnitPrice ?? item.unitPrice,
    })),
  );
  cart.subtotal = breakdown.subtotal;
  cart.taxTotal = breakdown.taxTotal;
  cart.deliveryTotal = breakdown.deliveryTotal;
  cart.savings = breakdown.savings;
  cart.grandTotal = breakdown.grandTotal;
  cart.totalQuantity = breakdown.totalQuantity;
  for (const item of cart.items) {
    item.totalPrice = roundCurrency(item.unitPrice * item.quantity);
  }
}

/** Validate a line's basic integrity for local storage. */
function isValidLine(productId: unknown, quantity: unknown, unitPrice: number): boolean {
  if (!isRealProductId(String(productId || ''))) return false;
  const q = Number(quantity);
  if (!Number.isInteger(q) || q < 1 || q > 99) return false;
  if (!isFinitePositive(unitPrice)) return false;
  return true;
}

/* ─── Guest cart (localStorage) ───────────────────────────── */

function readLocalCart(): Cart {
  const base = emptyGuestCart();
  if (typeof window === 'undefined') return base;

  let text: string | null = null;
  try {
    text = window.localStorage.getItem(LOCAL_STORAGE_CART_KEY);
  } catch {
    return base;
  }
  if (!text) return base;

  let parsed: { items?: RawItemLike[] | null } | null = null;
  try {
    parsed = JSON.parse(text) as { items?: RawItemLike[] | null };
  } catch {
    try {
      window.localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
    } catch {
      /* ignore */
    }
    return base;
  }

  if (!parsed || !Array.isArray(parsed.items)) return base;

  const items: CartItem[] = [];
  let droppedLegacy = false;

  for (const raw of parsed.items) {
    const productId = String(raw.productId || raw.product?.id || '');
    const storedPrice = safePrice(raw.unitPrice);
    if (!isValidLine(productId, raw.quantity, storedPrice)) {
      droppedLegacy = true;
      continue;
    }
    const quantity = Math.trunc(Number(raw.quantity));
    const catalog = ProductService.getById(productId);
    const display = resolveLineDisplay(catalog, raw.product, storedPrice);
    if (!isFinitePositive(display.unitPrice)) {
      droppedLegacy = true;
      continue;
    }

    items.push({
      id: String(raw.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
      productId,
      quantity,
      unitPrice: display.unitPrice,
      originalUnitPrice: display.originalUnitPrice,
      totalPrice: roundCurrency(display.unitPrice * quantity),
      product: { ...display.product, id: productId },
    });
  }

  const cart: Cart = { ...base, items };
  applyBreakdown(cart);
  if (droppedLegacy) persistGuestCart(cart); // clean stale storage
  return cart;
}

function persistGuestCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving local cart:', error);
  }
}

/* ─── Server cart mapping (display enrichment) ────────────── */

function mapServerCart(raw: unknown): Cart {
  const payload = (raw ?? {}) as {
    id?: string;
    customerId?: string;
    userId?: string;
    items?: RawItemLike[] | null;
  };

  const cart: Cart = {
    id: String(payload.id || 'server-cart'),
    userId: String(payload.customerId || payload.userId || ''),
    mode: 'account',
    items: [],
    subtotal: 0,
    taxTotal: 0,
    deliveryTotal: 0,
    savings: 0,
    grandTotal: 0,
    totalQuantity: 0,
  };

  for (const rawItem of payload.items ?? []) {
    const productId = String(rawItem.productId || rawItem.product?.id || '');
    const quantity = Math.trunc(Number(rawItem.quantity));
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) continue;
    if (!isRealProductId(productId)) continue;

    // Server cart lines may carry a 0/absent price (backend prices at order
    // time). For display we fall back to the live public catalog price.
    const storedPrice = safePrice(rawItem.unitPrice);
    const catalog = ProductService.getById(productId);
    const display = resolveLineDisplay(catalog, rawItem.product, storedPrice);
    if (!isFinitePositive(display.unitPrice)) continue; // unpriced ⇒ cannot order

    cart.items.push({
      id: String(rawItem.id || `server-item-${productId}`),
      productId,
      quantity,
      unitPrice: display.unitPrice,
      originalUnitPrice: display.originalUnitPrice,
      totalPrice: roundCurrency(display.unitPrice * quantity),
      product: { ...display.product, id: productId },
    });
  }

  applyBreakdown(cart);
  return cart;
}

/* ─── Public gateway API ──────────────────────────────────── */

/**
 * Best-effort catalog warm-up so server cart lines can be enriched with
 * real display prices (the backend prices lines at order time and may
 * return zero/absent unit prices). Never throws.
 */
async function ensureCatalogSynced(): Promise<void> {
  try {
    await ProductService.syncAllFromBackend();
  } catch {
    // Keep whatever display data is already available.
  }
}

/**
 * Load the cart for the current viewer.
 * Guest: instant localStorage read (never a network call).
 * Signed-in: server cart; throws an Arabic error when unavailable — no
 * silent local fallback.
 */
export async function getCart(): Promise<Cart> {
  if (isGuestCartMode()) return readLocalCart();

  await ensureCatalogSynced();

  let res: Response;
  try {
    res = await fetchWithAuth('/cart', { method: 'GET' });
  } catch {
    throw new Error(CART_ERROR_MESSAGES.loadFailed);
  }
  if (!res.ok) throw new Error(CART_ERROR_MESSAGES.loadFailed);

  const payload = await parseJsonSafe(res);
  const data = payload?.data ?? payload;
  if (!data || !Array.isArray((data as { items?: unknown }).items)) {
    throw new Error(CART_ERROR_MESSAGES.loadFailed);
  }
  return mapServerCart(data);
}

/**
 * Add a product to the cart. This is the ONLY add path used by the UI.
 * Validates orderability first (real product, valid prices, stock, quantity).
 * Guests: local cart. Signed-in: server cart — throws on failure, no fake success.
 */
export async function addItemToCart(
  productId: string,
  quantity = 1,
  productDetails?: { name?: string; sellingPrice?: number; image?: string },
): Promise<Cart> {
  const product = ProductService.getById(productId);
  const orderability = getOrderability({
    id: productId,
    status: product?.status,
    sellingPrice: product?.sellingPrice ?? productDetails?.sellingPrice,
    stock: product?.stock,
  });
  if (!orderability.orderable) {
    throw new Error(orderability.message || CART_ERROR_MESSAGES.noPrice);
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error(CART_ERROR_MESSAGES.invalidQuantity);
  }

  const stockLimit =
    product && typeof product.stock === 'number' && Number.isFinite(product.stock) && product.stock > 1
      ? product.stock
      : undefined;
  const finalQuantity = capQuantityToStock(quantity, stockLimit);

  if (isGuestCartMode()) {
    const cart = readLocalCart();
    const existing = cart.items.find(
      (item) => item.productId === productId || item.product?.id === productId,
    );

    if (existing) {
      const nextQuantity = Math.min(
        existing.quantity + finalQuantity,
        stockLimit ? Math.floor(stockLimit) : 99,
      );
      const display = resolveLineDisplay(product, existing.product, existing.unitPrice);
      existing.quantity = nextQuantity;
      existing.unitPrice = display.unitPrice;
      existing.originalUnitPrice = display.originalUnitPrice;
      existing.product = { ...display.product, id: productId };
      existing.totalPrice = roundCurrency(display.unitPrice * nextQuantity);
    } else {
      const display = resolveLineDisplay(
        product,
        { name: productDetails?.name, image: productDetails?.image ?? null },
        safePrice(product?.sellingPrice ?? productDetails?.sellingPrice),
      );
      if (!isFinitePositive(display.unitPrice)) {
        throw new Error(CART_ERROR_MESSAGES.noPrice);
      }
      cart.items.push({
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        productId,
        quantity: finalQuantity,
        unitPrice: display.unitPrice,
        originalUnitPrice: display.originalUnitPrice,
        totalPrice: roundCurrency(display.unitPrice * finalQuantity),
        product: { ...display.product, id: productId },
      });
    }

    applyBreakdown(cart);
    persistGuestCart(cart);
    notifyCartUpdated();
    return cart;
  }

  // Signed-in user → server cart only (no local fallback, no fake success).
  await ensureCatalogSynced();
  let res: Response;
  try {
    res = await fetchWithAuth('/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: finalQuantity }),
    });
  } catch {
    throw new Error(CART_ERROR_MESSAGES.syncFailed);
  }
  if (!res.ok) throw new Error(CART_ERROR_MESSAGES.syncFailed);

  const payload = await parseJsonSafe(res);
  const data = payload?.data ?? payload;
  if (!data || !Array.isArray((data as { items?: unknown }).items)) {
    throw new Error(CART_ERROR_MESSAGES.syncFailed);
  }
  const cart = mapServerCart(data);
  notifyCartUpdated();
  return cart;
}

/**
 * Update an item quantity (removal handled by removeCartItem).
 * Signed-in users never fall back to localStorage on failure.
 */
export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error(CART_ERROR_MESSAGES.invalidQuantity);
  }

    if (isGuestCartMode()) {
    const cart = readLocalCart();
    const item = cart.items.find((it) => it.id === itemId);
    if (!item) return cart;
    const catalog = ProductService.getById(item.productId);
    const stockLimit =
      catalog && typeof catalog.stock === 'number' && Number.isFinite(catalog.stock) && catalog.stock > 1
        ? catalog.stock
        : undefined;
    item.quantity = Math.min(Math.trunc(quantity), stockLimit ? Math.floor(stockLimit) : 99);
    item.totalPrice = roundCurrency(item.unitPrice * item.quantity);
    applyBreakdown(cart);
    persistGuestCart(cart);
    notifyCartUpdated();
    return cart;
  }

  await ensureCatalogSynced();
  let res: Response;
  try {
    res = await fetchWithAuth(`/cart/items/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
  } catch {
    throw new Error(CART_ERROR_MESSAGES.syncFailed);
  }
  if (!res.ok) throw new Error(CART_ERROR_MESSAGES.syncFailed);

  const payload = await parseJsonSafe(res);
  const data = payload?.data ?? payload;
  if (!data || !Array.isArray((data as { items?: unknown }).items)) {
    throw new Error(CART_ERROR_MESSAGES.syncFailed);
  }
  const cart = mapServerCart(data);
  notifyCartUpdated();
  return cart;
}

/** Remove a line from the cart. Signed-in users never fall back locally. */
export async function removeCartItem(itemId: string): Promise<Cart> {
  if (isGuestCartMode()) {
    const cart = readLocalCart();
    cart.items = cart.items.filter((it) => it.id !== itemId);
    applyBreakdown(cart);
    persistGuestCart(cart);
    notifyCartUpdated();
    return cart;
  }

  await ensureCatalogSynced();
  let res: Response;
  try {
    res = await fetchWithAuth(`/cart/items/${encodeURIComponent(itemId)}`, { method: 'DELETE' });
  } catch {
    throw new Error(CART_ERROR_MESSAGES.syncFailed);
  }
  if (!res.ok) throw new Error(CART_ERROR_MESSAGES.syncFailed);

  const payload = await parseJsonSafe(res);
  const data = payload?.data ?? payload;
  const cart = data && Array.isArray((data as { items?: unknown }).items)
    ? mapServerCart(data)
    : await getCart();
  notifyCartUpdated();
  return cart;
}

/** Empty the cart. Signed-in users never fall back locally. */
export async function clearCart(): Promise<void> {
  if (isGuestCartMode()) {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
      } catch {
        /* ignore */
      }
    }
    notifyCartUpdated();
    return;
  }

  let res: Response;
  try {
    res = await fetchWithAuth('/cart', { method: 'DELETE' });
  } catch {
    throw new Error(CART_ERROR_MESSAGES.syncFailed);
  }
  if (!res.ok) throw new Error(CART_ERROR_MESSAGES.syncFailed);
  notifyCartUpdated();
}
