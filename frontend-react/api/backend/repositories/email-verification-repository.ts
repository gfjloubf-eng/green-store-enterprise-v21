import PrismaService from './prisma-service';
import crypto from 'crypto';

export class EmailVerificationRepository {
  private client = PrismaService.getClient();

  async create(userId: string, token: string, expiresAt: Date) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.client.emailVerification.create({ data: { userId, tokenHash, expiresAt } });
  }

  async verify(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const rec = await this.client.emailVerification.findFirst({ where: { tokenHash, verified: false, expiresAt: { gt: new Date() } } });
    if (!rec) return null;
    await this.client.emailVerification.update({ where: { id: rec.id }, data: { verified: true } });
    return rec;
  }
}

export default new EmailVerificationRepository();