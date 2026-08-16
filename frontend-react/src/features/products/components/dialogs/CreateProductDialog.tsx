import { X, PackagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';
import { ProductForm } from '../ProductForm/ProductForm';

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProductDialog({ open, onClose }: CreateProductDialogProps) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--gs-z-overlay)] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={t('dialog.createTitle')}
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
          'gsd-elevated relative w-full max-w-3xl p-4 sm:p-6 animate-scale-in max-h-[90vh] overflow-y-auto rounded-3xl',
          '[background:var(--gs-surface)]',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[color:var(--gs-border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl [background:var(--gs-primary-soft)]">
              <PackagePlus className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold [color:var(--gs-foreground)]">
                {t('dialog.createTitle')}
              </h2>
              <p className="text-xs [color:var(--gs-foreground-muted)]">
                {t('dialog.createDescription')}
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

        {/* Product Form */}
        <ProductForm onSuccess={onClose} onCancel={onClose} />
      </div>
    </div>
  );
}
