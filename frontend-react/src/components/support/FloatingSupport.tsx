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
    <div className="qutoof-mobile-floating fixed left-3 z-30 sm:left-5" dir="rtl">
      {/* Expanded Modal / Popover */}
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 sm:w-96">
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
          <div className="max-h-[calc(100dvh-10rem-env(safe-area-inset-bottom))] space-y-4 overflow-y-auto p-4">
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
                    className="min-h-10 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] px-3 py-2 text-[11px] font-medium text-[var(--gs-foreground)] transition hover:border-emerald-500"
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
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition hover:bg-emerald-500/20"
                          title="اتصال"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700"
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
        className="gsd-btn min-h-12 rounded-full bg-emerald-600 px-4 text-xs font-bold text-white shadow-lg transition-all duration-200 hover:bg-emerald-700 active:scale-95"
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
