import Redis from "ioredis";

import { env } from "../../config/env";
import { logger } from "../../lib/logger";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (error: Error) => {
  logger.error("Redis connection error", { error: error.message });
});

export async function connectRedis(): Promise<void> {
  await redis.ping();
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}
