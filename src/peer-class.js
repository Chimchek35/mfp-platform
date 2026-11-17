// Peer-class thresholds for Tier 2 and Tier 3 ratios.
//
// A fixed threshold assumes every farm is the same kind of business. The thresholds
// here are percentiles within a peer class (enterprise type × scale band × tenure
// mix) built by scripts/peer-data/generate.cjs, so an orchard is read against
// orchards and a renter against renters. Tier 1 ratios keep their fixed thresholds;
// nothing in this file is applied to them.
import PEER from "./peer-thresholds.json";

export const PEER_CLASSES = PEER.classes;
export const PEER_SCALE_BANDS = PEER.scaleBands;
export const PEER_METRICS = PEER.metrics;

// Financial Analysis records enterprises under two vocabularies: the Stage 1 list
// (fa.enterprises) and the Stage 2 registry (fa.ent.list[].kind). Both collapse to
// the three archetypes the dataset was built from.
const KIND_MAP = {
  grain:"rowcrop", soybeans:"rowcrop", forage:"rowcrop", beef:"rowcrop", feeder:"rowcrop", hogs:"rowcrop", swine:"rowcrop", poultry:"rowcrop", broilers:"rowcrop", layers:"rowcrop", mixed:"rowcrop", other:"rowcrop", service:"rowcrop", storage:"rowcrop", land:"rowcrop",
  dairy:"dairy",
  perennial:"perennial", perennials:"perennial", specialty:"perennial", produce:"perennial",
};
export const PEER_KIND_LABEL = { rowcrop:"row crop", dairy:"dairy", perennial:"orchard / specialty" };
export const PEER_TENURE_KEY = { "owner-heavy":"owner-heavy", "mixed tenure":"mixed", "renter-heavy":"renter-heavy" };
export const PEER_TENURE_LABEL = { "owner-heavy":"owner-heavy", mixed:"mixed tenure", "renter-heavy":"renter-heavy" };

// The registry wins when it exists because it carries the enterprises the farm
// actually tracks; dairy and perennial dominate a mix because their cost structure
// does, so a dairy with some corn is read against dairies.
export const peerKindOf = (fa) => {
  const registry = ((((fa || {}).ent) || {}).list || []).map(e => e.kind);
  const stage1 = ((fa || {}).enterprises) || [];
  const kinds = (registry.length ? registry : stage1).map(k => KIND_MAP[k]).filter(Boolean);
  if (!kinds.length) return null;
  if (kinds.includes("dairy")) return "dairy";
  if (kinds.includes("perennial") && !kinds.includes("rowcrop")) return "perennial";
  if (kinds.includes("perennial") && kinds.filter(k => k === "perennial").length >= kinds.filter(k => k === "rowcrop").length) return "perennial";
  return "rowcrop";
};

export const peerScaleOf = (kind, acres) => {
  const bands = PEER_SCALE_BANDS[kind || "rowcrop"];
  const a = Number(acres);
  if (!bands || !Number.isFinite(a) || a <= 0) return null;
  if (a < bands.mid[0]) return "small";
  if (a < bands.large[0]) return "mid";
  return "large";
};

// tenureClass is the label computeFARatios already derives from land as a share of
// assets. The class is only "known" when all three parts are; otherwise the row-crop,
// mid, mixed class stands in and the UI says so.
export const peerClassOf = ({ kind, acres, tenureClass }) => {
  const k = kind || null, s = peerScaleOf(kind || "rowcrop", acres), t = tenureClass ? PEER_TENURE_KEY[tenureClass] || null : null;
  const known = !!(k && s && t);
  const key = `${k || "rowcrop"}|${s || "mid"}|${t || "mixed"}`;
  const cls = PEER_CLASSES[key] || PEER_CLASSES["rowcrop|mid|mixed"];
  const bands = PEER_SCALE_BANDS[k || "rowcrop"];
  const scaleLabel = s ? `${s} (${bands[s][0].toLocaleString()}–${bands[s][1].toLocaleString()} ${bands.unit})` : null;
  return { key, known, kind:k, scale:s, tenure:t, n:cls ? cls.n : 0, metrics:cls ? cls.metrics : {},
    label: known ? `${PEER_KIND_LABEL[k]}, ${s} scale, ${PEER_TENURE_LABEL[t]}` : "row crop, mid scale, mixed tenure (assumed)",
    scaleLabel, missing:[!k && "enterprise type", !s && "total acres", !t && "tenure (owned land value)"].filter(Boolean) };
};

// Linear interpolation across the five stored percentiles, clamped to 5–95 so a
// value beyond p90 reads "top 5%" rather than an invented 99th.
export const percentileRank = (v, m) => {
  if (v === null || v === undefined || !m || m.p10 === null) return null;
  const pts = [[5, m.p10 - (m.p25 - m.p10)], [10, m.p10], [25, m.p25], [50, m.p50], [75, m.p75], [90, m.p90], [95, m.p90 + (m.p90 - m.p75)]];
  if (v <= pts[0][1]) return 5;
  if (v >= pts[pts.length - 1][1]) return 95;
  for (let i = 1; i < pts.length; i++) {
    const [pA, vA] = pts[i - 1], [pB, vB] = pts[i];
    if (v <= vB) return vB === vA ? pB : Math.round(pA + (pB - pA) * (v - vA) / (vB - vA));
  }
  return 95;
};

// Strong = better than the class's 75th percentile, vulnerable = worse than its 25th,
// watch = the middle half. Capacity metrics (strongIsLow === null) have no good
// direction and return only a rank.
export const peerBand = (v, metricKey, cls) => {
  const m = cls && cls.metrics ? cls.metrics[metricKey] : null;
  if (v === null || v === undefined || !m || m.p25 === null) return null;
  const rank = percentileRank(v, m);
  if (m.strongIsLow === null) return { status:null, rank, p25:m.p25, p50:m.p50, p75:m.p75, metricKey };
  const status = m.strongIsLow ? (v <= m.p25 ? "strong" : v >= m.p75 ? "vuln" : "watch") : (v >= m.p75 ? "strong" : v <= m.p25 ? "vuln" : "watch");
  // "better than N% of the class" reads the same way whichever direction is good.
  const better = m.strongIsLow ? 100 - rank : rank;
  return { status, rank, better, p25:m.p25, p50:m.p50, p75:m.p75, strongIsLow:m.strongIsLow, metricKey };
};

export const peerBenchText = (metricKey, cls, fmt) => {
  const m = cls && cls.metrics ? cls.metrics[metricKey] : null;
  if (!m || m.p50 === null) return null;
  const f = fmt || (x => Math.round(x).toString());
  if (m.strongIsLow === null) return `Peer median ${f(m.p50)} · quartiles ${f(m.p25)}–${f(m.p75)}`;
  return m.strongIsLow ? `Peer median ${f(m.p50)} · top quartile < ${f(m.p25)}` : `Peer median ${f(m.p50)} · top quartile > ${f(m.p75)}`;
};
