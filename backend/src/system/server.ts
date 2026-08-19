import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { forbidden, unauthorized } from '../api';
import type { ApiResponse } from '../api';
import { RouteResolver, type RouteDefinition, type RouteMethod } from '../routes';
import { RouteRegistry } from '../routes';
import { createAuthRoutes } from '../modules/auth/routes';
import { AuthController } from '../modules/auth/controller';
import { RouteProtectionFactory } from '../route-protection';
import { validateAccessToken } from '../common/security/jwt-middleware';
import { createSystemRoutes } from './routes';
import { createUserRoutes } from '../modules/users/routes';
import { createRoleRoutes } from '../modules/roles/routes';
import { createPermissionRoutes } from '../modules/permissions/routes';
import { createProductRoutes } from '../modules/products/routes';
import { createCustomerRoutes } from '../modules/customers/routes';
import { createCartRoutes } from '../modules/cart/routes';
import { createOrderRoutes } from '../modules/orders/routes';
import { createInventoryRoutes } from '../modules/inventory/routes';
import { createPaymentRoutes } from '../modules/payments/routes';
import { createSettingsRoutes } from '../modules/settings/routes';
import { createNotificationRoutes } from '../modules/notifications/routes';
import { createSupportRoutes } from '../modules/support/routes';
import { createReportsRoutes } from '../modules/reports/routes';
import { createAuditRoutes } from '../modules/audit/routes';
import { UnauthorizedError, InvalidTokenError } from '../common/security/errors';

async function readBody(request: IncomingMessage): Promise<unknown> {
  const reqAny = request as any;
  if (reqAny.body !== undefined && reqAny.body !== null) {
    if (typeof reqAny.body === 'object') return reqAny.body;
    if (typeof reqAny.body === 'string') {
      try { return JSON.parse(reqAny.body); } catch { return reqAny.body; }
    }
  }

  const chunks: Buffer[] = [];
  try {
    for await (const chunk of request) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
  } catch {
    // Ignore stream read error if already consumed
  }

  if (chunks.length === 0) {
    return undefined;
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function createSystemRequestHandler() {
  const registry = new RouteRegistry();
  const resolver = new RouteResolver();
  const protection = new RouteProtectionFactory();
  const authService = AuthController.createAuthService();
  const routes = [...createSystemRoutes(), ...createAuthRoutes(), ...createUserRoutes(), ...createRoleRoutes(), ...createPermissionRoutes(), ...createProductRoutes(), ...createCustomerRoutes(), ...createCartRoutes(), ...createOrderRoutes(), ...createInventoryRoutes(), ...createPaymentRoutes(), ...createSettingsRoutes(), ...createNotificationRoutes(), ...createSupportRoutes(), ...createReportsRoutes(), ...createAuditRoutes()];

  for (const route of routes) {
    registry.register(route);
  }

  return async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const origin = (request.headers.origin as string) || '*';
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.setHeader('Access-Control-Allow-Credentials', 'true');
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.setHeader('X-Frame-Options', 'DENY');
      response.setHeader('X-XSS-Protection', '1; mode=block');
      response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

      if (request.method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
      }

      const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
      let targetPath = url.searchParams.get('path') || url.pathname;
      if (targetPath.startsWith('/api/')) {
        targetPath = targetPath.substring(4);
      }
      const resolved = resolver.resolve(registry, {
        method: (request.method ?? 'GET') as RouteMethod,
        path: targetPath,
        version: 'v1',
      });

      if (!resolved) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ success: false, error: { code: 'not_found', message: 'route_not_found' } }));
        return;
      }

      const route = resolved as any;
      const body = await readBody(request);
      const headers = request.headers as Record<string, string | string[] | undefined>;
      const query: Record<string, string | string[] | undefined> = {};
      for (const [key, value] of url.searchParams.entries()) {
        if (key !== 'path') {
          query[key] = value;
        }
      }

      const params = (route.runtimeParams as Record<string, string> | undefined) ?? {};
      let currentUser: any = undefined;

      if (route.metadata.mode !== 'public') {
        const authorization = headers.authorization;
        const authorizationHeader = Array.isArray(authorization) ? authorization[0] : authorization;
        const tokenMatch = authorizationHeader?.match(/^Bearer\s+(.+)$/i);
        if (!tokenMatch) {
          const result = unauthorized('authentication_required', {
            timestamp: new Date().toISOString(),
            version: 'v1',
          });
          response.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(result.body));
          return;
        }

        const tokenPayload = await validateAccessToken(tokenMatch[1]);
        const user = await authService.getCurrentUser(String(tokenPayload.sub));
        if (!user) {
          const result = unauthorized('authentication_required', {
            timestamp: new Date().toISOString(),
            version: 'v1',
          });
          response.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(result.body));
          return;
        }

        currentUser = user;

        const protectionResult = protection.protectRoute({
          route: {
            name: route.name,
            path: route.path,
            metadata: route.metadata,
          },
          user,
        });
        if (!protectionResult.authorized) {
          const result = forbidden('authorization_denied', {
            timestamp: new Date().toISOString(),
            version: 'v1',
          });
          response.writeHead(result.statusCode, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(result.body));
          return;
        }
      }

      const payload = await Promise.resolve(route.handler({
        name: route.name,
        method: route.method,
        path: route.path,
        version: route.version,
        metadata: route.metadata,
        body,
        headers,
        query,
        params,
        user: currentUser,
      } as any));

      const apiResponse = payload as ApiResponse<unknown>;
      response.writeHead(apiResponse.statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(apiResponse.body));
    } catch (error) {
      // Map authentication token errors to 401 for clearer client responses
      try {
        if (error instanceof UnauthorizedError || error instanceof InvalidTokenError || ((error as any)?.code === 'invalid_token') || ((error as any)?.message && /invalid|token|signature|expired/i.test((error as any).message))) {
          response.writeHead(401, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ success: false, error: { code: 'unauthorized', message: error instanceof Error ? error.message : 'unauthorized' } }));
          return;
        }
      } catch (e) {
        // swallow helper errors and fall through to internal error
      }

      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ success: false, error: { code: 'internal_error', message: error instanceof Error ? error.message : 'internal_error' } }));
    }
  };
}

export function startSystemServer(port: number = Number(process.env.PORT ?? 3000)) {
  const handler = createSystemRequestHandler();
  const server = createServer(handler);

  server.listen(port, () => {
    console.log(`System backend listening on http://127.0.0.1:${port}`);
  });

  return server;
}
