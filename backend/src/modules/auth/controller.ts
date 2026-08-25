import { HTTP_STATUS, success, noContent } from '../../api';
import type { ApiMeta, ApiResponse } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { AccountLockedError, RateLimitError, UnauthorizedError, InvalidTokenError } from '../../common/security/errors';
import { ValidationException } from '../../validation';
import PrismaService from '../../repositories/prisma-service';
import type { AuthResponseDto, RefreshTokenRequestDto, SignInRequestDto, SignOutRequestDto, ValidateResponseDto, CurrentUserDto } from '../../dto/auth';
import { AuthService } from '../../services/auth-service';
import { guardRequireAuth } from '../../common/security/auth-guards';
import { uploadAvatarImage } from './avatar-upload';

type ApiContextFields = Pick<ApiMeta, 'timestamp' | 'requestId' | 'version' | 'locale'>;

export class AuthController {
  constructor(private readonly authService: AuthService = AuthController.createAuthService()) {}

  public static createAuthService(): AuthService {
    return new AuthService(async (identifier: string) => {
      const client = PrismaService.getClient();
      return client.user.findFirst({ where: { email: identifier } });
    });
  }

  public async signIn(request: ControllerRequest<SignInRequestDto>): Promise<ApiResponse<AuthResponseDto>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.identifier !== 'string' || !body.identifier || typeof body.password !== 'string' || !body.password) {
      return this.errorResponse('bad_request', 'identifier_and_password_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const result = await this.authService.signIn(body.identifier, body.password, body.deviceId, this.requestMeta(request));
      return success<AuthResponseDto>(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async refresh(request: ControllerRequest<RefreshTokenRequestDto>): Promise<ApiResponse<AuthResponseDto>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.refreshToken !== 'string' || !body.refreshToken) {
      return this.errorResponse('bad_request', 'refresh_token_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const result = await this.authService.refresh(body.refreshToken, this.requestMeta(request));
      return success<AuthResponseDto>(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async signOut(request: ControllerRequest<SignOutRequestDto>): Promise<ApiResponse<null>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.refreshToken !== 'string' || !body.refreshToken) {
      return this.errorResponse('bad_request', 'refresh_token_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request));
      return success<null>(null, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Logout endpoint — invalidates refresh token and session and returns HTTP 204 No Content
  public async logout(request: ControllerRequest<SignOutRequestDto>): Promise<ApiResponse<null>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.refreshToken !== 'string' || !body.refreshToken) {
      return this.errorResponse('bad_request', 'refresh_token_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request));
      return noContent(ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async validate(request: ControllerRequest): Promise<ApiResponse<ValidateResponseDto>> {
    const ctx = this.createApiContext(request);
    const authorization = this.headerValue(request, 'authorization');
    const match = authorization?.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];

    if (!token) {
      return this.errorResponse('unauthorized', 'access_token_required', HTTP_STATUS.UNAUTHORIZED, ctx);
    }

    try {
      const result = await this.authService.validateAccessToken(token);
      return success<ValidateResponseDto>({ valid: result.valid }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // GET /auth/me — return current authenticated user
  public async me(request: ControllerRequest): Promise<ApiResponse<CurrentUserDto>> {
    const ctx = this.createApiContext(request);
    const authorization = this.headerValue(request, 'authorization');

    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub as string | undefined;
      if (!userId) return this.errorResponse('unauthorized', 'missing_sub', HTTP_STATUS.UNAUTHORIZED, ctx);

      const result = await this.authService.getCurrentUser(userId);
      if (!result) return this.errorResponse('not_found', 'user_not_found', HTTP_STATUS.NOT_FOUND, ctx);
      return success<CurrentUserDto>(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Public Customer Registration
  public async signUp(request: ControllerRequest<any>): Promise<ApiResponse<AuthResponseDto>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.email !== 'string' || typeof body.password !== 'string') {
      return this.errorResponse('bad_request', 'email_and_password_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const result = await this.authService.signUp({
        name: String(body.name ?? body.displayName ?? body.email),
        email: String(body.email),
        password: String(body.password),
        confirmPassword: body.confirmPassword ? String(body.confirmPassword) : undefined,
        phone: body.phone ? String(body.phone) : undefined,
      });
      return success<AuthResponseDto>(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Change Password
  public async changePassword(request: ControllerRequest<any>): Promise<ApiResponse<{ message: string }>> {
    const ctx = this.createApiContext(request);
    const authorization = this.headerValue(request, 'authorization');
    const body = request.body;

    if (!this.isObject(body) || typeof body.currentPassword !== 'string' || typeof body.newPassword !== 'string') {
      return this.errorResponse('bad_request', 'current_and_new_password_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub as string | undefined;
      if (!userId) return this.errorResponse('unauthorized', 'missing_sub', HTTP_STATUS.UNAUTHORIZED, ctx);

      await this.authService.changePassword(userId, String(body.currentPassword), String(body.newPassword), body.confirmPassword ? String(body.confirmPassword) : undefined);
      return success<{ message: string }>({ message: 'password_changed_successfully' }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Forgot Password — Request reset link
  public async forgotPassword(request: ControllerRequest<any>): Promise<ApiResponse<{ message: string }>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.email !== 'string' || !body.email) {
      return this.errorResponse('bad_request', 'email_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const { default: resetService } = await import('../../services/auth-reset-service');
      await resetService.generateResetTokenByEmail(String(body.email));
      return success<{ message: string }>({ message: 'If the email exists, a password reset token has been generated.' }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Reset Password — Submit reset token & new password
  public async resetPassword(request: ControllerRequest<any>): Promise<ApiResponse<{ message: string }>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.token !== 'string' || typeof body.newPassword !== 'string') {
      return this.errorResponse('bad_request', 'token_and_new_password_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const { default: resetService } = await import('../../services/auth-reset-service');
      await resetService.resetPassword(String(body.token), String(body.newPassword));
      return success<{ message: string }>({ message: 'password_reset_successfully' }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Update Profile
  public async updateProfile(request: ControllerRequest<any>): Promise<ApiResponse<CurrentUserDto>> {
    const ctx = this.createApiContext(request);
    const authorization = this.headerValue(request, 'authorization');
    const body = request.body;

    if (!this.isObject(body)) {
      return this.errorResponse('bad_request', 'body_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub as string | undefined;
      if (!userId) return this.errorResponse('unauthorized', 'missing_sub', HTTP_STATUS.UNAUTHORIZED, ctx);

      const result = await this.authService.updateProfile(userId, {
        name: body.name ? String(body.name) : undefined,
        displayName: body.displayName ? String(body.displayName) : undefined,
        phone: body.phone ? String(body.phone) : undefined,
      });
      return success<CurrentUserDto>(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  public async uploadAvatar(request: ControllerRequest<any>): Promise<ApiResponse<{ avatarUrl: string }>> {
    const ctx = this.createApiContext(request);
    try {
      const payload = await guardRequireAuth(this.headerValue(request, 'authorization'));
      const userId = payload?.sub as string | undefined;
      if (!userId) return this.errorResponse('unauthorized', 'missing_sub', HTTP_STATUS.UNAUTHORIZED, ctx);
      const uploaded = await uploadAvatarImage(request, userId);
      const client = PrismaService.getClient();
      await client.$executeRawUnsafe('UPDATE "users" SET "avatarUrl" = $1 WHERE "id" = $2', uploaded.url, userId);
      return success({ avatarUrl: uploaded.url }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Email Verification: Send verification token
  public async sendVerification(request: ControllerRequest<any>): Promise<ApiResponse<{ message: string }>> {
    const ctx = this.createApiContext(request);
    const authorization = this.headerValue(request, 'authorization');

    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub as string | undefined;
      if (!userId) return this.errorResponse('unauthorized', 'missing_sub', HTTP_STATUS.UNAUTHORIZED, ctx);

      const { default: emailVerificationService } = await import('../../services/auth-email-verification-service');
      await emailVerificationService.generateVerificationToken(userId);
      return success<{ message: string }>({ message: 'verification_token_sent' }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  // Email Verification: Verify token
  public async verifyEmail(request: ControllerRequest<any>): Promise<ApiResponse<{ message: string }>> {
    const ctx = this.createApiContext(request);
    const body = request.body;

    if (!this.isObject(body) || typeof body.token !== 'string' || !body.token) {
      return this.errorResponse('bad_request', 'token_required', HTTP_STATUS.BAD_REQUEST, ctx);
    }

    try {
      const { default: emailVerificationService } = await import('../../services/auth-email-verification-service');
      const ok = await emailVerificationService.activateAccount(String(body.token));
      if (!ok) return this.errorResponse('bad_request', 'invalid_or_expired_token', HTTP_STATUS.BAD_REQUEST, ctx);
      return success<{ message: string }>({ message: 'email_verified_successfully' }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }

  private requestMeta(request: ControllerRequest): { ip?: string; userAgent?: string } {
    return {
      ip: this.headerValue(request, 'x-forwarded-for') ?? this.headerValue(request, 'x-real-ip'),
      userAgent: this.headerValue(request, 'user-agent'),
    };
  }

  private createApiContext(request: ControllerRequest): ApiContextFields {
    return {
      timestamp: request.context?.metadata?.timestamp ?? new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: (request.context?.metadata?.version ?? 'v1') as ApiMeta['version'],
      locale: request.context?.metadata?.locale,
    };
  }

  private headerValue(request: ControllerRequest, name: string): string | undefined {
    const value = request.headers?.[name.toLowerCase()];
    if (Array.isArray(value)) return value[0];
    return value;
  }

private mapError(error: unknown, ctx: ApiContextFields): ApiResponse<never> {
   if (error instanceof ValidationException) {
     return this.errorResponse('bad_request', error.message || 'bad_request', HTTP_STATUS.BAD_REQUEST, ctx);
   }
   if (error instanceof UnauthorizedError) {
     return this.errorResponse('unauthorized', error.message || 'unauthorized', HTTP_STATUS.UNAUTHORIZED, ctx);
   }
   if (error instanceof InvalidTokenError) {
     return this.errorResponse('unauthorized', error.message || 'invalid_token', HTTP_STATUS.UNAUTHORIZED, ctx);
   }
   if (error instanceof AccountLockedError) {
     return this.errorResponse('account_locked', error.message || 'account_locked', 423, ctx);
   }
   if (error instanceof RateLimitError) {
     return this.errorResponse('rate_limited', error.message || 'rate_limited', 429, ctx);
   }
   return this.errorResponse('internal_error', error instanceof Error ? error.message : 'internal_error', HTTP_STATUS.INTERNAL_SERVER_ERROR, ctx);
}

  private errorResponse(code: string, message: string, statusCode: number, ctx: ApiContextFields): ApiResponse<never> {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale,
        },
      },
    };
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}

export default AuthController;

