import { argon2Verify, argon2id } from 'hash-wasm';

class HashService {
  async hash(password: string): Promise<string> {
    return argon2id({
      password,
      salt: crypto.getRandomValues(new Uint8Array(16)),
      parallelism: 1,
      iterations: 3,
      memorySize: 2 ** 16,
      hashLength: 32,
      outputType: 'encoded',
    });
  }

  async verify(password: string, stored: string): Promise<boolean> {
    try {
      return await argon2Verify({ password, hash: stored });
    } catch {
      return false;
    }
  }
}

export default new HashService();
