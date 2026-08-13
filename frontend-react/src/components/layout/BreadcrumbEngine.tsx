/* ============================================================
   GSDS v1.0 — BreadcrumbEngine Component
   Auto-generates breadcrumbs from the current route path,
   compatible with BrowserRouter (non-data-router).
   ============================================================ */

import { useLocation } from 'react-router-dom';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';

/* ─── Breadcrumb Segment ──────────────────────────────────── */

interface BreadcrumbSegment {
  titleKey: string;
  icon?: LucideIcon;
}

/**
 * Route-to-breadcrumb mapping derived from App.tsx route definitions.
 * Keys are path segments; the root "/" is handled separately.
 */
const ROUTE_BREADCRUMBS: Record<string, BreadcrumbSegment> = {
  /* Root-level routes */
  workspace:  { titleKey: 'breadcrumb.workspace' },
  components: { titleKey: 'breadcrumb.components' },
  layouts:    { titleKey: 'breadcrumb.layouts' },
  'layouts/sidebar': { titleKey: 'breadcrumb.sidebar' },
  'layouts/grid':    { titleKey: 'breadcrumb.grid' },
  settings:   { titleKey: 'breadcrumb.settings' },
  help:       { titleKey: 'breadcrumb.help' },
  /* Product Module */
  products:           { titleKey: 'breadcrumb.products' },
  'products/create':     { titleKey: 'breadcrumb.create' },
  'products/:id/edit':   { titleKey: 'breadcrumb.edit' },
  'products/categories': { titleKey: 'breadcrumb.categories' },
  'products/brands':     { titleKey: 'breadcrumb.brands' },
  'products/units':      { titleKey: 'breadcrumb.units' },
  'products/barcode':    { titleKey: 'breadcrumb.barcode' },
  'products/:id':        { titleKey: 'breadcrumb.details' },
  /* Inventory Module */
  inventory:              { titleKey: 'breadcrumb.inventory' },
  inventoryDashboard:     { titleKey: 'breadcrumb.inventoryDashboard' },
  'inventory/overview':   { titleKey: 'breadcrumb.stockOverview' },
  'inventory/movements':  { titleKey: 'breadcrumb.stockMovements' },
  'inventory/adjustment': { titleKey: 'breadcrumb.stockAdjustment' },
  'inventory/transfer':   { titleKey: 'breadcrumb.stockTransfer' },
  'inventory/low-stock':  { titleKey: 'breadcrumb.lowStock' },
  'inventory/out-of-stock': { titleKey: 'breadcrumb.outOfStock' },
  'inventory/reports':    { titleKey: 'breadcrumb.inventoryReports' },
  /* Supplier Module */
  suppliers:             { titleKey: 'breadcrumb.suppliers' },
  'suppliers/list':       { titleKey: 'breadcrumb.suppliersList' },
  'suppliers/create':     { titleKey: 'breadcrumb.createSupplier' },
  'suppliers/:id/edit':   { titleKey: 'breadcrumb.editSupplier' },
  'suppliers/categories': { titleKey: 'breadcrumb.supplierCategories' },
  'suppliers/contacts':   { titleKey: 'breadcrumb.supplierContacts' },
  'suppliers/reports':    { titleKey: 'breadcrumb.supplierReports' },
  'suppliers/:id':        { titleKey: 'breadcrumb.supplierDetails' },
};

/**
 * Module parents that can contain dynamic :id segments.
 * Used to normalise real ID values back to template keys.
 */
const DYNAMIC_ROUTE_MODULES = new Set(['products', 'suppliers']);

/**
 * Normalise dynamic segments (e.g. a real supplier/product ID) to a
 * ":id" wildcard so template breadcrumb keys can resolve.
 */
function normalizeDynamicPath(path: string): string {
  const pathParts = path.split('/');
  return pathParts
    .map((segment, index) => {
      const parent = pathParts[index - 1];
      if (
        index > 0 &&
        DYNAMIC_ROUTE_MODULES.has(parent) &&
        /^[A-Za-z0-9-]+$/.test(segment)
      ) {
        return ':id';
      }
      return segment;
    })
    .join('/');
}

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];

  // Always start with Home as the root crumb
  segments.push({ titleKey: 'breadcrumb.home' });

  const parts = pathname.split('/').filter(Boolean);

  let path = '';
  for (const part of parts) {
    path = path ? `${path}/${part}` : part;

    let config = ROUTE_BREADCRUMBS[path];

    // Dynamic route fallback: normalise a real ID segment to ":id".
    if (!config) {
      config = ROUTE_BREADCRUMBS[normalizeDynamicPath(path)];
    }

    if (config) {
      segments.push({ titleKey: config.titleKey, icon: config.icon });
    } else {
      // Fallback: humanise the segment if not in config
      segments.push({ titleKey: part.charAt(0).toUpperCase() + part.slice(1) });
    }
  }

  return segments;
}

/* ─── BreadcrumbEngine ────────────────────────────────────── */

interface BreadcrumbEngineProps {
  /** Optional class name override */
  className?: string;
}

export function BreadcrumbEngine({ className }: BreadcrumbEngineProps) {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const crumbs = buildBreadcrumbs(pathname);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label={t('breadcrumb.home')} className={cn('gsd-breadcrumb flex items-center gap-1', className)}>
      <ol className="flex items-center gap-1 text-sm [color:var(--gs-foreground-secondary)]" role="list">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
const crumbTitle = t(crumb.titleKey as TranslationKey) || crumb.titleKey;
          return (
            <li key={crumb.titleKey} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
              )}
              <span
                className={cn(
                  'flex items-center gap-1.5 truncate max-w-[160px]',
                  isLast
                    ? '[color:var(--gs-foreground)] font-medium'
                    : '[color:var(--gs-foreground-secondary)]',
                )}
              >
                {crumb.icon && (
                  <crumb.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
                {crumbTitle}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
