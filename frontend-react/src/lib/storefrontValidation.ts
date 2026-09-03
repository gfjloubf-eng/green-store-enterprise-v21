/* ============================================================
   storefrontValidation — Orderability guard for the storefront
   Green Store Enterprise v2 (customer storefront)
   ============================================================
   Unified "may this product be ordered?" rule used by every surface:
   HomePage, ProduceCard, ProductDetailsPage, /products catalog,
   cartClient (before any add) and CheckoutPage.

   Rules:
   - a real product id is required (backend UUIDs; demo/mock ids are blocked)
   - original price must be finite and > 0
   - effective (final) price must be finite and > 0
   - status must be active
   - stock must be > 0 (a zero/negative reported stock blocks ordering)
   No invalid price is ever coerced into 0.01.
   ============================================================ */

import type { ProductDTO } from '../features/products/domain/productDTO';
import { isFinitePositive, safePrice, CART_ERROR_MESSAGES } from './storefrontCommerce';

/** Backend product ids are UUIDs. Demo/mock ids look like "prod-001". */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** A product is "real" when it comes from the backend catalog (UUID id). */
export function isRealProductId(id: string | null | undefined): boolean {
  if (!id) return false;
  return UUID_RE.test(id.trim());
}

export function isRealProduct(product: { id?: string } | null | undefined): boolean {
  return Boolean(product && isRealProductId(product.id));
}

export type OrderabilityReason =
  | 'unavailable' // demo / missing id
  | 'no-price'
  | 'out-of-stock'
  | 'inactive';

export interface OrderabilityResult {
  orderable: boolean;
  reason?: OrderabilityReason;
  message?: string;
}

export interface OrderabilityInput {
  id?: string | null;
  name?: string | null;
  status?: string | null;
  /** Original retail price (before offers). */
  sellingPrice?: number | null;
  /** Optional effective final price (after offers). Falls back to sellingPrice. */
  finalPrice?: number | null;
  /** Reported inventory quantity. Absent => unknown => orderable (subject to other rules). */
  stock?: number | null;
}

export function getOrderability(input: OrderabilityInput): OrderabilityResult {
  if (!isRealProductId(input.id)) {
    return {
      orderable: false,
      reason: 'unavailable',
      message: 'لا يمكن طلب هذا المنتج حاليًا.',
    };
  }

  const originalPrice = safePrice(input.sellingPrice);
  // A provided-but-invalid effective price (0, negative, NaN, Infinity) blocks
  // ordering — it is a real "no price" signal, never silently replaced.
  // Only an ABSENT effective price falls back to the original selling price.
  const finalPrice =
    input.finalPrice === undefined || input.finalPrice === null
      ? safePrice(input.sellingPrice)
      : safePrice(input.finalPrice);

  if (!isFinitePositive(originalPrice) || !isFinitePositive(finalPrice)) {
    return { orderable: false, reason: 'no-price', message: CART_ERROR_MESSAGES.noPrice };
  }

  const status = String(input.status ?? '').toLowerCase();
  if (status === 'out_of_stock') {
    return { orderable: false, reason: 'out-of-stock', message: CART_ERROR_MESSAGES.outOfStock };
  }
  if (status !== '' && status !== 'active' && status !== 'published') {
    return { orderable: false, reason: 'inactive', message: CART_ERROR_MESSAGES.inactive };
  }

  if (typeof input.stock === 'number' && Number.isFinite(input.stock) && input.stock <= 0) {
    return { orderable: false, reason: 'out-of-stock', message: CART_ERROR_MESSAGES.outOfStock };
  }

  return { orderable: true };
}

/** Convenience boolean check (product DTO from the store). */
export function isProductOrderable(product: ProductDTO | OrderabilityInput): boolean {
  return getOrderability({
    id: product?.id,
    status: product?.status,
    sellingPrice: product?.sellingPrice,
    stock: product?.stock,
  }).orderable;
}

/** Convert a user-entered quantity into a safe positive integer, or return null. */
export function toSafeAddQuantity(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 99) {
    return null;
  }
  return value;
}
