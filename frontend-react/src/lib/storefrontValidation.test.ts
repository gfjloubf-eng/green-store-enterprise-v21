/* ============================================================
   Unit tests — storefrontValidation (orderability guard)
   Self-contained assertions; run: esbuild this file → node file.mjs
   (no test framework dependency — keeps the build untouched)
   ============================================================ */

import {
  getOrderability,
  isRealProductId,
  isProductOrderable,
  toSafeAddQuantity,
  type OrderabilityInput,
} from './storefrontValidation';

let failures = 0;
let passed = 0;

function check(name: string, condition: boolean): void {
  if (condition) {
    passed += 1;
  } else {
    failures += 1;
    console.error(`FAIL: ${name}`);
  }
}

const REAL_ID = '3faee17a-8a90-43e6-804c-debab96b2bd3';
const DEMO_ID = 'prod-001';

const orderableProduct: OrderabilityInput = {
  id: REAL_ID,
  status: 'active',
  sellingPrice: 10,
  stock: 5,
};

{
  const r = getOrderability(orderableProduct);
  check('valid product is orderable', r.orderable === true);
}

{
  const r = getOrderability({ ...orderableProduct, sellingPrice: 0 });
  check('zero price → not orderable', r.orderable === false);
  check('zero price reason = no-price', r.reason === 'no-price');
  check('zero price message mentions price', (r.message ?? '').includes('سعر'));
}

check('negative price → blocked', getOrderability({ ...orderableProduct, sellingPrice: -4 }).orderable === false);
check('NaN price → blocked', getOrderability({ ...orderableProduct, sellingPrice: Number.NaN }).orderable === false);
check('Infinity price → blocked', getOrderability({ ...orderableProduct, sellingPrice: Number.POSITIVE_INFINITY }).orderable === false);

{
  const r = getOrderability({ ...orderableProduct, finalPrice: 0 });
  check('invalid effective price blocks order', r.orderable === false && r.reason === 'no-price');
}

{
  const r = getOrderability({ ...orderableProduct, id: DEMO_ID });
  check('demo product → not orderable', r.orderable === false);
  check('demo product reason = unavailable', r.reason === 'unavailable');
  check('demo id not real', isRealProductId(DEMO_ID) === false);
  check('uuid id is real', isRealProductId(REAL_ID) === true);
}

check('stock 0 → blocked', getOrderability({ ...orderableProduct, stock: 0 }).orderable === false);
check('stock -2 → blocked', getOrderability({ ...orderableProduct, stock: -2 }).orderable === false);
check('unknown stock still orderable', getOrderability({ ...orderableProduct, stock: undefined }).orderable === true);

{
  const r = getOrderability({ ...orderableProduct, status: 'inactive' });
  check('inactive → blocked', r.orderable === false && r.reason === 'inactive');
}

{
  const r = getOrderability({ ...orderableProduct, status: 'out_of_stock' });
  check('out_of_stock status → blocked', r.orderable === false && r.reason === 'out-of-stock');
}

check('missing id → blocked', getOrderability({ ...orderableProduct, id: undefined }).orderable === false);
check('empty id → blocked', getOrderability({ ...orderableProduct, id: '' }).orderable === false);

/* quantity helper */
check('qty 0 → null', toSafeAddQuantity(0) === null);
check('qty -1 → null', toSafeAddQuantity(-1) === null);
check('qty 1.5 → null', toSafeAddQuantity(1.5) === null);
check('qty NaN → null', toSafeAddQuantity(Number.NaN) === null);
check('qty 3 → 3', toSafeAddQuantity(3) === 3);

/* convenience wrapper */
check(
  'isProductOrderable true for valid shape',
  isProductOrderable({ id: REAL_ID, status: 'active', sellingPrice: 5, stock: 2 }) === true,
);
check(
  'isProductOrderable false for zero price',
  isProductOrderable({ id: REAL_ID, status: 'active', sellingPrice: 0, stock: 2 }) === false,
);

if (failures > 0) {
  console.error(`storefrontValidation tests: ${failures} FAILED, ${passed} passed`);
  throw new Error(`${failures} storefrontValidation test(s) failed`);
} else {
  console.log(`storefrontValidation tests: ${passed} passed ✓`);
}
