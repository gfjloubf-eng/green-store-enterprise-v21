import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { NotificationsController } from './controller';

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

export function createNotificationRoutes(controller: NotificationsController = new NotificationsController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  // GET /notifications — List user notifications & unread count
  builder.register({
    name: 'notification-list',
    method: 'GET',
    path: '/notifications',
    version: 'v1',
    handler: adapt((ctx) => controller.listUserNotifications(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['notifications'],
      middleware: [],
    },
  });

  // POST /notifications/:id/read — Mark single notification as read
  builder.register({
    name: 'notification-mark-read',
    method: 'POST',
    path: '/notifications/:id/read',
    version: 'v1',
    handler: adapt((ctx) => controller.markAsRead(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['notifications'],
      middleware: [],
    },
  });

  // POST /notifications/read-all — Mark all notifications as read
  builder.register({
    name: 'notification-mark-all-read',
    method: 'POST',
    path: '/notifications/read-all',
    version: 'v1',
    handler: adapt((ctx) => controller.markAllAsRead(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['notifications'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createNotificationRoutes;
