/* ============================================================
   GSDS v1.1 — StatusSection Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Status selection form section
   ============================================================ */

import { ToggleLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import type { ProductFormData } from '../../types/productForm';

/* ─── Props ────────────────────────────────────────────────── */

interface StatusSectionProps {
  data: ProductFormData;
  onChange: (field: 'status', value: 'active' | 'inactive') => void;
}

/* ─── Status options ───────────────────────────────────────── */

const STATUS_OPTIONS: { value: 'active' | 'inactive'; labelKey: TranslationKey }[] = [
  { value: 'active', labelKey: 'form.active' },
  { value: 'inactive', labelKey: 'form.inactive' },
];

/* ─── StatusSection ────────────────────────────────────────── */

export function StatusSection({ data, onChange }: StatusSectionProps) {
  const { t } = useI18n();

  return (
    <fieldset className="gsd-card p-5">
      <legend className="flex items-center gap-2 text-base font-semibold [color:var(--gs-foreground)] mb-4">
        <ToggleLeft className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('form.status')}
      </legend>

      <div className="flex flex-wrap gap-3">
        {STATUS_OPTIONS.map((option) => {
          const isSelected = data.status === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('status', option.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium',
                'transition-all duration-150',
                isSelected
                  ? option.value === 'active'
                    ? '[background:var(--gs-success-soft)] [color:var(--gs-success)] [border-color:var(--gs-success)]'
                    : '[background:var(--gs-danger-soft)] [color:var(--gs-danger)] [border-color:var(--gs-danger)]'
                  : '[background:var(--gs-surface)] [color:var(--gs-foreground-secondary)] [border-color:var(--gs-border)]',
              )}
              aria-pressed={isSelected}
            >
              <span
                className={cn(
                  'h-3 w-3 rounded-full border-2',
                  isSelected
                    ? option.value === 'active'
                      ? '[border-color:var(--gs-success)] [background:var(--gs-success)]'
                      : '[border-color:var(--gs-danger)] [background:var(--gs-danger)]'
                    : '[border-color:var(--gs-border)]',
                )}
                aria-hidden="true"
              />
              {t(option.labelKey)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
