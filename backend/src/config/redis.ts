import Redis from 'ioredis';
import { logger } from './logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (error) => {
  logger.error('Redis connection error', error);
});

export { redis };

export async function cacheGet(key: string): Promise<string | null> {
  try {
    return await redis.get(key);
  } catch (error) {
    logger.error('Redis get error', { key, error });
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: string,
  expirySeconds?: number
): Promise<void> {
  try {
    if (expirySeconds) {
      await redis.setex(key, expirySeconds, value);
    } else {
      await redis.set(key, value);
    }
  } catch (error) {
    logger.error('Redis set error', { key, error });
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error('Redis delete error', { key, error });
  }
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
  logger.info('Redis disconnected');
}
