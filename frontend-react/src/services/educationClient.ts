import { fetchWithAuth, getApiBase, parseJsonSafe } from './authClient';

export interface EducationArticle { id: string; slug: string; title: string; summary?: string | null; body: string; articleType: string; coverImageUrl?: string | null; family?: { familyKey: string; name: string } | null; }

export async function listEducationArticles(): Promise<EducationArticle[]> {
  try {
    const response = await fetchWithAuth('/education/articles');
    const payload = await parseJsonSafe(response);
    return response.ok && Array.isArray(payload?.data) ? payload.data : [];
  } catch { return []; }
}
export async function getEducationArticle(slug: string): Promise<EducationArticle | null> {
  try {
    const response = await fetchWithAuth(`/education/articles/${encodeURIComponent(slug)}`);
    const payload = await parseJsonSafe(response);
    return response.ok ? payload?.data ?? null : null;
  } catch { return null; }
}
export async function submitConsultation(input: Record<string, unknown>) {
  const response = await fetch(`${getApiBase()}/education/consultations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  const payload = await parseJsonSafe(response);
  if (!response.ok) throw new Error(payload?.error?.message ?? 'تعذر إرسال الاستشارة');
  return payload?.data;
}
