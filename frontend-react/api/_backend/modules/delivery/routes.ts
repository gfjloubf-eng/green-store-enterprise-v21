import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import DeliveryController from './controller';

function request(ctx: RouteExecutionContext): ControllerRequest {
  return {
    body: ctx.body,
    headers: ctx.headers,
    params: ctx.params,
    query: ctx.query,
    context: {
      user: (ctx as any).user,
      metadata: { timestamp: new Date().toISOString(), version: 'v1' },
    },
  };
}

export function createDeliveryRoutes(controller: DeliveryController = new DeliveryController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  const options = (permission: Permission): RouteOptions => ({
    mode: 'private',
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ['delivery'],
    middleware: [],
  });
  const register = (name: string, method: RouteDefinition['method'], path: string, permission: Permission, handler: RouteHandler) =>
    builder.register({ name, method, path, version: 'v1', handler, options: options(permission) });

  register('delivery-drivers-list', 'GET', '/delivery/drivers', 'delivery:read', (ctx) => controller.list(request(ctx)));
  register('delivery-drivers-get', 'GET', '/delivery/drivers/:id', 'delivery:read', (ctx) => controller.get(request(ctx)));
  register('delivery-drivers-create', 'POST', '/delivery/drivers', 'delivery:create', (ctx) => controller.create(request(ctx)));
  register('delivery-drivers-update', 'PUT', '/delivery/drivers/:id', 'delivery:update', (ctx) => controller.update(request(ctx)));
  register('delivery-drivers-delete', 'DELETE', '/delivery/drivers/:id', 'delivery:delete', (ctx) => controller.remove(request(ctx)));

  return builder.build();
}

export default createDeliveryRoutes;
