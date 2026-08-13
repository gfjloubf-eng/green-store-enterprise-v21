import { fetchWithAuth, parseJsonSafe } from './authClient';

export interface NotificationItem {
  id: string;
  userId?: string | null;
  title: string;
  body: string;
  channel?: string | null;
  read: boolean;
  payload?: string | null;
  createdAt: string;
}

export async function getUserNotifications(): Promise<{ items: NotificationItem[]; unreadCount: number }> {
  const res = await fetchWithAuth('/notifications', { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function markNotificationAsRead(id: string): Promise<NotificationItem> {
  const res = await fetchWithAuth(`/notifications/${id}/read`, { method: 'POST' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function markAllNotificationsAsRead(): Promise<number> {
  const res = await fetchWithAuth('/notifications/read-all', { method: 'POST' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message ?? res.statusText;
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data?.count ?? 0;
}
