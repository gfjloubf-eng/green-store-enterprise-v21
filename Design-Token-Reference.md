# GSD v1.0 — Design Token Reference Specification

> **Document Status:** OFFICIAL DESIGN SYSTEM SPECIFICATION  
> **Schema Standard:** W3C Design Token Community Group Format (JSON / CSS Variables)  
> **Scope:** Complete Declarative Design Tokens Schema for Multi-Platform Consumability  

---

## 1. Complete W3C JSON Design Token Schema

This JSON schema represents the single authoritative source of truth for design tokens in GSDS v1.0, enabling direct translation into CSS Custom Properties, SCSS variables, Flutter Theme Tokens, and Mobile Native Constants.

```json
{
  "name": "Green Store Design System (GSDS)",
  "version": "1.0.0",
  "tokens": {
    "color": {
      "brand": {
        "primary": { "value": "#10B981", "type": "color" },
        "primary-hover": { "value": "#059669", "type": "color" },
        "primary-active": { "value": "#047857", "type": "color" },
        "forest-dark": { "value": "#064E3B", "type": "color" }
      },
      "neutral": {
        "app-bg": { "value": "#121824", "type": "color" },
        "surface": { "value": "#1E2738", "type": "color" },
        "elevated": { "value": "#293449", "type": "color" },
        "border": { "value": "#344054", "type": "color" },
        "border-hover": { "value": "#475467", "type": "color" }
      },
      "text": {
        "primary": { "value": "#F9FAFB", "type": "color" },
        "secondary": { "value": "#9CA3AF", "type": "color" },
        "muted": { "value": "#6B7280", "type": "color" },
        "disabled": { "value": "#4B5563", "type": "color" }
      },
      "status": {
        "success": { "value": "#10B981", "type": "color" },
        "warning": { "value": "#F59E0B", "type": "color" },
        "danger": { "value": "#EF4444", "type": "color" },
        "info": { "value": "#3B82F6", "type": "color" }
      }
    },
    "typography": {
      "fontFamily": { "value": "IBM Plex Sans Arabic, Inter, sans-serif", "type": "fontFamily" },
      "fontMono": { "value": "JetBrains Mono, monospace", "type": "fontFamily" },
      "fontSize": {
        "display": { "value": "32px", "type": "dimension" },
        "h1": { "value": "24px", "type": "dimension" },
        "h2": { "value": "20px", "type": "dimension" },
        "h3": { "value": "16px", "type": "dimension" },
        "body": { "value": "14px", "type": "dimension" },
        "small": { "value": "12px", "type": "dimension" },
        "micro": { "value": "10px", "type": "dimension" }
      }
    },
    "spacing": {
      "2xs": { "value": "2px", "type": "dimension" },
      "xs": { "value": "4px", "type": "dimension" },
      "sm": { "value": "8px", "type": "dimension" },
      "md": { "value": "12px", "type": "dimension" },
      "lg": { "value": "16px", "type": "dimension" },
      "xl": { "value": "24px", "type": "dimension" },
      "2xl": { "value": "32px", "type": "dimension" }
    },
    "elevation": {
      "card": { "value": "0 1px 3px rgba(0, 0, 0, 0.2)", "type": "shadow" },
      "dropdown": { "value": "0 4px 16px rgba(0, 0, 0, 0.35)", "type": "shadow" },
      "modal": { "value": "0 12px 48px rgba(0, 0, 0, 0.5)", "type": "shadow" }
    },
    "motion": {
      "duration-fast": { "value": "150ms", "type": "duration" },
      "duration-medium": { "value": "250ms", "type": "duration" },
      "duration-slow": { "value": "350ms", "type": "duration" },
      "ease-standard": { "value": "cubic-bezier(0.4, 0.0, 0.2, 1.0)", "type": "cubicBezier" }
    }
  }
}
```

---

## 2. Platform Handoff & Variable Generation Map

1. **CSS Custom Properties Export:** Automatically maps JSON tokens to `:root { --gsd-color-primary-default: #10B981; }`.
2. **Flutter Mobile Export (`gsd_tokens.dart`):** Translates JSON tokens to `class GSDColors { static const primary = Color(0xFF10B981); }`.
3. **TypeScript Definition Export (`tokens.d.ts`):** Provides strict typings for web application frameworks.

---
*Certified for GSD v1.0 Design Token Reference Specification Baseline.*
