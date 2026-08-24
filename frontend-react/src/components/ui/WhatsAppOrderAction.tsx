/* ============================================================
   GSDS v1.3.1 — WhatsApp Dual Order Action Component
   Green Store Enterprise v2 — Real Produce Intelligence Phase
   ============================================================
   Renders clear, intuitive choices for WhatsApp ordering:
   1. Store Official WhatsApp (عمار عادل - الطلب الرئيسي)
   2. Saqr Anwar WhatsApp Support (صقر أنور - متابعة الطلبات)
   ============================================================ */

import { useState } from 'react';
import { MessageCircle, User, Store, X, Phone } from 'lucide-react';
import {
  WHATSAPP_CONTACTS,
  buildWhatsAppTargetUrl,
  buildWhatsAppWelcomeMessage,
  type WhatsAppTarget,
} from '@/config/whatsapp';

interface WhatsAppOrderActionProps {
  getMessage: (target: WhatsAppTarget) => string;
  className?: string;
  variant?: 'buttons' | 'dropdown' | 'modal';
  buttonText?: string;
  beforeOpen?: (target: WhatsAppTarget) => Promise<{ orderCode?: string; invoiceNumber?: string } | void>;
}

export function WhatsAppOrderAction({
  getMessage,
  className = '',
  variant = 'buttons',
  buttonText = 'طلب عبر واتساب',
  beforeOpen,
}: WhatsAppOrderActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOrder = async (target: WhatsAppTarget) => {
    let reference: { orderCode?: string; invoiceNumber?: string } | void;
    try {
      reference = await beforeOpen?.(target);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر حفظ الطلب قبل فتح واتساب';
      window.alert(message);
      return;
    }
    const details = getMessage(target).trim();
    const invoiceLine = reference?.orderCode
      ? `\n\n🧾 رقم الطلب: ${reference.orderCode}${reference.invoiceNumber ? `\nرقم الفاتورة: ${reference.invoiceNumber}` : ''}\nالشركة: قطوف الطبيعة`
      : '';
    const welcome = buildWhatsAppWelcomeMessage(target);
    
    // Combine welcome message with order details
    const finalMessage = `${welcome}\n\n${details}${invoiceLine}`;
    const url = buildWhatsAppTargetUrl(target, finalMessage);
    
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
    setIsOpen(false);
  };

  const ContactCard = ({ target }: { target: WhatsAppTarget }) => {
    const contact = WHATSAPP_CONTACTS[target];
    const bgColor = target === 'store' ? 'bg-emerald-500' : 'bg-teal-500';
    const borderColor = target === 'store' ? 'border-emerald-500/25' : 'border-teal-500/25';
    const lightBg = target === 'store' ? 'bg-emerald-50' : 'bg-teal-50';
    const darkBg = target === 'store' ? 'dark:bg-emerald-950/35' : 'dark:bg-teal-950/35';
    const textColor = target === 'store' ? 'text-emerald-900' : 'text-teal-900';
    const icon = target === 'store' ? <Store className="h-5 w-5" /> : <User className="h-5 w-5" />;

    return (
      <button
        type="button"
        onClick={() => handleOrder(target)}
        className={`w-full rounded-2xl border ${borderColor} ${lightBg} p-4 text-right transition hover:scale-[1.02] active:scale-[0.98] ${darkBg} shadow-sm group`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bgColor} text-white shadow-md group-hover:rotate-6 transition-transform`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <strong className={`text-sm font-bold ${textColor} dark:text-white`}>
                {contact.shortName}
              </strong>
              <span className="flex items-center gap-1 text-[10px] font-medium opacity-60">
                <Phone className="h-3 w-3" />
                {contact.phone}
              </span>
            </div>
            <span className="mt-1 block text-xs text-[var(--gs-foreground-secondary)] leading-tight">
              {contact.role}
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className={`relative inline-block ${className}`} dir="rtl">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] touch-manipulation min-h-[44px]"
      >
        <MessageCircle className="h-5 w-5" />
        <span>{buttonText}</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm animate-in fade-in duration-200"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-black text-[var(--gs-foreground)] tracking-tight">
                  تواصل معنا عبر واتساب
                </h2>
                <p className="mt-1 text-xs text-[var(--gs-foreground-secondary)]">
                  اختر الشخص المناسب لخدمتك بشكل أسرع
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 bg-[var(--gs-surface-muted)] text-[var(--gs-foreground-muted)] transition hover:text-[var(--gs-foreground)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <ContactCard target="store" />
              <ContactCard target="saqr" />
            </div>

            <div className="mt-6 text-center">
              <p className="text-[10px] text-[var(--gs-foreground-muted)] font-medium">
                قطوف الطبيعة — الخضروات والفواكه الطازجة في صنعاء
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
