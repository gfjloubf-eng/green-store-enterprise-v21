import type { RouteDefinition, RouteGroup, RouteHandler, RouteMethod, RouteOptions, RouteVersion } from './contracts';
import { createRouteMetadata } from './metadata';
import { RouteRegistry } from './registry';

export interface RouteRegistrationInput {
  readonly name: string;
  readonly method: RouteMethod;
  readonly path: string;
  readonly version?: RouteVersion;
  readonly handler: RouteHandler;
  readonly options?: RouteOptions;
}

export class RouterBuilder {
  private readonly registry = new RouteRegistry();
  private readonly middlewarePipeline: string[] = [];

  public register(definition: RouteRegistrationInput): RouteDefinition {
    const version = definition.version ?? 'v1';
    const metadata = createRouteMetadata(definition.name, definition.path, version, {
      ...definition.options,
      middleware: [...(definition.options?.middleware ?? []), ...this.middlewarePipeline],
    });

    const route: RouteDefinition = {
      name: definition.name,
      method: definition.method,
      path: definition.path,
      version,
      handler: definition.handler as RouteDefinition['handler'],
      metadata,
    };

    return this.registry.register(route);
  }

  public registerGroup(group: RouteGroup): readonly RouteDefinition[] {
    return this.registry.registerGroup(group);
  }

  public registerVersion(version: RouteVersion): this {
    this.middlewarePipeline.push(`version:${version}`);
    return this;
  }

  public registerMiddleware(middlewareName: string): this {
    this.middlewarePipeline.push(middlewareName);
    return this;
  }

  public getRegistry(): RouteRegistry {
    return this.registry;
  }

  public build(): readonly RouteDefinition[] {
    return this.registry.all();
  }
}
