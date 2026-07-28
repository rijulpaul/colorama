import { Elysia } from "elysia";

export const chatRoutes = new Elysia({ prefix: "/chat" })
  .get("/:chat_id", ({ params: { chat_id } }) => {
    if (chat_id) {
      try {
        // read chat history from mongodb
        return "Chat history";
      } catch {
        throw new Error();
      }
    }

    return {
      message: "Read mongodb for user chat history",
    };
  })

  .post("/:id", () => {
    return {
      message: "request llm and save to mongodb",
    };
  });
