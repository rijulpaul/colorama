import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";

import { env } from "../../config/env";

export function createOllamaChatModel() {
  return new ChatOllama({
    baseUrl: env.OLLAMA_BASE_URL,
    model: env.OLLAMA_MODEL,
    temperature: 0.7,
  });
}

export function createOpenAIChatModel(model = "gpt-4o-mini") {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required to use OpenAI models");
  }

  return new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model,
    temperature: 0.7,
  });
}

export function createChatModel() {
  if (env.OPENAI_API_KEY) {
    return createOpenAIChatModel();
  }

  return createOllamaChatModel();
}
