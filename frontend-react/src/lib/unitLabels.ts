export type ProductUnitLike = {
  name?: string | null;
  abbreviation?: string | null;
};

/**
 * Keeps backend unit codes untouched while presenting familiar Arabic labels
 * in the storefront and product details.
 */
export function formatUnitLabel(unit: ProductUnitLike, compact = false): string {
  const value = `${unit.name ?? ''} ${unit.abbreviation ?? ''}`.trim().toLowerCase();

  if (/kilogram|kilo|\bkg\b|\bكجم\b|\bكيلو\b/.test(value)) return 'كجم';
  if (/gram|\bg\b|\bجرام\b|\bغرام\b/.test(value)) return 'جرام';
  if (/liter|litre|\bl\b|\bلتر\b/.test(value)) return 'لتر';
  if (/milliliter|millilitre|\bml\b|\bمل\b/.test(value)) return 'مل';
  if (/box|carton|\bbox\b|\bصندوق\b|\bكرتون\b/.test(value)) return 'صندوق';
  if (/bunch|bundle|\bربطة\b|\bحزمة\b/.test(value)) return 'ربطة';
  if (/piece|unit|each|\bpc\b|\bقطعة\b|\bحبة\b/.test(value)) return compact ? 'حبة' : 'قطعة';
  if (/dozen|\bdz\b|\bدرزن\b/.test(value)) return 'درزن';

  return unit.name || unit.abbreviation || 'وحدة';
}
