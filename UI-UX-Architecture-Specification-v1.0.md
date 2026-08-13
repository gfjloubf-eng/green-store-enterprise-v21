# Green Store Enterprise v2 — Master UI/UX Architecture Specification (v1.0)

> **Document Status:** OFFICIAL DESIGN BIBLE & SINGLE SOURCE OF TRUTH  
> **Target Audience:** Product Managers, Enterprise Architects, UI/UX Lead Engineers, System Integrators  
> **Scope:** Enterprise-Wide UI/UX System Architecture for Green Store Enterprise v2  
> **Code Policy:** 100% Code-Free — Conceptual, Structural, and Visual System Architecture Specification  

---

## 1. Executive Summary & Design Vision

### 1.1 Vision Statement
Green Store Enterprise v2 represents the evolution of Green Store from a baseline commerce engine into a multi-channel, enterprise-grade Resource Planning and Commercial Management System (ERP/CRM/WMS). The UI/UX architecture established herein is inspired by leading global enterprise systems—such as **Microsoft Dynamics 365, SAP S/4HANA Fiori, Oracle NetSuite, and Odoo Enterprise**—blended with modern web and mobile SaaS usability paradigms.

### 1.2 Core Architectural Principles
1. **Separation of Interface & Logic:** The UI/UX architecture is completely decoupled from underlying backend APIs. All screens consume standardized REST/GraphQL endpoints defined in the Foundation layer (`App\Services\*`, `App\Core\Response`).
2. **High Information Density & Efficiency:** Interfaces are designed for speed, operational clarity, and minimal cognitive load, prioritizing keyboard navigation, rapid data entry, and multi-tab workflows.
3. **Strict Role-Based Access Control (RBAC):** Every UI element (menus, action buttons, table columns, drawer actions, metric cards) enforces visible/interactive states mapped to granular permissions.
4. **Adaptive Multi-Form-Factor Layouts:** A unified design system accommodating 4K desktop displays, standard laptops, tablets (point-of-sale/warehouse devices), and handheld mobile devices.
5. **Future-Proof Extensibility:** Native architectural placeholders embedded for AI Assistants, Barcode/QR Scanning workflows, POS terminals, and multi-warehouse operations.

---

## 2. Global Enterprise Design System Architecture

### 2.1 Design Tokens & Structural Foundation
The interface is constructed using a modern, scalable design token architecture:

- **Typography System:**
  - Font Family: Inter / IBM Plex Sans (Primary), JetBrains Mono (Financials, SKUs, Timestamps, System Logs).
  - Scale: Display (32px), Heading 1 (24px), Heading 2 (20px), Subheading (16px), Body (14px), Caption/Label (12px), Micro (10px).
- **Color Palette & Semantic Tokens:**
  - Primary Enterprise Brand: Deep Forest Emerald (`#0F5132` / `#198754`), Slate Blue Accent (`#0D6EFD`).
  - Neutral Scale: Charcoal Dark Surface (`#121824`), Dark Card Background (`#1E2738`), Border Gray (`#344054`), Neutral Canvas (`#F8F9FA`).
  - Semantic Status Tokens:
    - Success / Active / Approved: Emerald (`#10B981`)
    - Warning / Pending / Low Stock: Amber (`#F59E0B`)
    - Error / Canceled / Critical: Crimson (`#EF4444`)
    - Info / Processing / Draft: Sapphire (`#3B82F6`)
    - Neutral / Archived / Offline: Steel (`#6B7280`)
- **Layout Grid & Spacing Scale:**
  - 12-column dynamic flex container with 24px gutters.
  - Spacing Units: 4px, 8px, 12px, 16px, 24px, 32px, 48px.
  - Card Elevation & Glassmorphism: Subtle 1px borders with low-blur backdrop filters for elevated panels.

---

## 3. Global Information Architecture & Framework Layout

The application window is structured into 4 persistent, highly responsive regions:

```
+---------------------------------------------------------------------------------------------------------+
| [TopBar] Logo | Global Search (Ctrl+K) | Quick Action (+) | AI Assistant | Notifications | User Profile |
+---------------------------------------------------------------------------------------------------------+
| [Sidebar]     | [Breadcrumb Bar] Home > Catalog > Products > Product #1042                             |
|               +-----------------------------------------------------------------------------------------+
| Dashboard     | [Page Header] Product Details: Organic Avocado                            [Edit] [Delete]|
| Catalog       +-----------------------------------------------------------------------------------------+
| Orders        | [Main Content Area]                                                                     |
| Customers     |   +---------------------------------------+  +--------------------------------------+   |
| Inventory     |   | Primary Data Form / High-Density Table |  | Side Inspector / Metric Cards Panel  |   |
| Reports       |   |                                       |  |                                      |   |
| Employees     |   +---------------------------------------+  +--------------------------------------+   |
| Security      |                                                                                         |
| Settings      |                                                                                         |
+---------------+-----------------------------------------------------------------------------------------+
| [StatusBar] System Status: Online | Database: Connected | API Response: 14ms | Active User: Admin       |
+---------------------------------------------------------------------------------------------------------+
```

### 3.1 Region Specifications
1. **Top Navigation Bar:** Persistent header managing system-level actions, tenant context, global command palette (`Ctrl+K`), live notification drawer, and user profile switch.
2. **Collapsible Enterprise Sidebar:** Navigation tree organizing all functional domains into logical collapsible groups with badge counters (e.g., Pending Orders count, Low Stock alert count).
3. **Dynamic Workspace Panel:** Core content container featuring standardized Page Headers, Action Toolbars, Breadcrumbs, Tab Controls, and high-density Data Grids.
4. **System Status Bar:** Operational footer displaying environment status, real-time WebSocket connection state, database latency, and active session role.

---

## 4. Cross-Cutting Screen State Architecture

Every screen throughout Green Store Enterprise v2 MUST explicitly implement 5 standard operational states:

1. **Loading State:**
   - Animated skeletal placeholders matching the exact card/grid layout of the target screen.
   - Prevents layout shifting during asynchronous data fetching.
2. **Success / Data State:**
   - Fully populated interface with interactive tables, KPI cards, actions, and filters.
3. **Empty State:**
   - Vector illustration relevant to the domain.
   - Clear explanatory message (e.g., *"No products found matching your active filter criteria"*).
   - Direct Call-to-Action (CTA) button (e.g., `+ Add New Product` or `Reset Filters`).
4. **Error State:**
   - Non-intrusive alert notification card displaying standard error response envelopes (`code`, `message`, `correlation_id`).
   - Action buttons: `Retry Action`, `Contact System Admin`, or `Copy Error Payload`.
5. **Permission Denied State (RBAC Violation):**
   - Locked shield graphic displaying the exact missing permission node (e.g., `Requires: catalog.products.delete`).
   - Option to send an automated access request notification to System Administrator.

---

## 5. Enterprise Core Module Map & Architectural Blueprint

Green Store Enterprise v2 builds upon the 5 frozen v1.0 core modules and extends the application into 11 Enterprise Context Domains:

```
                               ┌────────────────────────────────────────┐
                               │   Green Store Enterprise v2 Core Map   │
                               └──────────────────┬─────────────────────┘
                                                  │
         ┌────────────────────────┬───────────────┴───────────────┬────────────────────────┐
         │                        │                               │                        │
┌────────┴─────────┐    ┌─────────┴────────┐            ┌─────────┴────────┐    ┌──────────┴─────────┐
│ Catalog Domain   │    │ Commerce Domain  │            │ Supply Chain     │    │ Governance Domain  │
├──────────────────┤    ├──────────────────┤            ├──────────────────┤    ├────────────────────┤
│ • Products       │    │ • Orders (v1)    │            │ • Multi-Warehouse│    │ • User Accounts    │
│ • Categories     │    │ • Shopping Cart  │            │ • Stock Control  │    │ • Roles & RBAC     │
│ • Attributes     │    │ • Customers (v1) │            │ • Stock Transfer │    │ • Audit Trail      │
│ • Pricing Rules  │    │ • Checkout Flow  │            │ • Suppliers      │    │ • System Logs      │
└──────────────────┘    └──────────────────┘            └──────────────────┘    └────────────────────┘
         │                        │                               │                        │
         └────────────────────────┼───────────────────────────────┴────────────────────────┘
                                  │
                       ┌──────────┴───────────┐
                       │ Administration Domain│
                       ├──────────────────────┤
                       │ • Financial Reports  │
                       │ • System Settings    │
                       │ • POS / Mobile APIs  │
                       │ • AI Analytics Engine│
                       └──────────────────────┘
```

---

## 6. Official Document Suite Index

The Green Store Enterprise v2 Design Bible comprises 10 comprehensive sub-specifications:

1. **[UI-UX-Architecture-Specification-v1.0.md](file:///c:/xampp/htdocs/green_store/UI-UX-Architecture-Specification-v1.0.md)** (This Master Document)
2. **[Screen-Inventory-Document.md](file:///c:/xampp/htdocs/green_store/Screen-Inventory-Document.md)** — Detailed Audit & Gap Analysis of all 42 System Screens.
3. **[Navigation-Specification.md](file:///c:/xampp/htdocs/green_store/Navigation-Specification.md)** — Complete Sidebar, Topbar, Search & Command Palette Spec.
4. **[User-Journey-Specification.md](file:///c:/xampp/htdocs/green_store/User-Journey-Specification.md)** — Complete Customer, Staff, Manager & Admin Swimlane Journeys.
5. **[Dashboard-Specification.md](file:///c:/xampp/htdocs/green_store/Dashboard-Specification.md)** — Executive, Operational & Analytical Dashboard Architectures.
6. **[CRUD-Specification.md](file:///c:/xampp/htdocs/green_store/CRUD-Specification.md)** — Standardized Enterprise High-Density Grid & Form Architecture.
7. **[Security-UI-Specification.md](file:///c:/xampp/htdocs/green_store/Security-UI-Specification.md)** — RBAC Matrix, Security Audit, Sessions & Log Viewer UI.
8. **[Reporting-Specification.md](file:///c:/xampp/htdocs/green_store/Reporting-Specification.md)** — Financial, Sales, Stock & Performance BI Center.
9. **[Settings-Specification.md](file:///c:/xampp/htdocs/green_store/Settings-Specification.md)** — Store Administration, Localization, Tax, Backup & Maintenance UI.
10. **[Implementation-Roadmap.md](file:///c:/xampp/htdocs/green_store/Implementation-Roadmap.md)** — Phased Implementation & Future-Ready Tech Blueprint (AI, POS, Mobile, WMS).

---
*Certified for Green Store Enterprise v2 Architecture Baseline.*
