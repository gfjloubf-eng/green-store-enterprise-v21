# سجل إصلاح اتصال قاعدة البيانات - قطوف الطبيعة

## المشكلة
فشل الاتصال بقاعدة بيانات Supabase من Vercel (خطأ P1001).

## التشخيص
1. **قيد IPv6**: خوادم Vercel لا تدعم IPv6 بشكل افتراضي، بينما نطاقات Supabase المباشرة (`db.[id].supabase.co`) تعتمد عليه.
2. **استهلاك الاتصالات**: البيئات اللاحسابية (Serverless) مثل Vercel تفتح اتصالات كثيرة مما يؤدي لرفض الخدمة إذا لم يتم استخدام Pooler.

## الإصلاحات المنفذة (محلياً/GitHub)
1. **تحديث PrismaService**: 
   - إضافة `pgbouncer=true` تلقائياً في بيئة الإنتاج.
   - تحديد `connection_limit=1` لكل Lambda لضمان عدم استهلاك موارد قاعدة البيانات.
2. **تحسين الأداء**: تفعيل تسجيل الأخطاء فقط في الإنتاج لتقليل حجم السجلات.

## الإجراءات المطلوبة من المستخدم (على Vercel)
يجب تحديث متغير البيئة `DATABASE_URL` في إعدادات Vercel لاستخدام **Transaction Pooler** بدلاً من الرابط المباشر.

**الرابط الحالي (خاطئ لـ Vercel):**
`postgresql://postgres:[PASSWORD]@db.lfhnfuzubquzrhtrmtma.supabase.co:5432/postgres`

**الرابط الصحيح (المطلوب):**
يجب أن يكون بالتنسيق التالي (من لوحة تحكم Supabase -> Settings -> Database -> Connection Pooler):
`postgres://postgres.lfhnfuzubquzrhtrmtma:[PASSWORD]@aws-0-me-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

> **ملاحظة**: تأكد من استخدام المنفذ **6543** ووضع كلمة المرور الصحيحة.
