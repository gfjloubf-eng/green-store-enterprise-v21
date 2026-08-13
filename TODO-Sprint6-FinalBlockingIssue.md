# TODO - Sprint 6 - Final Blocking Issue Remediation

## Goal
Remove remaining Products SQL from `api.php` for `action=products` and `action=product`.

## Step Plan
1. Update `app/Repositories/ProductRepository.php` to own SQL for:
   - list/search products (previously in `api.php` for `action=products`), matching existing behavior.
   - get single product by id (previously in `api.php` for `action=product`), matching existing behavior.
2. Update `app/Services/ProductService.php` to expose business methods used by `api.php` for the above actions (delegate to repository).
3. Update `api.php` to remove all direct SQL for:
   - `case 'products'`
   - `case 'product'`
   Use `ProductService` + existing `Response` + existing validation/error behavior.
4. Verify compliance:
   - `api.php` contains no SQL statements for products/product.
   - Products SQL paths are only in `ProductRepository`.
   - Existing API responses remain identical.
5. Run final Sprint 6 Production Release Verification automatically (as required by task).

## Progress Tracking
- [x] Step 1: Repository update
- [x] Step 2: Service update
- [x] Step 3: api.php update
- [x] Step 4: Verification checks
- [x] Step 5: Run verification command



