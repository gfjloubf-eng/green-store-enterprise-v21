# GSD v1.0 — Motion Design Specification

> **Document Status:** OFFICIAL DESIGN SYSTEM SPECIFICATION  
> **Motion Principles:** Functional, Subtle, High Velocity, Reduced Motion Compliant  
> **Transition Scale:** Fast (150ms), Medium (250ms), Slow (350ms)  

---

## 1. Motion Design Principles & Core Philosophy

Motion in Green Store Design System (GSDS) v1.0 is strictly **functional and informative**. It is designed to guide user focus, provide spatial context during navigation transitions, and confirm state mutations instantly.

```
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                 GSDS v1.0 MOTION DESIGN PILLARS                          │
  └───────────────────────────────────┬──────────────────────────────────────┘
                                      │
    ┌──────────────────┬──────────────┴──────────────┬──────────────────┐
    │                  │                             │                  │
┌───┴──────────┐  ┌────┴─────────┐             ┌─────┴────────┐   ┌─────┴────────┐
│ Immediate    │  │  Spatial     │             │ Non-Intrusive│   │  Accessible  │
│ Feedback     │  │ Continuity   │             │ Velocity     │   │ Prefers-     │
│ (150ms)      │  │ Slide Drawers│             │ Max 350ms    │   │ Reduced-Motion│
└──────────────┘  └──────────────┘             └──────────────┘   └──────────────┘
```

1. **Immediate Feedback:** Micro-interactions (button clicks, toggle switches, active focus state) respond within **150ms** to convey instantaneous system responsiveness.
2. **Spatial Continuity:** Slide-over drawers and expandable accordions move logically along directional axes (RTL slide-in from left/right) to preserve layout context.
3. **Non-Intrusive Velocity:** Animations NEVER block operational tasks. Long, decorative bounce effects or exaggerated delays are strictly forbidden.
4. **Accessibility First (`prefers-reduced-motion`):** All animations automatically fall back to immediate opacity fades (`0ms` transition) when the user enables reduced motion settings.

---

## 2. Tokenized Transition Durations & Easing Curves

### 2.1 Transition Duration Tokens

| Duration Token Name | Value | Applied UI Interactions |
|---|---|---|
| `--gsd-motion-duration-fast` | `150ms` | Hover highlights, button clicks, focus rings, checkbox checkmarks |
| `--gsd-motion-duration-medium` | `250ms` | Dropdown menus, tooltips, toast popups, accordion expands |
| `--gsd-motion-duration-slow` | `350ms` | Slide-over drawers, modal overlay fades, full-page view transitions |

### 2.2 Easing Curve Tokens

```
+-------------------------------------------------------------------------------------------------------------------+
| GSDS v1.0 EASING CURVES TABLE                                                                                     |
+-------------------------------------------------------------------------------------------------------------------+
| EASING TOKEN NAME           | CUBIC-BEZIER VALUE                | NATURAL BEHAVIOR DESCRIPTION                        |
|-----------------------------+-----------------------------------+-----------------------------------------------------|
| `--gsd-motion-ease-standard`| `cubic-bezier(0.4, 0.0, 0.2, 1.0)`| Natural acceleration and smooth deceleration.       |
| `--gsd-motion-ease-in`      | `cubic-bezier(0.4, 0.0, 1.0, 1.0)`| Fast exit curve for dismissing modals/drawers.     |
| `--gsd-motion-ease-out`     | `cubic-bezier(0.0, 0.0, 0.2, 1.0)`| Smooth entrance curve for opening drawers/tooltips. |
+-------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Standard Component Animation Specifications

1. **Button Hover & Press Effect (`GSD-Btn`):**
   - Hover: Background darkens by 10% (`--gsd-motion-duration-fast` ease-out).
   - Press: `transform: scale(0.98)` active compression effect (`100ms`).
2. **Slide-over Form Drawer (`GSD-Drawer`):**
   - Entrance: Translates 100% from screen edge to 0% (`--gsd-motion-duration-slow` ease-out).
   - Backdrop Overlay: Fades opacity from 0 to 0.5 (`--gsd-motion-duration-medium`).
3. **Toast Notification (`GSD-Toast`):**
   - Entrance: Slides in vertically from top (+20px offset) with fade-in (`250ms`).
   - Exit: Fades out and collapses height (`200ms`).
4. **Skeleton Pulse (`GSD-Skeleton`):**
   - Continuous infinite pulse animation (`1.5s` duration, opacity oscillating between `0.4` and `0.8`).

---
*Certified for GSD v1.0 Motion Design Specification Baseline.*
