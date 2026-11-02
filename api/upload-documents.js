import { put } from "@vercel/blob";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session?.user?.id) return res.status(401).json({ error: "Authentication required" });

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body?.name || !body?.data || !Number.isInteger(body.size) || body.size <= 0 || body.size > MAX_FILE_BYTES) {
      return res.status(400).json({ error: "Invalid or oversized document" });
    }

    const safeName = String(body.name).replace(/[^a-zA-Z0-9._-]/g, "-").slice(-160);
    const pathname = `financial-analysis/${session.user.id}/${Date.now()}-${safeName}`;
    const binary = atob(body.data);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const blob = await put(pathname, bytes, {
      access: "private",
      contentType: String(body.type || "application/octet-stream").slice(0, 120),
      addRandomSuffix: false,
    });

    return res.status(200).json({ pathname: blob.pathname, name: body.name, size: body.size, type: body.type || "Document", stored: true });
  } catch (error) {
    console.error("[mfp] document upload error", error);
    return res.status(500).json({ error: "Unable to store document" });
  }
}
