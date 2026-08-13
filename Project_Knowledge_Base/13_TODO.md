# TODO — Green Store Enterprise

> قائمة المهام المستقبلية (مرتبة حسب الأولوية). هذا الملف يُحدَّث بعد كل جلسة عمل.

## Priority 1 — Validation Integration
- [ ] تعديل `save_order.php`: إزالة التحقق المكرر لـ `products` اليدوي (empty / !is_array) مع الاعتماد على `Validation::validate` فقط، والحفاظ على نفس رسائل errors المتوقعة.
- [ ] تحديث بنك المعلومات (`Project_Knowledge_Base/07_CHANGELOG.md` و `Project_Knowledge_Base/16_CONVERSATION_MEMORY.md` و `Project_Knowledge_Base/17_FILE_INDEX.md`) بعد تطبيق الإصلاح.


## Priority 2 — Architecture Cleanup
- [ ] البحث عن duplicate/dead/unused imports/legacy includes/PSR violations وإصلاح ما لا يغير السلوك.

## Priority 3 — Refactoring
- [ ] تحسين `save_order.php` تدريجيًا (Long Method/DRY/Tight Coupling) دون تغيير وظيفة النظام.

## Priority 4 — Backward Compatibility
- [ ] بعد كل تغيير: التحقق من Frontend/API/JSON structure/HTTP codes.

