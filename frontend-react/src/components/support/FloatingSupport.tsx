import React, { useState } from 'react';
import { BookOpen, MessageSquare, X, Phone, PhoneCall, MessageCircle, HelpCircle } from 'lucide-react';
import { SUPPORT_TEAM, buildWhatsAppGeneralUrl, buildTelUrl } from '@/config/supportTeam';
import { useNavigate } from 'react-router-dom';

export const FloatingSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateHelp = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed bottom-20 left-3 sm:left-5 lg:bottom-5 z-30" dir="rtl">
      {/* Expanded Modal / Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 max-w-[calc(100vw-2.5rem)] rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold">مرحبًا</h3>
                <p className="text-[11px] text-emerald-100">كيف يمكننا مساعدتك اليوم؟</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Quick Categories */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[var(--gs-foreground-secondary)] block">
                مواضيع المساعدة السريعة:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'الدعم الفني', path: '/support' },
                  { label: 'الطلبات', path: '/orders' },
                  { label: 'الدفع', path: '/help' },
                  { label: 'الشحن', path: '/help' },
                  { label: 'التواصل مع الفريق', path: '/contact' },
                  { label: 'الإرشادات الغذائية', path: '/education' },
                  { label: 'استشارة تغذية', path: '/consultation' },
                ].map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => handleNavigateHelp(cat.path)}
                    className="px-3 py-1.5 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] hover:border-emerald-500 text-[11px] font-medium text-[var(--gs-foreground)] transition"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Members Direct Access */}
            <div className="space-y-2 border-t border-[var(--gs-border-subtle)] pt-3">
              <span className="text-[11px] font-semibold text-[var(--gs-foreground-secondary)] block">
                فريق الدعم المعتمد:
              </span>

              {SUPPORT_TEAM.map((member) => {
                const telUrl = buildTelUrl(member.phone);
                const waUrl = buildWhatsAppGeneralUrl(member.whatsappNumber);

                return (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <strong className="block text-xs text-[var(--gs-foreground)] truncate">{member.name}</strong>
                      <span className="text-[10px] text-[var(--gs-foreground-secondary)] block truncate">{member.role}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {telUrl && (
                        <a
                          href={telUrl}
                          className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 flex items-center justify-center transition"
                          title="اتصال"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition"
                        title="واتساب"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+967712275038"
                className="py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
              >
                <PhoneCall className="h-4 w-4" />
                <span>اتصل الآن</span>
              </a>
              <button
                type="button"
                onClick={() => handleNavigateHelp('/education')}
                className="py-2.5 rounded-2xl bg-[var(--gs-muted)] hover:bg-[var(--gs-border)] text-xs font-semibold text-[var(--gs-foreground)] flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
              >
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>المعرفة</span>
              </button>
            </div>

            {/* Support Center Link */}
            <button
              type="button"
              onClick={() => handleNavigateHelp('/support')}
              className="w-full py-2.5 rounded-2xl bg-[var(--gs-muted)] hover:bg-[var(--gs-border)] text-xs font-semibold text-[var(--gs-foreground)] flex items-center justify-center gap-2 transition"
            >
              <HelpCircle className="h-4 w-4 text-emerald-600" />
              <span>الانتقال لمركـز الدعم والتذاكر</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="gsd-btn min-h-[48px] px-4 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-lg flex items-center gap-2 text-xs font-bold transition-all duration-200"
        aria-label="فتح مركز الدعم"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageSquare className="h-5 w-5" />
            <span>الدعم</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingSupport;
