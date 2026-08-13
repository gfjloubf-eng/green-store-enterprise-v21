import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { SupportController } from './controller';

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

export function createSupportRoutes(controller: SupportController = new SupportController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  // GET /support/contacts — Public Support Contacts (Public)
  builder.register({
    name: 'support-contacts',
    method: 'GET',
    path: '/support/contacts',
    version: 'v1',
    handler: adapt((ctx) => controller.getSupportContacts(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['support'],
      middleware: [],
    },
  });

  // POST /support/tickets — Create Support Ticket
  builder.register({
    name: 'support-ticket-create',
    method: 'POST',
    path: '/support/tickets',
    version: 'v1',
    handler: adapt((ctx) => controller.createTicket(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['support'],
      middleware: [],
    },
  });

  // GET /support/tickets — List Tickets
  builder.register({
    name: 'support-ticket-list',
    method: 'GET',
    path: '/support/tickets',
    version: 'v1',
    handler: adapt((ctx) => controller.listTickets(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['support'],
      middleware: [],
    },
  });

  // GET /support/tickets/:id — Get Ticket Details
  builder.register({
    name: 'support-ticket-get',
    method: 'GET',
    path: '/support/tickets/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.getTicketById(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['support'],
      middleware: [],
    },
  });

  // POST /support/tickets/:id/reply — Reply to Ticket
  builder.register({
    name: 'support-ticket-reply',
    method: 'POST',
    path: '/support/tickets/:id/reply',
    version: 'v1',
    handler: adapt((ctx) => controller.replyTicket(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['support'],
      middleware: [],
    },
  });

  // PATCH /support/tickets/:id/status — Update Ticket Status
  builder.register({
    name: 'support-ticket-status',
    method: 'PATCH',
    path: '/support/tickets/:id/status',
    version: 'v1',
    handler: adapt((ctx) => controller.updateTicketStatus(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['support'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createSupportRoutes;
