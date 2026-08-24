import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCurrentUser, getStoredAccessToken, getStoredRefreshToken, logout as clientLogout, setStoredTokens, setStoredUserRole, signIn, clearStoredTokens, AUTH_UNAUTHENTICATED_EVENT } from '@/services/authClient';
import type { AuthContextValue, AuthStatus, AuthUser } from '@/types/auth';
import { normalizeAppRole, normalizeAppRoles } from '@/utils/authRoles';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const normalizeUser = useCallback((raw: any, fallbackIdentifier?: string): AuthUser => {
    if (!raw) {
      setStoredUserRole('USER', true);
      return { id: '0', email: fallbackIdentifier ?? '', name: fallbackIdentifier ?? '', role: 'USER', roles: ['USER'], permissions: [] };
    }

    const rolesList = normalizeAppRoles(Array.isArray(raw.roles) ? raw.roles : raw.role ? [raw.role] : ['USER']);
    const primaryRole = normalizeAppRole(raw.role ?? rolesList[0] ?? 'USER');
    const permissionsList = Array.isArray(raw.permissions) ? raw.permissions : [];

    setStoredUserRole(primaryRole, true);
    try {
      window.localStorage.setItem('gs_user_cache', JSON.stringify(raw));
    } catch {}

    return {
      id: String(raw.id ?? raw.sub ?? '0'),
      email: raw.email ?? fallbackIdentifier ?? '',
      name: raw.fullName ?? raw.name ?? raw.username ?? raw.email ?? 'User',
      role: primaryRole,
      roles: rolesList,
      avatar: raw.avatar ?? null,
      phone: raw.phone ?? null,
      permissions: permissionsList,
      tenant: raw.tenant ?? null,
      store: raw.store ?? null,
      branch: raw.branch ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }, []);

  const bootstrapSession = useCallback(async () => {
    const access = getStoredAccessToken();
    const refresh = getStoredRefreshToken();

    if (!access && !refresh) {
      clearStoredTokens();
      setUser(null);
      setStatus('unauthenticated');
      return;
    }

    setStatus('loading');
    try {
      const current = await getCurrentUser();
      if (current) {
        setUser(normalizeUser(current));
        setStatus('authenticated');
      } else {
        // Try refresh token if access token is invalid but refresh token exists
        if (refresh) {
          try {
            const { refresh: refreshTokens } = await import('@/services/authClient');
            const result = await refreshTokens(refresh);
            // Check if it was a persistent session
            const isPersistent = typeof window !== 'undefined' && !!window.localStorage.getItem('gs_refresh_token');
            setStoredTokens(result, isPersistent);
            const userAfterRefresh = await getCurrentUser();
            setUser(normalizeUser(userAfterRefresh));
            setStatus('authenticated');
            return;
          } catch {
            // Refresh failed
          }
        }
        clearStoredTokens();
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch (err: any) {
      const isNetworkError =
        err?.name === 'TypeError' ||
        (typeof err?.status === 'number' && err.status >= 500) ||
        (typeof err?.message === 'string' &&
          (err.message.includes('Failed to fetch') ||
           err.message.includes('NetworkError') ||
           err.message.includes('Network Error') ||
           err.message.includes('Load failed')));

      if (!isNetworkError) {
        clearStoredTokens();
        setUser(null);
        setStatus('unauthenticated');
      } else {
        // Preserve the authenticated UI during temporary network failures after refresh.
        // The access/refresh tokens remain the source of truth for API authorization.
        try {
          const cached = window.localStorage.getItem('gs_user_cache');
          if (cached && getStoredAccessToken()) {
            setUser(normalizeUser(JSON.parse(cached)));
            setStatus('authenticated');
            return;
          }
        } catch {}
        setUser(null);
        setStatus('unauthenticated');
      }
    }
  }, [normalizeUser]);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    const handleUnauthenticated = () => {
      setUser(null);
      setStatus('unauthenticated');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(AUTH_UNAUTHENTICATED_EVENT, handleUnauthenticated);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(AUTH_UNAUTHENTICATED_EVENT, handleUnauthenticated);
      }
    };
  }, []);

  const login = useCallback(
    async (identifier: string, password: string, remember = true) => {
      setStatus('loading');
      try {
        const result = await signIn({ identifier, password });
        setStoredTokens(result, remember);

        try {
          const current = await getCurrentUser();
          setUser(normalizeUser(current, identifier));
        } catch {
          if (result && result.user) {
            setUser(normalizeUser(result.user, identifier));
          } else {
            setUser({ id: '0', email: identifier, name: identifier, role: 'USER', roles: ['USER'], permissions: [] });
          }
        }
        setStatus('authenticated');
      } catch (e) {
        setUser(null);
        setStatus('unauthenticated');
        throw e;
      }
    },
    [normalizeUser],
  );

  const register = useCallback(
    async (req: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) => {
      setStatus('loading');
      try {
        const { signUp } = await import('@/services/authClient');
        const result = await signUp(req);
        setStoredTokens(result, true);

        try {
          const current = await getCurrentUser();
          setUser(normalizeUser(current, req.email));
        } catch {
          setUser(normalizeUser((result as any).user, req.email));
        }
        setStatus('authenticated');
      } catch (e) {
        setUser(null);
        setStatus('unauthenticated');
        throw e;
      }
    },
    [normalizeUser],
  );

  const refreshUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      if (current) {
        setUser(normalizeUser(current));
      }
    } catch {
      // retain state
    }
  }, [normalizeUser]);

  const logout = useCallback(() => {
    setUser(null);
    setStatus('unauthenticated');
    clientLogout().catch(() => {});
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      const isSuperAdmin = normalizeAppRole(user.role) === 'SUPER_ADMIN'
        || (Array.isArray(user.roles) && user.roles.some((role) => normalizeAppRole(role) === 'SUPER_ADMIN'));
      if (isSuperAdmin) return true;
      if (!user.permissions) return false;
      if (Array.isArray(user.permissions)) {
        return user.permissions.some((p: any) => {
          if (typeof p === 'string') return p === permission || p === '*';
          if (typeof p === 'object' && p !== null) {
            const formatted = `${p.resource}:${p.action}`;
            return formatted === permission || p.resource === '*';
          }
          return false;
        });
      }
      return false;
    },
    [user],
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false;
      const normalizedRole = normalizeAppRole(role);
      if (normalizeAppRole(user.role) === normalizedRole) return true;
      if (Array.isArray(user.roles)) return user.roles.some((candidate) => normalizeAppRole(candidate) === normalizedRole);
      return false;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login: (email: string, password: string, remember = true) => login(email, password, remember),
      register,
      refreshUser,
      logout,
      hasPermission,
      hasRole,
    }),
    [user, status, login, register, refreshUser, logout, hasPermission, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
