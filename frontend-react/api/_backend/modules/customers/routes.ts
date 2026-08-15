import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import CustomersController from './controller';

function request(ctx: RouteExecutionContext): ControllerRequest {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, context: { user: (ctx as any).user, metadata: { timestamp: new Date().toISOString(), version: 'v1' } } };
}

export function createCustomerRoutes(controller: CustomersController = new CustomersController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  const options = (permission: Permission): RouteOptions => ({
    mode: 'private', publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: true, requiredPermissions: [permission], tags: ['customers'], middleware: [],
  });
  const register = (name: string, method: RouteDefinition['method'], path: string, permission: Permission, handler: RouteHandler) => builder.register({ name, method, path, version: 'v1', handler, options: options(permission) });
  register('customers-list', 'GET', '/customers', 'customers:read', (ctx) => controller.list(request(ctx)));
  register('customers-get', 'GET', '/customers/:id', 'customers:read', (ctx) => controller.get(request(ctx)));
  register('customers-create', 'POST', '/customers', 'customers:create', (ctx) => controller.create(request(ctx)));
  register('customers-update', 'PUT', '/customers/:id', 'customers:update', (ctx) => controller.update(request(ctx)));
  register('customers-delete', 'DELETE', '/customers/:id', 'customers:delete', (ctx) => controller.remove(request(ctx)));
  register('customers-addresses-list', 'GET', '/customers/:id/addresses', 'customers:read', (ctx) => controller.listAddresses(request(ctx)));
  register('customers-addresses-create', 'POST', '/customers/:id/addresses', 'customers:create', (ctx) => controller.createAddress(request(ctx)));
  register('customers-addresses-update', 'PUT', '/customers/:id/addresses/:addressId', 'customers:update', (ctx) => controller.updateAddress(request(ctx)));
  register('customers-addresses-delete', 'DELETE', '/customers/:id/addresses/:addressId', 'customers:delete', (ctx) => controller.removeAddress(request(ctx)));
  return builder.build();
}

export default createCustomerRoutes;
