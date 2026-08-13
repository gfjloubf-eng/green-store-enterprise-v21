/* ============================================================
   GSDS v1.1 â€” PurchaseTable Component
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Responsive purchase order data table
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { PURCHASE_TABLE_COLUMNS } from '../constants';
import type { PurchaseTableModel } from '../domain/purchaseTableModel';
import type { PurchaseColumnId } from '../types/purchasing';
import { PurchaseStatusBadge } from './PurchaseStatusBadge';

/* â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface PurchaseTableProps {
  /** Purchase order data to display */
  orders: PurchaseTableModel[];
  /** Current sort column ID */
  sortBy: PurchaseColumnId;
  /** Current sort direction */
  sortDirection: 'asc' | 'desc';
  /** Called when a column header is clicked for sorting */
  onSort: (columnId: PurchaseColumnId) => void;
  /** Called when "View" action is triggered */
  onView?: (order: PurchaseTableModel) => void;
  /** Optional class name override */
  className?: string;
}

/* â”€â”€â”€ Sort Icon Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function SortIcon({
  columnId,
  currentSortBy,
  currentDirection,
}: {
  columnId: PurchaseColumnId;
  currentSortBy: PurchaseColumnId;
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

/* â”€â”€â”€ Formatters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
});

/* â”€â”€â”€ PurchaseTable â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function PurchaseTable({
  orders,
  sortBy,
  sortDirection,
  onSort,
  onView,
  className,
}: PurchaseTableProps) {
  const { t } = useI18n();

  return (
    <div className={cn('gsd-surface overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full border-collapse text-sm" role="table">
          {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <thead>
            <tr className="[border-bottom:1px_solid_var(--gs-border)]">
              {PURCHASE_TABLE_COLUMNS.map((col) => {
                const columnLabelKey = `purchaseTable.${col.id}`;
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

          {/* â”€â”€ Body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={PURCHASE_TABLE_COLUMNS.length}
                  className="px-3 py-12 text-center [color:var(--gs-foreground-muted)]"
                >
                  {t('purchaseTable.noOrders')}
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className={cn(
                    'transition-colors duration-150',
                    '[border-bottom:1px_solid_var(--gs-border-subtle)]',
                    'hover:[background:var(--gs-muted)]',
                    index % 2 === 1 && '[background:var(--gs-muted)]/30',
                  )}
                >
                  {/* Code */}
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs [color:var(--gs-foreground-secondary)]">
                    {order.code}
                  </td>

                  {/* Supplier */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span
                      className="gsd-truncate block max-w-[190px] font-medium [color:var(--gs-foreground)]"
                      title={order.supplier.name}
                    >
                      {order.supplier.name}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <PurchaseStatusBadge status={order.status} />
                  </td>

                  {/* Items */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {order.itemCount}
                  </td>

                  {/* Quantity */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {order.totalQuantity}
                  </td>

                  {/* Total Cost */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {currencyFormatter.format(order.totalCost)}
                  </td>

                  {/* Expected */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-muted)]">
                    {order.expectedAt
                      ? dateFormatter.format(new Date(order.expectedAt))
                      : 'â€”'}
                  </td>

                  {/* Ordered */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-muted)]">
                    {dateFormatter.format(new Date(order.orderedAt))}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-0.5">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(order)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0"
                          aria-label={`${t('purchasing.view')} ${order.code}`}
                          title={t('purchasing.view')}
                        >
                          <Eye className="h-4 w-4" />
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
          {t('purchaseTable.rowCount', { count: orders.length })}
        </span>
      </div>
    </div>
  );
}
