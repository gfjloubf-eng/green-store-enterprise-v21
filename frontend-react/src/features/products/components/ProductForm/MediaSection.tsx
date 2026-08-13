/* ============================================================
   GSDS v1.1 — MediaSection Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Media / Image upload form section
   ============================================================ */

import { useState, useCallback, useEffect } from 'react';
import { Image, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';
import { placeholderImage } from '@/assets/images/products/productImages';
import type { ProductFormData } from '../../types/productForm';

/* ─── Props ────────────────────────────────────────────────── */

interface MediaSectionProps {
  data: ProductFormData;
  onChange: (field: 'imageUrl', value: string) => void;
}

/* ─── MediaSection ─────────────────────────────────────────── */

export function MediaSection({ data, onChange }: MediaSectionProps) {
  const { t } = useI18n();
  const [preview, setPreview] = useState<string>(data.imageUrl || '');

  useEffect(() => {
    setPreview(data.imageUrl || '');
  }, [data.imageUrl]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) return;

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreview(result);
        onChange('imageUrl', result);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleRemove = useCallback(() => {
    setPreview('');
    onChange('imageUrl', '');
  }, [onChange]);

  return (
    <fieldset className="gsd-card p-5">
      <legend className="flex items-center gap-2 text-base font-semibold [color:var(--gs-foreground)] mb-4">
        <Image className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('form.media')}
      </legend>

      <div className="flex flex-col items-center gap-4">
        {/* Image Preview */}
        <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
          <div className="relative w-full">
            <img
              src={preview || placeholderImage}
              alt={t('form.imagePreview')}
              className="w-full h-40 object-cover rounded-xl border [border-color:var(--gs-border)] [background:var(--gs-muted)]"
            />
            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -end-2 flex h-6 w-6 items-center justify-center rounded-full
                           [background:var(--gs-danger)] text-white shadow-md hover:brightness-110
                           transition-all duration-150"
                aria-label={t('form.removeImage')}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Upload Area */}
        <label
          className={cn(
            'flex flex-col items-center justify-center w-full h-24',
            'rounded-xl border-2 border-dashed [border-color:var(--gs-border)]',
            'cursor-pointer hover:[border-color:var(--gs-primary)]',
            'transition-all duration-150',
            '[background:var(--gs-muted)]',
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-6 w-6 [color:var(--gs-foreground-muted)]" aria-hidden="true" />
            <span className="text-xs font-medium [color:var(--gs-foreground-secondary)]">
              {t('form.imageUpload')}
            </span>
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            aria-label={t('form.imageUpload')}
          />
        </label>
      </div>
    </fieldset>
  );
}
