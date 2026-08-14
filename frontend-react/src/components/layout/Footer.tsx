import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';
import { SUPPORT_TEAM, buildTelUrl, buildWhatsAppGeneralUrl } from '@/config/supportTeam';
import { Phone, MessageCircle } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const ammar = SUPPORT_TEAM[0];
  const saqr = SUPPORT_TEAM[1];

  const ammarTel = buildTelUrl(ammar.phone);
  const ammarWa = buildWhatsAppGeneralUrl(ammar.whatsappNumber);

  return (
    <footer
      className={cn(
        'gsd-footer flex flex-col gap-3 px-4 sm:px-6 py-3 text-[11px]',
        '[background:var(--gs-surface)] [border-color:var(--gs-border)] [color:var(--gs-foreground-muted)]',
        'border-t',
        className,
      )}
      dir="rtl"
    >
      {/* Support Team Quick Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[var(--gs-border-subtle)] pb-2">
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <strong className="text-[var(--gs-foreground)] font-semibold">فريق الدعم المعتمد:</strong>
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-[var(--gs-foreground)]">{ammar.name}</span>
            <span className="text-[10px] text-[var(--gs-foreground-secondary)]">({ammar.role})</span>
          </span>
          <span className="hidden sm:inline text-[var(--gs-border)]">|</span>
          <span className="flex items-center gap-1.5">
            <span className="font-medium text-[var(--gs-foreground)]">{saqr.name}</span>
            <span className="text-[10px] text-[var(--gs-foreground-secondary)]">({saqr.role})</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {ammarTel && (
            <a href={ammarTel} className="inline-flex items-center gap-1 text-emerald-600 hover:underline">
              <Phone className="h-3 w-3" />
              <span>اتصال: {ammar.phone}</span>
            </a>
          )}
          {ammarWa && (
            <a href={ammarWa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-600 hover:underline">
              <MessageCircle className="h-3 w-3" />
              <span>واتساب الدعم</span>
            </a>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>{t('footer.copyright', { year })}</span>
          <span className="hidden sm:inline [color:var(--gs-foreground-disabled)]">|</span>
          <span className="hidden sm:inline">{t('footer.engineer')}</span>
        </div>
        <span className="[color:var(--gs-foreground-disabled)]">{t('footer.version')}</span>
      </div>
    </footer>
  );
}
