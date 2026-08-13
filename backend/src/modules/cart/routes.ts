import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import CartController from './controller';

function toControllerRequest(ctx: RouteExecutionContext): ControllerRequest {
  return {
    body: ctx.body,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: {
      user: (ctx as any).user,
      metadata: { timestamp: new Date().toISOString(), version: 'v1' },
    },
  };
}

function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown>): RouteHandler {
  return (context) => handler(context);
}

export function createCartRoutes(controller: CartController = new CartController()): readonly RouteDefinition[] {
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
    tags: ['carts'],
    middleware: [],
  });

  register({ name: 'cart-get', method: 'GET', path: '/cart', version: 'v1', handler: (ctx) => controller.getCart(toControllerRequest(ctx)), options: privateOptions('carts:read') });
  register({ name: 'cart-items-add', method: 'POST', path: '/cart/items', version: 'v1', handler: (ctx) => controller.addItem(toControllerRequest(ctx)), options: privateOptions('carts:create') });
  register({ name: 'cart-items-update', method: 'PUT', path: '/cart/items/:id', version: 'v1', handler: (ctx) => controller.updateItem(toControllerRequest(ctx)), options: privateOptions('carts:update') });
  register({ name: 'cart-items-remove', method: 'DELETE', path: '/cart/items/:id', version: 'v1', handler: (ctx) => controller.removeItem(toControllerRequest(ctx)), options: privateOptions('carts:delete') });
  register({ name: 'cart-clear', method: 'DELETE', path: '/cart', version: 'v1', handler: (ctx) => controller.clearCart(toControllerRequest(ctx)), options: privateOptions('carts:delete') });

  return builder.build();
}

export default createCartRoutes;
