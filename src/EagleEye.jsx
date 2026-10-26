import { useMemo, useState } from "react";
import sources from "./eagle-eye-registry.json";

const drivers = [
  { name: "Global Affluence", detail: "Demand, purchasing power, and premium-market signals", color: "#1ca8c9" },
  { name: "Geopolitics", detail: "Trade, conflict, sanctions, and supply-chain shifts", color: "#0c4477" },
  { name: "Human Health", detail: "Nutrition, safety, and consumer behavior changes", color: "#43a047" },
  { name: "Climate Volatility", detail: "Weather patterns, water, heat, and resilience", color: "#e58b2b" },
  { name: "Technology", detail: "Automation, data, genetics, and farm efficiency", color: "#6b5bd2" },
  { name: "Ownership", detail: "Land, capital, labor, succession, and control", color: "#b65372" },
];

const triggerGroups = ["Market & price", "Input cost", "Policy & regulation", "Weather & disease", "Credit", "Land", "Technology", "Diversification viability"];

export default function EagleEye({ profile = {}, onBack }) {
  const [query, setQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("All");
  const [watching, setWatching] = useState(false);
  const [alertMode, setAlertMode] = useState("weekly");
  const filteredSources = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesDriver = selectedDriver === "All" || [source["Primary driver"], source["MFP dimension served"], source.Layer].join(" ").toLowerCase().includes(selectedDriver.toLowerCase());
      const matchesQuery = !needle || Object.values(source).join(" ").toLowerCase().includes(needle);
      return matchesDriver && matchesQuery;
    }).slice(0, 18);
  }, [query, selectedDriver]);

  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: "100%", overflowY: "auto", background: "#f3f6fb", color: "#17233d", padding: "34px 40px 60px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <button type="button" onClick={onBack} style={{ border: 0, background: "transparent", color: "#0c4477", fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: 20 }}>← Back to modules</button>
        <div style={{ background: "linear-gradient(125deg,#083d62,#0b7390 65%,#20afd2)", color: "#fff", borderRadius: 18, padding: "34px 38px", boxShadow: "0 10px 30px rgba(8,61,98,.18)" }}>
          <div style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", opacity: .8, fontWeight: 700 }}>MFP intelligence layer</div>
          <h1 style={{ margin: "8px 0 10px", fontSize: "clamp(30px,4vw,46px)", color: "#fff" }}>Eagle Eye</h1>
          <p style={{ maxWidth: 720, margin: 0, fontSize: 17, lineHeight: 1.65, color: "rgba(255,255,255,.88)" }}>Short, timely updates that explain what a change means for this farm, connect it to an MFP action, and preserve the source and confidence behind every claim.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
            {["Whole-farm lens", "Near-term + long-term", "Source-backed", "Inform, not advise"].map((item) => <span key={item} style={{ border: "1px solid rgba(255,255,255,.28)", background: "rgba(255,255,255,.1)", borderRadius: 999, padding: "7px 12px", fontSize: 13 }}>{item}</span>)}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginTop: 22 }}>
          {[{ label: "Slow drivers", value: "6", detail: "long-term context" }, { label: "Source registry", value: String(sources.length), detail: "curated records" }, { label: "Trigger families", value: "8", detail: "fast-moving signals" }, { label: "Farm lens", value: profile.location || "Not set", detail: profile.productionMix || "Complete Farm Profile" }].map((metric) => <div key={metric.label} style={{ background: "#fff", border: "1px solid #d5e0ea", borderRadius: 12, padding: "18px 20px" }}><div style={{ color: "#718096", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>{metric.label}</div><div style={{ color: "#0c4477", fontSize: 25, fontWeight: 800, marginTop: 6 }}>{metric.value}</div><div style={{ color: "#53657a", fontSize: 13 }}>{metric.detail}</div></div>)}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(300px,.8fr)", gap: 20, marginTop: 22 }}>
          <section style={{ background: "#fff", border: "1px solid #d5e0ea", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}><div><div style={{ color: "#0c4477", fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>The intelligence model</div><h2 style={{ margin: "6px 0 6px", fontSize: 24 }}>Six slow drivers shape the lay of the land</h2><p style={{ margin: 0, color: "#53657a" }}>Eagle Eye watches fast triggers against these durable forces, then frames the impact through your farm profile.</p></div><button type="button" onClick={() => setWatching(!watching)} style={{ border: 0, borderRadius: 8, padding: "10px 14px", background: watching ? "#43a047" : "#e8f1f6", color: watching ? "#fff" : "#0c4477", fontWeight: 700, cursor: "pointer" }}>{watching ? "Watching this farm" : "Set up farm watch"}</button></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginTop: 22 }}>{drivers.map((driver) => <button key={driver.name} type="button" onClick={() => setSelectedDriver(selectedDriver === driver.name ? "All" : driver.name)} style={{ textAlign: "left", border: `1px solid ${selectedDriver === driver.name ? driver.color : "#d5e0ea"}`, borderTop: `4px solid ${driver.color}`, borderRadius: 10, background: selectedDriver === driver.name ? "#f4fbfd" : "#fff", padding: 14, cursor: "pointer" }}><div style={{ fontWeight: 800, color: "#17233d" }}>{driver.name}</div><div style={{ color: "#53657a", fontSize: 13, lineHeight: 1.45, marginTop: 6 }}>{driver.detail}</div></button>)}</div>
          </section>
          <section style={{ background: "#fff", border: "1px solid #d5e0ea", borderRadius: 14, padding: 24 }}><div style={{ color: "#0c4477", fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Your watch cadence</div><h2 style={{ margin: "6px 0 8px", fontSize: 22 }}>Fewer, better updates</h2><p style={{ color: "#53657a", fontSize: 14, lineHeight: 1.55 }}>Choose how often Eagle Eye should surface relevant changes. This controls the relevance budget, not financial advice.</p><div style={{ display: "grid", gap: 8, marginTop: 16 }}>{[["weekly", "Weekly digest"], ["event", "Only meaningful triggers"], ["monthly", "Monthly context review"]].map(([value, label]) => <label key={value} style={{ display: "flex", gap: 9, alignItems: "center", padding: "10px 12px", border: `1px solid ${alertMode === value ? "#0c4477" : "#d5e0ea"}`, borderRadius: 8, cursor: "pointer" }}><input type="radio" checked={alertMode === value} onChange={() => setAlertMode(value)} />{label}</label>)}</div></section>
        </div>

        <section style={{ background: "#fff", border: "1px solid #d5e0ea", borderRadius: 14, padding: 24, marginTop: 20 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "end" }}><div><div style={{ color: "#0c4477", fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Source registry</div><h2 style={{ margin: "6px 0 4px", fontSize: 24 }}>What Eagle Eye can watch</h2><p style={{ margin: 0, color: "#53657a" }}>Curated sources are used for context, verification, and provenance.</p></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sources" aria-label="Search source registry" style={{ width: 240, border: "1px solid #cbd8e2", borderRadius: 8, padding: "10px 12px", fontSize: 15 }} /></div><div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "18px 0 12px" }}><button type="button" onClick={() => setSelectedDriver("All")} style={{ border: 0, borderRadius: 999, padding: "7px 12px", background: selectedDriver === "All" ? "#0c4477" : "#e8f1f6", color: selectedDriver === "All" ? "#fff" : "#0c4477", fontWeight: 700, whiteSpace: "nowrap" }}>All sources</button>{triggerGroups.map((group) => <button type="button" key={group} onClick={() => setSelectedDriver(group)} style={{ border: 0, borderRadius: 999, padding: "7px 12px", background: selectedDriver === group ? "#0c4477" : "#e8f1f6", color: selectedDriver === group ? "#fff" : "#0c4477", fontWeight: 700, whiteSpace: "nowrap" }}>{group}</button>)}</div><div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ textAlign: "left", color: "#718096", borderBottom: "1px solid #d5e0ea" }}>{["Source", "Driver", "Cadence", "Role", "What it answers"].map((heading) => <th key={heading} style={{ padding: "10px 8px" }}>{heading}</th>)}</tr></thead><tbody>{filteredSources.map((source) => <tr key={source.ID} style={{ borderBottom: "1px solid #edf1f5" }}><td style={{ padding: "12px 8px", fontWeight: 800, color: "#0c4477" }}>{source.Source}<div style={{ fontSize: 11, color: "#718096", fontWeight: 400 }}>{source.Publisher}</div></td><td style={{ padding: "12px 8px" }}>{source["Primary driver"]}</td><td style={{ padding: "12px 8px" }}>{source["Update cadence"]}</td><td style={{ padding: "12px 8px" }}>{source["System role"]}</td><td style={{ padding: "12px 8px", minWidth: 260 }}>{source["What it answers"]}</td></tr>)}</tbody></table></div></section>
      </div>
    </div>
  );
}
