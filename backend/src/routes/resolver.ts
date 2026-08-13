import type { RouteDefinition, RouteMethod, RouteVersion } from './contracts';
import type { RouteRegistry } from './registry';

export interface RouteResolutionRequest {
  readonly method: RouteMethod;
  readonly path: string;
  readonly version?: RouteVersion;
}

export class RouteResolver {
  public resolve(registry: RouteRegistry, request: RouteResolutionRequest): RouteDefinition | undefined {
    return registry.findByPath(request.method, request.path, request.version);
  }

  public resolveByName(registry: RouteRegistry, name: string): RouteDefinition | undefined {
    return registry.findByName(name);
  }

  public resolveByVersion(registry: RouteRegistry, version: RouteVersion): readonly RouteDefinition[] {
    return registry.findByVersion(version);
  }

  public resolveByTag(registry: RouteRegistry, tag: string): readonly RouteDefinition[] {
    return registry.findByTag(tag);
  }
}
