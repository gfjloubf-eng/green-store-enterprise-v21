import PrismaService from './prisma-service';

/**
 * No dedicated PasswordHistory model exists in schema; use SecurityLog.meta to store password history entries.
 * meta will contain a JSON object with { type: 'password-history', hash: '<hash>', createdAt: '<iso>' }
 */
export class PasswordHistoryRepository {
  private client = PrismaService.getClient();

  async addPasswordHistory(userId: string, hash: string) {
    const meta = JSON.stringify({ type: 'password-history', hash, createdAt: new Date().toISOString() });
    return this.client.securityLog.create({ data: { userId, event: 'password_history', severity: 'INFO', meta } });
  }

  async recentHashes(userId: string, limit = 5) {
    const logs = await this.client.securityLog.findMany({ where: { userId, event: 'password_history' }, orderBy: { createdAt: 'desc' }, take: limit });
    return logs.map((l: any) => {
      try {
        const m = JSON.parse(l.meta ?? '{}');
        return m.hash as string | undefined;
      } catch (e) {
        return undefined;
      }
    }).filter(Boolean) as string[];
  }
}

export default new PasswordHistoryRepository();