const AMS_BASE = "https://mpr.datamart.ams.usda.gov/services/v1.1";

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
  const response = await fetch(`${AMS_BASE}/reports`, { headers: { "x-api-key": process.env.USDA_AMS_API_KEY } });
  if (!response.ok) throw new Error(`AMS report catalog returned ${response.status}`);
  const catalog = await response.json();
  const reports = catalog.results || catalog || [];
  const match = reports.find((report) => reportPattern.test(`${report.report_title || ""} ${report.reportName || ""} ${report.slug_name || ""}`));
  if (!match) throw new Error(`No AMS report matched ${reportPattern}`);
  const id = match.slug_id || match.report_id || match.reportId || match.slug;
  const detail = await fetch(`${AMS_BASE}/reports/${encodeURIComponent(id)}/Detail?lastReports=1`, { headers: { "x-api-key": process.env.USDA_AMS_API_KEY } });
  if (!detail.ok) throw new Error(`AMS report returned ${detail.status}`);
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
    const prices = results.map((result, index) => result.status === "fulfilled"
      ? result.value
      : { commodity: feeds[index].commodity, value: "No current quote", unit: "USDA AMS", asOf: "Report unavailable" });
    const liveCount = results.filter((result) => result.status === "fulfilled").length;
    return res.status(200).json({ status: liveCount ? "live" : "unavailable", prices });
  } catch (error) {
    console.error("[v0] USDA AMS price feed error:", error.message);
    return res.status(502).json({ status: "unavailable", prices: [] });
  }
}
