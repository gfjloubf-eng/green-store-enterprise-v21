# طبقة قاعدة البيانات (Database Layer)

تم الاستغناء عن استدعاء `PDO` المباشر في النظام، واستبداله بطبقة مركزية قوية في `App\Core\Database`.

## مميزات البنية الجديدة
1. **Singleton Pattern**: يتم إنشاء اتصال واحد فقط (Connection) وإعادة استخدامه في كامل التطبيق، مما يوفر استهلاك الذاكرة ويرفع الأداء.
2. **Centralized Configuration**: جميع إعدادات الاتصال، مثل Host, Username, Password, Charset, Timezone تقرأ من ملف `.env` و `config/database.php`، ولا توجد أي قيم ثابتة Hardcoded.
3. **Secure Error Handling**: في حال فشل الاتصال، يتم تسجيل الخطأ الفعلي (مع بيانات الـ DSN) داخلياً عبر `error_log`، ويُرسل للمستخدم رسالة عامة آمنة لا تكشف بنية الخادم.
4. **Backward Compatibility**: تم تحويل الملف القديم `db.php` ليكون مجرد غلاف (Wrapper) يستدعي الاتصال من `App\Core\Database` ويوفره للملفات القديمة عبر المتغير `$pdo`، حتى لا تتوقف وظائف المتجر (مثل سلة المشتريات) أثناء انتقالنا التدريجي.

## دوال أساسية (Core Methods)
- `getInstance()`
- `getConnection()`
- `beginTransaction()`
- `commit()`
- `rollback()`
- `isConnected()`
