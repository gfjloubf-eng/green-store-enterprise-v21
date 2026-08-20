import TokenService from './auth-token-service';
import SessionService from './auth-session-service';
import PasswordService from './auth-password-service';
import DeviceService from './auth-device-service';
import { REFRESH_TOKEN_EXP_SECONDS } from './auth-constants';
import AuthAuditService from './auth-audit-service';
import TokenBlacklistRepository from '../repositories/token-blacklist-repository';
import LoginHistoryRepository from '../repositories/login-history-repository';
import NotificationRepository from '../repositories/notification-repository';
import RateLimiter from '../common/security/rate-limiter';
import PrismaService from '../repositories/prisma-service';
import crypto from 'crypto';
import { AccountLockedError, RateLimitError, UnauthorizedError } from '../common/security/errors';
import { ValidationException } from '../validation';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  constructor(private readonly userLookup: (identifier: string) => Promise<any>) {}

  // Customer Public Registration Flow (Role is strictly CUSTOMER)
  async signUp(data: { name: string; email: string; password: string; confirmPassword?: string; phone?: string }): Promise<AuthResult> {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;
    const name = data.name?.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationException('email_invalid');
    }
    if (!password || password.length < 8) {
      throw new ValidationException('password_too_short');
    }
    if (data.confirmPassword && data.confirmPassword !== password) {
      throw new ValidationException('password_confirmation_mismatch');
    }
    if (!name) {
      throw new ValidationException('name_required');
    }

    const client = PrismaService.getClient();

    const existing = await client.user.findFirst({ where: { email } });
    if (existing) {
      throw new ValidationException('email_already_exists');
    }

    const phone = data.phone?.trim() || null;
    if (phone) {
      const existingPhoneUser = await client.user.findFirst({ where: { phone } });
      const existingPhoneCustomer = await client.customer.findFirst({ where: { phone } });
      if (existingPhoneUser || existingPhoneCustomer) {
        throw new ValidationException('phone_already_exists');
      }
    }

    const passwordHash = await PasswordService.hash(password);

    await client.$transaction(async (tx) => {
      let customerRole = await tx.role.findFirst({ where: { name: 'CUSTOMER' } });
      if (!customerRole) {
        customerRole = await tx.role.create({
          data: {
            name: 'CUSTOMER',
            description: 'Standard Customer Role',
          },
        });
      }

      const user = await tx.user.create({
        data: {
          email,
          displayName: name,
          passwordHash,
          phone,
          isActive: true,
          isVerified: true,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: customerRole.id,
        },
      });

      const parts = name.split(' ');
      const firstName = parts[0] || name;
      const lastName = parts.slice(1).join(' ') || 'Customer';
      const customerCode = `CUST-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      await tx.customer.create({
        data: {
          userId: user.id,
          customerCode,
          firstName,
          lastName,
          fullName: name,
          email,
          phone,
          status: 'ACTIVE',
        },
      });
    });

    try {
      await new NotificationRepository().createForManagementUsers({
        title: 'عميل جديد سجل في المتجر',
        body: `${name} (${email}) أنشأ حساب عميل جديد.`,
        channel: 'admin',
        payload: { type: 'customer_registered', customerEmail: email },
      });
    } catch {
      // Notification delivery must not make a successful registration fail.
    }

    return this.signIn(email, password);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string, confirmPassword?: string): Promise<boolean> {
    if (!newPassword || newPassword.length < 8) {
      throw new ValidationException('password_too_short');
    }
    if (confirmPassword && confirmPassword !== newPassword) {
      throw new ValidationException('password_confirmation_mismatch');
    }

    const client = PrismaService.getClient();
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('user_not_found');
    }

    const ok = await PasswordService.verify(currentPassword, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedError('invalid_current_password');
    }

    const hashed = await PasswordService.hash(newPassword);
    await client.user.update({
      where: { id: userId },
      data: { passwordHash: hashed },
    });

    await PasswordService.addToHistory(userId, hashed);
    return true;
  }

  async updateProfile(userId: string, data: { name?: string; displayName?: string; phone?: string }): Promise<any> {
    const client = PrismaService.getClient();
    const displayName = data.displayName ?? data.name;

    const updateData: any = {};
    if (displayName) updateData.displayName = displayName.trim();
    if (data.phone !== undefined) updateData.phone = data.phone?.trim() ?? null;

    if (Object.keys(updateData).length > 0) {
      await client.user.update({
        where: { id: userId },
        data: updateData,
      });

      const customer = await client.customer.findFirst({ where: { userId } });
      if (customer) {
        const name = displayName?.trim() || customer.fullName;
        const parts = name.split(' ');
        await client.customer.update({
          where: { id: customer.id },
          data: {
            fullName: name,
            firstName: parts[0] || name,
            lastName: parts.slice(1).join(' ') || customer.lastName,
            phone: data.phone !== undefined ? (data.phone?.trim() ?? null) : customer.phone,
          },
        });
      }
    }

    return this.getCurrentUser(userId);
  }

  // Sign-in flow (architecture only)
  async signIn(identifier: string, password: string, deviceId?: string, meta?: { ip?: string; userAgent?: string }): Promise<AuthResult> {
    const ip = meta?.ip;
    const ua = meta?.userAgent;

    // rate limit by ip and identifier
    try {
      if (ip && !RateLimiter.check(`login:ip:${ip}`)) throw new RateLimitError('rate_limited');
      if (!RateLimiter.check(`login:identifier:${identifier}`)) throw new RateLimitError('rate_limited');
    } catch (e) {
      throw e;
    }

    // 1. Lookup user (injected)
    const user = await this.userLookup(identifier);
    if (!user) {
      // avoid user enumeration
      await AuthAuditService.recordLoginAttempt(null, identifier, ip, ua, false, 'invalid_credentials');
      throw new UnauthorizedError('invalid_credentials');
    }

    // 2. Check account lock
    const locked = await AuthAuditService.isAccountLocked(user.id);
    if (locked) throw new AccountLockedError('account_locked');

    // 3. Verify password
    const ok = await PasswordService.verify(password, user.passwordHash);
    if (!ok) {
      await AuthAuditService.recordLoginAttempt(user.id, user.email, ip, ua, false, 'invalid_credentials');

      const maxAttempts = Number(process.env.FAILED_LOGIN_MAX_ATTEMPTS ?? 5);
      const recent = await LoginHistoryRepository.recentFailedCountByUser(user.id, Number(process.env.FAILED_LOGIN_WINDOW_MINUTES ?? 15));
      if (recent >= maxAttempts) {
        await AuthAuditService.lockAccount(user.id, 'too_many_failed_attempts');
        throw new AccountLockedError('account_locked');
      }

      throw new UnauthorizedError('invalid_credentials');
    }

    // 4. Register device (optional)
    if (deviceId) {
      await DeviceService.registerDevice(user.id, deviceId);
    }

    // 5. Generate tokens
    const refreshToken = TokenService.createRefreshToken(user.id);
    const parsed = TokenService.verify(refreshToken);
    const rjti = parsed.payload?.jti as string;

    // 6. Persist refresh token and session via repositories
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXP_SECONDS * 1000);
    await (await import('../repositories/refresh-token-repository')).default.create(user.id, refreshToken, expiresAt);
    await SessionService.createSession(user.id, rjti, REFRESH_TOKEN_EXP_SECONDS, deviceId);

    const accessToken = TokenService.createAccessToken(user.id, { sid: rjti });

    // 7. Record successful login
    await AuthAuditService.recordLoginAttempt(user.id, user.email, ip, ua, true, 'success');

    return { accessToken, refreshToken, expiresIn: REFRESH_TOKEN_EXP_SECONDS };
  }

  async signOut(refreshToken: string, meta?: { ip?: string; userAgent?: string }): Promise<void> {
    const ip = meta?.ip;
    const ua = meta?.userAgent;

    const v = TokenService.verify(refreshToken);
    if (!v.valid || !v.payload) return;

    const jti = v.payload?.jti as string | undefined;
    const sub = v.payload?.sub as string | undefined;

    // blacklist by hash for audit & immediate blocking
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await TokenBlacklistRepository.addBlacklistByHash(sub ?? null, tokenHash, 'logout');

    if (jti) await SessionService.revokeSession(jti);
    await (await import('../repositories/refresh-token-repository')).default.revokeByHash(refreshToken);

    // audit logout
    if (sub) {
      const client = PrismaService.getClient();
      const user = await client.user.findUnique({ where: { id: sub } });
      const email = user?.email ?? null;
      await AuthAuditService.recordLoginAttempt(sub, email, ip, ua, true, 'logout');
    }
  }

  async refresh(refreshToken: string, meta?: { ip?: string; userAgent?: string }): Promise<AuthResult> {
    const ip = meta?.ip;
    const ua = meta?.userAgent;

    // check blacklist by token hash
    const incomingHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const blacklisted = await TokenBlacklistRepository.isBlacklistedByHash(incomingHash);
    if (blacklisted) throw new UnauthorizedError('token_revoked');

    const v = TokenService.verify(refreshToken);
    if (!v.valid || !v.payload) throw new UnauthorizedError(v.error ?? 'invalid_token');
    if (v.payload.typ !== 'refresh') throw new UnauthorizedError('invalid_token_type');
    const oldJti = v.payload.jti as string;
    const userId = v.payload.sub as string;

    // rate limit refresh per user
    if (!RateLimiter.check(`refresh:user:${userId}`)) throw new RateLimitError('rate_limited');

    const session = await SessionService.getSession(oldJti);
    if (!session || session.revoked) throw new UnauthorizedError('session_revoked');

    // rotate
    const newRefresh = TokenService.createRefreshToken(userId);
    const parsed = TokenService.verify(newRefresh);
    const newJti = parsed.payload?.jti as string;

    // persist rotation in refresh token repository and session repository
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXP_SECONDS * 1000);
    const rotatedRefresh = await (await import('../repositories/refresh-token-repository')).default.rotate(refreshToken, newRefresh, expiresAt);
    if (!rotatedRefresh) throw new UnauthorizedError('invalid_token');

    const rotatedSession = await SessionService.rotateSession(oldJti, newJti, REFRESH_TOKEN_EXP_SECONDS);
    if (!rotatedSession) throw new UnauthorizedError('session_revoked');

    // blacklist old refresh token by hash
    await TokenBlacklistRepository.addBlacklistByHash(userId ?? null, incomingHash, 'rotated');

    const accessToken = TokenService.createAccessToken(userId, { sid: newJti });

    return { accessToken, refreshToken: newRefresh, expiresIn: REFRESH_TOKEN_EXP_SECONDS };
  }

  async validateAccessToken(token: string): Promise<{ valid: boolean; payload?: any }> {
    const v = TokenService.verify(token);
    if (!v.valid) return { valid: false };
    if (v.payload?.typ !== 'access') return { valid: false };
    return { valid: true, payload: v.payload };
  }

  // Minimal: fetch current authenticated user info for /auth/me
  async getCurrentUser(userId: string): Promise<any> {
    const client = PrismaService.getClient();

    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        // tenant relation
        tenant: {
          select: { id: true, name: true, slug: true },
        },
        // user roles with role and branch (if any)
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                permissions: {
                  select: {
                    permission: { select: { resource: true, action: true } },
                  },
                },
              },
            },
            branch: {
              select: { id: true, name: true, storeId: true },
            },
          },
        },
      },
    });

    if (!user) return null;

    // derive role and permissions
    let primaryRole: string | null = null;
    const roles: string[] = [];
    const permissions = new Set<string>();
    let branch: { id: string; name?: string | null } | null = null;
    let store: { id: string; name?: string | null } | null = null;

    if (Array.isArray(user.roles) && user.roles.length > 0) {
      const r = user.roles[0];
      primaryRole = r.role?.name ?? null;

      for (const assignment of user.roles) {
        if (assignment.role?.name) {
          roles.push(String(assignment.role.name));
        }

        if (Array.isArray(assignment.role?.permissions)) {
          for (const rp of assignment.role.permissions) {
            if (rp?.permission) {
              permissions.add(`${rp.permission.resource}:${String(rp.permission.action).toLowerCase()}`);
            }
          }
        }
      }

      if (r.branch) {
        branch = { id: r.branch.id, name: r.branch.name };
        // try to load store name if storeId present
        if (r.branch.storeId) {
          const s = await client.store.findUnique({ where: { id: r.branch.storeId }, select: { id: true, name: true } });
          if (s) store = { id: s.id, name: s.name };
        }
      }
    }

    return {
      id: user.id,
      fullName: user.displayName ?? null,
      email: user.email,
      phone: user.phone ?? null,
      avatar: null,
      role: primaryRole,
      roles,
      permissions: [...permissions],
      tenant: user.tenant ?? null,
      store,
      branch,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

export default AuthService;