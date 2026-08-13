# معايير كتابة الكود (Coding Standards)

لضمان جودة الكود وسهولة صيانته وتوسيع النظام (Enterprise Level)، يجب الالتزام بالمعايير التالية في جميع أجزاء المشروع:

## 1. المبادئ الهندسية (Engineering Principles)
- **SRP (Single Responsibility Principle):** كل كلاس أو دالة يجب أن يكون لها مسؤولية واحدة فقط.
- **OCP (Open/Closed Principle):** الكود يجب أن يكون قابلاً للتوسع (عن طريق الإضافة) ومغلقاً للتعديل.
- **DRY (Don't Repeat Yourself):** تجنب تكرار الكود. استخدم الـ Helpers أو الـ Services بدلاً من ذلك.
- **KISS (Keep It Simple, Stupid):** الحفاظ على بساطة الكود وتجنب التعقيد غير المبرر.

## 2. تنظيم المجلدات (Folder Organization)
- `app/Core/`: المكونات الأساسية (Database, Router, Response).
- `app/Controllers/`: نقطة استلام الطلب وتوجيهه.
- `app/Models/`: تمثيل بيانات قاعدة البيانات فقط.
- `app/Services/`: منطق العمل (Business Logic).
- `app/Repositories/`: طبقة التعامل المباشر مع قاعدة البيانات (فصل الـ DB عن הـ Services).
- `app/Contracts/`: الـ Interfaces الخاصة بالنظام.
- `app/Exceptions/`: الاستثناءات المخصصة.

## 3. مساحات الأسماء (Namespaces)
- جميع الكلاسات يجب أن تتبع معيار `PSR-4`.
- تبدأ بـ `App\` وتطابق الهيكل المجلداتي (مثال: `App\Controllers\UserController`).

## 4. تسمية الملفات والكلاسات (Naming Conventions)
- **الكلاسات (Classes):** `PascalCase` (مثال: `OrderService`, `UserController`).
- **الملفات (Files):** يجب أن تطابق اسم الكلاس بداخلها (مثال: `OrderService.php`).
- **الواجهات (Interfaces):** `PascalCase` وتنتهي بكلمة `Interface` (مثال: `RepositoryInterface`).

## 5. تسمية الدوال والمتغيرات (Functions & Variables)
- **الدوال (Methods):** `camelCase` (مثال: `processOrder()`, `getUser()`).
- **المتغيرات (Variables):** `camelCase` ذات دلالة واضحة. تجنب الأسماء المختصرة الغامضة.
- **الثوابت (Constants):** `UPPER_SNAKE_CASE` (مثال: `MAX_UPLOAD_SIZE`).

## 6. التعليقات والتوثيق (Comments & Documentation)
- استخدم الـ PHPDoc لتوثيق الكلاسات والدوال المعقدة.
- اشرح "السبب" (Why) في التعليقات وليس "ماذا" (What)، فالكود الجيد يشرح نفسه.

## 7. التعامل مع الأخطاء (Error Handling)
- لا تستخدم `die()` أو `echo` للأخطاء.
- قم برمية استثناء مخصص (`throw new ValidationException(...)`).
- يتم التقاط الأخطاء وتسجيلها عبر الـ `Logger` وإعادة استجابة موحدة للعميل عبر `Response Helper`.
