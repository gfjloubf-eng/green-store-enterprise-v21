import TokenService from './auth-token-service';
import PasswordResetRepository from '../repositories/password-reset-repository';
import PasswordService from './auth-password-service';
import PrismaService from '../repositories/prisma-service';
import { REFRESH_TOKEN_EXP_SECONDS } from './auth-constants';
import RateLimiter from '../common/security/rate-limiter';
import { RateLimitError } from '../common/security/errors';

export class AuthResetService {
  // generate forgot-password token (longer TTL)
  async generateResetTokenByEmail(email: string, expiresInSec = 60 * 60): Promise<string> {
    // rate limit by email to avoid abuse
    if (!RateLimiter.check(`forgot:${email}`)) throw new RateLimitError('rate_limited');

    const client = PrismaService.getClient();
    const user = await client.user.findFirst({ where: { email } });
    if (!user) return ''; // do not reveal existence
    const token = TokenService.createRefreshToken(user.id, undefined, { purpose: 'password_reset' }, expiresInSec);
    await PasswordResetRepository.create(user.id, token, new Date(Date.now() + expiresInSec * 1000));
    return token;
  }

  async verifyResetToken(token: string) {
    const v = TokenService.verify(token);
    if (!v.valid || !v.payload) return { valid: false, error: v.error };
    if (v.payload.purpose !== 'password_reset') return { valid: false, error: 'invalid_purpose' };
    const rec = await PasswordResetRepository.findValidByToken(token);
    if (!rec) return { valid: false, error: 'invalid_or_expired' };
    return { valid: true, payload: v.payload, record: rec };
  }

  async resetPassword(token: string, newPassword: string) {
    const check = await this.verifyResetToken(token);
    if (!check.valid || !check.payload || !check.record) throw new Error(check.error ?? 'invalid_token');
    const userId = check.payload.sub as string;

    const strength = PasswordService.validateStrength(newPassword);
    if (!strength.valid) throw new Error('weak_password');

    const okHistory = await PasswordService.checkPasswordHistory(userId, newPassword);
    if (!okHistory) throw new Error('password_reuse');

    const hashed = await PasswordService.hash(newPassword);

    const client = PrismaService.getClient();
    await client.user.update({ where: { id: userId }, data: { passwordHash: hashed } });

    await PasswordService.addToHistory(userId, hashed);

    // mark password reset token used
    await PasswordResetRepository.markUsed(check.record.id);

    return true;
  }
}

export default new AuthResetService();