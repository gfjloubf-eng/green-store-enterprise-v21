import type { ProductDTO } from '@/features/products/domain/productDTO';
import type { ProductSummary } from '@/features/products/types/product';
import { getProduceIntelligence } from '@/features/products/domain/produceIntelligence';

export type ProductRecord = ProductDTO | ProductSummary;

const ORGANIC_BRAND_NAMES = new Set(['Green Farm', 'Organic Valley', 'EcoGrow']);
const YEMENI_BRAND_IDS = new Set(['br-1', 'br-2']);
const TOP_RATED_BRANDS: Record<string, number> = {
  'br-1': 4.9,
  'br-2': 4.8,
  'br-3': 4.7,
  'br-4': 4.6,
  'br-5': 4.5,
};

export function isFreshToday(product: ProductRecord) {
  const createdAt = new Date(product.createdAt).getTime();
  const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
  return createdAt >= thirtyDaysAgo || product.status === 'active';
}

export function isOrganic(product: ProductRecord) {
  return (
    product.name.toLowerCase().includes('organic') ||
    product.name.includes('عضوي') ||
    ORGANIC_BRAND_NAMES.has(product.brand.name)
  );
}

export function isSeasonal(product: ProductRecord) {
  return ['Vegetables', 'Fruits', 'Herbs'].includes(product.category.name);
}

export function isYemeni(product: ProductRecord) {
  return (
    YEMENI_BRAND_IDS.has(product.brand.id) ||
    product.name.includes('يمني') ||
    product.name.includes('بلدي') ||
    product.name.includes('صعدي') ||
    product.name.includes('مأربي') ||
    product.name.includes('روضي')
  );
}

export function getProductRating(product: ProductRecord) {
  return TOP_RATED_BRANDS[product.brand.id] ?? 4.8;
}

export function getStorageInstructions(product: ProductRecord) {
  const intel = getProduceIntelligence(product);
  return intel.storageGuidance;
}

export function getNutritionSummary(product: ProductRecord) {
  const intel = getProduceIntelligence(product);
  return intel.nutritionHighlights.join(' • ');
}

export function getSuitableFor(product: ProductRecord) {
  const intel = getProduceIntelligence(product);
  return intel.suitability.general;
}

export function getNotRecommendedFor(product: ProductRecord) {
  const intel = getProduceIntelligence(product);
  if (intel.suitability.cautionNotes && intel.suitability.cautionNotes.length > 0) {
    return intel.suitability.cautionNotes.join(' ');
  }
  return 'يُفضل الغسيل الجيد بالماء الجاري قبل الاستهلاك والاعتدال حسب الاحتياجات الفردية.';
}

export function getProductBadges(product: ProductRecord) {
  return [
    { label: 'طازج اليوم', active: isFreshToday(product) },
    { label: 'عضوي', active: isOrganic(product) },
    { label: 'محلي يمني', active: isYemeni(product) },
    { label: 'موسمي', active: isSeasonal(product) },
  ];
}
