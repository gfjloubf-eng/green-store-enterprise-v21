import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import PermissionsController from './controller';

function toControllerRequest<T>(ctx: RouteExecutionContext): ControllerRequest<T> {
  return {
    body: (ctx.body ?? undefined) as T | undefined,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: {
      metadata: {
        timestamp: new Date().toISOString(),
        version: (ctx.version as 'v1') ?? 'v1',
      },
    },
  };
}

function adapt(handler: (ctx: RouteExecutionContext) => Promise<unknown> | unknown): RouteHandler {
  return (context: RouteExecutionContext) => handler(context);
}

export function createPermissionRoutes(controller: PermissionsController = new PermissionsController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  builder.register({
    name: 'permissions-list',
    method: 'GET',
    path: '/permissions',
    version: 'v1',
    handler: adapt((ctx) => controller.list(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['permissions:read'],
      tags: ['permissions'],
      middleware: [],
    },
  });

  builder.register({
    name: 'permissions-get',
    method: 'GET',
    path: '/permissions/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.get(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['permissions:read'],
      tags: ['permissions'],
      middleware: [],
    },
  });

  builder.register({
    name: 'permissions-create',
    method: 'POST',
    path: '/permissions',
    version: 'v1',
    handler: adapt((ctx) => controller.create(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['permissions:create'],
      tags: ['permissions'],
      middleware: [],
    },
  });

  builder.register({
    name: 'permissions-update',
    method: 'PUT',
    path: '/permissions/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.update(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['permissions:update'],
      tags: ['permissions'],
      middleware: [],
    },
  });

  builder.register({
    name: 'permissions-delete',
    method: 'DELETE',
    path: '/permissions/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.remove(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['permissions:delete'],
      tags: ['permissions'],
      middleware: [],
    },
  });

  builder.register({
    name: 'permissions-restore',
    method: 'PATCH',
    path: '/permissions/:id/restore',
    version: 'v1',
    handler: adapt((ctx) => controller.restore(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['permissions:update'],
      tags: ['permissions'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createPermissionRoutes;
