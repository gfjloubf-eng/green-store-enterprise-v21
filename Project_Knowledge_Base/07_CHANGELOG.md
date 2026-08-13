# Changelog — Green Store Enterprise

> يسجل هذا الملف كل تعديل/إصلاح/قرار تم تنفيذه داخل المشروع.

## 2026-07-07
### Validation Integration — إزالة التحقق المكرر لـ products داخل save_order.php
- **السبب**: كان endpoint `save_order.php` يحتوي على **تحقق مزدوج**: (1) تحقق عام عبر `Validation::validate` ثم (2) تحقق يدوي إضافي لـ `products` (empty/!is_array). هذا يرفع التعقيد ويزيد احتمال اختلاف رسائل الأخطاء.
- **الملف المعدل**: `save_order.php`
- **ماذا تغير**:
  - حذف block الذي يتحقق يدويًا من:
    - `empty($products) || !is_array($products)`
  - تم الإبقاء على معالجة errors داخل:
    - `foreach ($errors as &$err)` مع overwrite لرسالة field `products` إلى الرسالة العربية القديمة.
  - تمت إزالة ملاحظة قديمة بداخل الملف واستبدالها بتعليق يوضح أن message تُفرض عبر schema + override.
- **تأثير التعديل**:
  - لم يتغير HTTP status codes ولا JSON structure.
  - لم يتغير منطق حساب الإجمالي ولا منطق DB existence checks.
  - تم توحيد مصدر truth لحالة `products` إلى `Validation::validate` فقط.
- **هل بقي Technical Debt؟**
  - نعم جزئيًا: بقاء `validateProductItem` داخل نفس الملف ما زال يوحي بتداخل مسؤوليات (Validation + Business + DB) لكنه خارج نطاق “إزالة التحقق المكرر” في هذه المهمة.

## 2026-07-27
### Module Freeze & Production Readiness Report v1.0
- **تجميد وحدة الطلبات (Orders Module Freeze)**: تم تأكيد نجاح التحقق للتشغيل (Runtime Verification) وتجميد وحدة الطلبات وكافة الوحدات المؤسسية بشكل رسمي.
- **إصدار التقرير النهائي (Production Readiness Report v1.0)**: تم إنشاء التقرير الشامل للجاهزية الإنتاجية (`Production-Readiness-Report-v1.0.md`).
- **حالة الكود**: تم قفل الكود البرمجي بالكامل للتحضير لمرحلة التوثيق الرسومي (UML Diagrams) والتسليم الأكاديمي النهائي.
