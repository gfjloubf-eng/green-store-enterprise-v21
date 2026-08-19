import { useState, useEffect } from 'react';
import { HelpCircle, PhoneCall, Mail, MapPin, Plus, MessageSquare, Send } from 'lucide-react';
import { getSupportContacts, getTickets, createSupportTicket, replySupportTicket, updateTicketStatus } from '@/services/supportClient';
import type { SupportContacts, SupportTicket } from '@/services/supportClient';
import { useAuth } from '@/hooks/useAuth';
import { SupportTeamCards } from '@/components/support/SupportTeamCards';
import { FAQSection } from '@/components/support/FAQSection';

export function SupportCenterPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<SupportContacts | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);

  // New Ticket Form State
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  // Reply Form State
  const [replyMsg, setReplyMsg] = useState('');
  const [replying, setReplying] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const isStaffOrAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'EMPLOYEE';

  useEffect(() => {
    let mounted = true;

    async function loadSupportData() {
      // 1. Fetch support contacts (or use fallback)
      try {
        const cRes = await getSupportContacts().catch(() => ({
          supportPhone: '712275038',
          contactEmail: 'ggjloubf@gmail.com',
          address: 'اليمن، صنعاء، شارع هائل',
        }));
        if (mounted && cRes) setContacts(cRes);
      } catch {
        if (mounted) {
          setContacts({
            supportPhone: '712275038',
            contactEmail: 'ggjloubf@gmail.com',
            address: 'اليمن، صنعاء، شارع هائل',
          });
        }
      }

      // 2. Fetch user support tickets if logged in
      if (user) {
        try {
          const tRes = await getTickets().catch(() => []);
          if (mounted) setTickets(tRes || []);
        } catch {
          if (mounted) setTickets([]);
        }
      } else {
        if (mounted) setTickets([]);
      }

      if (mounted) setLoading(false);
    }

    loadSupportData();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const newTicket = await createSupportTicket({ subject, description, priority });
      setTickets((prev) => [newTicket, ...prev]);
      setIsCreating(false);
      setSubject('');
      setDescription('');
      setSelectedTicket(newTicket);
    } catch (err: any) {
      setError(err?.message || 'فشل تقديم تذكرة الدعم الفني');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMsg.trim()) return;
    setReplying(true);
    try {
      const updated = await replySupportTicket(selectedTicket.id, replyMsg);
      setSelectedTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setReplyMsg('');
    } catch (err: any) {
      setError(err?.message || 'فشل إرسال الرد');
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    if (!selectedTicket) return;
    try {
      const updated = await updateTicketStatus(selectedTicket.id, newStatus);
      setSelectedTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err: any) {
      setError(err?.message || 'فشل تحديث حالة التذكرة');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3" dir="rtl">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent" />
        <span className="text-sm font-medium text-[var(--gs-foreground-secondary)]">جاري تحميل مركز الدعم الفني والخدمات...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold [color:var(--gs-foreground)] flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-emerald-600" />
            مركز الدعم الفني والمساعدة (Support Center)
          </h1>
          <p className="text-xs text-[var(--gs-foreground-secondary)] mt-1">
            تقديم ومتابعة تذاكر الدعم والتواصل المباشر مع فريق عمل المتجر.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="gsd-btn gsd-btn--primary gsd-btn--md rounded-2xl px-5 py-2.5 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          تذكرة دعم جديدة
        </button>
      </div>

      {/* Support Team Cards */}
      <SupportTeamCards onOpenTicket={() => setIsCreating(true)} />

      {/* Support Contacts Cards (Dynamic from Settings) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">هاتف الدعم الموحد</span>
            <strong className="text-xs text-[var(--gs-foreground)] font-mono">{contacts?.supportPhone || '712275038'}</strong>
          </div>
        </div>

        <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">البريد الإلكتروني</span>
            <strong className="text-xs text-[var(--gs-foreground)] font-mono">{contacts?.contactEmail || 'ggjloubf@gmail.com'}</strong>
          </div>
        </div>

        <div className="gsd-card rounded-2xl p-4 border border-[var(--gs-border)] bg-[var(--gs-surface)] flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--gs-foreground-secondary)] block">المركز الرئيسي</span>
            <strong className="text-xs text-[var(--gs-foreground)] truncate block">{contacts?.address || 'اليمن، صنعاء، شارع هائل'}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600">
          {error}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tickets List */}
        <div className="lg:col-span-1 border border-[var(--gs-border)] bg-[var(--gs-surface)] rounded-3xl p-4 space-y-3">
          <h2 className="font-bold text-xs text-[var(--gs-foreground)] border-b border-[var(--gs-border)] pb-3">
            تذاكر الدعم ({tickets.length})
          </h2>

          {tickets.length === 0 ? (
            <p className="text-xs text-[var(--gs-foreground-secondary)] text-center py-6">لا توجد تذاكر دعم حالياً</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                    selectedTicket?.id === ticket.id
                      ? 'border-emerald-500 bg-emerald-500/5'
                      : 'border-[var(--gs-border)] hover:bg-[var(--gs-muted)] bg-[var(--gs-background)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold font-mono text-emerald-600">{ticket.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      ticket.status === 'OPEN' ? 'bg-amber-500/10 text-amber-600' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-600' :
                      ticket.status === 'WAITING_FOR_CUSTOMER' ? 'bg-purple-500/10 text-purple-600' :
                      'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <strong className="block text-[var(--gs-foreground)] line-clamp-1">{ticket.subject}</strong>
                  <div className="flex items-center justify-between text-[10px] text-[var(--gs-foreground-secondary)] mt-2">
                    <span>{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
                    <span className="font-semibold">{ticket.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Ticket Thread View */}
        <div className="lg:col-span-2 border border-[var(--gs-border)] bg-[var(--gs-surface)] rounded-3xl p-6 flex flex-col min-h-[50vh]">
          {selectedTicket ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Ticket Top bar */}
              <div className="border-b border-[var(--gs-border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-emerald-600">{selectedTicket.ticketNumber}</span>
                    <h2 className="text-sm font-bold text-[var(--gs-foreground)]">{selectedTicket.subject}</h2>
                  </div>
                  <span className="text-[11px] text-[var(--gs-foreground-secondary)]">
                    العميل: {selectedTicket.customerName} ({selectedTicket.customerEmail})
                  </span>
                </div>

                {isStaffOrAdmin && (
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-[var(--gs-border)] bg-[var(--gs-background)] font-bold text-emerald-600"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="WAITING_FOR_CUSTOMER">WAITING_FOR_CUSTOMER</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                )}
              </div>

              {/* Initial Description */}
              <div className="p-4 rounded-2xl bg-[var(--gs-background)] border border-[var(--gs-border)] text-xs text-[var(--gs-foreground)]">
                <strong className="block text-[11px] text-[var(--gs-foreground-secondary)] mb-1">تفاصيل المشكلة / الطلب الأول:</strong>
                <p className="whitespace-pre-line">{selectedTicket.description}</p>
              </div>

              {/* Replies Thread */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[40vh] my-2 pr-1">
                {selectedTicket.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      reply.senderRole === 'CUSTOMER'
                        ? 'bg-emerald-500/5 border border-emerald-500/20 mr-4'
                        : 'bg-blue-500/5 border border-blue-500/20 ml-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <strong className="font-bold text-[var(--gs-foreground)]">{reply.senderName} ({reply.senderRole})</strong>
                      <span className="text-[var(--gs-foreground-secondary)]">{new Date(reply.createdAt).toLocaleTimeString('ar-SA')}</span>
                    </div>
                    <p className="text-[var(--gs-foreground)] whitespace-pre-line">{reply.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendReply} className="border-t border-[var(--gs-border)] pt-4 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="اكتب ردك هنا..."
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                  className="flex-1 p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)] text-xs"
                />
                <button
                  type="submit"
                  disabled={replying}
                  className="gsd-btn gsd-btn--primary rounded-2xl px-5 text-xs font-semibold flex items-center gap-2 shrink-0"
                >
                  {replying ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full my-auto text-center p-8 gap-2">
              <MessageSquare className="h-10 w-10 text-[var(--gs-foreground-secondary)] opacity-40" />
              <span className="text-xs text-[var(--gs-foreground-secondary)] font-medium">اختر تذكرة دعم من القائمة لعرض المحادثة والردود</span>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--gs-surface)] border border-[var(--gs-border)] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-xl" dir="rtl">
            <h2 className="text-base font-bold text-[var(--gs-foreground)] flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600" />
              تقديم تذكرة دعم جديدة
            </h2>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[var(--gs-foreground)] block">عنوان التذكرة / الموضوع *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: استفسار حول حالة الشحنة"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--gs-foreground)] block">الأولوية</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
                >
                  <option value="LOW">منخفضة (Low)</option>
                  <option value="MEDIUM">متوسطة (Medium)</option>
                  <option value="HIGH">مرتفعة (High)</option>
                  <option value="URGENT">عاجلة (Urgent)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--gs-foreground)] block">تفاصيل المشكلة *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب كامل التفاصيل والطلب..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-[var(--gs-border)] bg-[var(--gs-background)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[var(--gs-border)] pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-2xl border border-[var(--gs-border)] text-[var(--gs-foreground-secondary)] hover:bg-[var(--gs-muted)]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="gsd-btn gsd-btn--primary px-5 py-2 rounded-2xl font-semibold flex items-center gap-2"
                >
                  {submitting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : 'تقديم التذكرة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <FAQSection className="mt-4" />
    </div>
  );
}

export default SupportCenterPage;
