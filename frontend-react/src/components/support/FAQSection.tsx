import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'orders' | 'payment' | 'shipping' | 'account' | 'general';
}

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'كيف أتابع طلبي؟',
    answer: 'يمكنك متابعة حالة طلبك مباشرة من صفحة "طلباتي" في حسابك، أو عبر الرابط المباشر المرسل إليك عند إتمام الطلب.',
    category: 'orders',
  },
  {
    id: 'faq-2',
    question: 'كيف أغير كلمة المرور؟',
    answer: 'من خلال الذهاب إلى صفحة "الملف الشخصي" ثم اختيار "تحديث الأمان وكلمة المرور"، أو عبر خيار "نسيت كلمة المرور" عند تسجيل الدخول.',
    category: 'account',
  },
  {
    id: 'faq-3',
    question: 'كيف أتواصل مع الدعم؟',
    answer: 'يمكنك التواصل المباشر عبر الاتصال الهاتف أو الواتساب مع أعضاء فريق الدعم المعتمدين (عمار المصوعي / صقر أنور)، أو من خلال فتح تذكرة دعم فني من مركز الدعم.',
    category: 'general',
  },
  {
    id: 'faq-4',
    question: 'ماذا أفعل إذا واجهت مشكلة في الدفع؟',
    answer: 'في حال تعثر عملية الدفع الإلكتروني، يمكنك إعادة المحاولة أو اختيار "الدفع عند الاستلام (COD)" والتواصل مع فريق الدعم لمساعدتك فورًا.',
    category: 'payment',
  },
  {
    id: 'faq-5',
    question: 'كيف أعرف حالة الشحن؟',
    answer: 'يتم تحديث حالة الشحن تلقائيًا في تفاصيل الطلب (مؤكد -> تم التجهيز -> قيد الشحن -> تم التسليم)، كما يمكنك التواصل معنا لتأكيد موقع الشحنة.',
    category: 'shipping',
  },
  {
    id: 'faq-6',
    question: 'كيف أعدل بيانات حسابي؟',
    answer: 'من صفحة "الملف الشخصي"، يمكنك تعديل الاسم ورقم الهاتف وعناوين التوصيل المسجلة بسهولة.',
    category: 'account',
  },
];

interface FAQSectionProps {
  className?: string;
  items?: FAQItem[];
  title?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  className = '',
  items = DEFAULT_FAQS,
  title = 'الأسئلة الشائعة (FAQ)',
}) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`space-y-4 ${className}`} dir="rtl">
      {title && (
        <div className="flex items-center gap-2 border-b border-[var(--gs-border)] pb-3">
          <HelpCircle className="h-5 w-5 text-emerald-600" />
          <h2 className="text-base sm:text-lg font-bold text-[var(--gs-foreground)]">{title}</h2>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="w-full min-h-[48px] p-4 text-right flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[var(--gs-foreground)] hover:bg-[var(--gs-muted)] transition"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[var(--gs-foreground-secondary)] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-xs text-[var(--gs-foreground-secondary)] leading-relaxed border-t border-[var(--gs-border-subtle)] pt-3 bg-[var(--gs-background)]/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
