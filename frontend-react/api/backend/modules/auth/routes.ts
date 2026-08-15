import { RouterBuilder } from '../../routes';
import type { RouteDefinition, RouteExecutionContext, RouteHandler } from '../../routes';
import type { ControllerRequest } from '../../controllers';
import { AuthController } from './controller';

type AuthHandler = (ctx: RouteExecutionContext) => Promise<unknown> | unknown;

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

export function createAuthRoutes(controller: AuthController = new AuthController()): readonly RouteDefinition[] {
  const builder = new RouterBuilder();

  builder.register({
    name: 'auth-sign-in',
    method: 'POST',
    path: '/auth/sign-in',
    version: 'v1',
    handler: adapt((ctx) => controller.signIn(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  builder.register({
    name: 'auth-refresh',
    method: 'POST',
    path: '/auth/refresh',
    version: 'v1',
    handler: adapt((ctx) => controller.refresh(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  builder.register({
    name: 'auth-sign-out',
    method: 'POST',
    path: '/auth/sign-out',
    version: 'v1',
    handler: adapt((ctx) => controller.signOut(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // Logout endpoint: /auth/logout - invalidates refresh token and session; returns 204 No Content
  builder.register({
    name: 'auth-logout',
    method: 'POST',
    path: '/auth/logout',
    version: 'v1',
    handler: adapt((ctx) => controller.logout(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  builder.register({
    name: 'auth-validate',
    method: 'GET',
    path: '/auth/validate',
    version: 'v1',
    handler: adapt((ctx) => controller.validate(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // GET /auth/me — requires authentication
  builder.register({
    name: 'auth-me',
    method: 'GET',
    path: '/auth/me',
    version: 'v1',
    handler: adapt((ctx) => controller.me(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // POST /auth/sign-up & POST /auth/register — Public customer registration
  builder.register({
    name: 'auth-sign-up',
    method: 'POST',
    path: '/auth/sign-up',
    version: 'v1',
    handler: adapt((ctx) => controller.signUp(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  builder.register({
    name: 'auth-register',
    method: 'POST',
    path: '/auth/register',
    version: 'v1',
    handler: adapt((ctx) => controller.signUp(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // POST /auth/change-password — Private password change
  builder.register({
    name: 'auth-change-password',
    method: 'POST',
    path: '/auth/change-password',
    version: 'v1',
    handler: adapt((ctx) => controller.changePassword(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // POST /auth/forgot-password — Public forgot password request
  builder.register({
    name: 'auth-forgot-password',
    method: 'POST',
    path: '/auth/forgot-password',
    version: 'v1',
    handler: adapt((ctx) => controller.forgotPassword(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // POST /auth/reset-password — Public reset password submit
  builder.register({
    name: 'auth-reset-password',
    method: 'POST',
    path: '/auth/reset-password',
    version: 'v1',
    handler: adapt((ctx) => controller.resetPassword(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // PUT /auth/profile — Private profile update
  builder.register({
    name: 'auth-update-profile',
    method: 'PUT',
    path: '/auth/profile',
    version: 'v1',
    handler: adapt((ctx) => controller.updateProfile(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // POST /auth/send-verification — Private send verification token
  builder.register({
    name: 'auth-send-verification',
    method: 'POST',
    path: '/auth/send-verification',
    version: 'v1',
    handler: adapt((ctx) => controller.sendVerification(toControllerRequest(ctx))),
    options: {
      mode: 'private',
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  // POST /auth/verify-email — Public email verification token check
  builder.register({
    name: 'auth-verify-email',
    method: 'POST',
    path: '/auth/verify-email',
    version: 'v1',
    handler: adapt((ctx) => controller.verifyEmail(toControllerRequest(ctx))),
    options: {
      mode: 'public',
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ['auth'],
      middleware: [],
    },
  });

  return builder.build();
}

export default createAuthRoutes;


