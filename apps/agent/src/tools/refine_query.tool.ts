import { tool } from "langchain";
import { REFINE_QUERY_PROMPT } from "../prompts/refine_query.prompt";
import { tools } from ".";

const refine_query_tool = tool(
  async (user_query) => {
    console.log("Tool Invoked: Refine Query");
    return REFINE_QUERY_PROMPT(user_query);
  },
  {
    name: "refine query",
    description:
      "Refine the User Query incase it containes excessive/unnecessary information",
  },
);

tools.add(refine_query_tool);
