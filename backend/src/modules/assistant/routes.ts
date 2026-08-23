import { RouterBuilder, type RouteDefinition, type RouteExecutionContext, type RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { AssistantController } from './controller';

function toControllerRequest<T>(ctx: RouteExecutionContext): ControllerRequest<T> {
  return {
    body: (ctx.body ?? undefined) as T | undefined,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: (ctx as any).user,
    context: { metadata: { timestamp: new Date().toISOString(), version: 'v1' } },
  } as any;
}

function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown> | unknown): RouteHandler {
  return (context: RouteExecutionContext) => handler(context);
}

export function createAssistantRoutes(controller: AssistantController = new AssistantController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  builder.register({
    name: 'assistant-chat',
    method: 'POST',
    path: '/assistant/chat',
    version: 'v1',
    handler: adapt((ctx) => controller.chat(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['assistant'],
      middleware: [],
    },
  });
  return builder.build();
}
