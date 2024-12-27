type RateLimitData = {
  remaining: number;
  resetAt: Date;
  messages: { timestamp: number; content: string }[];
};

class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitData>;
  private readonly MAX_MESSAGES = 15;
  private readonly WINDOW_HOURS = 4;

  private constructor() {
    this.limits = new Map();
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public checkLimit(address: string): {
    remaining: number;
    resetAt: Date | null;
    isLimited: boolean;
  } {
    if (!address)
      return { remaining: this.MAX_MESSAGES, resetAt: null, isLimited: false };

    const now = Date.now();
    const data = this.limits.get(address);

    if (!data) {
      // First message from this address
      this.limits.set(address, {
        remaining: this.MAX_MESSAGES - 1,
        resetAt: new Date(now + this.WINDOW_HOURS * 60 * 60 * 1000),
        messages: [],
      });
      return {
        remaining: this.MAX_MESSAGES - 1,
        resetAt: null,
        isLimited: false,
      };
    }

    // Clean up old messages
    data.messages = data.messages.filter(
      (msg) => msg.timestamp > now - this.WINDOW_HOURS * 60 * 60 * 1000
    );

    // Check if window has reset
    if (data.resetAt.getTime() < now) {
      const newData = {
        remaining: this.MAX_MESSAGES - 1,
        resetAt: new Date(now + this.WINDOW_HOURS * 60 * 60 * 1000),
        messages: [],
      };
      this.limits.set(address, newData);
      return {
        remaining: this.MAX_MESSAGES - 1,
        resetAt: null,
        isLimited: false,
      };
    }

    return {
      remaining: data.remaining,
      resetAt: data.resetAt,
      isLimited: data.remaining <= 0,
    };
  }

  public recordMessage(address: string, content: string): void {
    if (!address) return;

    const now = Date.now();
    const data = this.limits.get(address);

    if (!data) {
      this.limits.set(address, {
        remaining: this.MAX_MESSAGES - 1,
        resetAt: new Date(now + this.WINDOW_HOURS * 60 * 60 * 1000),
        messages: [{ timestamp: now, content }],
      });
      return;
    }

    // Update messages and remaining count
    data.messages.push({ timestamp: now, content });
    data.remaining = Math.max(0, data.remaining - 1);
    this.limits.set(address, data);
  }

  public getRemainingTime(address: string): number {
    const data = this.limits.get(address);
    if (!data) return 0;
    return Math.max(0, data.resetAt.getTime() - Date.now());
  }

  public clearLimit(address: string): void {
    this.limits.delete(address);
  }
}

export const rateLimiter = RateLimiter.getInstance();
