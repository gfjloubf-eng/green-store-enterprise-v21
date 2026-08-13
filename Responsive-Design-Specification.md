# GSD v1.0 — Responsive Design Specification

> **Document Status:** OFFICIAL DESIGN SYSTEM SPECIFICATION  
> **Breakpoints:** 4K Desktop (1920px+), Laptop (1280px), Tablet (768px), Mobile (375px)  
> **Layout Grid:** 12-Column Responsive Flex Container with Fluid Spacing  

---

## 1. Enterprise Responsive Breakpoints Matrix

GSDS v1.0 defines 5 standardized responsive breakpoints:

```
+-------------------------------------------------------------------------------------------------------------------+
| GSDS v1.0 RESPONSIVE BREAKPOINTS TABLE                                                                            |
+-------------------------------------------------------------------------------------------------------------------+
| BREAKPOINT ALIAS | MIN WIDTH  | TARGET DEVICES                                | GRID COLS | GUTTER | MARGIN   |
|------------------+------------+-----------------------------------------------+-----------+--------+----------|
| `xs` (Mobile)    | 320px      | Smartphones (Portrait), Handheld POS Scanners | 4         | 12px   | 16px     |
| `sm` (Tablet PH) | 576px      | Large Phones, Small Tablets                   | 6         | 16px   | 20px     |
| `md` (Tablet)    | 768px      | Tablets (Portrait), Warehouse Touchscreens    | 8         | 20px   | 24px     |
| `lg` (Laptop)    | 1024px     | Standard Laptops, Tablets (Landscape)         | 12        | 24px   | 32px     |
| `xl` (Desktop)   | 1440px+    | Enterprise Monitors, 4K Control Displays      | 12        | 24px   | 40px     |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Layout Grid Adaptation Rules

### 2.1 4K & Desktop Displays (`>= 1440px`)
- **Sidebar:** Expanded Mode (260px fixed width).
- **Workspace Panel:** Dual-pane layout featuring main high-density grid table + right-side slide-over inspector card.
- **KPI Cards Row:** 4 to 5 cards displayed side-by-side in a single row.

### 2.2 Laptop Displays (`1024px - 1439px`)
- **Sidebar:** Collapsible Mode (260px expanded / 64px compact icon-only toggle).
- **Workspace Panel:** Single main grid pane; inspector slides over page content.
- **KPI Cards Row:** 4 cards in a 2x2 grid layout.

### 2.3 Tablet Displays (`768px - 1023px`) — POS & Warehouse View
- **Sidebar:** Hidden behind off-canvas drawer triggered by TopBar hamburger menu (`≡`).
- **Workspace Panel:** High-density data table transforms to responsive cards or scrolling horizontal table.
- **Touch Optimization:** Interactive buttons and table row heights scale up to **44px minimum touch target height**.

### 2.4 Mobile Displays (`< 768px`) — Handheld Scanner View
- **TopBar:** Compact header featuring logo, global search icon, alert badge, and mobile drawer trigger.
- **Navigation:** Bottom Navigation Bar providing one-thumb access to: `Dashboard`, `Orders`, `Scan QR`, `Inventory`, `Profile`.
- **Form Drawers:** Slide-over drawers transform to 100% full-screen modal overlays.

---

## 3. Touch Target & Accessibility Guidelines for Mobile/POS

1. **Minimum Touch Target Size:** On viewports `< 1024px`, all interactive elements (buttons, checkboxes, table action icons) MUST enforce a minimum touch target area of **44px x 44px**.
2. **Horizontal Table Scrolling:** On small screens, high-density data tables enforce sticky key columns (e.g., SKU/ID and Actions column) while permitting smooth horizontal scrolling for middle columns.

---
*Certified for GSD v1.0 Responsive Design Specification Baseline.*
