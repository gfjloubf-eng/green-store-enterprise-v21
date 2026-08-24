import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler, RouteOptions } from '../../routes';
import type { Permission } from '../../rbac';
import type { ControllerRequest } from '../../controllers';
import { uploadProductImage } from './media-upload';

function toControllerRequest(ctx: RouteExecutionContext): ControllerRequest {
  return {
    body: ctx.body,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: { metadata: { timestamp: new Date().toISOString(), version: 'v1' } },
  };
}

export function createProductMediaRoutes(): readonly RouteDefinition[] {
  const builder = new RouterBuilder();
  const options: RouteOptions = {
    mode: 'private',
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: ['products:create' as Permission],
    tags: ['products', 'media'],
    middleware: [],
  };
  builder.register({
    name: 'products-media-upload',
    method: 'POST',
    path: '/products/media/upload',
    version: 'v1',
    handler: (ctx) => uploadProductImage(toControllerRequest(ctx)),
    options,
  });
  return builder.build();
}
