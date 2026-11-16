/* global process */
import { get } from "@vercel/blob";
import { ownerKey } from "./upload-documents.js";

// Returns the text of a stored CSV so the ratio deep dive can reuse a document that was
// uploaded earlier. Only CSVs are served, only from the caller's own storage prefix, and
// the pathname has to match exactly what the upload route produces.
const MAX_TEXT_BYTES = 4 * 1024 * 1024;
const PATHNAME = /^financial-analysis\/(user|record)\/[A-Za-z0-9-]+\/\d+-[A-Za-z0-9._-]+\.csv$/i;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: "Document storage is not connected to this deployment yet." });
  }
  try {
    const url = new URL(req.url, "http://localhost");
    const pathname = String(url.searchParams.get("pathname") || "");
    if (!PATHNAME.test(pathname)) return res.status(400).json({ error: "Only stored CSV documents can be read back." });

    const owner = await ownerKey(req);
    if (!owner || !pathname.startsWith(`financial-analysis/${owner}/`)) {
      return res.status(403).json({ error: "That document does not belong to this farm record." });
    }

    const result = await get(pathname, { access: "private" });
    if (!result || !result.stream) return res.status(404).json({ error: "That document is no longer in storage." });
    if (result.blob?.size > MAX_TEXT_BYTES) return res.status(413).json({ error: "That document is too large to read back." });

    const text = await new Response(result.stream).text();
    return res.status(200).json({ pathname, text });
  } catch (error) {
    console.error("[mfp] document read error", error);
    return res.status(500).json({ error: "Could not read that document from storage." });
  }
}
