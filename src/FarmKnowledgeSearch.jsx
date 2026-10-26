import { useMemo, useState } from "react";

const MODULES = [
  ["profile", "Farm Profile"], ["vision", "Strategic Vision"], ["fa", "Financial Analysis"],
  ["rd", "Revenue Diversification"], ["legacy", "Legacy"], ["risk", "Farm Risk"],
];

function flatten(value, prefix = "") {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object") return flatten(child, path);
    return child === "" || child == null ? [] : [{ key: path, value: String(child) }];
  });
}

export default function FarmKnowledgeSearch({ state, onNavigate }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const entries = useMemo(() => MODULES.flatMap(([module, label]) => flatten(state[module]).map((item) => ({ ...item, module, label }))), [state]);
  const results = useMemo(() => {
    const stopWords = new Set(["what", "are", "my", "the", "a", "an", "is", "me", "about", "tell", "show", "where", "does", "do", "i", "have"]);
    const rawTerms = query.toLowerCase().trim().split(/\s+/).filter((term) => term && !stopWords.has(term));
    if (!rawTerms.length) return [];
    const aliases = { mission: ["mission", "values", "purpose", "direction"], values: ["values", "principles", "beliefs", "mission"], goal: ["goal", "objective", "priority", "headed"], goals: ["goal", "objective", "priority", "headed"], succession: ["succession", "legacy", "transition", "next"] };
    const terms = rawTerms.flatMap((term) => aliases[term] || [term]);
    return entries.filter((entry) => terms.some((term) => `${entry.key} ${entry.value} ${entry.label}`.toLowerCase().includes(term))).slice(0, 6);
  }, [entries, query]);
  const answer = results.length ? `I found ${results.length} saved ${results.length === 1 ? "answer" : "answers"} in your farm record.` : query.trim() ? "I could not find that in the work saved on this browser yet." : "Ask about anything you have already entered.";
  return <div style={{ position: "relative", width: "min(430px, 40vw)" }}>
    <form onSubmit={(event) => { event.preventDefault(); setOpen(true); }} role="search">
      <label htmlFor="farm-knowledge-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Ask your farm record</label>
      <input id="farm-knowledge-search" value={query} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Ask your farm record…" style={{ width: "100%", border: "1px solid #d5e0ea", borderRadius: 8, padding: "10px 13px", color: "#17233d", background: "#fff" }} />
    </form>
    {open && <div style={{ position: "absolute", zIndex: 20, top: "calc(100% + 6px)", right: 0, width: "min(430px, 70vw)", background: "#fff", border: "1px solid #d5e0ea", borderRadius: 10, boxShadow: "0 12px 30px rgba(23,35,61,.14)", padding: 12 }}>
      <div style={{ fontSize: 12, color: "#53657a", lineHeight: 1.5, marginBottom: 8 }}>{answer}</div>
      {results.map((result) => <button key={`${result.module}-${result.key}`} type="button" onClick={() => { onNavigate(result.module); setOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", border: 0, borderTop: "1px solid #edf1f5", background: "transparent", padding: "10px 4px", cursor: "pointer" }}><strong style={{ display: "block", color: "#0c4477", fontSize: 12 }}>{result.label}</strong><span style={{ display: "block", color: "#17233d", fontSize: 13, marginTop: 2 }}>{result.value.slice(0, 150)}{result.value.length > 150 ? "…" : ""}</span><span style={{ display: "block", color: "#718096", fontSize: 11, marginTop: 3 }}>Open this module →</span></button>)}
      {!results.length && query.trim() && <div style={{ color: "#718096", fontSize: 12, padding: "7px 4px" }}>Try words such as mission, values, goals, succession, risk, revenue, or cash.</div>}
      <button type="button" onClick={() => setOpen(false)} style={{ border: 0, background: "transparent", color: "#0c4477", fontSize: 12, padding: "8px 4px 2px", cursor: "pointer" }}>Close</button>
    </div>}
  </div>;
}
