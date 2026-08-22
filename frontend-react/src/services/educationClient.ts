import { fetchWithAuth, getApiBase, parseJsonSafe } from './authClient';

export interface EducationArticle {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  body: string;
  articleType: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string;
  coverImageUrl?: string | null;
  coverImageSourceUrl?: string | null;
  coverImageLicense?: string | null;
  sourceUrls?: string[];
  family?: { id?: string; familyKey: string; name: string } | null;
  productLinks?: Array<{ productId: string; product?: { id: string; name: string } | null }>;
  updatedAt?: string;
}

export async function listEducationArticles(): Promise<EducationArticle[]> {
  const response = await fetchWithAuth('/education/articles');
  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? response.statusText ?? 'تعذر تحميل مركز المعرفة');
  }
  return Array.isArray(payload?.data) ? payload.data : [];
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

async function parseAdminResponse(response: Response): Promise<any> {
  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? response.statusText ?? 'تعذر تنفيذ العملية');
  }
  return payload?.data;
}

export async function listAdminEducationArticles(params?: { search?: string; status?: string }): Promise<EducationArticle[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status && params.status !== 'ALL') query.set('status', params.status);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  const response = await fetchWithAuth(`/admin/education/articles${suffix}`);
  const data = await parseAdminResponse(response);
  return Array.isArray(data) ? data : [];
}

export interface AdminEducationArticleInput {
  slug: string;
  title: string;
  summary?: string;
  body: string;
  articleType: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  coverImageUrl?: string;
  coverImageSourceUrl?: string;
  coverImageLicense?: string;
  sourceUrls: string[];
  familyId?: string;
  productIds: string[];
}

export async function createAdminEducationArticle(input: AdminEducationArticleInput): Promise<EducationArticle> {
  const response = await fetchWithAuth('/admin/education/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseAdminResponse(response);
}

export async function updateAdminEducationArticle(id: string, input: AdminEducationArticleInput): Promise<EducationArticle> {
  const response = await fetchWithAuth(`/admin/education/articles/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return parseAdminResponse(response);
}

export async function reviewAdminEducationWithAI(input: AdminEducationArticleInput): Promise<Record<string, unknown>> {
  const response = await fetchWithAuth('/admin/education/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await parseAdminResponse(response);
  return data && typeof data === 'object' ? data as Record<string, unknown> : {};
}

export async function deleteAdminEducationArticle(id: string): Promise<void> {
  const response = await fetchWithAuth(`/admin/education/articles/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  await parseAdminResponse(response);
}
