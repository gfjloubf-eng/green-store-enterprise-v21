import { useCallback, useEffect, useState } from 'react';
import { Building2, Check, Edit3, Loader2, Plus, RefreshCw, Search, ShoppingCart, Trash2, Users, X } from 'lucide-react';
import { createAdminSupplier, deleteAdminSupplier, getAdminSuppliers, updateAdminSupplier, type AdminSupplier } from '@/services/supplierAdminClient';

const EMPTY_FORM = { name: '', code: '' };
type SupplierForm = typeof EMPTY_FORM;

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<AdminSupplier[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SupplierForm>(EMPTY_FORM);

  const loadSuppliers = useCallback(async () => {
    setLoading(true); setError(null);
    try { const result = await getAdminSuppliers({ search: query }); setSuppliers(result.items); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الموردين'); }
    finally { setLoading(false); }
  }, [query]);

  useEffect(() => { const timer = window.setTimeout(() => void loadSuppliers(), query ? 250 : 0); return () => window.clearTimeout(timer); }, [loadSuppliers, query]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (supplier: AdminSupplier) => { setEditingId(supplier.id); setForm({ name: supplier.name, code: supplier.code ?? '' }); setShowForm(true); };
  const closeForm = () => { if (workingId === 'form') return; setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); };

  const saveSupplier = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!form.name.trim()) return; setWorkingId('form'); setError(null);
    try { if (editingId) await updateAdminSupplier(editingId, form); else await createAdminSupplier(form); closeForm(); await loadSuppliers(); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ المورد'); }
    finally { setWorkingId(null); }
  };

  const removeSupplier = async (supplier: AdminSupplier) => {
    if (!window.confirm(`هل تريد حذف المورد «${supplier.name}»؟`)) return;
    setWorkingId(supplier.id); setError(null);
    try { await deleteAdminSupplier(supplier.id); setSuppliers((current) => current.filter((entry) => entry.id !== supplier.id)); }
    catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف المورد'); }
    finally { setWorkingId(null); }
  };

  const orders = suppliers.reduce((sum, supplier) => sum + supplier.purchaseOrdersCount, 0);
  return <div className="space-y-6 pb-10" dir="rtl">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold text-emerald-700">التوريد والمشتريات</p><h1 className="mt-2 text-3xl font-black [color:var(--gs-foreground)]">إدارة الموردين</h1><p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">ملفات الموردين المرتبطة بجهات الاتصال وأوامر الشراء.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void loadSuppliers()} className="inline-flex items-center gap-2 rounded-xl border border-[var(--gs-border)] px-4 py-2.5 text-sm font-bold [color:var(--gs-foreground)]"><RefreshCw className="h-4 w-4" /> تحديث</button><button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" /> إضافة مورد</button></div></div>
    <div className="grid gap-4 sm:grid-cols-3"><Stat icon={Building2} label="إجمالي الموردين" value={String(suppliers.length)} /><Stat icon={Users} label="جهات الاتصال" value={String(suppliers.reduce((sum, supplier) => sum + supplier.contactsCount, 0))} /><Stat icon={ShoppingCart} label="أوامر الشراء" value={String(orders)} /></div>
    {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}
    <section className="overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm"><div className="border-b border-[var(--gs-border)] p-4 sm:p-5"><label className="relative block"><Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 [color:var(--gs-foreground-secondary)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم المورد أو الرمز..." className="w-full rounded-xl border border-[var(--gs-border)] bg-transparent py-3 pr-10 pl-4 text-sm outline-none focus:border-emerald-500" /></label></div>{loading ? <Loading /> : suppliers.length === 0 ? <div className="p-12 text-center text-sm [color:var(--gs-foreground-secondary)]">لا يوجد موردون مسجلون حتى الآن.</div> : <div className="divide-y divide-[var(--gs-border)]">{suppliers.map((supplier) => <SupplierRow key={supplier.id} supplier={supplier} working={workingId === supplier.id} onEdit={() => openEdit(supplier)} onDelete={() => void removeSupplier(supplier)} />)}</div>}</section>
    {showForm && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4"><form onSubmit={saveSupplier} className="w-full max-w-lg rounded-t-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 shadow-2xl sm:rounded-3xl sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-emerald-700">التوريد</p><h2 className="mt-1 text-xl font-black [color:var(--gs-foreground)]">{editingId ? 'تعديل المورد' : 'إضافة مورد جديد'}</h2></div><button type="button" onClick={closeForm} className="rounded-xl p-2 [color:var(--gs-foreground-secondary)]"><X className="h-5 w-5" /></button></div><div className="mt-6 space-y-4"><Field label="اسم المورد" value={form.name} required onChange={(value) => setForm((current) => ({ ...current, name: value }))} /><Field label="رمز المورد (اختياري)" value={form.code} onChange={(value) => setForm((current) => ({ ...current, code: value }))} /></div><div className="mt-6 flex gap-3"><button type="submit" disabled={workingId === 'form' || !form.name.trim()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{workingId === 'form' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} حفظ</button><button type="button" onClick={closeForm} disabled={workingId === 'form'} className="rounded-xl border border-[var(--gs-border)] px-4 py-3 text-sm font-bold [color:var(--gs-foreground)]">إلغاء</button></div></form></div>}
  </div>;
}

function SupplierRow({ supplier, working, onEdit, onDelete }: { supplier: AdminSupplier; working: boolean; onEdit: () => void; onDelete: () => void }) { return <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700"><Building2 className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate font-bold [color:var(--gs-foreground)]">{supplier.name}</p><p className="mt-1 text-xs [color:var(--gs-foreground-secondary)]">{supplier.code || 'بدون رمز'} · {supplier.contactsCount} جهات اتصال · {supplier.addressesCount} عناوين</p></div><div className="text-sm sm:text-left"><p className="font-bold text-emerald-700">{supplier.purchaseOrdersCount}</p><p className="text-xs [color:var(--gs-foreground-secondary)]">أوامر شراء</p></div><div className="flex gap-2"><button type="button" onClick={onEdit} disabled={working} className="inline-flex items-center gap-1 rounded-lg border border-[var(--gs-border)] px-3 py-2 text-xs font-bold [color:var(--gs-foreground)]"><Edit3 className="h-3.5 w-3.5" /> تعديل</button><button type="button" onClick={onDelete} disabled={working} className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">{working ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} حذف</button></div></div>; }
function Field({ label, value, required, onChange }: { label: string; value: string; required?: boolean; onChange: (value: string) => void }) { return <label className="block text-sm font-bold [color:var(--gs-foreground)]">{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--gs-border)] bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>; }
function Stat({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) { return <div className="rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold [color:var(--gs-foreground-secondary)]">{label}</span><Icon className="h-4 w-4 text-emerald-700" /></div><p className="mt-3 text-xl font-black [color:var(--gs-foreground)]">{value}</p></div>; }
function Loading() { return <div className="flex items-center justify-center gap-3 p-12 text-sm font-bold [color:var(--gs-foreground-secondary)]"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" />جارٍ تحميل الموردين...</div>; }
