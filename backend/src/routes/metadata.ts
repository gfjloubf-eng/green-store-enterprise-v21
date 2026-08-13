import type { RouteMetadata, RouteOptions, RouteVersion } from './contracts';

export function createRouteMetadata(name: string, path: string, version: RouteVersion, options: RouteOptions = {}): RouteMetadata {
  const middleware = options.middleware ? [...options.middleware] : [];
  const tags = options.tags ? [...options.tags] : [];
  const requiredPermissions = options.requiredPermissions ? [...options.requiredPermissions] : [];
  const requiredRoles = options.requiredRoles ? [...options.requiredRoles] : [];

  const metadata: RouteMetadata = {
    name,
    path,
    version,
    mode: options.mode ?? 'private',
    tags,
    authenticationRequired: options.authenticationRequired ?? true,
    authorizationRequired: options.authorizationRequired ?? false,
    publicRoute: options.publicRoute ?? false,
    privateRoute: options.privateRoute ?? true,
    requiredPermissions,
    requiredRoles,
    requiredScope: options.requiredScope,
    requireAllPermissions: options.requireAllPermissions ?? false,
    tenantScope: options.tenantScope,
    middleware,
  };

  return Object.freeze(metadata) as RouteMetadata;
}

export function mergeRouteMetadata(base: Readonly<RouteMetadata>, overrides: Partial<RouteOptions> = {}): RouteMetadata {
  return createRouteMetadata(base.name, base.path, base.version, {
    ...base,
    ...overrides,
    tags: overrides.tags ?? base.tags,
    requiredPermissions: overrides.requiredPermissions ?? base.requiredPermissions,
    requiredRoles: overrides.requiredRoles ?? base.requiredRoles,
    middleware: overrides.middleware ?? base.middleware,
  });
}
