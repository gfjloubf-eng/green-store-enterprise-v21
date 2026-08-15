import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { SettingsController } from './controller';

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

export function createSettingsRoutes(controller: SettingsController = new SettingsController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  // GET /settings/public — Public Store Settings Info (Public)
  builder.register({
    name: 'settings-public',
    method: 'GET',
    path: '/settings/public',
    version: 'v1',
    handler: adapt((ctx) => controller.getPublicSettings(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['settings'],
      middleware: [],
    },
  });

  // GET /admin/settings — Admin Settings List (Private)
  builder.register({
    name: 'settings-admin-get',
    method: 'GET',
    path: '/admin/settings',
    version: 'v1',
    handler: adapt((ctx) => controller.getAdminSettings(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['settings'],
      middleware: [],
    },
  });

  // PUT /admin/settings — Update Admin Settings (Private)
  builder.register({
    name: 'settings-admin-update',
    method: 'PUT',
    path: '/admin/settings',
    version: 'v1',
    handler: adapt((ctx) => controller.updateAdminSettings(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['settings'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createSettingsRoutes;
