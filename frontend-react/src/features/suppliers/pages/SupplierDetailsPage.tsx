/* ============================================================
   GSDS v1.1 — SupplierDetailsPage
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.5 — Supplier details view
   ============================================================ */

import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Mail, MapPin, Globe, Calendar } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { useSupplierDetails } from '../hooks/useSupplierService';
import { getData, isState, getErrorMessage } from '../state/supplierState';
import { SupplierStatusBadge } from '../components/SupplierStatusBadge';
import { SupplierBadge } from '../components/SupplierBadge';

export function SupplierDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();
  const state = useSupplierDetails(id);
  const supplier = getData(state);
  const isLoading = isState(state, 'loading');
  const isError = isState(state, 'error');
  const errorMessage = getErrorMessage(state);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/suppliers')}
          className="gsd-btn gsd-btn--ghost gsd-btn--sm h-9 w-9 p-0"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-h2 font-semibold [color:var(--gs-foreground)] flex items-center gap-2">
            <Building2 className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
            {supplier ? supplier.name : t('suppliers.details.title')}
          </h1>
          <BreadcrumbEngine className="mt-1" />
        </div>
      </div>

      {/* Content */}
      <div className="gsd-card p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm [color:var(--gs-foreground-muted)]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {t('common.loading')}
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-danger-soft)]">
              <Building2 className="h-8 w-8 [color:var(--gs-danger)]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
              {t('errors.notFound')}
            </h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
              {errorMessage || t('suppliers.details.notFoundDesc', { id: id || '' })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/suppliers')}
              className="gsd-btn gsd-btn--primary gsd-btn--md mt-2"
            >
              {t('suppliers.backToList')}
            </button>
          </div>
        ) : supplier ? (
          <div className="flex flex-col gap-6">
            {/* Supplier info header */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl [background:var(--gs-primary-soft)]">
                <Building2 className="h-8 w-8 [color:var(--gs-primary)]" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-semibold [color:var(--gs-foreground)]">
                    {supplier.name}
                  </h2>
                  <SupplierStatusBadge status={supplier.status} />
                </div>
                <p className="text-sm [color:var(--gs-foreground-secondary)] mt-1">
                  {t('suppliers.details.code')}: {supplier.code}
                </p>
                <div className="mt-2">
                  <SupplierBadge category={supplier.category} />
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="gsd-surface p-4 w-full text-sm">
              <h3 className="text-sm font-semibold [color:var(--gs-foreground)] mb-3">
                {t('suppliers.details.contactInfo')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 [color:var(--gs-primary)] shrink-0" aria-hidden="true" />
                  <span className="[color:var(--gs-foreground-muted)]">{t('suppliers.details.field.email')}:</span>
                  <span className="[color:var(--gs-foreground)]">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 [color:var(--gs-primary)] shrink-0" aria-hidden="true" />
                  <span className="[color:var(--gs-foreground-muted)]">{t('suppliers.details.field.phone')}:</span>
                  <span className="[color:var(--gs-foreground)]">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 [color:var(--gs-primary)] shrink-0" aria-hidden="true" />
                  <span className="[color:var(--gs-foreground-muted)]">{t('suppliers.details.field.city')}:</span>
                  <span className="[color:var(--gs-foreground)]">{supplier.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 [color:var(--gs-primary)] shrink-0" aria-hidden="true" />
                  <span className="[color:var(--gs-foreground-muted)]">{t('suppliers.details.field.address')}:</span>
                  <span className="[color:var(--gs-foreground)]">{supplier.address || '—'}</span>
                </div>
              </div>
            </div>

            {/* Contact person */}
            <div className="gsd-surface p-4 w-full text-sm">
              <h3 className="text-sm font-semibold [color:var(--gs-foreground)] mb-3">
                {t('suppliers.details.primaryContact')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <span className="[color:var(--gs-foreground-muted)]">{t('suppliers.details.field.contactName')}:</span>
                <span className="[color:var(--gs-foreground)]">{supplier.contact.name}</span>
                {supplier.contact.role && (
                  <>
                    <span className="[color:var(--gs-foreground-muted)]">{t('suppliers.details.field.contactRole')}:</span>
                    <span className="[color:var(--gs-foreground)]">{supplier.contact.role}</span>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="gsd-surface p-4 w-full text-sm">
              <h3 className="text-sm font-semibold [color:var(--gs-foreground)] mb-3">
                {t('suppliers.details.stats')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <span className="[color:var(--gs-foreground-muted)] text-xs">{t('suppliers.details.field.products')}</span>
                  <span className="[color:var(--gs-foreground)] font-semibold text-lg">{supplier.productCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="[color:var(--gs-foreground-muted)] text-xs">{t('suppliers.details.field.totalPurchases')}</span>
                  <span className="[color:var(--gs-foreground)] font-semibold text-lg">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(supplier.totalPurchases)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="[color:var(--gs-foreground-muted)] text-xs">{t('suppliers.details.field.lastOrder')}</span>
                  <span className="[color:var(--gs-foreground)] font-semibold text-lg">
                    {supplier.lastOrderAt ? dateFormatter.format(new Date(supplier.lastOrderAt)) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-xs [color:var(--gs-foreground-muted)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {t('suppliers.details.createdAt')}: {dateFormatter.format(new Date(supplier.createdAt))}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {t('suppliers.details.updatedAt')}: {dateFormatter.format(new Date(supplier.updatedAt))}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}
                className="gsd-btn gsd-btn--primary gsd-btn--md"
              >
                {t('suppliers.edit')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/suppliers')}
                className="gsd-btn gsd-btn--secondary gsd-btn--md"
              >
                {t('suppliers.backToList')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full [background:var(--gs-muted)]">
              <Building2 className="h-8 w-8 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
              {t('suppliers.details.notFound')}
            </h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)] max-w-md">
              {t('suppliers.details.notFoundDesc', { id: id || '' })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/suppliers')}
              className="gsd-btn gsd-btn--primary gsd-btn--md mt-2"
            >
              {t('suppliers.backToList')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
