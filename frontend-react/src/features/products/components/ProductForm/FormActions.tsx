/* ============================================================
   GSDS v1.1 — FormActions Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Form action buttons
   ============================================================ */

import { Save, X, RotateCcw } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';

/* ─── Props ────────────────────────────────────────────────── */

interface FormActionsProps {
  /** Called when Save is clicked */
  onSave: () => void;
  /** Called when Cancel is clicked */
  onCancel: () => void;
  /** Called when Reset is clicked */
  onReset: () => void;
  /** Whether the form is in a saving state */
  isSaving?: boolean;
  /** Whether the form is valid (disable save if invalid) */
  isValid?: boolean;
}

/* ─── FormActions ──────────────────────────────────────────── */

export function FormActions({ onSave, onCancel, onReset, isSaving = false, isValid = true }: FormActionsProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 [border-top:1px_solid_var(--gs-border-subtle)]">
      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        disabled={isSaving}
        className="gsd-btn gsd-btn--ghost gsd-btn--md"
        aria-label={t('form.reset')}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        {t('form.reset')}
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="gsd-btn gsd-btn--secondary gsd-btn--md"
        aria-label={t('form.cancel')}
      >
        <X className="h-4 w-4" aria-hidden="true" />
        {t('form.cancel')}
      </button>

      {/* Save */}
      <button
        type="button"
        onClick={onSave}
        disabled={!isValid || isSaving}
        className="gsd-btn gsd-btn--primary gsd-btn--md"
        aria-label={t('form.save')}
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        {t('form.save')}
      </button>
    </div>
  );
}
