import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import InvoicesController from './controller';
function toRequest(ctx: RouteExecutionContext): ControllerRequest { return { body: ctx.body as any, headers: ctx.headers, query: ctx.query, params: ctx.params, user: (ctx as any).user, context: { metadata: { timestamp: new Date().toISOString(), version: 'v1' } } } as any; }
function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown>): RouteHandler { return (ctx) => handler(ctx); }
export function createInvoiceRoutes(controller: InvoicesController = new InvoicesController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  builder.register({ name: 'invoice-public-get', method: 'GET', path: '/invoices/:id/public', version: 'v1', handler: adapt((ctx) => controller.getPublic(toRequest(ctx))), options: { mode: 'public', publicRoute: true, privateRoute: false, authenticationRequired: false, authorizationRequired: false, tags: ['invoices'], middleware: [] } });
  return builder.build();
}
export default createInvoiceRoutes;
