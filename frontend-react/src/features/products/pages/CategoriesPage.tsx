import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { BreadcrumbEngine } from '@/components/layout/BreadcrumbEngine';
import { fetchWithAuth, parseJsonSafe } from '@/services/authClient';

interface Category { id: string; name: string; slug: string; _count?: { products?: number; children?: number } }
export function CategoriesPage() {
  const { t } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const load = async () => { setLoading(true); try { const res = await fetchWithAuth('/categories'); const payload = await parseJsonSafe(res); if (!res.ok) throw new Error(payload?.error?.message || 'تعذر تحميل التصنيفات'); setCategories(Array.isArray(payload?.data) ? payload.data : []); } catch (e: any) { setError(e?.message || 'تعذر تحميل التصنيفات'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const reset = () => { setName(''); setSlug(''); setEditingId(null); };
  const save = async () => { setError(''); if (!name.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) { setError('اكتب الاسم وSlug إنجليزي صحيحاً مثل fruits'); return; } setSaving(true); try { const res = await fetchWithAuth(editingId ? `/categories/${editingId}` : '/categories', { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), slug: slug.trim() }) }); const payload = await parseJsonSafe(res); if (!res.ok) throw new Error(payload?.error?.message || 'تعذر حفظ التصنيف'); reset(); await load(); } catch (e: any) { setError(e?.message || 'تعذر حفظ التصنيف'); } finally { setSaving(false); } };
  const remove = async (id: string) => { if (!window.confirm('حذف التصنيف؟ يجب ألا يحتوي على منتجات.')) return; try { const res = await fetchWithAuth(`/categories/${id}`, { method: 'DELETE' }); const payload = await parseJsonSafe(res); if (!res.ok) throw new Error(payload?.error?.message || 'تعذر حذف التصنيف'); await load(); } catch (e: any) { setError(e?.message || 'تعذر حذف التصنيف'); } };
  return <div className="flex flex-col gap-4" dir="rtl"><div><h1 className="text-h2 flex items-center gap-2 font-semibold [color:var(--gs-foreground)]"><Tags className="h-6 w-6 [color:var(--gs-primary)]" />{t('products.categories')}</h1><BreadcrumbEngine className="mt-1" /><p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">إدارة التصنيفات الحقيقية المرتبطة بالمنتجات.</p></div>
    <div className="gsd-card grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto_auto]"><input value={name} onChange={e => { setName(e.target.value); if (!editingId) setSlug(e.target.value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); }} placeholder="اسم التصنيف بالعربية" className="gsd-input rounded-xl p-3" /><input value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug مثل fruits" className="gsd-input rounded-xl p-3" /><button onClick={() => void save()} disabled={saving} className="gsd-btn gsd-btn--primary inline-flex items-center justify-center gap-2 rounded-xl px-4">{editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'جارٍ الحفظ' : editingId ? 'تحديث' : 'إضافة'}</button>{editingId && <button onClick={reset} className="gsd-btn gsd-btn--secondary rounded-xl px-4">إلغاء</button>}</div>
    {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="gsd-card p-8 text-center">جارٍ تحميل التصنيفات...</div> : categories.length === 0 ? <div className="gsd-card p-8 text-center">لا توجد تصنيفات بعد. أضف أول تصنيف من النموذج أعلاه.</div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(c => <div key={c.id} className="gsd-card flex min-h-[150px] flex-col justify-between p-5"><div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-2xl [background:var(--gs-muted)] [color:var(--gs-primary)]"><Tags className="h-6 w-6" /></div><div className="flex gap-2"><button onClick={() => { setEditingId(c.id); setName(c.name); setSlug(c.slug); }} className="rounded-lg p-2" aria-label="تعديل"><Pencil className="h-4 w-4" /></button><button onClick={() => void remove(c.id)} className="rounded-lg p-2 text-red-600" aria-label="حذف"><Trash2 className="h-4 w-4" /></button></div></div><div><h2 className="text-lg font-bold [color:var(--gs-foreground)]">{c.name}</h2><p className="text-xs [color:var(--gs-foreground-secondary)]">{c._count?.products ?? 0} منتج · {c.slug}</p><Link to={`/products?category=${encodeURIComponent(c.id)}`} className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700">فتح المنتجات <ArrowLeft className="h-3 w-3" /></Link></div></div>)}</div>}
  </div>;
}
export default CategoriesPage;
