/* ============================================================
   GSDS v1.1 — EditProductDialog Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1 — Placeholder dialog only
   ============================================================
   Placeholder only.
   - No validation.
   - No submission.
   - No form processing.
   ============================================================ */

import { X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';

/* ─── Props ────────────────────────────────────────────────── */

interface EditProductDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
}

/* ─── EditProductDialog ────────────────────────────────────── */

export function EditProductDialog({ open, onClose }: EditProductDialogProps) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--gs-z-overlay)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('dialog.editTitle')}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 [background:var(--gs-overlay)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        className={cn(
          'gsd-elevated relative w-full max-w-lg p-6 animate-scale-in',
          '[background:var(--gs-surface)]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg [background:var(--gs-primary-soft)]">
              <Pencil className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
                {t('dialog.editTitle')}
              </h2>
              <p className="text-xs [color:var(--gs-foreground-muted)]">
                {t('dialog.editDescription')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0"
            aria-label={t('dialog.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Placeholder body */}
        <div className="py-8 text-center">
          <p className="text-sm [color:var(--gs-foreground-secondary)]">
            {t('dialog.futureMilestone')}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 [border-top:1px_solid_var(--gs-border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            className="gsd-btn gsd-btn--secondary gsd-btn--sm"
          >
            {t('dialog.cancel')}
          </button>
          <button
            type="button"
            disabled
            className="gsd-btn gsd-btn--primary gsd-btn--sm"
          >
            {t('dialog.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}
