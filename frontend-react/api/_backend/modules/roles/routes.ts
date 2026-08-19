import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import RolesController from './controller';

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

export function createRoleRoutes(controller: RolesController = new RolesController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  builder.register({
    name: 'roles-list',
    method: 'GET',
    path: '/roles',
    version: 'v1',
    handler: adapt((ctx) => controller.list(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:read'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-get',
    method: 'GET',
    path: '/roles/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.get(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:read'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-create',
    method: 'POST',
    path: '/roles',
    version: 'v1',
    handler: adapt((ctx) => controller.create(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:create'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-update',
    method: 'PUT',
    path: '/roles/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.update(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:update'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-delete',
    method: 'DELETE',
    path: '/roles/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.remove(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:delete'],
      tags: ['roles'],
      middleware: [],
    },
  });

builder.register({
    name: 'roles-restore',
    method: 'PATCH',
    path: '/roles/:id/restore',
    version: 'v1',
    handler: adapt((ctx) => controller.restore(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:update'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-permissions-list',
    method: 'GET',
    path: '/roles/:roleId/permissions',
    version: 'v1',
    handler: adapt((ctx) => controller.listPermissions(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:read'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-permissions-assign',
    method: 'POST',
    path: '/roles/:roleId/permissions',
    version: 'v1',
    handler: adapt((ctx) => controller.assignPermission(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:update'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-permissions-get',
    method: 'GET',
    path: '/roles/:roleId/permissions/:permissionId',
    version: 'v1',
    handler: adapt((ctx) => controller.checkPermission(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:read'],
      tags: ['roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'roles-permissions-remove',
    method: 'DELETE',
    path: '/roles/:roleId/permissions/:permissionId',
    version: 'v1',
    handler: adapt((ctx) => controller.removePermission(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['roles:update'],
      tags: ['roles'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createRoleRoutes;
