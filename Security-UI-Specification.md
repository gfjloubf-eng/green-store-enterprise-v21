# Green Store Enterprise v2 — Security & Access Control UI Specification

> **Document Status:** OFFICIAL DESIGN SPECIFICATION  
> **Target Screens:** `SCR-31` (Users), `SCR-32` (RBAC Matrix), `SCR-33` (Audit Logs), `SCR-34` (Sessions), `SCR-35` (API Keys)  
> **Security Standards:** ISO/IEC 27001, OWASP ASVS 4.0, Enterprise Audit Traceability  

---

## 1. User & Identity Management Center (`SCR-31`)

The User Management Center provides IT Security Administrators with a single pane of glass for managing staff accounts, multi-factor authentication (MFA) requirements, and security status.

```
+-------------------------------------------------------------------------------------------------------------------+
| [Page Header] 👥 Enterprise Security: User Accounts                   [+ Provision New User] [📥 Export Users]   |
+-------------------------------------------------------------------------------------------------------------------+
| 🔍 Search Users (Name, Email, Role...) | Role: [All Roles v] | Status: [Active v] | MFA: [Enforced v]             |
+-------------------------------------------------------------------------------------------------------------------+
| User Account        | Security Role       | Assigned Location  | MFA Status | Last Login           | Actions     |
|---------------------+---------------------+--------------------+------------+----------------------+-------------|
| Admin Officer       | Super Administrator | Global System      | 🔒 Active  | 2026-07-27 10:14 AM | 👁 ✏ 🔒 🔑  |
| Store Dispatcher    | Fulfillment Lead    | Hadda Main Store   | ⚠️ Pending | 2026-07-27 09:30 AM | 👁 ✏ 🔒 🔑  |
| Staff User #04      | Cashier / Inventory | Hadda Main Store   | ❌ Disabled| 2026-07-26 04:15 PM | 👁 ✏ 🔒 🔑  |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Granular Role-Based Access Control (RBAC) Matrix (`SCR-32`)

The RBAC Matrix allows administrators to create custom security roles and visually configure permission node checkboxes across all enterprise domains.

```
+-------------------------------------------------------------------------------------------------------------------+
| [RBAC MATRIX EDITOR] Role Selection: [ Fulfillment Manager v ]                  [Save Permission Schema Changes]  |
+-------------------------------------------------------------------------------------------------------------------+
| SYSTEM DOMAIN & PERMISSION NODE          | READ / VIEW | CREATE / ADD | UPDATE / EDIT | DELETE / DESTROY | EXECUTE |
|------------------------------------------+-------------+--------------+---------------+------------------+---------|
| Catalog Domain (`catalog.products`)      |     [x]     |     [x]      |      [x]      |       [ ]        |   [ ]   |
| Orders Domain (`orders.fulfillment`)     |     [x]     |     [x]      |      [x]      |       [ ]        |   [x]   |
| Customer Profiles (`customers.data`)     |     [x]     |     [x]      |      [ ]      |       [ ]        |   [ ]   |
| Financial Reports (`financials.revenue`) |     [ ]     |     [ ]      |      [ ]      |       [ ]        |   [ ]   |
| Security & Audit (`security.audit_trail`)|     [ ]     |     [ ]      |      [ ]      |       [ ]        |   [ ]   |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Immutable Security Audit Trail Viewer (`SCR-33`)

The Audit Log Viewer provides an unalterable, cryptographically signed log of every data mutation, privilege escalation, or security event occurring in the system.

```
+-------------------------------------------------------------------------------------------------------------------+
| [Page Header] 📜 Immutable Security Audit Trail                            [🔍 Filter Audit Stream] [📥 Export CSV]|
+-------------------------------------------------------------------------------------------------------------------+
| Date / Timestamp  | Actor / Account      | Action Event         | Target Entity      | IP Address    | Diff Inspector|
|-------------------+----------------------+----------------------+--------------------+---------------+---------------|
| 2026-07-27 10:12  | Staff #02 (Fulfill)  | `ORDER_STATUS_CHANGE`| Order #1042        | 192.168.1.104 | [Inspect Diff]|
| 2026-07-27 09:45  | Admin Officer        | `ROLE_PERM_UPDATE`   | Role: Cashier      | 192.168.1.045 | [Inspect Diff]|
| 2026-07-27 08:30  | System Scheduler     | `DB_BACKUP_EXECUTE`  | Database Snapshot  | 127.0.0.1     | [Inspect Logs]|
+-------------------------------------------------------------------------------------------------------------------+
```

### 3.1 Audit Diff Inspector Drawer
Clicking `[Inspect Diff]` opens a side panel displaying precise JSON payload differences:

```json
{
  "audit_event_id": "AUD-88412-2026",
  "actor": "user_id_42 (Fulfillment Staff)",
  "entity_type": "Order",
  "entity_id": 1042,
  "changes": {
    "status": {
      "before": "pending",
      "after": "preparing"
    }
  },
  "ip_address": "192.168.1.104",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
}
```

---

## 4. Active Session & API Key Management (`SCR-34` & `SCR-35`)

### 4.1 Active Session Monitor (`SCR-34`)
Displays real-time active user sessions, token issue timestamps, device information, and a single-click `[Revoke Session]` action button to immediately terminate suspicious user sessions.

### 4.2 API Keys & Application Integration (`SCR-35`)
Manages bearer tokens, OAuth2 integration client IDs, and secret keys utilized by mobile applications, POS terminals, and external ERP connectors. Supports IP whitelisting and rate-limiting configurations.

---
*Certified for Green Store Enterprise v2 Security UI Baseline.*
