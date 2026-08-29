import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import ProductsController from './controller';

function toControllerRequest(ctx: RouteExecutionContext): ControllerRequest {
  return {
    body: ctx.body,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: { metadata: { timestamp: new Date().toISOString(), version: 'v1' } },
  };
}

function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown>): RouteHandler {
  return (context) => handler(context);
}

export function createProductRoutes(controller: ProductsController = new ProductsController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  const register = (definition: {
    name: string;
    method: RouteDefinition['method'];
    path: string;
    version: RouteDefinition['version'];
    handler: (ctx: RouteExecutionContext) => Promise<unknown>;
    options: RouteOptions;
  }) => {
    builder.register({ ...definition, handler: adapt(definition.handler) });
  };
  const privateOptions = (permission: Permission): RouteOptions => ({
    mode: 'private' as const,
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ['products'],
    middleware: [],
  });

  const publicOptions = (): RouteOptions => ({
    mode: 'public' as const,
    publicRoute: true,
    privateRoute: false,
    authenticationRequired: false,
    authorizationRequired: false,
    requiredPermissions: [],
    tags: ['products'],
    middleware: [],
  });

  // Public catalog for the customer-facing storefront (no auth required).
  register({ name: 'products-list-public', method: 'GET', path: '/products/public', version: 'v1', handler: (ctx) => controller.listPublic(toControllerRequest(ctx)), options: publicOptions() });
  register({ name: 'products-list', method: 'GET', path: '/products', version: 'v1', handler: (ctx) => controller.list(toControllerRequest(ctx)), options: privateOptions('products:read') });
  register({ name: 'products-get', method: 'GET', path: '/products/:id', version: 'v1', handler: (ctx) => controller.get(toControllerRequest(ctx)), options: privateOptions('products:read') });
  register({ name: 'products-create', method: 'POST', path: '/products', version: 'v1', handler: (ctx) => controller.create(toControllerRequest(ctx)), options: privateOptions('products:create') });
  register({ name: 'products-update', method: 'PUT', path: '/products/:id', version: 'v1', handler: (ctx) => controller.update(toControllerRequest(ctx)), options: privateOptions('products:update') });
  register({ name: 'products-delete', method: 'DELETE', path: '/products/:id', version: 'v1', handler: (ctx) => controller.remove(toControllerRequest(ctx)), options: privateOptions('products:delete') });
  register({ name: 'products-restore', method: 'PATCH', path: '/products/:id/restore', version: 'v1', handler: (ctx) => controller.restore(toControllerRequest(ctx)), options: privateOptions('products:update') });

  return builder.build();
}

export default createProductRoutes;
