import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Printer, AlertCircle, FileText, Building2, User } from 'lucide-react';
import { parseJsonSafe } from '@/services/authClient';

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  number: string;
  issuedAt: string;
  total: number;
  order: {
    code: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
    customer?: {
      fullName?: string;
      phone?: string;
    } | null;
    items: InvoiceItem[];
  };
  company: {
    name: string;
    logoUrl?: string | null;
    phone?: string | null;
  };
}

export default function PublicInvoicePage() {
  const { invoiceId } = useParams();
  const [params] = useSearchParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!invoiceId) {
      setError('رقم الفاتورة مفقود في الرابط');
      setLoading(false);
      return;
    }

    const token = params.get('token') || '';
    if (!token) {
      setError('رمز الوصول للفاتورة غير متوفر. يرجى التأكد من استخدام الرابط الصحيح المباشر.');
      setLoading(false);
      return;
    }

    fetch(`/api/invoices/${encodeURIComponent(invoiceId)}/public?token=${encodeURIComponent(token)}`)
      .then(parseJsonSafe)
      .then((payload) => {
        if (payload?.data) {
          setInvoice(payload.data);
        } else {
          setError(payload?.message || 'رابط الفاتورة غير صالح أو منتهي الصلاحية');
        }
      })
      .catch(() => {
        setError('تعذر تحميل الفاتورة. يرجى التحقق من اتصال الشبكة.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [invoiceId, params]);

  if (loading) {
    return (
      <main dir="rtl" className="mx-auto max-w-xl p-8 text-center flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">جارٍ تحميل الفاتورة الرسمية...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main dir="rtl" className="mx-auto max-w-xl p-8">
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-lg font-bold text-rose-950">{error}</h1>
          <p className="text-xs text-rose-700/80 max-w-md mx-auto">
            تأكد من استخدام رابط الفاتورة المرسل من النظام، والذي يتضمن الرمز المشفر المخصص للوصول إلى الفاتورة.
          </p>
        </div>
      </main>
    );
  }

  if (!invoice) return null;

  return (
    <main dir="rtl" className="mx-auto max-w-3xl p-4 sm:p-8">
      <div className="gsd-card bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-md print:border-0 print:shadow-none print:p-0">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            {invoice.company.logoUrl ? (
              <img src={invoice.company.logoUrl} alt="الشعار" className="h-16 w-16 object-contain rounded-2xl shrink-0 border border-slate-100 p-1" />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-emerald-700 text-white font-black flex items-center justify-center text-xl shrink-0 shadow-inner">
                <Building2 className="h-7 w-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-slate-900">{invoice.company.name}</h1>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                هاتف المؤسسة: {invoice.company.phone || 'غير مضاف'}
              </p>
            </div>
          </div>

          <div className="sm:text-left space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 text-xs font-bold border border-emerald-200 print:hidden">
              <FileText className="h-3.5 w-3.5" />
              فاتورة بيع رسمية
            </div>
            <p className="text-xs text-slate-600 font-mono">رقم الفاتورة: <strong>{invoice.number}</strong></p>
            <p className="text-xs text-slate-600 font-mono">رقم الطلب: <strong>{invoice.order.code}</strong></p>
            {invoice.issuedAt && (
              <p className="text-[11px] text-slate-500">تاريخ الإصدار: {new Date(invoice.issuedAt).toLocaleDateString('ar-SA')}</p>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="gsd-btn gsd-btn--secondary mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold print:hidden"
            >
              <Printer className="h-4 w-4" />
              حفظ PDF / طباعة
            </button>
          </div>
        </header>

        {/* Customer Information */}
        <section className="grid gap-3 border-b border-slate-200 py-5 text-xs sm:grid-cols-2 bg-slate-50/50 rounded-2xl p-4 my-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>اسم العميل: <strong>{invoice.order.customer?.fullName || 'عميل قطوف'}</strong></span>
          </div>
          <div>
            <span>رقم الهاتف: <strong>{invoice.order.customer?.phone || 'غير مضاف'}</strong></span>
          </div>
        </section>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold">
                <th className="py-3 px-3 rounded-r-xl">المنتج</th>
                <th className="py-3 px-3 text-center">الكمية</th>
                <th className="py-3 px-3">سعر الوحدة</th>
                <th className="py-3 px-3 text-left rounded-l-xl">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.order.items.map((item, i) => (
                <tr key={`${item.name}-${i}`} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 font-mono">{item.unitPrice.toLocaleString()} {invoice.order.currency}</td>
                  <td className="py-3 px-3 text-left font-mono font-bold text-emerald-700">
                    {item.total.toLocaleString()} {invoice.order.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="mr-auto mt-6 max-w-xs space-y-2 text-xs border-t border-slate-200 pt-4">
          <p className="flex justify-between text-slate-600">
            <span>المجموع الفرعي:</span>
            <b className="font-mono text-slate-900">{invoice.order.subtotal.toLocaleString()} {invoice.order.currency}</b>
          </p>
          <p className="flex justify-between text-slate-600">
            <span>رسوم التوصيل:</span>
            <b className="font-mono text-slate-900">{invoice.order.shipping.toLocaleString()} {invoice.order.currency}</b>
          </p>
          <p className="flex justify-between text-slate-600">
            <span>ضريبة القيمة المضافة:</span>
            <b className="font-mono text-slate-900">{invoice.order.tax.toLocaleString()} {invoice.order.currency}</b>
          </p>
          <p className="flex justify-between border-t border-slate-300 pt-3 text-sm font-bold text-emerald-700">
            <span>الإجمالي الكلي:</span>
            <b className="font-mono text-base">{invoice.order.total.toLocaleString()} {invoice.order.currency}</b>
          </p>
        </div>
      </div>
    </main>
  );
}
