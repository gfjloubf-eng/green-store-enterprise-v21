export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  roles?: string[];
  avatar?: string | null;
  phone?: string | null;
  permissions?: string[] | Array<{ resource: string; action: string }>;
  tenant?: { id: string; name?: string | null } | null;
  store?: { id: string; name?: string | null } | null;
  branch?: { id: string; name?: string | null } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (req: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

