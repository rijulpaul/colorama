import { tool } from "langchain";
import { tools } from ".";

// import { env } from "@repo/config";

const retrieve_color_tool = tool(
  // (query) => fetch(`http://${env.WEAVIATE_HOST}:${env.WEAVIATE_PORT}`),
  (query) => {
    console.log("Tool Invoked: Retrieve Color");
    return query;
  },
  {
    name: "Retrieve Color",
    description: "Based on the user query search for and output the color",
  },
);

tools.add(retrieve_color_tool);
