import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { AuditController } from './controller';

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

export function createAuditRoutes(controller: AuditController = new AuditController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  // GET /audit/logs — List Audit Trail Logs
  builder.register({
    name: 'audit-logs-list',
    method: 'GET',
    path: '/audit/logs',
    version: 'v1',
    handler: adapt((ctx) => controller.listAuditLogs(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['audit'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createAuditRoutes;
