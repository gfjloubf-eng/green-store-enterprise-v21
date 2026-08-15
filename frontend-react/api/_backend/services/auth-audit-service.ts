import LoginHistoryRepository from '../repositories/login-history-repository';
import TokenBlacklistRepository from '../repositories/token-blacklist-repository';
import PrismaService from '../repositories/prisma-service';

export class AuthAuditService {
  private loginRepo = LoginHistoryRepository;
  private tokenBlacklist = TokenBlacklistRepository;
  private client = PrismaService.getClient();

  async recordLoginAttempt(userId: string | null, email: string | null, ip?: string, ua?: string, success = false, reason?: string) {
    await this.loginRepo.record(userId, email, ip, ua, success, reason);
  }

  async lockAccount(userId: string, reason = 'too_many_failed_logins') {
    // create a security log entry marking account locked
    const meta = JSON.stringify({ type: 'account_lock', reason, createdAt: new Date().toISOString() });
    await this.client.securityLog.create({ data: { userId, event: 'account_locked', severity: 'WARN', meta } });
  }

  async isAccountLocked(userId: string) {
    // check for account_locked event within last X minutes or permanent
    const rec = await this.client.securityLog.findFirst({ where: { userId, event: 'account_locked' }, orderBy: { createdAt: 'desc' } });
    if (!rec) return false;
    // respect a lock TTL from env or default 30m
    const ttl = Number(process.env.ACCOUNT_LOCK_TTL_MINUTES ?? 30);
    const created = rec.createdAt;
    if (!created) return true;
    const unlockedAt = new Date(created.getTime() + ttl * 60 * 1000);
    return unlockedAt > new Date();
  }

  async blacklistRefreshTokenByHash(userId: string | null, tokenHash: string) {
    await this.tokenBlacklist.addBlacklistByHash(userId, tokenHash, 'manual_blacklist');
  }
}

export default new AuthAuditService();