/* ============================================================
   GSDS v1.1 — FormField Component
   Green Store Design System — Enterprise UI Foundation
   Milestone 4.2 — Reusable form field wrapper
   ============================================================
   Renders label, input/select/textarea, and validation error.
   Fully RTL/LTR compatible via logical CSS.
   ============================================================ */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';

/* ─── Props ────────────────────────────────────────────────── */

interface FormFieldProps {
  /** Translation key for the label */
  labelKey: TranslationKey;
  /** Translation key for placeholder (optional) */
  placeholderKey?: TranslationKey;
  /** Current field value */
  value: string | number | readonly string[] | undefined;
  /** Change handler */
  onChange: (value: string) => void;
  /** Error translation key (empty string if valid) */
  error?: string;
  /** Input type (text, number, textarea, select) */
  type?: 'text' | 'number' | 'textarea' | 'select' | 'file';
  /** Select options (for type="select") */
  options?: { value: string; labelKey: TranslationKey }[];
  /** Optional icon to show before the label */
  icon?: ReactNode;
  /** Optional className override */
  className?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional description text */
  hintKey?: TranslationKey;
  /** Disabled state */
  disabled?: boolean;
  /** Minimum value (for number type) */
  min?: number;
  /** Maximum value (for number type) */
  max?: number;
  /** Step value (for number type) */
  step?: string;
  /** Accept attribute for file input */
  accept?: string;
  /** File change handler (for type="file") */
  onFileChange?: (file: File | null) => void;
}

/* ─── FormField ────────────────────────────────────────────── */

export function FormField({
  labelKey,
  placeholderKey,
  value,
  onChange,
  error,
  type = 'text',
  options,
  icon,
  className,
  required = false,
  hintKey,
  disabled = false,
  min,
  max,
  step,
  accept,
  onFileChange,
}: FormFieldProps) {
  const { t } = useI18n();
  const hasError = !!error && error.length > 0;
  const inputId = `field-${labelKey.replace(/\./g, '-')}`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      <label
        htmlFor={inputId}
        className="flex items-center gap-1.5 text-sm font-medium [color:var(--gs-foreground)]"
      >
        {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
        {t(labelKey)}
        {required && (
          <span className="text-xs [color:var(--gs-danger)]" aria-hidden="true">*</span>
        )}
      </label>

      {/* Input Field */}
      {type === 'select' && options ? (
        <select
          id={inputId}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'gsd-input appearance-none cursor-pointer',
            hasError && 'gsd-input--error',
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
        >
          <option value="">
            {placeholderKey ? t(placeholderKey) : t('common.select')}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={inputId}
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholderKey ? t(placeholderKey) : ''}
          disabled={disabled}
          rows={3}
          className={cn(
            'gsd-input min-h-[80px] py-2 resize-y',
            hasError && 'gsd-input--error',
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
        />
      ) : type === 'file' ? (
        <div className="flex flex-col gap-2">
          <input
            id={inputId}
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onFileChange?.(file);
            }}
            className={cn(
              'gsd-input file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0',
              'file:text-sm file:font-medium file:bg-primary-soft file:text-primary',
              'hover:file:bg-primary-soft-hover cursor-pointer',
              hasError && 'gsd-input--error',
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
          />
          {hintKey && (
            <p className="text-xs [color:var(--gs-foreground-muted)]">
              {t(hintKey)}
            </p>
          )}
        </div>
      ) : (
        <input
          id={inputId}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholderKey ? t(placeholderKey) : ''}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(
            'gsd-input',
            type === 'number' && 'tabular-nums',
            hasError && 'gsd-input--error',
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
        />
      )}

      {/* Hint text */}
      {hintKey && type !== 'file' && (
        <p className="text-xs [color:var(--gs-foreground-muted)]">
          {t(hintKey)}
        </p>
      )}

      {/* Error message */}
      {hasError && (
        <p
          id={`${inputId}-error`}
          className="flex items-center gap-1 text-xs [color:var(--gs-danger)]"
          role="alert"
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          {t(error as TranslationKey)}
        </p>
      )}
    </div>
  );
}
