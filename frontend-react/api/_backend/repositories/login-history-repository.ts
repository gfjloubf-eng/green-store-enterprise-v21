import PrismaService from './prisma-service';

export class LoginHistoryRepository {
  private client = PrismaService.getClient();

  async record(userId: string | null, email: string | null, ip: string | undefined, ua: string | undefined, success: boolean, reason?: string) {
    return this.client.loginHistory.create({ data: { userId, email, ipAddress: ip, userAgent: ua, success, reason } });
  }

  async recentFailedCountByUser(userId: string, sinceMinutes = 15) {
    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);
    const count = await this.client.loginHistory.count({ where: { userId, success: false, createdAt: { gt: since } } });
    return count;
  }

  async recentFailedCountByEmail(email: string, sinceMinutes = 15) {
    const since = new Date(Date.now() - sinceMinutes * 60 * 1000);
    const count = await this.client.loginHistory.count({ where: { email, success: false, createdAt: { gt: since } } });
    return count;
  }
}

export default new LoginHistoryRepository();