# GSDS v1.0 — Component Library Specification

> **Document Status:** OFFICIAL DESIGN SYSTEM SPECIFICATION  
> **Total Component Count:** 48 Enterprise Component Specifications  
> **Scope:** Buttons, Form Controls, Data Display, Navigation, Dialogs, Feedback, & Charts  

---

## 1. Button Component Library (14 Variants & States)

### 1.1 Button Variants Matrix
- **Primary Button (`GSD-Btn-Primary`):** Solid Emerald (`#10B981`) background with crisp white text. Used for dominant page actions (`+ New Order`, `Save Changes`).
- **Secondary Button (`GSD-Btn-Secondary`):** Slate Surface (`#1E2738`) background with border. Used for secondary workflows (`Cancel`, `Back`, `Filter`).
- **Outline Button (`GSD-Btn-Outline`):** Transparent background with 1px primary border (`#10B981`). Used for tertiary actions (`Export CSV`, `View Details`).
- **Ghost Button (`GSD-Btn-Ghost`):** Borderless transparent background with hover background highlight (`rgba(255,255,255,0.05)`). Used in toolbars and table rows.
- **Danger Button (`GSD-Btn-Danger`):** Solid Crimson (`#EF4444`) background. Used for destructive confirmation actions (`Delete Record`, `Revoke Session`).
- **Success Button (`GSD-Btn-Success`):** Emerald Green badge button used for approval steps (`Approve Return`, `Mark Delivered`).
- **Warning Button (`GSD-Btn-Warning`):** Amber (`#F59E0B`) background button used for override alerts (`Override Stock Count`).
- **Text Button (`GSD-Btn-Text`):** Text link with underline hover effect. Used in table cells and inline links.
- **Icon Button (`GSD-Btn-Icon`):** Square 36px/40px icon-only button used in headers and sticky table action columns.
- **Floating Action Button (`GSD-Btn-FAB`):** Circular 56px elevated button anchored at bottom-right corner for quick POS entry or barcode scan.
- **Loading State (`GSD-Btn-Loading`):** Disables pointer events, hides label text, and displays animated micro-spinner (`20px`).
- **Disabled State (`GSD-Btn-Disabled`):** 40% opacity, `cursor: not-allowed`, pointer events suppressed.
- **Size Scale:** Small (28px height), Medium (36px height default), Large (48px height).

---

## 2. Form Input Controls Library (15 Components)

```
+-----------------------------------------------------------------------------------+
| FORM CONTROL ANATOMY                                                              |
| Label Text *                                              [ Optional Helper / Icon]|
| +-------------------------------------------------------------------------------+ |
| | 🔍 [ Left Icon ]  Text Input Field Value...               [ ❌ Clear Icon ]  | |
| +-------------------------------------------------------------------------------+ |
| ℹ Validation Message / Error Text in Red                                          |
+-----------------------------------------------------------------------------------+
```

### 2.1 Component List & Specifications
1. **Text Input (`GSD-Input-Text`):** Standard single-line text entry with focus ring (`2px #10B981`).
2. **Textarea (`GSD-Input-Textarea`):** Multi-line input with resize handle and character counter display.
3. **Single Select (`GSD-Input-Select`):** Custom dropdown overlay with search filter input and checkmark icons.
4. **Multi-Select Autocomplete (`GSD-Input-Autocomplete`):** Tag-based multi-selection input with dismissible chips (`[Vegetables x]`).
5. **Checkbox (`GSD-Input-Checkbox`):** 18px custom square checkbox with check mark SVG and indeterminate dash state.
6. **Radio Button (`GSD-Input-Radio`):** 18px circular radio button for single option selection within group container.
7. **Toggle Switch (`GSD-Input-Switch`):** 44px x 24px pill switch with smooth sliding thumb indicator.
8. **Range Slider (`GSD-Input-Slider`):** Dual-thumb range slider for min/max price range filtering.
9. **Date Picker (`GSD-Input-DatePicker`):** Popover calendar overlay supporting single date and date range selection (`Jan 1 - Jan 30`).
10. **Time Picker (`GSD-Input-TimePicker`):** Time selector with 12-hour/24-hour options and AM/PM toggles.
11. **Currency Input (`GSD-Input-Currency`):** Specialized numerical input auto-formatting currency separators (`$ 1,450.00 YER`).
12. **Phone Number Input (`GSD-Input-Phone`):** Country flag dropdown with prefix selector (`+967`) and numerical formatting.
13. **OTP Security Code Input (`GSD-Input-OTP`):** 6 individual auto-advancing digit boxes for multi-factor authentication.
14. **Password Field (`GSD-Input-Password`):** Text input with toggleable eye icon (`👁` Show / Hide Password).
15. **Validation State Wrappers:** Standardized wrapper classes for `is-valid` (Green border + Check icon) and `is-invalid` (Red border + Alert icon + Error text).

---

## 3. Data Display & Table Components (10 Components)

1. **Enterprise High-Density Data Table (`GSD-Table-Enterprise`):** Sticky header, fixed action column, row selection checkboxes, zebra striping option, density toggle (Compact 32px / Normal 44px / Relaxed 56px).
2. **Statistic Metric Card (`GSD-Card-Stat`):** KPI container displaying title, primary value, trend badge (`+14.2%`), sparkline chart, and action link.
3. **Customer 360 Card (`GSD-Card-Customer`):** Compact summary card displaying customer avatar, name, LTV badge, contact details, and address tag.
4. **Order Summary Card (`GSD-Card-Order`):** Order lifecycle card showing Order ID, item count, status badge, total amount, and quick action buttons.
5. **Inventory Level Card (`GSD-Card-Inventory`):** Stock monitoring widget with progress bar showing current stock vs safety reorder threshold.
6. **Product Catalog Card (`GSD-Card-Product`):** Merchandising card displaying product image, SKU badge, price, stock status, and quick add button.
7. **Operational Timeline (`GSD-Timeline`):** Vertical step timeline tracking order fulfillment stages (`Placed` ➔ `Prepared` ➔ `Dispatched` ➔ `Delivered`).
8. **Real-Time Activity Feed Row (`GSD-Feed-Row`):** Live event item featuring avatar/icon, timestamp, activity title, and diff badge.
9. **Badge & Status Pill (`GSD-Badge`):** Rounded status indicator in 5 variants (`Success`, `Warning`, `Danger`, `Info`, `Neutral`).
10. **Tag Chip (`GSD-Chip`):** Removable category tag (`[ Vegetables x ]`).

---

## 4. Navigation, Dialogs & Feedback Components (9 Components)

1. **Sidebar Navigation Item (`GSD-Nav-SidebarItem`):** Collapsible menu row with icon, label, badge counter, and active state highlight.
2. **Breadcrumb Bar (`GSD-Nav-Breadcrumb`):** Hierarchical location trail with chevron separators and home icon.
3. **Tabs Bar (`GSD-Nav-Tabs`):** Underlined or pill-style tab navigation container for switching view contexts.
4. **Command Palette Modal (`GSD-Modal-CommandPalette`):** Centered `Ctrl+K` omnibox modal with keyboard focus bindings.
5. **Confirmation Dialog (`GSD-Dialog-Confirm`):** Modal dialog featuring warning icon, message body, `Cancel`, and `Confirm` buttons.
6. **Slide-over Drawer (`GSD-Drawer-SlideOver`):** Panel sliding from screen edge (400px / 600px width) for editing records without leaving page grid.
7. **Toast Notification (`GSD-Feedback-Toast`):** Floating alert banner appearing at top-right corner with auto-dismiss timer (5 seconds).
8. **Skeleton Loader (`GSD-Feedback-Skeleton`):** Animated shimmer placeholder matching exact component layout during data fetch.
9. **Empty State Display (`GSD-Feedback-Empty`):** Centered graphic panel displaying title, explanatory message, and primary CTA button.

---
*Certified for GSD v1.0 Component Library Specification Baseline.*
