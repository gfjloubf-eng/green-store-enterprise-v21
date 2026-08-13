# File Index — Green Store Enterprise

> فهرس يساعد أي AI/مطور يفهم أين كل شيء.

## القائمة المختصرة (حسب ما تم إنجازه/معرفته ضمن هذه الجلسة)

| المسار | الوظيفة | العلاقة | هل تم تعديله؟ | آخر تعديل |
|---|---|---|---|---|
| `save_order.php` | Endpoint لاستقبال الطلب والتحقق ثم حفظ order في DB | نقطة التكامل الأساسية لـ Validation Integration | **نعم** | 2026-07-07 |
| `app/Core/Validation.php` | محرك Validation و ValidationResult | يعتمد عليه `save_order.php` | لا | — |
| `app/Core/Response.php` | توليد JSON responses موحدة | يعتمد عليه `save_order.php` | لا | — |
| `backend/models/OrderModel.php` | نموذج لإنشاء order (موجود للـ backend) | غير مستخدم مباشرة في `save_order.php` الحالي | لا | — |
| `Project_Knowledge_Base/00_PROJECT_OVERVIEW.md` | نظرة عامة | مرجع رسمي | تم الإنشاء | 2026-07-07 |
| `Project_Knowledge_Base/13_TODO.md` | قائمة مهام مستقبلية | مرجع مهم للتنفيذ | تم التحديث | 2026-07-07 |
| `Project_Knowledge_Base/15_AI_CONTEXT.md` | سياق AI | مرجع للتطوير المستقبلي | تم الإنشاء | 2026-07-07 |
| `Project_Knowledge_Base/07_CHANGELOG.md` | سجل التغييرات | مرجع للتوثيق | تم الإنشاء | 2026-07-07 |
| `Project_Knowledge_Base/16_CONVERSATION_MEMORY.md` | ذاكرة الجلسات | مرجع سياقي | تم الإنشاء | 2026-07-07 |
| `TODO-Maintenance-Execution.md` | سجل حالة التنفيذ العام | متابعة العمل | تم التحديث/إنشاء | 2026-07-07 |

