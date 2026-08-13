/* ============================================================
   GSDS v1.1 — ProductTable Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1 — Responsive data table
   ============================================================
   Pure presentation component.
   - No business logic.
   - No data manipulation.
   - Receives data through props only.
   ============================================================ */

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { placeholderImage } from '@/assets/images/products/productImages';
import { PRODUCT_TABLE_COLUMNS, PRODUCT_STATUS_CONFIG } from '../constants';
import type { ProductSummary, ProductColumnId } from '../types/product';

/* ─── Props ────────────────────────────────────────────────── */

interface ProductTableProps {
  /** Product data to display */
  products: ProductSummary[];
  /** Current sort column ID */
  sortBy: ProductColumnId;
  /** Current sort direction */
  sortDirection: 'asc' | 'desc';
  /** Called when a column header is clicked for sorting */
  onSort: (columnId: ProductColumnId) => void;
  /** Called when "View" action is triggered */
  onView?: (product: ProductSummary) => void;
  /** Called when "Edit" action is triggered */
  onEdit?: (product: ProductSummary) => void;
  /** Called when "Delete" action is triggered */
  onDelete?: (product: ProductSummary) => void;
  /** Optional class name override */
  className?: string;
}

/* ─── Sort Icon Helper ─────────────────────────────────────── */

function SortIcon({
  columnId,
  currentSortBy,
  currentDirection,
}: {
  columnId: ProductColumnId;
  currentSortBy: ProductColumnId;
  currentDirection: 'asc' | 'desc';
}) {
  if (columnId !== currentSortBy) {
    return <ArrowUpDown className="h-3 w-3 opacity-30" aria-hidden="true" />;
  }
  return currentDirection === 'asc' ? (
    <ArrowUp className="h-3 w-3" aria-hidden="true" />
  ) : (
    <ArrowDown className="h-3 w-3" aria-hidden="true" />
  );
}

/* ─── Currency Formatter ───────────────────────────────────── */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/* ─── Date Formatter ───────────────────────────────────────── */

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/* ─── ProductTable ─────────────────────────────────────────── */

export function ProductTable({
  products,
  sortBy,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  className,
}: ProductTableProps) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        'gsd-surface overflow-hidden',
        className,
      )}
    >
      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full border-collapse text-sm" role="table">
          {/* ── Header ──────────────────────────────────── */}
          <thead>
            <tr className="[border-bottom:1px_solid_var(--gs-border)]">
              {PRODUCT_TABLE_COLUMNS.map((col) => {
                const columnLabelKey = `table.${col.id}`;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      'px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]',
                      col.sortable && 'cursor-pointer select-none hover:[color:var(--gs-foreground-secondary)]',
                    )}
                    style={{ width: col.width, minWidth: col.width }}
                    onClick={() => col.sortable && onSort(col.id)}
                    aria-sort={
                      col.id === sortBy
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{t(columnLabelKey as TranslationKey)}</span>
                      {col.sortable && (
                        <SortIcon
                          columnId={col.id}
                          currentSortBy={sortBy}
                          currentDirection={sortDirection}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── Body ────────────────────────────────────── */}
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={PRODUCT_TABLE_COLUMNS.length}
                  className="px-3 py-12 text-center [color:var(--gs-foreground-muted)]"
                >
                  {t('table.noProducts')}
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className={cn(
                    'transition-colors duration-150',
                    '[border-bottom:1px_solid_var(--gs-border-subtle)]',
                    'hover:[background:var(--gs-muted)]',
                    index % 2 === 1 && '[background:var(--gs-muted)]/30',
                  )}
                >
                  {/* Image */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <img
                      src={product.image || placeholderImage}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover [background:var(--gs-muted)]"
                      loading="lazy"
                    />
                  </td>

                  {/* Barcode */}
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs [color:var(--gs-foreground-secondary)]">
                    {product.barcode}
                  </td>

                  {/* SKU */}
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs [color:var(--gs-foreground-secondary)]">
                    {product.sku}
                  </td>

                  {/* Name */}
                  <td className="px-3 py-2.5 whitespace-nowrap font-medium [color:var(--gs-foreground)] max-w-[200px]">
                    <span className="gsd-truncate block" title={product.name}>
                      {product.name}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-2.5 whitespace-nowrap [color:var(--gs-foreground-secondary)]">
                    {product.category.name}
                  </td>

                  {/* Brand */}
                  <td className="px-3 py-2.5 whitespace-nowrap [color:var(--gs-foreground-secondary)]">
                    {product.brand.name}
                  </td>

                  {/* Unit */}
                  <td className="px-3 py-2.5 whitespace-nowrap [color:var(--gs-foreground-secondary)] text-xs">
                    {product.unit.abbreviation}
                  </td>

                  {/* Purchase Price */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground-secondary)]">
                    {currencyFormatter.format(product.purchasePrice)}
                  </td>

                  {/* Selling Price */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums font-medium [color:var(--gs-foreground)]">
                    {currencyFormatter.format(product.sellingPrice)}
                  </td>

                  {/* Stock */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums">
                    <span
                      className={cn(
                        'font-medium',
                        product.stock === 0
                          ? '[color:var(--gs-danger)]'
                          : product.stock < 50
                            ? '[color:var(--gs-warning)]'
                            : '[color:var(--gs-foreground)]',
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'gsd-badge',
                        PRODUCT_STATUS_CONFIG[product.status]?.className ?? 'gsd-badge--neutral',
                      )}
                    >
                      {t(`status.${product.status}` as TranslationKey)}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-muted)]">
                    {dateFormatter.format(new Date(product.createdAt))}
                  </td>

                  {/* Updated Date */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-muted)]">
                    {dateFormatter.format(new Date(product.updatedAt))}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-0.5">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(product)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0"
                          aria-label={`${t('products.view')} ${product.name}`}
                          title={t('products.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0"
                          aria-label={`${t('products.edit')} ${product.name}`}
                          title={t('products.edit')}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(product)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0 hover:[color:var(--gs-danger)]"
                          aria-label={`${t('products.delete')} ${product.name}`}
                          title={t('products.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with row count */}
      <div className="flex items-center justify-between px-3 py-2.5 [border-top:1px_solid_var(--gs-border-subtle)]">
        <span className="text-xs [color:var(--gs-foreground-muted)]">
          {t('table.rowCount', { count: products.length })}
        </span>
      </div>
    </div>
  );
}
