/* global process */
import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const origin = (value) => (value ? (value.startsWith("http") ? value : `https://${value}`) : null);
const runtimeOrigins = [
  "http://localhost:5173",
  origin(process.env.VITE_NEON_AUTH_URL),
  origin(process.env.VERCEL_URL),
  origin(process.env.VERCEL_PROJECT_PRODUCTION_URL),
].filter(Boolean);

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: origin(process.env.BETTER_AUTH_URL) || runtimeOrigins[0],
  trustedOrigins: runtimeOrigins,
  emailAndPassword: { enabled: true },
  ...(process.env.NODE_ENV === "development" ? {
    advanced: { defaultCookieAttributes: { sameSite: "none", secure: true } },
  } : {}),
});
