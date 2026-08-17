export class HashService {
  private getArgon2(): any {
    try {
      // Dynamic require to prevent module load failures in serverless environments
      return require('argon2');
    } catch {
      return null;
    }
  }

  async hash(password: string): Promise<string> {
    const a2 = this.getArgon2();
    if (!a2) {
      throw new Error('argon2_unavailable');
    }
    return a2.hash(password, {
      type: a2.argon2id ?? 2,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  async verify(password: string, stored: string): Promise<boolean> {
    try {
      const a2 = this.getArgon2();
      if (!a2) return false;
      return await a2.verify(stored, password);
    } catch {
      return false;
    }
  }
}

export default new HashService();
