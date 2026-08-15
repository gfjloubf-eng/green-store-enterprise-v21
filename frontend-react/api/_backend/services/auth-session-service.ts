import SessionRepository from '../repositories/session-repository';

export interface SessionRecord {
  jti: string;
  userId: string;
  deviceId?: string;
  createdAt: Date;
  expiresAt: Date;
  revoked: boolean;
}

export class SessionService {
  private repo = SessionRepository;

  async createSession(userId: string, jti: string, ttlSeconds: number, deviceId?: string): Promise<any> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    return this.repo.create(userId, jti, undefined, undefined, expiresAt);
  }

  async revokeSession(jti: string): Promise<void> {
    await this.repo.revokeByToken(jti);
  }

  async rotateSession(oldJti: string, newJti: string, ttlSeconds: number): Promise<any | null> {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    return this.repo.rotate(oldJti, newJti, expiresAt);
  }

  async getSession(jti: string): Promise<any | null> {
    return this.repo.findByToken(jti);
  }

  async isRevoked(jti: string): Promise<boolean> {
    const rec = await this.repo.findActiveByToken(jti);
    return !rec;
  }
}

export default new SessionService();
