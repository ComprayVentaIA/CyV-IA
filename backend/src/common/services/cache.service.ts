import {
  Injectable, Logger, OnModuleInit, OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis;
  private connected = false;

  constructor(private readonly config: ConfigService) {
    this.redis = new Redis({
      host: this.config.get<string>('redis.host', 'localhost'),
      port: this.config.get<number>('redis.port', 6379),
      password: this.config.get<string>('redis.password') || undefined,
      lazyConnect: true,
      enableOfflineQueue: false,
      // Don't crash the app if Redis is unavailable
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 2000)),
    });

    this.redis.on('error', (err) => {
      if (this.connected) {
        this.logger.warn(`Redis connection error: ${err.message}`);
        this.connected = false;
      }
    });
  }

  async onModuleInit() {
    try {
      await this.redis.connect();
      this.connected = true;
      this.logger.log('✅ Redis connected');
    } catch {
      this.logger.warn('⚠️  Redis not available — running without cache (degraded mode)');
    }
  }

  async onModuleDestroy() {
    await this.redis.quit().catch(() => {});
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected) return null;
    try {
      const val = await this.redis.get(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.connected) return;
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Fail open — cache miss is acceptable
    }
  }

  async del(key: string): Promise<void> {
    if (!this.connected) return;
    try {
      await this.redis.del(key);
    } catch {}
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.connected) return;
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) await this.redis.del(...keys);
    } catch {}
  }

  isConnected(): boolean {
    return this.connected;
  }
}
