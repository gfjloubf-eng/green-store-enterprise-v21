/* ============================================================
   GSDS v1.1 — Domain Layer Barrel Export
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.3
   ============================================================ */

export type { ProductEntity, EntityRef, UnitRef } from './productEntity';
export { createProductEntity, updateProductEntity } from './productEntity';

export type { ProductDTO } from './productDTO';
export { toDTO, fromDTO, toDTOList } from './productDTO';

export type { ProductFormModel } from './productFormModel';
export { formDataToEntity, entityToFormData } from './productFormModel';

export type { ProductFilterModel } from './productFilterModel';
export { DEFAULT_FILTER_MODEL, applyFilters, applySort, applyPagination } from './productFilterModel';

export type { ProductTableModel } from './productTableModel';
export { toTableModel, toTableModelList } from './productTableModel';

