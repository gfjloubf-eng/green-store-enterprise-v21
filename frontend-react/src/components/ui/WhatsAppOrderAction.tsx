/* ============================================================
   GSDS v1.3 — WhatsApp Dual Order Action Component
   Green Store Enterprise v2 — Real Produce Intelligence Phase
   ============================================================
   Renders clear, intuitive choices for WhatsApp ordering:
   1. Store Official WhatsApp (المتجر الرسمي - قطوف الطبيعة)
   2. Saqr Anwar WhatsApp Support (صقر أنور - متابعة الطلبات)
   ============================================================ */

import { useState } from 'react';
import { MessageCircle, User, Store, ChevronDown, Check, X } from 'lucide-react';
import {
  WHATSAPP_CONTACTS,
  buildWhatsAppTargetUrl,
  type WhatsAppTarget,
} from '@/config/whatsapp';

interface WhatsAppOrderActionProps {
  getMessage: (target: WhatsAppTarget) => string;
  className?: string;
  variant?: 'buttons' | 'dropdown' | 'modal';
  buttonText?: string;
}

export function WhatsAppOrderAction({
  getMessage,
  className = '',
  variant = 'buttons',
  buttonText = 'طلب عبر واتساب',
}: WhatsAppOrderActionProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleOrder = (target: WhatsAppTarget) => {
    const message = getMessage(target);
    const url = buildWhatsAppTargetUrl(target, message);
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
    setOpenDropdown(false);
  };

  if (variant === 'modal') {
    return (
      <div className={`relative inline-block w-full ${className}`} dir="rtl">
        <button
          type="button"
          onClick={() => setOpenDropdown(true)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] touch-manipulation min-h-[44px]"
          aria-haspopup="dialog"
          aria-expanded={openDropdown}
        >
          <MessageCircle className="h-5 w-5" />
          <span>{buttonText}</span>
        </button>

        {openDropdown && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-5"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpenDropdown(false);
            }}
          >
            <div
              className="w-full max-w-md rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 shadow-2xl sm:p-5 animate-in fade-in slide-in-from-bottom-3 duration-150"
              role="dialog"
              aria-modal="true"
              aria-labelledby="whatsapp-choice-title"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">قطوف الطبيعة</p>
                  <h2 id="whatsapp-choice-title" className="text-base font-extrabold text-[var(--gs-foreground)]">
                    هل تريد الانتقال إلى واتساب؟
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-[var(--gs-foreground-secondary)]">
                    اختر الرقم المناسب لإرسال طلبك أو متابعة التوصيل.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(false)}
                  className="rounded-full p-2 text-[var(--gs-foreground-muted)] transition hover:bg-[var(--gs-surface-muted)] hover:text-[var(--gs-foreground)]"
                  aria-label="إغلاق نافذة اختيار واتساب"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOrder('store')}
                  className="w-full rounded-2xl border border-emerald-500/25 bg-emerald-50 p-3 text-right transition hover:bg-emerald-100 active:scale-[0.99] dark:bg-emerald-950/35 dark:hover:bg-emerald-900/55"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                      <Store className="h-5 w-5" />
                    </span>
                    <span>
                      <strong className="flex items-center gap-1.5 text-sm text-emerald-900 dark:text-emerald-100">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-300/15 dark:text-emerald-200" aria-hidden="true">
                          <Store className="h-3 w-3" />
                        </span>
                        <span>عمار عادل</span>
                      </strong>
                      <span className="mt-0.5 block text-xs text-emerald-800/75 dark:text-emerald-200/75">الطلب الرئيسي · {WHATSAPP_CONTACTS.store.phone}</span>
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOrder('saqr')}
                  className="w-full rounded-2xl border border-teal-500/25 bg-teal-50 p-3 text-right transition hover:bg-teal-100 active:scale-[0.99] dark:bg-teal-950/35 dark:hover:bg-teal-900/55"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white">
                      <User className="h-5 w-5" />
                    </span>
                    <span>
                      <strong className="flex items-center gap-1.5 text-sm text-teal-900 dark:text-teal-100">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/15 text-teal-700 dark:bg-teal-300/15 dark:text-teal-200" aria-hidden="true">
                          <User className="h-3 w-3" />
                        </span>
                        <span>صقر أنور</span>
                      </strong>
                      <span className="mt-0.5 block text-xs text-teal-800/75 dark:text-teal-200/75">المتابعة والتوصيل · {WHATSAPP_CONTACTS.saqr.phone}</span>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-col sm:flex-row gap-2.5 ${className}`} dir="rtl">
        <button
          type="button"
          onClick={() => handleOrder('store')}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-xs touch-manipulation min-h-[44px]"
        >
          <Store className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-right"><strong className="block">اطلب من عمار عادل</strong><small className="block text-[10px] font-medium opacity-75">{WHATSAPP_CONTACTS.store.phone} · الطلب الرئيسي</small></span>
        </button>

        <button
          type="button"
          onClick={() => handleOrder('saqr')}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 px-4 py-3 text-xs font-bold text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition shadow-xs touch-manipulation min-h-[44px]"
        >
          <User className="h-4 w-4 text-teal-600 shrink-0" />
          <span className="text-right"><strong className="block">متابعة مع صقر</strong><small className="block text-[10px] font-medium opacity-75">{WHATSAPP_CONTACTS.saqr.phone} · التوصيل والدعم</small></span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-block w-full ${className}`} dir="rtl">
      <button
        type="button"
        onClick={() => setOpenDropdown((prev) => !prev)}
        className="w-full inline-flex items-center justify-between gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition shadow-xs touch-manipulation min-h-[44px]"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          <span>{buttonText}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown ? 'rotate-180' : ''}`} />
      </button>

      {openDropdown && (
        <div className="absolute top-full right-0 left-0 mt-2 z-30 rounded-2xl bg-[var(--gs-surface)] border border-[var(--gs-border)] shadow-xl p-2 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--gs-foreground-muted)] border-b border-[var(--gs-border-subtle)]">
            اختر القناة المناسبة: الطلب الرئيسي أو متابعة التوصيل
          </div>

          <button
            type="button"
            onClick={() => handleOrder('store')}
            className="w-full text-right p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center justify-between text-xs transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                <Store className="h-4 w-4" />
              </div>
              <div>
                <strong className="block text-[var(--gs-foreground)]">{WHATSAPP_CONTACTS.store.shortName}</strong>
                <span className="text-[10px] text-[var(--gs-foreground-secondary)]">{WHATSAPP_CONTACTS.store.role} · {WHATSAPP_CONTACTS.store.phone}</span>
              </div>
            </div>
            <Check className="h-4 w-4 text-emerald-600 opacity-0 group-hover:opacity-100" />
          </button>

          <button
            type="button"
            onClick={() => handleOrder('saqr')}
            className="w-full text-right p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/50 flex items-center justify-between text-xs transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div>
                <strong className="block text-[var(--gs-foreground)]">{WHATSAPP_CONTACTS.saqr.shortName}</strong>
                <span className="text-[10px] text-[var(--gs-foreground-secondary)]">{WHATSAPP_CONTACTS.saqr.role} · {WHATSAPP_CONTACTS.saqr.phone}</span>
              </div>
            </div>
            <Check className="h-4 w-4 text-teal-600 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      )}
    </div>
  );
}
