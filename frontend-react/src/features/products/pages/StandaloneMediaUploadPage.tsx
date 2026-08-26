import { useCallback, useState } from 'react';
import { ArrowLeft, CheckCircle2, ImagePlus, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/productService';
import { compressProductImage, formatImageSize } from '../utils/compressProductImage';
import { placeholderImage } from '@/assets/images/products/productImages';

function friendlyError(error: unknown): string {
  const code = error instanceof Error ? error.message : String(error || 'upload_failed');
  if (code.includes('authentication_required')) return 'انتهت الجلسة الحالية. سجّل الدخول مرة أخرى ثم أعد المحاولة.';
  if (code.includes('authorization_denied')) return 'الحساب الحالي لا يملك صلاحية رفع الصور.';
  if (code.includes('image_type_invalid')) return 'استخدم صورة JPG أو PNG أو WebP.';
  if (code.includes('image_too_large')) return 'الصورة الأصلية أكبر من 8MB.';
  if (code.includes('storage_upload_invalid_response')) return 'تم الرفع دون وصول رابط الصورة. راجع إعدادات Storage.';
  return `تعذر رفع الصورة: ${code}`;
}

export function StandaloneMediaUploadPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [path, setPath] = useState('');
  const [size, setSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    setUploadedUrl('');
    setPath('');
    try {
      const compressed = await compressProductImage(file);
      setPreview(compressed.dataUrl);
      setSize(compressed.bytes);
      setDimensions({ width: compressed.width, height: compressed.height });
      const result = await ProductService.uploadStandaloneImage(compressed.dataUrl, 'whatsapp-inbox');
      setUploadedUrl(result.url);
      setPath(result.path);
      setPreview(result.url);
    } catch (uploadError) {
      setError(friendlyError(uploadError));
    } finally {
      setBusy(false);
    }
  }, []);

  const reset = () => {
    setPreview('');
    setUploadedUrl('');
    setPath('');
    setSize(null);
    setDimensions(null);
    setError('');
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6" dir="rtl">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-600">قطوف الطبيعة · أدوات الإدارة</p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--gs-foreground)]">رفع صورة مستقلة</h1>
            <p className="mt-2 text-sm text-[var(--gs-foreground-secondary)]">ارفع الصورة أولًا، ثم استخدم رابطها لاحقًا عند إنشاء المنتج. لا يتم إنشاء منتج أو تعديل بياناته هنا.</p>
          </div>
          <button type="button" onClick={() => navigate(-1)} className="gsd-btn gsd-btn--secondary flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> رجوع
          </button>
        </header>

        <section className="gsd-card p-6">
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
            <div className="space-y-3">
              <div className="aspect-square overflow-hidden rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-muted)]">
                <img src={preview || placeholderImage} alt="معاينة الصورة" className="h-full w-full object-contain" />
              </div>
              {size !== null && <p className="text-center text-xs text-[var(--gs-foreground-muted)]">بعد الضغط: {formatImageSize(size)}{dimensions ? ` · ${dimensions.width}×${dimensions.height}` : ''}</p>}
            </div>

            <div className="space-y-4">
              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--gs-border)] bg-[var(--gs-muted)] px-6 text-center">
                {busy ? <Loader2 className="h-9 w-9 animate-spin text-emerald-600" /> : <ImagePlus className="h-9 w-9 text-emerald-600" />}
                <span className="mt-3 text-sm font-semibold text-[var(--gs-foreground)]">{busy ? 'جارٍ الضغط والرفع…' : 'اختر صورة من الجهاز'}</span>
                <span className="mt-2 text-xs text-[var(--gs-foreground-muted)]">JPG أو PNG أو WebP · الضغط مرة واحدة · حد الإدخال 8MB</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} disabled={busy} className="sr-only" />
              </label>

              {error && <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-600" role="alert"><X className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
              {uploadedUrl && <div className="space-y-2 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-700"><div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" />تم رفع الصورة بنجاح</div><p className="break-all text-xs">المسار: {path}</p><input readOnly value={uploadedUrl} className="gsd-input w-full text-xs" onFocus={(e) => e.currentTarget.select()} /></div>}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={reset} disabled={busy || (!preview && !error)} className="gsd-btn gsd-btn--secondary">مسح الصورة</button>
                <button type="button" onClick={() => navigate('/products/create')} disabled={!uploadedUrl} className="gsd-btn gsd-btn--primary">استخدامها في منتج</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default StandaloneMediaUploadPage;

// End of standalone upload page.
