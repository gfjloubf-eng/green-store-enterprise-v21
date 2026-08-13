# Green Store Enterprise v2 — System Settings & Administration Specification

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Target Screens:** `SCR-36` (General Profile), `SCR-37` (Taxes), `SCR-38` (Logistics & Delivery Radius), `SCR-39` (Multi-Currency & i18n), `SCR-40` (Logs), `SCR-41` (Backups), `SCR-42` (Maintenance)  
> **Scope:** Centralized Enterprise System Configuration  

---

## 1. System Settings Hub Layout (`SCR-36` - `SCR-39`)

The Settings Hub is organized into a clean vertical sidebar tabbed panel allowing system administrators to configure operational defaults, financial taxes, logistics radius, and localization parameters.

```
+-------------------------------------------------------------------------------------------------------------------+
| [Page Header] ⚙ Enterprise System Settings                                  [Save All Configuration Changes]  |
+-------------------------------------------------------------------------------------------------------------------+
| SETTINGS NAVIGATION   | STORE PROFILE & BRANDING (`SCR-36`)                                                       |
|                       |                                                                                           |
| 🏪 Store Profile      | Store Name (Arabic)                          Store Name (English)                         |
| 💰 Tax Matrix         | [ المتجر الأخضر للمواد الغذائية         ]    [ Green Store Fresh Produce Market       ]   |
| 🚚 Logistics & Radius |                                                                                           |
| 🌐 Currency & i18n    | Primary Store Email                          Primary Contact Phone                        |
| 🔔 Notifications      | [ info@greenstore.com                  ]    [ +967-1-234567                          ]   |
| 💾 Backup & Maintenance|                                                                                          |
|                       | Store Logo Upload                            Favicon Icon Upload                          |
|                       | [ 🖼 Drag & Drop Logo Image Here ]           [ 🖼 Drag & Drop Favicon File Here ]         |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Detailed Settings Modules Architecture

### 2.1 Tax Rules & Financial Localization Matrix (`SCR-37`)
- **Configurable Rules:**
  - Tax Mode: Exclusive (Tax added at checkout) vs Inclusive (Tax included in item prices).
  - Standard Tax Rate: Percentage value (e.g., `0.00%` default or `5.00%` VAT).
  - Tax Exemption Rules: Per category (e.g., Basic produce exempt from sales tax).

### 2.2 Logistics, Delivery Zones & Geofencing Manager (`SCR-38`)
- **Interactive Map Configurator:**
  - Latitude / Longitude Center Point (`lat`/`lng` coordinates of store hub).
  - Delivery Radius Constraint (`radius_km` slider, e.g., `15.0 km` maximum delivery zone).
  - Zone Flat Fees: Distance-based pricing rules (e.g., Zone A [0-5km] = $2.00 YER, Zone B [5-15km] = $5.00 YER).
  - Out-of-Zone Rejection Message: Configurable Arabic alert displayed when customer delivery address exceeds radius.

### 2.3 Multi-Currency & Internationalization Configurator (`SCR-39`)
- **Currencies Configurator:**
  - Primary Base Currency: `YER` (Yemeni Rial).
  - Secondary Exchange Currencies: `USD` (US Dollar), `SAR` (Saudi Riyal).
  - Exchange Rate Conversion Table with automated API exchange rate update schedules.
- **Language & Localization Matrix:**
  - Default Direction: RTL (Right-to-Left for Arabic).
  - Supported Languages: Arabic (`ar-YE` default), English (`en-US`).
  - Date & Number Formatting: Standardized digit separators and Gregorian calendar options.

---

## 3. System Maintenance & Automated Backups (`SCR-40` - `SCR-42`)

```
+-------------------------------------------------------------------------------------------------------------------+
| 💾 BACKUP & DATABASE MAINTENANCE CENTER (`SCR-41`)                                                                |
+-------------------------------------------------------------------------------------------------------------------+
| AUTOMATED SNAPSHOT SCHEDULER                                                                                      |
| Backup Frequency: [ Daily at 02:00 AM v ]  |  Retention Policy: [ Keep Last 30 Daily Snapshots v ]               |
| Storage Destination: [ Local Vault + Cloud S3 Bucket v ]                                                          |
|                                                                                                                   |
| RECENT BACKUP SNAPSHOTS                                                                                           |
| Snapshot Filename                  | Created Date          | Size     | Hash Verification  | Actions          |
|------------------------------------+-----------------------+----------+--------------------+------------------|
| `db_backup_2026-07-27_0200.sql.gz` | 2026-07-27 02:00:00 AM| 14.8 MB  | SHA256: 8f4a1b...  | [📥 Download] [🔄 Restore]|
| `db_backup_2026-07-26_0200.sql.gz` | 2026-07-26 02:00:00 AM| 14.2 MB  | SHA256: 3c9e2d...  | [📥 Download] [🔄 Restore]|
+-------------------------------------------------------------------------------------------------------------------+
```

### 3.1 Maintenance Mode & Emergency Controls (`SCR-42`)
- **Storefront Maintenance Toggle:** Single-click switch placing public checkout into scheduled maintenance mode while retaining admin access.
- **Cache Eviction Utility:** Flush system query cache, route cache, and temporary session stores.

---
*Certified for Green Store Enterprise v2 Settings Specification Baseline.*
