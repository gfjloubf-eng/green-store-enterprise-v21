# المعمارية الفنية (Architecture)

يعتمد مشروع Green Store بدءاً من الإصدار v1.1 على هيكلة (Enterprise Architecture) متينة وقابلة للتوسع. البنية الحالية تم تصميمها وفق مبادئ الـ SOLID، وخاصة SRP (Single Responsibility Principle) لفصل المهام بوضوح.

## الطبقات الأساسية
1. **Core Layer (`app/Core/`)**: النواة الأساسية التي تحرك النظام. تحتوي حالياً على:
   - `Database`: كلاس للتعامل مع قاعدة البيانات بنمط Singleton.
   - `Env`: نظام لتحميل المتغيرات البيئية من `.env`.
2. **Configuration (`config/`)**: إعدادات النظام مفصولة بالكامل عن الكود ومستقلة، وتقرأ من ملف `.env`.
3. **Contracts (`app/Contracts/`)**: الواجهات (Interfaces) التي تُبنى عليها باقي الطبقات (مثل `RepositoryInterface`) لتطبيق الـ Dependency Inversion.
4. **Exceptions (`app/Exceptions/`)**: معالجة الأخطاء بمسميات واضحة ومخصصة لكل طبقة (مثل `DatabaseException`).
5. **Autoloader**: يعتمد النظام على `PSR-4` لتحميل الكلاسات تلقائياً عبر نطاق `App\`.

هذه البنية تجهز المشروع للمراحل القادمة والتي ستشمل طبقات Request/Response و Validation و Services.
