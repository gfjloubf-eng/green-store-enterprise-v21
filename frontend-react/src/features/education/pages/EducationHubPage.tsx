import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MessageCircle, Search, Sparkles } from 'lucide-react';
import { listEducationArticles, type EducationArticle } from '@/services/educationClient';

export default function EducationHubPage() {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => { listEducationArticles().then(setArticles); }, []);
  const filtered = useMemo(() => articles.filter((article) => `${article.title} ${article.summary ?? ''} ${article.family?.name ?? ''}`.toLowerCase().includes(query.toLowerCase())), [articles, query]);
  return <main dir="rtl" className="min-h-screen bg-emerald-50/70 bg-cover bg-fixed px-4 py-8" style={{ backgroundImage: "linear-gradient(rgba(240,253,244,.88),rgba(240,253,244,.94)), url('/education-fruit-background.png')" }}>
    <section className="mx-auto max-w-6xl">
      <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-emerald-100 md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700"><Sparkles className="h-4 w-4" /> معرفة غذائية مبسطة</p><h1 className="text-3xl font-black text-slate-900 md:text-5xl">افهم منتجك قبل أن تختاره</h1><p className="mt-3 max-w-2xl leading-8 text-slate-600">شروحات عامة ومقارنات بين الأنواع، مع التأكيد أن المعلومات لا تغني عن استشارة المختص عند وجود حالة صحية خاصة.</p></div><Link to="/consultation" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-emerald-700"><MessageCircle className="h-5 w-5" /> استشارة تغذية</Link></div>
        <label className="mt-8 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3"><Search className="h-5 w-5 text-emerald-700" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن التفاح أو البرتقال..." className="w-full bg-transparent outline-none" /></label>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((article) => <Link key={article.id} to={`/education/${article.slug}`} className="group rounded-3xl bg-white/95 p-6 shadow-md ring-1 ring-emerald-100 transition hover:-translate-y-1 hover:shadow-xl"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><BookOpen /></div><p className="text-xs font-bold text-emerald-700">{article.family?.name ?? 'معرفة عامة'} · {article.articleType === 'COMPARISON' ? 'مقارنة' : 'فوائد ومعلومات'}</p><h2 className="mt-2 text-xl font-black text-slate-900 group-hover:text-emerald-700">{article.title}</h2><p className="mt-3 leading-7 text-slate-600">{article.summary ?? article.body.slice(0, 140)}</p></Link>)}</div>
      {!filtered.length && <div className="mt-8 rounded-3xl bg-white/90 p-8 text-center text-slate-600">لا توجد مقالات منشورة مطابقة للبحث حاليًا.</div>}
    </section>
  </main>;
}
