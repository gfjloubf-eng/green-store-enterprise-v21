import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/i18n/useI18n';
import { Forbidden403Page } from './Forbidden403Page';

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredRole?: string;
  children?: React.ReactNode;
}

export function ProtectedRoute({ requiredPermission, requiredRole, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--gs-background)] text-[var(--gs-foreground)]">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span className="text-sm font-medium">{t('common.loading') || 'Verifying session...'}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Forbidden403Page />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Forbidden403Page />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;

