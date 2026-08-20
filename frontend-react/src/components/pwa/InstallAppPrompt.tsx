import { useEffect, useState } from 'react';
type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
export function InstallAppPrompt() {
  const [event, setEvent] = useState<PromptEvent | null>(null); const [visible, setVisible] = useState(false);
  useEffect(() => { const handler = (value: Event) => { value.preventDefault(); setEvent(value as PromptEvent); setVisible(true); }; window.addEventListener('beforeinstallprompt', handler); return () => window.removeEventListener('beforeinstallprompt', handler); }, []);
  if (!visible || !event) return null;
  return <div dir="rtl" className="fixed bottom-20 left-4 right-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-emerald-900 p-4 text-white shadow-2xl"><div><p className="font-black">ثبّت قطوف الطبيعة</p><p className="text-sm text-emerald-100">وصول أسرع للمتجر من هاتفك.</p></div><div className="flex gap-2"><button onClick={async () => { await event.prompt(); setVisible(false); }} className="rounded-xl bg-white px-3 py-2 text-sm font-black text-emerald-900">تثبيت</button><button onClick={() => setVisible(false)} className="rounded-xl border border-emerald-300 px-3 py-2 text-sm">لاحقًا</button></div></div>;
}
export default InstallAppPrompt;
