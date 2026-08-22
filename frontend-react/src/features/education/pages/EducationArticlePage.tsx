import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { getEducationArticle, type EducationArticle } from '@/services/educationClient';
import { getLocalGuidanceArticle } from '../domain/localGuidance';

export default function EducationArticlePage() {
  const { slug = '' } = useParams();
  const [article, setArticle] = useState<EducationArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = async () => {
    if (!slug) {
      setArticle(null);
      setLoading(false);
      setError('رابط المقالة غير صالح.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getEducationArticle(slug);
      const localResult = getLocalGuidanceArticle(slug);
      if (!result && !localResult) {
        setArticle(null);
        setError('المقالة غير موجودة أو لم تعد منشورة.');
      } else {
        setArticle(result ?? localResult);
      }
    } catch {
      setArticle(null);
      setError('تعذر تحميل المقالة حالياً.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadArticle(); }, [slug]);

  if (loading) {
    return <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600" role="status">جاري تحميل المقالة...</main>;
  }

  if (error || !article) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-700" role="alert">{error ?? 'المقالة غير متاحة.'}</p>
        <button type="button" onClick={() => void loadArticle()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white">
          <RefreshCw className="h-4 w-4" /> إعادة المحاولة
        </button>
        <div><Link to="/education" className="mt-5 inline-block font-bold text-emerald-700">العودة إلى مركز المعرفة</Link></div>
      </main>
    );
  }

  const sources = [...(article.sourceUrls ?? [])];
  if (article.coverImageSourceUrl && !sources.includes(article.coverImageSourceUrl)) sources.unshift(article.coverImageSourceUrl);

  return (
    <main dir="rtl" className="min-h-screen bg-emerald-50/60 px-4 py-8">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-10">
        <Link to="/education" className="inline-flex items-center gap-2 font-bold text-emerald-700"><ArrowRight className="h-4 w-4" /> العودة إلى المعرفة</Link>
        <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><BookOpen /></div>
        <p className="mt-5 text-sm font-bold text-emerald-700">{article.family?.name ?? 'معرفة غذائية'} · {article.articleType === 'COMPARISON' ? 'مقارنة' : 'معلومات عامة'}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-5xl">{article.title}</h1>
        {article.summary && <p className="mt-5 text-lg leading-8 text-slate-600">{article.summary}</p>}
        <div className="mt-8 whitespace-pre-wrap leading-9 text-slate-700">{article.body}</div>

        {sources.length > 0 && (
          <section className="mt-8 border-t border-emerald-100 pt-6" aria-labelledby="article-sources-title">
            <h2 id="article-sources-title" className="text-lg font-black text-slate-900">المصادر المذكورة</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {sources.map((source) => <li key={source}><a href={source} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-2 break-all text-emerald-700 underline underline-offset-4"><ExternalLink className="h-4 w-4 shrink-0" /> {source}</a></li>)}
            </ul>
          </section>
        )}

        <aside className="mt-10 rounded-2xl bg-amber-50 p-4 text-sm leading-7 text-amber-900" role="note">
          <strong>تنبيه مهم:</strong> هذه معلومات تثقيفية عامة وليست تشخيصاً أو علاجاً. لا تُستخدم لتغيير علاج أو حمية شخصية. عند وجود مرض مزمن، حساسية، حمل، تناول أدوية، أو أعراض مستمرة، استشر طبيباً أو أخصائي تغذية مؤهلاً.
        </aside>
      </article>
    </main>
  );
}
