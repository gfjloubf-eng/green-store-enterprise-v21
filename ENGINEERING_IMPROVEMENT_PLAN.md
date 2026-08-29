# ENGINEERING IMPROVEMENT PLAN — STOREFRONT SAFE UI V1

## Overview
Safe, isolated UI enhancement for the Qutoof Nature (Green Store) marketplace storefront. This plan introduces a refined, accessible, and responsive `ProduceCard` component without modifying any underlying data layer, authentication, pricing, inventory, API routes, or database configurations.

## Target Changes
1. **[NEW] `frontend-react/src/features/marketplace/components/ProduceCard.tsx`**:
   - Extracted standalone, highly reusable produce card component.
   - Enhanced visual presentation with aspect-square responsive images and fallback handling.
   - Accessible action buttons (`aria-label`, RTL support, dark mode compatibility).
   - Dynamic button state management (`أضف إلى السلة`, `جاري الإضافة...`, `تمت الإضافة`, `نفد المخزون`).

2. **[MODIFY] `frontend-react/src/components/HomePage.tsx`**:
   - Imports external `ProduceCard` component.
   - Implements responsive grid layout:
     - Mobile: 2 columns (`grid-cols-2`)
     - Tablet: 3 columns (`sm:grid-cols-3`)
     - Desktop: 4 columns (`md:grid-cols-4`)
   - Limits initial Fruits & Vegetables sections to 8 items while preserving full section browsing via "عرض الكل".

3. **[NEW] `ENGINEERING_IMPROVEMENT_PLAN.md`**:
   - Architectural document detailing storefront UI improvements and safety constraints.

## Safety & Non-Breaking Verification
- No changes to `ProductDTO`, `ProductService`, or backend API contracts.
- No database migrations, schema edits, or environment variable modifications.
- Strict isolation to storefront presentation files only.
