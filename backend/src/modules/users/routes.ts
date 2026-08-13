import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import UsersController from './controller';

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

export function createUserRoutes(controller: UsersController = new UsersController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  builder.register({
    name: 'users-list',
    method: 'GET',
    path: '/users',
    version: 'v1',
    handler: adapt((ctx) => controller.list(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['users:read'],
      tags: ['users'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-get',
    method: 'GET',
    path: '/users/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.get(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['users:read'],
      tags: ['users'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-create',
    method: 'POST',
    path: '/users',
    version: 'v1',
    handler: adapt((ctx) => controller.create(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['users:create'],
      tags: ['users'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-update',
    method: 'PUT',
    path: '/users/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.update(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['users:update'],
      tags: ['users'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-delete',
    method: 'DELETE',
    path: '/users/:id',
    version: 'v1',
    handler: adapt((ctx) => controller.remove(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['users:delete'],
      tags: ['users'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-restore',
    method: 'PATCH',
    path: '/users/:id/restore',
    version: 'v1',
    handler: adapt((ctx) => controller.restore(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ['users:update'],
      tags: ['users'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-roles-list',
    method: 'GET',
    path: '/users/:userId/roles',
    version: 'v1',
    handler: adapt((ctx) => controller.listRoles(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ['users', 'roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-roles-assign',
    method: 'POST',
    path: '/users/:userId/roles',
    version: 'v1',
    handler: adapt((ctx) => controller.assignRole(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ['users', 'roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-roles-check',
    method: 'GET',
    path: '/users/:userId/roles/:roleId',
    version: 'v1',
    handler: adapt((ctx) => controller.checkRole(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ['users', 'roles'],
      middleware: [],
    },
  });

  builder.register({
    name: 'users-roles-remove',
    method: 'DELETE',
    path: '/users/:userId/roles/:roleId',
    version: 'v1',
    handler: adapt((ctx) => controller.removeRole(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ['users', 'roles'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createUserRoutes;
