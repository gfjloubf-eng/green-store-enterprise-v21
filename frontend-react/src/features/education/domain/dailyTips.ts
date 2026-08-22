export interface DailyTip {
  id: string;
  title: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
}

/**
 * Curated educational tips. The UI rotates them deterministically by date;
 * it does not present an unreviewed model response as medical advice.
 */
const DAILY_TIPS: DailyTip[] = [
  {
    id: 'variety-and-balance',
    title: 'هل تعلم؟ التنوع أهم من صنف واحد',
    body: 'إدخال مجموعة متنوعة من الفواكه والخضروات ضمن نمط غذائي متوازن يساعد على زيادة تنوع العناصر الغذائية التي يحصل عليها الجسم.',
    sourceLabel: 'منظمة الصحة العالمية — النظام الغذائي الصحي',
    sourceUrl: 'https://www.who.int/ar/news-room/fact-sheets/detail/healthy-diet',
  },
  {
    id: 'whole-foods',
    title: 'هل تعلم؟ اختر الطعام الأقرب إلى صورته الطبيعية',
    body: 'الفواكه والخضروات الطازجة أو الأقل معالجة خيار عملي لبناء وجبات متوازنة، مع الانتباه إلى احتياجاتك الصحية وطريقة التحضير.',
    sourceLabel: 'منظمة الصحة العالمية — النظام الغذائي الصحي',
    sourceUrl: 'https://www.who.int/ar/news-room/fact-sheets/detail/healthy-diet',
  },
  {
    id: 'five-a-day-context',
    title: 'هل تعلم؟ الحصة تختلف حسب الصنف',
    body: 'لا توجد كمية واحدة مناسبة للجميع؛ حجم الحصة والاحتياج اليومي يتأثران بالعمر والنشاط والحالة الصحية، لذلك استخدم المعلومة للتثقيف لا للتشخيص.',
    sourceLabel: 'وزارة الصحة السعودية — التوعية بالغذاء الصحي',
    sourceUrl: 'https://www.moh.gov.sa/awarenessplateform/healthylifestyle/pages/healthyeatinghabits.aspx',
  },
  {
    id: 'skin-hair-eyes',
    title: 'هل تعلم؟ الغذاء يدعم الصحة العامة لا يعالج وحده',
    body: 'تحتاج البشرة والشعر والعينان إلى نمط حياة متوازن ومغذيات متنوعة؛ لا يُعد أي منتج غذائي علاجاً مستقلاً، واستشر مختصاً عند وجود عرض مستمر.',
    sourceLabel: 'منظمة الصحة العالمية — النظام الغذائي الصحي',
    sourceUrl: 'https://www.who.int/ar/news-room/fact-sheets/detail/healthy-diet',
  },
  {
    id: 'zucchini-vs-carrot',
    title: 'هل تعلم؟ الفرق بين الكوسا والجزر في التغذية',
    body: 'الجزر غني بالبيتا كاروتين (فيتامين أ)، بينما الكوسا تحتوي على نسبة عالية من الماء والألياف، وكلاهما يدعم الهضم الصحي كجزء من نظام غذائي متكامل.',
    sourceLabel: 'وزارة الصحة السعودية — إرشادات الغذاء والتغذية',
    sourceUrl: 'https://www.moh.gov.sa/awarenessplateform/healthylifestyle/pages/healthyeatinghabits.aspx',
  },
  {
    id: 'apple-variety',
    title: 'هل تعلم؟ أنواع التفاح تختلف في السكر والألياف',
    body: 'قد يختلف طعم التفاح ودرجة حلاوته باختلاف الصنف ودرجة النضج، وتوفر الثمرة الكاملة أليافاً غذائية ضمن نظام متوازن.',
    sourceLabel: 'وزارة الصحة السعودية — التوعية بالغذاء الصحي',
    sourceUrl: 'https://www.moh.gov.sa/awarenessplateform/healthylifestyle/pages/healthyeatinghabits.aspx',
  },
  {
    id: 'hydration-fruits',
    title: 'هل تعلم؟ الفواكه وسيلة لذيذة للترطيب',
    body: 'يحتوي البطيخ والشمام على نسبة مرتفعة من الماء، وقد يساعد تناولهما ضمن الغذاء المتوازن على زيادة السوائل، لكنهما لا يغنيان عن شرب الماء.',
    sourceLabel: 'وزارة الصحة السعودية — التوعية بالغذاء الصحي',
    sourceUrl: 'https://www.moh.gov.sa/healthawareness/educationalcontent/food-and-nutrition/pages/guidelines.aspx',
  },
];

export function getDailyTip(date = new Date()): DailyTip {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return DAILY_TIPS[((dayNumber % DAILY_TIPS.length) + DAILY_TIPS.length) % DAILY_TIPS.length];
}
