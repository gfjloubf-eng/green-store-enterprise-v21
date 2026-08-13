/* ============================================================
   GSDS v1.1 — SupplierTable Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Responsive supplier data table
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
import { SUPPLIER_TABLE_COLUMNS } from '../constants';
import type { SupplierTableModel } from '../domain/supplierTableModel';
import type { SupplierColumnId } from '../types/supplier';
import { SupplierStatusBadge } from './SupplierStatusBadge';
import { SupplierBadge } from './SupplierBadge';

/* ─── Props ────────────────────────────────────────────────── */

interface SupplierTableProps {
  /** Supplier data to display */
  suppliers: SupplierTableModel[];
  /** Current sort column ID */
  sortBy: SupplierColumnId;
  /** Current sort direction */
  sortDirection: 'asc' | 'desc';
  /** Called when a column header is clicked for sorting */
  onSort: (columnId: SupplierColumnId) => void;
  /** Called when "View" action is triggered */
  onView?: (supplier: SupplierTableModel) => void;
  /** Called when "Edit" action is triggered */
  onEdit?: (supplier: SupplierTableModel) => void;
  /** Called when "Delete" action is triggered */
  onDelete?: (supplier: SupplierTableModel) => void;
  /** Optional class name override */
  className?: string;
}

/* ─── Sort Icon Helper ─────────────────────────────────────── */

function SortIcon({
  columnId,
  currentSortBy,
  currentDirection,
}: {
  columnId: SupplierColumnId;
  currentSortBy: SupplierColumnId;
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

/* ─── Formatters ───────────────────────────────────────────── */

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

/* ─── SupplierTable ────────────────────────────────────────── */

export function SupplierTable({
  suppliers,
  sortBy,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  className,
}: SupplierTableProps) {
  const { t } = useI18n();

  return (
    <div className={cn('gsd-surface overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full border-collapse text-sm" role="table">
          {/* ── Header ──────────────────────────────────── */}
          <thead>
            <tr className="[border-bottom:1px_solid_var(--gs-border)]">
              {SUPPLIER_TABLE_COLUMNS.map((col) => {
                const columnLabelKey = `supplierTable.${col.id}`;
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
            {suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan={SUPPLIER_TABLE_COLUMNS.length}
                  className="px-3 py-12 text-center [color:var(--gs-foreground-muted)]"
                >
                  {t('supplierTable.noSuppliers')}
                </td>
              </tr>
            ) : (
              suppliers.map((supplier, index) => (
                <tr
                  key={supplier.id}
                  className={cn(
                    'transition-colors duration-150',
                    '[border-bottom:1px_solid_var(--gs-border-subtle)]',
                    'hover:[background:var(--gs-muted)]',
                    index % 2 === 1 && '[background:var(--gs-muted)]/30',
                  )}
                >
                  {/* Code */}
                  <td className="px-3 py-2.5 whitespace-nowrap font-mono text-xs [color:var(--gs-foreground-secondary)]">
                    {supplier.code}
                  </td>

                  {/* Name */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span
                      className="gsd-truncate block max-w-[190px] font-medium [color:var(--gs-foreground)]"
                      title={supplier.name}
                    >
                      {supplier.name}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <SupplierBadge category={supplier.category} />
                  </td>

                  {/* Contact */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="block text-xs [color:var(--gs-foreground)]">
                      {supplier.contact.name}
                    </span>
                    {supplier.contact.role && (
                      <span className="block text-[10px] [color:var(--gs-foreground-muted)]">
                        {supplier.contact.role}
                      </span>
                    )}
                  </td>

                  {/* Email */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-secondary)]">
                    {supplier.email}
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-secondary)]">
                    {supplier.phone}
                  </td>

                  {/* City */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-secondary)]">
                    {supplier.city}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <SupplierStatusBadge status={supplier.status} />
                  </td>

                  {/* Products */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {supplier.productCount}
                  </td>

                  {/* Total Purchases */}
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {currencyFormatter.format(supplier.totalPurchases)}
                  </td>

                  {/* Last Order */}
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs [color:var(--gs-foreground-muted)]">
                    {supplier.lastOrderAt
                      ? dateFormatter.format(new Date(supplier.lastOrderAt))
                      : '—'}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-0.5">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(supplier)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0"
                          aria-label={`${t('suppliers.view')} ${supplier.name}`}
                          title={t('suppliers.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(supplier)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0"
                          aria-label={`${t('suppliers.edit')} ${supplier.name}`}
                          title={t('suppliers.edit')}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(supplier)}
                          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0 [color:var(--gs-danger)] hover:[background:var(--gs-danger-soft)]"
                          aria-label={`${t('suppliers.delete')} ${supplier.name}`}
                          title={t('suppliers.delete')}
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
          {t('supplierTable.rowCount', { count: suppliers.length })}
        </span>
      </div>
    </div>
  );
}

