import React from 'react';
import { Phone, MessageCircle, UserCheck, Shield, HelpCircle } from 'lucide-react';
import {
  SUPPORT_TEAM,
  buildWhatsAppOrderUrl,
  buildWhatsAppGeneralUrl,
  buildTelUrl,
  type SupportMember,
} from '@/config/supportTeam';

interface SupportTeamCardsProps {
  orderNumber?: string;
  className?: string;
  onOpenTicket?: () => void;
  title?: string;
  subtitle?: string;
}

export const SupportTeamCards: React.FC<SupportTeamCardsProps> = ({
  orderNumber,
  className = '',
  onOpenTicket,
  title = 'فريق الدعم المعتمد',
  subtitle = 'نحن هنا لمساعدتك في أي استفسار يتعلق بالحساب أو الطلب أو الدفع أو الشحن.',
}) => {
  return (
    <section className={`space-y-4 ${className}`} dir="rtl">
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h2 className="text-base sm:text-lg font-bold text-[var(--gs-foreground)]">{title}</h2>}
          {subtitle && <p className="text-xs text-[var(--gs-foreground-secondary)]">{subtitle}</p>}
        </div>
      )}

      {/* Mobile First Stack / Desktop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {SUPPORT_TEAM.map((member: SupportMember) => {
          const hasPhone = Boolean(member.phone);
          const hasWhatsApp = Boolean(member.whatsappNumber);

          const whatsappUrl = orderNumber
            ? buildWhatsAppOrderUrl(orderNumber, member.whatsappNumber)
            : buildWhatsAppGeneralUrl(member.whatsappNumber);

          const telUrl = buildTelUrl(member.phone);

          return (
            <div
              key={member.id}
              className="gsd-card rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-500/30 transition-all duration-200"
            >
              {/* Member Info */}
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm">
                  {member.id === 'ammar' ? <Shield className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[var(--gs-foreground)] truncate">{member.name}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 shrink-0">
                      معتمد
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--gs-foreground-secondary)] leading-tight">{member.role}</p>
                </div>
              </div>

              {/* Action Buttons — Touch Friendly */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--gs-border-subtle)]">
                {hasPhone && telUrl ? (
                  <a
                    href={telUrl}
                    className="gsd-btn gsd-btn--secondary min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-[var(--gs-border)] hover:bg-[var(--gs-muted)] transition"
                  >
                    <Phone className="h-4 w-4 text-emerald-600" />
                    <span>اتصال</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenTicket}
                    className="gsd-btn gsd-btn--secondary min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-[var(--gs-border)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)] transition"
                  >
                    <HelpCircle className="h-4 w-4 text-emerald-600" />
                    <span>تذكرة دعم</span>
                  </button>
                )}

                {hasWhatsApp && whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gsd-btn min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>واتساب</span>
                  </a>
                ) : (
                  <a
                    href={buildWhatsAppGeneralUrl(undefined, `السلام عليكم، أود التواصل مع صقر أنور${orderNumber ? ` بخصوص الطلب #${orderNumber}` : ''}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gsd-btn min-h-[44px] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>واتساب</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SupportTeamCards;
