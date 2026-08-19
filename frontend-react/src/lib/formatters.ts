/**
 * Global price & currency formatter for Qutoof Enterprise v2.
 * Official store currency: YER (الريال اليمني).
 * Does not modify database values, change API contracts, or attempt external currency conversion.
 */
export function formatPrice(amount: number | null | undefined, locale: string = 'ar', currency: string = 'YER'): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const isArabic = locale === 'ar' || locale.startsWith('ar');

  const normalizedCurrency = currency === 'SAR' || currency === 'ر.س' ? 'YER' : currency;
  const currencySymbol = (normalizedCurrency === 'YER' || normalizedCurrency === 'ر.ي' || !normalizedCurrency)
    ? (isArabic ? 'ر.ي' : 'YER')
    : normalizedCurrency;

  const formattedAmount = new Intl.NumberFormat(isArabic ? 'ar-YE' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

  return `${formattedAmount} ${currencySymbol}`;
}
