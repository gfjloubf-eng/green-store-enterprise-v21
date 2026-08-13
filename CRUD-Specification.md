# Green Store Enterprise v2 — CRUD Architecture Specification

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Target Standard:** Universal High-Density Enterprise Data Grids, Advanced Filter Drawers, & Form Modals  
> **Compliance:** High-Performance Administrative Workflows  

---

## 1. Universal CRUD Screen Blueprint

Every CRUD management screen across Green Store Enterprise v2 (e.g., `SCR-04` Products, `SCR-09` Orders, `SCR-14` Customers, `SCR-18` Stock, `SCR-31` Users) MUST strictly conform to the unified 5-zone layout:

```
+-------------------------------------------------------------------------------------------------------------------+
| [ZONE 1: PAGE HEADER & ACTION TOOLBAR]                                                                           |
| Page Title & Entity Icon  |  Summary Counters (e.g. 1,420 Items)  |  [+ Create New] [📥 Export v] [📤 Import v]    |
+-------------------------------------------------------------------------------------------------------------------+
| [ZONE 2: CONTROL & FILTER BAR]                                                                                    |
| 🔍 Quick Search (Name, SKU, ID...) | 🛠 Filter Preset: [All v] | 🎛 Advanced Filters | ⚙ View Columns | 🔄 Refresh |
+-------------------------------------------------------------------------------------------------------------------+
| [ZONE 3: EXPANDABLE ADVANCED FILTER DRAWER] (Hidden by default)                                                   |
| Category: [All Categories v] | Status: [Active v] | Price Range: [$0] to [$500] | Date Range: [Jan 1 - Jan 30]       |
| [Apply Filters] [Reset Filters]                                                                                  |
+-------------------------------------------------------------------------------------------------------------------+
| [ZONE 4: HIGH-DENSITY DATA TABLE GRID]                                                                            |
| [ ] | ID/SKU      | Image | Name / Title           | Category | Price / Total | Stock Level | Status  | Actions   |
|-----+-------------+-------+------------------------+----------+---------------+-------------+---------+-----------|
| [x] | PROD-AVO-01 | 🥑   | Organic Avocado        | Vegetables| $10.00 YER    | 150 (In Stock)| ACTIVE  | 👁 ✏ 🗑  |
| [ ] | PROD-TOM-02 | 🍅   | Red Fresh Tomatoes     | Vegetables| $4.50 YER     | 4 (Low Stock)| ACTIVE  | 👁 ✏ 🗑  |
+-------------------------------------------------------------------------------------------------------------------+
| [ZONE 5: BULK SELECTION BAR & PAGINATION FOOTER]                                                                  |
| [2 items selected] -> [Bulk Delete] [Bulk Category Update] [Export Selected]  | Showing 1-20 of 1,420 | < 1 2 3 ... 71 > |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Component Detailed Specifications

### 2.1 Zone 1: Page Header & Action Toolbar
- **Entity Title:** H1 Heading (20px bold) accompanied by domain icon.
- **Primary Call to Action (`+ Create New`):** Dominant Emerald Green button (`#10B981`) positioned at top right. Shortcut: `Alt+N`.
- **Secondary Actions:** `Import CSV` (opens file upload drawer), `Export Data` (dropdown options: CSV, Excel XLSX, PDF Report).

### 2.2 Zone 2 & 3: Search, Presets & Advanced Filter Panel
- **Global Search Field:** Real-time debounced search input (300ms delay). Matches partial strings across SKU, Name, Email, or Order ID.
- **Filter Presets:** Quick filter pill toggles (e.g., `[All Items]`, `[Active Only]`, `[Low Stock Alert]`, `[Drafts]`).
- **Advanced Filter Drawer:** Expandable multi-column filter form supporting range sliders, dropdown multi-selects, and date pickers.

### 2.3 Zone 4: High-Density Enterprise Data Table Grid
- **Checkbox Column:** Header master checkbox for "Select All Pages" / "Select Current Page".
- **Sortable Column Headers:** Clickable column titles displaying sort indicators (`▲` Ascending / `▼` Descending).
- **Sticky Actions Column:** Fixed rightmost column containing micro-buttons:
  - `👁 Quick View Inspector` (Opens Slide-over Drawer without changing page)
  - `✏ Edit Record` (Opens Modal/Drawer Form)
  - `🗑 Delete Record` (Triggers Confirmation Modal)

### 2.4 Zone 5: Bulk Actions & Server-Side Pagination Bar
- **Floating Bulk Action Bar:** Appears automatically when 1 or more row checkboxes are selected.
  - Available Bulk Operations: `Bulk Status Change`, `Assign Category`, `Print Barcodes`, `Export Selected`, `Batch Delete`.
- **Pagination Controls:** Items per page selector (`20`, `50`, `100`, `250`), Total records counter, Page navigation buttons with keyboard arrow bindings (`Left Arrow` / `Right Arrow`).

---

## 3. Standardized Form Drawer & Modal Architecture

Creating or editing records NEVER navigates away from the active grid context. All input workflows utilize a dual-pattern form drawer system:

```
+-----------------------------------------------------------------------+
| [SLIDE-OVER FORM DRAWER: EDIT PRODUCT #PROD-AVO-001]             [X]  |
+-----------------------------------------------------------------------+
| [TAB HEADER] 📝 Basic Details | 💰 Pricing & Tax | 📦 Stock & SKU | 🖼 Media|
+-----------------------------------------------------------------------+
| Basic Information                                                     |
| Product Name (Arabic) *                                                |
| [ آفوكادو عضوي ممتاز                                             ] |
|                                                                       |
| Product Type (Category) *                                             |
| [ خضار (Vegetables)                                             v] |
|                                                                       |
| Product SKU *                                                         |
| [ PROD-AVO-001                                                   ] |
|                                                                       |
| Unit Price (YER) *                    Cost Price (YER)                |
| [ 10.00                          ]    [ 6.50                         ] |
+-----------------------------------------------------------------------+
| [DRAWER FOOTER]                    [Cancel]  [Save as Draft]  [Save Changes]
+-----------------------------------------------------------------------+
```

---
*Certified for Green Store Enterprise v2 CRUD Specification Baseline.*
