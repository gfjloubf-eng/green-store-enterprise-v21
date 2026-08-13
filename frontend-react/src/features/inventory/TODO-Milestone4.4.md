# Milestone 4.4 — Inventory Module Foundation

## Implementation Steps

### Types Layer
- [x] Create `types/inventory.ts` — Inventory types (status, movement, location, filters)

### Domain Layer
- [x] Create `domain/inventoryEntity.ts` — Inventory entity (references ProductEntity)
- [x] Create `domain/stockMovementEntity.ts` — Stock movement entity (future-proof)
- [x] Create `domain/inventoryDTO.ts` — Data Transfer Object
- [x] Create `domain/movementDTO.ts` — Movement DTO
- [x] Create `domain/inventoryFilterModel.ts` — Filter criteria model
- [x] Create `domain/inventoryTableModel.ts` — Table view model
- [x] Create `domain/index.ts` — Barrel export

### State Layer
- [x] Create `state/inventoryState.ts` — Inventory state machine
- [x] Create `state/index.ts` — Barrel export

### Mock Data
- [x] Create `mock/inventory.ts` — In-memory inventory + movements

### Constants & Config
- [x] Create `constants/index.ts` — Table columns, filters, thresholds
- [x] Create `config/index.ts` — Route paths, module metadata

### Service Layer
- [x] Create `services/inventoryService.ts` — InventoryService (all methods)
- [x] Create `services/index.ts` — Barrel export

### Hook Layer
- [x] Create `hooks/useInventoryService.ts` — React hooks
- [x] Add `useInventoryService()` — Facade hook exposing full InventoryService API
- [x] Add `useInventoryMovements()` — Combined state + filter + sort for movements page

### Components
- [x] Create `components/InventoryTable.tsx`
- [x] Create `components/InventoryFilters.tsx`
- [x] Create `components/MovementTable.tsx`
- [x] Create `components/StockCard.tsx`
- [x] Create `components/StockSummary.tsx`
- [x] Create `components/MovementTimeline.tsx`
- [x] Create `components/InventoryEmptyState.tsx`
- [x] Create `components/StockBadge.tsx` — Reusable stock status badge
- [x] Create `components/MovementBadge.tsx` — Reusable movement type/status badge

### Pages
- [x] Create `pages/InventoryDashboard.tsx`
- [x] Create `pages/StockOverview.tsx`
- [x] Create `pages/StockMovements.tsx`
- [x] Create `pages/StockAdjustment.tsx`
- [x] Create `pages/StockTransfer.tsx`
- [x] Create `pages/LowStock.tsx`
- [x] Create `pages/OutOfStock.tsx`
- [x] Create `pages/InventoryReports.tsx`
- [x] Create `pages/index.ts` — Barrel export

### Integration
- [x] Update `config/navigation.ts` — Add Inventory nav group
- [x] Update `App.tsx` — Add inventory routes
- [x] Update `i18n/locale.ts` — Add Arabic + English translations
- [x] Update `components/layout/BreadcrumbEngine.tsx` — Add inventory breadcrumbs
- [x] Fix `config/index.ts` — Route path mismatch: `INVENTORY_ROUTES.overview` changed from `/inventory/stock` to `/inventory/overview`
- [x] Refactor `InventoryTable.tsx` — Replace inline badge markup with `<StockBadge>`
- [x] Refactor `StockCard.tsx` — Replace inline badge markup with `<StockBadge>`
- [x] Refactor `MovementTable.tsx` — Replace inline badge markup with `<MovementBadge>`

### Verification
- [x] Run `npm run build` — ✅ PASSED (tsc + vite build)
- [x] Run `npm run dev` — ✅ PASSED

