/* ============================================================
   GSDS v1.2 — Produce Intelligence Domain & Data Registry
   Green Store Enterprise v2 — Real Produce Intelligence
   ============================================================
   Provides rich, responsible, structured produce metadata.
   Strictly food-educational (NO medical or disease-curing claims).
   ============================================================ */

export interface ProduceSuitability {
  /** General suitability for the majority of people */
  general: string;
  /** Role in a balanced daily diet */
  balancedDiet: string;
  /** Serving advice & age appropriateness for children */
  children: string;
  /** General notes for pregnant women */
  pregnant: string;
  /** Responsible caution notes (allergies, natural sugars, etc.) */
  cautionNotes?: string[];
}

export interface ProduceIntelligence {
  /** Unique produce identifier or mapping key */
  id: string;
  /** Normalized lookup key */
  slug: string;
  /** Arabic product name */
  nameAr: string;
  /** English product name */
  nameEn: string;
  /** Produce category */
  category: 'Fruits' | 'Vegetables' | 'Herbs';
  /** Short description / summary */
  shortDescription: string;
  /** General benefits (🌿 الفوائد العامة) */
  generalBenefits: string[];
  /** Nutrition highlights (🥗 العناصر الغذائية البارزة) */
  nutritionHighlights: string[];
  /** Common uses (🍽️ الاستخدامات الشائعة) */
  commonUses: string[];
  /** Storage guidance (❄️ طريقة الحفظ) */
  storageGuidance: string;
  /** Preparation guidance (🔪 طريقة التحضير) */
  preparationGuidance: string;
  /** Suitability overview (👨‍👩‍👧‍👦 لمن يناسب؟) */
  suitability: ProduceSuitability;
  /** Season (🌱 الموسم) */
  season: string;
  /** Origin / Region (📍 المنشأ) */
  origin: string;
  /** Educational illustrative image URL (Unsplash clean produce URL) */
  educationalImage?: string;
  /** Alt description for educational image */
  educationalImageAltAr?: string;
  /** Related produce IDs */
  relatedProductIds?: string[];
}

/**
 * Produce Intelligence Data Registry
 * Mapping produce keys to detailed educational metadata.
 */
export const PRODUCE_INTELLIGENCE_MAP: Record<string, ProduceIntelligence> = {
  'apple': {
    id: 'apple',
    slug: 'apple',
    nameAr: 'تفاح أحمر / أخضر',
    nameEn: 'Apple',
    category: 'Fruits',
    shortDescription: 'فاكهة مقرمشة وغنية بالألياف الطبيعية ومضادات الأكسدة، مناسبة للوجبات الخفيفة اليومية.',
    generalBenefits: [
      'يحتوي على نسبة عالية من الألياف الطبيعية (البكتين) الداعمة للهضم الصحي.',
      'مصدر جيد لفيتامين ج (C) الذي يساهم في دعم المناعة اليومية.',
      'يساعد في تعزيز الشعور بالشبع لفترة طويلة بفضل محتواه العالي من الماء والألياف.',
      'يمثل وجبة خفيفة ومغذية للأطفال والكبار طوال اليوم.'
    ],
    nutritionHighlights: [
      'فيتامين C',
      'ألياف البكتين',
      'البوتاسيوم',
      'مضادات الأكسدة (الفلافونويد)'
    ],
    commonUses: [
      'يُتناول طازجًا كوجبة خفيفة ومقرمشة.',
      'يُضاف إلى سلطات الفواكه والسلطات الخضراء لإعطاء نكهة منعشة.',
      'يُستخدم في إعداد العصائر الطبيعية والمخبوزات الصحية.'
    ],
    storageGuidance: 'يُفضل حفظه في الدرج السفلي للثلاجة للحفاظ على هشاشته ونضارته لمدة تصل إلى 2-3 أسابيع، أو في مكان بارد وجاف للاستهلاك السريع.',
    preparationGuidance: 'يُغسل جيدًا بالماء الجاري قبل الأكل. يمكن تناوله بقشره للاستفادة الكاملة من الألياف.',
    suitability: {
      general: 'مناسب عادةً لمعظم الأشخاص كخيار مغذٍ ووافر الألياف.',
      balancedDiet: 'يُمثل إضافة ممتازة للنظام الغذائي المتوازن اليومي.',
      children: 'مناسب للأطفال من عمر 6 أشهر (مهروسًا) وللأطفال الكبار كمكعبات طازجة.',
      pregnant: 'خيار ممتاز أثناء الحمل لاحتوائه على السوائل والألياف الطبيعية.',
      cautionNotes: [
        'يُنصح باعتدال الاستهلاك لمرضى السكري لمراعاة السكريات الطبيعية.',
        'يُفضل غسل القشر جيدًا لإزالة أي شوائب.'
      ]
    },
    season: 'شتوي / خريفي (متوفر على مدار السنة)',
    origin: 'مزارع صعدة / الحيمة / وارد ممتاز',
    educationalImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'تفاح أحمر طازج ومقرمش'
  },
  'banana': {
    id: 'banana',
    slug: 'banana',
    nameAr: 'موز عضوي طازج',
    nameEn: 'Organic Bananas',
    category: 'Fruits',
    shortDescription: 'مصدر طبيعي ممتازة للطاقة السريعة والبوتاسيوم، يتميز بطعمه الهادئ وقوامه الطري.',
    generalBenefits: [
      'يوفر طاقة سريعة وسهلة الهضم، مما يجعله مثاليًا قبل وبعد التمارين الرياضية.',
      'غني بالبوتاسيوم الذي يساهم في دعم توازن السوائل ووظائف العضلات.',
      'يحتوي على فيتامين B6 الداعم للنشاط العصبي اليومي.',
      'سهل الهضم ولطيف على المعدة.'
    ],
    nutritionHighlights: [
      'البوتاسيوم',
      'فيتامين B6',
      'ألياف طبيعية',
      'مغنيسيوم'
    ],
    commonUses: [
      'يتناول طازجًا كوجبة سريعة.',
      'يُضاف إلى مشروبات السموثي والإفطار مع الشوفان.',
      'يُستخدم في تحضير الحلويات والمخبوزات الصحية.'
    ],
    storageGuidance: 'يُحفظ في درجة حرارة الغرفة بعيدًا عن أشعة الشمس المباشرة. تجنب وضعه في الثلاجة قبل اكتمال نضجه لمنع اسوداد القشرة.',
    preparationGuidance: 'يُقشر ويُتناول مباشرة أو يُقطع إلى شرائح للوجبات المختلفة.',
    suitability: {
      general: 'مناسب جداً لجميع الفئات العمرية كوجبة مشبعة ولطيفة.',
      balancedDiet: 'يوفر عنصرًا مغذيًا وسريع التحضير ضمن الوجبات اليومية.',
      children: 'من أفضل الأطعمة الأولى للأغذية التكميلية للأطفال بعد 6 أشهر.',
      pregnant: 'يساعد في تخفيف الغثيان الصباحي ويوفر الطاقة السريعة.',
      cautionNotes: [
        'يُنصح باعتدال الاستهلاك لمن يراقبون مستويات السكر في الدم نظراً لاحتوائه على الكاربوهيدرات السريعة.'
      ]
    },
    season: 'على مدار السنة',
    origin: 'مزارع تهامة / أبين العضوية',
    educationalImage: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'موز عضوي طازج'
  },
  'orange': {
    id: 'orange',
    slug: 'orange',
    nameAr: 'برتقال طازج',
    nameEn: 'Orange',
    category: 'Fruits',
    shortDescription: 'فاكهة حمضية مليئة بالعصير المنعش وفيتامين C، تمنح الانتعاش والحيوية.',
    generalBenefits: [
      'غني جدًا بفيتامين ج (C) الداعم لجهاز المناعة وصحة الجلد.',
      'يحتوي على نسبة جيدة من الماء التي تساهم في ترطيب الجسم.',
      'مصدر للألياف الغذائية عند تناوله بثماره الكاملة.',
      'يمتلك نكهة حمضية متوازنة تنعش الحواس.'
    ],
    nutritionHighlights: [
      'فيتامين C (جرعة يومية ممتازة)',
      'حمض الفوليك',
      'ثيامين (فيتامين B1)',
      'مضادات الأكسدة الحمضية'
    ],
    commonUses: [
      'يُصر كعصير طبيعي منعش بدون إضافة سكر.',
      'يُتناول طازجًا بعد التقشير.',
      'تُستخدم قشوره المبشورة لإضافة نكهة للمخبوزات والسلطات.'
    ],
    storageGuidance: 'يمكن حفظه في حرارة الغرفة لعدة أيام، أو في الثلاجة لمدة تصل إلى أسبوعين للحفاظ على العصارة.',
    preparationGuidance: 'يُغسل القشر الخارجي جيدًا قبل التقشير أو التقطيع.',
    suitability: {
      general: 'خيار ممتاز لمصادر فيتامين ج الطبيعية.',
      balancedDiet: 'يُكمل الاحتياج اليومي من السوائل والفيتامينات.',
      children: 'مناسب للأطفال كشرائح طازجة أو عصير طبيعي مخفف بالماء.',
      pregnant: 'يوفر حمض الفوليك وفيتامين C المهمين خلال فترة الحمل.',
      cautionNotes: [
        'قد يسبب إزعاجًا بسيطًا لمن يعانون من حموضة المعدة أو ارتجاع المريء عند تناوله على معدة فارغة.'
      ]
    },
    season: 'شتوي / ربيعي',
    origin: 'مزارع مأرب / وارد ممتاز',
    educationalImage: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'برتقال طازج مليء بالعصارة'
  },
  'lemon': {
    id: 'lemon',
    slug: 'lemon',
    nameAr: 'ليمون بلدي طازج',
    nameEn: 'Fresh Lemon',
    category: 'Fruits',
    shortDescription: 'حمضيات مركزة النكهة، لا غنى عنها في التتبيل والعصائر والمشروبات الدافئة.',
    generalBenefits: [
      'يحتوي على تركيز عالٍ من حمض الستريك وفيتامين C.',
      'يساعد في تعزيز امتصاص الحديد من الأطعمة النباتية عند إضافته للسلطات.',
      'يضيف طعمًا حمضيًا منعشًا يقلل الحاجة لإضافة الملح الزائد للأطعمة.'
    ],
    nutritionHighlights: ['فيتامين C', 'حمض الستريك', 'فلافونويدات', 'بوتاسيوم'],
    commonUses: ['عصير الليمون المنعش', 'تتبيل السلطات والمأكولات البحرية والمشاوي', 'المشروبات الدافئة مع العسل'],
    storageGuidance: 'يُحفظ في الثلاجة في كيس مخصص للحفاظ على رطوبته لمدة تصل إلى شهر.',
    preparationGuidance: 'يُعصر طازجًا عند الاستخدام للحصول على أعلى فائدة ونكهة.',
    suitability: {
      general: 'مناسب لجميع الإعدادات الغذائية اليومية.',
      balancedDiet: 'إضافة صحية منخفضة السعرات لتنكيه الوجبات.',
      children: 'يُفضل تقديمه مخففًا في العصائر أو المشروبات.',
      pregnant: 'يساعد عصير الليمون الخفيف في تخفيف الشعور بالغثيان.',
      cautionNotes: ['حموضته العالية قد تؤثر على أسنان الأشخاص الحساسين عند شربه بكثرة دون تخفيف.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع تعز / لحج البلدية',
    educationalImage: 'https://images.unsplash.com/photo-1534531173927-aeb706dd57a2?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'ليمون بلدي طازج'
  },
  'mango': {
    id: 'mango',
    slug: 'mango',
    nameAr: 'مانجو يمني فاخر',
    nameEn: 'Yemeni Mango',
    category: 'Fruits',
    shortDescription: 'ملكة الفواكه الصيفية تتميز بحلاوتها الاستوائية ورائحتها العطرية الغنية.',
    generalBenefits: [
      'غنية بفيتامين A و C الداعمين لصحة النظر والبشرة.',
      'تحتوي على إنزيمات طبيعية تساعد في تسهيل عملية الهضم.',
      'تمنح طاقة وغذاءً استوائيًا منعشًا في أيام الصيف.'
    ],
    nutritionHighlights: ['فيتامين A (بيتا كاروتين)', 'فيتامين C', 'ألياف غذائية', 'نحاس ومغنيسيوم'],
    commonUses: ['تناولها طازجة كشرائح', 'عصائر المانجو الفاخرة', 'إضافتها لطبق سلطة الفواكه'],
    storageGuidance: 'تُحفظ في حرارة الغرفة حتى تنضج، ثم تبرّد في الثلاجة للاستهلاك خلال 3-5 أيام.',
    preparationGuidance: 'تُغسل جيدًا وتُقشر ثم تُقطع حول النواة المركزية.',
    suitability: {
      general: 'فاكهة محبوبة ومغذية جداً لمختلف الأعمار.',
      balancedDiet: 'وجبة صيفية ممتعة غنية بالفيتامينات.',
      children: 'ممتازة للأطفال كقطع طرية أو عصير طبيعي.',
      pregnant: 'مصدر طبيعي ممتاز لحمض الفوليك وفيتامين A.',
      cautionNotes: ['تنعكس حلاوتها المرتفعة على نسبة السكريات الطبيعية، لذا يُستحسن الاعتدال لمرضى السكري.']
    },
    season: 'صيفي (أبريل - أغسطس)',
    origin: 'مزارع الحديدة / حجة (السهل التهامي)',
    educationalImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'مانجو يمني طازج'
  },
  'pomegranate': {
    id: 'pomegranate',
    slug: 'pomegranate',
    nameAr: 'رمان صعدي ممتاز',
    nameEn: 'Saada Pomegranate',
    category: 'Fruits',
    shortDescription: 'حبيبات الرمان الياقوتية الشهيرة بحلاوتها المعتدلة وفوائدها الغذائية الكبيرة.',
    generalBenefits: [
      'غني جدًا بمضادات الأكسدة القوية (البوليفينول) الداعمة لصحة الخلايا.',
      'يحتوي على مركبات طبيعية تساعد في دعم صحة القلب والدورة الدموية.',
      'مصدر ممتاز للألياف الغذائية وفيتامين K.'
    ],
    nutritionHighlights: ['مضادات أكسدة بونيكالاجين', 'فيتامين C & K', 'ألياف حبوب الرمان', 'بوتاسيوم'],
    commonUses: ['تناول الحبوب طازجة', 'عصير الرمان الطبيعي', 'إضافته للسلطات والمقبلات مثل التبولة والسلطة الخضراء'],
    storageGuidance: 'تحفظ الثمرة كاملة في مكان بارد لعدة أسابيع، أو تُحفظ الحبوب في علبة محكمة بالثلاجة لمدة 5 أيام.',
    preparationGuidance: 'يُشق الجدار الخارجي للثمرة وتُفصل الحبوب في طبق ماء لتسهيل إزالة الغشاء الأبيض.',
    suitability: {
      general: 'خيار ممتاز لمضادات الأكسدة الطبيعية.',
      balancedDiet: 'إضافة راقية ومغذية لأطباق اليوم.',
      children: 'مناسب للأطفال مع الانتباه للحبيبات الصغيرة.',
      pregnant: 'غني بالفيتامينات والمعادن النافعة.',
      cautionNotes: ['يُفضل عدم الإفراط لمن يعانون من الإمساك الشديد بسبب ألياف البذور الصلبة.']
    },
    season: 'خريفي / شتوي',
    origin: 'مزارع صعدة (الروضة / حيدان)',
    educationalImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'رمان صعدي ممتاز'
  },
  'grapes': {
    id: 'grapes',
    slug: 'grapes',
    nameAr: 'عنب روضي يمني',
    nameEn: 'Yemeni Grapes',
    category: 'Fruits',
    shortDescription: 'عناقيد العنب الروضي العطري المشهور بطعمه السكري الفريد وجودته العالية.',
    generalBenefits: [
      'يحتوي على مركبات الرزفيراترول ومضادات الأكسدة الداعمة للحيوية.',
      'مصدر طبيعي ممتازة للطاقة المرطبة والمقوية.',
      'يدعم صحة القلب والأوعية الدموية ضمن نظام غذائي متوازن.'
    ],
    nutritionHighlights: ['الرزفيراترول', 'فيتامين K', 'فيتامين B6', 'سكريات الفواكه الطبيعية'],
    commonUses: ['تناوله طازجًا كوجبة فواكه عائلية', 'تجفيفه لصنع الزبيب اليمني الشهير'],
    storageGuidance: 'يُغسل فقط قبل الاستهلاك مباشرة، ويُحفظ في الثلاجة غير مغسول داخل كيس مفرغ الهواء.',
    preparationGuidance: 'يُغسل جيدًا بالماء الجاري قبل التقديم.',
    suitability: {
      general: 'فاكهة تقليدية مغذية ومحبوبة.',
      balancedDiet: 'تمنح الجسم طاقة وسوائل هامة.',
      children: 'يُفضل تقطيع العنب طوليًا للأطفال دون سن الرابعة لتفادي الغصص.',
      pregnant: 'مصدر رائع للطاقة الطبيعية والمعادن.',
      cautionNotes: ['يحتوي على نسبة سكريات سريعة، يُوصى بالاعتدال لمرضى السكري.']
    },
    season: 'صيفي / خريفي',
    origin: 'مزارع الروضة / بني حشيش (صنعاء)',
    educationalImage: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'عنب يمني فاخر'
  },
  'strawberry': {
    id: 'strawberry',
    slug: 'strawberry',
    nameAr: 'فراولة طازجة',
    nameEn: 'Fresh Strawberries',
    category: 'Fruits',
    shortDescription: 'ثمار حمراء زاهية النكهة، قليلة السعرات الحرارية وغنية بالأنثوسيانين وفيتامين C.',
    generalBenefits: [
      'منسوب حراري منخفض جدًا مع طعم لذيذ وممتع.',
      'غنية جداً بالأنثوسيانين وفيتامين C للحفاظ على نضارة البشرة والصحة العامة.',
      'تساعد في تحسين التنوع الغذائي في النظام اليومي.'
    ],
    nutritionHighlights: ['فيتامين C العالي', 'منغنيز', 'حمض الفوليك', 'مضادات أكسدة أنثوسيانين'],
    commonUses: ['تناولها طازجة', 'إضافتها للزبادي والحلويات الصحية', 'عصائر الكوكتيل والسموثي'],
    storageGuidance: 'تُحفظ في الثلاجة في طبقة واحدة مناديل ورقية وتغسل فقط قبل الأكل.',
    preparationGuidance: 'تزال الأوراق الخضراء وتُغسل بالماء البارد قبل التقديم.',
    suitability: {
      general: 'مناسبة لجميع الحميات منخفضة السعرات.',
      balancedDiet: 'خيار ممتاز للوجبات الخفيفة اليومية.',
      children: 'محبوبة جداً للأطفال وطعام جذاب بصريًا.',
      pregnant: 'تمد الجسم بمادة الفوليك الضرورية للحمل.',
      cautionNotes: ['قد تتسبب بحساسية لدى بعض الأشخاص الحساسين للتوتيات.']
    },
    season: 'ربيعي / صيفي',
    origin: 'مزارع صنعاء / إب / مزارع محلية',
    educationalImage: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'فراولة طازجة حمراء'
  },
  'watermelon': {
    id: 'watermelon',
    slug: 'watermelon',
    nameAr: 'بطيخ أحمر بلدي',
    nameEn: 'Fresh Watermelon',
    category: 'Fruits',
    shortDescription: 'الفاكهة الصيفية الأكثر إنعاشاً، تحتوي على أكثر من 90% ماء مع الليكوبين المنعش.',
    generalBenefits: [
      'ترطيب ممتاز للجسم خلال الأيام الحارة بفضل محتواه العالي من الماء.',
      'مصدر ممتاز لليكوبين، وهو مضاد أكسدة قوي يدعم صحة الخلايا والقلب.',
      'يحتوي على حمض السيترولين الأميني الذي يساهم في دعم الاسترخاء العضلي.'
    ],
    nutritionHighlights: ['الليكوبين', 'ماء بنسبة 92%', 'فيتامين A & C', 'سيترولين'],
    commonUses: ['قطع البطيخ الباردة', 'عصير البطيخ المثلج', 'مكعبات مع الجبن الأبيض الخفيف'],
    storageGuidance: 'الثمرة الكاملة تحفظ في مكان بارد، وبعد التقطيع تُغطى جيداً وتوضع بالثلاجة وتستهلك خلال 3-4 أيام.',
    preparationGuidance: 'يُغسل الغلاف الخارجي جيدًا قبل التقطيع بالسكين.',
    suitability: {
      general: 'مرطب طبيعي رائع لكل أفراد العائلة.',
      balancedDiet: 'يساعد في تلبية الاحتياجات اليومية من السوائل.',
      children: 'منعش وممتع للأطفال كوجبة صيفية.',
      pregnant: 'يساعد على خفض الشعور بالحرارة وترطيب الجسم.',
      cautionNotes: ['يُفضل عدم الإفراط للمصابين بالسكري لمراعاة المؤشر الجلايسيمي للمشروب.']
    },
    season: 'صيفي',
    origin: 'مزارع مأرب / الجوف / تهامة',
    educationalImage: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'بطيخ صيفي منعش'
  },
  'tomato': {
    id: 'tomato',
    slug: 'tomato',
    nameAr: 'طماطم بلدي طازجة',
    nameEn: 'Fresh Tomatoes',
    category: 'Vegetables',
    shortDescription: 'عنصر أساسي في المطبخ العربي واليمني، غنية بالليكوبين والطعم العصيري الطازج.',
    generalBenefits: [
      'مصدر رئيسي لمادة الليكوبين مضادة الأكسدة التي تزداد فاعليتها عند الطهي الخفيف.',
      'تدعم الصحة العامة وصحة الجلد والقلب لاحتوائها على فيتامين ج والبوتاسيوم.',
      'تضيف نكهة طبيعية قوية للمأكولات والسلطات والأيدامات.'
    ],
    nutritionHighlights: ['الليكوبين', 'فيتامين C', 'البوتاسيوم', 'فيتامين K'],
    commonUses: ['أساس السلطة الخضراء اليومية', 'الصلصات الطبيعية للطهي والكبسة', 'سلطة السحاوق اليمنية مع الفلفل والثوم'],
    storageGuidance: 'يُفضل حفظ الطماطم في حرارة الغرفة بعيداً عن الثلاجة لترسيخ النكهة، وتوضع بالثلاجة فقط عند اكتمال النضج الشديد.',
    preparationGuidance: 'تُغسل جيدًا وتُقطع حسَب نوع الطبق.',
    suitability: {
      general: 'عنصر خضار يومي صحي ومناسب للجميع.',
      balancedDiet: 'من أساسيات الغذاء العربي الصحي.',
      children: 'مناسبة في الشوربة والسلطات المقطعة ناعمًا.',
      pregnant: 'تزود الجسم بحمض الفوليك وفيتامين C.',
      cautionNotes: ['قد تزيد من أعراض الحموضة لمن يعانون من قرحة المعدة شديدة الحساسية.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع ذمار / مأرب / صنعاء',
    educationalImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'طماطم بلدي حمراء طازجة'
  },
  'potato': {
    id: 'potato',
    slug: 'potato',
    nameAr: 'بطاطس يمني مأربي',
    nameEn: 'Yemeni Potatoes',
    category: 'Vegetables',
    shortDescription: 'درنات البطاطس الذهبية المشهورة بجودتها العالية وقوامها المتماسك والمغذي.',
    generalBenefits: [
      'مصدر ممتاز للكربوهيدرات المعقدة التي تمنح طاقة مستدامة للجسم.',
      'تحتوي على كمية مفاجئة من فيتامين C والبوتاسيوم والألياف خاصة عند إبقاء القشرة.',
      'تتميز بتنوع طرق طهيها وسهولة هضمها.'
    ],
    nutritionHighlights: ['كربوهيدرات معقدة', 'بوتاسيوم', 'فيتامين B6 & C', 'ألياف غذائية'],
    commonUses: ['صواني الفرن والمسقعة', 'البطاطس المطهوة والشوربات', 'الأيدامات اليمنية المشهورة'],
    storageGuidance: 'تُحفظ في مكان مظلم وبارد وجودة تهوية جيدة، بعيداً عن البصل وتجنب وضعها بالثلاجة.',
    preparationGuidance: 'تُغسل جيدًا لإزالة التربة وتُقشر أو تطبخ بقشرها بعد التنظيف.',
    suitability: {
      general: 'غذاء رئيسي مشبع ومغذي.',
      balancedDiet: 'بديل صحي ممتاز للكربوهيدرات المكررة عند طهيها بالفرن أو المسلوقة.',
      children: 'من أسهل الخيارات التغذوية للأطفال كبطاطس مهروسة.',
      pregnant: 'توفر طاقة مستقرة وفيتامين B6.',
      cautionNotes: ['تجنب استهلاك البطاطس التي تظهر عليها درنات خضراء أو براعم ممتدة.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع مأرب / ذمار / يريم',
    educationalImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'بطاطس طازجة'
  },
  'onion': {
    id: 'onion',
    slug: 'onion',
    nameAr: 'بصل أحمر بلدي',
    nameEn: 'Red Onions',
    category: 'Vegetables',
    shortDescription: 'الملك غير التاجي للنكهة في المطبخ، غني بالكويرسيتين ومكبات الكبريت الطبيعية.',
    generalBenefits: [
      'غني جداً بالكويرسيتين ومضادات الأكسدة الداعمة للمناعة وصحة الأوعية.',
      'يحتوي على مركبات الكبريت العضوية التي تمنحه نكهته المميزة وخصائصه المغذية.',
      'يضيف عمقًا وقوامًا ونكهة لأي طبق غذائي.'
    ],
    nutritionHighlights: ['كويرسيتين', 'مركبات كبريتية', 'فيتامين C', 'ألياف الإنولين البريبايوتك'],
    commonUses: ['أساس كشنة الطهي اليومية', 'تزيين السلطات والمقبلات', 'المشويات والأيدامات'],
    storageGuidance: 'يُحفظ في مكان جاف ومظلم وذو تهوية جيدة بعيداً عن الأكياس البلاستيكية المغلقة.',
    preparationGuidance: 'يُقشر الجزء الخارجي الجاف ويُقطع حسَب الرغبة.',
    suitability: {
      general: 'مكون أساسي في النظام الغذائي اليومي.',
      balancedDiet: 'يدعم صحة الجهاز الهضمي بفضل ألياف البريبايوتك.',
      children: 'يُفضل تقديمه مطهواً في الأطباق.',
      pregnant: 'إضافة صحية غنية بالفيتامينات والمعادن.',
      cautionNotes: ['قد يسبب نفخة بسيطة لدى الأشخاص المصابين بالقولون العصبي عند تناوله نيئاً بكميات كبيرة.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع صعدة / ذمار / عمران',
    educationalImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'بصل أحمر بلدي'
  },
  'carrot': {
    id: 'carrot',
    slug: 'carrot',
    nameAr: 'جزر عضوي طازج',
    nameEn: 'Organic Carrots',
    category: 'Vegetables',
    shortDescription: 'خضروات جذرية مقرمشة ولذيذة، تشتهر بمحتواها العالي من البيتا كاروتين المفيد للبشرة والنظر.',
    generalBenefits: [
      'مصدر ممتاز للبيتا كاروتين الذي يتحول في الجسم إلى فيتامين A الضروري للرؤية الليلية والصحة.',
      'يدعم صحة الجهاز الهضمي بفضل الألياف الغذائية الذائبة وغير الذائبة.',
      'وجبة خفيفة ومقرمشة تنعش الفم وتساعد في تنظيف الأسنان طبيعياً.'
    ],
    nutritionHighlights: ['بيتا كاروتين (فيتامين A)', 'ألياف ذائبة', 'فيتامين K1', 'بوتاسيوم'],
    commonUses: ['وجبة خفيفة طازجة', 'عصير الجزر والبرتقال', 'إضافته للشوربات والمحاشي والسلطات'],
    storageGuidance: 'يقطع الجزء الأخضر العلوي ويحفظ الجزر في كيس بالثلاجة ليبقى مقرمشاً لمدة أسبوعين.',
    preparationGuidance: 'يغسل ويكشط القشر الخارجي بلطف.',
    suitability: {
      general: 'مناسب لجميع الأعمار كخيار غذائي مشبع وممتع.',
      balancedDiet: 'إضافة ملونة ومغذية للغاية لأطباقك.',
      children: 'ممتاز كمهروس للأطفال أو أصابع مقرمشة للأكبر سناً.',
      pregnant: 'يوفر الفيتامينات الأساسية للنمو السليم.',
      cautionNotes: ['استهلاكه بكثرة فائقة جداً قد يؤدي لظهور لون أصفر خفيف على الجلد مؤقتاً وبشكل غير ضار.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع صنعاء / إب العضوية',
    educationalImage: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'جزر عضوي طازج'
  },
  'cucumber': {
    id: 'cucumber',
    slug: 'cucumber',
    nameAr: 'خيار بلدي طازج',
    nameEn: 'Fresh Cucumber',
    category: 'Vegetables',
    shortDescription: 'خضار لطيف ومنعش للغاية، مليء بالسوائل والمعادن التي تنعش الجسم في كل وقت.',
    generalBenefits: [
      'يحتوي على أكثر من 95% ماء مما يجعله مرطباً مثانلياً للجسم.',
      'منخفض السعرات الحرارية جداً ويساعد على التخلص من الشعور بالعطش.',
      'يمنح قواماً مقرمشاً ولذيذًا في السلطات والمقبلات.'
    ],
    nutritionHighlights: ['محتوى مائي 95%', 'فيتامين K', 'مغنيسيوم وبوتاسيوم', 'مركبات كوكوربيتاسين'],
    commonUses: ['السلطة الخضراء وسلطة الخيار بالزبادي والنعناع', 'شرائح طازجة للتسلية الصحية', 'المشروبات الخضراء والمرطبة'],
    storageGuidance: 'يُحفظ في درج الثلاجة مغلّفًا بقطعة قماش أو في كيس مخصص لمنع الذبول.',
    preparationGuidance: 'يُغسل بالماء الجاري ويُقطع مع بقاء القشرة للاستفادة من أليافها.',
    suitability: {
      general: 'خيار مرطب ومناسب جداً للجميع.',
      balancedDiet: 'ينصح به في جميع برامج تخفيف الوزن.',
      children: 'أصابع الخيار خيار جذاب ومحبوب للأطفال.',
      pregnant: 'يخفف من الشعور بالجفاف والعطش.',
      cautionNotes: ['يفضل مضغه جيداً لمن يجدون صعوبة في هضم الألياف النيئة.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع صنعاء / الحيمة / ذمار',
    educationalImage: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'خيار بلدي طازج'
  },
  'bell-peppers': {
    id: 'bell-peppers',
    slug: 'bell-peppers',
    nameAr: 'فلفل رومي ملون',
    nameEn: 'Organic Bell Peppers',
    category: 'Vegetables',
    shortDescription: 'فلفل بارد ملون بمختلف الألوان زاهية النكهة، يعج بالفيتامينات ومضادات الأكسدة.',
    generalBenefits: [
      'الفلفل الأحمر والأصفر يحتوي على نسبة فيتامين C تفوق البرتقال بمراحل.',
      'مصدر ممتاز لمضادات الأكسدة التي تحمي الخلايا وتدعم سلامة الجلد والنظر.',
      'يضيف ألواناً جذابة ونكهة حلوة مقرمشة للوجبات.'
    ],
    nutritionHighlights: ['فيتامين C مضاعف', 'فيتامين B6 & A', 'لوتين وزياكسانثين', 'ألياف'],
    commonUses: ['السلطات الطازجة', 'أطباق الفاهيتا والشوربات والصواني', 'المحاشي المشكلة'],
    storageGuidance: 'يُحفظ جافًا في درج الثلاجة لمدة تصل إلى أسبوعين.',
    preparationGuidance: 'تُزال البذور والسيقان البيضاء الداخلية ويُقطع حسَب الطبق.',
    suitability: {
      general: 'خيار ممتاز ومنعش ومغذي لجميع العائلات.',
      balancedDiet: 'يعزز النضارة والقيمة الغذائية للوجبة.',
      children: 'شرائح الفلفل الملون تشجع الأطفال على تناول الخضار.',
      pregnant: 'يمد الجسم بالحمض الفولي وفيتامين C.',
      cautionNotes: ['مناسب جداً وقليل الآثار الجانبية.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع صنعاء / مأرب العضوية',
    educationalImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'فلفل رومي ملون طازج'
  },
  'mint': {
    id: 'mint',
    slug: 'mint',
    nameAr: 'نعناع بلدي طازج',
    nameEn: 'Fresh Mint Leaves',
    category: 'Herbs',
    shortDescription: 'أوراق النعناع البلدي العطرية المنعشة، تضفي روحاً ونكهة ممتازة للشاي والأطباق.',
    generalBenefits: [
      'تحتوي على زيت المنتول العطري الذي يساعد على الاسترخاء وتسهيل الهضم.',
      'تمنح شعوراً بالانتعاش وتساعد في تهدئة الانزعاج المعدي الخفيف.',
      'تضيف نكهة ساحرة للمشروبات والسلطات بدون أي سعرات حرارية.'
    ],
    nutritionHighlights: ['زيت المنتول العطري', 'فيتامين A', 'حديد ومغنيسيوم', 'مضادات أكسدة'],
    commonUses: ['إضافته للشاي الأحمر والمنقوع الدافئ', 'سلطات الفتوش والتبولة', 'مشروب الليمون بالنعناع المنعش'],
    storageGuidance: 'تُوضع أطراف الساق في كوب ماء صغير بالثلاجة أو تُلف بقطعة قماش مبللة خفيفة.',
    preparationGuidance: 'تُقطف الأوراق وتغسل بالماء البارد قبل الاستخدام.',
    suitability: {
      general: 'عشب عطري لطيف ونافع للجميع.',
      balancedDiet: 'بديل ممتاز للمنكهات الاصطناعية.',
      children: 'منقوع النعناع الخفيف لطيف ومريح للأطفال.',
      pregnant: 'يساعد النعناع الخفيف في تهدئة التوتر والمعدة.',
      cautionNotes: ['يُفضّل الاعتدال لمن يعانون من ارجاع المريء الشديد لأن المنتول يرخي العضلة العاصرة.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع صنعاء / الحيمة / تعز',
    educationalImage: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'نعناع بلدي أخضر'
  },
  'basil': {
    id: 'basil',
    slug: 'basil',
    nameAr: 'حبق / ريحان طازج',
    nameEn: 'Fresh Basil',
    category: 'Herbs',
    shortDescription: 'أوراق الحبق والريحان العطري الرائعة، تمتاز بنكهة استوائية ساحرة ومضادات أكسدة.',
    generalBenefits: [
      'غني بمضادات الأكسدة مثل الأوجينول التي تدعم صحة الجسم.',
      'يمتلك خصائص عطرية مهدئة ترفع من جودة الأطعمة والسلطات.',
      'مصدر رائع لفيتامين K والمعادن الدقيقة.'
    ],
    nutritionHighlights: ['فيتامين K', 'زيت الأوجينول', 'بيتا كاروتين', 'حديد'],
    commonUses: ['الشاي بالحبق البلدي', 'صلصة البيستو والمكرونات', 'إضافته للسلطات والأطباق الإيطالية والعربية'],
    storageGuidance: 'يحفظ في حرارة الغرفة كباقة باقة ورد في كوب ماء لتجنب اسوداد الأوراق بالثلاجة.',
    preparationGuidance: 'تُقطع الأوراق باليد أو السكين قبيل التقديم مباشرة.',
    suitability: {
      general: 'عشبة عطرية مغذية تضفي نكهة فاخرة.',
      balancedDiet: 'تزيد من إقبال الشخص على الوجبات الصحية.',
      children: 'مناسب بكميات معتدلة في الأطباق المطهوة.',
      pregnant: 'إضافة آمنة ومغذية ضمن الطعام المعتاد.',
      cautionNotes: ['آمن ومستحب في الأطعمة اليومية.']
    },
    season: 'صيفي / ربيعي',
    origin: 'مزارع صنعاء / تعز / إب',
    educationalImage: 'https://images.unsplash.com/photo-1608683287019-3c72b225bf4e?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'حبق وريحان بلدي'
  }
};

/**
 * Get Produce Intelligence for a given product or slug.
 * Returns default fallback intelligence if no specific item is matched.
 */
export function getProduceIntelligence(
  productOrId: { id?: string; name?: string; category?: { name: string } } | string,
): ProduceIntelligence {
  const query = typeof productOrId === 'string' ? productOrId.toLowerCase() : '';
  const name = typeof productOrId === 'object' ? (productOrId.name || '').toLowerCase() : '';
  const categoryName = typeof productOrId === 'object' ? productOrId.category?.name || 'Vegetables' : 'Vegetables';

  // Check direct matches
  if (query && PRODUCE_INTELLIGENCE_MAP[query]) {
    return PRODUCE_INTELLIGENCE_MAP[query];
  }

  // Check keyword matches in product name
  if (name.includes('تفاح') || name.includes('apple')) return PRODUCE_INTELLIGENCE_MAP['apple'];
  if (name.includes('موز') || name.includes('banana')) return PRODUCE_INTELLIGENCE_MAP['banana'];
  if (name.includes('برتقال') || name.includes('orange')) return PRODUCE_INTELLIGENCE_MAP['orange'];
  if (name.includes('ليمون') || name.includes('lemon')) return PRODUCE_INTELLIGENCE_MAP['lemon'];
  if (name.includes('مانجو') || name.includes('mango')) return PRODUCE_INTELLIGENCE_MAP['mango'];
  if (name.includes('رمان') || name.includes('pomegranate')) return PRODUCE_INTELLIGENCE_MAP['pomegranate'];
  if (name.includes('عنب') || name.includes('grape')) return PRODUCE_INTELLIGENCE_MAP['grapes'];
  if (name.includes('فراولة') || name.includes('strawberry')) return PRODUCE_INTELLIGENCE_MAP['strawberry'];
  if (name.includes('بطيخ') || name.includes('watermelon')) return PRODUCE_INTELLIGENCE_MAP['watermelon'];
  if (name.includes('طماطم') || name.includes('tomato')) return PRODUCE_INTELLIGENCE_MAP['tomato'];
  if (name.includes('بطاطس') || name.includes('potato')) return PRODUCE_INTELLIGENCE_MAP['potato'];
  if (name.includes('بصل') || name.includes('onion')) return PRODUCE_INTELLIGENCE_MAP['onion'];
  if (name.includes('جزر') || name.includes('carrot')) return PRODUCE_INTELLIGENCE_MAP['carrot'];
  if (name.includes('خيار') || name.includes('cucumber')) return PRODUCE_INTELLIGENCE_MAP['cucumber'];
  if (name.includes('فلفل') || name.includes('pepper')) return PRODUCE_INTELLIGENCE_MAP['bell-peppers'];
  if (name.includes('نعناع') || name.includes('mint')) return PRODUCE_INTELLIGENCE_MAP['mint'];
  if (name.includes('حبق') || name.includes('ريحان') || name.includes('basil')) return PRODUCE_INTELLIGENCE_MAP['basil'];

  // Universal Fallback according to Category
  const isFruit = categoryName === 'Fruits';
  const isHerb = categoryName === 'Herbs';

  return {
    id: 'generic-produce',
    slug: 'generic-produce',
    nameAr: isFruit ? 'فاكهة طازجة' : isHerb ? 'عشبة عطرية' : 'خضار طازج',
    nameEn: isFruit ? 'Fresh Fruit' : isHerb ? 'Fresh Herb' : 'Fresh Vegetable',
    category: isFruit ? 'Fruits' : isHerb ? 'Herbs' : 'Vegetables',
    shortDescription: 'منتج زراعي طازج ومختار بعناية من أفضل المزارع المحلية لضمان الجودة والنضارة.',
    generalBenefits: [
      'مصدر طبيعي ممتازة للأنزيمات والفيتامينات الأساسية.',
      'يساعد في إضافة القيمة الغذائية والنكهة الطبيعية لأطباقك اليومية.',
      'تم قطافه وتخزينه وفق أعير النضارة والصحة السلامة.'
    ],
    nutritionHighlights: ['فيتامينات متنوعة', 'ألياف غذائية', 'معادن طبيعية', 'سوائل مرطبة'],
    commonUses: ['الاستهلاك الطازج', 'إعداد الأطباق والسلطات العائلية', 'العصائر الطبيعية والتتبيل'],
    storageGuidance: 'يُحفظ في مكان بارد وجاف أو في الثلاجة داخل كيس مخصص للحفاظ على الطراوة.',
    preparationGuidance: 'يُغسل جيدًا بالماء الجاري النظيف قبل الاستهلاك.',
    suitability: {
      general: 'مناسب عادةً لمعظم الأشخاص كجزء من الغذاء اليومي.',
      balancedDiet: 'عنصر مفيد ومكمل للنظام الغذائي المتوازن.',
      children: 'مناسب للأطفال بحسب العمر وطريقة التقديم.',
      pregnant: 'خيار غذائي رائع مع مراعاة الغسيل الجيد.',
      cautionNotes: ['يُنصح بمسح أو غسل الخضروات والفواكه جيداً قبل تناولها.']
    },
    season: 'على مدار السنة',
    origin: 'مزارع محلية مختارة (اليمن)',
    educationalImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    educationalImageAltAr: 'خضروات وفواكه طازجة'
  };
}
