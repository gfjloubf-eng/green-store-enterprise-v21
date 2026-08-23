import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, ShieldCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendAssistantMessage, type AssistantMessage } from '@/services/assistantClient';

type Props = { open: boolean; onClose: () => void };

const quickPrompts = ['ما المنتجات المتوفرة؟', 'كيف أعرف سعر الفاكهة؟', 'أين أجد الإرشادات؟'];

export function AssistantChat({ open, onClose }: Props) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { role: 'assistant', content: 'مرحباً بك في قطوف الطبيعة. اسألني عن المنتجات أو الأسعار أو التوفر أو أقسام الموقع.' },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (event?: FormEvent, value?: string) => {
    event?.preventDefault();
    const text = (value ?? draft).trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setDraft('');
    setLoading(true);
    try {
      const result = await sendAssistantMessage(text, next);
      setMessages((current) => [...current, { role: 'assistant', content: result.reply }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: 'تعذر الاتصال بالمساعد الآن. يمكنك متابعة التسوق أو التواصل مع خدمة العملاء.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[min(27rem,calc(100vw-2rem))]" dir="rtl">
      <section className="pointer-events-auto flex h-[min(42rem,100dvh)] flex-col border [background:var(--gs-surface)] [border-color:var(--gs-border)] shadow-2xl sm:h-[min(42rem,calc(100dvh-2.5rem))] sm:rounded-3xl" aria-label="مساعد قطوف الذكي">
        <header className="flex items-center justify-between gap-3 border-b px-4 py-3 [border-color:var(--gs-border)] [background:var(--gs-primary-soft)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white"><Bot className="h-5 w-5" /></span>
            <div><h2 className="text-sm font-bold [color:var(--gs-foreground)]">مساعد قطوف الذكي</h2><p className="text-[11px] [color:var(--gs-foreground-secondary)]">معلومات المتجر والمنتجات بالعربية</p></div>
          </div>
          <button type="button" onClick={onClose} className="flex min-h-10 min-w-10 items-center justify-center rounded-xl [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)]" aria-label="إغلاق المساعد"><X className="h-5 w-5" /></button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
          <div className="flex items-start gap-2 text-[11px] leading-5 [color:var(--gs-foreground-secondary)]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>لا ينفذ المساعد عمليات شراء أو تغييرات في المخزون، ولا يقدم تشخيصاً أو علاجاً طبياً.</span></div>
          <div className="flex flex-wrap gap-2">{quickPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => void submit(undefined, prompt)} className="rounded-full border px-3 py-1.5 text-[11px] [border-color:var(--gs-border)] [color:var(--gs-foreground-secondary)] hover:[background:var(--gs-muted)]">{prompt}</button>)}</div>
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={cn('flex', message.role === 'user' ? 'justify-start' : 'justify-end')}><div className={cn('max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-sm leading-6', message.role === 'user' ? 'bg-emerald-600 text-white' : '[background:var(--gs-muted)] [color:var(--gs-foreground)]')}>{message.content}</div></div>)}
          {loading && <div className="flex justify-end"><div className="rounded-2xl px-3 py-2 [background:var(--gs-muted)]"><Loader2 className="h-4 w-4 animate-spin text-emerald-600" /></div></div>}
          <div ref={endRef} />
        </div>
        <form onSubmit={submit} className="border-t p-3 [border-color:var(--gs-border)]"><div className="flex items-end gap-2 rounded-2xl border p-2 [border-color:var(--gs-border)]"><textarea value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 1200))} rows={1} maxLength={1200} placeholder="اكتب سؤالك هنا..." className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none [color:var(--gs-foreground)]" aria-label="رسالة المساعد" /><button type="submit" disabled={loading || !draft.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label="إرسال"><Send className="h-4 w-4" /></button></div></form>
      </section>
    </div>
  );
}

export default AssistantChat;
