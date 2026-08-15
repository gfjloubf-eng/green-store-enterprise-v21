type Bucket = { tokens: number; last: number };

export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly capacity: number;
  private readonly refillPerSecond: number;

  constructor(capacity = 10, refillPerSecond = 1) {
    this.capacity = capacity;
    this.refillPerSecond = refillPerSecond;
  }

  check(key: string) {
    const now = Date.now();
    const b = this.buckets.get(key) ?? { tokens: this.capacity, last: now };
    const delta = (now - b.last) / 1000;
    b.tokens = Math.min(this.capacity, b.tokens + delta * this.refillPerSecond);
    b.last = now;

    if (b.tokens < 1) {
      this.buckets.set(key, b);
      return false;
    }
    b.tokens -= 1;
    this.buckets.set(key, b);
    return true;
  }
}

export default new RateLimiter(Number(process.env.RATE_LIMIT_CAPACITY ?? 10), Number(process.env.RATE_LIMIT_REFILL ?? 1));