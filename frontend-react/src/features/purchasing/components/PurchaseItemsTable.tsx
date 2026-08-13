/* ============================================================
   GSDS v1.1 â€” PurchaseItemsTable Component
   Green Store Design System â€” Enterprise UI Foundation
   Milestone 4.6 â€” Purchase order line items table
   ============================================================
   Pure presentation component.
   - Displays the line items of a purchase order.
   - No business logic.
   ============================================================ */

import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';
import type { PurchaseItemDTO } from '../domain/purchaseItemDTO';
import { ProductService } from '@/features/products/services/productService';

/* â”€â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

interface PurchaseItemsTableProps {
  /** Purchase order line items */
  items: PurchaseItemDTO[];
  /** Optional class name override */
  className?: string;
}

/* â”€â”€â”€ Formatters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 2,
});

/* â”€â”€â”€ Product Name Resolver â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function resolveProductName(productId: string): string {
  const product = ProductService.getById(productId);
  return product ? product.name : productId;
}

/* â”€â”€â”€ PurchaseItemsTable â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function PurchaseItemsTable({
  items,
  className,
}: PurchaseItemsTableProps) {
  const { t } = useI18n();

  return (
    <div className={cn('gsd-surface overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full border-collapse text-sm" role="table">
          <thead>
            <tr className="[border-bottom:1px_solid_var(--gs-border)]">
              <th className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]">
                {t('purchaseItemsTable.product')}
              </th>
              <th className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]">
                {t('purchaseItemsTable.quantity')}
              </th>
              <th className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]">
                {t('purchaseItemsTable.received')}
              </th>
              <th className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]">
                {t('purchaseItemsTable.unitCost')}
              </th>
              <th className="px-3 py-3 text-start text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]">
                {t('purchaseItemsTable.tax')}
              </th>
              <th className="px-3 py-3 text-end text-xs font-semibold uppercase tracking-wider [color:var(--gs-foreground-muted)]">
                {t('purchaseItemsTable.lineTotal')}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-12 text-center [color:var(--gs-foreground-muted)]"
                >
                  {t('purchaseItemsTable.noItems')}
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    'transition-colors duration-150',
                    '[border-bottom:1px_solid_var(--gs-border-subtle)]',
                    'hover:[background:var(--gs-muted)]',
                    index % 2 === 1 && '[background:var(--gs-muted)]/30',
                  )}
                >
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="gsd-truncate block max-w-[200px] font-medium [color:var(--gs-foreground)]">
                      {resolveProductName(item.productId)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {item.quantityReceived}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {currencyFormatter.format(item.unitCost)}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums [color:var(--gs-foreground)]">
                    {item.taxRate}%
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap tabular-nums text-end [color:var(--gs-foreground)]">
                    {currencyFormatter.format(item.lineTotal)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
