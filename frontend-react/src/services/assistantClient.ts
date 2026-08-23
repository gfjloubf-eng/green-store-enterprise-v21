import { getApiBase, parseJsonSafe } from './authClient';

export type AssistantMessage = { role: 'user' | 'assistant'; content: string };
export type AssistantResponse = {
  reply: string;
  source: 'ai_with_live_catalog' | 'safe_fallback';
  provider: 'google_gemini' | 'configured_ai' | 'safe_fallback';
  model: string | null;
  verification: 'live_model_response' | 'deterministic_fallback';
  catalogCount: number;
  disclaimer: string;
};

export async function sendAssistantMessage(message: string, history: AssistantMessage[] = []): Promise<AssistantResponse> {
  const apiBase = getApiBase();
  const isLocalApi = apiBase.includes('127.0.0.1') || apiBase.includes('localhost');
  const normalizedBase = apiBase.replace(/\/$/, '');
  const assistantUrl = isLocalApi || /\/api$/.test(normalizedBase)
    ? `${normalizedBase}/assistant/chat`
    : `${normalizedBase}/api/assistant/chat`;
  const response = await fetch(assistantUrl, {
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
    provider: data?.provider === 'google_gemini' ? 'google_gemini' : data?.provider === 'configured_ai' ? 'configured_ai' : 'safe_fallback',
    model: typeof data?.model === 'string' ? data.model : null,
    verification: data?.verification === 'live_model_response' ? 'live_model_response' : 'deterministic_fallback',
    catalogCount: Number(data?.catalogCount || 0),
    disclaimer: String(data?.disclaimer || 'المساعد يقدم معلومات عامة ولا يستبدل المختصين.'),
  };
}
