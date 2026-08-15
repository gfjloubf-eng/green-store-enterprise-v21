import HashService from './auth-hash-service';
import PasswordHistoryRepository from '../repositories/password-history-repository';

export class PasswordService {
  // Validate password strength according to simple rules. Extend per OWASP as needed.
  validateStrength(password: string): { valid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    if (password.length < 12) reasons.push('too_short');
    if (!/[A-Z]/.test(password)) reasons.push('missing_uppercase');
    if (!/[a-z]/.test(password)) reasons.push('missing_lowercase');
    if (!/[0-9]/.test(password)) reasons.push('missing_number');
    if (!/[`~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) reasons.push('missing_symbol');
    return { valid: reasons.length === 0, reasons };
  }

  async hash(password: string): Promise<string> {
    return HashService.hash(password);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return HashService.verify(password, hash);
  }

  // Password history: check recent password hashes to prevent reuse
  async checkPasswordHistory(userId: string, password: string): Promise<boolean> {
    const recent = await PasswordHistoryRepository.recentHashes(userId, 5);
    for (const h of recent) {
      try {
        const ok = await HashService.verify(password, h);
        if (ok) return false; // reuse detected
      } catch (e) {
        // ignore malformed entries
      }
    }
    return true;
  }

  async addToHistory(userId: string, hashed: string): Promise<void> {
    await PasswordHistoryRepository.addPasswordHistory(userId, hashed);
  }
}

export default new PasswordService();