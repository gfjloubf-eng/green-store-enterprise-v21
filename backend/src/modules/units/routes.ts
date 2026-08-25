import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import UnitsController from './controller';

function toRequest(ctx: RouteExecutionContext): ControllerRequest {
  return { body: ctx.body as any, headers: ctx.headers, query: ctx.query, params: ctx.params, user: (ctx as any).user, context: { metadata: { timestamp: new Date().toISOString(), version: 'v1' } } } as any;
}
function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown>): RouteHandler { return (ctx) => handler(ctx); }

export function createUnitsRoutes(controller: UnitsController = new UnitsController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  const options = { mode: 'private' as const, publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: false, tags: ['units'], middleware: [] };
  builder.register({ name: 'units-list', method: 'GET', path: '/units', version: 'v1', handler: adapt((ctx) => controller.list(toRequest(ctx))), options });
  builder.register({ name: 'units-create', method: 'POST', path: '/units', version: 'v1', handler: adapt((ctx) => controller.create(toRequest(ctx))), options });
  builder.register({ name: 'units-update', method: 'PUT', path: '/units/:id', version: 'v1', handler: adapt((ctx) => controller.update(toRequest(ctx))), options });
  builder.register({ name: 'units-delete', method: 'DELETE', path: '/units/:id', version: 'v1', handler: adapt((ctx) => controller.remove(toRequest(ctx))), options });
  return builder.build();
}
export default createUnitsRoutes;
