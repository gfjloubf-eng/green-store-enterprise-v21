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

function cleanText(value: unknown, max = 500): string {
  return String(value ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function isSensitiveMedicalQuestion(message: string): boolean {
  return /(تشخيص|مرض|دواء|جرع|علاج|حامل|حمل|سكري|ضغط|حساسي|سرطان|نزيف|ألم شديد|طبيب|medical|diagnos|medication)/i.test(message);
}

function fallbackReply(message: string, products: ProductContext[]): string {
  if (isSensitiveMedicalQuestion(message)) {
    return 'أستطيع تقديم معلومات عامة عن المنتجات فقط، ولا أستطيع تشخيص الحالات أو اقتراح علاج أو جرعات. يرجى استشارة طبيب أو أخصائي تغذية مرخّص، واطلب المساعدة العاجلة عند وجود أعراض شديدة.';
  }

  const normalized = message.toLowerCase();
  const matches = products.filter((product) => `${product.name} ${product.slug ?? ''} ${product.description ?? ''}`.toLowerCase().includes(normalized)).slice(0, 3);
  if (matches.length > 0) {
    return `وجدت لك في قطوف: ${matches.map((product) => `${product.name}${product.price != null ? ` بسعر ${product.price}` : ''}${product.unit ? ` / ${product.unit}` : ''}${product.available === false ? ' (غير متوفر حالياً)' : ''}`).join('، ')}. الأسعار والتوفر المعروضان مأخوذان من بيانات المتجر الحالية.`;
  }

  if (/(سعر|كم|بكم|price)/i.test(message)) {
    return 'يمكنني البحث عن السعر إذا كتبت اسم المنتج كما يظهر في المتجر. لا أقدّم سعراً غير موجود في بيانات قطوف.';
  }
  if (/(متوفر|توفر|مخزون|availability|stock)/i.test(message)) {
    return 'اكتب اسم المنتج، وسأحاول إخبارك بحالة توفره الحالية من بيانات المتجر.';
  }
  return 'مرحباً بك في قطوف الطبيعة. اسألني عن أسماء المنتجات أو الأسعار أو التوفر أو طريقة الوصول إلى الأقسام. لا أستطيع تنفيذ طلب أو تعديل المخزون من خلال المحادثة.';
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

async function callModel(message: string, history: ChatInput['history'], products: ProductContext[]): Promise<string | null> {
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_API_BASE || '').replace(/\/$/, '');
  if (!apiKey || !baseUrl) return null;

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
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.ASSISTANT_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 350,
        messages: [{ role: 'system', content: system }, ...safeHistory, { role: 'user', content: message }],
      }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const payload = await response.json() as any;
    const content = payload?.choices?.[0]?.message?.content;
    return typeof content === 'string' && content.trim() ? cleanText(content, 1600) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function chat(input: ChatInput) {
  const message = cleanText(input.message, MAX_MESSAGE_LENGTH);
  if (!message) throw new Error('assistant_message_required');
  const products = await loadProducts();
  const modelReply = await callModel(message, input.history, products);
  return {
    reply: modelReply ?? fallbackReply(message, products),
    source: modelReply ? 'ai_with_live_catalog' : 'safe_fallback',
    catalogCount: products.length,
    disclaimer: 'المساعد يقدم معلومات عامة عن المتجر والمنتجات، ولا يقدم تشخيصاً أو علاجاً طبياً.',
  };
}
