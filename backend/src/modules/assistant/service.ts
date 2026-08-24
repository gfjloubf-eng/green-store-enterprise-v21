import { ServiceFactory } from '../../services/service-factory';

type ProductContext = {
  name: string;
  slug?: string | null;
  description?: string | null;
  price?: number | null;
  available?: boolean;
  unit?: string | null;
};

type ChatInput = {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 8;
const MAX_CONTEXT_PRODUCTS = 80;
const STATIC_FALLBACK_PRODUCTS: ProductContext[] = [
  { name: 'تفاح أحمر طازج' }, { name: 'برتقال أبو صرة' }, { name: 'ليمون بلدي طازج' },
  { name: 'يوسفي بلدي' }, { name: 'مانجو يمني سوداني' }, { name: 'رمان صعدي فاخر' },
  { name: 'عنب روضي يمني' }, { name: 'بطيخ أحمر بلدي' }, { name: 'شمام يمني حلو' },
  { name: 'خوخ بلدي طازج' }, { name: 'موز عضوي طازج' }, { name: 'فراولة طازجة' },
  { name: 'فلفل رومي ملون' }, { name: 'جزر عضوي طازج' }, { name: 'طماطم بلدي طازجة' },
  { name: 'بطاطس يمني مأربي' }, { name: 'بصل أحمر بلدي' }, { name: 'خيار بلدي طازج' },
  { name: 'باذنجان أسود بلدي' }, { name: 'كوسا خضراء طازجة' }, { name: 'خس بلدي طازج' },
  { name: 'ملفوف أخضر طازج' }, { name: 'قرنبيط / زهرة بلدي' }, { name: 'بروكلي أخضر طازج' },
  { name: 'نعناع بلدي طازج' }, { name: 'حبق / ريحان طازج' }, { name: 'حليب طازج' },
];

function cleanText(value: unknown, max = 500): string {
  return String(value ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function isSensitiveMedicalQuestion(message: string): boolean {
  return /(تشخيص|مرض|دواء|جرع|علاج|حامل|حمل|سكري|ضغط|حساسي|سرطان|نزيف|ألم شديد|طبيب|medical|diagnos|medication)/i.test(message);
}

function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْـ]/g, '').trim();
}

function isPlaceholderProduct(product: ProductContext): boolean {
  return /\b(test|phase|concurrency|demo|sample)\b/i.test(`${product.name} ${product.slug ?? ''}`);
}

function formatProduct(product: ProductContext): string {
  const price = product.price != null ? ` — ${product.price} ر.ي` : ' — السعر غير مسجل حالياً';
  const unit = product.unit ? ` / ${product.unit}` : '';
  const availability = product.available === false ? ' — غير متوفر حالياً' : ' — متوفر';
  return `${product.name}${unit}${price}${availability}`;
}

function fallbackReply(message: string, products: ProductContext[]): string {
  if (isSensitiveMedicalQuestion(message)) {
    return 'أستطيع تقديم معلومات عامة عن المنتجات فقط، ولا أستطيع تشخيص الحالات أو اقتراح علاج أو جرعات. يرجى استشارة طبيب أو أخصائي تغذية مرخّص، واطلب المساعدة العاجلة عند وجود أعراض شديدة.';
  }

  const normalized = normalizeSearch(message);
  const wantsProducts = /(المنتجات|الاصناف|قائمه|قائمة|الفواكه|الخضروات|الخضار|المتاح|ماذا يوجد|ايش عندكم|ما لديكم)/i.test(normalized);
  const wantsOrder = /(اطلب|طلب|شراء|اشتر|كيف.*طلب|واتساب|السله|السلة|التوصيل|التسليم)/i.test(normalized);
  const wantsPrice = /(سعر|كم|بكم|ريال|price)/i.test(normalized);
  const wantsAvailability = /(متوفر|توفر|مخزون|availability|stock)/i.test(normalized);

  if (wantsOrder) {
    return 'لطلب منتجات قطوف: 1) اختر المنتج واضغط «أضف» لإضافته إلى السلة. 2) افتح السلة وراجع الكمية والسعر. 3) انتقل لإتمام الطلب وأدخل بيانات التوصيل. ويمكنك استخدام «طلب سريع عبر واتساب» واختيار الرقم المناسب: 712275038 أو 777803161. لا ترسل كلمات المرور أو بيانات البطاقة داخل المحادثة.';
  }

  if (wantsProducts) {
    const realProducts = products.filter((product) => !isPlaceholderProduct(product));
    const listSource = realProducts.length > 0 ? realProducts : STATIC_FALLBACK_PRODUCTS;
    const list = listSource.slice(0, 30).map((product, index) => `${index + 1}. ${formatProduct(product)}`).join('؛ ');
    const sourceNote = realProducts.length > 0 ? 'الأسعار والتوفر مأخوذان من بيانات المتجر الحالية.' : 'هذه أسماء إرشادية احتياطية؛ بيانات الاختبار غير معروضة للمستخدم. تحقق من السعر والتوفر داخل المتجر قبل الطلب.';
    return `هذه المنتجات الموجودة في قطوف: ${list}. ${sourceNote}`.slice(0, 1700);
  }

  const tokens = normalized.split(/[^a-z0-9ء-ي]+/i).filter((token) => token.length >= 2 && !/(ما|من|في|عن|هل|هذا|هذه|اريد|أريد|لو|لي|عندي|عندكم|قطوف)/i.test(token));
  const matches = products.map((product) => {
    const haystack = normalizeSearch(`${product.name} ${product.slug ?? ''} ${product.description ?? ''}`);
    const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
    return { product, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.product);

  if (matches.length > 0) {
    const prefix = wantsPrice ? 'السعر الحالي في قطوف:' : wantsAvailability ? 'حالة التوفر الحالية في قطوف:' : 'وجدت لك في قطوف:';
    return `${prefix} ${matches.map(formatProduct).join('؛ ')}. البيانات مأخوذة من كتالوج المتجر الحالي.`;
  }

  if (wantsPrice) return 'اكتب اسم المنتج كما يظهر في المتجر، مثل «تفاح أحمر» أو «برتقال أبو صرة»، وسأعرض السعر المسجل فقط دون تخمين.';
  if (wantsAvailability) return 'اكتب اسم المنتج، وسأعرض لك حالته المسجلة في الكتالوج الحالي.';
  return 'مرحباً بك في قطوف الطبيعة. أستطيع عرض جميع المنتجات، والبحث عن السعر والتوفر، وشرح طريقة الطلب من السلة أو عبر واتساب. جرّب: «اعرض المنتجات» أو «كم سعر التفاح الأحمر؟».';
}

async function loadProducts(): Promise<ProductContext[]> {
  try {
    const productService = ServiceFactory.createProductService();
    const result = await productService.paginate({ page: 1, limit: MAX_CONTEXT_PRODUCTS, filters: { isPublished: true } } as any);
    return (result.data ?? []).map((item: any) => ({
      name: cleanText(item.name, 120),
      slug: cleanText(item.slug, 120),
      description: cleanText(item.description, 300),
      price: Number.isFinite(Number(item.sellingPrice ?? item.price)) ? Number(item.sellingPrice ?? item.price) : null,
      available: item.stock == null ? true : Number(item.stock) > 0,
      unit: cleanText(item.unit?.name ?? item.unit?.symbol ?? '', 40) || null,
    })).filter((item) => item.name);
  } catch {
    return [];
  }
}

async function callModel(message: string, history: ChatInput['history'], products: ProductContext[]): Promise<{ content: string; model: string; provider: 'google_gemini' | 'configured_ai' } | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY;
  const normalizedApiKey = apiKey?.trim();
  const baseUrl = (process.env.GEMINI_API_BASE || process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_API_BASE || '').replace(/\/$/, '');
  if (!normalizedApiKey || !baseUrl) return null;
  const model = process.env.ASSISTANT_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const provider = baseUrl.includes('generativelanguage.googleapis.com') || Boolean(process.env.GEMINI_API_KEY || process.env.GEMINI_API_BASE) ? 'google_gemini' : 'configured_ai';

  const productContext = products.map((product) => ({
    name: product.name,
    price: product.price,
    available: product.available,
    unit: product.unit,
    description: product.description,
  }));
  const system = `أنت مساعد قطوف الطبيعة. أجب بالعربية الواضحة وباختصار مهني. استخدم قائمة المنتجات المرفقة فقط عند الحديث عن الاسم أو السعر أو التوفر، ولا تخترع أي بيانات تجارية. لا تنفذ طلبات شراء ولا تعدّل المخزون ولا تطلب كلمات مرور أو بيانات دفع. عند الأسئلة الطبية أو التشخيص أو العلاج، قدّم تنبيهاً بأنك لا تستبدل الطبيب وأحِل المستخدم إلى مختص، ويمكنك ذكر معلومات عامة غير علاجية فقط. إذا لم تجد المعلومة في السياق فقل ذلك صراحة. بيانات المنتجات الحالية بصيغة JSON: ${JSON.stringify(productContext)}`;
  const safeHistory = (history ?? []).slice(-MAX_HISTORY_ITEMS).map((item) => ({ role: item.role, content: cleanText(item.content, 500) }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // An explicit GEMINI_API_KEY always uses Google's native REST API, regardless of key format.
    if (process.env.GEMINI_API_KEY) {
      const nativeBase = (process.env.GEMINI_NATIVE_API_BASE || 'https://generativelanguage.googleapis.com').replace(/\/$/, '');
      const nativeMessages = [...safeHistory, { role: 'user' as const, content: message }];
      const response = await fetch(`${nativeBase}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': normalizedApiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: nativeMessages.map((item) => ({ role: item.role === 'assistant' ? 'model' : 'user', parts: [{ text: item.content }] })),
          generationConfig: { temperature: 0.2, maxOutputTokens: 350 },
        }),
        signal: controller.signal,
      });
      if (!response.ok) {
        console.error('[assistant] Gemini request failed', { status: response.status, model });
        return null;
      }
      const payload = await response.json() as any;
      const content = payload?.candidates?.[0]?.content?.parts?.map((part: any) => part?.text).filter(Boolean).join(' ');
      return typeof content === 'string' && content.trim() ? { content: cleanText(content, 1600), model, provider: 'google_gemini' } : null;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${normalizedApiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 350,
        messages: [{ role: 'system', content: system }, ...safeHistory, { role: 'user', content: message }],
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      console.error('[assistant] model request failed', { status: response.status, provider, model });
      return null;
    }
    const payload = await response.json() as any;
    const content = payload?.choices?.[0]?.message?.content;
    return typeof content === 'string' && content.trim() ? { content: cleanText(content, 1600), model, provider } : null;
  } catch (error: any) {
    console.error('[assistant] model request exception', { name: error?.name || 'unknown', provider, model });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function chat(input: ChatInput) {
  const message = cleanText(input.message, MAX_MESSAGE_LENGTH);
  if (!message) throw new Error('assistant_message_required');
  const products = await loadProducts();
  const assistantMode = String(process.env.ASSISTANT_MODE || 'offline').toLowerCase();
  const modelReply = assistantMode === 'offline' ? null : await callModel(message, input.history, products);
  const fallbackProducts = products.length > 0 ? products : STATIC_FALLBACK_PRODUCTS;
  return {
    reply: modelReply?.content ?? fallbackReply(message, fallbackProducts),
    source: modelReply ? 'ai_with_live_catalog' : 'safe_fallback',
    provider: modelReply?.provider ?? 'safe_fallback',
    model: modelReply?.model ?? null,
    verification: modelReply ? 'live_model_response' : 'deterministic_fallback',
    catalogCount: products.length,
    disclaimer: 'المساعد يقدم معلومات عامة عن المتجر والمنتجات، ولا يقدم تشخيصاً أو علاجاً طبياً.',
  };
}
