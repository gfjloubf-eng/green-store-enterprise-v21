import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { BookOpen, Edit3, Plus, Save, Trash2, X } from 'lucide-react';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import {
  createAdminEducationArticle,
  deleteAdminEducationArticle,
  listAdminEducationArticles,
  updateAdminEducationArticle,
  type AdminEducationArticleInput,
  type EducationArticle,
} from '@/services/educationClient';

type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

type ArticleForm = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  articleType: string;
  status: ArticleStatus;
  coverImageUrl: string;
  coverImageSourceUrl: string;
  coverImageLicense: string;
  sourceUrlsText: string;
  familyId: string;
  productIdsText: string;
};

const emptyForm: ArticleForm = {
  slug: '',
  title: '',
  summary: '',
  body: '',
  articleType: 'BENEFITS',
  status: 'DRAFT',
  coverImageUrl: '',
  coverImageSourceUrl: '',
  coverImageLicense: '',
  sourceUrlsText: '',
  familyId: '',
  productIdsText: '',
};

function toForm(article: EducationArticle): ArticleForm {
  return {
    slug: article.slug,
    title: article.title,
    summary: article.summary ?? '',
    body: article.body,
    articleType: article.articleType,
    status: article.status === 'PUBLISHED' || article.status === 'ARCHIVED' ? article.status : 'DRAFT',
    coverImageUrl: article.coverImageUrl ?? '',
    coverImageSourceUrl: article.coverImageSourceUrl ?? '',
    coverImageLicense: article.coverImageLicense ?? '',
    sourceUrlsText: (article.sourceUrls ?? []).join('\n'),
    familyId: article.family?.id ?? '',
    productIdsText: (article.productLinks ?? []).map((link) => link.productId).join('\n'),
  };
}

function toInput(form: ArticleForm): AdminEducationArticleInput {
  return {
    slug: form.slug.trim(),
    title: form.title.trim(),
    summary: form.summary.trim(),
    body: form.body.trim(),
    articleType: form.articleType.trim() || 'BENEFITS',
    status: form.status,
    coverImageUrl: form.coverImageUrl.trim(),
    coverImageSourceUrl: form.coverImageSourceUrl.trim(),
    coverImageLicense: form.coverImageLicense.trim(),
    sourceUrls: form.sourceUrlsText.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
    familyId: form.familyId.trim(),
    productIds: form.productIdsText.split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
  };
}

export default function AdminEducationArticlesPage() {
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ArticleStatus>('ALL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setArticles(await listAdminEducationArticles());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل المقالات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const visibleArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesSearch = !query || article.title.toLowerCase().includes(query) || article.slug.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'ALL' || article.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [articles, search, statusFilter]);

  const updateField = <K extends keyof ArticleForm>(field: K, value: ArticleForm[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const startEdit = (article: EducationArticle) => {
    setEditingId(article.id);
    setForm(toForm(article));
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const input = toInput(form);
      if (!input.slug || !input.title || !input.body) {
        throw new Error('العنوان والرابط المختصر ونص المقال حقول مطلوبة');
      }
      const saved = editingId
        ? await updateAdminEducationArticle(editingId, input)
        : await createAdminEducationArticle(input);
      setArticles((previous) => editingId
        ? previous.map((article) => article.id === editingId ? saved : article)
        : [saved, ...previous]);
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حفظ المقال');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (article: EducationArticle) => {
    if (!window.confirm(`هل تريد أرشفة المقال «${article.title}»؟`)) return;
    setError(null);
    try {
      await deleteAdminEducationArticle(article.id);
      setArticles((previous) => previous.filter((item) => item.id !== article.id));
      if (editingId === article.id) cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر حذف المقال');
    }
  };

  return (
    <div className="flex flex-col gap-5" dir="rtl">
      <div>
        <h1 className="flex items-center gap-2 text-h2 font-semibold [color:var(--gs-foreground)]">
          <BookOpen className="h-6 w-6 [color:var(--gs-primary)]" aria-hidden="true" />
          إدارة مقالات مركز المعرفة
        </h1>
        <BreadcrumbEngine className="mt-1" />
        <p className="mt-2 text-sm [color:var(--gs-foreground-muted)]">
          أنشئ مقالات غذائية موثقة، أضف مصادرها، وحدد ما إذا كانت مسودة أو منشورة. لا تُستخدم هذه الشاشة لإضافة ادعاءات علاجية غير موثقة.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[color:var(--gs-border)] bg-[color:var(--gs-surface)] p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">{editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}</h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="gsd-button-secondary inline-flex items-center gap-2">
              <X className="h-4 w-4" /> إلغاء التعديل
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium">العنوان<input required value={form.title} onChange={(e) => updateField('title', e.target.value)} className="gsd-input mt-1 w-full" /></label>
          <label className="text-sm font-medium">الرابط المختصر (Slug)<input required value={form.slug} onChange={(e) => updateField('slug', e.target.value)} className="gsd-input mt-1 w-full" dir="ltr" /></label>
          <label className="text-sm font-medium">نوع المقال<input value={form.articleType} onChange={(e) => updateField('articleType', e.target.value)} className="gsd-input mt-1 w-full" /></label>
          <label className="text-sm font-medium">الحالة<select value={form.status} onChange={(e) => updateField('status', e.target.value as ArticleStatus)} className="gsd-input mt-1 w-full"><option value="DRAFT">مسودة</option><option value="PUBLISHED">منشور</option><option value="ARCHIVED">مؤرشف</option></select></label>
          <label className="text-sm font-medium md:col-span-2">الملخص<textarea value={form.summary} onChange={(e) => updateField('summary', e.target.value)} className="gsd-input mt-1 min-h-20 w-full" /></label>
          <label className="text-sm font-medium md:col-span-2">نص المقال<textarea required value={form.body} onChange={(e) => updateField('body', e.target.value)} className="gsd-input mt-1 min-h-48 w-full" /></label>
          <label className="text-sm font-medium">رابط صورة الغلاف<input value={form.coverImageUrl} onChange={(e) => updateField('coverImageUrl', e.target.value)} className="gsd-input mt-1 w-full" dir="ltr" /></label>
          <label className="text-sm font-medium">مصدر صورة الغلاف<input value={form.coverImageSourceUrl} onChange={(e) => updateField('coverImageSourceUrl', e.target.value)} className="gsd-input mt-1 w-full" dir="ltr" /></label>
          <label className="text-sm font-medium">ترخيص الصورة<input value={form.coverImageLicense} onChange={(e) => updateField('coverImageLicense', e.target.value)} className="gsd-input mt-1 w-full" /></label>
          <label className="text-sm font-medium">معرّف عائلة المنتج<input value={form.familyId} onChange={(e) => updateField('familyId', e.target.value)} className="gsd-input mt-1 w-full" dir="ltr" /></label>
          <label className="text-sm font-medium md:col-span-2">مصادر المقال (رابط في كل سطر)<textarea value={form.sourceUrlsText} onChange={(e) => updateField('sourceUrlsText', e.target.value)} className="gsd-input mt-1 min-h-24 w-full" dir="ltr" /></label>
          <label className="text-sm font-medium md:col-span-2">معرّفات المنتجات المرتبطة (معرّف في كل سطر)<textarea value={form.productIdsText} onChange={(e) => updateField('productIdsText', e.target.value)} className="gsd-input mt-1 min-h-20 w-full" dir="ltr" /></label>
        </div>
        <button type="submit" disabled={saving} className="gsd-button-primary mt-5 inline-flex items-center gap-2 disabled:opacity-60">
          {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {saving ? 'جارٍ الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة المقال'}
        </button>
      </form>

      <section className="rounded-2xl border border-[color:var(--gs-border)] bg-[color:var(--gs-surface)] p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold [color:var(--gs-foreground)]">المقالات الحالية ({visibleArticles.length})</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالعنوان أو الرابط" className="gsd-input" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | ArticleStatus)} className="gsd-input"><option value="ALL">كل الحالات</option><option value="DRAFT">مسودة</option><option value="PUBLISHED">منشور</option><option value="ARCHIVED">مؤرشف</option></select>
            <button type="button" onClick={startCreate} className="gsd-button-secondary inline-flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> جديد</button>
          </div>
        </div>
        {loading ? <p className="py-10 text-center text-sm [color:var(--gs-foreground-muted)]">جارٍ تحميل المقالات...</p> : visibleArticles.length === 0 ? <p className="py-10 text-center text-sm [color:var(--gs-foreground-muted)]">لا توجد مقالات مطابقة.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-right text-sm">
              <thead><tr className="border-b border-[color:var(--gs-border)] text-xs [color:var(--gs-foreground-muted)]"><th className="p-3">العنوان</th><th className="p-3">Slug</th><th className="p-3">الحالة</th><th className="p-3">آخر تحديث</th><th className="p-3">إجراءات</th></tr></thead>
              <tbody>{visibleArticles.map((article) => <tr key={article.id} className="border-b border-[color:var(--gs-border)] last:border-0"><td className="p-3 font-medium">{article.title}</td><td className="p-3" dir="ltr">{article.slug}</td><td className="p-3">{article.status === 'PUBLISHED' ? 'منشور' : article.status === 'ARCHIVED' ? 'مؤرشف' : 'مسودة'}</td><td className="p-3">{article.updatedAt ? new Date(article.updatedAt).toLocaleDateString('ar-YE') : '—'}</td><td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => startEdit(article)} className="gsd-button-secondary inline-flex items-center gap-1"><Edit3 className="h-4 w-4" /> تعديل</button><button type="button" onClick={() => void handleDelete(article)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /> أرشفة</button></div></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
