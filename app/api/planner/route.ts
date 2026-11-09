import { NextRequest } from "next/server";

export const runtime = "nodejs";

const MOCK_PLAN = `Day 1: land, drop the bag, walk.
Don't book anything for the first afternoon. Walk until something looks good and eat there.

Day 2: the one thing everyone said to see.
Go early, before the buses arrive. You'll have it mostly to yourself for an hour.

Day 3: the neighbourhood nobody mentioned.
Take the local bus three stops past where the guidebook stops. This is usually the best meal of the trip.

Day 4: slow morning, one booked thing, open evening.
By now you know the rhythm of the place. Trust it.

Day 5: the long way back.
Take the scenic route to the airport instead of the fast one. You have the time. Why not?`;

async function* mockStream() {
  const words = MOCK_PLAN.split(" ");
  for (const w of words) {
    yield w + " ";
    await new Promise((r) => setTimeout(r, 18));
  }
}

async function* anthropicStream(prompt: string, apiKey: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      stream: true,
      system:
        "You are Sidepath's trip planner. Warm, plain, specific, a little bold. Short lines. No em dashes. Write a brief day-by-day sketch for the traveller's request.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Anthropic request failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        if (
          parsed.type === "content_block_delta" &&
          parsed.delta?.type === "text_delta"
        ) {
          yield parsed.delta.text as string;
        }
      } catch {
        // Ignore malformed SSE chunks.
      }
    }
  }
}

export async function POST(req: NextRequest) {
  let prompt = "a first trip somewhere that feels just out of reach";
  try {
    const body = await req.json();
    if (typeof body?.prompt === "string" && body.prompt.trim()) {
      prompt = body.prompt.trim().slice(0, 500);
    }
  } catch {
    // No body, or bad JSON — fall back to the default prompt above.
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const source = apiKey ? anthropicStream(prompt, apiKey) : mockStream();
        for await (const chunk of source) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch {
        // Real call failed (bad key, network, rate limit) — fall back to the
        // canned plan so the demo never just breaks.
        for await (const chunk of mockStream()) {
          controller.enqueue(encoder.encode(chunk));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
