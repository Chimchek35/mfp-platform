const AMS_BASE = "https://marsapi.ams.usda.gov/services/v1.1";
const CACHE_TTL_MS = 15 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 12_000;
const cache = globalThis.__mfpMarketPriceCache || (globalThis.__mfpMarketPriceCache = { catalog: null, reports: new Map(), prices: null });

function authHeaders() {
  const apiKey = process.env.USDA_AMS_API_KEY;
  return {
    // USDA AMS authenticates the API key as the Basic Auth username with a blank password.
    Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
    Accept: "application/json",
  };
}

const feeds = [
  { commodity: "Corn", report: /corn|grain/i },
  { commodity: "Soybeans", report: /soybean|oilseed/i },
  { commodity: "Cattle", report: /national weekly direct slaughter cattle.*formulated|national weekly.*cattle/i },
];

function firstValue(rows, commodity) {
  const row = rows.find((item) => {
    const text = JSON.stringify(item).toLowerCase();
    return text.includes(commodity.toLowerCase());
  }) || rows[0];
  if (!row) return null;
  const value = Object.entries(row).find(([key, value]) => /price|value|weighted average/i.test(key) && value !== null && value !== "");
  return value ? String(value[1]) : null;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: authHeaders(), signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) {
    const error = new Error(`AMS report catalog returned ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data;
}

async function getReport(reportPattern) {
  const now = Date.now();
  if (!cache.catalog || now - cache.catalog.at < CACHE_TTL_MS) {
    if (!cache.catalog) cache.catalog = { pending: fetchJson(`${AMS_BASE}/reports`) };
    try { cache.catalog = { at: now, data: await cache.catalog.pending }; } catch (error) { cache.catalog = null; throw error; }
  }
  const catalog = cache.catalog.data;
  const reports = catalog.results || catalog || [];
  const match = reports.find((report) => reportPattern.test(`${report.report_title || ""} ${report.reportName || ""} ${report.slug_name || ""}`));
  if (!match) throw new Error(`No AMS report matched ${reportPattern}`);
  const id = match.slug_id || match.report_id || match.reportId || match.slug;
  const cached = cache.reports.get(id);
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.data;
  const detail = await fetchJson(`${AMS_BASE}/reports/${encodeURIComponent(id)}/Detail?lastReports=1`);
  const rows = detail.results || detail.data || detail || [];
  cache.reports.set(id, { at: now, data: rows });
  return rows;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.USDA_AMS_API_KEY) return res.status(503).json({ status: "unavailable", prices: [] });
  try {
    const results = await Promise.allSettled(feeds.map(async (feed) => {
      const rows = await getReport(feed.report);
      return { commodity: feed.commodity, value: firstValue(rows, feed.commodity) || "No current quote", unit: "USDA AMS", asOf: new Date().toLocaleDateString("en-US") };
    }));
    const authFailure = results.find((result) => result.status === "rejected" && result.reason?.status === 401);
    if (authFailure) {
      console.error("[v0] USDA AMS rejected USDA_AMS_API_KEY");
      return res.status(401).json({ status: "authentication_error", prices: [], message: "USDA AMS rejected the configured API key. Generate a MARS API key at marsapi.ams.usda.gov and update USDA_AMS_API_KEY." });
    }
    const prices = results.map((result, index) => result.status === "fulfilled"
      ? result.value
      : cache.prices?.find((price) => price.commodity === feeds[index].commodity) || { commodity: feeds[index].commodity, value: "Report unavailable", unit: "USDA AMS", asOf: "Unable to verify" });
    const liveCount = results.filter((result) => result.status === "fulfilled").length;
    const hasStale = prices.some((price, index) => results[index].status === "rejected" && cache.prices?.some((cached) => cached.commodity === price.commodity));
    if (liveCount) cache.prices = prices;
    return res.status(200).json({ status: liveCount === feeds.length ? "live" : hasStale ? "stale" : "unavailable", prices, message: liveCount === feeds.length ? undefined : hasStale ? "Some reports could not be refreshed. Showing the last successful values." : "USDA AMS returned no usable commodity reports." });
  } catch (error) {
    console.error("[v0] USDA AMS price feed error:", error.message);
    const authError = error.message.includes("401");
    return res.status(authError ? 401 : 502).json({
      status: authError ? "authentication_error" : "unavailable",
      prices: [],
      message: authError ? "USDA AMS rejected the configured API key." : "USDA AMS could not be reached.",
    });
  }
}
