/* ============================================================
   GSDS v1.1 — LogoPlaceholder Component
   Qutoof Nature brand integration
   ============================================================ */

import { cn } from '@/lib/utils';

interface LogoPlaceholderProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show text alongside the logo */
  showText?: boolean;
  /** Optional class name */
  className?: string;
}

const sizeMap = {
  sm: { box: 32, text: 'text-sm' },
  md: { box: 42, text: 'text-base' },
  lg: { box: 56, text: 'text-xl' },
};

/**
 * LogoPlaceholder — Container for the Qutoof Nature logo.
 */
export function LogoPlaceholder({ size = 'md', showText = true, className }: LogoPlaceholderProps) {
  const { box, text } = sizeMap[size];

  return (
   <div className={cn('flex items-center gap-3', className)}>
     <div
       className="flex items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-black/5"
       style={{ width: box, height: box }}
     >
       <img
         src="/qutoof-official.png"
         alt="قطوف الطبيعة — الطبيعة أقرب إليك"
         className="h-full w-full rounded-[1.125rem] object-contain"
         style={{ imageRendering: 'auto' }}
         decoding="async"
         loading="eager"
       />
     </div>
 
     {showText && (
       <div className="flex flex-col leading-tight">
         <span
           className={cn('font-semibold tracking-tight', text)}
           style={{ color: 'var(--gs-foreground)' }}
         >
           قطوف الطبيعة
         </span>
         <span
           className="text-[0.75rem] leading-tight text-[var(--gs-foreground-muted)]"
         >
           الطبيعة أقرب إليك
         </span>
       </div>
     )}
   </div>
  );
}

