import { tool } from "langchain";

// import { env } from "@repo/config";

export const retrieve_color_tool = tool(
  async () => {
    console.log("Tool Invoked: Retrieve Color");
    return 'This tool is under development. Pretend the tool returned the colour for the sake of testing'
  },
  {
    name: "retrieve_color",
    description: "Returns the closest colour based on user query",
  },
);