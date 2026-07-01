import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  reply: z.string(),
  sessionId: z.string(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
