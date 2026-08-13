/* ============================================================
   GSDS v1.1 — InventoryTable Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Responsive inventory data table
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
  MapPin,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import {
  INVENTORY_TABLE_COLUMNS,
} from '../constants';
import type {
  InventorySummary,
  InventoryColumnId,
} from '../types/inventory';
import { StockBadge } from './StockBadge';

/* ─── Props ────────────────────────────────────────────────── */

interface InventoryTableProps {
  /** Inventory data to display */
  inventory: InventorySummary[];
  /** Current sort column ID */
  sortBy: InventoryColumnId;
  /** Current sort direction */
  sortDirection: 'asc' | 'desc';
  /** Called when a column header is clicked for sorting */
  onSort: (columnId: InventoryColumnId) => void;
  /** Called when "View" action is triggered */
  onView?: (item: InventorySummary) => void;
  /** Optional class name override */
  className?: string;
}

/* ─── Sort Icon Helper ─────────────────────────────────────── */

function SortIcon({
  columnId,
  currentSortBy,
  currentDirection,
}: {
  columnId: InventoryColumnId;
  currentSortBy: InventoryColumnId;
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

/* ─── Date Formatter ───────────────────────────────────────── */

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/* ─── InventoryTable ───────────────────────────────────────── */

export function InventoryTable({
  inventory,
  sortBy,
  sortDirection,
  onSort,
  onView,
  className,
}: InventoryTableProps) {
  const { t } = useI18n();

  return (
    <div className={cn('gsd-surface overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full border-collapse text-sm" role="table">
          {/* ── Header ──────────────────────────────────── */}
          <thead>
            <tr className="[border-bottom:1px_solid_var(--gs-border)]">
              {INVENTORY_TABLE_COLUMNS.map((col) => {
                const columnLabelKey = `invTable.${col.id}`;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      'px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]',
                      col.sortable &&
                        'cursor-pointer select-none hover:[color:var(--gs-foreground-secondary)]',
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
            {inventory.length === 0 ? (
              <tr>
                <td
                  colSpan={INVENTORY_TABLE_COLUMNS.length}
                  className="px-3 py-12 text-center [color:var(--gs-foreground-muted)]"
                >
                  {t('invTable.noInventory')}
                </td>
              </tr>
            ) : (
              inventory.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    'transition-colors duration-150',
                    '[border-bottom:1px_solid_var(--gs-border-subtle)]',
                    'hover:[background:var(--gs-muted)]',
                    index % 2 === 1 && '[background:var(--gs-muted)]/30',
                  )}
                >
                  {/* Product */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span
                      className="gsd-truncate block max-w-[200px] font-medium [color:var(--gs-foreground)]"
                      title={item.productName}
                    >
                      {item.productName}
                    </span>
                  </td>

                  {/* SKU */}
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs [color:var(--gs-foreground-secondary)]">
                    {item.sku}
                  </td>

                  {/* Barcode */}
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs [color:var(--gs-foreground-secondary)]">
                    {item.barcode}
                  </td>

                  {/* On Hand */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {item.quantityOnHand}
                  </td>

                  {/* Reserved */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground-secondary)]">
                    {item.quantityReserved}
                  </td>

                  {/* Available */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums">
                    <span
                      className={cn(
                        'font-medium',
                        item.quantityAvailable === 0
                          ? '[color:var(--gs-danger)]'
                          : item.quantityAvailable < item.minStock
                            ? '[color:var(--gs-warning)]'
                            : '[color:var(--gs-foreground)]',
                      )}
                    >
                      {item.quantityAvailable}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-secondary)]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {item.location.name}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <StockBadge status={item.status} />
                  </td>

                  {/* Last Movement */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-muted)]">
                    {dateFormatter.format(new Date(item.lastMovementAt))}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-0.5">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(item)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0"
                          aria-label={`${t('inventory.view')} ${item.productName}`}
                          title={t('inventory.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <span
                        className="h-8 w-8 flex items-center justify-center text-xs [color:var(--gs-foreground-muted)]"
                        title={t('inventory.thresholds')}
                      >
                        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                      </span>
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
          {t('invTable.rowCount', { count: inventory.length })}
        </span>
      </div>
    </div>
  );
}

