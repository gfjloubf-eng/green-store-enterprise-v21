# Green Store Enterprise — Enterprise-Audit-Report-v1.0.md

## 1) Executive Summary
- **الهدف:** تنفيذ Architecture Audit + Maintenance على المشروع الحالي دون إضافة أي ميزة جديدة، ودون بدء مراحل جديدة (Security/Logger/Middleware).
- **النطاق (المعتمد):** تحليل مباشر للكود ضمن الملفات المقروءة من:
  - `save_order.php`
  - `api.php`
  - `app/Core/Database.php` *(لم يتم قراءته ضمن الأدوات في هذه الجولة؛ لذا تُذكر البنود غير المؤكدة)*
  - `app/Core/Response.php`
  - `app/Core/Validation.php`
  - وثائق: `Architecture.md`, `Foundation-Checklist.md`, `ADR-*`, `CodingStandards.md`, `Changelog.md`, `TODO-*`.
- **النتيجة:** يوجد التزام جزئي بالـ layered architecture (Database/Response/Validation موجودة)، لكن يوجد **كسر واضح لفصل المسؤوليات (Separation of Concerns)** على مستوى endpoints، و**gap معماري** في Validation لدعم nested arrays، إضافةً إلى **مخاطر أمنية/هندسية** تم رصدها كـ ملاحظات فقط (غير مُعالَجة في هذه الجولة).

> قاعدة ذهبية: **لا أعتبر أي شيء صحيحًا لأنه موجود في التوثيق**؛ الكود هو الحقيقة.

---

## 2) Current Project Status
- **Foundation Layer:**
  - Database Layer: مذكورة كـ ✅ في التقارير/تخطيط المشروع، واستخدام `App\Core\Database` ظاهر في `save_order.php` و`api.php`.
  - Response Layer: ✅ واضح في `App\Core\Response` ويُستخدم فعليًا.
  - Validation Layer: موجودة فعليًا (`app/Core/Validation.php`) لكن **لا تزال ناقصة** من منظور nested schema.
  - Security/Logger/Middleware/Repository/Service: **غير منفذة** كطبقات فعالة ضمن الملفات التي فُحصت.

---

## 3) Architecture Audit

### 3.1 Database
#### ما تم التحقق منه فعليًا
- `save_order.php`:
  - يستخدم `\App\Core\Database::getInstance()` ثم `$db->getConnection()`.
- `api.php`:
  - يستخدم نفس نمط `App\Core\Database`.

#### بنود **غير مؤكدة بالكامل**
- هل جميع endpoints/ملفات المشروع تمر عبر `App\Core\Database`؟
  - **غير مؤكد 100%** بسبب عدم إجراء فحص شامل لكل الملفات (أداة البحث ripgrep غير متاحة في هذه البيئة حسب سجل سابق).

#### ازدواجية / تسرب DB logic
- endpoints الحالية (خصوصًا `save_order.php`) تقوم بـ:
  - validation orchestration
  - DB existence check للمنتجات
  - price calculation
  - transaction + insert

هذا **ليس تسرب اتصال** (connection يأتي من Database layer)، لكنه **تسرب مسؤوليات**؛ يفقد الهدف المعماري لفصل DB access ضمن Repository/Service layers.

### 3.2 Response
#### تم التحقق منه فعليًا
- `app/Core/Response.php` يملك:
  - JSON envelope: `success`, `message` + `errors` عند validation.
  - تعيين HTTP status + `Content-Type` داخل `emit()`.
  - يستخدم `exit` بعد echo.
- `save_order.php` و `api.php` لا يحتويان `echo/json_encode/http_response_code/header` مباشرةً.

#### ملاحظة معماريّة
- `Response::emit()` يحتوي على `exit` وهو غالبًا مناسب للـ endpoints، لكن يفرض أسلوب تدفّق محدد (غير مُعتبر عيبًا حاليًا).

### 3.3 Validation
#### تم التحقق منه فعليًا
- `app/Core/Validation.php`:
  - engine يعمل schema على مستوى مفاتيح top-level فقط.
  - لا يوجد recursion/nested schema mechanism.
- `save_order.php`:
  - يتم استدعاء `Validation::validate()` على payload top-level.
  - ثم يتم استدعاؤه مرة أخرى داخل `foreach` لكل item لتحديد صلاحية `products[idx].id` و `products[idx].qty`.

#### الانتهاكات/الفجوات المعمارية
- **DRY/SRP:** validation orchestration داخل endpoint بدل nested schema rules.
- **Nested arrays support:** غير مدعوم داخل Validation engine، ما يجبر endpoints على manual iteration.

#### هل Validation تحتوي SQL/PDO؟
- لا (حسب الكود المقروء).

---

## 4) Code Quality Audit (بدون تعديلات)

### 4.1 Separation of Concerns
- `save_order.php` controller/endpoint ثقيل:
  - يتحكم في transaction
  - ينفذ DB queries
  - يحسب prices
  - يدير validation (مع تكرار per-item)

هذا يخالف مبدأ SRP على مستوى endpoint.

### 4.2 DRY
- تكرار validation داخل loop.

### 4.3 Magic numbers / Hardcoded strings
- رسائل عربية hardcoded في `save_order.php`.
- status codes hardcoded عبر calls إلى Response (مفترضًا صحيح حسب design).

---

## 5) Security Review (ملاحظات فقط — دون معالجة)

> لم أبدأ Security Layer؛ لذا هذا فقط سجل ملاحظات.

### 5.1 SQL Injection
- ضمن الملفات التي تمت قراءتها:
  - استخدام `prepare()` + placeholders في queries الأساسية (`SELECT ... WHERE id = ?`, و `INSERT ... VALUES (?,...)`) => خطر SQLi منخفض.
- وجود legacy scripts داخل المشروع غير مفحوص بالكامل => خطر SQLi ممكن خارج نطاق الملفات المقروءة.

### 5.2 XSS
- لا يوجد rendering HTML داخل PHP endpoints؛ يتم إرسال JSON فقط.
- الخطر قد ينتقل إلى frontend إذا قام بعرض `message/errors` بدون escaping.

### 5.3 CSRF
- endpoints تعالج `POST` بدون ذكر CSRF tokens.
- إن كان التطبيق يستخدم browser forms بدون حماية إضافية، فهناك خطر CSRF.

### 5.4 Validation gaps / Input handling
- `json_decode` في `save_order.php` ثم `if (!$input)`:
  - Payload فارغ/غير صحيح قد ينتج سلوك edge-case.
- nested arrays validation غير موحد => مخاطر inconsistency عند التوسع.

---

## 6) Documentation Review (Code هو الحقيقة)

- `Foundation-Checklist.md` يذكر Validation ⏳، بينما توجد بالفعل Validation Engine integration جزئي في `save_order.php`.
  - هذا **قد يكون صحيحًا دلاليًا** لأن nested arrays/unique/exists integration غير مكتملة.
- `Architecture.md` يصف PSR-4/SOLID بشكل عام، بينما الواقع يظهر أن endpoints ما زالت تحتوي Business Logic و DB logic مباشرة.

---

## 7) Technical Debt Audit (سجل كامل)

> ملاحظة: القيم الأولوية مبنية على خطر هندسي/تعقيد صيانة مستقبلية.

| المشكلة | السبب | التأثير | الأولوية | المرحلة المقترحة | Owner |
|---|---|---|---|---|---|
| Nested Array Validation غير مدعوم داخل Validation engine | `Validation.php` يطبق schema على top-level ولا يملك recursion/nested schema | endpoints مضطرة لتكرار validation داخل loops؛ يزيد احتمال inconsistency | Medium | بعد اكتمال تصميم Validation Layer لدعم nested schemas | Validation Layer owner |
| تكرار استدعاء Validation داخل loop products | endpoint يدير per-item validation | DRY violation + endpoint ثقيل | Medium | ضمن تطوير nested validation داخل Validation Layer ثم refactor endpoint | Validation + Endpoint owner |
| exists/unique Placeholder-only | لا يوجد Repository/Service integration بحقن DB checks | IDs/uniqueness checks غير محققة ضمن Validation | High | عند تنفيذ Repository/Service Layer + injection من DB checks | Repository/Service owner |
| Endpoint يحتوي Business Logic و DB logic مباشرة | غياب Service/Repository في المسار الحالي | يخالف SRP ويزيد coupling | Medium/High | عند بدء Repository/Service layers | Architecture owner |
| hardcoded Arabic messages في endpoints | عدم وجود message catalog/i18n | صعوبة التدويل وتوحيد الرسائل | Low/Medium | لاحقاً بعد توحيد validation/security response mapping | Response/i18n owner |

---

## 8) Backward Compatibility Review

> هذا قسم توثيقي من الكود فقط (بدون اختبارات تشغيلية).

### 8.1 Response envelope
- Success: `success:true`, `message`, و extra مثل `order_id`.
- Validation errors: `success:false`, `message:'validation error'`, و `errors`.

### 8.2 HTTP Status codes (في الملفات المقروءة)
- `save_order.php`:
  - validation errors => 422 via `Response::validationError()`.
  - أخطاء أعمال معروفة عبر catch/known_errors => 400 عبر `Response::error(...,400)`.
  - method not POST => 405.

### 8.3 Field names
- input schema في `save_order.php`:
  - `customer_name`, `customer_email`, `customer_phone`, `delivery_addr`, `products`, `lat`, `lng`.
  - `products[*]`: `id` و `qty` (مع قبول `quantity` أيضًا).

> لا يمكن تأكيد قبل/بعد دمج حرفيًا بدون اختبارات تشغيلية ومقارنات، لكن **هذا هو السلوك الحالي الموصوف في الكود**.

---

## 9) Documentation/Files Integrity
- توجد ملفات legacy ومدارات غير فُحوصات بالكامل (مثل مجلدات/ملفات `.txt`).
- لا يتم حذف أي شيء في هذا التدقيق.

---

## 10) Files Fixed
- **لا شيء** (Audit-only, no code changes).

---

## 11) Files Requiring Future Refactoring
- `save_order.php`:
  - تفكيك Responsibilities إلى Service/Repository وترك endpoint orchestration فقط.
- `app/Core/Validation.php`:
  - دعم nested schema/recursion لـ `products[*]` وrules موحدة.
- `TODO-steps.md` و `Foundation-Checklist.md`:
  - تحديث دقيق للتوافق مع “ما هو مكتمل مقابل ما هو مخطط” (إن سُمح بتعديل توثيقي).

---

## 12) Risk Assessment
- **High / Medium risks**:
  - Endpoint coupling + business logic in controller.
  - Validation gap for nested arrays.
  - Placeholder exists/unique leading to false confidence.
- **Security notes**:
  - CSRF غير ظاهر.
  - validation gaps ممكنة.

---

## 13) Final Recommendation
- **لا تبدأ Security Layer** الآن.
- يُوصى بالالتزام بخطة Validation Layer evolution أولاً (nested arrays + exists/unique via injection) ثم Service/Repository refactor.

> التوصية هنا إجرائية (Maintenance planning) وليست اعتماد مرحلة جديدة.

