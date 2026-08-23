import { getApiBase, parseJsonSafe } from './authClient';

export type AssistantMessage = { role: 'user' | 'assistant'; content: string };
export type AssistantResponse = {
  reply: string;
  source: 'ai_with_live_catalog' | 'safe_fallback';
  catalogCount: number;
  disclaimer: string;
};

export async function sendAssistantMessage(message: string, history: AssistantMessage[] = []): Promise<AssistantResponse> {
  const response = await fetch(`${getApiBase()}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ message: message.trim(), history: history.slice(-8) }),
  });
  const payload = await parseJsonSafe(response) as any;
  if (!response.ok || payload?.success === false) throw new Error(payload?.error?.message || 'assistant_request_failed');
  const data = payload?.data ?? payload;
  return {
    reply: String(data?.reply || 'تعذر الحصول على رد الآن. حاول مرة أخرى.'),
    source: data?.source === 'ai_with_live_catalog' ? 'ai_with_live_catalog' : 'safe_fallback',
    catalogCount: Number(data?.catalogCount || 0),
    disclaimer: String(data?.disclaimer || 'المساعد يقدم معلومات عامة ولا يستبدل المختصين.'),
  };
}
