/* ============================================================
   storefrontCommerce — Unified storefront money & quantity rules
   Green Store Enterprise v2 (customer storefront)
   ============================================================
   Single source of truth for the customer-facing commerce policy:
   - Currency: YER (الريال اليمني) — displayed as ر.ي
   - Tax: 15% of subtotal
   - Delivery: 3 YER once per non-empty cart
   - Total = subtotal + tax + delivery
   Pure functions only (framework/DOM free) so they are unit-testable.
   NOTE: never converts an invalid price into 0.01 — invalid stays 0.
   ============================================================ */

export const STOREFRONT_TAX_RATE = 0.15;
export const STOREFRONT_DELIVERY_FEE = 3; // YER — charged once for any non-empty cart
export const STOREFRONT_MAX_QUANTITY = 99;
export const STOREFRONT_CURRENCY = 'YER';

/** Round to 2 decimal places (safe currency math). */
export function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** True only when the value is a finite number greater than zero. */
export function isFinitePositive(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/**
 * Price-safety normalizer.
 * Returns the rounded price when valid (finite, > 0), otherwise 0.
 * It intentionally does NOT promote invalid prices to 0.01.
 */
export function safePrice(value: unknown): number {
  return isFinitePositive(value) ? roundCurrency(value) : 0;
}

/** Quantity must be a positive integer (1..max). Returns false otherwise. */
export function isOrderableQuantity(value: unknown, max = STOREFRONT_MAX_QUANTITY): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= Math.max(1, max)
  );
}

/**
 * Cap a quantity against a known stock limit.
 * When stock is 0/absent/not a positive number the caller decides; this helper
 * only enforces a cap when a reliable positive limit is provided.
 */
export function capQuantityToStock(quantity: number, knownStock?: number | null): number {
  const q = Math.max(1, Math.trunc(quantity) || 1);
  if (typeof knownStock === 'number' && Number.isFinite(knownStock) && knownStock > 1) {
    return Math.min(q, Math.floor(knownStock));
  }
  return Math.min(q, STOREFRONT_MAX_QUANTITY);
}

/** Input row for the shared breakdown calculator. */
export interface BreakdownInput {
  quantity: number;
  /** Final unit price shown to the customer (after any active offer). */
  unitPrice: number;
  /** Optional original (compare-at) unit price used to compute savings. */
  originalUnitPrice?: number | null;
}

/** Unified totals shown on every customer surface (drawer, /cart, checkout…). */
export interface CartBreakdown {
  subtotal: number;
  originalSubtotal: number;
  /** savings = original − final when an offer is active (informational only). */
  savings: number;
  taxTotal: number;
  deliveryTotal: number;
  grandTotal: number;
  totalQuantity: number;
}

/**
 * Compute the customer breakdown from raw line inputs.
 * Rules (YER):
 *   subtotal      = Σ quantity × unitPrice
 *   taxTotal      = subtotal × 15%
 *   deliveryTotal = 3 if any item exists, else 0 (once, not per item)
 *   grandTotal    = subtotal + taxTotal + deliveryTotal
 */
export function computeCartBreakdown(items: readonly BreakdownInput[]): CartBreakdown {
  let subtotal = 0;
  let originalSubtotal = 0;
  let totalQuantity = 0;

  for (const item of items) {
    const quantity = Math.max(0, Math.trunc(item.quantity) || 0);
    const unitPrice = safePrice(item.unitPrice);
    const originalUnitPrice = safePrice(item.originalUnitPrice ?? item.unitPrice);

    subtotal += roundCurrency(quantity * unitPrice);
    originalSubtotal += roundCurrency(quantity * Math.max(unitPrice, originalUnitPrice));
    totalQuantity += quantity;
  }

  subtotal = roundCurrency(subtotal);
  originalSubtotal = roundCurrency(originalSubtotal);
  const savings = roundCurrency(Math.max(0, originalSubtotal - subtotal));
  const taxTotal = roundCurrency(subtotal * STOREFRONT_TAX_RATE);
  const deliveryTotal = totalQuantity > 0 ? STOREFRONT_DELIVERY_FEE : 0;
  const grandTotal = roundCurrency(subtotal + taxTotal + deliveryTotal);

  return {
    subtotal,
    originalSubtotal,
    savings,
    taxTotal,
    deliveryTotal,
    grandTotal,
    totalQuantity,
  };
}

export const CART_ERROR_MESSAGES = {
  syncFailed:
    'تعذر مزامنة سلة حسابك مع الخادم. لم يتم حفظ العملية؛ حاول مرة أخرى.',
  loadFailed: 'تعذر تحميل سلة حسابك من الخادم. حاول مرة أخرى.',
  noPrice: 'لا يمكن طلب هذا المنتج قبل تحديد سعر صالح.',
  outOfStock: 'هذا المنتج غير متوفر حاليًا.',
  inactive: 'هذا المنتج غير متاح حاليًا.',
  invalidQuantity: 'الكمية المطلوبة غير صحيحة. اختر رقماً صحيحاً أكبر من صفر.',
} as const;
