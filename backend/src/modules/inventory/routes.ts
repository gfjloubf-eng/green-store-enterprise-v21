import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import { InventoryController } from './controller';

function toControllerRequest<T>(ctx: RouteExecutionContext): ControllerRequest<T> {
  return {
    body: (ctx.body ?? undefined) as T | undefined,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: (ctx as any).user,
    context: {
      metadata: {
        timestamp: new Date().toISOString(),
        version: (ctx.version as 'v1') ?? 'v1',
      },
    },
  } as any;
}

function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown> | unknown): RouteHandler {
  return (context: RouteExecutionContext) => handler(context);
}

export function createInventoryRoutes(controller: InventoryController = new InventoryController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  const privateOptions = (permission: Permission): RouteOptions => ({
    mode: 'private',
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ['inventory'],
    middleware: [],
  });

  // GET /inventory — List Stock Levels (Filterable by status, Searchable)
  builder.register({
    name: 'inventory-list',
    method: 'GET',
    path: '/inventory',
    version: 'v1',
    handler: adapt((ctx) => controller.listInventory(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      ...privateOptions('inventory:read'),
    },
  });

  // POST /inventory/adjust — Adjust Stock Level
  builder.register({
    name: 'inventory-adjust',
    method: 'POST',
    path: '/inventory/adjust',
    version: 'v1',
    handler: adapt((ctx) => controller.adjustStock(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      ...privateOptions('inventory:update'),
    },
  });

  // GET /inventory/movements — List Stock Movement Audit Logs
  builder.register({
    name: 'inventory-movements',
    method: 'GET',
    path: '/inventory/movements',
    version: 'v1',
    handler: adapt((ctx) => controller.listMovements(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      ...privateOptions('inventory:read'),
    },
  });

  return builder.build();
}

export default createInventoryRoutes;
