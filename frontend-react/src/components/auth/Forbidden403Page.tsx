import { ShieldAlert, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Forbidden403Page() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6" dir="rtl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">403 Forbidden</span>
      <h1 className="mt-2 text-2xl font-bold [color:var(--gs-foreground)]">عذرًا! ليس لديك صلاحية الوصول</h1>
      <p className="mt-2 max-w-md text-sm [color:var(--gs-foreground-secondary)]">
        الصفحة أو الإجراء الذي تحاول الوصول إليه يتطلب صلاحيات إضافية غير متوفرة لحسابك الحالي.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="gsd-btn gsd-btn--primary gsd-btn--md inline-flex items-center gap-2 rounded-xl"
        >
          <Home className="h-4 w-4" />
          الرئيسية
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="gsd-btn gsd-btn--secondary gsd-btn--md inline-flex items-center gap-2 rounded-xl"
        >
          العودة للخلف
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Forbidden403Page;
