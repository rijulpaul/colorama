import "@repo/env-config";

import { run_agent } from "./agent";

const SSEResponse = (stream: ReadableStream) => {
  const body = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for await (const chunk of stream) {
        console.log(chunk)
        const message = chunk?.model_request?.messages[0];
        const response = message?.content || ""
        const reasoning_content = message?.additional_kwargs?.reasoning_content || "";
        const tool_call = message?.tool_calls.map(tool => tool.name);
        
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              response: response,
              reasoning: reasoning_content,
              tool: tool_call
            })}\n\n`
          )
        );
      }

      controller.enqueue(encoder.encode("event: end\ndata: done\n\n"));
      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

const server = Bun.serve({
  idleTimeout: 30,
  port: process.env.AGENT_PORT,
  routes: {
    "/": async (req) => {
      const prompt = req.headers.get("PROMPT");

      if (!prompt) {
        return new Response("Missing PROMPT header", { status: 400 });
      }

      const stream = await run_agent(prompt)
      return SSEResponse(stream)
    },
    "/health": new Response("ok"),
  },
});

console.log(`Listening on http://localhost:${server.port}`);
