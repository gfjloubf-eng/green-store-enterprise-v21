import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import SupplierAdminController from './controller';

function request(ctx: RouteExecutionContext): ControllerRequest { return { body: ctx.body, headers: ctx.headers, params: ctx.params, query: ctx.query, context: { user: (ctx as any).user, metadata: { timestamp: new Date().toISOString(), version: 'v1' } } }; }

export function createSupplierAdminRoutes(controller: SupplierAdminController = new SupplierAdminController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  const options = (permission: Permission): RouteOptions => ({ mode: 'private', publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: true, requiredPermissions: [permission], tags: ['suppliers'], middleware: [] });
  const register = (name: string, method: RouteDefinition['method'], path: string, permission: Permission, handler: RouteHandler) => builder.register({ name, method, path, version: 'v1', handler, options: options(permission) });
  register('suppliers-admin-list', 'GET', '/admin/suppliers', 'suppliers:read', (ctx) => controller.list(request(ctx)));
  register('suppliers-admin-get', 'GET', '/admin/suppliers/:id', 'suppliers:read', (ctx) => controller.get(request(ctx)));
  register('suppliers-admin-create', 'POST', '/admin/suppliers', 'suppliers:create', (ctx) => controller.create(request(ctx)));
  register('suppliers-admin-update', 'PUT', '/admin/suppliers/:id', 'suppliers:update', (ctx) => controller.update(request(ctx)));
  register('suppliers-admin-delete', 'DELETE', '/admin/suppliers/:id', 'suppliers:delete', (ctx) => controller.remove(request(ctx)));
  return builder.build();
}

export default createSupplierAdminRoutes;
