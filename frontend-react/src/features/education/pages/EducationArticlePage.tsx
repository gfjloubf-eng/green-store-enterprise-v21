import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { getEducationArticle, type EducationArticle } from '@/services/educationClient';

export default function EducationArticlePage() {
  const { slug = '' } = useParams();
  const [article, setArticle] = useState<EducationArticle | null>(null);
  useEffect(() => { getEducationArticle(slug).then(setArticle); }, [slug]);
  if (!article) return <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">جاري تحميل المقال أو أنه غير متاح.</main>;
  return <main dir="rtl" className="min-h-screen bg-emerald-50/60 px-4 py-8"><article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-10"><Link to="/education" className="inline-flex items-center gap-2 font-bold text-emerald-700"><ArrowRight className="h-4 w-4" /> العودة إلى المعرفة</Link><div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><BookOpen /></div><p className="mt-5 text-sm font-bold text-emerald-700">{article.family?.name ?? 'معرفة غذائية'} · معلومات عامة</p><h1 className="mt-2 text-3xl font-black text-slate-900 md:text-5xl">{article.title}</h1>{article.summary && <p className="mt-5 text-lg leading-8 text-slate-600">{article.summary}</p>}<div className="mt-8 whitespace-pre-wrap leading-9 text-slate-700">{article.body}</div><div className="mt-10 rounded-2xl bg-amber-50 p-4 text-sm leading-7 text-amber-900">تنبيه: هذه معلومات تثقيفية عامة وليست تشخيصًا أو علاجًا. عند وجود حالة صحية أو حمية خاصة، استشر اختصاصيًا مؤهلًا.</div></article></main>;
}
