import { generateText } from "ai";
import { z } from "zod";

/** AI Gateway model for the Risk Ready coach. The module works fully without AI. */
const AI_MODEL = "anthropic/claude-haiku-5.5";

const INSTRUCTIONS =
  "You are a plain-spoken farm risk coach. In 2-3 short sentences, explain why the current step of a farm risk plan matters for THIS specific operation, and name one concrete thing to do on this screen. Use everyday farm language. Define any insurance term you use. Never quote prices, never state that something is or is not covered, and never give legal or insurance advice.";

const bodySchema = z.object({
  step: z.number().int().min(0).max(7),
  stepTitle: z.string().min(1).max(80),
  summary: z.string().max(3000),
  fallback: z.string().max(2000),
});

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20_000) return null;
  }
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const parsed = bodySchema.safeParse(await readJson(req));
  if (!parsed.success) return res.status(400).json({ error: "Invalid request" });

  const { stepTitle, summary, fallback } = parsed.data;
  const hasAI = !!(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
  if (!hasAI) return res.status(200).json({ source: "rules", text: fallback });

  try {
    const { text } = await generateText({
      model: AI_MODEL,
      instructions: INSTRUCTIONS,
      prompt: `Current step: ${stepTitle}\n\nFarm profile:\n${summary}`,
      maxOutputTokens: 220,
    });
    return res.status(200).json({ source: "ai", text: text.trim() });
  } catch (error) {
    console.error("[mfp] coach failed", error);
    return res.status(200).json({ source: "rules", text: fallback });
  }
}
