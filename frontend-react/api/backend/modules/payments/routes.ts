import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { PaymentController } from './controller';

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

export function createPaymentRoutes(controller: PaymentController = new PaymentController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  // POST /payments/create — Initiate / Create Payment Transaction
  builder.register({
    name: 'payment-create',
    method: 'POST',
    path: '/payments/create',
    version: 'v1',
    handler: adapt((ctx) => controller.createPayment(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['payments'],
      middleware: [],
    },
  });

  // GET /payments/order/:orderId — Get Payment Details for Order
  builder.register({
    name: 'payment-get-for-order',
    method: 'GET',
    path: '/payments/order/:orderId',
    version: 'v1',
    handler: adapt((ctx) => controller.getPaymentForOrder(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['payments'],
      middleware: [],
    },
  });

  // POST /payments/verify — Verify Payment Transaction
  builder.register({
    name: 'payment-verify',
    method: 'POST',
    path: '/payments/verify',
    version: 'v1',
    handler: adapt((ctx) => controller.verifyPayment(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['payments'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createPaymentRoutes;
