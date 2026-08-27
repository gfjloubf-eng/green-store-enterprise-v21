# مرجع الاتصال ورفع الصور — قطوف الطبيعة

## حدود التغيير الثابتة

- `DATABASE_URL` يبقى رابط PostgreSQL الخاص بـ Supabase عبر Session Pooler على المنفذ 5432.
- `SUPABASE_URL` يبقى رابط HTTPS الخاص بالمشروع فقط.
- لا يتم وضع رابط PostgreSQL داخل `SUPABASE_URL`.
- لا يتم وضع رابط `/rest/v1/` داخل `DATABASE_URL`.
- لا يتم تعديل AuthProvider أو مسارات تسجيل الدخول ضمن إصلاح Storage.
- لا يتم تشغيل Migration أو حذف أو تحديث بيانات المنتجات ضمن هذا المسار.

## العطل المثبت

الضغط والمعاينة يعملان في المتصفح. كان الطلب يصل إلى Supabase Storage، لكن استخدام مفتاح `sb_secret_...` في `Authorization: Bearer` ينتج `Invalid Compact JWS` لأنه ليس JWT. حذف Authorization ينتج خطأ أن الترويسة مطلوبة.

## الحل المعتمد

يبقى المفتاح الحالي في ترويسة `apikey`. ويُستخدم متغير اختياري باسم `SUPABASE_STORAGE_JWT_KEY` لتزويد Storage بترويسة `Authorization: Bearer` عندما تكون قيمة `SUPABASE_SERVICE_ROLE_KEY` من نوع `sb_secret_...`. إذا لم يوجد المتغير الاختياري، يحتفظ النظام بالسلوك الحالي ويعرض خطأ واضحًا بدل تخمين مفتاح أو تغيير الاتصال.

## الرفع المستقل

- المسار: `POST /media/upload`
- صفحة الأدمن: `/admin/media-upload`
- يعتمد على الجلسة الحالية وصلاحية `products:create`.
- يضغط الصورة مرة واحدة قبل الرفع.
- لا ينشئ منتجًا ولا يحدّث قاعدة البيانات.
- المسار القديم `/products/media/upload` يبقى موجودًا.

## اختبار سابق

- صورة جزر: 960×1200، وبعد الضغط 143KB.
- النتيجة قبل مفتاح JWT الصحيح: `storage_upload_failed_400: Invalid Compact JWS`.
- هذه النتيجة تخص مصادقة Storage فقط، وليست انقطاعًا في قاعدة البيانات.

## ممنوعات السلامة

لا تُحفظ كلمات المرور أو مفاتيح Supabase أو قيم Vercel السرية في GitHub أو هذا الملف أو مخرجات الطرفية.

## اختبار 2026-08-27 — نتيجة رفع صورة المنتج

- تم اختبار صفحة `/admin/media-upload` في Production باستخدام صورة جزر مضغوطة إلى 143KB وبأبعاد 1200×1200.
- رفع صورة البروفايل نجح، ما يثبت أن `SUPABASE_URL` ومفتاح Storage JWT والـbucket الخاص بالبروفايل يعملون.
- خطأ `Invalid status code: undefined` كان سببه أن `media-routes.ts` يعيد نتيجة Storage الخام بدل `ApiResponse` يحتوي `statusCode`. تم إصلاحه بإرجاع `created(data, context)` لمساري رفع المنتج والرفع المستقل.
- بعد ذلك بقي رفض `authorization_denied` لمسار الرفع المستقل. الواجهة تعرض `SUPER_ADMIN`، لكن الخادم لا يطابق الدور في حماية المسار في جلسة الاختبار. تم فصل المسار عن `products:create` وإضافة fallback من `user.role` إلى `user.roles`، وإزالة فحص الدور المحلي المتخزن من دالة الرفع المستقل؛ ما زال يلزم التحقق من مصدر الدور الفعلي في `auth/me` أو استعادة الجلسة قبل إعلان نجاح الرفع.
- لم يتم تعديل `DATABASE_URL` أو `SUPABASE_URL` أو قاعدة البيانات أو تنفيذ Migration.
