import { useState, useRef, useEffect } from 'react';
import { ScanBarcode, Camera, CameraOff, Search, AlertCircle, PackageCheck, Tag, Box } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { ProductService } from '../services/productService';
import type { ProductDTO } from '../domain/productDTO';
import { isAuthorizedStaffOrAdmin } from '@/services/authClient';

export function BarcodePage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedProduct, setScannedProduct] = useState<ProductDTO | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const isStaffOrAdmin = isAuthorizedStaffOrAdmin();

  // Handle Manual Product Search by SKU, Barcode, or ID
  async function handleSearch(codeToSearch?: string) {
    const term = (codeToSearch ?? searchQuery).trim();
    if (!term) {
      setSearchError('يرجى إدخال رمز البارکود أو SKU للمنتج');
      setScannedProduct(null);
      return;
    }

    setSearchError(null);

    // Try fetching product by ID or searching across catalogue
    const allProducts = await ProductService.getAll();
    const match = allProducts.find(
      (p) =>
        p.id.toLowerCase() === term.toLowerCase() ||
        p.sku.toLowerCase() === term.toLowerCase() ||
        (p.barcode && p.barcode.toLowerCase() === term.toLowerCase()) ||
        p.name.toLowerCase().includes(term.toLowerCase())
    );

    if (match) {
      setScannedProduct(match);
      setSearchError(null);
    } else {
      setScannedProduct(null);
      setSearchError(`لم يتم العثور على أي منتج يطابق الرمز: "${term}"`);
    }
  }

  // Camera Scanner Functions
  async function startCameraScanner() {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('المتصفح الحالي لا يدعم الوصول المباشر لكاميرا الجهاز.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);

      // Initialize BarcodeDetector API if supported natively
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e'],
        });

        const scanFrame = async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await barcodeDetector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const detectedRawValue = barcodes[0].rawValue;
                if (detectedRawValue) {
                  stopCameraScanner();
                  setSearchQuery(detectedRawValue);
                  await handleSearch(detectedRawValue);
                  return;
                }
              }
            } catch {
              // Frame detection scan error ignored
            }
          }
          if (streamRef.current) {
            animFrameRef.current = requestAnimationFrame(scanFrame);
          }
        };

        animFrameRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: any) {
      setIsCameraActive(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setCameraError('تم رفض الإذن لاستخدام الكاميرا. يرجى السماح بالوصول للكاميرا من إعدادات المتصفح، أو استخدام البحث اليدوي أدناه.');
      } else {
        setCameraError('تعذر فتح الكاميرا. يرجى التأكد من عدم استخدام الكاميرا في تطبيق آخر.');
      }
    }
  }

  function stopCameraScanner() {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }

  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-2">
          <ScanBarcode className="h-7 w-7 text-emerald-600" aria-hidden="true" />
          {t('products.barcode') || 'ماسح البارکود ورمز الاستجابة السريعة (QR)'}
        </h1>
        <BreadcrumbEngine className="mt-1" />
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Column: Camera Scanner & Manual Search */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Camera Scanner Box */}
          <div className="gsd-card p-6 rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold [color:var(--gs-foreground)] flex items-center gap-2">
                  <Camera className="h-5 w-5 text-emerald-600" />
                  كاميرا الماسح الضوئي
                </h2>
                <p className="text-xs text-[var(--gs-foreground-secondary)] mt-0.5">
                  وجه الكاميرا نحو رمز QR أو البارکود المطبوع على المنتج
                </p>
              </div>

              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCameraScanner}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Camera className="h-4 w-4" />
                  فتح الماسح
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCameraScanner}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <CameraOff className="h-4 w-4" />
                  إغلاق الكاميرا
                </button>
              )}
            </div>

            {/* Video Feed or Placeholder */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-[var(--gs-border)]">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                playsInline
                muted
              />

              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Viewfinder Target Box */}
                  <div className="w-56 h-36 border-2 border-emerald-500 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] relative animate-pulse">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  </div>
                </div>
              )}

              {!isCameraActive && (
                <div className="flex flex-col items-center gap-3 text-slate-400 text-center px-4">
                  <div className="h-14 w-14 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
                    <ScanBarcode className="h-7 w-7 text-slate-500" />
                  </div>
                  <p className="text-xs max-w-xs text-slate-400">
                    انقر على "فتح الماسح" للمسح المباشر بالكاميرا أو أدخل الرمز يدوياً أدناه
                  </p>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>

          {/* Manual Barcode / SKU Input */}
          <div className="gsd-card p-6 rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
            <h2 className="text-sm font-bold [color:var(--gs-foreground)] mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-emerald-600" />
              البحث اليدوي بالرمز أو SKU
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <ScanBarcode className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gs-foreground-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="أدخل رمز البارکود أو SKU للمنتج..."
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs text-[var(--gs-foreground)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Search className="h-4 w-4" />
                بحث
              </button>
            </form>

            {searchError && (
              <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scanned Product Details Result */}
        <div className="lg:col-span-5">
          <div className="gsd-card p-6 rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm h-full">
            <h2 className="text-base font-bold [color:var(--gs-foreground)] mb-4 flex items-center gap-2 pb-3 border-b border-[var(--gs-border-subtle)]">
              <PackageCheck className="h-5 w-5 text-emerald-600" />
              تفاصيل المنتج المفحوص
            </h2>

            {scannedProduct ? (
              <div className="space-y-4">
                {/* Product Image & Title */}
                <div className="flex items-start gap-4">
                  {scannedProduct.image ? (
                    <img
                      src={scannedProduct.image}
                      alt={scannedProduct.name}
                      className="h-20 w-20 rounded-2xl object-cover border border-[var(--gs-border)]"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-[var(--gs-muted)] flex items-center justify-center border border-[var(--gs-border)]">
                      <Box className="h-8 w-8 text-[var(--gs-foreground-muted)]" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-sm font-bold [color:var(--gs-foreground)] line-clamp-2">
                      {scannedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold">
                        SKU: {scannedProduct.sku}
                      </span>
                      {scannedProduct.barcode && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-700 dark:text-slate-300 text-[11px] font-mono">
                          {scannedProduct.barcode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price, Stock & Unit Specs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[var(--gs-background)] border border-[var(--gs-border-subtle)]">
                    <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">سعر البيع</span>
                    <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                      {scannedProduct.sellingPrice} ر.س
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[var(--gs-background)] border border-[var(--gs-border-subtle)]">
                    <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">المخزون الحالي</span>
                    <span
                      className={`text-sm font-bold mt-0.5 block ${
                        scannedProduct.stock > 0 ? 'text-slate-800 dark:text-slate-200' : 'text-rose-600'
                      }`}
                    >
                      {scannedProduct.stock} {typeof scannedProduct.unit === 'object' ? (scannedProduct.unit?.name || scannedProduct.unit?.abbreviation || '') : scannedProduct.unit}
                    </span>
                  </div>
                </div>

                {/* Active Offer if Present */}
                {scannedProduct.offer && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>عرض خاص مفعل</span>
                    </div>
                    <span className="font-bold">{scannedProduct.offer.title || 'خصم إضافي'}</span>
                  </div>
                )}

                {/* Staff/Admin Additional Info Badge */}
                {isStaffOrAdmin && (
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 text-xs">
                    <p className="font-semibold mb-0.5">صلاحية إدارية:</p>
                    <p className="text-[11px] opacity-80">
                      معرف المنتج: {scannedProduct.id} — الحجم/الوحدة: {typeof scannedProduct.unit === 'object' ? (scannedProduct.unit?.name || scannedProduct.unit?.abbreviation || '') : scannedProduct.unit}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--gs-foreground-secondary)]">
                <Box className="h-12 w-12 text-[var(--gs-foreground-muted)] mb-2 stroke-[1.5]" />
                <p className="text-xs font-semibold">لم يتم فحص أي منتج بعد</p>
                <p className="text-[11px] text-[var(--gs-foreground-muted)] mt-1 max-w-xs">
                  افحص البارکود عبر الكاميرا أو أدخل الرمز في مربع البحث لعرض تفاصيل المنتج والكميات المتاحة.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarcodePage;
