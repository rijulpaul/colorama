import { env } from "@repo/env-config";
import { run_agent } from "./agent";

const server = Bun.serve({
  port: env.AGENT_PORT,
  routes: {
    "/": async (req) => {
      const prompt = req.headers.get("PROMPT");

      if (!prompt) {
        return new Response("Missing PROMPT header", { status: 400 });
      }

      const result = await run_agent(prompt);

      const last = result.messages.at(-1);

      return new Response(last?.content?.toString() ?? "");
    },
    "/health": new Response("ok"),
  },
});

console.log(`Listening on http://localhost:${server.port}`);
