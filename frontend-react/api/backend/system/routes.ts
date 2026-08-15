import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../routes';
import { RouterBuilder } from '../routes';
import { SystemController } from './controller';

export function createSystemRoutes(controller: SystemController = new SystemController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  const createHandler = (handler: RouteHandler): RouteHandler => {
    return (context: RouteExecutionContext) => handler(context);
  };

  builder.register({
    name: 'system-health',
    method: 'GET',
    path: '/health',
    version: 'v1',
    handler: createHandler(() => controller.getHealth()),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['system'],
      middleware: [],
    },
  });

  builder.register({
    name: 'system-ready',
    method: 'GET',
    path: '/ready',
    version: 'v1',
    handler: createHandler(() => controller.getReady()),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['system'],
      middleware: [],
    },
  });

  builder.register({
    name: 'system-live',
    method: 'GET',
    path: '/live',
    version: 'v1',
    handler: createHandler(() => controller.getLive()),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['system'],
      middleware: [],
    },
  });

  builder.register({
    name: 'system-version',
    method: 'GET',
    path: '/version',
    version: 'v1',
    handler: createHandler(() => controller.getVersion()),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['system'],
      middleware: [],
    },
  });

  return builder.build();
}
