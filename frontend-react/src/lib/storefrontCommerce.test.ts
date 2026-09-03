/* ============================================================
   Unit tests — storefrontCommerce (totals & price safety)
   Self-contained assertions; run: esbuild this file → node file.mjs
   (no test framework dependency — keeps the build untouched)
   ============================================================ */

import {
  computeCartBreakdown,
  safePrice,
  isFinitePositive,
  isOrderableQuantity,
  capQuantityToStock,
  roundCurrency,
  STOREFRONT_TAX_RATE,
  STOREFRONT_DELIVERY_FEE,
  STOREFRONT_MAX_QUANTITY,
} from './storefrontCommerce';

let failures = 0;
let passed = 0;

function check(name: string, condition: boolean, details = ''): void {
  if (condition) {
    passed += 1;
  } else {
    failures += 1;
    console.error(`FAIL: ${name}${details ? ` — ${details}` : ''}`);
  }
}

/* 1. empty cart */
{
  const b = computeCartBreakdown([]);
  check('empty cart subtotal=0', b.subtotal === 0);
  check('empty cart tax=0', b.taxTotal === 0);
  check('empty cart delivery=0', b.deliveryTotal === 0);
  check('empty cart grandTotal=0', b.grandTotal === 0);
  check('empty cart qty=0', b.totalQuantity === 0);
}

/* 2. single item */
{
  const b = computeCartBreakdown([{ quantity: 2, unitPrice: 10 }]);
  check('single item subtotal=20', b.subtotal === 20);
  check('single item tax=15%', b.taxTotal === roundCurrency(20 * STOREFRONT_TAX_RATE));
  check('single item delivery=3 once', b.deliveryTotal === STOREFRONT_DELIVERY_FEE);
  check('single item grand total', b.grandTotal === roundCurrency(20 + 3 + 20 * STOREFRONT_TAX_RATE));
}

/* 3. multiple items */
{
  const b = computeCartBreakdown([
    { quantity: 1, unitPrice: 100 },
    { quantity: 2, unitPrice: 50 },
  ]);
  check('multiple subtotal=200', b.subtotal === 200);
  check('multiple totalQuantity=3', b.totalQuantity === 3);
}

/* 4. tax 15% exact spec examples */
{
  check('tax 15% of 100 = 15', computeCartBreakdown([{ quantity: 1, unitPrice: 100 }]).taxTotal === 15);
  check('tax 15% of 200 = 30', computeCartBreakdown([{ quantity: 1, unitPrice: 200 }]).taxTotal === 30);
}

/* 5. delivery 3 once, never per item */
{
  const five = computeCartBreakdown(
    Array.from({ length: 5 }, () => ({ quantity: 1, unitPrice: 1 })),
  );
  check('delivery stays 3 with 5 items', five.deliveryTotal === 3);
}

/* 6-9. invalid prices never promoted to 0.01 */
check('price 0 stays 0', safePrice(0) === 0);
check('price -5 → 0', safePrice(-5) === 0);
check('price NaN → 0', safePrice(Number.NaN) === 0);
check('price Infinity → 0', safePrice(Number.POSITIVE_INFINITY) === 0);
check('price -Infinity → 0', safePrice(Number.NEGATIVE_INFINITY) === 0);
check('price null → 0', safePrice(null as unknown as number) === 0);
check('price undefined → 0', safePrice(undefined as unknown as number) === 0);
check('price string → 0', safePrice('3' as unknown as number) === 0);
check('isFinitePositive(-5)=false', isFinitePositive(-5) === false);
check('zero-price line subtotal stays 0', computeCartBreakdown([{ quantity: 2, unitPrice: 0 }]).subtotal === 0);

/* 10-12. quantity validation */
check('qty 0 invalid', !isOrderableQuantity(0));
check('qty negative invalid', !isOrderableQuantity(-3));
check('qty fractional invalid', !isOrderableQuantity(1.5));
check('qty NaN invalid', !isOrderableQuantity(Number.NaN));
check('qty 1 valid', isOrderableQuantity(1));

/* 13. removing an item recomputes totals */
{
  const items = [
    { quantity: 1, unitPrice: 100 },
    { quantity: 1, unitPrice: 200 },
  ];
  const full = computeCartBreakdown(items);
  const afterRemoval = computeCartBreakdown(items.slice(0, 1));
  check('full subtotal=300', full.subtotal === 300);
  check('after removal subtotal=100', afterRemoval.subtotal === 100);
  check('grand total drops after removal', afterRemoval.grandTotal < full.grandTotal);
}

/* 14. clearing → zeroed totals & no delivery */
{
  const cleared = computeCartBreakdown([]);
  check(
    'cleared totals all zero',
    cleared.subtotal === 0 &&
      cleared.originalSubtotal === 0 &&
      cleared.savings === 0 &&
      cleared.taxTotal === 0 &&
      cleared.deliveryTotal === 0 &&
      cleared.grandTotal === 0 &&
      cleared.totalQuantity === 0,
  );
}

/* 15. savings only when original > final */
{
  const b = computeCartBreakdown([{ quantity: 2, unitPrice: 8, originalUnitPrice: 10 }]);
  check('savings=4 with offer', b.savings === 4);
  check('no savings without compare-at', computeCartBreakdown([{ quantity: 2, unitPrice: 8 }]).savings === 0);
}

/* stock cap: only reliable stock > 1 caps */
check('cap to stock 3', capQuantityToStock(5, 3) === 3);
check('stock==1 unknown default not capped', capQuantityToStock(5, 1) === 5);
check('unknown stock not capped', capQuantityToStock(5, undefined) === 5);
check('zero stock not treated as cap', capQuantityToStock(5, 0) === 5);
check('hard ceiling = 99', capQuantityToStock(500, undefined) === STOREFRONT_MAX_QUANTITY);

/* rounding */
check('0.1+0.2 rounds to 0.3', roundCurrency(0.1 + 0.2) === 0.3);
check('roundCurrency(NaN)=0', roundCurrency(Number.NaN) === 0);

if (failures > 0) {
  console.error(`storefrontCommerce tests: ${failures} FAILED, ${passed} passed`);
  throw new Error(`${failures} storefrontCommerce test(s) failed`);
} else {
  console.log(`storefrontCommerce tests: ${passed} passed ✓`);
}
