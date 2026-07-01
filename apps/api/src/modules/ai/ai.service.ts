import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { createChatModel } from "../../infrastructure/ai/langchain";
import { SessionModel } from "../../models/session.model";
import type { ChatRequest, ChatResponse } from "./ai.schema";

const SYSTEM_PROMPT =
  "You are Colorama, an AI design assistant. Help designers with color theory, palettes, and UX guidance.";

export class AiService {
  async chat(input: ChatRequest, userId = "anonymous"): Promise<ChatResponse> {
    const session = input.sessionId
      ? await SessionModel.findById(input.sessionId)
      : null;

    const activeSession =
      session ??
      (await SessionModel.create({
        userId,
        context: {},
        messages: [],
      }));

    activeSession.messages.push({
      role: "user",
      content: input.message,
      createdAt: new Date(),
    });

    const chatModel = createChatModel();
    const response = await chatModel.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage(input.message),
    ]);

    const reply =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    activeSession.messages.push({
      role: "assistant",
      content: reply,
      createdAt: new Date(),
    });

    await activeSession.save();

    return {
      reply,
      sessionId: activeSession._id.toString(),
    };
  }
}

export const aiService = new AiService();
