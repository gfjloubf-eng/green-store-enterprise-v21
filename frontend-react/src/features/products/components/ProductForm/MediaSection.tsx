import { useState, useCallback, useEffect } from 'react';
import { Image, X, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';
import { placeholderImage } from '@/assets/images/products/productImages';
import type { ProductFormData } from '../../types/productForm';
import { compressProductImage, formatImageSize } from '../../utils/compressProductImage';
import { ProductService } from '../../services/productService';

function imageUploadErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : String(error || 'image_processing_failed');
  const messages: Record<string, string> = {
    image_type_invalid: 'صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP.',
    image_too_large: 'الصورة الأصلية أكبر من 8MB. اختر صورة أصغر.',
    image_decode_failed: 'تعذر قراءة الصورة في المتصفح. جرّب صورة أخرى أو افتح الصفحة مجدداً.',
    image_canvas_unavailable: 'المتصفح لا يستطيع تجهيز الصورة حالياً.',
    storage_not_configured: 'إعدادات التخزين غير مفعلة في الخادم.',
    authentication_required: 'انتهت جلسة الأدمن. سجّل الدخول ثم أعد المحاولة.',
    authorization_denied: 'الحساب لا يملك صلاحية رفع صور المنتجات.',
    storage_upload_invalid_response: 'الخادم لم يُرجع رابط الصورة الدائم.',
  };
  const matched = Object.keys(messages).find((key) => code.includes(key));
  return matched ? messages[matched] : `تعذر رفع الصورة: ${code}`;
}

interface MediaSectionProps {
  data: ProductFormData;
  onChange: (field: 'imageUrl' | 'imageAltText', value: string) => void;
}

export function MediaSection({ data, onChange }: MediaSectionProps) {
  const { t } = useI18n();
  const [preview, setPreview] = useState<string>(data.imageUrl || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    setPreview(data.imageUrl || '');
  }, [data.imageUrl]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const compressed = await compressProductImage(file);
      setPreview(compressed.dataUrl);
      setCompressedSize(compressed.bytes);
      setDimensions({ width: compressed.width, height: compressed.height });
      const uploaded = await ProductService.uploadImage(compressed.dataUrl, data.sku);
      setPreview(uploaded.url);
      onChange('imageUrl', uploaded.url);
      if (!data.imageAltText.trim()) onChange('imageAltText', data.productName.trim());
    } catch (err) {
      setError(imageUploadErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }, [data.imageAltText, data.productName, onChange]);

  const handleRemove = useCallback(() => {
    setPreview('');
    setCompressedSize(null);
    setDimensions(null);
    onChange('imageUrl', '');
  }, [onChange]);

  return (
    <fieldset className="gsd-card p-5">
      <legend className="flex items-center gap-2 text-base font-semibold [color:var(--gs-foreground)] mb-4">
        <Image className="h-5 w-5 [color:var(--gs-primary)]" aria-hidden="true" />
        {t('form.media')}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 items-start">
        <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
          <div className="relative w-full">
            <img
              src={preview || placeholderImage}
              alt={data.imageAltText || data.productName || t('form.imagePreview')}
              className="w-full h-40 object-cover rounded-xl border [border-color:var(--gs-border)] [background:var(--gs-muted)]"
            />
            {preview && (
              <button type="button" onClick={handleRemove}
                className="absolute -top-2 -end-2 flex h-7 w-7 items-center justify-center rounded-full [background:var(--gs-danger)] text-white shadow-md"
                aria-label={t('form.removeImage')}>
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {compressedSize !== null && (
            <p className="text-xs text-center [color:var(--gs-foreground-muted)]">
              {t('form.imageSizeLabel')}: {formatImageSize(compressedSize)}{dimensions ? ` · ${dimensions.width}×${dimensions.height}` : ''}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className={cn(
            'flex flex-col items-center justify-center w-full min-h-[120px] rounded-xl border-2 border-dashed [border-color:var(--gs-border)]',
            'cursor-pointer hover:[border-color:var(--gs-primary)] [background:var(--gs-muted)]',
          )}>
            {busy ? <Loader2 className="h-7 w-7 animate-spin [color:var(--gs-primary)]" aria-hidden="true" /> : <Upload className="h-7 w-7 [color:var(--gs-foreground-muted)]" aria-hidden="true" />}
            <span className="mt-2 text-xs font-medium [color:var(--gs-foreground-secondary)]">
              {busy ? 'جارٍ ضغط ورفع الصورة…' : t('form.imageUpload')}
            </span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={busy} className="hidden" aria-label={t('form.imageUpload')} />
          </label>
          <p className="text-xs [color:var(--gs-foreground-muted)]">{t('form.imageUploadHint')}</p>
          <p className="text-xs [color:var(--gs-foreground-muted)]">{t('form.imageCompressionHint')}</p>
          <label className="flex flex-col gap-1.5 text-sm font-medium [color:var(--gs-foreground)]">
            النص البديل للصورة
            <input value={data.imageAltText} onChange={(e) => onChange('imageAltText', e.target.value)} className="gsd-input" placeholder="مثال: جزر طازج" maxLength={255} />
          </label>
          {error && <p className="text-xs [color:var(--gs-danger)]" role="alert">{error}</p>}
        </div>
      </div>
    </fieldset>
  );
}
