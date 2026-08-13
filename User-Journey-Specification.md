# Green Store Enterprise v2 — User Journey Specification

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Target Personas:** Customer (Storefront/Mobile), Fulfillment Staff, Operations Manager, System Administrator  
> **Scope:** End-to-End Swimlane Journeys, System Touchpoints, State Transitions & Security Audits  

---

## 1. Executive Persona Overview

Green Store Enterprise v2 supports 4 primary user archetypes:

1. **Customer Persona (Storefront / Mobile App User):**
   - Goal: Frictionless product discovery, shopping cart management, geo-located address selection, order placement, and real-time status tracking.
2. **Order Fulfillment Manager Persona (Store & Warehouse Staff):**
   - Goal: Rapid processing of incoming orders, stock picking verification, packing label printing, status updates (`pending` ➔ `preparing` ➔ `delivering` ➔ `delivered`), and inventory adjustment.
3. **Store / Inventory Manager Persona (Operations Lead):**
   - Goal: Stock replenishment, price adjustments, supplier management, discount rule configuration, sales analytics monitoring, and product catalog management.
4. **System Administrator Persona (IT & Governance Officer):**
   - Goal: User account provisioning, RBAC role definition, security audit log inspection, system health monitoring, backups, and internationalization configuration.

---

## 2. Customer Order Journey Swimlane Diagram

```
[CUSTOMER / FRONTEND]          [VALIDATION & GATEWAY]           [ORDER SERVICE & DB]            [FULFILLMENT & WMS]
         │                               │                               │                               │
 1. Browse Catalog                       │                               │                               │
    & Select Items ─────────────────────►│                               │                               │
         │                               │                               │                               │
 2. Add to Cart &                        │                               │                               │
    Proceed to Checkout ────────────────►│                               │                               │
         │                               │                               │                               │
 3. Enter Shipping                       │ 4. Validate Address           │                               │
    Address (`lat`/`lng`) ──────────────►│    & Delivery Radius ─────────►│                               │
         │                               │                               │                               │
 5. Confirm Order &                      │ 6. Validate Payload Schema    │ 7. Begin DB Transaction       │
    Submit Payment Request ─────────────►│    (`Validation::validate`) ──►│    • Calculate Total          │
         │                               │                               │    • Verify Product Stock     │
         │                               │                               │    • Insert `orders` Row      │
         │                               │                               │    • Commit Transaction ──────► 8. Push Order Alert
         │                               │                               │                                  to Control Room
 9. Receive Order Confirmation ◄─────────┼───────────────────────────────┼──────────────────────────────────┤   [SCR-02]
    with Order ID & QR Code              │                               │                               │
```

---

## 3. Order Fulfillment Manager Journey

### 3.1 Step-by-Step Operational Workflow
1. **Trigger Alert & Order Queue Reception (`SCR-02` / `SCR-09`):**
   - Audio chime triggers on the Fulfillment Dashboard upon new order arrival (`orders.status = 'pending'`).
   - Order card displays customer snapshot, items list, delivery address, and delivery urgency level.
2. **Order Acceptance & Stock Locking (`SCR-10`):**
   - Manager clicks `[Accept & Begin Preparing]`.
   - System updates order status to `preparing` via `OrderService`. Stock units are reserved in inventory.
3. **Pick & Pack Slip Generation (`SCR-11`):**
   - Manager clicks `[Print Pick List & Label]`.
   - System generates physical packing list with barcode/QR code for warehouse picker.
4. **Dispatch Assignment & Status Update:**
   - Package is handed to courier driver. Manager clicks `[Dispatch for Delivery]`.
   - Order status transitions to `delivering`. SMS/Email notification dispatched to customer.
5. **Proof of Delivery & Order Closure:**
   - Courier submits digital signature or location confirmation. Status updates to `delivered`.

---

## 4. Store Manager Inventory & Catalog Journey

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Low Stock Alert Triggered                                                      │
│ • System detects product inventory < safety reorder threshold (`SCR-21`).              │
│ • Automated notification badge appears in Manager Sidebar (`Inventory [Badge: 4 Low]`).│
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Reorder & Stock Adjustment Workflow                                           │
│ • Manager opens Stock Transfer & Adjustment Wizard (`SCR-20`).                          │
│ • Selects target Warehouse location (`locations.id`) and inputs incoming batch count.  │
│ • Unit cost and supplier invoice reference attached to transaction.                    │
└───────────────────────────────────┬────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Catalog Price & Promotion Update                                               │
│ • Manager opens Price Book & Discount Matrix (`SCR-08`).                               │
│ • Applies 10% promotional discount to Category "Fresh Fruits" (`products.type`).      │
│ • Changes take effect instantly; audit event logged in `SCR-33`.                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. System Administrator Governance & Security Journey

### 5.1 RBAC Provisioning & Audit Flow
1. **Staff Onboarding (`SCR-31`):**
   - Administrator creates user account for new employee (`users.email`, `users.username`).
   - Selects initial security role (e.g., `Fulfillment Specialist`).
2. **Granular Permission Mapping (`SCR-32`):**
   - Administrator opens Role Matrix. Assigns specific access nodes:
     - `orders.view` = ✅ ALLOW
     - `orders.update_status` = ✅ ALLOW
     - `orders.delete` = ❌ DENY
     - `financials.view_revenue` = ❌ DENY
3. **Security Audit & Incident Inspection (`SCR-33` / `SCR-34`):**
   - Security alarm flags an attempted deletion of an order payload.
   - Administrator opens **Immutable Audit Trail Viewer (`SCR-33`)**.
   - Inspects exact IP address, timestamp, staff ID, and before/after diff payload.
   - Admin clicks `[Revoke Active Session]` in `SCR-34` to immediately lock out compromised user.

---
*Certified for Green Store Enterprise v2 User Journey Baseline.*
