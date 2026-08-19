import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, Clock3, Inbox, Loader2, MessageCircle, RefreshCw, Send, ShieldAlert, UserRound } from 'lucide-react';
import { getTickets, replySupportTicket, updateTicketStatus, type SupportTicket } from '@/services/supportClient';

type TicketStatus = SupportTicket['status'];

const STATUS_OPTIONS: Array<{ value: TicketStatus; label: string }> = [
  { value: 'OPEN', label: 'مفتوحة' },
  { value: 'IN_PROGRESS', label: 'قيد المعالجة' },
  { value: 'WAITING_FOR_CUSTOMER', label: 'بانتظار العميل' },
  { value: 'RESOLVED', label: 'تم الحل' },
  { value: 'CLOSED', label: 'مغلقة' },
];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketStatus>('ALL');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTickets();
      setTickets(data);
      setSelectedId((current) => current && data.some((ticket) => ticket.id === current) ? current : data[0]?.id ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'تعذر تحميل تذاكر الدعم');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ticket loading is the external synchronization this effect is responsible for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTickets();
  }, [loadTickets]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? null;
  const visibleTickets = useMemo(() => statusFilter === 'ALL' ? tickets : tickets.filter((ticket) => ticket.status === statusFilter), [statusFilter, tickets]);
  const openCount = tickets.filter((ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS').length;
  const urgentCount = tickets.filter((ticket) => ticket.priority === 'URGENT' || ticket.priority === 'HIGH').length;

  const changeStatus = async (status: TicketStatus) => {
    if (!selectedTicket || status === selectedTicket.status) return;
    setWorking(true);
    setError(null);
    try {
      const updated = await updateTicketStatus(selectedTicket.id, status);
      setTickets((current) => current.map((ticket) => ticket.id === updated.id ? updated : ticket));
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'تعذر تحديث حالة التذكرة');
    } finally {
      setWorking(false);
    }
  };

  const sendReply = async () => {
    if (!selectedTicket || !reply.trim()) return;
    setWorking(true);
    setError(null);
    try {
      const updated = await replySupportTicket(selectedTicket.id, reply.trim());
      setTickets((current) => current.map((ticket) => ticket.id === updated.id ? updated : ticket));
      setReply('');
    } catch (replyError) {
      setError(replyError instanceof Error ? replyError.message : 'تعذر إرسال الرد');
    } finally {
      setWorking(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 pb-10" dir="rtl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold text-emerald-700">تشغيل الفريق</p>
          <h1 className="mt-2 text-3xl font-black [color:var(--gs-foreground)]">مركز خدمة العملاء</h1>
          <p className="mt-2 text-sm [color:var(--gs-foreground-secondary)]">تابع طلبات المساعدة، ورد على العملاء، ووحّد حالة كل تذكرة.</p>
        </div>
        <button type="button" onClick={() => void loadTickets()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-4 py-2.5 text-sm font-bold [color:var(--gs-foreground)]"><RefreshCw className="h-4 w-4" /> تحديث التذاكر</button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SupportStat icon={Inbox} label="إجمالي التذاكر" value={String(tickets.length)} />
        <SupportStat icon={Clock3} label="تحتاج إجراء" value={String(openCount)} tone="amber" />
        <SupportStat icon={ShieldAlert} label="أولوية مرتفعة" value={String(urgentCount)} tone="rose" />
      </div>

      {error && <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700">{error}</div>}

      <div className="grid min-h-[520px] overflow-hidden rounded-3xl border border-[var(--gs-border)] bg-[var(--gs-surface)] shadow-sm lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)]">
        <section className="border-b border-[var(--gs-border)] lg:border-b-0 lg:border-l">
          <div className="flex items-center gap-2 border-b border-[var(--gs-border)] p-4">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'ALL' | TicketStatus)} className="w-full rounded-xl border border-[var(--gs-border)] bg-transparent px-3 py-2.5 text-sm font-bold outline-none focus:border-emerald-500">
              <option value="ALL">كل الحالات</option>
              {STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {visibleTickets.length === 0 ? <div className="p-10 text-center text-sm [color:var(--gs-foreground-secondary)]">لا توجد تذاكر في هذه الحالة.</div> : visibleTickets.map((ticket) => <button key={ticket.id} type="button" onClick={() => setSelectedId(ticket.id)} className={`flex w-full items-start gap-3 border-b border-[var(--gs-border)] p-4 text-right transition ${selectedId === ticket.id ? 'bg-emerald-500/[0.08]' : 'hover:bg-emerald-500/[0.04]'}`}><div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700"><MessageCircle className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="truncate text-xs font-black text-emerald-700">{ticket.ticketNumber}</span><PriorityBadge priority={ticket.priority} /></div><p className="mt-1 truncate text-sm font-bold [color:var(--gs-foreground)]">{ticket.subject}</p><p className="mt-1 truncate text-xs [color:var(--gs-foreground-secondary)]">{ticket.customerName || 'عميل المتجر'}</p></div><ChevronLeft className="mt-2 h-4 w-4 shrink-0 [color:var(--gs-foreground-secondary)]" /></button>)}</div>
        </section>

        <section className="flex min-h-[520px] flex-col">
          {!selectedTicket ? <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center [color:var(--gs-foreground-secondary)]"><MessageCircle className="h-10 w-10 text-emerald-700/60" /><p className="font-bold">اختر تذكرة لعرض تفاصيلها</p></div> : <>
            <div className="border-b border-[var(--gs-border)] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><span className="text-xs font-black text-emerald-700">{selectedTicket.ticketNumber}</span><h2 className="mt-1 text-xl font-black [color:var(--gs-foreground)]">{selectedTicket.subject}</h2><p className="mt-2 inline-flex items-center gap-1 text-xs [color:var(--gs-foreground-secondary)]"><UserRound className="h-3.5 w-3.5" />{selectedTicket.customerName || 'عميل المتجر'}{selectedTicket.customerEmail ? ` • ${selectedTicket.customerEmail}` : ''}</p></div><select disabled={working} value={selectedTicket.status} onChange={(event) => void changeStatus(event.target.value as TicketStatus)} className="rounded-xl border border-[var(--gs-border)] bg-transparent px-3 py-2 text-sm font-bold outline-none focus:border-emerald-500">{STATUS_OPTIONS.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="rounded-2xl bg-[var(--gs-background)] p-4"><p className="whitespace-pre-wrap text-sm leading-7 [color:var(--gs-foreground)]">{selectedTicket.description}</p><p className="mt-3 text-[11px] [color:var(--gs-foreground-secondary)]">{formatDate(selectedTicket.createdAt)}</p></div>
              {selectedTicket.replies.map((item) => <div key={item.id} className={`max-w-[90%] rounded-2xl p-4 ${item.senderRole === 'CUSTOMER' ? 'bg-emerald-500/10' : 'mr-auto bg-blue-500/10'}`}><div className="flex items-center justify-between gap-3"><span className="text-xs font-black [color:var(--gs-foreground)]">{item.senderName}</span><span className="text-[11px] [color:var(--gs-foreground-secondary)]">{formatDate(item.createdAt)}</span></div><p className="mt-2 whitespace-pre-wrap text-sm leading-7 [color:var(--gs-foreground)]">{item.message}</p></div>)}
            </div>
            <div className="border-t border-[var(--gs-border)] p-4"><div className="flex gap-2"><textarea value={reply} onChange={(event) => setReply(event.target.value)} disabled={working} rows={2} placeholder="اكتب ردًا مهنيًا للعميل..." className="min-w-0 flex-1 resize-none rounded-xl border border-[var(--gs-border)] bg-transparent px-3 py-2.5 text-sm outline-none focus:border-emerald-500" /><button type="button" onClick={() => void sendReply()} disabled={working || !reply.trim()} className="inline-flex shrink-0 items-center justify-center gap-2 self-end rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /> إرسال</button></div></div>
          </>}
        </section>
      </div>
    </div>
  );
}

function SupportStat({ icon: Icon, label, value, tone = 'green' }: { icon: typeof Inbox; label: string; value: string; tone?: 'green' | 'amber' | 'rose' }) {
  const colors = { green: 'text-emerald-700 bg-emerald-500/10', amber: 'text-amber-700 bg-amber-500/10', rose: 'text-rose-700 bg-rose-500/10' };
  return <div className="rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold [color:var(--gs-foreground-secondary)]">{label}</span><span className={`rounded-xl p-2 ${colors[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-black [color:var(--gs-foreground)]">{value}</p></div>;
}

function PriorityBadge({ priority }: { priority: SupportTicket['priority'] }) {
  const labels = { LOW: 'منخفضة', MEDIUM: 'متوسطة', HIGH: 'مرتفعة', URGENT: 'عاجلة' };
  const colors = priority === 'URGENT' ? 'bg-rose-500/10 text-rose-700' : priority === 'HIGH' ? 'bg-amber-500/10 text-amber-700' : 'bg-slate-500/10 text-slate-600';
  return <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${colors}`}>{labels[priority]}</span>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ar-YE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function PageLoader() {
  return <div className="flex min-h-[45vh] items-center justify-center" dir="rtl"><div className="flex items-center gap-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-surface)] px-5 py-4 text-sm font-bold [color:var(--gs-foreground-secondary)]"><Loader2 className="h-5 w-5 animate-spin text-emerald-700" />جارٍ تحميل مركز خدمة العملاء...</div></div>;
}
