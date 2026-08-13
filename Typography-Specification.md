# GSD v1.0 — Typography Specification

> **Document Status:** OFFICIAL DESIGN SYSTEM SPECIFICATION  
> **Font Families:** IBM Plex Sans Arabic (Arabic), Inter (English/Latin), JetBrains Mono (Financials/SKUs)  
> **Direction:** RTL First (Arabic Default), LTR Adaptive (English Fallback)  

---

## 1. Font Family Architecture

GSDS v1.0 specifies 3 specialized font stacks:

1. **Arabic Primary Font Stack (`--gsd-font-family-arabic`):**
   - Font: `IBM Plex Sans Arabic`, `Cairo`, `sans-serif`.
   - Purpose: All Arabic UI labels, headers, form inputs, and notifications. Chosen for superior legibility in dense enterprise grid layouts.
2. **English / Latin Primary Font Stack (`--gsd-font-family-english`):**
   - Font: `Inter`, `system-ui`, `-apple-system`, `sans-serif`.
   - Purpose: English language interface toggle, international analytics, and cross-platform mobile apps.
3. **Monospace / Numerical Font Stack (`--gsd-font-family-mono`):**
   - Font: `JetBrains Mono`, `Fira Code`, `monospace`.
   - Purpose: Financial transactions, order totals, currency values, product SKUs, timestamps, IP addresses, and security audit diff logs. Features tabular lining figures ensuring numbers align vertically in tables.

---

## 2. Typographic Hierarchy Scale & Tokens

```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                 GSDS v1.0 TYPOGRAPHIC SCALE TOKENS                       │
  └──────────────────────────────────────────────────────────────────────────┘
  [ Display    ] 32px / Line Height: 40px (1.25) | Bold (700)      | Key Metrics
  [ Heading H1 ] 24px / Line Height: 32px (1.33) | SemiBold (600)  | Page Titles
  [ Heading H2 ] 20px / Line Height: 28px (1.40) | SemiBold (600)  | Section Titles
  [ Heading H3 ] 16px / Line Height: 24px (1.50) | Medium (500)    | Card Titles
  [ Heading H4 ] 14px / Line Height: 20px (1.43) | Medium (500)    | Group Subtitles
  [ Body Large ] 16px / Line Height: 24px (1.50) | Regular (400)   | Hero Descriptions
  [ Body       ] 14px / Line Height: 20px (1.43) | Regular (400)   | Standard Content
  [ Body Small ] 12px / Line Height: 16px (1.33) | Regular (400)   | Helper Text
  [ Micro      ] 10px / Line Height: 14px (1.40) | Medium (500)    | Table Badges
```

---

## 3. Contextual Typographic Application Tokens

| Token Name | Size / Line Height | Weight | Case / Style | Applied Components |
|---|---|---|---|---|
| `--gsd-type-table-header` | 12px / 16px | 600 (SemiBold) | Uppercase / Tracking 0.5px | Data Table Column Titles |
| `--gsd-type-table-cell` | 13px / 18px | 400 (Regular) | Tabular Numbers | Data Table Grid Cells |
| `--gsd-type-button-md` | 14px / 20px | 500 (Medium) | Normal | Primary & Secondary Buttons |
| `--gsd-type-input-label` | 13px / 18px | 500 (Medium) | Normal | Form Control Field Labels |
| `--gsd-type-badge-text` | 11px / 14px | 600 (SemiBold) | Normal | Status Badges & Pills |
| `--gsd-type-code-block` | 12px / 18px | 400 (Regular) | Monospace | Audit Diff & JSON Inspectors |

---

## 4. Responsive & RTL Typographic Rules

1. **RTL Line Height Expansion:** Arabic typography (`IBM Plex Sans Arabic`) requires **10-15% wider line heights** than English to prevent vertical clipping of Arabic diacritics and ascenders/descenders.
2. **Tabular Figures for Financials:** All numerical displays MUST enforce `font-variant-numeric: tabular-nums` to ensure currency columns ($ 1,450.00 YER) align perfectly across rows.
3. **Mobile Scaling Rule:** On viewports `< 768px`, Display text scales down from 32px to 24px, and Heading H1 scales down from 24px to 20px to optimize header layout space.

---
*Certified for GSD v1.0 Typography Specification Baseline.*
