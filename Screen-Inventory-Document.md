# Green Store Enterprise v2 — Screen Inventory & Gap Analysis Document

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Module Scope:** All 11 Enterprise Domains (Catalog, Orders, Customers, Inventory, Employees, Reports, Analytics, Security, Settings, System, AI/POS)  
> **Total Screen Count:** 42 High-Density Enterprise Screens  

---

## 1. Executive Summary & Gap Analysis Matrix

Green Store Enterprise v1.0 established core transactional foundations for Products, Categories, Customers, Shopping Cart, and Orders. Version 2 expands this base into a full-scale Enterprise Suite by introducing 42 distinct screens across 11 functional domains.

### 1.1 Module Gap Summary Matrix

| Domain Area | v1.0 Baseline Status | v2 Required Enterprise Additions | Priority |
|---|---|---|---|
| **Executive Overview** | None (Raw JSON API endpoints) | Executive Dashboard, Operational Control Room, Real-Time Activity Feed | **CRITICAL** |
| **Catalog & Products** | Basic Product & Category CRUD | Product Variants, Batch Upload, Barcode/QR Manager, Price Books | **HIGH** |
| **Orders & Fulfillment** | `save_order.php` API endpoint | Order Control Center, Fulfillment Pick-List, Order Detail Drawer, Return Management | **CRITICAL** |
| **Customers & CRM** | Baseline Customer & Address APIs | Customer 360° Profile, Customer Segmentation, Address Book Manager | **HIGH** |
| **Inventory & WMS** | No UI / Raw JSON data | Stock Levels Grid, Stock Transfer Workflow, Warehouses, Low-Stock Alert Center | **CRITICAL** |
| **Employees & HRM** | No UI | Staff Directory, Role Assignment, Staff Activity Monitor | **MEDIUM** |
| **Reports & BI** | No UI | Sales Analytics, Stock Valuation, Profit & Loss Engine, PDF/Excel Exporter | **HIGH** |
| **Security & Access** | Basic Auth stubs | User Management, Granular RBAC Matrix, Security Audit Trail, Session Monitor | **CRITICAL** |
| **System Settings** | `.env` static configuration | Store Profile, Multi-Currency, Tax Matrix, Logistics/Shipping Setup, Backups | **HIGH** |
| **System Health** | None | System Log Viewer, Database Latency Monitor, Maintenance Controls | **MEDIUM** |
| **Future Modules** | None | POS Terminal View, AI Inventory Forecaster, Mobile Scanner Touchpoint | **FUTURE-READY** |

---

## 2. Comprehensive 42-Screen Inventory Index

Below is the complete inventory of all 42 screens designed for Green Store Enterprise v2:

### Domain 1: Dashboards & Executive Control (3 Screens)
- `SCR-01`: **Executive Command Dashboard** — Real-time KPIs, Sales charts, Top products, AI suggestions.
- `SCR-02`: **Fulfillment Operational Control Room** — Live queue of pending, preparing, and dispatched orders.
- `SCR-03`: **Real-Time Operational Activity Feed** — Live event stream of orders, user actions, stock movements.

### Domain 2: Product Catalog & Merchandising (5 Screens)
- `SCR-04`: **Master Products Catalog Grid** — High-density product listing with batch operations, quick filters, and status toggles.
- `SCR-05`: **Product Details & Variant Editor** — Deep editor for SKU, prices, nutrition profile, images, and barcodes.
- `SCR-06`: **Category Hierarchy Manager** — Drag-and-drop tree layout for category nesting and slug assignment.
- `SCR-07`: **Bulk Product Import & Export Center** — Wizard for CSV/Excel data mapping and batch validation.
- `SCR-08`: **Price Book & Discount Matrix Manager** — Rules editor for promotional pricing, customer group tiers, and bulk discounts.

### Domain 3: Orders & Fulfillment Operations (5 Screens)
- `SCR-09`: **Order Master Control Grid** — Comprehensive order queue with multi-criteria filtering (Status, Date, Total, Payment).
- `SCR-10`: **Order Detail 360° Inspector** — Detailed view of customer snapshot, items list, payment verification, address map.
- `SCR-11`: **Fulfillment & Packing Slip Printer** — Printable pick-list, packing slips, and delivery labels with QR codes.
- `SCR-12`: **Returns & Refund Processing Center** — Workflow screen for managing returned products, restocking, and credit notes.
- `SCR-13`: **Abandoned Cart Recovery Board** — Board tracking active/abandoned carts with customer contact options.

### Domain 4: Customers & CRM (4 Screens)
- `SCR-14`: **Customer Master Directory** — Searchable table of customer accounts with LTV badges, contact info, and status.
- `SCR-15`: **Customer 360° Profile & Order History** — Unified view of customer purchasing habits, addresses, and tickets.
- `SCR-16`: **Customer Address Book Manager** — Management grid for delivery locations, geolocation coordinates (`lat`/`lng`).
- `SCR-17`: **Customer Segmentation & Tiers** — Grouping tool for VIP, Wholesale, Retail, and Inactive customer segments.

### Domain 5: Inventory & Warehouse Management (WMS) (5 Screens)
- `SCR-18`: **Stock Levels & Valuation Master Grid** — Real-time inventory levels across all locations with unit cost valuations.
- `SCR-19`: **Warehouse & Store Location Manager** — Setup screen for stores, fulfillment centers, and storage bins.
- `SCR-20`: **Stock Transfer & Adjustment Workflow** — Multi-step wizard for moving stock between warehouses or adjusting counts.
- `SCR-21`: **Low Stock & Reorder Alert Board** — Emergency board highlighting items below safety threshold with automated purchase orders.
- `SCR-22`: **Barcode & QR Code Print Utility** — Label generator for shelf barcodes, SKU stickers, and item labels.

### Domain 6: Human Resources & Employee Management (3 Screens)
- `SCR-23`: **Staff & Employee Directory** — Directory of store employees, shift allocations, and assigned roles.
- `SCR-24`: **Employee Profile & Permissions Detail** — Individual staff configuration screen with security group assignments.
- `SCR-25`: **Employee Activity & Audit Monitor** — Detailed log tracking actions taken by specific staff members.

### Domain 7: Business Intelligence & Enterprise Reporting (5 Screens)
- `SCR-26`: **Sales Performance & Revenue Analytics** — Deep financial reports with daily/monthly breakdowns and channel metrics.
- `SCR-27`: **Product Velocity & ABC Analysis Report** — Categorization report classifying top revenue drivers vs slow-moving stock.
- `SCR-28`: **Inventory Valuation & Shrinkage Report** — Accounting report detailing stock monetary value and inventory loss.
- `SCR-29`: **Customer Lifetime Value & Cohort Analysis** — Analytics tool mapping retention, churn, and repurchase rates.
- `SCR-30`: **Custom Report Builder & Exporter** — Query builder for exporting customized CSV/PDF financial summaries.

### Domain 8: Enterprise Security & Access Control (5 Screens)
- `SCR-31`: **User Account Management Center** — Administration screen for creating, suspending, and credentials reset.
- `SCR-32`: **RBAC Role & Permission Matrix Editor** — Matrix grid matching roles (Admin, Manager, Fulfillment, Cashier) to granular permission nodes.
- `SCR-33`: **Immutable Audit Trail Viewer** — High-security log viewer with diff-inspector showing exact before/after data modifications.
- `SCR-34`: **Active Session & Security Monitor** — Real-time dashboard showing active user sessions, IP locations, and session termination buttons.
- `SCR-35`: **API Key & Integration Access Credentials** — Key management portal for external system integrations and mobile apps.

### Domain 9: System Settings & Administration (4 Screens)
- `SCR-36`: **General Store Profile & Branding Settings** — Configurator for store details, logos, operational hours, and contact details.
- `SCR-37`: **Tax Rules & Financial Localization Matrix** — Rules engine for VAT/Sales tax rates per category or geographic zone.
- `SCR-38`: **Logistics, Delivery Zones & Radius Settings** — Interactive map interface for setting delivery radius (`radius_km`) and fees.
- `SCR-39`: **Multi-Currency & Internationalization Configurator** — Currency rate manager (YER, USD, SAR) and default language toggles.

### Domain 10: System Health & Maintenance (3 Screens)
- `SCR-40`: **System Log Viewer & Exception Inspector** — Technical viewer for error logs (`storage/logs`), API execution times, and stack traces.
- `SCR-41`: **Automated Backup & Database Maintenance Center** — Backup scheduler, manual snapshot generator, and database optimization tools.
- `SCR-42`: **System Maintenance & Feature Toggle Control** — Maintenance mode toggles and feature flag deployment manager.

---

## 3. Screen Inter-Dependency & Navigation Graph

```
                                  [SCR-01: Executive Dashboard]
                                                │
         ┌───────────────────┬──────────────────┼───────────────────┬───────────────────┐
         │                   │                  │                   │                   │
  [SCR-04: Products]  [SCR-09: Orders]   [SCR-14: Customers] [SCR-18: Stock]  [SCR-31: Security]
         │                   │                  │                   │                   │
  [SCR-05: Product]   [SCR-10: Order]    [SCR-15: Customer]  [SCR-20: Transfer] [SCR-32: RBAC Matrix]
  Detail Editor       360° Inspector     360° Profile        Workflow Board      & Audit Log
```

---
*Certified for Green Store Enterprise v2 Screen Inventory Baseline.*
