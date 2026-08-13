# TODO - Sprint 9 (Shopping Cart Module)

## Step 0: Architecture alignment
- [x] Confirm layering: Database -> Repository -> Service -> Validation -> Response -> api.php
- [x] Confirm no Orders/Inventory/Payments/Checkout/Notifications

## Step 1: Migration (additive only)
- [x] Create `db/migrations/2026_07_12_add_shopping_cart_tables.sql`
  - [x] shopping_carts table
  - [x] shopping_cart_items table
  - [x] Add indexes + FKs
  - [x] Ensure (cart_id, product_id) uniqueness


## Step 2: Repository Layer
- [ ] Implement `app/Repositories/ShoppingCartRepository.php`
  - [ ] Cart SQL CRUD + totals persistence
  - [ ] Cart items SQL CRUD (single row per product)
  - [ ] Product price lookup (unit_price copy)

## Step 3: Service Layer
- [ ] Implement `app/Services/ShoppingCartService.php`
  - [ ] Create cart
  - [ ] Find active cart
  - [ ] Add product (copy current product price to unit_price)
  - [ ] Update quantity (recalc line_total using stored unit_price)
  - [ ] Remove product (final item leaves cart ACTIVE)
  - [ ] Clear cart
  - [ ] Recalculate totals in service: subtotal/discount_total/tax_total/grand_total

## Step 4: API Layer
- [ ] Update `api.php` switch cases
  - [ ] create_cart
  - [ ] active_cart
  - [ ] add_to_cart
  - [ ] update_cart_item
  - [ ] remove_from_cart
  - [ ] clear_cart
  - [ ] cart
  - [ ] cart_items
- [ ] Response payloads include cart + cart_items where applicable

## Step 5: Verification
- [x] Currency defaults to YER (DB default; createCart inserts explicitly with YER)
- [x] Existing carts remain compatible (additive column only)
- [x] Valid state transitions succeed (service-owned state machine infrastructure)
- [x] Invalid state transitions are rejected (service-owned validation)
- [x] Repository contains no business logic (only updateCartStatus + persistence)
- [x] Service owns all state transition rules (transitionCartState + validation helpers)
- [x] Shopping Cart API remains backward compatible (existing endpoints unchanged)

## Step 6: Freeze
- [x] If all verification passes -> freeze Sprint 9.1


