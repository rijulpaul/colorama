import { Elysia } from "elysia";

import { aiService } from "./ai.service";
import { chatRequestSchema } from "./ai.schema";

export const aiRoutes = new Elysia({ prefix: "/ai" }).post(
  "/chat",
  async ({ body }) => {
    return aiService.chat(body);
  },
  {
    body: chatRequestSchema,
    detail: {
      summary: "Send a message to the design assistant",
      tags: ["AI"],
    },
  },
);
