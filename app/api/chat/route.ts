import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { auth } from "@clerk/nextjs/server";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { messages } = body || {};
  if (!Array.isArray(messages)) {
    return new Response(
      JSON.stringify({
        error: "'messages' parameter must be provided and must be an array",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Get the user's session - userId will be null if not authenticated
  const { userId } = await auth();

  // Create agent with user context (orders tool only available if authenticated)
  const agent = createShoppingAgent({ userId });

  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
