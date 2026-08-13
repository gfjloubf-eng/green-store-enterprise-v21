import PrismaService from './prisma-service';

/**
 * Token blacklist is persisted in SecurityLog entries. This avoids schema changes.
 * Each blacklist entry will store meta JSON: { type: 'token-blacklist', jti?: string, tokenHash?: string, createdAt }
 */
export class TokenBlacklistRepository {
  private client = PrismaService.getClient();

  async addBlacklistByJti(userId: string | null, jti: string, reason = 'revoked') {
    const meta = JSON.stringify({ type: 'token-blacklist', jti, reason, createdAt: new Date().toISOString() });
    return this.client.securityLog.create({ data: { userId, event: 'token_blacklist', severity: 'WARN', meta } });
  }

  async isBlacklistedByJti(jti: string) {
    const rec = await this.client.securityLog.findFirst({ where: { event: 'token_blacklist', meta: { contains: jti } } });
    return !!rec;
  }

  async addBlacklistByHash(userId: string | null, tokenHash: string, reason = 'revoked') {
    const meta = JSON.stringify({ type: 'token-blacklist', tokenHash, reason, createdAt: new Date().toISOString() });
    return this.client.securityLog.create({ data: { userId, event: 'token_blacklist', severity: 'WARN', meta } });
  }

  async isBlacklistedByHash(tokenHash: string) {
    const rec = await this.client.securityLog.findFirst({ where: { event: 'token_blacklist', meta: { contains: tokenHash } } });
    return !!rec;
  }
}

export default new TokenBlacklistRepository();