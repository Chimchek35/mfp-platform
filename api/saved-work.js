import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { pool } from "../lib/auth.js";

const MAX_PAYLOAD_BYTES = 900_000;

async function userId(req) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  return session?.user?.id || null;
}

export default async function handler(req, res) {
  try {
    const id = await userId(req);
    if (!id) return res.status(401).json({ error: "Authentication required" });
    if (req.method === "GET") {
      const result = await pool.query('SELECT "id", "module", "title", "payload", "createdAt", "updatedAt" FROM "saved_work" WHERE "userId" = $1 ORDER BY "updatedAt" DESC', [id]);
      return res.status(200).json({ items: result.rows });
    }
    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body?.id || !body?.module || !body?.title || !body.payload || typeof body.payload !== "object" || Array.isArray(body.payload)) return res.status(400).json({ error: "Invalid saved work" });
      if (JSON.stringify(body.payload).length * 2 > MAX_PAYLOAD_BYTES) return res.status(413).json({ error: "Saved work is too large" });
      const result = await pool.query('INSERT INTO "saved_work" ("id", "userId", "module", "title", "payload", "updatedAt") VALUES ($1,$2,$3,$4,$5,now()) ON CONFLICT ("id") DO UPDATE SET "module"=$3,"title"=$4,"payload"=$5,"updatedAt"=now() WHERE "saved_work"."userId"=$2 RETURNING "id", "updatedAt"', [body.id, id, String(body.module).slice(0, 80), String(body.title).slice(0, 200), body.payload]);
      return res.status(200).json(result.rows[0]);
    }
    if (req.method === "DELETE") {
      const key = new URL(req.url, "http://localhost").searchParams.get("id");
      if (!key) return res.status(400).json({ error: "Missing id" });
      await pool.query('DELETE FROM "saved_work" WHERE "id"=$1 AND "userId"=$2', [key, id]);
      return res.status(204).end();
    }
    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[mfp] saved work API error", error);
    return res.status(500).json({ error: "Unable to process saved work" });
  }
}
