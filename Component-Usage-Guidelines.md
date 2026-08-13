# GSD v1.0 — Component Usage Guidelines

> **Document Status:** OFFICIAL DESIGN SYSTEM SPECIFICATION  
> **Scope:** Layout Rhythm, Component Pairing, Do's & Don'ts, Spacing Rules  
> **Target Audience:** UI Engineers, Product Designers, Enterprise Developers  

---

## 1. Spacing System & Layout Rhythm Grid

GSDS v1.0 relies on an **8px Base Spatial Grid** with a **4px Micro-Grid** for small alignment tasks:

```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                   GSDS v1.0 SPACING SCALE TOKENS                         │
  └──────────────────────────────────────────────────────────────────────────┘
  [ Space-2xs ]  2px  | Micro border offsets, badge padding
  [ Space-xs  ]  4px  | Icon-to-text inline gap, tight element padding
  [ Space-sm  ]  8px  | Compact form field gap, table cell vertical padding
  [ Space-md  ] 12px  | Standard input inline padding, card element gap
  [ Space-lg  ] 16px  | Card container internal padding, grid column gap
  [ Space-xl  ] 24px  | Page section gap, drawer container padding
  [ Space-2xl ] 32px  | Major layout section separation
  [ Space-3xl ] 48px  | Hero section padding, empty state container gap
```

---

## 2. Mandatory Component Pairing & Layout Rules

### 2.1 Form Control & Field Label Pairing
- **Rule:** Every form input MUST be paired with an explicit label above the field (`--gsd-space-xs` 4px gap). Floating labels are prohibited in enterprise data grids to prevent input height inconsistency.
- **Helper Text Placement:** Helper/validation text MUST be placed directly below the input field (`--gsd-space-xs` 4px gap).

### 2.2 Table Grid Density Rules
- **Compact Density (32px row height):** Used in high-speed operational screens (`SCR-02` Control Room, `SCR-09` Order Control Grid).
- **Default Density (44px row height):** Used in standard catalog listings (`SCR-04` Products Master Grid, `SCR-14` Customer Directory).
- **Relaxed Density (56px row height):** Used when table rows contain multi-line text or item thumbnail images (`SCR-05` Product Variants).

---

## 3. Official Do's and Don'ts Matrix

```
+-------------------------------------------------------------------------------------------------------------------+
| COMPONENT USAGE DO'S & DON'TS MATRIX                                                                              |
+-------------------------------------------------------------------------------------------------------------------+
| COMPONENT DOMAIN  | ✅ MANDATORY DO                                     | ❌ STRICT DON'T                                 |
|-------------------+-----------------------------------------------------+-------------------------------------------------|
| BUTTONS           | Use max 1 Primary Emerald button per view container.| Don't place multiple Primary buttons together.  |
| STATUS BADGES     | Always pair badge background color with an icon.    | Don't rely solely on color to communicate status.|
| FORM INPUTS       | Display validation error message below field in red.| Don't clear user input when validation fails.   |
| DATA TABLES       | Provide sticky column headers and pagination footer.| Don't render infinite scrolling without headers.|
| MODALS & DRAWERS  | Use Slide-over Drawers for multi-field edit flows.  | Don't open nested modal over existing modal.    |
| TYPOGRAPHY        | Use Tabular Monospace font for currency & totals.   | Don't use decorative script fonts anywhere.     |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 4. RTL First Alignment Rules

1. **Inline Flow Direction:** In RTL mode (Arabic), all flex layouts, text alignments, and icon placements flow from Right to Left.
2. **Directional Icons Mirroring:** Arrows (`➔`), Chevrons (`>`), Back icons (`←`), and Drawer slide directions MUST automatically mirror to match the RTL Reading Flow (`←`, `<`, `→`).
3. **Non-Mirrored Media:** Media thumbnails, product images, clock/time icons, and lock security icons DO NOT mirror across RTL/LTR transitions.

---
*Certified for GSD v1.0 Component Usage Guidelines Baseline.*
