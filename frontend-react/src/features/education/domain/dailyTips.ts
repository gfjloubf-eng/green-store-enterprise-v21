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
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
  },
  {
    id: 'whole-foods',
    title: 'هل تعلم؟ اختر الطعام الأقرب إلى صورته الطبيعية',
    body: 'الفواكه والخضروات الطازجة أو الأقل معالجة خيار عملي لبناء وجبات متوازنة، مع الانتباه إلى احتياجاتك الصحية وطريقة التحضير.',
    sourceLabel: 'منظمة الصحة العالمية — النظام الغذائي الصحي',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
  },
  {
    id: 'five-a-day-context',
    title: 'هل تعلم؟ الحصة تختلف حسب الصنف',
    body: 'لا توجد كمية واحدة مناسبة للجميع؛ حجم الحصة والاحتياج اليومي يتأثران بالعمر والنشاط والحالة الصحية، لذلك استخدم المعلومة للتثقيف لا للتشخيص.',
    sourceLabel: 'USDA FoodData Central — بيانات الأغذية',
    sourceUrl: 'https://fdc.nal.usda.gov/',
  },
  {
    id: 'skin-hair-eyes',
    title: 'هل تعلم؟ الغذاء يدعم الصحة العامة لا يعالج وحده',
    body: 'تحتاج البشرة والشعر والعينان إلى نمط حياة متوازن ومغذيات متنوعة؛ لا يُعد أي منتج غذائي علاجاً مستقلاً، واستشر مختصاً عند وجود عرض مستمر.',
    sourceLabel: 'منظمة الصحة العالمية — النظام الغذائي الصحي',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
  },
];

export function getDailyTip(date = new Date()): DailyTip {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return DAILY_TIPS[((dayNumber % DAILY_TIPS.length) + DAILY_TIPS.length) % DAILY_TIPS.length];
}
