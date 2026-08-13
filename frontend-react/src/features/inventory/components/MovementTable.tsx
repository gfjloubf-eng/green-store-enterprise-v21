/* ============================================================
   GSDS v1.1 — MovementTable Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.4 — Stock movements data table
   ============================================================
   Pure presentation component.
   - No business logic.
   - No data manipulation.
   - Receives data through props only.
   ============================================================ */

import { ArrowUpDown, ArrowUp, ArrowDown, ArrowRightLeft, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import type { MovementDTO } from '../domain/movementDTO';
import { ProductService } from '@/features/products/services/productService';
import { MovementBadge } from './MovementBadge';

/* ─── Props ────────────────────────────────────────────────── */

interface MovementTableProps {
  /** Movements to display */
  movements: MovementDTO[];
  /** Current sort column ID */
  sortBy: string;
  /** Current sort direction */
  sortDirection: 'asc' | 'desc';
  /** Called when a column header is clicked for sorting */
  onSort: (columnId: string) => void;
  /** Optional class name override */
  className?: string;
}

/* ─── Column definitions ───────────────────────────────────── */

const MOVEMENT_COLUMNS = [
  { id: 'product', label: 'invMovementCol.product', sortable: false, width: '200px' },
  { id: 'type', label: 'invMovementCol.type', sortable: true, width: '130px' },
  { id: 'quantity', label: 'invMovementCol.quantity', sortable: true, width: '90px' },
  { id: 'from', label: 'invMovementCol.from', sortable: false, width: '150px' },
  { id: 'to', label: 'invMovementCol.to', sortable: false, width: '150px' },
  { id: 'reference', label: 'invMovementCol.reference', sortable: true, width: '130px' },
  { id: 'status', label: 'invMovementCol.status', sortable: true, width: '110px' },
  { id: 'performedAt', label: 'invMovementCol.performedAt', sortable: true, width: '140px' },
];

/* ─── Sort Icon Helper ─────────────────────────────────────── */

function SortIcon({
  columnId,
  currentSortBy,
  currentDirection,
}: {
  columnId: string;
  currentSortBy: string;
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

/* ─── MovementTable ────────────────────────────────────────── */

export function MovementTable({
  movements,
  sortBy,
  sortDirection,
  onSort,
  className,
}: MovementTableProps) {
  const { t } = useI18n();

  return (
    <div className={cn('gsd-surface overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full border-collapse text-sm" role="table">
          {/* ── Header ──────────────────────────────────── */}
          <thead>
            <tr className="[border-bottom:1px_solid_var(--gs-border)]">
              {MOVEMENT_COLUMNS.map((col) => (
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
                    <span>{t(col.label as TranslationKey)}</span>
                    {col.sortable && (
                      <SortIcon
                        columnId={col.id}
                        currentSortBy={sortBy}
                        currentDirection={sortDirection}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ────────────────────────────────────── */}
          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td
                  colSpan={MOVEMENT_COLUMNS.length}
                  className="px-3 py-12 text-center [color:var(--gs-foreground-muted)]"
                >
                  {t('invMovementTable.noMovements')}
                </td>
              </tr>
            ) : (
              movements.map((movement, index) => {
                const product = ProductService.getById(movement.productId);
                const productName = product?.name ?? movement.productId;
                return (
                  <tr
                    key={movement.id}
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
                        className="gsd-truncate block max-w-[180px] font-medium [color:var(--gs-foreground)]"
                        title={productName}
                      >
                        {productName}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <MovementBadge variant="type" type={movement.type} />
                    </td>

                    {/* Quantity */}
                    <td
                      className={cn(
                        'px-3 py-2.5 whitespace-nowrap tabular-nums font-medium',
                        movement.quantity < 0
                          ? '[color:var(--gs-danger)]'
                          : '[color:var(--gs-success)]',
                      )}
                    >
                      {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                    </td>

                    {/* From */}
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-secondary)]">
                      {movement.fromLocation?.name ?? '—'}
                    </td>

                    {/* To */}
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-secondary)]">
                      {movement.toLocation?.name ?? '—'}
                    </td>

                    {/* Reference */}
                    <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs [color:var(--gs-foreground-muted)]">
                      {movement.reference ?? '—'}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <MovementBadge variant="status" status={movement.status} />
                    </td>

                    {/* Performed At */}
                    <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-muted)]">
                      {dateFormatter.format(new Date(movement.performedAt))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2.5 [border-top:1px_solid_var(--gs-border-subtle)]">
        <span className="flex items-center gap-1.5 text-xs [color:var(--gs-foreground-muted)]">
          <History className="h-3.5 w-3.5" aria-hidden="true" />
          {t('invMovementTable.movementCount', { count: movements.length })}
        </span>
        <ArrowRightLeft className="h-3.5 w-3.5 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
      </div>
    </div>
  );
}

