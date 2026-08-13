import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { OrderController } from './controller';

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

export function createOrderRoutes(controller: OrderController = new OrderController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  // POST /orders — Create Order from Cart
  builder.register({
    name: 'orders-create',
    method: 'POST',
    path: '/orders',
    version: 'v1',
    handler: adapt((ctx) => controller.createOrder(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['orders'],
      middleware: [],
    },
  });

  // GET /orders — List Orders (Paginated, Searchable, Ownership Aware)
  builder.register({
    name: 'orders-list',
    method: 'GET',
    path: '/orders',
    version: 'v1',
    handler: adapt((ctx) => controller.listOrders(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['orders'],
      middleware: [],
    },
  });

  // GET /orders/:id — Get Single Order Details
  builder.register({
    name: 'orders-get-by-id',
    method: 'GET',
    path: '/orders/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.getOrderById(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['orders'],
      middleware: [],
    },
  });

  // PATCH /orders/:id/status — Update Order Status (Staff / Lifecycle / Cancel)
  builder.register({
    name: 'orders-update-status',
    method: 'PATCH',
    path: '/orders/:id/status',
    version: 'v1',
    handler: adapt((ctx) => controller.updateStatus(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['orders'],
      middleware: [],
    },
  });

  // POST /orders/:id/cancel — Cancel Order Shortcut
  builder.register({
    name: 'orders-cancel',
    method: 'POST',
    path: '/orders/:id/cancel',
    version: 'v1',
    handler: adapt((ctx) => controller.cancelOrder(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['orders'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createOrderRoutes;
