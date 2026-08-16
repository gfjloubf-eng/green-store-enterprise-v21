/* ============================================================
   GSDS v1.3 — WhatsApp Dual Order Action Component
   Green Store Enterprise v2 — Real Produce Intelligence Phase
   ============================================================
   Renders clear, intuitive choices for WhatsApp ordering:
   1. Store Official WhatsApp (المتجر الرسمي - قطوف الطبيعة)
   2. Saqr Anwar WhatsApp Support (صقر أنور - متابعة الطلبات)
   ============================================================ */

import { useState } from 'react';
import { MessageCircle, User, Store, ChevronDown, Check } from 'lucide-react';
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
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpenDropdown(false);
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-col sm:flex-row gap-2.5 ${className}`} dir="rtl">
        <button
          type="button"
          onClick={() => handleOrder('store')}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-xs touch-manipulation min-h-[44px]"
        >
          <Store className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>طلب عبر واتساب (المتجر)</span>
        </button>

        <button
          type="button"
          onClick={() => handleOrder('saqr')}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 px-4 py-3 text-xs font-bold text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition shadow-xs touch-manipulation min-h-[44px]"
        >
          <User className="h-4 w-4 text-teal-600 shrink-0" />
          <span>طلب عبر واتساب (صقر أنور)</span>
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
            اختر جهة الاتصال لإرسال الطلب:
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
                <span className="text-[10px] text-[var(--gs-foreground-secondary)]">{WHATSAPP_CONTACTS.store.role}</span>
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
                <span className="text-[10px] text-[var(--gs-foreground-secondary)]">{WHATSAPP_CONTACTS.saqr.role}</span>
              </div>
            </div>
            <Check className="h-4 w-4 text-teal-600 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      )}
    </div>
  );
}
