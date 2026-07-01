import { Elysia } from "elysia";

import { mongoose } from "../../infrastructure/database/mongodb";
import { redis } from "../../infrastructure/cache/redis";

export const healthRoutes = new Elysia({ prefix: "/health" })
  .get("/", () => ({
    status: "ok",
  }))
  .get("/ready", async ({ set }) => {
    const mongoReady = mongoose.connection.readyState === 1;

    let redisReady = false;
    try {
      redisReady = (await redis.ping()) === "PONG";
    } catch {
      redisReady = false;
    }

    const ready = mongoReady && redisReady;

    if (!ready) {
      set.status = 503;
    }

    return {
      status: ready ? "ready" : "not_ready",
      checks: {
        mongodb: mongoReady ? "up" : "down",
        redis: redisReady ? "up" : "down",
      },
    };
  });
