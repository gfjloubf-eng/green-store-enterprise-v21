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
  {
    id: 'local-washing-produce',
    slug: 'local-washing-produce',
    title: 'غسل الفواكه والخضروات قبل الاستخدام',
    summary: 'خطوات عامة لتقليل الأوساخ أثناء تجهيز المنتجات الطازجة.',
    body: 'اغسل يديك وأدوات التحضير، ثم اشطف الفواكه والخضروات تحت ماء جارٍ وافرك السطح بلطف عند الحاجة. لا تستخدم الصابون أو مواد التنظيف على الطعام. جفف المنتج بوسيلة نظيفة، وافصل الطعام الجاهز عن المنتجات غير المغسولة. هذه إرشادات نظافة عامة وليست بديلاً عن تعليمات السلامة الغذائية المحلية.',
    articleType: 'FOOD_SAFETY',
    status: 'PUBLISHED',
    sourceUrls: [],
    family: null,
    productLinks: [],
  },
  {
    id: 'local-safe-storage',
    slug: 'local-safe-storage',
    title: 'حفظ الفواكه والخضروات بطريقة أفضل',
    summary: 'مبادئ عامة للمحافظة على جودة المنتجات وتقليل التلف.',
    body: 'احفظ كل صنف حسب طبيعته ودرجة نضجه، واتبع تعليمات المتجر أو العبوة عند توفرها. ضع المنتجات التي تحتاج تبريداً في الثلاجة، وتجنب تخزين الطعام في مكان رطب أو معرض للشمس. راقب تغير اللون أو الرائحة أو القوام، ولا تتناول المنتج عند ظهور علامات فساد واضحة.',
    articleType: 'FOOD_SAFETY',
    status: 'PUBLISHED',
    sourceUrls: [],
    family: null,
    productLinks: [],
  },
  {
    id: 'local-whole-fruit-juice',
    slug: 'local-whole-fruit-juice',
    title: 'الثمرة الكاملة والعصير: ما الفرق؟',
    summary: 'توضيح تثقيفي عام للفرق بين تناول الثمرة الكاملة وشرب العصير.',
    body: 'تحتوي الثمرة الكاملة عادةً على ألياف وقوام يساعدان على تناولها ببطء، بينما قد يكون شرب العصير أسهل وأسرع. تختلف المكونات حسب طريقة التحضير والصنف، لذلك لا يصح اعتبار العصير علاجاً أو بديلاً دائماً عن الماء. اختر ما يناسب نمطك الغذائي واحتياجاتك، واستشر مختصاً عند وجود حالة صحية خاصة.',
    articleType: 'COMPARISON',
    status: 'PUBLISHED',
    sourceUrls: [],
    family: null,
    productLinks: [],
  },
  {
    id: 'local-food-allergy',
    slug: 'local-food-allergy',
    title: 'الحساسية الغذائية وقراءة مكونات الطعام',
    summary: 'تنبيه عام لمن لديهم حساسية معروفة تجاه مكونات معينة.',
    body: 'إذا كانت لديك حساسية غذائية معروفة، اقرأ مكونات الطعام واسأل عن طريقة التحضير واحتمال التلوث التبادلي. لا تعتمد على شكل المنتج أو اسمه وحدهما. عند ظهور أعراض شديدة أو سريعة بعد تناول طعام، اطلب المساعدة الطبية العاجلة وفق الإرشادات المحلية. لا يقدم هذا المقال تشخيصاً أو خطة علاج.',
    articleType: 'SAFETY',
    status: 'PUBLISHED',
    sourceUrls: [],
    family: null,
    productLinks: [],
  },
  {
    id: 'local-when-to-consult',
    slug: 'local-when-to-consult',
    title: 'متى تحتاج إلى استشارة مختص؟',
    summary: 'علامات عامة تذكّر بأن المقالات الغذائية لا تغني عن التقييم المهني.',
    body: 'اطلب استشارة طبيب أو أخصائي تغذية مؤهل عند وجود مرض مزمن، حمل، حساسية، تناول أدوية، فقدان أو زيادة وزن غير مقصودة، أو أعراض مستمرة. المحتوى في مركز المعرفة يشرح الغذاء والمنتجات بصورة عامة، ولا يحدد تشخيصاً أو علاجاً أو جرعة مناسبة لشخص بعينه.',
    articleType: 'SAFETY',
    status: 'PUBLISHED',
    sourceUrls: [],
    family: null,
    productLinks: [],
  },
];

export function getLocalGuidanceArticle(slug: string): EducationArticle | null {
  return LOCAL_GUIDANCE_ARTICLES.find((article) => article.slug === slug) ?? null;
}
