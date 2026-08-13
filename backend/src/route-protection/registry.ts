import type { ProtectedRoute, RouteSecurityMetadata } from './types';
import { createRouteMetadata } from './utils';

export class RouteProtectionRegistry {
  private readonly routes = new Map<string, ProtectedRoute>();

  public register(route: ProtectedRoute): void {
    this.routes.set(route.path, route);
  }

  public get(path: string): ProtectedRoute | undefined {
    return this.routes.get(path);
  }

  public list(): ProtectedRoute[] {
    return Array.from(this.routes.values());
  }

  public createMetadata(options: Omit<RouteSecurityMetadata, 'name' | 'path'> & { name: string; path: string }): RouteSecurityMetadata {
    return createRouteMetadata(options);
  }
}

export default new RouteProtectionRegistry();
