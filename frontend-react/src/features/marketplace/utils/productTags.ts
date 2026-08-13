import type { ProductDTO } from '@/features/products/domain/productDTO';
import type { ProductSummary } from '@/features/products/types/product';

export type ProductRecord = ProductDTO | ProductSummary;

const ORGANIC_BRAND_NAMES = new Set(['Green Farm', 'Organic Valley', 'EcoGrow']);
const YEMENI_BRAND_IDS = new Set(['br-1', 'br-2']);
const TOP_RATED_BRANDS: Record<string, number> = {
  'br-1': 4.9,
  'br-2': 4.7,
  'br-3': 4.6,
  'br-4': 4.5,
  'br-5': 4.4,
};

export function isFreshToday(product: ProductRecord) {
  const createdAt = new Date(product.createdAt).getTime();
  const thirtyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
  return createdAt >= thirtyDaysAgo;
}

export function isOrganic(product: ProductRecord) {
  return (
    product.name.toLowerCase().includes('organic') ||
    ORGANIC_BRAND_NAMES.has(product.brand.name)
  );
}

export function isSeasonal(product: ProductRecord) {
  return ['Vegetables', 'Fruits', 'Herbs'].includes(product.category.name);
}

export function isYemeni(product: ProductRecord) {
  return YEMENI_BRAND_IDS.has(product.brand.id);
}

export function getProductRating(product: ProductRecord) {
  return TOP_RATED_BRANDS[product.brand.id] ?? 4.2;
}

export function getStorageInstructions(product: ProductRecord) {
  switch (product.category.name) {
    case 'Vegetables':
      return 'احتفظ به في الثلاجة داخل درج الخضروات واحتفظ به جافًا لتحافظ على النكهة.';
    case 'Fruits':
      return 'يُنصح بتخزينه في مكان بارد وجاف بعيدًا عن الشمس، وغسله قبل الاستهلاك.';
    case 'Herbs':
      return 'ضعه في كوب ماء داخل الثلاجة أو لفه بقطعة قماش مبللة للحفاظ على الطراوة.';
    case 'Dairy':
      return 'حفظه في أقرب رف بارد داخل الثلاجة واستهله خلال أيام قليلة.';
    case 'Beverages':
      return 'احتفظ به مبردًا واستهله في الوقت المناسب للحفاظ على النضارة.';
    default:
      return 'احتفظ بالمنتج في مكان مناسب وبارد بعيدًا عن الرطوبة العالية.';
  }
}

export function getNutritionSummary(product: ProductRecord) {
  switch (product.category.name) {
    case 'Vegetables':
      return 'مصدر غني بالألياف والفيتامينات مع سعرات حرارية منخفضة ومناسب للنظام الغذائي.';
    case 'Fruits':
      return 'يحتوي على فيتامينات طبيعية والألياف، مناسب للوجبات الخفيفة الصحية.';
    case 'Herbs':
      return 'قيمة غذائية مركزة بنكهة مميزة ومضادات أكسدة داعمة للجسم.';
    case 'Dairy':
      return 'مصدر للبروتين والكالسيوم، مثالي للإفطار والمخبوزات.';
    case 'Beverages':
      return 'مشروب منعش مع عناصر غذائية خفيفة لدعم الرطوبة والنشاط اليومي.';
    default:
      return 'منتج ذو جودة مناسبة مع فوائد غذائية متوازنة للروتين اليومي.';
  }
}

export function getSuitableFor(product: ProductRecord) {
  switch (product.category.name) {
    case 'Vegetables':
      return 'مناسب للوجبات اليومية، السلطات، والشوربات الصحية.';
    case 'Fruits':
      return 'مناسب للوجبات الخفيفة، العصائر، والوجبات الخفيفة الصحية.';
    case 'Herbs':
      return 'مناسب لإضفاء نكهة على الأطباق والسلطات والمقبلات.';
    case 'Dairy':
      return 'مناسب للإفطار، الطهي، والوجبات المغذية الخفيفة.';
    case 'Beverages':
      return 'مناسب للترويح والاسترخاء مع وجباتك المفضلة.';
    default:
      return 'مناسب لتلبية احتياجاتك اليومية بطريقة مرنة.';
  }
}

export function getNotRecommendedFor(product: ProductRecord) {
  switch (product.category.name) {
    case 'Vegetables':
      return 'غير مفضل للتخزين الطويل أو الاستخدام خارج نطاق أسبوع واحد.';
    case 'Fruits':
      return 'غير مناسب لمن يتجنب السكريات الطبيعية أو يحتاج لتخزين لفترة طويلة.';
    case 'Herbs':
      return 'غير مناسب لمن يفضل الأطعمة ذات التخزين الطويل بدون استخدام سريع.';
    case 'Dairy':
      return 'غير مناسب لمن لديهم حساسية من الألبان أو يحتاجون لحفظ بعيد المدى.';
    case 'Beverages':
      return 'غير مناسب إن كنت تبحث عن خيار مُركز وطويل الأمد.';
    default:
      return 'اختر الكمية التي ستستهلكها خلال أقرب فرصة لتضمن نضارة المنتج.';
  }
}

export function getProductBadges(product: ProductRecord) {
  return [
    { label: 'طازج اليوم', active: isFreshToday(product) },
    { label: 'عضوي', active: isOrganic(product) },
    { label: 'محلي', active: isYemeni(product) },
    { label: 'موسمي', active: isSeasonal(product) },
  ];
}
