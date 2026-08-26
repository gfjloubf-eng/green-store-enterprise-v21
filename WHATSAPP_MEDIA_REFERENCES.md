# مراجع تكامل صور واتساب

## Meta Media API

URL: https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/media

توثيق Meta يوضح أن `media_id` يظهر في رسائل الوسائط الواردة عبر Webhook، وأنه يمكن استخدام Media API للحصول على رابط مؤقت ثم تنزيل الملف بترويسة `Authorization: Bearer <ACCESS_TOKEN>`. روابط الوسائط مؤقتة، لذلك يجب تنزيل الصورة عند وصول الحدث. الصور JPEG وPNG مدعومة حتى 5MB في Media API، بينما يفرض النظام الداخلي حدًا أصغر بعد الضغط لتقليل استهلاك الإنترنت.

## Meta Webhooks

URL: https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview

توثيق Meta يوضح أن Webhooks هي طلبات HTTP تحتوي JSON ترسلها Meta إلى endpoint عام، وأن حقل `messages` هو الحقل المطلوب لاستقبال الرسائل الواردة، بما فيها رسائل الصور. يتطلب استقبال رسائل WhatsApp صلاحية `whatsapp_business_messaging`، كما يجب أن يعيد endpoint استجابة ناجحة لتقليل إعادة المحاولة.

هذه المراجع تخص فكرة WhatsApp المستقبلية، ولا تغيّر اتصال Supabase أو تسجيل الدخول الحالي.
