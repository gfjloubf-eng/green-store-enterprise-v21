# Green Store Enterprise v2 — Enterprise Reporting & BI Specification

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Target Screens:** `SCR-26` (Sales Analytics), `SCR-27` (Product ABC Analysis), `SCR-28` (Inventory Valuation), `SCR-29` (CLV Cohort), `SCR-30` (Custom Report Builder)  
> **Export Formats:** Interactive Dynamic Grids, PDF Financial Statements, Excel XLSX, Raw CSV  

---

## 1. Executive BI Reporting Hub (`SCR-26` - `SCR-30`) Overview

The Reporting Center empowers financial managers, catalog merchandisers, and executive directors to analyze store velocity, profit margins, stock turn rates, and customer purchasing cohorts.

```
+-------------------------------------------------------------------------------------------------------------------+
| [Page Header] 📈 Business Intelligence & Enterprise Reporting Center   [📅 Select Period: Q3 2026 v] [📥 Export v]|
+-------------------------------------------------------------------------------------------------------------------+
| [REPORT TABS]                                                                                                     |
| 💵 Sales & Revenue | 📦 Inventory Valuation | 🥑 Product Velocity (ABC) | 👤 Customer Cohorts | 🛠 Custom Query |
+-------------------------------------------------------------------------------------------------------------------+
| [SUMMARY METRIC STRIP]                                                                                            |
| Gross Revenue: $248,500.00 YER | Net Profit: $68,200.00 YER | Cost of Goods Sold (COGS): $180,300.00 YER | Tax: $0 |
+-------------------------------------------------------------------------------------------------------------------+
| [INTERACTIVE REPORT TABLE: SALES BY CATEGORY & DATE]                                                              |
| Date       | Category       | Items Sold | Gross Sales (YER) | COGS (YER)    | Net Profit (YER) | Margin %  |
|------------+----------------+------------+-------------------+---------------+------------------+-----------|
| 2026-07-27 | Vegetables     | 840 units  | $8,400.00 YER     | $5,200.00 YER | $3,200.00 YER    | 38.1%     |
| 2026-07-27 | Fruits         | 520 units  | $6,240.00 YER     | $4,100.00 YER | $2,140.00 YER    | 34.3%     |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Core Report Specifications

### 2.1 Daily & Monthly Sales Report (`SCR-26`)
- **Dimensions:** Time (Hour, Day, Week, Month), Product Category, Order Source (Web, Mobile, POS).
- **Metrics:** Order Count, Gross Sales, Discounts Applied, Net Sales, Tax Collected, Average Order Value (AOV).
- **Visual Representation:** Dual-axis Line Chart (Sales Volume vs Revenue) + Categorical Stacked Bar Chart.

### 2.2 Product Velocity & ABC Inventory Classification (`SCR-27`)
- **Purpose:** Classifies catalog products using standard Pareto Principle (80/20 rule):
  - **Category A (Top Drivers):** Top 20% SKUs generating 80% of total store revenue.
  - **Category B (Regular Movers):** Middle 30% SKUs generating 15% revenue.
  - **Category C (Slow Movers / Dead Stock):** Bottom 50% SKUs generating 5% revenue.
- **Action Trigger:** `[Flag Slow Movers for Promotion]` (automatically creates discount matrix rules).

### 2.3 Inventory Valuation & Shrinkage Report (`SCR-28`)
- **Metrics:** Total Stock Quantity on Hand, Unit Cost Basis (FIFO / Weighted Average), Total Asset Valuation, Discrepancy Shrinkage Value.
- **Auditing Compliance:** Generates official financial valuation statements required for quarterly accounting.

### 2.4 Customer Cohort Analysis & Lifetime Value (`SCR-29`)
- **Metrics:** Acquisition Date, First Purchase AOV, 30-day Repurchase Rate, 90-day Churn Rate, Customer Lifetime Value (CLV).

---

## 3. Custom Report Builder & Query Exporter (`SCR-30`)

An interactive drag-and-drop report builder allowing managers to construct bespoke financial and inventory queries without writing SQL:

```
+-----------------------------------------------------------------------------------+
| 🛠 CUSTOM REPORT BUILDER                                                          |
+-----------------------------------------------------------------------------------+
| 1. Select Primary Entity:  [ Orders v ]                                          |
| 2. Choose Dimensions:      [x] Order Date  [x] Customer Name  [x] Delivery Zone   |
| 3. Choose Metrics:         [x] Total Sum   [x] Item Count     [x] Shipping Fee    |
| 4. Apply Filters:          Where Status EQUALS [ Delivered ]                      |
| 5. Output Format:          [ Excel Spreadsheet (.xlsx) v ]                       |
|                                                                                   |
|                            [Generate & Download Custom Report]                    |
+-----------------------------------------------------------------------------------+
```

---
*Certified for Green Store Enterprise v2 Reporting Specification Baseline.*
