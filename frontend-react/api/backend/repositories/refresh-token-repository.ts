import PrismaService from './prisma-service';
import crypto from 'crypto';

export class RefreshTokenRepository {
  private client = PrismaService.getClient();

  async create(userId: string, token: string, expiresAt: Date) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.client.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  }

  async revokeByHash(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.client.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } });
  }

  async findByHash(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.client.refreshToken.findFirst({ where: { tokenHash } });
  }

  async rotate(oldToken: string, newToken: string, expiresAt: Date) {
    const oldHash = crypto.createHash('sha256').update(oldToken).digest('hex');
    const old = await this.client.refreshToken.findFirst({ where: { tokenHash: oldHash } });
    if (!old) return null;
    await this.client.refreshToken.updateMany({ where: { tokenHash: oldHash }, data: { revoked: true } });
    return this.create(old.userId, newToken, expiresAt);
  }
}

export default new RefreshTokenRepository();
