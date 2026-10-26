const AMS_BASE = "https://marsapi.ams.usda.gov/services/v1.1";

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

async function getReport(reportPattern) {
  const response = await fetch(`${AMS_BASE}/reports`, { headers: authHeaders() });
  if (!response.ok) {
    const error = new Error(`AMS report catalog returned ${response.status}`);
    error.status = response.status;
    throw error;
  }
  const catalog = await response.json();
  const reports = catalog.results || catalog || [];
  const match = reports.find((report) => reportPattern.test(`${report.report_title || ""} ${report.reportName || ""} ${report.slug_name || ""}`));
  if (!match) throw new Error(`No AMS report matched ${reportPattern}`);
  const id = match.slug_id || match.report_id || match.reportId || match.slug;
  const detail = await fetch(`${AMS_BASE}/reports/${encodeURIComponent(id)}/Detail?lastReports=1`, { headers: authHeaders() });
  if (!detail.ok) {
    const error = new Error(`AMS report returned ${detail.status}`);
    error.status = detail.status;
    throw error;
  }
  const data = await detail.json();
  return data.results || data.data || data || [];
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
      return res.status(401).json({ status: "authentication_error", prices: [], message: "USDA AMS rejected the configured API key." });
    }
    const prices = results.map((result, index) => result.status === "fulfilled"
      ? result.value
      : { commodity: feeds[index].commodity, value: "No current quote", unit: "USDA AMS", asOf: "Report unavailable" });
    const liveCount = results.filter((result) => result.status === "fulfilled").length;
    return res.status(200).json({ status: liveCount ? "live" : "unavailable", prices });
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
