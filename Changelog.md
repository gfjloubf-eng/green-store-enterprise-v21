# سجل التغييرات (Changelog)

## [v1.1.0-alpha] - 2026-07-05
### Added
- **Foundation Layer**: بناء الهيكل الأساسي للمشروع (Enterprise Structure).
- **Namespaces & PSR-4**: إدخال نظام التحميل التلقائي والمساحات الاسمية (`App\*`).
- **Environment Support**: دعم ملفات `.env` لإدارة الإعدادات بطريقة آمنة ومرنة.
- **Config Layer**: فصل إعدادات النظام في مجلد `config/`.
- **Database Layer**: إنشاء `App\Core\Database` كـ Singleton للاتصال بقواعد البيانات.
- **Contracts & Exceptions**: تأسيس البنية التحتية للاستثناءات والواجهات (Interfaces).
- **Coding Standards**: توثيق معايير كتابة الكود في `CodingStandards.md`.

### Changed
- **Secure Orders**: تأمين نظام الطلبات (Checkout) ليحسب الإجماليات استناداً لقاعدة البيانات.
- **db.php**: تحويل الملف القديم إلى Wrapper متوافق مع `Database Layer` الجديدة.
