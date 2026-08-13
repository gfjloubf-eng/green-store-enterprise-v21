# Green Store — Phase 3.1: Validation Integration (save_order.php) — Report v1.0

> هذا التقرير **مراجعة وتوثيق فقط** (No code changes).
> يتم استخدامه لتحديد ما هو مُنفّذ فعليًا وما هو قيد الخطة.



---

## 1) Scope / What happened in this phase
خلال هذه المرحلة تم دمج `Validation::validate()` في ملف `save_order.php` بهدف إدخال **Validation Layer** كمرحلة تحقق أولية (Validation-only) قبل بدء منطق الأعمال (حساب الإجمالي + إدخال الطلب في قاعدة البيانات).

**ملحوظة مهمة:**
- تم استدعاء `Validation::validate()` لمساحة الطلب الأساسية، ثم استدعاؤه أيضًا داخل حلقة `products` لكل عنصر.
- هذا التقرير لا يغيّر سلوك endpoint، وإنما يوثّق الموجود الآن.

---

## 2) Backward Compatibility Audit (must be preserved)

### 2.1 رسائل المستخدم (User-facing Messages)
تمت مراجعة رسائل المستخدم داخل `save_order.php` كما يلي:

- عند فشل/غياب payload:
  - يتم استدعاء `Response::validationError('validation error', ...)` برسالة عربية:
    - **"بيانات الطلب غير مكتملة أو السلة فارغة."**

- عند فشل التحقق على منتجات/سلة فارغة:
  - نفس الرسالة السابقة:
    - **"بيانات الطلب غير مكتملة أو السلة فارغة."**

- عند معرف المنتج غير صالح/مفقود:
  - رسالة:
    - **"معرف المنتج غير صالح أو مفقود."**

- عند الكمية غير صالحة:
  - رسالة:
    - **"الكمية المطلوبة غير صالحة."**

- عند تعذر توفر المنتج في النظام:
  - يتم رفع `Exception` برسالة:
    - **"أحد المنتجات المطلوبة غير متوفر في النظام."**
  - ثم في catch تُعاد نفس الرسالة للمستخدم عبر `Response::error($user_message, ..., 400)`.

**الخلاصة:**
- الرسائل العربية الظاهرة في منطق `save_order.php` ثابتة كما هي ضمن كود المرحلة الحالية.
- لا يوجد تغيير مقصود/مُوثّق في نص الرسائل داخل هذه المرحلة (لأنها تقرير مراجعة فقط).

### 2.2 أسماء الحقول (Field Names)
تمت مراجعة مفاتيح الإدخال/التحقق/الإخراج في `save_order.php`:

- `customer_name`
- `customer_email`
- `customer_phone`
- `delivery_addr`
- `products`
- `lat`
- `lng`

وبداخل `products` (لكل عنصر):
- `id`
- `qty` (مع دعم `quantity` كبديل ضمن الكود الحالي)

**الخلاصة:**
- أسماء الحقول ضمن منطق الطلب الأساسية كما هي في `save_order.php` الحالية.

### 2.3 بنية JSON (Response Payload)
تمت مراجعة طبقة الاستجابة المستخدمة في `save_order.php`:

- عند نجاح العملية:
  - `Response::success('تم استلام وتأكيد الطلب بنجاح.', ['order_id' => $order_id])`
  - `success:true`
  - `message: (الرسالة)`
  - وبيانات إضافية `order_id` ضمن مصفوفة البيانات.

- عند Validation failure:
  - `Response::validationError('validation error', $errors)`
  - يتم إصدار JSON ببنية:
    - `success:false`
    - `message:'validation error'`
    - `errors: [ { field, message } ... ]`
  - HTTP status: **422**

- عند أخطاء الأعمال المعروفة (ضمن catch لبعض الرسائل المعروفة):
  - `Response::error($user_message, [], 400)`
  - HTTP status: **400**

**الخلاصة:**
- بنية JSON تعتمد على `Response` وموحدة.
- لا يوجد تعديل في شكل JSON داخل هذه المرحلة (تقرير توثيق فقط).

### 2.4 Frontend تعامل دون تعديل
- `save_order.php` الحالي لا يغيّر Contract الخاص بالـ frontend من حيث:
  - الاعتماد على JSON كـ response.
  - وجود `success` و `message`.
  - وجود `errors` في حالة validation.

**الخلاصة:**
- ما دام frontend يعتمد على هذه البنية القياسية لـ `Response` فالتوافق محفوظ.
- لا توجد إشارات ضمن هذا الكود على تغييرات كسرية للـ frontend (لأننا لا نقوم بتغيير كود).

### 2.5 HTTP Status Codes
تمت مراجعة حالات الاستجابة في `save_order.php` مقابل `Response`:

1) فشل validation اولیه أو فشل schema:
   - `Response::validationError(... )`
   - **422**

2) خطأ في payload غير مكتمل/سلة فارغة:
   - ما زال يذهب إلى `Response::validationError`
   - **422**

3) خطأ أعمال معروف (id/qty غير صالح أو منتج غير متوفر) داخل catch:
   - يتم إصدار `Response::error(..., 400)`
   - **400**

4) نجاح:
   - **200** من `Response::success`.

**الخلاصة (مهم):**
- سيتم اعتبار أي اختلاف في HTTP codes “مخاطر” إذا كان النظام السابق كان يرسل status مختلفًا، لكن هذا التقرير **لا يقوم بتغيير أي شيء** ويؤكد فقط الحالة الحالية.

---

## 3) What moved to Validation Layer (versus stayed in save_order.php)

### 3.1 تم نقل/توحيد التحقق عبر Validation Layer
تم التحقق عبر `Validation::validate()` في `save_order.php` لما يلي:

- تحقق request الأساسي (schema):
  - `customer_name`: required + string
  - `customer_email`: required + email
  - `customer_phone`: required + string
  - `delivery_addr`: required + string
  - `products`: required + array
  - `lat`: nullable + numeric
  - `lng`: nullable + numeric

- تحقق بنيوي/نوعي داخل حلقة `products` لكل عنصر:
  - `products.{idx}.id`: required + integer
  - `products.{idx}.qty`: required + integer

### 3.2 ما الذي بقي داخل save_order.php (ولماذا)
بقي منطق الأعمال داخل `save_order.php` كما هو:

- بدء/إدارة المعاملة transaction:
  - `beginTransaction()` / `commit()` / `rollBack()`
  - السبب: هذا مرتبط بمستوى الأعمال/DB وليس Validation-only.

- حساب `calculated_total` بناءً على سعر المنتج من قاعدة البيانات.

- تحقق توفر المنتج في قاعدة البيانات (DB existence check):
  - يتم تنفيذ query للمنتج.
  - السبب: rules الحالية في `Validation` مهيأة لتكون Validation-only وبدون DB/Models.

- إدخال الطلب في جدول `orders`:
  - INSERT + `products_json`.

---

## 4) Technical Debt

### Nested Array Validation (Repetition in products loop)
- **Status:** تم رصده في التنفيذ الحالي داخل `save_order.php`.
- **Why it matters:** الهدف النهائي هو أن تتحقق Validation Layer من nested arrays دون استدعاء `Validation::validate()` لكل عنصر يدويًا.
- **Priority:** Medium Priority
- **Planned phase to address:** بعد اكتمال تصميم Validation Layer لدعم Nested Arrays (Future: Validation Layer extension).

### Nested Arrays not supported in Validation.php (structural gap)
- **Status:** قائمة فنية في `app/Core/Validation.php` حاليًا لا تنفّذ recursion/حصرًا لِـ `products[*]` كنمط nested.
- **Priority:** Medium Priority
- **Planned phase to address:** بعد Phase 3.1، ضمن التطوير المخصص لدعم nested schemas.

### exists / unique rules are Placeholder-only
- **Status:** قواعد `exists` و `unique` في `Validation.php` هي Placeholder-only (بدون DB checks فعلية).
- **Priority:** High Priority
- **Planned phase to address:** عند تنفيذ Repository/Service Layer وحقن validators المربوطة بالـ DB (Future: Repository/Service integration).


---

## 5) Integration Testing (Pending)

### قيود البيئة
- البيئة الحالية لا تسمح بتنفيذ اختبارات PHP فعلية (PHP CLI غير متاح/غير موجود في PATH بحسب القيود السابقة).
- لذلك لا يمكن إجراء integration tests تلقائية أو مقارنة before/after بشكل تنفيذي.

### جدول حالات الاختبار المطلوبة (مطلوب Pending Integration Testing)

| الحالة | Input (وصف) | Result المتوقع | كيف يتم التحقق (يدويًا/بيئيًا) |
|---|---|---|---|
| Missing Fields | حذف field مثل `customer_email` أو `products` | `422` + `errors` يحتوي على الحقل الناقص | إرسال JSON ناقص عبر POSTMAN/curl |
| Empty Values | إرسال `""` أو null لـ required fields | `422` + error field required | POSTMAN/curl |
| Wrong Types | إرسال رقم بدل string أو object بدل array | `422` + error Invalid type | POSTMAN/curl |
| Invalid Email | `customer_email` بصيغة غير صحيحة | `422` + error Invalid format/email | POSTMAN/curl |
| Invalid Product ID | `products[].id` غير صحيح/غير موجود/<=0 | `400` أو `422` حسب المسار الحالي (كما في الكود) مع رسالة مناسبة | POSTMAN/curl |
| Invalid Quantity | `products[].qty` غير صحيح/<=0 أو غير integer | `400` أو `422` حسب المسار الحالي مع رسالة "الكمية المطلوبة غير صالحة." | POSTMAN/curl |
| Invalid Numeric | `lat` أو `lng` قيمة غير numeric | `422` + error Invalid type/numeric | POSTMAN/curl |
| Invalid URL | (إذا كان هناك field URL في schema لاحقًا) | `422` + Invalid format/url | POSTMAN/curl |
| Unexpected Input | إرسال حقول إضافية غير متوقعة | لا يجب أن ينكسر النظام؛ validation يعتمد على schema فقط | POSTMAN/curl |

**حالة الاختبارات:**
- **Pending Integration Testing** حتى يتم تشغيل PHPUnit/اختبارات PHP أو تنفيذ requests بشكل فعلي في بيئة تشغيل.

---

## 6) Readiness Assessment (هل المرحلة جاهزة للاعتماد؟)

### معايير الاعتماد (كما طلبت)
- ✅ التوافق مع `Response::validationError()` في أخطاء validation (يعتمد 422)
- ✅ لا توجد تغييرات مُضافة في هذه المرحلة (تقرير توثيق فقط)
- ✅ عقد back-compat: تم توثيق الرسائل/الحقول/البنية/Status codes كما هي في الحالة الحالية

### المخاطر/ملاحظات
- وجود استدعاء `Validation::validate()` داخل حلقة `products` ما زال Technical Debt مُحدد.
- nested arrays لم يتم حله بعد (مطلوب لاحقًا).
- الاختبارات التنفيذية Pending بسبب قيود PHP CLI.

### النتيجة
هذه المرحلة تُعد **جاهزة للمراجعة/الاعتماد** من ناحية التوثيق والتأكد من التوافق، مع بقاء الـ Technical Debt والـ Testing بحالة Pending وفق طلبك.

