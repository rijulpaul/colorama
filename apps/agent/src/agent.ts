import { createAgent, HumanMessage } from "langchain";

import { tools } from "./tools";
import { SYSTEM_PROMPT } from "./prompts/system.prompt";

import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { ChatOpenRouter } from "@langchain/openrouter";
import { ChatGoogle } from "@langchain/google";
import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { ChatXAI } from "@langchain/xai";

const LLM_PROVIDER = process.env.LLM_PROVIDER;
const LLM_MODEL = process.env.LLM_MODEL as string;
const LLM_BASE_URL = process.env.LLM_BASE_URL;
const LLM_TEMP = 0.7;

let llm:
  | ChatOpenRouter
  | ChatOpenAI
  | ChatAnthropic
  | ChatGoogle
  | ChatGroq
  | ChatOllama
  | ChatXAI;

const llm_config = {
  model: LLM_MODEL,
  temperature: LLM_TEMP,
  ...(LLM_BASE_URL ? { baseURL: LLM_BASE_URL } : {}),
};

switch (LLM_PROVIDER) {
  case "openrouter":
    llm = new ChatOpenRouter(llm_config);
    break;
  case "openai":
    llm = new ChatOpenAI(llm_config);
    break;
  case "anthropic":
    llm = new ChatAnthropic(llm_config);
    break;
  case "google":
    llm = new ChatGoogle(llm_config);
    break;
  case "groq":
    llm = new ChatGroq(llm_config);
    break;
  case "ollama":
    llm = new ChatOllama(llm_config);
    break;
  case "xai":
    llm = new ChatXAI(llm_config);
    break;
  default:
    throw new Error(
      "Invalid LLM Provider: check LLM_PROVIDER environment variable",
    );
}

const agent = createAgent({
  model: llm,
  systemPrompt: SYSTEM_PROMPT,
  tools: tools,
});

export const run_agent = async (query: string) => {
  return agent.stream({
    messages: [new HumanMessage(query)],
  });
};
