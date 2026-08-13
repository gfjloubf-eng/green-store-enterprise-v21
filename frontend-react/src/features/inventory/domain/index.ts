/* ============================================================
   GSDS v1.1 — Inventory Domain Layer Barrel Export
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4
   ============================================================ */

export type { InventoryEntity } from './inventoryEntity';
export {
  computeInventoryStatus,
  createInventoryEntity,
  updateInventoryEntity,
} from './inventoryEntity';

export type { StockMovementEntity, MovementDirection } from './stockMovementEntity';
export {
  getMovementDirection,
  createStockMovementEntity,
} from './stockMovementEntity';

export type { InventoryDTO } from './inventoryDTO';
export { toDTO as toInventoryDTO, fromDTO as fromInventoryDTO, toDTOList as toInventoryDTOList } from './inventoryDTO';

export type { MovementDTO } from './movementDTO';
export { toDTO as toMovementDTO, toDTOList as toMovementDTOList } from './movementDTO';

export type { InventoryFilterModel } from './inventoryFilterModel';
export {
  DEFAULT_INVENTORY_FILTER_MODEL,
  applyInventoryFilters,
  applyInventorySort,
  applyInventoryPagination,
} from './inventoryFilterModel';

export type { InventoryTableModel, ProductLookup } from './inventoryTableModel';
export { toTableModel, toTableModelList } from './inventoryTableModel';

