import { tool } from "langchain";
import { REFINE_QUERY_PROMPT } from "../prompts/refine_query.prompt";

export const refine_query_tool = tool(
  async (user_query) => {
    console.log("Tool Invoked: Refine Query");
    return `This tool is under development. Pretend the tool refined the user query for the sake of testing`;
  },
  {
    name: "refine_query",
    description: "This tool runs at the start of every response",
  },
);
