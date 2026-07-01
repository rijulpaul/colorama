import { createApp } from "./app";
import { env } from "./config/env";
import { connectRedis, disconnectRedis } from "./infrastructure/cache/redis";
import { connectMongo, disconnectMongo } from "./infrastructure/database/mongodb";
import { logger } from "./lib/logger";

async function bootstrap() {
  await connectMongo();
  await connectRedis();

  const app = createApp().listen(env.PORT);

  logger.info("Server started", {
    port: env.PORT,
    env: env.NODE_ENV,
    docs: `http://localhost:${env.PORT}/docs`,
  });

  const shutdown = async (signal: string) => {
    logger.info("Shutdown signal received", { signal });

    await app.stop();
    await disconnectRedis();
    await disconnectMongo();

    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  logger.error("Failed to start server", { message });
  process.exit(1);
});
