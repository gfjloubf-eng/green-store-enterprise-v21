# ربط مساعد قطوف بـ Gemini واختباره محلياً

هذا المستند يشرح المسار الفعلي المستخدم في نسخة Vercel، وطريقة اختبار Google Gemini محلياً، وطريقة اختبار مسار قطوف مع الرد الاحتياطي. لا تضع أي مفتاح داخل GitHub أو داخل ملفات React.

## 1. المسار الفعلي

في Vercel يصل الطلب إلى:

```text
POST /api/assistant/chat
```

وفي الخادم الداخلي يتم تحويل `/api/assistant/chat` إلى المسار العام:

```text
POST /assistant/chat
```

ثم يسجل في `createAssistantRoutes()` بوصفه مساراً عاماً لا يحتاج تسجيل دخول:

```js
builder.register({
  name: 'assistant-chat',
  method: 'POST',
  path: '/assistant/chat',
  version: 'v1',
  handler: (ctx) => controller.chat(toControllerRequest(ctx)),
  options: {
    mode: 'public',
    publicRoute: true,
    authenticationRequired: false,
    authorizationRequired: false,
    tags: ['assistant'],
  },
});
```

المعالج يتحقق من الرسالة والتاريخ، ثم يستدعي خدمة المساعد:

```js
async chat(request) {
  const body = request.body ?? {};
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!message || message.length > 1200) {
    return validationError('assistant_message_invalid');
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter((item) =>
          item &&
          (item.role === 'user' || item.role === 'assistant') &&
          typeof item.content === 'string'
        )
        .slice(-8)
        .map((item) => ({
          role: item.role,
          content: item.content.slice(0, 500),
        }))
    : [];

  try {
    return success(await chat({ message, history }));
  } catch (error) {
    return validationError(
      error instanceof Error ? error.message : 'assistant_request_failed'
    );
  }
}
```

## 2. منطق Gemini مع Fallback

الكود الفعلي في `backend/src/modules/assistant/service.ts`، وتنسخه عملية البناء إلى `frontend-react/api/index.js` الذي يشغله Vercel. الجزء الأساسي يعمل كالتالي:

```js
async function callModel(message, history, products) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.BUILT_IN_FORGE_API_KEY ||
    process.env.OPENAI_API_KEY;

  const normalizedApiKey = apiKey?.trim();
  const model =
    process.env.ASSISTANT_MODEL ||
    process.env.GEMINI_MODEL ||
    'gemini-2.5-flash-lite';

  if (!normalizedApiKey) return null;

  const system = buildSafeArabicSystemPrompt(products);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // وجود GEMINI_API_KEY صراحةً يعني استخدام Google Gemini native.
    if (process.env.GEMINI_API_KEY) {
      const nativeBase = (
        process.env.GEMINI_NATIVE_API_BASE ||
        'https://generativelanguage.googleapis.com'
      ).replace(/\/$/, '');

      const response = await fetch(
        `${nativeBase}/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': normalizedApiKey,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [
              ...safeHistory(history),
              { role: 'user', parts: [{ text: message }] },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 350,
            },
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        console.error('[assistant] Gemini request failed', {
          status: response.status,
          model,
        });
        return null;
      }

      const payload = await response.json();
      const content = payload?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text)
        .filter(Boolean)
        .join(' ');

      return content?.trim()
        ? {
            content: cleanText(content, 1600),
            model,
            provider: 'google_gemini',
          }
        : null;
    }
  } catch (error) {
    console.error('[assistant] Gemini request exception', {
      name: error?.name || 'unknown',
      model,
    });
    return null;
  } finally {
    clearTimeout(timeout);
  }

  return null;
}
```

بعد فشل Gemini أو عدم تفعيل الاتصال، لا يتوقف المسار؛ بل يستخدم `fallbackReply()` ويعيد مؤشرات واضحة:

```js
const modelReply =
  assistantMode === 'offline'
    ? null
    : await callModel(message, history, products);

return {
  reply: modelReply?.content ?? fallbackReply(message, fallbackProducts),
  source: modelReply ? 'ai_with_live_catalog' : 'safe_fallback',
  provider: modelReply?.provider ?? 'safe_fallback',
  model: modelReply?.model ?? null,
  verification: modelReply
    ? 'live_model_response'
    : 'deterministic_fallback',
  catalogCount: products.length,
};
```

## 3. متغيرات البيئة المحلية

أنشئ ملف `.env.local` محلياً فقط، وتأكد أنه موجود في `.gitignore`:

```env
GEMINI_API_KEY=ضع_مفتاحاً_جديداً_محلياً_ولا_ترسله_إلى_المحادثة
GEMINI_NATIVE_API_BASE=https://generativelanguage.googleapis.com
GEMINI_MODEL=gemini-2.5-flash-lite
ASSISTANT_MODE=online
```

للاختبار الاحتياطي دون Gemini استخدم:

```env
ASSISTANT_MODE=offline
```

في Vercel أضف المتغيرات نفسها من **Settings → Environment Variables** مع اختيار **Production**، ثم نفّذ Redeploy.

## 4. اختبار Gemini مباشرةً عبر curl

لا تضع المفتاح في الأمر نفسه ولا تحفظه في سجل الطرفية:

```bash
export GEMINI_API_KEY='ضع_المفتاح_الجديد_محلياً_فقط'

curl -sS --fail-with-body \
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent' \
  -H 'Content-Type: application/json' \
  -H "X-goog-api-key: ${GEMINI_API_KEY}" \
  -X POST \
  -d '{
    "contents": [{
      "parts": [{
        "text": "اكتب ترحيباً قصيراً باللغة العربية"
      }]
    }]
  }'
```

نجاح الاتصال يظهر عادةً داخل `candidates[0].content.parts[0].text`. أما `400` فعادةً يدل على اسم نموذج أو بنية طلب غير صحيحة، و`401/403` يدل على مفتاح غير صالح أو صلاحيات غير كافية، و`429` يدل على تجاوز حد الاستخدام.

## 5. اختبار مسار قطوف محلياً

بعد تشغيل الخادم المحلي على المنفذ المستخدم في المشروع:

```bash
curl -sS --fail-with-body \
  -X POST 'http://localhost:3000/assistant/chat' \
  -H 'Content-Type: application/json' \
  -d '{"message":"كيف أطلب عبر واتساب؟"}'
```

وعلى Vercel يكون المسار:

```bash
curl -sS --fail-with-body \
  -X POST 'https://green-store-enterprise-v21.vercel.app/api/assistant/chat' \
  -H 'Content-Type: application/json' \
  -d '{"message":"كيف أطلب عبر واتساب؟"}'
```

إذا كان Gemini متوقفاً بشكل مقصود، يجب أن تحصل على:

```json
{
  "source": "safe_fallback",
  "provider": "safe_fallback",
  "verification": "deterministic_fallback"
}
```

إذا كان Gemini يعمل فعلياً، يجب أن تحصل على:

```json
{
  "source": "ai_with_live_catalog",
  "provider": "google_gemini",
  "verification": "live_model_response",
  "model": "gemini-2.5-flash-lite"
}
```

## 6. اختبار Postman

أنشئ طلباً جديداً من نوع `POST`، وضع الرابط:

```text
https://green-store-enterprise-v21.vercel.app/api/assistant/chat
```

في **Headers** أضف:

```text
Content-Type: application/json
```

لا تضع مفتاح Gemini في Postman عند اختبار مسار قطوف؛ المفتاح يجب أن يبقى على الخادم. في **Body → raw → JSON** ضع:

```json
{
  "message": "اعرض المنتجات",
  "history": []
}
```

ثم افحص حقول `provider` و`verification` في الرد.

لاختبار Google مباشرةً في Postman، استخدم:

```text
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent
```

وفي Headers:

```text
Content-Type: application/json
X-goog-api-key: {{GEMINI_API_KEY}}
```

ضع قيمة `GEMINI_API_KEY` في **Postman Environment** وليس داخل المجموعة أو الطلب، ولا تشارك ملف البيئة.

## 7. قاعدة الحكم النهائية

لا تعتبر المساعد متصلاً بـGemini لمجرد أن HTTP أعاد `200`. الحكم الصحيح يكون فقط عند وجود القيمتين:

```text
provider=google_gemini
verification=live_model_response
```

أما `safe_fallback` فهو نجاح لمسار الحماية فقط، وليس نجاحاً لاتصال النموذج.

## 8. تنبيه أمني

أي مفتاح ظهر في محادثة أو مستودع يجب إلغاؤه وإنشاء مفتاح جديد. لا تضع الأسرار في GitHub، ولا في `VITE_*`، ولا في `localStorage`، ولا في ملفات JavaScript التي تصل إلى المتصفح.

### المراجع

1. [Google Gemini API — API keys](https://ai.google.dev/gemini-api/docs/api-key)
2. [Google Gemini API — Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
3. [Google Gemini API — Pricing](https://ai.google.dev/gemini-api/docs/pricing)

هذا المستند مبني على مسار قطوف الحالي، مع إبقاء التعديل محصوراً في مساعد الذكاء الاصطناعي.
