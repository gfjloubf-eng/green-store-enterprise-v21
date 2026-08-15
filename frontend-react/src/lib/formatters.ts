/**
 * Global price & currency formatter for Qutoof Enterprise v2.
 * Official store currency: YER (الريال اليمني).
 * Does not modify database values, change API contracts, or attempt external currency conversion.
 */
export function formatPrice(amount: number | null | undefined, locale: string = 'ar', currency: string = 'YER'): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const isArabic = locale === 'ar' || locale.startsWith('ar');

  const currencySymbol = (currency === 'YER' || currency === 'ر.ي' || !currency)
    ? (isArabic ? 'ر.ي' : 'YER')
    : (currency === 'SAR' || currency === 'ر.س')
    ? (isArabic ? 'ر.س' : 'SAR')
    : currency;

  const formattedAmount = num.toFixed(2);

  return isArabic ? `${formattedAmount} ${currencySymbol}` : `${formattedAmount} ${currencySymbol}`;
}
