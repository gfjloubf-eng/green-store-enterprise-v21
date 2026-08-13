# Green Store Enterprise v2 — Navigation Architecture Specification

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Target System:** Navigation Engine, Global Search, Topbar, Sidebar & Keyboard Shortcut System  
> **Compliance:** Enterprise Standards (SAP Fiori, Microsoft Dynamics Navigation, Odoo UI)  

---

## 1. Top Bar Navigation Architecture

The Top Bar is a persistent 64px header anchored at the top of the interface. It serves as the primary system control hub.

```
+-------------------------------------------------------------------------------------------------------------------+
| [≡] GREEN STORE  | 🔍 Search or Jump to (Ctrl+K)  | ⚡ Quick Create v | 🔔 Alerts (3) | 🌐 EN/AR | 👤 Admin Profile v |
+-------------------------------------------------------------------------------------------------------------------+
```

### 1.1 Top Bar Structural Breakdown
1. **Sidebar Collapse Toggle (`[≡]`):** Toggles sidebar between Expanded Mode (260px width) and Compact Icon-Only Mode (64px width).
2. **Enterprise Brand & Branch Indicator:** Displays logo, system version (`v2.0-Enterprise`), and active store location selector.
3. **Global Search Input (`Ctrl+K` Command Palette Trigger):** Omnibox searching across products, orders, customers, and system settings simultaneously.
4. **Quick Action Dropdown (`+` / `⚡` Button):** Instant creation trigger with single-click access to:
   - `+ New Product`
   - `+ Create Manual Order`
   - `+ Add Customer`
   - `+ Record Stock Adjustment`
   - `+ Create User Account`
5. **Notification & Alert Bell (`🔔`):** Live drawer showing real-time operational alerts (Low stock warnings, pending orders, security audit exceptions).
6. **Language & Currency Switcher (`🌐`):** Instant toggle between Arabic (`AR-YER`) and English (`EN-USD`).
7. **User Profile & RBAC Menu (`👤`):** Displays active user avatar, full name, role badge (`Super Admin`), Session expiry countdown, Dark/Light Mode toggle, and Logout action.

---

## 2. Global Command Palette & Search (`Ctrl+K`) Architecture

Pressing `Ctrl+K` (or `Cmd+K` on macOS) opens a centered modal overlay allowing keyboard-driven navigation across the entire enterprise system.

```
+-----------------------------------------------------------------------------------+
| 🔍  Type a command, customer name, SKU, or order ID...                    [ESC]   |
+-----------------------------------------------------------------------------------+
|  RECENT SEARCHES                                                                  |
|   • Order #1042 - Customer: Ahmed Al-Mansoor ($145.00)                             |
|   • Product SKU: PROD-AVO-001 (Organic Avocado)                                   |
|                                                                                   |
|  NAVIGATION SHORTCUTS                                                             |
|   ➔ Go to Executive Dashboard                                            [Shift+D] |
|   ➔ Go to Products Master Grid                                           [Shift+P] |
|   ➔ Go to Orders Control Center                                          [Shift+O] |
|   ➔ Go to Inventory Stock Levels                                         [Shift+I] |
|                                                                                   |
|  SYSTEM COMMANDS                                                                  |
|   ⚙ Open Security Audit Trail Viewer                                             |
|   💾 Trigger Automated Database Snapshot                                          |
+-----------------------------------------------------------------------------------+
```

---

## 3. Sidebar Navigation Hierarchy & Grouping

The Sidebar is organized into 10 logical enterprise groups. Every item includes an icon, title, keyboard navigation key, optional live badge counter, and RBAC permission requirement node.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ MAIN NAVIGATION MENU                                                             │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ 📊 DASHBOARDS                                                                    │
│   ├── Executive Command Center                           [SCR-01] (Perm: dash.exec)│
│   ├── Fulfillment Control Room       [Badge: 12 Pending] [SCR-02] (Perm: dash.ful) │
│   └── Real-Time Activity Feed                            [SCR-03] (Perm: dash.feed)│
│                                                                                  │
│ 📦 CATALOG MANAGEMENT                                                            │
│   ├── Products Master Grid               [Badge: 1,420]  [SCR-04] (Perm: prod.view)│
│   ├── Product Details & Variants                         [SCR-05] (Perm: prod.edit)│
│   ├── Category Hierarchy Manager                         [SCR-06] (Perm: cat.manage│
│   ├── Bulk Import & Export Center                        [SCR-07] (Perm: prod.imp) │
│   └── Price Books & Discount Matrix                      [SCR-08] (Perm: price.mgr)│
│                                                                                  │
│ 🛒 ORDERS & FULFILLMENT                                                          │
│   ├── Order Master Control Grid          [Badge: 24 New] [SCR-09] (Perm: ord.view) │
│   ├── Order Detail Inspector                             [SCR-10] (Perm: ord.view) │
│   ├── Packing & Dispatch Printer                         [SCR-11] (Perm: ord.print)│
│   ├── Returns & Refund Center            [Badge: 3 Req]  [SCR-12] (Perm: ret.mgr) │
│   └── Abandoned Cart Recovery Board      [Badge: 18]     [SCR-13] (Perm: cart.view)│
│                                                                                  │
│ 👥 CUSTOMERS & CRM                                                               │
│   ├── Customer Directory                 [Badge: 890]    [SCR-14] (Perm: cust.view)│
│   ├── Customer 360° Profile View                         [SCR-15] (Perm: cust.view)│
│   ├── Address Book Manager                               [SCR-16] (Perm: addr.mgr) │
│   └── Customer Segmentation Board                        [SCR-17] (Perm: cust.seg) │
│                                                                                  │
│ 🏭 INVENTORY & WMS                                                               │
│   ├── Stock Levels & Valuation           [Badge: 4 Low]  [SCR-18] (Perm: inv.view) │
│   ├── Warehouse & Store Locations                        [SCR-19] (Perm: wh.mgr)   │
│   ├── Stock Transfer & Adjustment                        [SCR-20] (Perm: inv.xfer) │
│   ├── Low Stock & Reorder Board          [Badge: CRITICAL][SCR-21] (Perm: inv.reord)│
│   └── Barcode & QR Label Printing                        [SCR-22] (Perm: inv.print)│
│                                                                                  │
│ 👨‍💼 HUMAN RESOURCES & STAFF                                                        │
│   ├── Staff Directory                                    [SCR-23] (Perm: staff.view│
│   ├── Employee Profile & Roles                           [SCR-24] (Perm: staff.mgr)│
│   └── Staff Audit & Activity                             [SCR-25] (Perm: staff.aud)│
│                                                                                  │
│ 📈 BUSINESS INTELLIGENCE & REPORTS                                               │
│   ├── Sales Performance & Revenue                        [SCR-26] (Perm: rep.sales)│
│   ├── Product Velocity & ABC Analysis                    [SCR-27] (Perm: rep.prod) │
│   ├── Inventory Valuation & Loss                         [SCR-28] (Perm: rep.inv)  │
│   ├── Customer Lifetime Value (CLV)                      [SCR-29] (Perm: rep.cust) │
│   └── Custom Report Builder                              [SCR-30] (Perm: rep.bld)  │
│                                                                                  │
│ 🔒 SECURITY & ACCESS CONTROL                                                     │
│   ├── User Accounts Management                           [SCR-31] (Perm: sec.users)│
│   ├── RBAC Role & Permission Matrix                      [SCR-32] (Perm: sec.rbac) │
│   ├── Immutable Audit Trail Viewer                       [SCR-33] (Perm: sec.audit)│
│   ├── Active Sessions & Security                         [SCR-34] (Perm: sec.sess) │
│   └── API Keys & Integration                             [SCR-35] (Perm: sec.keys) │
│                                                                                  │
│ ⚙ SYSTEM SETTINGS                                                                │
│   ├── General Store Profile                              [SCR-36] (Perm: set.gen)  │
│   ├── Tax Matrix & Financials                            [SCR-37] (Perm: set.tax)  │
│   ├── Logistics & Delivery Zones                         [SCR-38] (Perm: set.log)  │
│   └── Multi-Currency & Languages                         [SCR-39] (Perm: set.i18n) │
│                                                                                  │
│ 🛠 SYSTEM HEALTH & MAINTENANCE                                                    │
│   ├── System Log Viewer                                  [SCR-40] (Perm: sys.logs) │
│   ├── Automated Backups & Maintenance                    [SCR-41] (Perm: sys.bak)  │
│   └── Maintenance Mode & Flags                           [SCR-42] (Perm: sys.maint)│
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Dynamic Breadcrumb & Location Context Architecture

Located immediately below the Top Bar, the Breadcrumb component displays exact location context and permits instant hierarchy jumps.

### 4.1 Breadcrumb Syntax Standard
`Home Icon / [Module Group] / [Entity Name] / [Specific Item Identifier or Sub-Action]`

#### Examples:
- **Product Editing:** `🏠 Home / Catalog Management / Products / PROD-AVO-001 (Organic Avocado) / Edit`
- **Fulfillment Inspector:** `🏠 Home / Orders & Fulfillment / Orders Queue / Order #1042 / Packing Slip`
- **Audit Log Inspection:** `🏠 Home / Security & Access / Audit Trail / Transaction #88412-AUD`

---
*Certified for Green Store Enterprise v2 Navigation Specification Baseline.*
