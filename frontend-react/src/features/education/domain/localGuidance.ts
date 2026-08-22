import type { EducationArticle } from '@/services/educationClient';

/**
 * Read-only local fallback. It is used only when the education API is unavailable.
 * It is not a replacement for database content and contains no external links.
 */
export const LOCAL_GUIDANCE_ARTICLES: EducationArticle[] = [
  {
    id: 'local-balanced-diet',
    slug: 'local-balanced-diet',
    title: 'أساسيات الغذاء المتوازن',
    summary: 'إرشاد عام مبسط عن تنويع الفواكه والخضروات ضمن نمط غذائي متوازن.',
    body: 'يساعد تنويع الفواكه والخضروات واختيار الطعام الأقل معالجة على بناء نمط غذائي متوازن. تختلف الاحتياجات حسب العمر والنشاط والحالة الصحية، لذلك لا توجد كمية واحدة مناسبة للجميع. هذه معلومات تثقيفية عامة وليست تشخيصاً أو علاجاً.',
    articleType: 'BENEFITS',
    status: 'PUBLISHED',
    sourceUrls: [],
    family: null,
    productLinks: [],
  },
  {
    id: 'local-fruit-and-vegetable-differences',
    slug: 'local-fruit-and-vegetable-differences',
    title: 'كيف نميّز بين الفواكه والخضروات؟',
    summary: 'شرح مبسط يوضح الفرق بين قسم المنتجات وقسم المعرفة الغذائية.',
    body: 'قسم المنتجات مخصص للأصناف المتاحة للبيع وأسعارها وصورها ومخزونها. أما قسم المعرفة الغذائية فيقدم شرحاً عاماً عن الصنف وطريقة اختياره وحفظه، ولا يثبت وحده فائدة علاجية. افحص اسم المنتج والصورة قبل الطلب، واستشر مختصاً عند وجود حالة صحية خاصة.',
    articleType: 'GENERAL',
    status: 'PUBLISHED',
    sourceUrls: [],
    family: null,
    productLinks: [],
  },
];

export function getLocalGuidanceArticle(slug: string): EducationArticle | null {
  return LOCAL_GUIDANCE_ARTICLES.find((article) => article.slug === slug) ?? null;
}
