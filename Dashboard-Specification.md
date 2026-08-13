# Green Store Enterprise v2 — Dashboard Architecture Specification

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Target Screens:** `SCR-01` (Executive Command Center), `SCR-02` (Fulfillment Control Room), `SCR-03` (Operational Feed)  
> **Aesthetic Standard:** Modern Enterprise Glassmorphism, Dark/Light Mode, Real-Time Data Streaming  

---

## 1. Executive Command Dashboard (`SCR-01`) Layout Architecture

The Executive Command Dashboard provides C-level executives and store directors with a real-time 360° overview of commercial performance, inventory health, and operational velocity.

```
+-------------------------------------------------------------------------------------------------------------------+
| [Page Header] Executive Command Center                                  [📅 Last 30 Days v] [📥 Export Report v] |
+-------------------------------------------------------------------------------------------------------------------+
| [KPI ROW]                                                                                                         |
| +---------------------+ +---------------------+ +---------------------+ +---------------------+ +---------------+ |
| | Total Gross Revenue | | Total Orders Count  | | Active Customers    | | Avg Order Value     | | Low Stock     | |
| | $248,500.00 YER     | | 1,420 Orders        | | 890 Customers       | | $175.00 YER         | | 4 SKUs Alert  | |
| | 📈 +14.2% vs last mo| | 📈 +8.5% vs last mo | | 📈 +12.0% vs last mo| | 📉 -1.5% vs last mo | | ⚠️ Requires Action|
| +---------------------+ +---------------------+ +---------------------+ +---------------------+ +---------------+ |
+-------------------------------------------------------------------------------------------------------------------+
| [MAIN ANALYTICS SECTION]                                                                                          |
| +---------------------------------------------------------+ +---------------------------------------------------+ |
| | 📈 Sales Revenue & Order Velocity (Line / Bar Chart)    | | 🍩 Sales Distribution by Product Category       | |
| |                                                         | |   • Vegetables ( خضار ): 58%                      | |
| | [Revenue Over Time: Daily Breakdown Jan 1 - Jan 30]     | |   • Fruits ( فاكهة ): 42%                        | |
| +---------------------------------------------------------+ +---------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------------------+
| [LOWER OPERATIONAL SECTION]                                                                                        |
| +---------------------------------------------------------+ +---------------------------------------------------+ |
| | 📑 Recent High-Value Orders                             | | 🤖 AI Assistant Insights & Predictive Stock       | |
| | • Order #1042 - Ahmed Al-Mansoor ($340.00) [Preparing]  | |   💡 Demand Spike Expected for "Organic Avocado" | |
| | • Order #1041 - Sarah Hassan    ($210.00) [Delivered]  | |      suggest restocking 150 units before Friday. | |
| | • Order #1040 - Omar Khaled     ($185.00) [Pending]    | |   💡 18 Abandoned carts detected today ($2,400.00)| |
| +---------------------------------------------------------+ +---------------------------------------------------+ |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. KPI Cards Detailed Specifications

### 2.1 Metric Card 1: Total Gross Revenue
- **Data Source:** `SUM(orders.total)` where `orders.status != 'cancelled'`.
- **Display Component:** Numeric Display with currency symbol (`YER` / `USD`).
- **Trend Indicator:** Percentage change comparison against prior rolling period (`+14.2%`). Color: Emerald Green (`#10B981`).
- **Interactive Action:** Click opens `SCR-26` (Sales Performance & Revenue Analytics).

### 2.2 Metric Card 2: Total Orders Volume
- **Data Source:** `COUNT(orders.id)`.
- **Sub-Metrics Breakdown:** Pending: 24 | Preparing: 12 | Delivering: 18 | Delivered: 1,366.
- **Interactive Action:** Click opens `SCR-09` (Order Master Control Grid).

### 2.3 Metric Card 3: Active Customers Count
- **Data Source:** `COUNT(DISTINCT orders.customer_email)` within selected date range.
- **Interactive Action:** Click opens `SCR-14` (Customer Master Directory).

### 2.4 Metric Card 4: Low Stock Alert Warning
- **Data Source:** `COUNT(products.id)` where `stock_quantity <= reorder_level`.
- **Status Style:** Amber warning border with pulse animation.
- **Interactive Action:** Click opens `SCR-21` (Low Stock & Reorder Board).

---

## 3. Operational Control Room Dashboard (`SCR-02`)

Designed specifically for warehouse dispatchers and fulfillment managers operating on high-density displays or touchscreen tablets.

```
+-------------------------------------------------------------------------------------------------------------------+
| 🚀 FULFILLMENT CONTROL ROOM (LIVE QUEUE)                      [Sound: ON] [Auto-Refresh: 10s] [Filter: All Bins v]|
+-------------------------------------------------------------------------------------------------------------------+
| [COLUMN 1: PENDING ORDERS (24)] | [COLUMN 2: PREPARING / PICKING (12)] | [COLUMN 3: READY / DISPATCH (18)]        |
| +-----------------------------+ | +----------------------------------+ | +--------------------------------------+ |
| | Order #1045 - 2 mins ago    | | | Order #1043 - Packing in Bin A3  | | | Order #1039 - Driver Assigned      | |
| | Items: 4 (Avocado, Tomato)  | | | Picker: Staff Member #04         | | | Courier: Express Delivery          | |
| | Address: Hadda St, Zone B   | | | Time in Prep: 14 mins            | | | ETA: 15 mins                       | |
| | Total: $120.00 YER          | | |                                  | | |                                    | |
| | [ACCEPT & BEGIN PICKING]    | | | [MARK READY FOR DISPATCH]        | | | [CONFIRM DELIVERED]                | |
| +-----------------------------+ | +----------------------------------+ | +--------------------------------------+ |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Real-Time Operational Activity Feed (`SCR-03`)

A live scrolling audit trail capturing system events in real time:

- **10:14:22 AM:** `ORDER_CREATED` — Order #1045 placed by Customer `Ahmed Al-Mansoor` ($120.00 YER).
- **10:12:05 AM:** `STOCK_ADJUSTMENT` — Staff `Fulfillment Mgr #2` adjusted stock for SKU `PROD-TOM-002` (+50 units).
- **10:08:44 AM:** `PRICE_UPDATED` — Product `Organic Avocado` unit price updated from $12.00 to $10.00 YER.
- **10:01:10 AM:** `SECURITY_LOGIN` — Admin `User #01` logged in from IP `192.168.1.45`.

---
*Certified for Green Store Enterprise v2 Dashboard Architecture Baseline.*
