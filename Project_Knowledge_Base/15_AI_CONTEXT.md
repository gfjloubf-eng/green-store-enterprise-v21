# AI Context — Green Store Enterprise

## وصف سريع للمشروع
**Green Store Enterprise** مشروع تجارة إلكترونية (Backend/PHP + HTML/JS frontend) مع هدف هندسي: بناء أساس قابل للصيانة عبر فصل طبقات التعامل مع **الاستجابة** و **التحقق (Validation)**.

- نقطة التكامل الأهم حاليًا: endpoint `save_order.php` لاستقبال طلب/سلة على شكل JSON ثم التحقق ثم حفظ `orders`.
- يوجد أساس معماري في `app/Core/Validation.php` و `app/Core/Response.php`.

## التقنيات المستخدمة
- **PHP** (نمط Procedural endpoints + Classes داخل `app/`).
- **PDO** للوصول إلى قاعدة البيانات عبر `app/Core/Database.php`.
- **JSON API**: الاستجابات كلها JSON.
- **Frontend**: HTML/JS (كما يوجد أيضًا frontend-react لكن ليس مطلوبًا للتشغيل الأساسي).

## الهيكل (ملخص)
- `save_order.php`: Endpoint لاستلام الطلب.
- `app/Core/Database.php`: اتصال PDO + بعض helpers للمعاملات.
- `app/Core/Validation.php`: محرك Validation + ValidationResult + قواعد.
- `app/Core/Response.php`: API استجابة موحدة (success/error/validationError).
- `backend/`: طبقات إضافية (Models/Controllers) للواجهة الإدارية.

## تدفق البيانات في Endpoint save_order.php
1. استقبال الطلب عبر `POST`.
2. `json_decode` من `php://input`.
3. Validation أولي للشكل العام عبر `Validation::validate($input, $schema)`.
4. Validation إضافي لكل عنصر داخل `products` (id + qty/quantity) داخل دالة `validateProductItem`.
5. بدء Transaction على PDO.
6. لكل منتج: تحقق وجوده بالـ DB ثم حساب `line_total`.
7. حفظ الطلب في `orders` وتخزين `products_json`.
8. إرجاع `Response::success` أو `Response::error`.

## القرارات المهمة (موجودة من Audit/التوثيق السابق)
- الحفاظ على **Backward Compatibility** لمسار الاستجابة ورسائل الأخطاء.
- تحويل الـ Audit إلى إصلاحات فعلية داخل الكود.
- الأولوية الحالية: **Validation Integration** ثم **Architecture Cleanup** ثم **Refactoring**.

## المشاكل الحالية (Technical Debt)
- `save_order.php` يحتوي على **منطق Validation** مزدوج/متداخل (جزء عبر `Validation::validate` وجزء عبر فحوصات يدوية خصوصًا `products`).
- احتمال اختلاف رسائل errors بين المسارات المختلفة.
- زيادة تعقيد endpoint لأن منطق validation+business+db موجود في نفس الملف.

## ما الذي يجب عمله لاحقًا (وفق الأولويات الحالية)
1. **Validation Integration**: إزالة التحقق المكرر وتحسين `save_order.php` مع حفظ JSON structure ورسائل errors.
2. **Architecture Cleanup**: البحث عن code duplication/dead code/unused imports/legacy includes/PSR violations وإصلاح ما لا يغير السلوك.
3. **Refactoring تدريجي** لتحسين قابلية الصيانة دون تغيير الوظيفة.

## آخر نقطة توقف
2026-07-07: تم إنشاء جزء من بنك المعلومات (`00_PROJECT_OVERVIEW.md` و `15_AI_CONTEXT.md`). لم يتم بعد تنفيذ تعديل الكود المطلوب في `save_order.php`.

