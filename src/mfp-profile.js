// MFP profile engine: schema, validation, override application, block scoring,
// no-profile mode and export for the MFP Conversational Assessment Guide
// (46 questions, 12 blocks, 1–5 maturity scale).
//
// The instrument measures maturity. Metrics measure outcome. A full override is
// only justified where the question literally asks for a number; everywhere else
// a metric may bound the assessed score, never replace it. A bad metric is
// stronger evidence than a good one, so partials lift by at most 1 band and drop
// by up to 2. The assessed scores in `blocks` are never mutated: the gap between
// belief and measurement is itself a finding.

export const MFP_PROFILE_SCHEMA = "mfp-profile-v1";

export const MFP_BLOCKS = [
  { n:1,  label:"Organizational Structure, Role Clarity & Governance", short:"Organizational structure", questions:["O1","O2","O3"] },
  { n:2,  label:"Workforce Planning, Recruitment, Training & Retention", short:"Workforce planning", questions:["W1","W2"] },
  { n:3,  label:"Record Keeping, Data Management & Decision Support", short:"Records & data", questions:["R1","R2","R3","R4","R5"] },
  { n:4,  label:"External Market Analysis & Intelligence", short:"Market analysis", questions:["M1","M2","M3","M4"] },
  { n:5,  label:"Income Diversification & Product Value Creation", short:"Income diversification", questions:["D1","D2","D3","D4"] },
  { n:6,  label:"Adoption Decisions, Efficiency & Decision Analytics", short:"Adoption & efficiency", questions:["A1","A2","A3","A4"] },
  { n:7,  label:"Succession Planning & Generational Transfer", short:"Succession", questions:["S1","S2","S3","S4"] },
  { n:8,  label:"Knowledge Management & Intergenerational Transfer", short:"Knowledge management", questions:["K1","K2","K3","K4"] },
  { n:9,  label:"Risk Management, Weather Preparedness & Cybersecurity", short:"Risk management", questions:["P1","P2","P3","P4"] },
  { n:10, label:"Strategic Vision, Planning & Core Values", short:"Strategic vision", questions:["V1","V2","V3","V4"] },
  { n:11, label:"Financial Metrics, Analysis & Cash Flow", short:"Financial analysis", questions:["F1","F2","F3","F4"] },
  { n:12, label:"Competitive Advantage & Core Competencies", short:"Competitive advantage", questions:["C1","C2","C3","C4"] },
];

// Short working labels so a question row can be read without the full guide open.
export const MFP_QUESTION_LABELS = {
  O1:"Legal structure", O2:"Decision thresholds", O3:"Role clarity",
  W1:"Workforce plan", W2:"Recruitment, training & retention",
  R1:"Production records", R2:"Financial records", R3:"Data management", R4:"Timeliness & accuracy of financials", R5:"Decision support",
  M1:"Market scanning", M2:"Price & market intelligence", M3:"Buyer & competitor awareness", M4:"Linking insight to strategy",
  D1:"Revenue concentration", D2:"Product value creation", D3:"Performance evaluation per stream", D4:"Evaluating new income",
  A1:"Technology adoption", A2:"Efficiency measurement", A3:"Decision analytics", A4:"Investment evaluation",
  S1:"Succession plan status", S2:"Successor readiness", S3:"Estate integration", S4:"Family communication",
  K1:"Critical knowledge identified", K2:"Documentation", K3:"Transfer practice", K4:"Knowledge access",
  P1:"Risk identification", P2:"Weather preparedness", P3:"Insurance review", P4:"Cybersecurity",
  V1:"Business plan", V2:"Review cadence", V3:"Planning horizon", V4:"Core values in use",
  F1:"Financial statements", F2:"Monitoring key ratios", F3:"Cash flow planning", F4:"Benchmarking",
  C1:"Core strengths", C2:"Differentiation", C3:"Values in decisions", C4:"Competency development",
};

export const MFP_QUESTION_COUNT = MFP_BLOCKS.reduce((n, b) => n + b.questions.length, 0);

export const blockOf = (questionId) => MFP_BLOCKS.find(b => b.questions.includes(questionId)) || null;

// Blocks no financial metric bears on. Blocks 7, 8, 10 and 12 can be informed by
// the Legacy and Strategic Vision modules, but through a different mechanism.
export const MFP_UNCOVERED_BLOCKS = [
  { n:1,  covers:"Legal structure, decision thresholds, role clarity", dependsOn:"Entity questions in Legacy; who can authorise what" },
  { n:4,  covers:"Market scanning, linking insight to strategy", dependsOn:"How Revenue Diversification weighs market-facing paths" },
  { n:7,  covers:"Plan status, successor readiness, estate integration", dependsOn:"The Legacy module's readiness tier" },
  { n:8,  covers:"Critical knowledge, documentation, transfer", dependsOn:"Legacy knowledge-transfer targets" },
  { n:9,  covers:"Risk identification, weather, insurance, cyber", dependsOn:"Farm Risk threat ranking and strategy" },
  { n:10, covers:"Business plan, review cadence, horizon", dependsOn:"The Strategic Vision module's starting point" },
  { n:12, covers:"Core strengths, differentiation, values in decisions", dependsOn:"How Strategic Vision classifies each strength" },
];

// ── Score conversion ────────────────────────────────────────────────────────

export const to100 = (s) => Math.round((s - 1) / 4 * 100);
export const clamp5 = (v) => Math.min(5, Math.max(1, v));
export const round1 = (v) => +Number(v).toFixed(1);

// Partial overrides lift by at most 1 band and drop by up to 2.
export const partialClamp = (assessed, metric) => Math.max(assessed - 2, Math.min(assessed + 1, metric));

// ── Validation ──────────────────────────────────────────────────────────────

// A profile failing validation is rejected entirely. A half-loaded profile
// produces block averages over missing questions.
export function validateProfile(p) {
  if (!p || typeof p !== "object") return "Not a readable MFP profile.";
  if (p.schema !== MFP_PROFILE_SCHEMA) return "Unrecognised profile version.";
  if (!p.blocks || typeof p.blocks !== "object") return "No assessment blocks found.";
  for (const b of MFP_BLOCKS) {
    const qs = p.blocks[String(b.n)] && p.blocks[String(b.n)].questions;
    if (!qs) return `Block ${b.n} is missing.`;
    if (Object.keys(qs).length !== b.questions.length) return `Block ${b.n} should have ${b.questions.length} questions.`;
    for (const [q, v] of Object.entries(qs))
      if (typeof v !== "number" || Number.isNaN(v) || v < 1 || v > 5) return `${q} is not a 1–5 score.`;
  }
  return null;
}

export const isMFPProfile = (raw) => !!raw && typeof raw === "object" && raw.schema === MFP_PROFILE_SCHEMA;

// Strips anything the modules write so a re-imported profile recomputes its
// overrides instead of trusting values computed against older module data.
export function importProfile(raw) {
  const error = validateProfile(raw);
  if (error) return { profile:null, error };
  const profile = { ...raw, overrides:{}, lastMetricUpdate:null };
  delete profile.blockScores;
  delete profile.overallScore;
  return { profile, error:null };
}

// ── Apply ───────────────────────────────────────────────────────────────────

export const assessedScore = (profile, questionId) => {
  const b = blockOf(questionId);
  const v = b && profile && profile.blocks && profile.blocks[String(b.n)] && profile.blocks[String(b.n)].questions
    ? profile.blocks[String(b.n)].questions[questionId] : undefined;
  return typeof v === "number" ? v : null;
};

// Runs whenever module data changes. Idempotent, so it is safe on every render.
// `registry` entries: { questionId, type:"full"|"partial", source, compute(ctx) }
// where compute returns { score, raw, confidence, detail } or null when the
// inputs are absent.
// A compute that throws on an unexpected data shape is treated as inputs absent.
const safeCompute = (ov, ctx) => { try { return ov.compute(ctx) || null; } catch { return null; } };

export function applyOverrides(profile, registry, ctx) {
  const out = { ...profile, overrides:{ ...((profile && profile.overrides) || {}) } };
  const now = new Date().toISOString();
  for (const ov of registry) {
    const res = safeCompute(ov, ctx);
    if (!res) { delete out.overrides[ov.questionId]; continue; }
    const assessed = assessedScore(profile, ov.questionId);
    const base = { assessed, metric:round1(res.score), type:ov.type, source:ov.source, raw:res.raw, detail:res.detail || "", confidence:res.confidence, updatedAt:now };
    if (res.confidence === "low") {
      out.overrides[ov.questionId] = { ...base, applied:null, blocked:"low confidence in the underlying data" };
      continue;
    }
    const applied = ov.type === "full" || assessed == null ? res.score : partialClamp(assessed, res.score);
    out.overrides[ov.questionId] = { ...base, applied:round1(clamp5(applied)) };
  }
  out.lastMetricUpdate = now;
  return out;
}

// The effective score for any question. A blocked override is not a missing
// score, so it falls back to the assessed value.
export const effectiveScore = (profile, questionId) => {
  const ov = profile && profile.overrides ? profile.overrides[questionId] : null;
  if (ov && typeof ov.applied === "number") return ov.applied;
  return assessedScore(profile, questionId);
};

export const provenanceBadge = (profile, questionId) => {
  if (!profile) return "not scored";
  const ov = profile.overrides ? profile.overrides[questionId] : null;
  if (!ov) return "assessed";
  if (ov.blocked) return "metric blocked";
  return ov.type === "full" ? "measured" : "adjusted";
};

// ── Block and overall scores ────────────────────────────────────────────────

export function computeBlockScores(profile) {
  const blocks = {};
  for (const b of MFP_BLOCKS) {
    const questions = b.questions.map(q => {
      const assessed = assessedScore(profile, q);
      const applied = effectiveScore(profile, q);
      return { id:q, label:MFP_QUESTION_LABELS[q] || q, assessed, applied, badge:provenanceBadge(profile, q), override:(profile.overrides || {})[q] || null };
    });
    const vals = questions.map(q => q.applied).filter(v => typeof v === "number");
    const assessedVals = questions.map(q => q.assessed).filter(v => typeof v === "number");
    const mean5 = vals.length ? vals.reduce((a, v) => a + v, 0) / vals.length : null;
    const assessedMean5 = assessedVals.length ? assessedVals.reduce((a, v) => a + v, 0) / assessedVals.length : null;
    blocks[String(b.n)] = {
      n:b.n, label:b.label, short:b.short, questions,
      mean5: mean5 == null ? null : round1(mean5),
      assessedMean5: assessedMean5 == null ? null : round1(assessedMean5),
      score100: mean5 == null ? null : to100(mean5),
      overridden: questions.some(q => q.badge === "measured" || q.badge === "adjusted"),
      badge: questions.some(q => q.badge === "measured") ? "measured" : questions.some(q => q.badge === "adjusted") ? "adjusted" : null,
    };
  }
  const scored = Object.values(blocks).map(b => b.score100).filter(v => typeof v === "number");
  const overall = scored.length ? Math.round(scored.reduce((a, v) => a + v, 0) / scored.length) : null;
  return { blocks, overall };
}

// ── Export ──────────────────────────────────────────────────────────────────

// Same schema in and out, so the file round-trips. `blocks` is byte-identical to
// what was uploaded; `overrides` carries the audit trail.
export function exportProfile(profile, registry, ctx) {
  const updated = applyOverrides(profile, registry, ctx);
  const { blocks, overall } = computeBlockScores(updated);
  updated.blockScores = Object.fromEntries(Object.entries(blocks).map(([k, b]) => [k, b.score100]));
  updated.overallScore = overall;
  return updated;
}

// ── No-profile mode ─────────────────────────────────────────────────────────

// A partial override cannot produce a score without a profile; it adjusts an
// assessed score, and with nothing to adjust there is nothing to produce. Full
// overrides produce a real score. Everything else needs the assessment.
export function noProfileSummary(registry, ctx) {
  const scored = [];
  const indicated = [];
  const seenGroups = new Set();
  for (const ov of registry) {
    const res = safeCompute(ov, ctx);
    if (!res) continue;
    const block = blockOf(ov.questionId);
    if (ov.type === "full") {
      scored.push({ questionId:ov.questionId, label:ov.label || MFP_QUESTION_LABELS[ov.questionId], block, score:round1(res.score), score100:to100(res.score), raw:res.raw, detail:res.detail || "", confidence:res.confidence });
    } else {
      const g = ov.group || ov.questionId;
      if (seenGroups.has(g)) continue;
      seenGroups.add(g);
      indicated.push({ questionId:ov.questionId, group:g, label:ov.groupLabel || ov.label || MFP_QUESTION_LABELS[ov.questionId], block, raw:res.raw, detail:res.detail || "", confidence:res.confidence });
    }
  }
  return { scored, indicated, uncovered:MFP_UNCOVERED_BLOCKS, coverage:coverageOf(registry) };
}

// Counted from the registry rather than stated, so the UI cannot drift from the code.
export function coverageOf(registry) {
  const full = registry.filter(r => r.type === "full").length;
  const partial = registry.filter(r => r.type === "partial").length;
  const blocksCovered = new Set(registry.map(r => (blockOf(r.questionId) || {}).n).filter(Boolean)).size;
  return { full, partial, none:MFP_QUESTION_COUNT - full - partial, total:MFP_QUESTION_COUNT, blocksCovered, blocksUncovered:MFP_BLOCKS.length - blocksCovered, blocksTotal:MFP_BLOCKS.length };
}
