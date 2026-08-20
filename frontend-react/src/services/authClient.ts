import { isManagementRole, normalizeAppRole } from '@/utils/authRoles';

export interface SignInRequest {
  identifier: string;
  password: string;
  deviceId?: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const getApiBase = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  const isBrowser = typeof window !== 'undefined';
  const isRemoteHost = isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  if (envUrl) {
    const cleanUrl = String(envUrl).replace(/\/+$/, '');
    const isLocalEnvUrl = cleanUrl.includes('127.0.0.1') || cleanUrl.includes('localhost');
    if (!isRemoteHost || !isLocalEnvUrl) {
      return cleanUrl;
    }
  }

  if (isRemoteHost) {
    return window.location.origin;
  }

  return 'http://127.0.0.1:3000';
};

function resolveUrl(input: RequestInfo): RequestInfo {
  if (typeof input === 'string' && input.startsWith('/')) {
    const base = getApiBase();
    const isLocalBase = base.includes('127.0.0.1') || base.includes('localhost');
    const baseAlreadyHasApi = /\/api\/?$/.test(base);
    const apiPath = input.startsWith('/api/') || input.startsWith('/auth/') || isLocalBase || baseAlreadyHasApi
      ? input
      : `/api${input}`;
    return `${base}${apiPath}`;
  }
  return input;
}

export async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function signIn(req: SignInRequest): Promise<AuthResult> {
  const res = await fetch(`${getApiBase()}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const code = payload?.error?.code ?? 'error';
    const err: any = new Error(message);
    err.code = code;
    err.status = res.status;
    throw err;
  }

  const data = payload?.data as AuthResult | undefined;
  if (!data) throw new Error('invalid_response');
  return data;
}

export async function signUp(req: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }): Promise<AuthResult> {
  const res = await fetch(`${getApiBase()}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const code = payload?.error?.code ?? 'error';
    const err: any = new Error(message);
    err.code = code;
    err.status = res.status;
    throw err;
  }

  const data = payload?.data as AuthResult | undefined;
  if (!data) throw new Error('invalid_response');
  return data;
}

export async function changePassword(req: { currentPassword: string; newPassword: string; confirmPassword?: string }): Promise<void> {
  const res = await fetchWithAuth('/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${getApiBase()}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
}

export async function resetPassword(req: { token: string; newPassword: string; confirmPassword?: string }): Promise<void> {
  const res = await fetch(`${getApiBase()}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
}

export async function updateProfile(req: { name?: string; displayName?: string; phone?: string }): Promise<any> {
  const res = await fetchWithAuth('/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
  return payload?.data;
}

export async function refresh(refreshToken: string): Promise<AuthResult> {
  const res = await fetch(`${getApiBase()}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }

  const data = payload?.data as AuthResult | undefined;
  if (!data) throw new Error('invalid_response');
  return data;
}

export async function getCurrentUser(): Promise<any> {
  const res = await fetchWithAuth(`${getApiBase()}/auth/me`, { method: 'GET' });
  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message = payload?.error?.message || (res.statusText ? `${res.statusText} (${res.status})` : `فشل الطلب (${res.status})`);
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }

  return payload?.data ?? null;
}

/**
 * Safe Read-Only Customer / User Session Sync from Backend API.
 * Validates backend roles against explicit whitelist without privilege escalation.
 */
export async function syncCurrentUserSession(): Promise<any> {
  const token = getStoredAccessToken();
  if (!token) return null;

  try {
    const user = await getCurrentUser();
    if (user && user.role) {
      const normalizedRole = normalizeAppRole(user.role);
      const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER'];
      if (allowedRoles.includes(normalizedRole)) {
        setStoredUserRole(normalizedRole);
      }
      return user;
    }
  } catch {
    // Safe fallback: Do NOT elevate privileges or invalidate valid offline sessions on temporary network failure
  }
  return null;
}

// Token storage helpers — read from localStorage or sessionStorage (same keys as AuthProvider)
function readToken(key: string): string | null {
  try {
    const v = window.localStorage.getItem(key);
    if (v) return v;
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeToken(key: string, value: string | null, remember = true) {
  try {
    if (remember) {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
      window.sessionStorage.removeItem(key);
    } else {
      if (value === null) window.sessionStorage.removeItem(key);
      else window.sessionStorage.setItem(key, value);
      window.localStorage.removeItem(key);
    }
  } catch {}
}

export function getStoredAccessToken(): string | null {
  return readToken('gs_access_token');
}

export function getStoredRefreshToken(): string | null {
  return readToken('gs_refresh_token');
}

export function getStoredUserRole(): string | null {
  return readToken('gs_user_role');
}

export function setStoredUserRole(role: string | null, remember = true) {
  writeToken('gs_user_role', role, remember);
}

export function isAuthorizedStaffOrAdmin(): boolean {
  return isManagementRole(getStoredUserRole());
}

export function setStoredTokens(result: AuthResult, remember = true) {
  writeToken('gs_access_token', result.accessToken, remember);
  writeToken('gs_refresh_token', result.refreshToken, remember);
  try {
    const s = String(result.expiresIn ?? '');
    writeToken('gs_expires_in', s, remember);
  } catch {}
}

export function clearStoredTokens() {
  try {
    writeToken('gs_access_token', null, true);
    writeToken('gs_access_token', null, false);
    writeToken('gs_refresh_token', null, true);
    writeToken('gs_refresh_token', null, false);
    writeToken('gs_expires_in', null, true);
    writeToken('gs_expires_in', null, false);
    writeToken('gs_user_role', null, true);
    writeToken('gs_user_role', null, false);

    sessionStorage.removeItem('gs_access_token');
    sessionStorage.removeItem('gs_refresh_token');
    sessionStorage.removeItem('gs_expires_in');
    sessionStorage.removeItem('gs_user_role');
  } catch {}
}

export const AUTH_UNAUTHENTICATED_EVENT = 'gs_auth_unauthenticated';

export function notifyUnauthenticated() {
  clearStoredTokens();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHENTICATED_EVENT));
  }
}

// fetch wrapper with automatic refresh + retry
let refreshPromise: Promise<void> | null = null;

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit, retry = true): Promise<Response> {
  const targetUrl = resolveUrl(input);
  const access = getStoredAccessToken();
  const headers = new Headers(init?.headers ?? {});
  if (access) headers.set('Authorization', `Bearer ${access}`);

  const res = await fetch(targetUrl, { ...init, headers });

  if (res.status !== 401) return res;

  // 401 — attempt refresh (only once)
  if (!retry) return res;

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    notifyUnauthenticated();
    return res;
  }

  // ensure only one refresh runs at a time (Refresh Race Protection)
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const isSessionOnly =
          typeof window !== 'undefined' &&
          !window.localStorage.getItem('gs_access_token') &&
          !window.localStorage.getItem('gs_refresh_token') &&
          (!!window.sessionStorage.getItem('gs_access_token') || !!window.sessionStorage.getItem('gs_refresh_token'));
        const rememberTarget = !isSessionOnly;

        const newTokens = await refresh(refreshToken);
        setStoredTokens(newTokens, rememberTarget);
      } catch (err: any) {
        // Do NOT invalidate session on temporary network errors or server downtime
        const isNetworkError =
          err?.name === 'TypeError' ||
          (typeof err?.status === 'number' && err.status >= 500) ||
          (typeof err?.message === 'string' &&
            (err.message.includes('Failed to fetch') ||
             err.message.includes('NetworkError') ||
             err.message.includes('Network Error') ||
             err.message.includes('Load failed')));

        if (!isNetworkError) {
          notifyUnauthenticated();
        }
        throw err;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  try {
    await refreshPromise;
  } catch (e) {
    return res;
  }

  const access2 = getStoredAccessToken();
  const headers2 = new Headers(init?.headers ?? {});
  if (access2) headers2.set('Authorization', `Bearer ${access2}`);
  return fetch(targetUrl, { ...init, headers: headers2 });
}

export async function logout(): Promise<void> {
  const refreshToken = getStoredRefreshToken();
  try {
    if (refreshToken) {
      await fetch(`${getApiBase()}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (e) {
    // ignore network errors — proceed to clear local tokens
  }

  clearStoredTokens();

  try {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch {}
}

