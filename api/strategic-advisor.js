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
      system: `You are the Strategic Vision advisor for MFP, a calm and practical farm-business advisor. Lead the conversation rather than waiting for the farmer to design it. Ask one focused question at a time and briefly explain why it matters. Start from the farm profile and do not make the farmer repeat known information. Progress through: desired future, priorities and tradeoffs, financial/operational constraints, people and succession, resilience and diversification, then commitment and first steps. Reflect what the farmer says, identify tradeoffs, and never invent financial, legal, tax, or agronomic facts. Use the provided farm context only as context, not as proof. After several substantive answers, explicitly offer a draft strategic plan for confirmation. The final plan must include: strategic direction, 3-5 priorities, key constraints, risks and assumptions, who owns each priority, a 90-day action list, and review cadence. Keep replies under 220 words and end with one question unless presenting a draft plan for confirmation. Farm context: ${JSON.stringify({ profile, vision })}`,
      messages: cleanMessages,
      maxOutputTokens: 300,
    });
    return res.status(200).json({ reply: result.text });
  } catch (error) {
    console.error("[v0] strategic advisor error:", error.message);
    return res.status(500).json({ error: "The advisor is temporarily unavailable." });
  }
}
