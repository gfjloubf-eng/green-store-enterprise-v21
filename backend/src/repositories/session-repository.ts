import PrismaService from './prisma-service';

export class SessionRepository {
  private client = PrismaService.getClient();

  async create(userId: string, token: string, ip?: string, ua?: string, expiresAt?: Date) {
    return this.client.session.create({ data: { userId, token, ipAddress: ip, userAgent: ua, expiresAt } });
  }

  async revokeByToken(token: string) {
    return this.client.session.updateMany({ where: { token }, data: { revoked: true } });
  }

  async findByToken(token: string) {
    return this.client.session.findFirst({ where: { token } });
  }

  async findActiveByToken(token: string) {
    return this.client.session.findFirst({ where: { token, revoked: false, expiresAt: { gt: new Date() } } });
  }

  async rotate(oldToken: string, newToken: string, expiresAt: Date) {
    const old = await this.client.session.findFirst({ where: { token: oldToken } });
    if (!old) return null;
    await this.client.session.updateMany({ where: { token: oldToken }, data: { revoked: true } });
    return this.create(old.userId, newToken, old.ipAddress ?? undefined, old.userAgent ?? undefined, expiresAt);
  }
}

export default new SessionRepository();
