import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

export function createApp() {
  return new Elysia()
    .use(
      cors({
        origin: "*",
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
    .get("/", () => "Hello World");
}

export type App = typeof createApp;
