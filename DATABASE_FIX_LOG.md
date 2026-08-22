# سجل إصلاح اتصال قاعدة البيانات - قطوف الطبيعة

## المشكلة (تحديث 21 أغسطس 2026)
فشل الاتصال بقاعدة بيانات Supabase من Vercel (خطأ P1001) حتى بعد محاولة استخدام Pooler.
الخطأ الحالي: `Can't reach database server at aws-0-me-central-1.pooler.supabase.com`

## التشخيص
1. **قيد IPv6**: خوادم Vercel لا تدعم IPv6 بشكل افتراضي.
2. **الـ Pooler**: الرابط `aws-0-me-central-1.pooler.supabase.com` قد لا يتم حله (Resolve) بشكل صحيح من Vercel بدون معلمات إضافية أو استخدام IPv4 المباشر.
3. **SSL**: Prisma تتطلب أحياناً `sslmode=require` للعمل مع Pooler.

## الإصلاحات المنفذة (محلياً/GitHub)
1. **تحديث PrismaService**: 
   - إضافة `pgbouncer=true` تلقائياً في بيئة الإنتاج.
   - تحديد `connection_limit=1` لكل Lambda.
2. **إصلاح vercel.json**: تعديل `includeFiles` ليكون نصاً بدلاً من مصفوفة لتجنب أخطاء البناء.

## الإجراءات المطلوبة من المستخدم (على Vercel)
يجب التأكد من أن `DATABASE_URL` في إعدادات Vercel يستخدم المنفذ **6543** ويحتوي على المعلمات التالية:
`?pgbouncer=true&sslmode=require`

**الرابط الموصى به:**
`postgres://postgres.lfhnfuzubquzrhtrmtma:[PASSWORD]@aws-0-me-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require`
