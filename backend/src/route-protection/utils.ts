import type { ProtectedRoute, RouteSecurityMetadata } from './types';

export function createRouteMetadata(options: Omit<RouteSecurityMetadata, 'name' | 'path'> & { name: string; path: string }): RouteSecurityMetadata {
  return {
    name: options.name,
    path: options.path,
    mode: options.mode ?? 'private',
    authenticationRequired: options.authenticationRequired ?? true,
    requiredPermissions: options.requiredPermissions ?? [],
    requiredRoles: options.requiredRoles ?? [],
    requiredScope: options.requiredScope,
    requireAllPermissions: options.requireAllPermissions ?? true,
  };
}

export function createProtectedRoute(metadata: RouteSecurityMetadata): ProtectedRoute {
  return {
    name: metadata.name,
    path: metadata.path,
    metadata,
  };
}
