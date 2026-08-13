# GSD v1.0 — Color Token Specification

> **Document Status:** OFFICIAL DESIGN SYSTEM SPECIFICATION  
> **Color Standard:** Tokenized HSL / HEX Scale, Dark Mode First, WCAG 2.1 AA Compliant  
> **Scope:** Brand, Neutral, Semantic Status, Surface, Elevation & Interactive State Tokens  

---

## 1. Global Color Palette Scale

The color system is constructed on a 10-step tonal scale (50 to 900) for every color family:

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                 GSDS v1.0 PRIMARY PALETTE (EMERALD)                     │
  └─────────────────────────────────────────────────────────────────────────┘
  [ 50 ] #ECFDF5 | Very Light Surface Highlight
  [100 ] #D1FAE5 | Soft Background Active Tint
  [200 ] #A7F3D0 | Light Accent Border
  [300 ] #6EE7B7 | Interactive Secondary Fill
  [400 ] #34D399 | Vibrant Accent Highlight
  [500 ] #10B981 | PRIMARY BRAND DEFAULT (Emerald Green)
  [600 ] #059669 | Primary Hover State
  [700 ] #047857 | Primary Pressed / Active State
  [800 ] #065F46 | Deep Forest Accent
  [900 ] #064E3B | Dark Background Surface Accent
```

---

## 2. Alias & Semantic Tokens Reference

### 2.1 Brand & Neutral Tokens

| Semantic Token Name | Light Mode Value | Dark Mode Value | Usage Context |
|---|---|---|---|
| `--gsd-color-primary-default` | `#10B981` (Emerald 500) | `#10B981` (Emerald 500) | Primary CTA buttons, active tabs, focus rings |
| `--gsd-color-primary-hover` | `#059669` (Emerald 600) | `#34D399` (Emerald 400) | Hover state for primary buttons and links |
| `--gsd-color-primary-active` | `#047857` (Emerald 700) | `#059669` (Emerald 600) | Active pressed state for primary controls |
| `--gsd-color-bg-app` | `#F8F9FA` (Neutral 50) | `#121824` (Charcoal 950) | Main application viewport background |
| `--gsd-color-bg-surface` | `#FFFFFF` (White) | `#1E2738` (Slate 900) | Card panels, grid tables, modal dialogs |
| `--gsd-color-bg-elevated` | `#FFFFFF` (White) | `#293449` (Slate 850) | Floating dropdowns, tooltips, slide-over drawers |
| `--gsd-color-border-default` | `#E5E7EB` (Neutral 200) | `#344054` (Slate 700) | Standard 1px grid borders, input outlines |
| `--gsd-color-border-hover` | `#D1D5DB` (Neutral 300) | `#475467` (Slate 600) | Hover state for input borders and card outlines |

### 2.2 Text & Content Tokens

| Semantic Token Name | Light Mode Value | Dark Mode Value | Contrast Ratio |
|---|---|---|---|
| `--gsd-color-text-primary` | `#111827` (Neutral 900) | `#F9FAFB` (Neutral 50) | **15.8:1** (Exceeds AAA) |
| `--gsd-color-text-secondary` | `#4B5563` (Neutral 600) | `#9CA3AF` (Neutral 400) | **7.2:1** (Exceeds AA) |
| `--gsd-color-text-muted` | `#6B7280` (Neutral 500) | `#6B7280` (Neutral 500) | **4.6:1** (Passes AA) |
| `--gsd-color-text-disabled` | `#9CA3AF` (Neutral 400) | `#4B5563` (Neutral 600) | Suppressed state |

---

## 3. Semantic Status & Feedback Color Scales

```
+-------------------------------------------------------------------------------------------------------------------+
| STATUS COLOR SYSTEM                                                                                               |
+-------------------------------------------------------------------------------------------------------------------+
| STATUS FAMILY | DEFAULT TOKEN | HOVER TOKEN | BG TINT TOKEN | USAGE CONTEXT                                       |
|---------------+---------------+-------------+---------------+-----------------------------------------------------|
| SUCCESS       | #10B981       | #059669     | #ECFDF5       | Active status, approved orders, stock in safety     |
| WARNING       | #F59E0B       | #D97706     | #FFFBEB       | Low stock alerts, pending orders, review required   |
| DANGER        | #EF4444       | #DC2626     | #FEF2F2       | Out of stock, canceled orders, error notifications  |
| INFO          | #3B82F6       | #2563EB     | #EFF6FF       | Processing status, system info, neutral callouts    |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Accessibility & Contrast Verification Rules

1. **Text Contrast Rule:** All body text (`--gsd-color-text-primary` and `--gsd-color-text-secondary`) against background surfaces MUST maintain a minimum contrast ratio of **4.5:1** for standard text (14px) and **3:1** for large text (18px+).
2. **Interactive Component Contrast:** Buttons, form input borders, checkboxes, and focus rings MUST maintain a minimum contrast ratio of **3:1** against adjacent surface colors.
3. **Colorblind Defense:** Color is NEVER used as the sole indicator of status. Every status badge MUST combine color with an icon (e.g., Checkmark `✔` for Success, Warning Triangle `⚠️` for Low Stock, Cross `❌` for Canceled).

---
*Certified for GSD v1.0 Color Token Specification Baseline.*
