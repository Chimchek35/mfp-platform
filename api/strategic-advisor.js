import { generateText } from "ai";

const MODEL = "openai/gpt-oss-20b";

export default async function strategicAdvisor(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages = [], profile = {}, vision = {} } = req.body || {};
    if (!Array.isArray(messages) || messages.length > 24) return res.status(400).json({ error: "Invalid conversation" });
    const cleanMessages = messages.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content || "").slice(0, 4000),
    }));
    const result = await generateText({
      model: MODEL,
      system: `You are the Strategic Vision advisor for MFP, a calm and practical farm-business advisor. Ask one focused question at a time. Reflect what the farmer says, identify tradeoffs, and never invent financial, legal, tax, or agronomic facts. Use the provided farm context only as context, not as proof. Help the farmer clarify a durable direction, constraints, succession implications, and next actions. When enough information exists, summarize: direction, rationale, risks, open questions, and next 3 actions. Keep replies under 180 words and end with one question unless presenting a final summary. Farm context: ${JSON.stringify({ profile, vision })}`,
      messages: cleanMessages,
      maxOutputTokens: 300,
    });
    return res.status(200).json({ reply: result.text });
  } catch (error) {
    console.error("[v0] strategic advisor error:", error.message);
    return res.status(500).json({ error: "The advisor is temporarily unavailable." });
  }
}
