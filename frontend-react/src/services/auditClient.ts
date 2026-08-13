import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface AuditLogItem {
  id: string;
  actorId?: string | null;
  actorName: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  before?: string | null;
  after?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export async function getAuditLogs(params?: {
  resource?: string;
  action?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: AuditLogItem[]; pagination: any }> {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetchWithAuth(`/audit/logs?${query}`, { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}
