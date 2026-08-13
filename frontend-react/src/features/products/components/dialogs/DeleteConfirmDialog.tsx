/* ============================================================
   GSDS v1.1 — DeleteConfirmDialog Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.1 — Placeholder dialog only
   ============================================================
   Placeholder only.
   - No validation.
   - No submission.
   - No form processing.
   ============================================================ */

import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';

/* ─── Props ────────────────────────────────────────────────── */

interface DeleteConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close */
  onClose: () => void;
}

/* ─── DeleteConfirmDialog ──────────────────────────────────── */

export function DeleteConfirmDialog({ open, onClose }: DeleteConfirmDialogProps) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--gs-z-overlay)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('dialog.deleteTitle')}
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
          'gsd-elevated relative w-full max-w-sm p-6 animate-scale-in',
          '[background:var(--gs-surface)]',
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full [background:var(--gs-danger-soft)]">
            <AlertTriangle className="h-6 w-6 [color:var(--gs-danger)]" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">
              {t('dialog.deleteTitle')}
            </h2>
            <p className="text-sm [color:var(--gs-foreground-secondary)] mt-1">
              {t('dialog.deleteDescription')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="gsd-btn gsd-btn--ghost gsd-btn--sm h-8 w-8 p-0 shrink-0"
            aria-label={t('dialog.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Placeholder footer */}
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
            className="gsd-btn gsd-btn--danger gsd-btn--sm"
          >
            {t('dialog.confirmDelete')}
          </button>
        </div>
      </div>
    </div>
  );
}
