/* ============================================================
   GSDS v1.1 — Footer Component
   Green Store Design System — Enterprise UI Foundation
   ============================================================ */

import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/useI18n';

/* ─── Props ────────────────────────────────────────────────── */

interface FooterProps {
  /** Optional class name override */
  className?: string;
}

/* ─── Footer ───────────────────────────────────────────────── */

export function Footer({ className }: FooterProps) {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'gsd-footer flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2 text-[11px]',
        '[background:var(--gs-surface)] [border-color:var(--gs-border)] [color:var(--gs-foreground-muted)]',
        'border-t',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span>{t('footer.copyright', { year })}</span>
        <span className="hidden sm:inline [color:var(--gs-foreground-disabled)]">|</span>
        <span className="hidden sm:inline">{t('footer.engineer')}</span>
        <span className="hidden sm:inline [color:var(--gs-foreground-disabled)]">|</span>
        <span className="hidden sm:inline">{t('footer.phone')}</span>
      </div>
      <span className="[color:var(--gs-foreground-disabled)]">{t('footer.version')}</span>
    </footer>
  );
}
