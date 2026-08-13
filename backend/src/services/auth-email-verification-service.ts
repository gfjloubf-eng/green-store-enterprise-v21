import TokenService from './auth-token-service';
import EmailVerificationRepository from '../repositories/email-verification-repository';
import PrismaService from '../repositories/prisma-service';

export class EmailVerificationService {
  private repo = EmailVerificationRepository;

  async generateVerificationToken(userId: string, expiresInSec = 60 * 60 * 24): Promise<string> {
    const token = TokenService.createRefreshToken(userId, undefined, { purpose: 'email_verification' }, expiresInSec);
    const parsed = TokenService.verify(token);
    const jti = parsed.payload?.jti as string;
    await this.repo.create(userId, token, new Date(Date.now() + expiresInSec * 1000));
    return token;
  }

  async verifyToken(token: string): Promise<{ valid: boolean; payload?: any; error?: string }> {
    const v = TokenService.verify(token);
    if (!v.valid || !v.payload) return { valid: false, error: v.error };
    const rec = await this.repo.verify(token);
    if (!rec) return { valid: false, error: 'invalid_or_expired' };
    return { valid: true, payload: v.payload };
  }

  async activateAccount(token: string): Promise<boolean> {
    const v = await this.verifyToken(token);
    if (!v.valid || !v.payload) return false;
    const userId = v.payload.sub as string;
    const client = PrismaService.getClient();
    await client.user.update({ where: { id: userId }, data: { isVerified: true, isActive: true } });
    return true;
  }
}

export default new EmailVerificationService();