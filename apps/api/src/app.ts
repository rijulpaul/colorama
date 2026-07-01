import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { aiRoutes } from "./modules/ai/ai.routes";
import { healthRoutes } from "./modules/health/health.routes";

export function createApp() {
  return new Elysia()
    .use(
      cors({
        origin: env.NODE_ENV === "production" ? false : true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      }),
    )
    .use(
      swagger({
        documentation: {
          info: {
            title: "Colorama API",
            version: "1.0.0",
            description: "AI-powered design assistant backend",
          },
          tags: [
            { name: "Health", description: "Health and readiness probes" },
            { name: "AI", description: "LangChain-powered design assistant" },
          ],
        },
        path: "/docs",
      }),
    )
    .use(errorHandler)
    .use(healthRoutes)
    .use(aiRoutes)
    .get(
      "/",
      () => ({
        name: "Colorama API",
        version: "1.0.0",
        docs: "/docs",
      }),
      {
        detail: {
          summary: "API root",
          tags: ["Health"],
        },
      },
    );
}

export type App = ReturnType<typeof createApp>;
