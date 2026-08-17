import argon2 from 'argon2';

export class HashService {
  // Argon2id recommended parameters (tune per environment)
  private getOptions() {
    return {
      type: argon2?.argon2id ?? 2,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    };
  }

  async hash(password: string): Promise<string> {
    // argon2.hash returns the encoded hash including salt and params
    return argon2.hash(password, this.getOptions() as any);
  }

  async verify(password: string, stored: string): Promise<boolean> {
    try {
      return await argon2.verify(stored, password);
    } catch (err) {
      return false;
    }
  }
}

export default new HashService();
