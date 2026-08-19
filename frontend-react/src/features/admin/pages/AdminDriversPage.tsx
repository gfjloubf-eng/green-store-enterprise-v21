import { useCallback, useEffect, useState } from 'react';
import { Check, Edit3, Loader2, Phone, Plus, RefreshCw, Search, Trash2, Truck, Users, X } from 'lucide-react';
import { createDeliveryDriver, deleteDeliveryDriver, getDeliveryDrivers, updateDeliveryDriver, type DeliveryDriver } from '@/services/deliveryClient';

const EMPTY_FORM = { name: '', phone: '', vehicleInfo: '' };

type DriverForm = typeof EMPTY_FORM;

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<DeliveryDriver[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [form, setForm] = useState<DriverForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDeliveryDrivers({ search: query, limit: 100 });
      setDrivers(result.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل الموصلين');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDrivers(), query ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadDrivers, query]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (driver: DeliveryDriver) => {
    setEditingId(driver.id);
    setForm({ name: driver.name, phone: driver.phone ?? '', vehicleInfo: driver.vehicleInfo ?? '' });
    setShowForm(true);
  };

  const closeForm = () => {
    if (workingId === 'form') return;
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const saveDriver = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    setWorkingId('form');
    setError(null);
    try {
      if (editingId) await updateDeliveryDriver(editingId, form);
      else await createDeliveryDriver(form);
      closeForm();
      await loadDrivers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ بيانات الموصل');
    } finally {
      setWorkingId(null);
    }
  };

  const removeDriver = async (driver: DeliveryDriver) => {
    if (!window.confirm(`هل تريد حذف الموصل «${driver.name}»؟`)) return;
    setWorkingId(driver.id);
    setError(null);
    try {
      await deleteDeliveryDriver(driver.id);
      setDrivers((current) => current.filter((entry) => entry.id !== driver.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'تعذر حذف الموصل');
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold text-emerald-700">التوصيل والعمليات</p>
          <h1 className="mt-2 text-3xl font-black [color:var(--gs-foreground)]">إدارة الموصلين</h1>
          <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">ملف موحد لفريق التوصيل مع عدد المهام المسجلة لكل موصل.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void loadDrivers()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-4 py-2.5 text-sm font-bold [color:var(--gs-foreground)]"><RefreshCw className="h-4 w-4" /> تحديث</button>
          <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"><Plus className="h-4 w-4" /> إضافة موصل</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Users} label="إجمالي الموصلين" value={String(drivers.length)} />
        <Stat icon={Truck} label="إجمالي عمليات التوصيل" value={String(drivers.reduce((sum, driver) => sum + driver.deliveriesCount, 0))} />
        <Stat icon={Phone} label="بها رقم هاتف" value={String(drivers.filter((driver) => driver.phone).length)} />
      </div>

      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      <section className="overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm">
        <div className="border-b border-[var(--gs-border)] p-4 sm:p-5">
          <label className="relative block">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 [color:var(--gs-foreground-secondary)]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث بالاسم أو الهاتف أو المركبة..." className="w-full rounded-xl border border-[var(--gs-border)] bg-transparent py-3 pr-10 pl-4 text-sm outline-none transition focus:border-emerald-500" />
          </label>
        </div>
        {loading ? <Loading /> : drivers.length === 0 ? <div className="p-12 text-center text-sm [color:var(--gs-foreground-secondary)]">لا يوجد موصلون مسجلون حتى الآن.</div> : <div className="divide-y divide-[var(--gs-border)]">{drivers.map((driver) => <DriverRow key={driver.id} driver={driver} working={workingId === driver.id} onEdit={() => openEdit(driver)} onDelete={() => void removeDriver(driver)} />)}</div>}
      </section>

      {showForm && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={editingId ? 'تعديل موصل' : 'إضافة موصل'}>
        <form onSubmit={saveDriver} className="w-full max-w-lg rounded-t-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-5 shadow-2xl sm:rounded-3xl sm:p-6">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold text-emerald-700">فريق التوصيل</p><h2 className="mt-1 text-xl font-black [color:var(--gs-foreground)]">{editingId ? 'تعديل بيانات الموصل' : 'إضافة موصل جديد'}</h2></div><button type="button" onClick={closeForm} className="rounded-xl p-2 [color:var(--gs-foreground-secondary)] hover:bg-emerald-500/10" aria-label="إغلاق"><X className="h-5 w-5" /></button></div>
          <div className="mt-6 space-y-4"><Field label="اسم الموصل" value={form.name} required onChange={(value) => setForm((current) => ({ ...current, name: value }))} /><Field label="رقم الهاتف" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} /><Field label="المركبة أو وسيلة التوصيل" value={form.vehicleInfo} onChange={(value) => setForm((current) => ({ ...current, vehicleInfo: value }))} /></div>
          <div className="mt-6 flex gap-3"><button type="submit" disabled={workingId === 'form' || !form.name.trim()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{workingId === 'form' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} حفظ</button><button type="button" onClick={closeForm} disabled={workingId === 'form'} className="rounded-xl border border-[var(--gs-border)] px-4 py-3 text-sm font-bold [color:var(--gs-foreground)]">إلغاء</button></div>
        </form>
      </div>}
    </div>
  );
}

function DriverRow({ driver, working, onEdit, onDelete }: { driver: DeliveryDriver; working: boolean; onEdit: () => void; onDelete: () => void }) {
  return <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700"><Truck className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate font-bold [color:var(--gs-foreground)]">{driver.name}</p><div className="mt-1 flex flex-wrap gap-3 text-xs [color:var(--gs-foreground-secondary)]">{driver.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{driver.phone}</span>}<span>{driver.vehicleInfo || 'لم تحدد المركبة'}</span></div></div><div className="text-sm sm:text-left"><p className="font-bold text-emerald-700">{driver.deliveriesCount}</p><p className="text-xs [color:var(--gs-foreground-secondary)]">عملية توصيل</p></div><div className="flex gap-2"><button type="button" onClick={onEdit} disabled={working} className="inline-flex items-center gap-1 rounded-lg border border-[var(--gs-border)] px-3 py-2 text-xs font-bold [color:var(--gs-foreground)]"><Edit3 className="h-3.5 w-3.5" /> تعديل</button><button type="button" onClick={onDelete} disabled={working} className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">{working ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} حذف</button></div></div>;
}

function Field({ label, value, required, onChange }: { label: string; value: string; required?: boolean; onChange: (value: string) => void }) {
  return <label className="block text-sm font-bold [color:var(--gs-foreground)]">{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--gs-border)] bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500" /></label>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return <div className="rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold [color:var(--gs-foreground-secondary)]">{label}</span><Icon className="h-4 w-4 text-emerald-700" /></div><p className="mt-3 text-xl font-black [color:var(--gs-foreground)]">{value}</p></div>;
}

function Loading() {
  return <div className="flex items-center justify-center gap-3 p-12 text-sm font-bold [color:var(--gs-foreground-secondary)]"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" />جارٍ تحميل الموصلين...</div>;
}
