import { createAgent, HumanMessage } from "langchain";

import { tools } from "./tools";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";
import { env } from "@repo/config";

import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { ChatXAI } from "@langchain/xai";

const LLM_PROVIDER = env.LLM_PROVIDER;
const LLM_MODEL = env.LLM_MODEL as string;
const LLM_TEMP = 0.7;
var llm: any;

switch (LLM_PROVIDER) {
  case "openrouter":
    llm = new ChatOpenRouter({
      apiKey: env.OPENROUTER_API_KEY,
      model: LLM_MODEL,
      temperature: LLM_TEMP,
    });
    break;
  case "openai":
    llm = new ChatOpenAI({
      apiKey: env.OPENAI_API_KEY,
      model: LLM_MODEL,
      temperature: LLM_TEMP,
    });
    break;
  case "anthropic":
    llm = new ChatAnthropic({
      apiKey: env.ANTHROPIC_API_KEY,
      model: LLM_MODEL,
      temperature: LLM_TEMP,
    });
    break;
  case "google":
    llm = new ChatGoogle(LLM_MODEL, { temperature: LLM_TEMP });
    break;
  case "groq":
    llm = new ChatGroq({
      model: LLM_MODEL,
      temperature: LLM_TEMP,
    });
    break;
  case "ollama":
    llm = new ChatOllama({
      baseUrl: env.OLLAMA_BASE_URL,
      model: LLM_MODEL,
      temperature: LLM_TEMP,
    });
    break;
  case "xai":
    llm = new ChatXAI({
      // apiKey: env.XAI_API_KEY,
      model: LLM_MODEL,
      temperature: LLM_TEMP,
    });
    break;
  default:
    throw new Error(
      "Invalid LLM Provider: check LLM_PROVIDER environment variable",
    );
}

const agent = createAgent({
  model: llm,
  tools: tools.get(),
  systemPrompt: SYSTEM_PROMPT,
});

export const run_agent = async (query: string) => {
  return agent.invoke({
    messages: [new HumanMessage(query)],
  });
  // return response
};
