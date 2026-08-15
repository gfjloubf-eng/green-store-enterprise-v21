import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { ReportsController } from './controller';

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

export function createReportsRoutes(controller: ReportsController = new ReportsController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  // GET /reports/dashboard — Dashboard KPI Summary
  builder.register({
    name: 'reports-dashboard',
    method: 'GET',
    path: '/reports/dashboard',
    version: 'v1',
    handler: adapt((ctx) => controller.getDashboardKpis(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['reports'],
      middleware: [],
    },
  });

  // GET /reports/sales — Sales & Revenue Report
  builder.register({
    name: 'reports-sales',
    method: 'GET',
    path: '/reports/sales',
    version: 'v1',
    handler: adapt((ctx) => controller.getSalesReport(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['reports'],
      middleware: [],
    },
  });

  // GET /reports/products — Product Performance Analytics
  builder.register({
    name: 'reports-products',
    method: 'GET',
    path: '/reports/products',
    version: 'v1',
    handler: adapt((ctx) => controller.getProductAnalytics(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['reports'],
      middleware: [],
    },
  });

  // GET /reports/inventory — Stock Analytics
  builder.register({
    name: 'reports-inventory',
    method: 'GET',
    path: '/reports/inventory',
    version: 'v1',
    handler: adapt((ctx) => controller.getInventoryAnalytics(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['reports'],
      middleware: [],
    },
  });

  // GET /reports/customers — Customer Growth Analytics
  builder.register({
    name: 'reports-customers',
    method: 'GET',
    path: '/reports/customers',
    version: 'v1',
    handler: adapt((ctx) => controller.getCustomerAnalytics(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['reports'],
      middleware: [],
    },
  });

  // GET /reports/payments — Payment Analytics
  builder.register({
    name: 'reports-payments',
    method: 'GET',
    path: '/reports/payments',
    version: 'v1',
    handler: adapt((ctx) => controller.getPaymentAnalytics(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['reports'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createReportsRoutes;
