import PrismaService from './prisma-service';
import crypto from 'crypto';

export class PasswordResetRepository {
  private client = PrismaService.getClient();

  async create(userId: string, token: string, expiresAt: Date) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.client.passwordReset.create({ data: { userId, tokenHash, expiresAt } });
  }

  async findValidByToken(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.client.passwordReset.findFirst({ where: { tokenHash, used: false, expiresAt: { gt: new Date() } } });
  }

  async markUsed(id: string) {
    return this.client.passwordReset.update({ where: { id }, data: { used: true } });
  }
}

export default new PasswordResetRepository();