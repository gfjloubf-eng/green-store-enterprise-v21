# Green Store Enterprise — Business Domain Architecture v1.0

## Executive Summary
This document designs a complete **Business Domain Model** for Green Store based strictly on the **current database schema** and the **existing codebase** responsibilities. It does **not** add features, change business logic, or create/alter any tables.

The current database schema represents a lightweight commerce workflow:
- **Catalog**-like product listing (stored in `products` / `produce`)
- **Customer identity** via `users`
- **Order capture** via `orders` (including customer snapshot fields)
- **Geolocation / delivery radius** via `locations`

## Current Business Domain

### Domain Map (high-level entities)
- **Product**
  - Backed by: `products` (and legacy/alternate: `produce`)
- **User / Customer**
  - Backed by: `users`
- **Order**
  - Backed by: `orders`
- **Location / Delivery Zone**
  - Backed by: `locations`

> Note: The existence of both `produce` (schema.sql) and `products` (schema_mysql.sql) indicates naming/consistency drift. This document treats both as representations of the product concept and documents them as current technical debt.

## Bounded Contexts

1. **Catalog & Products Context**
   - Purpose: manage product attributes available for purchase.
   - Current tables: `products` (Schema MySQL), `produce` (non-MySQL schema).
   - Includes: Product definition and nutrition-related descriptors.

2. **Customers & Users Context**
   - Purpose: identity and contact details used for ordering.
   - Current tables: `users`.

3. **Ordering Context**
   - Purpose: create orders, track status lifecycle, and store delivery address + geolocation.
   - Current tables: `orders`.
   - Key note: Order stores customer contact fields and delivery address as **snapshots**.

4. **Logistics / Locations Context**
   - Purpose: represent store locations and delivery radius.
   - Current tables: `locations`.
   - This context supports determining which location fulfills an order (even if selection logic lives in code today).

5. **Administration / Access Context (implicit)**
   - Purpose: only if roles/permissions exist in code.
   - Current status: **Not proven by schema files**; not documented as a persisted bounded context.
   - Recommendation: keep it future-scoped under technical debt.

## Aggregate Design

### 1) Product Aggregate (Catalog)
- **Aggregate Root**: `Product` (table row)
- **Entities**: none (single-table aggregate)
- **Value Objects** (conceptual):
  - Money (mapped to `price`)
  - NutritionProfile (mapped to `sugar_g`, `fat_g`, `acids`, `vitamins`, `potassium_high`, `iron_high`)
  - ProductIdentity (mapped to `id`)
- **Domain Rules (non-executable)**:
  - Product has required name.
  - Product type classification is constrained in MySQL schema (`ENUM('خضار','فاكهة')`).
- **Invariants (non-executable)**:
  - `id` uniquely identifies a product.
  - `created_at` exists for auditing.

### 2) Customer/User Aggregate (Customers)
- **Aggregate Root**: `User` (table row)
- **Entities**: none (single-table aggregate)
- **Value Objects** (conceptual):
  - Email, Username, Phone (mapped to `email`, `username`, `phone`)
  - Address (mapped to `addr`)
- **Domain Rules** (non-executable):
  - `username` and `email` are unique.
  - Password is stored as hashed string.
- **Invariants**:
  - `id` uniquely identifies a user.

### 3) Order Aggregate (Ordering)
- **Aggregate Root**: `Order` (table row)
- **Entities** (conceptual):
  - OrderLine(s) derived from `products_json` items.
- **Value Objects** (conceptual):
  - OrderMoney (mapped to `total`)
  - OrderStatus (mapped to `status` enum)
  - CustomerSnapshot (mapped to `customer_name`, `customer_email`, `customer_phone`)
  - DeliveryAddress (mapped to `delivery_addr`, `lat`, `lng`)
- **Domain Rules** (non-executable):
  - Order lifecycle follows `status` enum values.
  - Order must reference a user in MySQL schema via `user_id`.
  - Product quantities are represented in JSON structure `products_json`.
- **Invariants**:
  - `id` is primary key.
  - `created_at` is set.
  - `status` defaults to `pending`.

### 4) Location Aggregate (Logistics)
- **Aggregate Root**: `Location` (table row)
- **Entities**: none (single-table aggregate)
- **Value Objects**:
  - GeoPoint (mapped to `lat`,`lng`)
  - Radius (mapped to `radius_km`)
- **Domain Rules** (non-executable):
  - Location may have an optional name and address.
- **Invariants**:
  - `id` uniquely identifies a location.

## Entity Ownership (Ownership Matrix)

| Entity | Read by | Create by | Update by | Delete by | Future Responsibility Layer |
|---|---|---|---|---|---|
| Product | Catalog UI/Backend | Catalog admin/process | Catalog admin/process | Admin process (not defined) | Repository (future), Domain (future) |
| User | Ordering flow, Authentication flow (implicit) | Registration flow (future) | Profile update (future) | Admin (future) | Repository/Service (future) |
| Order | Customer app, Admin/order ops | Checkout/Order placement (existing endpoint) | Order lifecycle updates (future) | Admin/cancel (future) | Domain (future invariants), Service (future) |
| Location | Logistics selection (future) | Admin/import process (future) | Admin (future) | Admin (future) | Repository (future) |

## Business Rules (Domain Rules — documentation only)
1. **Order requires Customer identity**
   - Reason: MySQL schema includes `orders.user_id` FK to `users(id)`.
   - Current design implication: order creation should be tied to a valid user.

2. **Order status uses controlled lifecycle**
   - Reason: `orders.status` is an `ENUM('pending','preparing','delivering','delivered','cancelled')`.

3. **Product classification is constrained**
   - Reason: `products.type` is an `ENUM('خضار','فاكهة')` in MySQL schema.

4. **Customer uniqueness for login/contact**
   - Reason: `users.username` and `users.email` are `UNIQUE`.

> If additional business rules exist in code, they should be reconciled later during the schema cross-check phase.

## Future Expansion (ERP/Global scale, no redesign)
Designed to support future additions without breaking the domain:

- **Multi-category / taxonomy**
  - Extend Catalog context with categories without changing core Product identity.

- **Store branches & warehouses**
  - Extend Logistics context: additional `locations` variants (warehouse/store/fulfillment center) via metadata.

- **Purchases / Supplier procurement**
  - Extend Logistics/Inventory domains later by introducing Purchasing & Supplier concepts that complement product catalog.

- **Returns / Refunds / Exchanges**
  - Extend Ordering with return workflows linked to Order.

- **Accounting & Invoices**
  - Extend Ordering into Accounting via a document model linked to Order.

- **Taxes / Discounts / Promotions**
  - Add pricing rules at the Pricing layer while keeping Order aggregate root stable.

- **Loyalty & Notifications**
  - Support optional cross-context integrations for customer loyalty and messaging.

- **Multi-language & localization**
  - Since product names/descriptions are text-based, introduce localization mapping later.

- **Analytics & Reports**
  - Build read models from existing entities.

- **AI**
  - Use read-only projections of Product nutrition and Order history for recommendations.

## Technical Debt (from schema observations)
1. **Schema drift: `produce` vs `products`**
   - Two different schemas describe product concepts with different column sets and types.
   - Risk: code may expect one name/shape while DB contains the other.

2. **Order line items stored as JSON**
   - `orders.products_json JSON` replaces normalized order-item table.
   - Risk: reporting and data integrity constraints are weaker.

3. **No explicit constraints on JSON structure**
   - No CHECK/validation for `products_json` content.

4. **Delivery fulfillment modeling is partial**
   - `locations` includes geo/radius but `orders` does not reference a chosen `location_id`.
   - Risk: fulfillment traceability is limited.

## Recommendations (Non-executable, documentation only)
- Establish a **single authoritative product table** naming and columns (resolve `produce` vs `products` divergence).
- Keep Order aggregate root as-is for now, but define a strict JSON contract for `products_json` in documentation for consistency.
- Document logistics selection logic: how `locations` is chosen for an order (likely in code), then formalize it as a domain rule in the Logistics context.

## Enterprise Roadmap
1. **Catalog & Products**
2. **Customers & Users**
3. **Ordering**
4. **Logistics / Locations**
5. **Purchases & Suppliers**
6. **Inventory / Stock**
7. **Accounting / Invoices / Payments**
8. **Returns / Refunds**
9. **Promotions / Taxes / Discounts**
10. **Reports / Notifications / AI**

## End State (Readiness for Repository Layer later)
After this phase, the team can implement Repository/Service layers confidently by mapping:
- Catalog repository over Product table(s)
- Customers repository over users
- Orders repository over orders (including JSON contract for order lines)
- Locations repository over locations

No SQL, no business logic, and no code was changed in this sprint.

