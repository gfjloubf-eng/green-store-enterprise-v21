import type { RouteDefinition, RouteGroup, RouteMethod, RouteVersion } from './contracts';
import { createRouteMetadata } from './metadata';

export class RouteRegistry {
  private readonly routes = new Map<string, RouteDefinition>();
  private readonly versions = new Map<RouteVersion, RouteDefinition[]>();
  private readonly tags = new Map<string, RouteDefinition[]>();
  private readonly middlewarePipeline: string[] = [];

  public register(route: RouteDefinition): RouteDefinition {
    const key = this.createKey(route.method, route.path, route.version);
    this.routes.set(key, route);

    this.addToIndex(this.versions, route.version, route);
    for (const tag of route.metadata.tags) {
      this.addToIndex(this.tags, tag, route);
    }

    return route;
  }

  public registerGroup(group: RouteGroup): RouteDefinition[] {
    const definitions: RouteDefinition[] = [];
    const resolvedVersion = group.version ?? 'v1';
    const prefix = group.prefix.startsWith('/') ? group.prefix : `/${group.prefix}`;

    for (const route of group.routes) {
      const normalizedPath = this.normalizePath(prefix, route.path);
      const metadata = createRouteMetadata(route.name, normalizedPath, resolvedVersion, {
        ...route.metadata,
        ...group.metadata,
        name: route.name,
        path: normalizedPath,
        version: resolvedVersion,
      });

      const definition: RouteDefinition = {
        ...route,
        path: normalizedPath,
        version: resolvedVersion,
        metadata,
      };

      this.register(definition);
      definitions.push(definition);
    }

    return definitions;
  }

  public registerMiddleware(middlewareName: string): void {
    this.middlewarePipeline.push(middlewareName);
  }

  public getMiddlewarePipeline(): readonly string[] {
    return [...this.middlewarePipeline];
  }

  public all(): readonly RouteDefinition[] {
    return Array.from(this.routes.values());
  }

  public findByName(name: string): RouteDefinition | undefined {
    return Array.from(this.routes.values()).find((route) => route.name === name);
  }

  public findByPath(method: RouteMethod, path: string, version?: RouteVersion): RouteDefinition | undefined {
    // Try direct match first
    const candidates = Array.from(this.routes.values()).filter((route) => route.method === method && route.path === path);
    if (candidates.length > 0) {
      if (!version) return candidates[0];
      return candidates.find((route) => route.version === version) ?? candidates[0];
    }

    // Fallback: attempt parameterized path matching (e.g., /users/:id)
    const methodCandidates = Array.from(this.routes.values()).filter((route) => route.method === method);
    for (const route of methodCandidates) {
      const routeParts = route.path.split('/').filter(Boolean);
      const pathParts = path.split('/').filter(Boolean);
      if (routeParts.length !== pathParts.length) continue;

      const params: Record<string, string> = {};
      let matched = true;
      for (let i = 0; i < routeParts.length; i++) {
        const rp = routeParts[i];
        const pp = pathParts[i];
        if (rp.startsWith(':')) {
          const name = rp.substring(1);
          params[name] = decodeURIComponent(pp);
        } else if (rp !== pp) {
          matched = false;
          break;
        }
      }

      if (matched) {
        // Attach runtime params to a shallow copy so original route metadata remains unchanged
        const copy = { ...route, runtimeParams: params } as RouteDefinition & { runtimeParams?: Record<string, string> };
        // Respect version if provided
        if (!version) return copy;
        if (copy.version === version) return copy;
      }
    }

    return undefined;
  }

  public findByVersion(version: RouteVersion): readonly RouteDefinition[] {
    return [...(this.versions.get(version) ?? [])];
  }

  public findByTag(tag: string): readonly RouteDefinition[] {
    return [...(this.tags.get(tag) ?? [])];
  }

  private createKey(method: RouteMethod, path: string, version: RouteVersion): string {
    return `${method}:${version}:${path}`;
  }

  private normalizePath(prefix: string, path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${prefix}${normalizedPath}`;
  }

  private addToIndex<T>(map: Map<T, RouteDefinition[]>, key: T, route: RouteDefinition): void {
    const existing = map.get(key) ?? [];
    existing.push(route);
    map.set(key, existing);
  }
}
