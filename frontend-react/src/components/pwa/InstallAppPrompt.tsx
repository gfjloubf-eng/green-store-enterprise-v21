import { useEffect, useState } from 'react';
type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
export function InstallAppPrompt() {
  const [event, setEvent] = useState<PromptEvent | null>(null); const [visible, setVisible] = useState(false);
  useEffect(() => { const handler = (value: Event) => { value.preventDefault(); setEvent(value as PromptEvent); setVisible(true); }; window.addEventListener('beforeinstallprompt', handler); return () => window.removeEventListener('beforeinstallprompt', handler); }, []);
  if (!visible || !event) return null;
  return <div dir="rtl" className="fixed bottom-20 left-3 right-3 z-50 mx-auto flex w-auto max-w-md min-w-0 flex-col gap-3 overflow-hidden rounded-2xl bg-emerald-900 p-3 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-4"><div className="min-w-0"><p className="truncate font-black">ثبّت قطوف الطبيعة</p><p className="text-sm text-emerald-100">وصول أسرع للمتجر من هاتفك.</p></div><div className="flex min-w-0 shrink-0 gap-2"><button onClick={async () => { await event.prompt(); setVisible(false); }} className="min-h-10 flex-1 rounded-xl bg-white px-3 py-2 text-sm font-black text-emerald-900 sm:flex-none">تثبيت</button><button onClick={() => setVisible(false)} className="min-h-10 flex-1 rounded-xl border border-emerald-300 px-3 py-2 text-sm sm:flex-none">لاحقًا</button></div></div>;
}
export default InstallAppPrompt;
