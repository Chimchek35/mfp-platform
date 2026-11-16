/* global process, Buffer */
import { put } from "@vercel/blob";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

// Vercel functions reject request bodies over 4.5 MB, so the cap has to sit below that.
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ALLOWED_EXT = /\.(pdf|csv|xls|xlsx|png|jpe?g)$/i;
const RECORD_ID = /^[a-z0-9-]{8,64}$/i;

async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body, "utf8");
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

// Files are namespaced by the signed-in user when there is one, otherwise by the
// anonymous farm-record id the browser keeps alongside its local record. The app
// has no sign-in screen yet, so the anonymous path is the one most people take.
export async function ownerKey(req) {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (session?.user?.id) return `user/${session.user.id}`;
  } catch (error) {
    console.error("[mfp] session lookup failed, falling back to record id", error?.message || error);
  }
  const recordId = String(req.headers["x-mfp-record"] || "");
  return RECORD_ID.test(recordId) ? `record/${recordId}` : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({ error: "Document storage is not connected to this deployment yet." });
  }

  try {
    const owner = await ownerKey(req);
    if (!owner) return res.status(400).json({ error: "This browser has no farm record to attach the document to. Reload and try again." });

    const name = decodeURIComponent(String(req.headers["x-mfp-filename"] || "")).trim();
    const type = String(req.headers["content-type"] || "application/octet-stream").split(";")[0].slice(0, 120);
    if (!name || !ALLOWED_EXT.test(name)) return res.status(400).json({ error: "Only PDF, CSV, XLS, XLSX, PNG and JPG files are accepted." });

    const bytes = await readBody(req);
    if (!bytes.length) return res.status(400).json({ error: "The file arrived empty." });
    if (bytes.length > MAX_FILE_BYTES) return res.status(413).json({ error: `Files must be ${MAX_FILE_BYTES / 1024 / 1024} MB or smaller.` });

    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-160);
    const pathname = `financial-analysis/${owner}/${Date.now()}-${safeName}`;
    const blob = await put(pathname, bytes, { access: "private", contentType: type, addRandomSuffix: false });

    return res.status(200).json({ pathname: blob.pathname, name, size: bytes.length, type, stored: true });
  } catch (error) {
    console.error("[mfp] document upload error", error);
    return res.status(500).json({ error: "Storage rejected the file. Try again in a moment." });
  }
}
