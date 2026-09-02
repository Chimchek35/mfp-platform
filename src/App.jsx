import { useState, useMemo, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FONTS  (system stack, matching the MFP action plan design language)
// Idealyst brand system used in the design export. In production, swap this
// @import for the bundled TTFs shipped in /fonts in the .dc.html package.)
// ─────────────────────────────────────────────────────────────────────────────
const FontStyles = () => (
  <style>{`
    *{box-sizing:border-box;}
    .mfp-root{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:#181c24;font-size:15px;line-height:1.6;-webkit-font-smoothing:antialiased;}
    .mfp-root h1,.mfp-root h2,.mfp-root h3,.mfp-root h4{margin:0;font-weight:600;line-height:1.25;}
    .mfp-root a{color:#0C4477;text-decoration:none;}
    .mfp-root input,.mfp-root select,.mfp-root textarea,.mfp-root button{font-family:inherit;}
    .mfp-root input:focus,.mfp-root select:focus,.mfp-root textarea:focus{border-color:#0C4477!important;box-shadow:0 0 0 3px rgba(12,68,119,0.10);outline:none;}
    .mfp-root input[type=range]{accent-color:#0C4477;}
    .mfp-root ::-webkit-scrollbar{width:10px;height:10px;}
    .mfp-root ::-webkit-scrollbar-thumb{background:#d3d8e0;border-radius:5px;}
    .mfp-root ::-webkit-scrollbar-track{background:transparent;}
    @keyframes mfpFade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
    .mfp-body-anim{animation:mfpFade .32s cubic-bezier(0.16,1,0.3,1);}
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — extracted verbatim from the Idealyst brand palette
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  navy:"#0E1C39", blue:"#0C4477", blueH:"#0A3760", green:"#358733", dgreen:"#2C5C11",
  moss:"#97BC62", water:"#0C4477", skies:"#eef2f7", amber:"#C98A2C", amberT:"#8A5C10", tan:"#C98A2C",
  red:"#B3261E", redD:"#8A1E18", silver:"#e2e5ea",
  bg:"#fff", bgAlt:"#f1f3f6", fg:"#181c24", fgM:"#4b5261", fgS:"#858c9a",
  border:"#e2e5ea", div:"#eef0f4", greenL:"#f2f6ec", amberL:"#fdf5e8",
  redL:"#fbeae8", waterL:"#eef2f7", blueL:"#eef2f7",
};

// ─────────────────────────────────────────────────────────────────────────────
// ICONS — small line-icon set matching the design export
// ─────────────────────────────────────────────────────────────────────────────
const Apex = ({ color = T.green, size = 8 }) => (
  <span style={{ display:"inline-block", width:0, height:0, borderLeft:`${size*0.6}px solid transparent`, borderRight:`${size*0.6}px solid transparent`, borderBottom:`${size}px solid ${color}` }} />
);

const Fic = ({ type, size = 15 }) => {
  const c = { ok:T.dgreen, warn:T.amberT, danger:T.red, info:"#0A6E8C", link:"#0A6E8C" }[type];
  const common = { fill:"none", stroke:c, strokeWidth:2, strokeLinecap:"round", strokeLinejoin:"round" };
  const body = {
    ok: <path d="M20 6L9 17l-5-5" />,
    warn: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9L2 18a2 2 0 001.7 3h16.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" /></>,
    danger: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.9L2 18a2 2 0 001.7 3h16.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" /></>,
    info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
    link: <><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" /><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" /></>,
  }[type];
  return <svg width={size} height={size} viewBox="0 0 24 24" {...common} style={{ flexShrink:0, marginTop:1 }}>{body}</svg>;
};

const EntIcon = ({ type, color, size = 22 }) => {
  const p = { fill:"none", stroke:color, strokeWidth:1.8, strokeLinecap:"round", strokeLinejoin:"round" };
  const body = {
    grain: <><path d="M12 20V9" /><path d="M12 9c0-2 1.5-3.5 3.5-3.5C15.5 7.5 14 9 12 9z" /><path d="M12 9c0-2-1.5-3.5-3.5-3.5C8.5 7.5 10 9 12 9z" /><path d="M12 13c0-1.6 1.3-3 3-3 0 1.6-1.3 3-3 3z" /><path d="M12 13c0-1.6-1.3-3-3-3 0 1.6 1.3 3 3 3z" /></>,
    dairy: <><path d="M9 3h6" /><path d="M9 3l-.5 3.5a4 4 0 00-.5 2V19a2 2 0 002 2h4a2 2 0 002-2V8.5a4 4 0 00-.5-2L15 3" /><path d="M7.7 11h8.6" /></>,
    beef: <><path d="M4 7c0-2 2-3 4-2l1 1h6l1-1c2-1 4 0 4 2 0 1.5-1 2.5-2 3v2a5 5 0 01-10 0V10C6 9.5 4 8.5 4 7z" /><circle cx="10" cy="12" r=".6" fill={color} /><circle cx="14" cy="12" r=".6" fill={color} /></>,
  }[type];
  return <svg width={size} height={size} viewBox="0 0 24 24" {...p}>{body}</svg>;
};

const IconChart = ({ color = "#0A4576", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" /><rect x="12" y="7" width="3" height="10" /><rect x="17" y="13" width="3" height="4" />
  </svg>
);
const IconSprout = ({ color = "#0A4576", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c0-6 0-9 6-13" /><path d="M12 14C7 12 5 8 5 3c5 0 9 2 10 6" /><path d="M12 22c0-5-1-8-5-11" />
  </svg>
);
const IconShield = ({ color = "#0A4576", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" />
  </svg>
);
const IconProfile = ({ color = "#0A4576", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M5 17c.7-2 2.3-3 4-3s3.3 1 4 3" /><path d="M14 8h5" /><path d="M14 12h5" />
  </svg>
);
const IconCheckSm = ({ color = "#fff", size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const cardStyle = (extra={}) => ({ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:"24px 28px", marginBottom:14, ...extra });
const h1Style = { fontSize:21, fontWeight:600, color:T.navy, margin:"0 0 4px", letterSpacing:"-0.01em", lineHeight:1.25 };
const eyebrowStyle = { fontSize:10.5, fontWeight:400, letterSpacing:"0.15em", textTransform:"uppercase", color:T.fgS, marginBottom:6 };
const subStyle = { fontSize:13.5, color:T.fgM, margin:"6px 0 22px", maxWidth:640, lineHeight:1.6 };
const cardLblStyle = (extra={}) => ({ fontSize:11, fontWeight:600, letterSpacing:"0.13em", textTransform:"uppercase", color:T.fgS, marginBottom:12, display:"flex", alignItems:"center", gap:8, ...extra });
const inputStyle = (extra={}) => ({ width:"100%", padding:"9px 11px", border:`1px solid ${T.border}`, borderRadius:5, fontSize:14, background:"#fff", color:T.fg, boxSizing:"border-box", ...extra });
const labelStyle = { fontSize:12, fontWeight:600, color:T.fgM, marginBottom:5, display:"block" };
const btnStyle = (variant, color) => {
  const col = color || T.green;
  if (variant === "outline") return { padding:"8px 16px", borderRadius:5, cursor:"pointer", fontSize:13, fontWeight:500, background:"#fff", color:T.blue, border:`1px solid #cbd6e2`, transition:"all .15s" };
  if (variant === "ghost") return { padding:"5px 12px", borderRadius:5, cursor:"pointer", fontSize:12, fontWeight:500, background:T.div, color:T.fgM, border:"none" };
  return { padding:"9px 17px", borderRadius:5, border:"none", cursor:"pointer", fontSize:13.5, fontWeight:500, background:col, color:"#fff", transition:"all .15s" };
};
const pillStyle = (s) => {
  const m = { strong:{bg:T.greenL,c:T.dgreen}, ready:{bg:T.greenL,c:T.dgreen}, watch:{bg:T.amberL,c:T.amberT}, caution:{bg:T.amberL,c:T.amberT}, vuln:{bg:T.redL,c:T.redD}, foundation:{bg:T.redL,c:T.redD}, info:{bg:T.blueL,c:T.blue}, blank:{bg:"#eceef2",c:T.fgS} };
  const st = m[s] || m.blank;
  return { display:"inline-block", padding:"3px 8px", borderRadius:3, fontSize:9.5, fontWeight:600, background:st.bg, color:st.c, letterSpacing:"0.12em", textTransform:"uppercase" };
};
const scColor = (s) => ({ strong:T.dgreen, watch:T.amberT, vuln:T.red, blank:"#9FA4B0" }[s] || "#9FA4B0");
const fmt$ = (n, d=0) => { if (n===null||n===undefined||isNaN(n)) return "—"; const s=Math.abs(n).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g,","); return (n<0?"-$":"$")+s; };
const classify = (r, val) => { if (val===""||val===null||val===undefined||isNaN(parseFloat(val))) return "blank"; const v=parseFloat(val); return r.lb ? (v<=r.sv?"strong":v>=r.vv?"vuln":"watch") : (v>=r.sv?"strong":v<=r.vv?"vuln":"watch"); };

const Flag = ({ type, children }) => {
  const m = { ok:{bg:T.greenL,c:T.dgreen,b:T.moss}, warn:{bg:T.amberL,c:T.amberT,b:T.amber}, danger:{bg:T.redL,c:T.redD,b:T.red}, info:{bg:T.blueL,c:T.blue,b:T.blue} }[type];
  return <div style={{ background:m.bg, color:m.c, borderLeft:`2px solid ${m.b}`, borderRadius:"0 5px 5px 0", padding:"9px 13px", fontSize:12.5, marginBottom:10, lineHeight:1.55 }}>{children}</div>;
};

const Head = ({ eyebrow, title, sub }) => (
  <div>
    <div style={eyebrowStyle}>{eyebrow}</div>
    <h1 style={h1Style}>{title}</h1>
    <p style={subStyle}>{sub}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const FA_STAGES = [
  { n:1, label:"Enterprise dashboard" }, { n:2, label:"Goal alignment" }, { n:3, label:"Ratio deep dive" },
  { n:4, label:"Peer benchmarking" },
];
const RD_STAGES = [
  { n:1, label:"Baseline & readiness" }, { n:2, label:"Goal alignment" }, { n:3, label:"Human capital, assets & financial capital" },
  { n:4, label:"Opportunity mapping" }, { n:5, label:"Barrier identification" }, { n:6, label:"Policy & grant enablers" },
  { n:7, label:"Scenario comparison" }, { n:8, label:"Financial reserves & sequencing" }, { n:9, label:"Action plan" },
];
// RISK_STAGES mirrors RISK_CATS 1:1 for stages 1–8 (one category per stage), then adds
// Results and Action plan as stages 9–10 — same generic stage/rail/Back/Continue system
// used by FA and RD, just with a 10-stage sequence instead of a linear questionnaire.
// Stages 11–14 add the Nationwide Farm Risk Ready℠ Plan Builder — a structured planning
// workbook (distinct from the scored quiz in stages 1–10): identify specific farm risks,
// rank them by probability × severity, choose a management strategy, build contingency
// plans, and set a communication/training/review cadence.
// Farm Risk covers the full 4-section Farm Risk Ready℠ assessment quiz (Identifying risk,
// Managing & preventing risk, Contingency planning, Communicating the plan) — restored
// to match Nationwide's actual tool exactly — plus the full Plan Builder.
const RISK_STAGES = [
  { n:1, label:"Identifying risk" }, { n:2, label:"Managing & preventing risk" },
  { n:3, label:"Contingency planning" }, { n:4, label:"Communicating the plan" },
  { n:5, label:"Results" },
  { n:6, label:"Revenue ops & key contacts" }, { n:7, label:"Threat identification & ranking" },
  { n:8, label:"Strategy & contingency plans" }, { n:9, label:"Communicate, train & review" },
  { n:10, label:"Your risk plan" },
  { n:11, label:"Crop insurance calculator" }, { n:12, label:"Livestock insurance calculator" },
];

const ENT = {
  grain: { label:"Grains", sub:"Corn · soybeans · wheat", ratios:[
    { key:"oer", label:"Operating expense ratio", unit:"%", strong:"< 65%", watch:"65–80%", vuln:"> 80%", sv:65, vv:80, lb:true },
    { key:"ipa", label:"Input cost per acre", unit:"$/ac", strong:"< $478", watch:"$478–535", vuln:"> $535", sv:478, vv:535, lb:true },
    { key:"grpa", label:"Gross revenue per acre", unit:"$/ac", strong:"> $951", watch:"$800–951", vuln:"< $800", sv:951, vv:800, lb:false },
    { key:"nrpa", label:"Net return per acre", unit:"$/ac", strong:"> $150", watch:"$50–150", vuln:"< $50", sv:150, vv:50, lb:false },
    { key:"dscr", label:"Debt service coverage", unit:"x", strong:"> 1.25x", watch:"1.0–1.25x", vuln:"< 1.0x", sv:1.25, vv:1.0, lb:false },
  ]},
  dairy: { label:"Dairy", sub:"Milk production", ratios:[
    { key:"iofc", label:"Income over feed cost", unit:"$/cow/day", strong:"> $10", watch:"$7–10", vuln:"< $7", sv:10, vv:7, lb:false },
    { key:"ncop", label:"Net cost of production", unit:"$/cwt", strong:"< $21", watch:"$21–23", vuln:"> $23", sv:21, vv:23, lb:true },
    { key:"oer", label:"Operating expense ratio", unit:"%", strong:"< 70%", watch:"70–80%", vuln:"> 80%", sv:70, vv:80, lb:true },
    { key:"dscr", label:"Debt service coverage", unit:"x", strong:"> 1.25x", watch:"1.0–1.25x", vuln:"< 1.0x", sv:1.25, vv:1.0, lb:false },
  ]},
  beef: { label:"Beef", sub:"Cow-calf", ratios:[
    { key:"nrpc", label:"Net return per cow", unit:"$/cow", strong:"> $400", watch:"$100–400", vuln:"< $100", sv:400, vv:100, lb:false },
    { key:"tc", label:"Total cost per cow", unit:"$/cow", strong:"< $600", watch:"$600–1,046", vuln:"> $1,046", sv:600, vv:1046, lb:true },
    { key:"dscr", label:"Debt service coverage", unit:"x", strong:"> 1.25x", watch:"1.0–1.25x", vuln:"< 1.0x", sv:1.25, vv:1.0, lb:false },
  ]},
};

// Each opportunity now carries: cluster (5-cluster taxonomy), growthTier (1=fastest
// structural growth, 2=strong incremental growth, 3=steady/selective), sizeFit (which
// farm revenue tiers this typically suits best), reg (regulatory complexity 1–5),
// seasonal (conflict with the core farm calendar, 1=complements it, 5=directly competes).
const OPPS = [
  { id:"energy", label:"Renewable energy lease", category:"Financial capital", cluster:"Environmental & Energy", growthTier:1, sizeFit:["mid","large"], desc:"Solar or wind developer leases your land. Passive income, no capital required.", time:"12–24 months", capital:"$0–$2K", fit:{asset:40,trust:30,risk:80}, reg:4, seasonal:1 , effort:1, liquidity:2, policyPrograms:[{name:"USDA REAP (Rural Energy for America Program)",agency:"USDA Rural Development",note:"Covers up to 25% of project cost for producer-owned renewable energy systems. Status as of mid-2026: new grant awards are paused pending updated regulations — loan guarantees remain available. Confirm current status before counting on grant funding."}] },
  { id:"specialty", label:"Specialty grain contracts", category:"Human capital", cluster:"Value-Added Processing & Brands", growthTier:2, sizeFit:["small","mid"], desc:"Grow identity-preserved grains — malting barley, non-GMO corn, food-grade soybeans — under contract.", time:"8–14 months", capital:"$5K–$20K", fit:{asset:60,trust:80,risk:50}, reg:2, seasonal:4 , effort:4, liquidity:3 },
  { id:"custom", label:"Custom farming services", category:"Assets", cluster:"Custom Field Services", growthTier:2, sizeFit:["mid","large"], desc:"Hire out equipment and labor to neighboring farms for tillage, planting, or spraying.", time:"3–6 months", capital:"$0 if equipment audit passes", fit:{asset:90,trust:60,risk:40}, reg:2, seasonal:5 , effort:5, liquidity:3 },
  { id:"carbon", label:"Carbon & conservation programs", category:"Financial capital", cluster:"Environmental & Energy", growthTier:1, sizeFit:["small","mid","large"], desc:"Enroll in USDA conservation programs or voluntary carbon markets.", time:"6–18 months", capital:"$0–$5K", fit:{asset:30,trust:40,risk:90}, reg:3, seasonal:1 , effort:2, liquidity:2 },
  { id:"education", label:"On-farm education & agritourism", category:"Human capital", cluster:"Space, Storage & Experience", growthTier:3, sizeFit:["small","mid"], desc:"Host farm tours, workshops, or agritourism experiences.", time:"3–9 months", capital:"$2K–$15K", fit:{asset:40,trust:90,risk:30}, reg:3, seasonal:3 , effort:4, liquidity:3 },
  { id:"processing", label:"Value-added processing", category:"Assets", cluster:"Value-Added Processing & Brands", growthTier:2, sizeFit:["mid","large"], desc:"Process or package a portion of production for direct sale — flour, cheese, meat cuts, spirits.", time:"12–24 months", capital:"$20K–$150K", fit:{asset:70,trust:70,risk:50}, reg:5, seasonal:2 , effort:4, liquidity:2, policyPrograms:[{name:"USDA Value-Added Producer Grant (VAPG)",agency:"USDA Rural Development",note:"Up to $200K working capital or $50K planning, 1:1 match required. Funds processing and marketing activity only — not land, buildings, or production equipment. Opens on an annual cycle (FY2026 applications closed April 2026); check grants.gov for the next window."}] },
  { id:"consulting", label:"Agricultural consulting", category:"Human capital", cluster:"Data & Knowledge Services", growthTier:1, sizeFit:["small","mid","large"], desc:"Sell management expertise to other farmers.", time:"1–3 months", capital:"$500–$2K", fit:{asset:10,trust:95,risk:60}, reg:2, seasonal:2 , effort:3, liquidity:4 },
  { id:"storage", label:"Grain storage as a service", category:"Assets", cluster:"Space, Storage & Experience", growthTier:2, sizeFit:["mid","large"], desc:"Rent existing grain storage to neighboring farms during off-peak periods.", time:"1–3 months", capital:"$0", fit:{asset:85,trust:50,risk:70}, reg:2, seasonal:2 , effort:2, liquidity:3 },
  { id:"trucking", label:"Grain & bulk trucking", category:"Assets", cluster:"Trucking & Heavy Equipment", growthTier:2, sizeFit:["mid","large"], desc:"Haul grain, feed, fertilizer, or bulk freight for local elevators and plants using your own trucks and authority.", time:"6–12 months", capital:"$10K–$40K", fit:{asset:80,trust:40,risk:50}, reg:4, seasonal:2 , effort:4, liquidity:2 },
  { id:"demolition", label:"Demolition & excavation", category:"Assets", cluster:"Trucking & Heavy Equipment", growthTier:2, sizeFit:["mid","large"], desc:"Structure teardown, concrete removal, and site clearing using existing excavators, loaders, and trucks.", time:"6–12 months", capital:"$15K–$60K", fit:{asset:75,trust:35,risk:45}, reg:5, seasonal:1 , effort:5, liquidity:2 },
  { id:"beefOnDairy", label:"Beef-on-dairy breeding program", category:"Financial capital", cluster:"Livestock-Specific Ventures", growthTier:2, sizeFit:["mid","large"], desc:"Breed a share of the dairy herd to beef genetics — crossbred calves sell at a significant premium over straight dairy calves.", time:"9–15 months", capital:"$5K–$15K (semen + sorting)", fit:{asset:50,trust:30,risk:75}, reg:1, seasonal:2, entSpecific:"dairy" , effort:3, liquidity:3 },
  { id:"breeding", label:"Breeding stock sales", category:"Human capital", cluster:"Livestock-Specific Ventures", growthTier:3, sizeFit:["small","mid"], desc:"Market high-quality breeding animals to other farmers, building on recognized genetics or bloodlines.", time:"12–24 months", capital:"$5K–$20K", fit:{asset:55,trust:70,risk:40}, reg:2, seasonal:2 , effort:3, liquidity:2 },
  { id:"crpGrazing", label:"CRP land grazing access", category:"Assets", cluster:"Livestock-Specific Ventures", growthTier:3, sizeFit:["small","mid"], desc:"Expand grazing capacity onto enrolled Conservation Reserve Program acres. This depends on pending legislation — the bipartisan Thune-Klobuchar CRP Improvement Act would ease grazing access rules, but it has not passed as of mid-2026. Track its status before building a plan around it.", time:"Uncertain — depends on legislative timeline", capital:"$0–$5K (fencing, water access)", fit:{asset:60,trust:25,risk:50}, reg:3, seasonal:2, entSpecific:"beef", effort:2, liquidity:2, policyPrograms:[{name:"CRP Improvement Act (Thune-Klobuchar, bipartisan)",agency:"U.S. Senate Committee on Agriculture, Nutrition and Forestry",note:"Reintroduced legislation that would improve grazing access on CRP acres and expand enrollment flexibility. Status as of mid-2026: introduced, not enacted — part of a broader Farm Bill negotiation that has stalled repeatedly since the 2018 Farm Bill. Confirm current status with your FSA office before counting on expanded access."}] },
  { id:"addBeefHerd", label:"Add a beef cow-calf herd", category:"Assets", cluster:"On-Farm Production Diversification", growthTier:3, sizeFit:["small","mid"], desc:"Convert marginal ground, crop residue, and underutilized land into a new cow-calf enterprise — a natural complement for row-crop or dairy operations that don't currently run cattle, rather than a side business layered on top of what you already do.", time:"12–24 months to positive cash flow", capital:"$15K–$60K (herd, fencing, water access)", fit:{asset:65,trust:40,risk:45}, reg:2, seasonal:2, entExclude:["beef"], effort:4, liquidity:2 },
  { id:"growFeedCrops", label:"Grow your own livestock feed", category:"Financial capital", cluster:"On-Farm Production Diversification", growthTier:3, sizeFit:["small","mid","large"], desc:"Convert purchased-feed dependency into home-grown corn, hay, or forage acres — reduces feed cost volatility and captures margin currently going to your grain supplier. The natural complement for a beef or dairy operation that doesn't currently grow its own grain.", time:"One growing season to first harvest", capital:"$10K–$40K (equipment access, seed, inputs)", fit:{asset:55,trust:20,risk:70}, reg:1, seasonal:4, entRelevant:["beef","dairy"], entExclude:["grain"], effort:4, liquidity:3 },
  { id:"vegetableCrops", label:"Vegetable & produce production", category:"Human capital", cluster:"On-Farm Production Diversification", growthTier:3, sizeFit:["small","mid"], desc:"Diversify into vegetables or produce on a pilot scale — a market garden, hoop house, or small acreage. Whether this makes sense at all depends heavily on your specific region, soil type, and access to water and direct markets; confirm suitability with your local extension office before committing capital.", time:"6–12 months to first harvest", capital:"$5K–$30K (seed, irrigation, hoop house)", fit:{asset:30,trust:70,risk:35}, reg:3, seasonal:3, effort:5, liquidity:3 },
  { id:"perennialCrops", label:"Perennial crops (orchard, vineyard, agroforestry)", category:"Assets", cluster:"On-Farm Production Diversification", growthTier:3, sizeFit:["small","mid"], desc:"Establish an orchard, vineyard, or agroforestry planting on suitable acres. This is the longest-horizon production option in this library — most perennials take 3–7 years to reach meaningful harvest — and suitability is entirely dependent on your region's soil, climate, and water access. A soil test and extension consultation should come before any planting decision.", time:"3–7 years to meaningful harvest", capital:"$15K–$75K (establishment costs)", fit:{asset:45,trust:40,risk:55}, reg:2, seasonal:2, effort:4, liquidity:1 },
  { id:"manure", label:"Manure-to-value (compost/biogas)", category:"Assets", cluster:"Livestock-Specific Ventures", growthTier:3, sizeFit:["mid","large"], desc:"Convert livestock waste into compost, organic fertilizer, or biogas for sale rather than a disposal cost.", time:"6–18 months", capital:"$10K–$75K", fit:{asset:70,trust:30,risk:60}, reg:3, seasonal:2 , effort:4, liquidity:2, policyPrograms:[{name:"EQIP (Environmental Quality Incentives Program)",agency:"USDA NRCS",note:"Cost-share for waste management facilities, composting infrastructure, and nutrient management practices. Apply through your local NRCS field office — sign-up windows vary by state."}] },
  { id:"dtcBrand", label:"Direct-to-consumer food brand", category:"Human capital", cluster:"Value-Added Processing & Brands", growthTier:2, sizeFit:["small","mid"], desc:"Sell meat, eggs, or specialty grains directly via farm stores, CSAs, online, or farmers markets at retail pricing.", time:"6–12 months", capital:"$5K–$25K", fit:{asset:35,trust:85,risk:45}, reg:3, seasonal:3 , effort:4, liquidity:3, policyPrograms:[{name:"Local Agriculture Market Program (LAMP) / VAPG marketing funds",agency:"USDA Rural Development / AMS",note:"VAPG working capital can fund marketing and DTC channel development specifically, not just processing. Same 1:1 match and annual cycle as the processing-focused use of the program."}] },
  { id:"dataAdvisory", label:"Precision ag & data advisory", category:"Human capital", cluster:"Data & Knowledge Services", growthTier:1, sizeFit:["mid","large"], desc:"Offer precision ag consulting, AI-assisted agronomy, or risk decision-support to other operations.", time:"3–9 months", capital:"$1K–$10K", fit:{asset:15,trust:80,risk:55}, reg:1, seasonal:2 , effort:3, liquidity:4 },
  { id:"envServices", label:"Environmental & ecosystem services", category:"Financial capital", cluster:"Environmental & Energy", growthTier:1, sizeFit:["mid","large"], desc:"Water-quality credits, habitat leasing, or biodiversity programs layered on top of existing conservation practices.", time:"9–18 months", capital:"$0–$8K", fit:{asset:35,trust:35,risk:90}, reg:4, seasonal:1 , effort:2, liquidity:2, policyPrograms:[{name:"EQIP / CSP (Environmental Quality Incentives Program / Conservation Stewardship Program)",agency:"USDA NRCS",note:"Cost-share and stewardship payments for conservation practices that can also qualify land for private water-quality or habitat credit markets. Check with your local NRCS office for current sign-up windows."}] },
  { id:"inputRetail", label:"Input sales & agronomy retail", category:"Human capital", cluster:"Custom Field Services", growthTier:3, sizeFit:["small","mid"], desc:"Sell seed, fertilizer, or crop inputs to neighboring farms, leveraging existing supplier relationships and expertise.", time:"3–9 months", capital:"$5K–$15K", fit:{asset:25,trust:75,risk:50}, reg:2, seasonal:3 , effort:3, liquidity:3 },
  { id:"eventRental", label:"Facility rental & hosted events", category:"Human capital", cluster:"Space, Storage & Experience", growthTier:3, sizeFit:["small","mid"], desc:"Rent barns, fields, or converted buildings for weddings, retreats, or community markets during the off-season.", time:"6–12 months", capital:"$5K–$30K", fit:{asset:60,trust:75,risk:35}, reg:3, seasonal:3 , effort:4, liquidity:2 },
  // ── Financial capital deployment — opportunity-cost alternatives to physical/sweat-equity
  // ventures. These convert capital directly into future income or risk protection with
  // minimal ongoing physical effort. Not financial advice — for comparison only; a licensed
  // financial advisor or Farm Credit advisor should be consulted before committing capital.
  { id:"annuity", label:"Fixed or fixed-indexed annuity", category:"Financial capital", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["mid","large"], desc:"Convert a lump sum or systematic contributions into a guaranteed income stream. Fixed-indexed versions (FIAs) link partial growth to a market index like the S&P 500 while protecting principal from downturns — a way to pursue inflation-beating growth without direct exposure to commodity or stock market losses.", time:"Immediate or deferred by years", capital:"$25K–$250K+", fit:{asset:5,trust:10,risk:95}, reg:2, seasonal:1, effort:1, liquidity:1 },
  { id:"wholeLife", label:"Whole life insurance (cash value)", category:"Financial capital", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["small","mid","large"], desc:"Builds tax-advantaged cash value you can borrow against to self-finance equipment or land, while providing a death benefit for succession planning.", time:"Cash value meaningfully usable after 5–10 years", capital:"$5K–$50K+ annual premium", fit:{asset:5,trust:15,risk:85}, reg:2, seasonal:1, effort:1, liquidity:2 },
  { id:"selfInsurance", label:"Self-insurance reserve fund", category:"Financial capital", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["large"], desc:"Build and manage your own reserve fund to self-insure against certain risks instead of paying rising commercial premiums — typically a large-operation strategy.", time:"Meaningful protection after 3–5 years of funding", capital:"$25K–$500K+", fit:{asset:10,trust:10,risk:90}, reg:3, seasonal:1, effort:1, liquidity:1 },
  { id:"retirementPlan", label:"Qualified retirement plan (SEP-IRA / defined benefit)", category:"Financial capital", cluster:"Financial Capital Deployment", growthTier:2, sizeFit:["mid","large"], desc:"Shelter high-income years from current taxation by contributing to a SEP-IRA or defined benefit plan — converting today's profit into guaranteed future retirement income.", time:"Tax benefit immediate; income access at retirement age", capital:"Up to $70K+/year (SEP) or more for defined benefit", fit:{asset:0,trust:5,risk:90}, reg:2, seasonal:1, effort:1, liquidity:1 },
  { id:"sellerFinancing", label:"Seller financing / ag lending to peers", category:"Financial capital", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["large"], desc:"Use farm equity or cash reserves to finance land or equipment sales to other farmers, earning interest income secured by the asset sold.", time:"Income begins as soon as the note is originated", capital:"$50K–$500K+ (secured against the asset)", fit:{asset:20,trust:30,risk:70}, reg:3, seasonal:1, effort:2, liquidity:1 },
  { id:"agReit", label:"Farmland fund or ag REIT investment", category:"Financial capital", cluster:"Financial Capital Deployment", growthTier:2, sizeFit:["mid","large"], desc:"Passive exposure to farmland appreciation through an ag-focused REIT or farmland investment platform (AcreTrader-style) — without buying, financing, or managing more acreage yourself.", time:"Typically a multi-year hold; some platforms offer periodic liquidity windows", capital:"$10K–$100K+", fit:{asset:10,trust:15,risk:85}, reg:2, seasonal:1, effort:1, liquidity:2 },
];

// Cluster metadata for grouping/filtering in Stage 4
const CLUSTERS = [
  { id:"Environmental & Energy", note:"Tier 1 structural growth — ESG demand, energy transition, measurement tech" },
  { id:"Data & Knowledge Services", note:"Tier 1 structural growth — input volatility driving demand for outcome-based expertise" },
  { id:"Value-Added Processing & Brands", note:"Tier 2 growth — supply chain resilience and consumer transparency demand" },
  { id:"Livestock-Specific Ventures", note:"Enterprise-specific — highest fit for dairy and beef operations" },
  { id:"Space, Storage & Experience", note:"Tier 2–3 growth — monetizes existing space, seasonally flexible" },
  { id:"Trucking & Heavy Equipment", note:"Tier 2 growth — monetizes existing iron; works best off the fieldwork calendar" },
  { id:"Custom Field Services", note:"Tier 2–3 growth — monetizes machinery, labor, and supplier relationships" },
  { id:"Financial Capital Deployment", note:"Capital-only alternatives — minimal physical effort, compare against sweat-equity ventures on an opportunity-cost basis" },
  { id:"On-Farm Production Diversification", note:"Adding or changing what you actually grow or raise — a new enterprise, not an off-farm venture. Region and soil dependent; confirm suitability with your local extension office." },
];

// Maps a Stage-1 revenue tier answer to the small/mid/large bucket used for sizeFit matching
const sizeBucketFromTier = (tier) => {
  if (!tier) return null;
  if (tier.includes("< $500K")) return "small";
  if (tier.includes("$5M+")) return "large";
  return "mid";
};

const BARRIERS = {
  energy:["Existing loan covenants may restrict land encumbrances","Long-term lock-in on transition-likely acres (succession risk)","Developer terms can be complex — legal review essential"],
  specialty:["Market access is the #1 barrier — buyer relationship required before committing acres","Less safety-net coverage: crop insurance and traditional risk tools often don't extend to non-standard rotations or intercropping","Equipment contamination risk for non-GMO programs","Premium not guaranteed year-to-year"],
  custom:["Equipment failure risk increases when serving clients — insurance required","Labor availability during peak season may limit capacity — custom work often clashes with the timing of your own operation","Client relationship management is a new business skill; a late or missed job can damage reputation","Rates can be squeezed by local competition, especially in a soft farm economy"],
  carbon:["Program payment timelines are slow (6–18 months)","Additionality requirements may exclude existing practices","Verification and monitoring add administrative burden"],
  education:["Liability exposure from public visitors requires specific insurance","Significant time investment — not passive income","Local zoning may restrict agritourism"],
  processing:["Capital requirement is the highest of all paths ($20K–$150K+)","Regulatory compliance (food safety, labeling) is complex","Market development takes 12–24 months before meaningful revenue"],
  consulting:["Requires active time and travel — not scalable as a side activity","Credentialing and liability protection needed","Income is variable and relationship-dependent"],
  storage:["Grain quality and safety liability shifts to you","Insurance requirements increase with third-party storage","Coordination complexity during peak demand periods"],
  trucking:["Grain hauling is often the lowest-rate segment of trucking — heavy local competition from other farmers hauling cheap","DOT authority, permits, and insurance add real regulatory overhead","Truck and driver sit idle without a plan for non-farm backhaul loads in the off-season"],
  demolition:["Highest regulatory and liability exposure of any path — asbestos, environmental rules, OSHA, and disposal permits typically require a separate legal entity","Specialized licensing and strong insurance are usually required before the first job","Revenue is contract-based and can be lumpy compared to recurring farm income"],
  beefOnDairy:["Requires reliable sexed semen and sorting logistics to hit the target dairy/beef breeding percentage","Buyer relationships for crossbred calves need to be established before scaling the program","Genetic selection mistakes are costly and take a full breeding cycle to correct"],
  breeding:["Building a reputation for quality genetics takes years, not months","Market is relationship-driven — a small network of buyers means concentrated risk","Health and biosecurity protocols must be airtight to protect breeding stock value"],
  crpGrazing:["This opportunity depends on legislation that has not passed — the CRP Improvement Act could stall or change substantially before enactment","Even if passed, specific grazing rules, timing windows, and eligible contract types will be set by FSA implementation, not the bill itself","Existing CRP contracts have their own terms — check whether your enrolled acres are even eligible for a grazing modification","Fencing and water access infrastructure costs apply regardless of the legislative outcome"],
  addBeefHerd:["Starting a new species from scratch means a real learning curve — health protocols, breeding decisions, and marketing are all new skills","Cattle prices and input costs (feed, vet) are a different risk exposure than what you're used to managing in your current enterprise","Facilities and fencing built for one purpose (row crops or dairy) usually need real investment to work for a cow-calf herd","Building a herd takes time — genetics, breeding cycles, and herd health don't scale as fast as adding acres"],
  growFeedCrops:["Taking cropland or hay ground out of another use has a real opportunity cost, not just a new cost line","Weather and yield risk on your own feed crop replaces price risk on purchased feed — it doesn't disappear, it changes shape","Equipment for planting and harvesting a feed crop may not already exist on a livestock-only operation","One bad growing season can leave you short on feed and buying at the worst possible time anyway"],
  vegetableCrops:["Suitability is highly region- and soil-specific — what works two counties over may not work on your ground at all","Labor requirements per acre are dramatically higher than row crops or pasture — this is not a passive addition","Market access (direct sales, farmers markets, wholesale accounts) has to be built, often before the first harvest is ready","Food safety regulations apply once product leaves the farm gate, even at small scale"],
  perennialCrops:["The multi-year establishment period before any harvest is the single biggest barrier — cash flow is negative for years before it's positive","A misjudged site (soil drainage, frost pocket, water access) isn't correctable after planting the way it is with an annual crop","Specialized equipment and knowledge (pruning, pest management specific to the crop) usually isn't already on hand","Once established, perennials are a long-term land-use commitment — this isn't a diversification path you can easily reverse"],
  manure:["Nutrient management and environmental permitting vary significantly by state and county","Equipment for processing (composting turners, digesters) requires meaningful upfront capital","Odor and neighbor relations require proactive management, especially near agritourism or DTC ventures"],
  dtcBrand:["Building direct retail, CSA, or online channels takes real marketing time most farmers haven't budgeted for","Food safety and labeling rules apply once product leaves the farm gate","Fulfillment and cold-chain logistics are a new operational skill set"],
  dataAdvisory:["Requires demonstrated results before other farmers will pay for advice","Not scalable without hiring or building software — a true side-hustle ceiling exists","Liability for advice given needs to be addressed contractually"],
  envServices:["Verification and measurement technology is still maturing — program terms can change","Corporate ESG-funded programs can be slower-paying or less certain than public programs","Often stacks awkwardly with existing carbon program enrollment — check for double-counting restrictions"],
  inputRetail:["Requires working capital tied up in inventory","Margin is thin unless volume is meaningful — this rarely works as a true side venture below a certain scale","Supplier agreements may restrict territory or minimum purchase commitments"],
  eventRental:["Zoning and liability review required before hosting any public event","Facility conversion (bathrooms, parking, ADA access) often needs real capital investment","Marketing and booking management is an ongoing time commitment, not a one-time setup"],
  annuity:["Surrender charges typically apply if you need the capital back within 5–10 years","Fixed-indexed products cap upside in strong market years in exchange for principal protection","Not FDIC insured — backed by the issuing insurance company's claims-paying ability, not a bank guarantee","Using annuity proceeds as part of a farm sale or succession plan requires coordination with a tax advisor and estate attorney — the sequencing matters"],
  wholeLife:["Early years carry high internal costs — cash value builds slowly in years 1–5","Requires consistent premium funding to work as designed; lapsing early can mean losing most of what's paid in","Policy loans reduce the death benefit if not repaid before death"],
  selfInsurance:["Requires meaningful capital committed for years before the reserve is large enough to matter","A major loss early in the funding period could exceed the reserve built so far","Captive insurance structures carry real regulatory and tax filing complexity — this requires specialist advice, not a DIY approach"],
  retirementPlan:["Contribution limits cap how much income can be sheltered in a single year","Funds are generally locked up until retirement age without penalty","If you have employees, employer contribution rules may apply and add cost"],
  sellerFinancing:["You take on the buyer's credit risk directly — there's no bank underwriting standing between you and a default","Requires proper legal documentation to secure the note against the underlying asset","Illiquid — converting the note back to cash before maturity is difficult and usually requires a discount"],
  agReit:["Illiquid relative to public markets — most platforms lock capital for several years with limited exit windows","You don't control the underlying farm operation or specific parcel decisions","Platform and management fees reduce net returns — compare fee structures carefully before committing capital","Newer platforms have shorter track records than traditional REITs — vet the sponsor's history"],
};

const RD_ACTIONS = {
  energy:[{t:"r",title:"Loan covenant review before any developer contact",d:"Confirm no existing loan covenants restrict long-term land encumbrances. Request a covenant review from your Farm Credit advisor."},{t:"a",title:"Contact 2–3 solar/wind developers for a no-obligation site assessment",d:"Regional cooperatives are a good starting point. Site assessments are free and non-binding."},{t:"g",title:"Resolve succession plan before signing any 15–25 year lease",d:"Consult an ag attorney before developer terms are accepted."}],
  specialty:[{t:"r",title:"Records consolidation — prerequisite for all IP grain programs",d:"Identity-preserved programs require documentation of field management, input sourcing, and handling protocols."},{t:"a",title:"Identify a premium buyer or cooperative",d:"Your Farm Credit advisor may have buyer-network introductions. Land-grant extension offices maintain regional specialty grain buyer databases."},{t:"g",title:"Pilot 50–100 acres in Year 1",d:"Do not commit your full rotation until you have one season of buyer relationship and logistics experience."}],
  custom:[{t:"r",title:"Equipment utilization audit",d:"Log actual hours per machine over the past 3 years. Machines below 60% utilization are candidates for custom work."},{t:"a",title:"Liability insurance review",d:"Custom farming adds client exposure. Verify your current farm liability policy covers third-party operations."},{t:"g",title:"Start with 2–3 trusted neighbors before advertising",d:"Custom farming reputation is earned through performance."}],
  carbon:[{t:"r",title:"FSA records and farm number current",d:"All USDA conservation program applications require current FSA farm records."},{t:"a",title:"Schedule an EQIP or CSP meeting with your local USDA NRCS office",d:"Conservation programs have application windows and payment schedules."},{t:"g",title:"Evaluate voluntary carbon markets as a complement",d:"Programs like Truterra or Bayer Carbon pay on top of USDA programs for eligible practices."}],
  education:[{t:"r",title:"Zoning and liability review",d:"Check local zoning for agritourism activities. Add visitor liability coverage to your farm policy."},{t:"a",title:"Start with one low-risk event to test interest",d:"A farm tour for a local school or 4-H group is zero-cost and builds word of mouth."},{t:"g",title:"Partner with your county extension office",d:"Extension offices actively look for farm hosts for educational programming."}],
  processing:[{t:"r",title:"Identify a co-packing partner before investing in equipment",d:"Validate demand with no capital outlay before committing to your own facility."},{t:"a",title:"Research your state's cottage food and small processor exemptions",d:"Many states have simplified licensing for small-scale on-farm processing."},{t:"g",title:"Develop 2–3 products in Year 1, not a full product line",d:"Master one product with a reliable buyer before expanding."}],
  consulting:[{t:"r",title:"Professional liability insurance before billing for advice",d:"Errors-and-omissions insurance is essential. Annual cost: $1,000–$3,000."},{t:"a",title:"Define your consulting niche clearly",d:"Generalist farm advice is hard to sell. Lead with specific expertise."},{t:"g",title:"Start with informal mentoring relationships",d:"Two or three successful relationships in Year 1 are more valuable than advertising."}],
  storage:[{t:"r",title:"Confirm surplus storage capacity and condition",d:"Get bins inspected and capacity certified before offering to third parties."},{t:"a",title:"Contact 3–5 neighboring farms with known storage shortages",d:"Custom storage is a local relationship business."},{t:"g",title:"Set clear grain quality and liability terms in writing",d:"A simple one-page storage agreement protects both parties."}],
  trucking:[{t:"r",title:"Confirm DOT operating authority, insurance, and permits before hauling a single load",d:"This is not optional — operating without proper authority exposes both the farm and the driver to significant liability."},{t:"a",title:"Lock in one or two steady lanes or plant contracts first",d:"Grain hauling rates are thin; a steady contract lane is worth more than chasing spot loads."},{t:"g",title:"Build a non-farm backhaul plan for the off-season",d:"Diversify beyond grain into regional bulk freight so the truck and driver earn year-round."}],
  demolition:[{t:"r",title:"Confirm licensing, insurance, and entity structure before the first job",d:"Asbestos, OSHA, and disposal-permit exposure typically requires a separate LLC and specialized coverage — consult an attorney first."},{t:"a",title:"Start with agricultural teardown work (barns, bin sites) you already understand",d:"This is the most natural entry point before bidding on general construction demolition."},{t:"g",title:"Build a referral network with local contractors and site developers",d:"Demolition work is contract-based — a referral pipeline smooths out lumpy revenue."}],
  beefOnDairy:[{t:"r",title:"Confirm sexed semen and sorting logistics with your reproduction vet",d:"The breeding percentage (e.g., 40% dairy cows bred to beef) needs a clear protocol before you start."},{t:"a",title:"Establish a buyer relationship for crossbred calves before scaling",d:"Crossbred calf premiums depend on a reliable buyer — confirm demand before committing more of the herd."},{t:"g",title:"Track calf revenue as a % of total dairy income annually",d:"This is now a meaningful income stream on many dairies — treat it as its own line in your financial monitoring."}],
  breeding:[{t:"r",title:"Get an independent genetic and health assessment of your breeding stock",d:"Buyers pay for documented quality — this assessment is the foundation of your marketing."},{t:"a",title:"List with a breed association or regional sale to reach buyers",d:"Breeding stock sales are relationship- and reputation-driven; a breed association listing builds credibility fast."},{t:"g",title:"Build a multi-year genetic improvement plan",d:"Reputation compounds — a documented improvement trajectory justifies premium pricing over time."}],
  crpGrazing:[{t:"r",title:"Check the status of the CRP Improvement Act before planning around it",d:"This is pending legislation, not current law — confirm with your FSA office or Farm Credit advisor whether it has moved before committing capital to fencing or water infrastructure."},{t:"a",title:"Review your existing CRP contract terms for grazing eligibility",d:"Some contracts already allow limited emergency or managed grazing — you may have options before any new legislation passes."},{t:"g",title:"Budget fencing and water access as a standalone investment",d:"These improvements have value for rotational grazing generally, independent of whether this specific bill becomes law."}],
  addBeefHerd:[{t:"r",title:"Talk to a neighboring cattle producer or your extension office before buying the first animal",d:"Herd health protocols, breeding decisions, and marketing channels are all new skills — borrow experience before you need it."},{t:"a",title:"Assess what fencing, water, and handling facilities actually need to change",d:"Get a real cost estimate for the infrastructure gap before committing to herd size."},{t:"g",title:"Start smaller than your acreage could theoretically support",d:"A smaller herd in year one lets you learn the health, breeding, and marketing rhythm before scaling up."}],
  growFeedCrops:[{t:"r",title:"Run the numbers on opportunity cost, not just input cost",d:"Compare what the ground could earn in its current use against the feed-cost savings before converting acres."},{t:"a",title:"Confirm you have or can access the right planting and harvest equipment",d:"Custom hire or equipment sharing (see the Custom Field Services cluster) can bridge this gap in year one."},{t:"g",title:"Keep a feed-purchase backup plan for a bad growing season",d:"Don't let a first-year weather event force a panic purchase at the worst possible price — budget a cushion."}],
  vegetableCrops:[{t:"r",title:"Get a soil test and talk to your local extension office before committing acres",d:"Regional and soil-specific suitability is the single biggest factor in whether this works at all — confirm it first."},{t:"a",title:"Start with a pilot plot, not your full planned acreage",d:"Prove out labor requirements, yield, and market demand at small scale before expanding."},{t:"g",title:"Line up a market channel before the first harvest, not after",d:"Direct sales, a farmers market stall, or a wholesale account should be arranged in advance — produce doesn't wait."}],
  perennialCrops:[{t:"r",title:"Commission a proper site assessment — soil, drainage, frost risk, water access — before planting anything",d:"This decision is very hard to reverse once trees or vines are in the ground; get this step right."},{t:"a",title:"Talk to a specialist extension agent or established grower in your region for the specific crop",d:"Perennial crop knowledge is highly specific — generic row-crop experience won't transfer."},{t:"g",title:"Budget for zero income during the full establishment period",d:"Plan financing and cash flow assuming several years pass before any harvest revenue arrives."}],
  manure:[{t:"r",title:"Confirm nutrient management and environmental permitting requirements with your state ag department",d:"Rules vary significantly by state and county — confirm before any capital investment."},{t:"a",title:"Get a composting or digester equipment quote and payback estimate",d:"Compare processing capital cost against current disposal cost and potential sale price to nearby farms or landscapers."},{t:"g",title:"Establish neighbor and community communication before scaling",d:"Odor and traffic concerns are the most common source of local pushback — get ahead of it."}],
  dtcBrand:[{t:"r",title:"Confirm food safety and labeling requirements for your specific products",d:"Rules differ for meat, eggs, and processed foods — check with your state department of agriculture before selling direct."},{t:"a",title:"Start with one channel (farmers market or online) before adding more",d:"Fulfillment and cold-chain logistics are a new skill set — prove the model on one channel first."},{t:"g",title:"Build a customer list and repeat-purchase system",d:"DTC economics depend on repeat customers, not one-time sales — track and nurture your buyer list."}],
  dataAdvisory:[{t:"r",title:"Document your track record before pricing your first engagement",d:"Farmers pay for demonstrated results — build a simple case study from your own operation first."},{t:"a",title:"Start with an hourly or per-field consulting rate, not a subscription",d:"Prove the value before building recurring pricing or software."},{t:"g",title:"Decide whether this stays a side service or becomes a standalone business",d:"There's a real ceiling on solo consulting time — plan for that decision point in advance."}],
  envServices:[{t:"r",title:"Check for overlap with existing carbon program enrollment",d:"Many environmental service programs restrict double-counting the same practice for multiple payments — confirm before enrolling in a second program."},{t:"a",title:"Contact your state water quality trading program or a habitat bank broker",d:"These programs are newer and less standardized than carbon markets — a broker can help navigate current options."},{t:"g",title:"Track payment terms and verification cycles closely",d:"Measurement technology and program terms are still maturing — build slack into your cash flow assumptions."}],
  inputRetail:[{t:"r",title:"Confirm supplier territory and minimum purchase agreements",d:"Some input suppliers restrict resale territory — clarify this before committing capital to inventory."},{t:"a",title:"Start with one input category (seed or a specific input) you already buy at volume",d:"Prove the model on a narrow product line before expanding."},{t:"g",title:"Track margin per dollar of inventory carried",d:"This only works at meaningful volume — monitor whether the margin justifies the working capital tied up."}],
  eventRental:[{t:"r",title:"Complete a zoning and liability review before hosting any public event",d:"Confirm your farm is zoned for public events and add specific event liability coverage."},{t:"a",title:"Pilot with one low-risk event type before marketing broadly",d:"A single small gathering tests logistics, insurance, and demand before bigger capital commitments."},{t:"g",title:"Build a booking and marketing system for repeat off-season revenue",d:"This works best as a recurring off-season income stream, not a one-time event."}],
  annuity:[{t:"r",title:"Get quotes from 2–3 licensed insurance carriers before committing capital",d:"Rates, caps, and surrender schedules vary significantly between fixed and fixed-indexed products — this is not a one-carrier decision. Not financial advice; work with a licensed agent."},{t:"a",title:"Consider funneling surplus capital from a strong harvest year into a deferred annuity",d:"This builds a dedicated retirement fund that pays out later, keeping personal retirement savings separate from farm operating cash rather than reinvesting every surplus back into the operation."},{t:"a",title:"If a land, equipment, or whole-farm sale is on the horizon, ask about annuitizing part of the proceeds",d:"Spreading a large lump-sum sale into an immediate or deferred annuity can spread the tax burden over multiple years instead of taking it all in one, while locking in steady income for retirement."},{t:"g",title:"Use guaranteed annuity income as a buffer during down markets",d:"Reliable annuity income can let other investments — stocks, real estate, additional farmland — sit through a downturn without being forced to sell, giving them time to recover."},{t:"g",title:"Revisit annually as part of your whole-farm financial review",d:"Annuity income can be layered with other diversification income to smooth total household cash flow year to year."}],
  wholeLife:[{t:"r",title:"Work with a fee-based or independent agent to compare policy structures",d:"Whole life policy design varies widely across carriers — compare cash-value growth projections carefully. Not financial advice; a licensed professional should model this for your situation."},{t:"a",title:"Model the policy-loan strategy against a specific future equipment or land purchase",d:"Confirm the numbers actually work for your real use case before funding the policy."},{t:"g",title:"Coordinate the policy with your succession plan",d:"Whole life death benefit is commonly used to equalize inheritances among heirs or fund a buy-sell agreement."}],
  selfInsurance:[{t:"r",title:"Consult an insurance and tax specialist about captive or self-insurance structures",d:"This is one of the more complex tools on this list — specialized advice is essential before proceeding."},{t:"a",title:"Quantify your current premium spend and loss history first",d:"Compare what you're paying now in premiums against the cost of building an equivalent reserve to see if this is worth pursuing."},{t:"g",title:"Fund the reserve systematically over multiple years",d:"Self-insurance only works if the reserve is large enough to absorb a real loss — underfunding defeats the purpose."}],
  retirementPlan:[{t:"r",title:"Confirm current-year contribution limits with your tax advisor",d:"SEP-IRA and defined benefit limits change annually and depend on your business structure and income — this needs a current-year check, not a rule of thumb."},{t:"a",title:"Model the tax savings against this specific year's income",d:"The benefit is largest in high-income years — a tax advisor can confirm the real dollar impact for your situation."},{t:"g",title:"Set up systematic annual contributions rather than one-time decisions",d:"Consistent funding across multiple years builds meaningfully more retirement income than sporadic contributions."}],
  sellerFinancing:[{t:"r",title:"Have an attorney draft and properly secure the note",d:"Proper collateral documentation protects you if the buyer defaults — do not handshake this."},{t:"a",title:"Underwrite the buyer's ability to pay as carefully as a bank would",d:"You're taking on real credit risk — don't skip due diligence just because it's a neighbor or relative."},{t:"g",title:"Price the interest rate to reflect the real risk you're taking",d:"Compare against current ag lending rates — below-market seller financing is effectively a gift, not an investment."}],
  agReit:[{t:"r",title:"Compare 2–3 platforms on fee structure, minimum investment, and historical distributions",d:"Not financial advice — fee drag varies significantly between platforms and materially affects net return."},{t:"a",title:"Confirm the liquidity terms before committing capital",d:"Understand exactly when and how you could exit — some platforms only offer liquidity windows annually or at fund maturity."},{t:"g",title:"Treat this as a longer-horizon layer, not a near-term reserve",d:"This fits the third step of the sequencing framework — fund your equipment reserve and diversify income first."}],
};

const REV_RAMP = { energy:[0,0,0,0,0,0,0,0,0,0,0,0], specialty:[0,0,0,0,0,0,0,2,5,7,8,8], custom:[0,0,3,5,5,5,5,5,5,5,3,0], carbon:[0,0,0,0,0,0,2,3,3,3,3,3], education:[0,0,2,4,5,6,6,5,4,4,2,0], processing:[0,0,0,0,0,0,0,0,1,2,4,6], consulting:[0,2,3,4,4,4,4,4,4,4,3,2], storage:[0,0,0,0,0,0,0,8,8,8,4,4],
  trucking:[0,0,2,4,5,5,5,4,4,5,5,4], demolition:[0,0,0,1,3,5,6,6,5,3,2,1], beefOnDairy:[0,0,0,0,2,3,4,5,5,5,5,5], breeding:[0,0,0,0,0,1,2,3,3,4,4,4], manure:[0,0,0,1,2,3,3,4,4,4,4,4], dtcBrand:[0,1,2,3,4,4,5,5,5,5,5,5], dataAdvisory:[1,2,3,3,4,4,4,4,4,4,4,4], envServices:[0,0,0,0,0,1,2,3,3,3,3,3], inputRetail:[0,0,1,2,3,3,4,4,4,4,3,2], eventRental:[0,0,1,3,4,5,5,4,3,2,3,4], crpGrazing:[0,0,0,0,0,0,0,0,0,0,0,0],
  addBeefHerd:[0,0,0,0,0,0,0,0,0,1,2,3], growFeedCrops:[0,0,0,0,0,0,0,0,3,5,3,0], vegetableCrops:[0,0,0,0,0,2,4,5,4,2,0,0], perennialCrops:[0,0,0,0,0,0,0,0,0,0,0,0],
  annuity:[3,3,3,3,3,3,3,3,3,3,3,3], wholeLife:[0,0,0,0,0,0,1,1,1,1,1,1], selfInsurance:[0,0,0,0,1,1,1,2,2,2,2,2], retirementPlan:[2,2,2,2,2,2,2,2,2,2,2,2], sellerFinancing:[4,4,4,4,4,4,4,4,4,4,4,4], agReit:[0,0,0,2,2,2,2,2,2,2,2,2] };

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 1 — Enterprise dashboard
// ─────────────────────────────────────────────────────────────────────────────
function FA1({ fa, setFA }) {
  const active = fa.enterprises;
  const toggle = (k) => setFA(s => ({ ...s, enterprises: s.enterprises.includes(k) ? s.enterprises.filter(x=>x!==k) : [...s.enterprises, k] }));
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 1" title="Enterprise dashboard" sub="Select the enterprises you operate. Each one gets its own ratio scorecard, and this profile flows into the Revenue Diversification module." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Select your enterprises</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {Object.entries(ENT).map(([k,v]) => {
            const on = active.includes(k);
            return (
              <button key={k} onClick={()=>toggle(k)} style={{ padding:"16px 15px", borderRadius:9, border:on?`2px solid ${T.blue}`:`1px solid ${T.border}`, cursor:"pointer", background:on?T.blueL:"#fff", textAlign:"left", display:"flex", flexDirection:"column", gap:8, transition:"all .12s" }}>
                <EntIcon type={k} color={on?T.blue:T.fgS} size={26} />
                <div><div style={{ fontSize:16, fontWeight:700, color:on?T.blue:T.navy }}>{v.label}</div><div style={{ fontSize:11.5, color:T.fgS, marginTop:1 }}>{v.sub}</div></div>
              </button>
            );
          })}
        </div>
      </div>
      {active.map(ek => {
        const ec = ENT[ek]; const vals = fa.ratioVals[ek] || {};
        const setVal = (key,val) => setFA(s => ({ ...s, ratioVals:{ ...s.ratioVals, [ek]:{ ...(s.ratioVals[ek]||{}), [key]:val } } }));
        const scored = ec.ratios.filter(r => vals[r.key]!==undefined && vals[r.key]!=="");
        const vc = scored.filter(r=>classify(r,vals[r.key])==="vuln").length;
        const sc2 = scored.filter(r=>classify(r,vals[r.key])==="strong").length;
        let tL="Enter values", tC=T.fgS;
        if (scored.length>0){ if(vc>=2){tL=`Vulnerable — ${vc} flags`;tC=T.red;} else if(vc===1){tL="Watch needed";tC=T.amberT;} else if(sc2>=Math.ceil(scored.length/2)){tL=`Healthy — ${sc2}/${scored.length}`;tC=T.dgreen;} else {tL="Developing";tC=T.amberT;} }
        const cols = "minmax(0,1fr) 70px 70px 70px 120px";
        return (
          <div key={ek} style={cardStyle()}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${T.div}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><EntIcon type={ek} color={T.blue} size={24} /><div><div style={{ fontSize:17, fontWeight:700 }}>{ec.label}</div><div style={{ fontSize:11.5, color:T.fgS }}>{ec.sub}</div></div></div>
              <div style={{ fontSize:12.5, fontWeight:700, color:tC, letterSpacing:"0.02em" }}>{tL}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:cols, gap:6, background:T.bgAlt, borderRadius:6, padding:"8px 12px", marginBottom:2 }}>
              {["Ratio","Strong","Watch","Vuln.","Your value"].map((hh,i)=>(<div key={i} style={{ fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", textAlign:i===0?"left":"center" }}>{hh}</div>))}
            </div>
            {ec.ratios.map(r => {
              const st = classify(r, vals[r.key]); const dc = { strong:T.dgreen, watch:T.amber, vuln:T.red, blank:T.border }[st];
              return (
                <div key={r.key} style={{ display:"grid", gridTemplateColumns:cols, gap:6, alignItems:"center", padding:"9px 12px", borderBottom:`1px solid ${T.div}` }}>
                  <div><div style={{ fontSize:13 }}>{r.label}</div><div style={{ fontSize:10.5, color:T.fgS }}>{r.unit}</div></div>
                  <div style={{ fontSize:11, textAlign:"center", color:T.dgreen }}>{r.strong}</div>
                  <div style={{ fontSize:11, textAlign:"center", color:T.amberT }}>{r.watch}</div>
                  <div style={{ fontSize:11, textAlign:"center", color:T.red }}>{r.vuln}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:7, justifyContent:"flex-end" }}>
                    <input type="number" style={inputStyle({ width:82, fontSize:13, padding:"7px 9px" })} placeholder="Enter" value={vals[r.key]||""} onChange={e=>setVal(r.key,e.target.value)} />
                    <div style={{ width:9, height:9, borderRadius:"50%", background:dc, flexShrink:0 }} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 2 — Goal alignment
// ─────────────────────────────────────────────────────────────────────────────
function FA2({ fa, setFA }) {
  const g = fa.goals;
  const set = (f,v) => setFA(s => ({ ...s, goals:{ ...s.goals, [f]:v } }));
  const Qs = [
    { key:"trigger", title:"What triggered this review?", opts:[["lender","Lender / Farm Credit meeting coming up","Loan review, line renewal, or annual meeting"],["year","Difficult year — margins compressed","Input cost spike, price collapse, or tough crop year"],["growth","Planning growth or major investment","Evaluating land purchase or expansion"],["succession","Succession or transition planning","Getting the financial picture clear before a generational transfer"],["habit","Building a monitoring habit","Want to track financials consistently"]] },
    { key:"concern", title:"Which area concerns you most?", opts:[["cashflow","Cash flow — can I cover obligations?","Operating line pulling tighter"],["profitability","Profitability — am I making money per enterprise?","Unsure which enterprises cover full costs"],["debt","Debt load — is my balance sheet sustainable?","D/A ratio or equity position"],["efficiency","Efficiency — where are costs too high?","OER or cost per unit vs. peers"],["benchmarks","Benchmarking — how do I compare?","Want to see where I stand vs. similar operations"]] },
    { key:"outcome", title:"What does success look like?", opts:[["understand","Understand what my numbers mean","Translate ratios into plain language"],["improve","Action plan for my weakest ratios","2–3 highest-leverage actions"],["lenderready","Be lender-ready","Ratios and narrative ready for my Farm Credit advisor"],["monitor","Annual monitoring system","Repeatable process I can run every year"]] },
  ];
  const tracking = g.tracking || [];
  const toggleTrack = (k) => { if(k==="none"){set("tracking",["none"]);return;} const next=tracking.filter(x=>x!=="none"); set("tracking", next.includes(k)?next.filter(x=>x!==k):[...next,k]); };
  const Radio = ({ on }) => <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${on?T.blue:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{on && <div style={{ width:8, height:8, borderRadius:"50%", background:T.blue }} />}</div>;
  const optSty = (on) => ({ padding:"13px 15px", borderRadius:8, border:on?`2px solid ${T.blue}`:`1px solid ${T.border}`, cursor:"pointer", background:on?T.blueL:"#fff", marginBottom:8, transition:"all .12s" });
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 2" title="Goal alignment" sub="These answers shape your ratio deep dive, action plan, and what carries into the Revenue Diversification module." />
      {Qs.map(q => (
        <div key={q.key} style={cardStyle()}>
          <div style={cardLblStyle()}>{q.title}</div>
          {q.opts.map(([val,title,desc]) => (
            <div key={val} style={optSty(g[q.key]===val)} onClick={()=>set(q.key,val)}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Radio on={g[q.key]===val} />
                <div><div style={{ fontSize:13.5, fontWeight:600, color:g[q.key]===val?T.blue:T.navy, marginBottom:1 }}>{title}</div><div style={{ fontSize:11.5, color:T.fgS, lineHeight:1.4 }}>{desc}</div></div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Financial tracking (select all that apply)</div>
        {[["schedF","Schedule F — file taxes annually"],["accrual","Accrual accounting or farm management software"],["ent","Track costs separately by enterprise"],["balance","Up-to-date balance sheet"],["fms","Farm management software (Granular, Ag-Analytics)"],["none","None — tracking is informal"]].map(([val,label]) => {
          const on = tracking.includes(val);
          return (
            <div key={val} style={optSty(on)} onClick={()=>toggleTrack(val)}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${on?T.blue:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:on?T.blue:"transparent" }}>{on && <IconCheckSm />}</div>
                <div style={{ fontSize:13.5, fontWeight:600, color:on?T.blue:T.navy }}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 3 — Ratio deep dive
// ─────────────────────────────────────────────────────────────────────────────
// Shared ratio engine for Financial Analysis Stage 3. Extracted to a single function so
// the Farm Profile's "whole-farm financial health" summary can never drift out of sync
// with what Stage 3 itself computes and displays.
const faStR = (val,sv2,vv,lb) => val===null?"blank":(lb?(val<=sv2?"strong":val>=vv?"vuln":"watch"):(val>=sv2?"strong":val<=vv?"vuln":"watch"));
const faFP = n => n===null?"—":Math.round(n)+"%";
const faFD = n => n===null?"—":n.toFixed(2)+"x";
// FFSC (Farm Financial Standards Council) accrual adjustments — the specific
// balance-sheet-driven corrections that convert Schedule F cash-basis income into the
// accrual-adjusted figure lenders and FINBIN/ARMS benchmarks actually use. Cash-basis
// income is distorted by *timing* (when cash moved); accrual income reflects when
// income was earned and expenses incurred, regardless of cash timing. Every adjustment
// here is a balance-sheet *change* (ending minus beginning), which is why this needs two
// balance sheet snapshots, not one. This is fully optional and additive: if a farmer
// hasn't filled in any of these line items, every adjustment defaults to zero and the
// engine produces exactly the same cash-basis numbers as before.
const computeFARatios = (s3) => {
  const gv = id => parseFloat(s3?.[id])||0;
  const gross=gv("gross"), opex=gv("opex"), inputs=gv("inputs"), depr=gv("depr"), interest=gv("interest"), acres=gv("acres"), principal=gv("principal");
  const beginAssets=gv("beginAssets"), beginLiab=gv("beginLiab"), endAssets=gv("endAssets"), livingWithdrawals=gv("livingWithdrawals"), incomeTaxes=gv("incomeTaxes");
  const hasData = gross>0 && opex>0 && acres>0;

  // Revenue-side accrual adjustments: Δ(receivables + inventories) − Δ(deferred revenue)
  const dAR = gv("arEnd")-gv("arBegin");
  const dCropInv = gv("cropInvEnd")-gv("cropInvBegin");
  const dLivestockInv = gv("livestockInvEnd")-gv("livestockInvBegin");
  const dFeederInv = gv("feederInvEnd")-gv("feederInvBegin");
  const dDeferredRev = gv("deferredRevEnd")-gv("deferredRevBegin");
  const revAdj = dAR + dCropInv + dLivestockInv + dFeederInv - dDeferredRev;

  // Expense-side accrual adjustments: Δ(payables + accruals) − Δ(prepaid + growing crops)
  const dAP = gv("apEnd")-gv("apBegin");
  const dAccrInt = gv("accrIntEnd")-gv("accrIntBegin");
  const dOtherAccr = gv("otherAccrEnd")-gv("otherAccrBegin");
  const dPrepaid = gv("prepaidEnd")-gv("prepaidBegin");
  const dGrowingCrop = gv("growingCropEnd")-gv("growingCropBegin");
  const expAdj = dAP + dAccrInt + dOtherAccr - dPrepaid - dGrowingCrop;

  const hasAccrualData = [dAR,dCropInv,dLivestockInv,dFeederInv,dDeferredRev,dAP,dAccrInt,dOtherAccr,dPrepaid,dGrowingCrop].some(v=>v!==0);
  const accrualGross = hasData ? gross + revAdj : null;
  const accrualOpex = hasData ? opex + expAdj : null;

  // Net Farm Income from Operations (NFIFO) — the FFSC operating-trend figure, before
  // one-time capital gains/losses. Uses accrual-adjusted figures when available.
  const nfifo = hasData ? (hasAccrualData ? accrualGross-accrualOpex-depr-interest : gross-opex-depr-interest) : null;
  // Net Farm Income — FFSC's headline figure, adding back one-time gains/losses on culled
  // breeding livestock and capital asset sales. FFSC keeps this separate from NFIFO
  // specifically because mixing one-time capital events into the operating trend distorts
  // year-over-year benchmarking, which is exactly what a tool like this shouldn't do.
  const gainLossBreeding = gv("gainLossBreeding"), gainLossCapitalAssets = gv("gainLossCapitalAssets");
  const nfi = hasData ? nfifo + gainLossBreeding + gainLossCapitalAssets : null;

  const oer = hasData ? (hasAccrualData ? accrualOpex/accrualGross*100 : opex/gross*100) : null;
  const ipa = hasData&&inputs>0 ? inputs/acres : null, grpa = hasData ? (hasAccrualData?accrualGross:gross)/acres : null, nrpa = hasData ? ((hasAccrualData?accrualGross-accrualOpex:gross-opex))/acres : null;
  const totalDebt = interest+principal, dscr = hasData&&totalDebt>0 ? nfifo/totalDebt : null;
  const beginNetWorth = beginAssets - beginLiab;
  const avgAssets = (beginAssets>0 || endAssets>0) ? (beginAssets+endAssets)/2 : 0;
  const assetTurnover = hasData && avgAssets>0 ? (hasAccrualData?accrualGross:gross)/avgAssets*100 : null;
  const sgr = hasData && beginNetWorth>0 ? (nfifo-livingWithdrawals-incomeTaxes)/beginNetWorth*100 : null;
  // Liquidity, from current assets and current liabilities
  const currentAssets = gv("currentAssets"), currentLiab = gv("currentLiab");
  const hasLiq = currentAssets > 0 || currentLiab > 0;
  const currentRatio = hasLiq && currentLiab > 0 ? currentAssets/currentLiab : null;
  const workingCapital = hasLiq ? currentAssets - currentLiab : null;
  const wcToRevenue = hasLiq && gross > 0 ? (workingCapital/gross)*100 : null;

  // Solvency, from the end-of-year balance sheet
  const debtToAsset = endAssets > 0 ? (gv("endLiab")/endAssets)*100 : null;
  const equityRatio = debtToAsset === null ? null : 100 - debtToAsset;

  const ratios = [
    {key:"oer",cat:"efficiency",label:"Operating expense ratio",val:faFP(oer),status:faStR(oer,65,80,true),bench:"Strong < 65%"},
    {key:"ipa",cat:"efficiency",label:"Input cost per acre",val:fmt$(ipa)+"/ac",status:faStR(ipa,478,535,true),bench:"Strong < $478"},
    {key:"assetTurnover",cat:"efficiency",label:"Asset turnover ratio",val:faFP(assetTurnover),status:faStR(assetTurnover,40,20,false),bench:"Strong > 40%"},
    {key:"grpa",cat:"efficiency",label:"Gross revenue per acre",val:fmt$(grpa)+"/ac",status:faStR(grpa,951,800,false),bench:"Strong > $951"},
    {key:"currentRatio",cat:"liquidity",label:"Current ratio",val:currentRatio===null?"—":currentRatio.toFixed(2)+"x",status:faStR(currentRatio,2.0,1.0,false),bench:"Strong > 2.0x"},
    {key:"workingCapital",cat:"liquidity",label:"Working capital",val:fmt$(workingCapital),status:workingCapital===null?"blank":workingCapital>0?"strong":"vuln",bench:"Positive covers a short year"},
    {key:"wcToRevenue",cat:"liquidity",label:"Working capital to revenue",val:faFP(wcToRevenue),status:faStR(wcToRevenue,25,10,false),bench:"Strong > 25%"},
    {key:"debtToAsset",cat:"solvency",label:"Debt-to-asset ratio",val:faFP(debtToAsset),status:faStR(debtToAsset,30,60,true),bench:"Strong < 30%"},
    {key:"equityRatio",cat:"solvency",label:"Equity ratio",val:faFP(equityRatio),status:faStR(equityRatio,70,40,false),bench:"Strong > 70%"},
    {key:"dscr",cat:"solvency",label:"Debt service coverage",val:faFD(dscr),status:faStR(dscr,1.25,1.0,false),bench:"Strong > 1.25x"},
    ...(hasAccrualData ? [{key:"nfifo",cat:"growth",label:"Net farm income from operations",val:fmt$(nfifo),status:nfifo===null?"blank":nfifo>=0?"strong":"vuln",bench:"Accrual-adjusted operating trend"}] : []),
    {key:"nfi",cat:"growth",label:hasAccrualData?"Net farm income (incl. capital gains/losses)":"Net farm income",val:fmt$(nfi),status:nfi===null?"blank":nfi>=0?"strong":"vuln",bench:"Positive covers full cost"},
    {key:"sgr",cat:"growth",label:"Sustainable growth rate",val:faFP(sgr),status:faStR(sgr,10,0,false),bench:"Strong > 10%"},
    {key:"nrpa",cat:"growth",label:"Net return per acre",val:fmt$(nrpa)+"/ac",status:faStR(nrpa,150,50,false),bench:"Strong > $150"},
  ];

  // Roll the ratios up into the four financial health categories. A category takes
  // the weakest status among its scored ratios, so one vulnerable ratio is never
  // hidden by two strong ones sitting beside it.
  const rank = { vuln:0, watch:1, strong:2 };
  const CATS = [
    { id:"liquidity", label:"Liquidity", desc:"Can the operation cover the next twelve months without forced sales" },
    { id:"solvency", label:"Solvency", desc:"How much of the balance sheet the operation actually owns" },
    { id:"growth", label:"Sustainable growth", desc:"Whether the operation earns enough to grow without new debt" },
    { id:"efficiency", label:"Efficiency", desc:"How much output the operation gets from what it puts in" },
  ];
  const categories = CATS.map(c => {
    const rs = ratios.filter(r => r.cat === c.id);
    const scored = rs.filter(r => r.status !== "blank");
    let status = "blank";
    if (scored.length) status = scored.reduce((w,r) => rank[r.status] < rank[w] ? r.status : w, "strong");
    return { ...c, ratios: rs, status, scored: scored.length, total: rs.length };
  });

  return { hasData, hasAccrualData, oer, ipa, grpa, nrpa, nfi, nfifo, dscr, assetTurnover, sgr,
           currentRatio, workingCapital, wcToRevenue, debtToAsset, equityRatio,
           accrualGross, accrualOpex, ratios, categories };
};

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 3 — Document upload & AI-assisted extraction (placeholder / demo)
// ─────────────────────────────────────────────────────────────────────────────
// This UI is fully built and clickable end-to-end, but the actual scan step below
// returns realistic MOCK data rather than calling a real extraction service. Real
// document scanning requires a server-side component: an uploaded file can never be
// sent directly to an AI model from client-side code without exposing an API key in
// the browser, which is a real security hole, not a style choice. Wiring this up for
// real means adding a Vercel serverless function that holds the API key server-side,
// calls the Anthropic API with the uploaded document, and returns structured fields —
// at which point the only change needed here is swapping runMockScan() for a real
// fetch() call. Everything else — the upload slots, the review-before-applying step,
// the field mapping — is already the real, final UI.
const MOCK_EXTRACTED_DATA = {
  gross:{val:"920000",src:"Schedule F, Line 11"}, opex:{val:"690000",src:"Schedule F, Line 33"},
  inputs:{val:"310000",src:"Schedule F, Lines 7–10"}, rent:{val:"145000",src:"Schedule F, Line 24"},
  depr:{val:"78000",src:"Schedule F, Line 16"}, interest:{val:"52000",src:"Schedule F, Line 21"},
  acres:{val:"1450",src:"Farm records"}, principal:{val:"61000",src:"Loan statement"},
  beginAssets:{val:"2850000",src:"Balance sheet — Jan 1"}, beginLiab:{val:"1240000",src:"Balance sheet — Jan 1"},
  endAssets:{val:"2960000",src:"Balance sheet — Dec 31"}, endLiab:{val:"1195000",src:"Balance sheet — Dec 31"},
  livingWithdrawals:{val:"68000",src:"Estimated from records"}, incomeTaxes:{val:"34000",src:"Tax return"},
  arBegin:{val:"18000",src:"Balance sheet — Jan 1"}, arEnd:{val:"27000",src:"Balance sheet — Dec 31"},
  cropInvBegin:{val:"145000",src:"Balance sheet — Jan 1"}, cropInvEnd:{val:"189000",src:"Balance sheet — Dec 31"},
  livestockInvBegin:{val:"0",src:"Balance sheet — Jan 1"}, livestockInvEnd:{val:"0",src:"Balance sheet — Dec 31"},
  feederInvBegin:{val:"0",src:"Balance sheet — Jan 1"}, feederInvEnd:{val:"0",src:"Balance sheet — Dec 31"},
  deferredRevBegin:{val:"12000",src:"Balance sheet — Jan 1"}, deferredRevEnd:{val:"8000",src:"Balance sheet — Dec 31"},
  apBegin:{val:"34000",src:"Balance sheet — Jan 1"}, apEnd:{val:"41000",src:"Balance sheet — Dec 31"},
  accrIntBegin:{val:"6200",src:"Balance sheet — Jan 1"}, accrIntEnd:{val:"7100",src:"Balance sheet — Dec 31"},
  otherAccrBegin:{val:"9000",src:"Balance sheet — Jan 1"}, otherAccrEnd:{val:"11500",src:"Balance sheet — Dec 31"},
  prepaidBegin:{val:"22000",src:"Balance sheet — Jan 1"}, prepaidEnd:{val:"28000",src:"Balance sheet — Dec 31"},
  growingCropBegin:{val:"0",src:"Balance sheet — Jan 1"}, growingCropEnd:{val:"0",src:"Balance sheet — Dec 31"},
  gainLossBreeding:{val:"0",src:"Schedule F / Form 4797"}, gainLossCapitalAssets:{val:"15000",src:"Form 4797"},
};
const EXTRACT_FIELD_GROUPS = [
  { label:"Financial data", keys:["gross","opex","inputs","rent","depr","interest","acres","principal"] },
  { label:"Balance sheet snapshot", keys:["beginAssets","beginLiab","endAssets","endLiab","livingWithdrawals","incomeTaxes"] },
  { label:"Accrual adjustments", keys:["arBegin","arEnd","cropInvBegin","cropInvEnd","livestockInvBegin","livestockInvEnd","feederInvBegin","feederInvEnd","deferredRevBegin","deferredRevEnd","apBegin","apEnd","accrIntBegin","accrIntEnd","otherAccrBegin","otherAccrEnd","prepaidBegin","prepaidEnd","growingCropBegin","growingCropEnd"] },
  { label:"One-time capital events", keys:["gainLossBreeding","gainLossCapitalAssets"] },
];

function DocumentScanUpload({ fa, setFA }) {
  const [files, setFiles] = useState({ schedF:null, beginBS:null, endBS:null });
  const [scanning, setScanning] = useState(false);
  const [extracted, setExtracted] = useState(null); // null | { fieldKey: { val, src } }
  const [edited, setEdited] = useState({});

  const setFile = (slot, f) => setFiles(s => ({ ...s, [slot]: f ? f.name : null }));
  const canScan = !!files.schedF;

  const runMockScan = () => {
    setScanning(true);
    setTimeout(() => { setExtracted(MOCK_EXTRACTED_DATA); setEdited({}); setScanning(false); }, 1400);
  };
  const editedVal = (key) => edited[key] !== undefined ? edited[key] : extracted?.[key]?.val ?? "";
  const applyExtracted = () => {
    if (!extracted) return;
    const patch = {};
    Object.keys(extracted).forEach(key => { patch[key] = edited[key] !== undefined ? edited[key] : extracted[key].val; });
    setFA(s => ({ ...s, s3vals: { ...s.s3vals, ...patch } }));
    setExtracted(null); setFiles({ schedF:null, beginBS:null, endBS:null });
  };

  const uploadSlot = (slot, label, sub) => (
    <label style={{ display:"block", border:`1.5px dashed ${files[slot]?T.dgreen:T.border}`, borderRadius:8, padding:"14px 16px", cursor:"pointer", background:files[slot]?T.greenL:T.bgAlt, textAlign:"center" }}>
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display:"none" }} onChange={e=>setFile(slot, e.target.files[0])} />
      <div style={{ fontSize:12.5, fontWeight:700, color:files[slot]?"#2F6E28":T.navy, marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:11, color:files[slot]?"#2F6E28":T.fgS }}>{files[slot] || sub}</div>
    </label>
  );

  return (
    <div style={cardStyle({ borderTop:`4px solid ${T.blue}` })}>
      <div style={cardLblStyle()}><Apex color={T.blue} />Upload your documents (AI-assisted, demo)</div>
      <Flag type="warn">Demo mode — this scan step returns realistic placeholder values, not a real reading of your files. Live document scanning requires a backend extraction service (a server-side function holding an API key) that hasn't been connected yet. Everything else here — the upload flow, the review-before-applying step, the field mapping — is the real, final design.</Flag>
      {!extracted ? (
        <>
          <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>Upload your Schedule F and, if you have them, your beginning- and end-of-year balance sheets. This can fill in every field below in one step instead of typing each one by hand.</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
            {uploadSlot("schedF","Schedule F","PDF or photo, required")}
            {uploadSlot("beginBS","Balance sheet — Jan 1","PDF or photo, optional")}
            {uploadSlot("endBS","Balance sheet — Dec 31","PDF or photo, optional")}
          </div>
          <button onClick={runMockScan} disabled={!canScan||scanning} style={{ ...btnStyle("primary"), opacity:(!canScan||scanning)?0.5:1, pointerEvents:(!canScan||scanning)?"none":"auto" }}>{scanning?"Scanning…":"Scan documents →"}</button>
        </>
      ) : (
        <>
          <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>Review every extracted value before applying — edit anything that looks off. Nothing is written to your Financial Analysis data until you click Apply.</div>
          {EXTRACT_FIELD_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>{group.label}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
                {group.keys.map(key => extracted[key] && (
                  <div key={key} style={{ display:"flex", alignItems:"center", gap:8, background:T.bgAlt, borderRadius:6, padding:"8px 10px" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, color:T.fgS }}>{extracted[key].src}</div>
                      <input type="number" style={inputStyle({ fontSize:13, padding:"5px 7px", marginTop:2 })} value={editedVal(key)} onChange={e=>setEdited(s=>({...s,[key]:e.target.value}))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>{setExtracted(null);setFiles({schedF:null,beginBS:null,endBS:null});}} style={btnStyle("outline")}>Start over</button>
            <button onClick={applyExtracted} style={btnStyle("primary")}>Apply these numbers →</button>
          </div>
        </>
      )}
    </div>
  );
}

function FA3({ fa, setFA }) {
  const s3 = fa.s3vals;
  const v = id => s3[id]||""; const sv = (id,val) => setFA(s=>({...s,s3vals:{...s.s3vals,[id]:val}}));
  const { hasData, hasAccrualData, nfi, nfifo, oer, dscr, assetTurnover, sgr, ratios: RATIOS } = computeFARatios(s3);
  const [showAccrual, setShowAccrual] = useState(hasAccrualData);
  const INPUTS = [{id:"gross",label:"Gross farm income",sub:"Total farm revenue for the year",pre:"$"},{id:"opex",label:"Total operating expenses",sub:"Cash operating costs, before depreciation and interest",pre:"$"},{id:"inputs",label:"Input costs (seed, fert, chem, fuel)",sub:"Estimate if not tracked separately",pre:"$"},{id:"rent",label:"Land rent paid",sub:"Cash rent paid to landlords",pre:"$"},{id:"depr",label:"Depreciation",sub:"From your tax return or accountant",pre:"$"},{id:"interest",label:"Interest paid",sub:"From loan statements",pre:"$"},{id:"acres",label:"Total acres farmed",sub:"Owned + rented",suf:"ac"},{id:"principal",label:"Annual principal payments",sub:"From loan statements",pre:"$"}];
  const BS_INPUTS = [{id:"currentAssets",label:"Current farm assets",sub:"Cash, receivables, inventory, prepaid, anything convertible within 12 months",pre:"$"},{id:"currentLiab",label:"Current farm liabilities",sub:"Operating line, payables, accrued interest, principal due within 12 months",pre:"$"},{id:"beginAssets",label:"Beginning-of-year total farm assets",sub:"From your lender's balance sheet or net worth statement",pre:"$"},{id:"beginLiab",label:"Beginning-of-year total farm liabilities",sub:"Loan balances as of January 1",pre:"$"},{id:"endAssets",label:"End-of-year total farm assets",sub:"From your lender's balance sheet or net worth statement",pre:"$"},{id:"endLiab",label:"End-of-year total farm liabilities",sub:"Loan balances as of December 31",pre:"$"},{id:"livingWithdrawals",label:"Family living withdrawals",sub:"Cash taken out for household expenses",pre:"$"},{id:"incomeTaxes",label:"Income taxes paid",sub:"From your tax return or accountant",pre:"$"}];
  const ACCRUAL_ITEMS = [
    {key:"ar",label:"Accounts/notes receivable",hint:"Sales made but not yet paid",sign:"+"},
    {key:"cropInv",label:"Raised crop inventory held for sale",hint:"Grain in the bin is earned value, even unsold",sign:"+"},
    {key:"livestockInv",label:"Raised market livestock inventory",hint:"Value of market animals on hand at year-end",sign:"+"},
    {key:"feederInv",label:"Purchased feeder livestock / feed for resale",hint:"Purchased-for-resale items follow the same rule",sign:"+"},
    {key:"deferredRev",label:"Deferred / unearned revenue",hint:"Cash received for next year's product",sign:"−"},
    {key:"ap",label:"Accounts payable",hint:"Bills incurred but unpaid",sign:"+"},
    {key:"accrInt",label:"Accrued interest payable",hint:"Interest owed but not yet paid",sign:"+"},
    {key:"otherAccr",label:"Other accrued expenses",hint:"Wages, property taxes owed but unpaid",sign:"+"},
    {key:"prepaid",label:"Prepaid expenses",hint:"Seed, chemicals, rent paid ahead",sign:"−"},
    {key:"growingCrop",label:"Investment in growing crops",hint:"Input costs on an unharvested crop, capitalized until harvest",sign:"−"},
  ];
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 3" title="Ratio deep dive" sub="Enter your financial data — from your MFP Financial Data Worksheet, your own records, or your best estimate. Ratios calculate automatically as you type." />
      <DocumentScanUpload fa={fa} setFA={setFA} />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Financial data</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {INPUTS.map(f => (
            <div key={f.id}>
              <label style={labelStyle}>{f.label}</label>
              <span style={{ fontSize:11, color:T.fgS, marginBottom:6, display:"block", fontStyle:"italic" }}>{f.sub}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {f.pre && <span style={{ fontSize:13, color:T.fgS }}>{f.pre}</span>}
                <input type="number" style={inputStyle()} placeholder="Enter value" value={v(f.id)} onChange={e=>sv(f.id,e.target.value)} />
                {f.suf && <span style={{ fontSize:13, color:T.fgS }}>{f.suf}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Balance sheet snapshot</div>
        <div style={{ fontSize:12, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>Not on Schedule F — these come from a beginning- and end-of-year net worth statement, typically already on file with your lender. They unlock two additional ratios: sustainable growth rate and asset turnover.</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {BS_INPUTS.map(f => (
            <div key={f.id}>
              <label style={labelStyle}>{f.label}</label>
              <span style={{ fontSize:11, color:T.fgS, marginBottom:6, display:"block", fontStyle:"italic" }}>{f.sub}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                {f.pre && <span style={{ fontSize:13, color:T.fgS }}>{f.pre}</span>}
                <input type="number" style={inputStyle()} placeholder="Enter value" value={v(f.id)} onChange={e=>sv(f.id,e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={cardStyle()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:showAccrual?14:0 }}>
          <div style={cardLblStyle({ marginBottom:0 })}>Accrual adjustments (advanced, optional)</div>
          <button onClick={()=>setShowAccrual(s=>!s)} style={{ ...btnStyle("outline"), fontSize:11.5, padding:"6px 14px" }}>{showAccrual?"Hide":"Show"}</button>
        </div>
        {!showAccrual && <div style={{ fontSize:12, color:T.fgM, lineHeight:1.5 }}>Cash-basis income is distorted by timing — when cash moved, not when it was actually earned or incurred. This optional section converts your numbers to the accrual-adjusted figure lenders and FINBIN/ARMS benchmarks actually use. Skip it entirely and everything above still works exactly as before.</div>}
        {showAccrual && (
          <>
            <div style={{ fontSize:12, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>Every adjustment here is a <b>change</b> — ending balance minus beginning balance — from two balance sheet snapshots, not from the income statement itself. Leave any line blank if you don't track it; it's treated as no change. Many informal balance sheets lump these into one number — a rough split is far better than skipping this section entirely.</div>
            <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:8, background:T.bgAlt, borderRadius:6, padding:"8px 12px", marginBottom:4 }}>
              {["Line item","Beginning","Ending"].map((hh,i)=>(<div key={i} style={{ fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em" }}>{hh}</div>))}
            </div>
            {ACCRUAL_ITEMS.map(it => (
              <div key={it.key} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:8, padding:"10px 12px", borderBottom:`1px solid ${T.div}`, alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:600 }}><span style={{ color:it.sign==="+"?T.dgreen:T.red, fontWeight:800 }}>{it.sign}</span> {it.label}</div>
                  <div style={{ fontSize:10.5, color:T.fgS, fontStyle:"italic" }}>{it.hint}</div>
                </div>
                <input type="number" style={inputStyle({ fontSize:13 })} placeholder="$" value={v(it.key+"Begin")} onChange={e=>sv(it.key+"Begin",e.target.value)} />
                <input type="number" style={inputStyle({ fontSize:13 })} placeholder="$" value={v(it.key+"End")} onChange={e=>sv(it.key+"End",e.target.value)} />
              </div>
            ))}
            <div style={{ marginTop:14, marginBottom:4, fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em" }}>One-time capital events (not part of the operating trend)</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:8 }}>
              <div><label style={labelStyle}>Gain/loss on sale of culled breeding livestock</label><input type="number" style={inputStyle()} placeholder="$" value={v("gainLossBreeding")} onChange={e=>sv("gainLossBreeding",e.target.value)} /></div>
              <div><label style={labelStyle}>Gain/loss on sale of capital assets</label><input type="number" style={inputStyle()} placeholder="$" value={v("gainLossCapitalAssets")} onChange={e=>sv("gainLossCapitalAssets",e.target.value)} /></div>
            </div>
            <div style={{ marginTop:12 }}><Flag type="info">FFSC keeps these one-time capital events separate from Net Farm Income from Operations specifically so they don't distort year-over-year benchmarking — a land sale shouldn't make this year look like a great operating year.</Flag></div>
          </>
        )}
      </div>
      {hasData && (
        <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
          <div style={cardLblStyle()}>Ratio scorecard{hasAccrualData && <span style={{ ...pillStyle("info"), marginLeft:10, fontSize:10 }}>Accrual-adjusted</span>}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 160px", gap:8, background:T.bgAlt, borderRadius:6, padding:"8px 12px", marginBottom:4 }}>
            {["Ratio","Your value","Benchmark"].map((hh,i)=>(<div key={i} style={{ fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", textAlign:i===1?"right":"left" }}>{hh}</div>))}
          </div>
          {RATIOS.map((r,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 100px 160px", gap:8, padding:"10px 12px", borderBottom:`1px solid ${T.div}`, alignItems:"center" }}>
              <div style={{ fontSize:13 }}>{r.label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:scColor(r.status), textAlign:"right" }}>{r.val}</div>
              <div style={{ fontSize:11.5, color:T.fgS }}>{r.bench}</div>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            {nfi!==null && nfi<0 && <Flag type="danger">Net farm income is negative — depreciation and interest are eroding equity.</Flag>}
            {oer!==null && oer>80 && <Flag type="danger">OER above 80% — operating costs consume more than 80 cents of every revenue dollar.</Flag>}
            {dscr!==null && dscr<1 && <Flag type="danger">DSCR below 1.0x — net income does not cover debt service. Contact your Farm Credit advisor.</Flag>}
            {sgr!==null && sgr<0 && <Flag type="danger">Sustainable growth rate is negative — the farm is drawing down equity to cover living expenses and taxes, not building it.</Flag>}
            {assetTurnover!==null && assetTurnover<20 && <Flag type="warn">Asset turnover below 20% — a large asset base relative to the revenue it generates. Common for land-heavy operations, but worth understanding why.</Flag>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 4 — Peer benchmarking
// ─────────────────────────────────────────────────────────────────────────────
function FA4({ fa, setFA }) {
  const b = fa.s4bench;
  const v = id => b[id]||""; const sv = (id,val) => setFA(s=>({...s,s4bench:{...s.s4bench,[id]:val}})); const gv = id => parseFloat(b[id]);
  const B = [{key:"oer",label:"OER",unit:"%",avg:72,top:65,bot:85,lb:true},{key:"ipa",label:"Input cost/ac",unit:"$/ac",avg:507,top:478,bot:580,lb:true},{key:"grpa",label:"Gross revenue/ac",unit:"$/ac",avg:951,top:1017,bot:800,lb:false},{key:"nrpa",label:"Net return/ac",unit:"$/ac",avg:95,top:210,bot:20,lb:false},{key:"dscr",label:"DSCR",unit:"x",avg:1.10,top:1.40,bot:0.85,lb:false}];
  const clf = (bb,val) => { if(isNaN(val)) return "blank"; return bb.lb ? (val<=bb.top?"strong":val<=bb.avg?"watch":"vuln") : (val>=bb.top?"strong":val>=bb.avg?"watch":"vuln"); };
  const acres = gv("acres");
  const gaps = (!isNaN(acres)&&acres>0) ? B.filter(bb=>{const val=gv(bb.key);if(isNaN(val))return false;return bb.lb?val>bb.top:val<bb.top;}).map(bb=>{const val=gv(bb.key);return{label:bb.label,toTop:bb.lb?Math.round((val-bb.top)*acres):Math.round((bb.top-val)*acres)};}).filter(g=>g.toTop>0) : [];
  const pillLabel = { strong:"Top quartile", watch:"Peer avg", vuln:"Below avg", blank:"Enter value" };
  const unitSuf = bb => bb.unit==="%"?"%":bb.unit==="x"?"x":"";
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 4" title="Peer benchmarking" sub="Compeer Financial and IFBA 2023–24 data. Mid-size row crop, $500K–$5M revenue, Midwest region." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Enter your values</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {B.map(bb => (<div key={bb.key}><label style={labelStyle}>{bb.label} ({bb.unit})</label><input type="number" style={inputStyle()} placeholder={`e.g. ${bb.avg}`} value={v(bb.key)} onChange={e=>sv(bb.key,e.target.value)} /></div>))}
          <div><label style={labelStyle}>Acres farmed</label><input type="number" style={inputStyle()} placeholder="e.g. 1200" value={v("acres")} onChange={e=>sv("acres",e.target.value)} /></div>
        </div>
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Your position vs. peers</div>
        {B.map(bb => {
          const val = gv(bb.key); const hasVal = !isNaN(val); const status = clf(bb,val);
          const pct = hasVal ? (bb.lb?Math.min(100,Math.max(0,((bb.bot-val)/(bb.bot-bb.top))*100)):Math.min(100,Math.max(0,((val-bb.bot)/(bb.top-bb.bot))*100))) : 0;
          const barC = { strong:T.dgreen, watch:T.amber, vuln:T.red, blank:T.border }[status];
          return (
            <div key={bb.key} style={{ display:"grid", gridTemplateColumns:"150px 1fr 116px", gap:12, alignItems:"center", padding:"13px 0", borderBottom:`1px solid ${T.div}` }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{bb.label}</div>
              <div>
                <div style={{ position:"relative", height:14, background:T.div, borderRadius:7, overflow:"hidden" }}><div style={{ position:"absolute", top:0, left:0, width:`${pct}%`, height:"100%", background:barC, borderRadius:7, transition:"width .4s" }} /></div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:T.fgS }}><span>Bot {bb.bot}{unitSuf(bb)}</span><span>Avg {bb.avg}{unitSuf(bb)}</span><span>Top {bb.top}{unitSuf(bb)}</span></div>
              </div>
              <div style={{ textAlign:"right" }}>{hasVal && <div style={{ fontSize:15, fontWeight:800, color:barC, marginBottom:3 }}>{val}{unitSuf(bb)}</div>}<span style={pillStyle(status)}>{pillLabel[status]}</span></div>
            </div>
          );
        })}
      </div>
      {gaps.length>0 && (
        <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
          <div style={cardLblStyle()}>Gap analysis — annual value of reaching top quartile</div>
          {gaps.map((g,i) => (<div key={i} style={{ padding:"10px 0", borderBottom:i<gaps.length-1?`1px solid ${T.div}`:"none" }}><div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{g.label}</div><div style={{ fontSize:12.5, color:T.dgreen, fontWeight:600 }}>Recover {fmt$(g.toTop)} annually vs. top quartile</div></div>))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FARM RISK — quiz categories & question bank
// ─────────────────────────────────────────────────────────────────────────────
// Adapted from the Nationwide Farm Risk Ready℠ framework (risk identification,
// managing/preventing risk, contingency planning, communicating the plan).
const RISK_CATS = [
  { id:"identify", label:"Identifying risk", color:T.blue, colorL:T.blueL, colorD:"#0A6E8C", questions:3, maxScore:12 },
  { id:"managing", label:"Managing & preventing risk", color:T.dgreen, colorL:T.greenL, colorD:"#2F6E28", questions:3, maxScore:12 },
  { id:"contingency", label:"Contingency planning", color:T.amber, colorL:T.amberL, colorD:T.amberT, questions:4, maxScore:16 },
  { id:"communicating", label:"Communicating the plan", color:"#7C3AED", colorL:"#F3E8FF", colorD:"#5B21B6", questions:2, maxScore:8 },
];

const RISK_QUESTIONS = {
  identify: [
    { id:"id1", text:"To what extent have you identified the top risks or potential disruptions to your farm?", opts:["Not at all — I haven't thought through what could go wrong","To a small extent — I'm aware of some risks but haven't documented them","To a moderate extent — I have a list of key risks but no formal plan","To a great extent — I have a documented risk register and review it regularly"], scores:[1,2,3,4], nationwide:true },
    { id:"id2", text:"To what extent are you aware of the financial impact these risks or disruptions could have on your farm?", opts:["Not at all — I haven't estimated financial exposure","To a small extent — I have a rough sense of one or two risks","To a moderate extent — I've estimated losses for most major risk events","To a great extent — I have quantified dollar impact for each identified risk"], scores:[1,2,3,4], nationwide:true },
    { id:"id3", text:"To what extent do you know how long you can stay operational if a key revenue source is disrupted?", opts:["Not at all — I haven't thought about this","A few weeks — my cash reserves are minimal","2–3 months — I have some working capital buffer","6+ months — I have strong working capital and know exactly how long I can operate"], scores:[1,2,3,4], nationwide:true },
  ],
  managing: [
    { id:"mgt1", text:"I've stopped activities that pose a risk to my farm.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
    { id:"mgt2", text:"I've made changes to reduce the likelihood of a loss or disruption to farm operations.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
    { id:"mgt3", text:"I've transferred my risk by purchasing insurance.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
  ],
  contingency: [
    { id:"con1", text:"I have a list of backup suppliers for things like fertilizer, seed, feed, animal health products, etc.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
    { id:"con2", text:"My farm has backups for critical equipment, facilities, technology, etc.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
    { id:"con3", text:"I have a list of alternative customers/markets in the event that my current customer/market can no longer acquire my product.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
    { id:"con4", text:"I am aware of the necessary steps to minimize downtime and revenue loss following a disruption.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
  ],
  communicating: [
    { id:"comm1", text:"My family members and employees are informed of the contingency plans.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
    { id:"comm2", text:"I have trained my family members and employees on the contingency plans.", opts:["Strongly disagree","Disagree","Agree","Strongly agree"], scores:[1,2,3,4], nationwide:true },
  ],
};

const riskScoreLabel = (score, max) => { const pct = score/max; if (pct>=0.75) return { label:"Strong", pill:"strong" }; if (pct>=0.5) return { label:"In progress", pill:"watch" }; return { label:"Needs attention", pill:"vuln" }; };
const riskCatScore = (answers, catId) => (RISK_QUESTIONS[catId]||[]).reduce((sum,q) => sum + (answers[q.id]!==undefined ? q.scores[answers[q.id]] : 0), 0);
const riskCatAnswered = (answers, catId) => (RISK_QUESTIONS[catId]||[]).filter(q => answers[q.id]!==undefined).length;
// Stages 1–8: one category's question set per stage.
function RiskCategoryStage({ risk, setRisk, catIndex, fa, onStartConvo }) {
  const answers = risk.answers || {};
  const setAns = (qId, idx) => setRisk(s => ({ ...s, answers:{ ...(s.answers||{}), [qId]:idx } }));
  const cat = RISK_CATS[catIndex];
  const qs = RISK_QUESTIONS[cat.id] || [];
  const catScore = riskCatScore(answers, cat.id);
  const catAnswered = riskCatAnswered(answers, cat.id);
  const catSL = riskScoreLabel(catScore, cat.maxScore);
  return (
    <div>
      <Head eyebrow={`Farm Risk · Section ${catIndex+1} of 4`} title={cat.label} sub="Adapted directly from Nationwide's Farm Risk Ready℠ assessment quiz." />
      {catIndex===0 && <FinancialHealthStrip fa={fa} />}
      {catIndex===0 && onStartConvo && (
        <div style={{ background:T.greenL, border:"1px solid #dde7cd", borderRadius:9, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:18 }}>
          <div>
            <p style={{ fontSize:14.5, fontWeight:600, color:T.dgreen, margin:0 }}>Would you rather just talk it through?</p>
            <p style={{ fontSize:13, color:T.fgM, margin:"3px 0 0", maxWidth:520 }}>Answer out loud and the guided conversation scores the first seven steps for you, including your revenue operations and threats. You confirm every reading before it is recorded.</p>
          </div>
          <button onClick={onStartConvo} style={btnStyle("primary")}>Start the conversation</button>
        </div>
      )}
      {catAnswered>0 && <div style={{ marginBottom:16 }}><span style={pillStyle(catSL.pill)}>{catSL.label}</span><span style={{ fontSize:11.5, color:T.fgM, marginLeft:10 }}>{catAnswered}/{cat.questions} answered · {catScore}/{cat.maxScore} points</span></div>}
      {qs.map((q,qi) => {
        const selected = answers[q.id];
        return (
          <div key={q.id} style={cardStyle()}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:cat.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>{qi+1}</div>
              <div style={{ fontSize:13.5, fontWeight:600, color:T.navy, lineHeight:1.4 }}>{q.text}</div>
            </div>
            {q.nationwide && <div style={{ display:"inline-flex", padding:"2px 9px", borderRadius:999, fontSize:10, background:T.blueL, color:"#0A6E8C", fontWeight:700, marginBottom:10 }}>Nationwide Farm Risk Ready℠ framework</div>}
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {q.opts.map((opt,oi) => {
                const isSel = selected===oi; const isBest = oi===q.opts.length-1;
                return (
                  <div key={oi} onClick={()=>setAns(q.id,oi)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:8, cursor:"pointer", background:isSel?cat.colorL:"#fff", border:isSel?`2px solid ${cat.color}`:`1px solid ${T.border}` }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${isSel?cat.color:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{isSel && <div style={{ width:8, height:8, borderRadius:"50%", background:cat.color }} />}</div>
                    <span style={{ fontSize:12.5, color:isSel?cat.colorD:T.navy, flex:1, lineHeight:1.4 }}>{opt}</span>
                    {isBest && <span style={{ fontSize:10, padding:"1px 8px", borderRadius:999, background:T.greenL, color:"#2F6E28", fontWeight:700, flexShrink:0 }}>Best</span>}
                  </div>
                );
              })}
            </div>
            {q.tip && <div style={{ marginTop:10 }}><Flag type="info">{q.tip}</Flag></div>}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FARM RISK READY℠ PLAN BUILDER — shared data
// ─────────────────────────────────────────────────────────────────────────────
const THREAT_CATEGORIES = [
  { id:"facility", label:"Facility", desc:"Fires, explosions, structure collapse", color:T.red, colorL:T.redL },
  { id:"natural", label:"Natural", desc:"Storms, floods, or wildfires", color:T.amber, colorL:T.amberL },
  { id:"operational", label:"Operational", desc:"Loss of a primary customer, market access, safety recall, or disease outbreak", color:T.blue, colorL:T.blueL },
  { id:"personnel", label:"Personnel", desc:"Lack of skilled labor, loss of a key employee, divorce, or a family member passing unexpectedly", color:"#7C3AED", colorL:"#F3E8FF" },
  { id:"social", label:"Social", desc:"An animal welfare video or negative post about the farm on social media", color:T.dgreen, colorL:T.greenL },
  { id:"technology", label:"Technology", desc:"Data corruption, network failure, or a hack", color:T.water, colorL:T.waterL },
  { id:"price", label:"Price risk", desc:"Commodity or livestock prices falling below your cost of production — see the insurance calculators in the next two stages", color:T.tan, colorL:"#F5EDE0" },
  { id:"yield", label:"Production/yield risk", desc:"Drought, disease, or other factors reducing output below expectations — see the insurance calculators in the next two stages", color:"#0369A1", colorL:"#E0F2FE" },
];

// Concrete prompts per threat category. The open question alone produces whatever is
// top of mind, which is usually weather and prices. These are the nudges that surface
// the categories people reliably forget: people, reputation, technology, single-buyer risk.
const THREAT_PROMPTS = {
  facility:    ["A fire in the shop or barn", "A grain bin or roof failure", "Losing power or water to a facility"],
  natural:     ["Drought or a wet spring you cannot plant into", "Hail, wind, or a tornado", "An early freeze or flooding"],
  operational: ["Losing your biggest buyer or contract", "A disease outbreak in the herd", "A supplier who cannot deliver on time", "A recall or contamination issue"],
  personnel:   ["You or a key operator injured or unable to work", "Losing the one person who knows a critical job", "A death, divorce, or family dispute", "Not being able to find seasonal help"],
  social:      ["A video or post about the farm going around", "A neighbour complaint or nuisance claim", "Pressure over a practice you use"],
  technology:  ["Losing farm records or accounting data", "A hack, ransomware, or fraudulent payment", "GPS, monitors, or software failing mid-season"],
  price:       ["Commodity price dropping below your cost of production", "Input costs rising faster than output prices", "Interest rates on the operating line"],
  yield:       ["A crop failure or badly below-average yield", "Poor conception or death loss in livestock", "A pest or disease that cuts production"],
};

const STRATEGY_OPTIONS = [
  { id:"avoidance", label:"Risk avoidance", desc:"Stop or discontinue the activity" },
  { id:"acceptance", label:"Risk acceptance", desc:"Retain the risk and take no action" },
  { id:"transfer", label:"Risk transfer", desc:"Transfer through purchasing insurance or contractual means" },
  { id:"mitigation", label:"Risk control / mitigation", desc:"Change the likelihood or the consequences" },
];
const MITIGATION_SUBTYPES = [
  { id:"likelihood", label:"Change the likelihood (loss prevention)", ex:"e.g., add wind rings around grain bins" },
  { id:"consequences", label:"Change the consequences (loss reduction)", ex:"e.g., install fire detection and protection equipment" },
  { id:"separation", label:"Separation or segregation", ex:"e.g., store equipment at different farms or buildings" },
  { id:"duplication", label:"Duplication and diversification", ex:"e.g., access to a generator or a backup combine" },
];
const threatScore = (t) => (Number(t.probability)||0) * (Number(t.severity)||0);
const topRankedThreats = (threats) => [...(threats||[])].sort((a,b)=>threatScore(b)-threatScore(a)).slice(0,6);

// Stage 5 of Farm Risk — Results dashboard, summarizing the four quiz sections
function RiskResultsStage({ risk }) {
  const answers = risk.answers || {};
  const totalScore = RISK_CATS.reduce((s,c)=>s+riskCatScore(answers,c.id),0);
  const totalMax = RISK_CATS.reduce((s,c)=>s+c.maxScore,0);
  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = RISK_CATS.reduce((s,c)=>s+c.questions,0);
  const overall = riskScoreLabel(totalScore, totalMax);
  const overallLabel = totalMax>0 && totalScore/totalMax>=0.75 ? "Farm Risk Ready" : totalMax>0 && totalScore/totalMax>=0.5 ? "In progress" : "Needs attention";
  return (
    <div>
      <Head eyebrow="Farm Risk · Stage 5" title="Results" sub="Your score across the four Farm Risk Ready℠ sections. This is a snapshot of risk-management awareness and habits, not a substitute for the specific plan you'll build next." />
      <div style={{ background:T.navy, borderRadius:10, padding:"20px 24px", marginBottom:16, display:"grid", gridTemplateColumns:"1fr 2fr", gap:20, alignItems:"center" }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.green, marginBottom:6 }}>Overall score</div>
          <div style={{ fontSize:34, fontWeight:800, color:"#fff" }}>{totalScore}<span style={{ fontSize:16, color:"rgba(255,255,255,0.4)" }}> / {totalMax}</span></div>
          <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:999, fontSize:11.5, fontWeight:700, background:overall.pill==="strong"?T.dgreen:overall.pill==="watch"?T.amber:T.red, color:"#fff", marginTop:6 }}>{overallLabel}</span>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:8 }}>{totalAnswered}/{totalQuestions} questions answered</div>
        </div>
        <div>
          {RISK_CATS.map(c => { const sc=riskCatScore(answers,c.id); const pct=(sc/c.maxScore)*100; return (
            <div key={c.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:11.5, color:"rgba(255,255,255,0.6)", width:190, flexShrink:0 }}>{c.label}</span>
              <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.12)", borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, background:c.color, borderRadius:3 }} /></div>
              <span style={{ fontSize:11.5, color:c.color, fontWeight:700, width:28, textAlign:"right" }}>{sc}</span>
            </div>
          );})}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {RISK_CATS.map(c => { const sc=riskCatScore(answers,c.id); const ans=riskCatAnswered(answers,c.id); const sl=riskScoreLabel(sc,c.maxScore); const pct=(sc/c.maxScore)*100;
          return (
            <div key={c.id} style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:16, borderLeft:`4px solid ${sl.pill==="strong"?T.dgreen:sl.pill==="watch"?T.amber:T.red}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:13.5, fontWeight:700 }}>{c.label}</span>
                <span style={pillStyle(sl.pill)}>{sl.label}</span>
              </div>
              <div style={{ height:6, background:T.div, borderRadius:3, overflow:"hidden", marginBottom:8 }}><div style={{ height:"100%", width:`${pct}%`, background:c.color, borderRadius:3 }} /></div>
              <div style={{ fontSize:11.5, color:T.fgS }}>{sc}/{c.maxScore} points · {ans}/{c.questions} answered</div>
            </div>
          );
        })}
      </div>
      <Flag type="info">Nationwide research (December 2024): only 35% of farmers have a formal resiliency plan in place. Whatever your score, the Plan Builder stages next turn this into a specific, farm-tailored plan rather than a general readiness score.</Flag>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// CONVERSATIONAL CAPTURE — Farm Risk Ready, steps 1 through 7
// ═════════════════════════════════════════════════════════════════════════════
// Speech capture runs entirely in the browser through the Web Speech API, so it
// needs no server and no API key. Interpretation of what was said is currently a
// keyword heuristic that PROPOSES an answer for the farmer to confirm, never one
// that commits silently. Swapping the heuristic for a real model later means
// replacing interpretScale() and interpretList() with a call to a serverless
// function; every other part of this flow stays as it is.

const useSpeechInput = (onFinal) => {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);
  const finalRef = useRef(onFinal);
  finalRef.current = onFinal;

  useEffect(() => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) { setSupported(false); return; }
    setSupported(true);
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let fin = "", inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += t; else inter += t;
      }
      if (inter) setInterim(inter);
      if (fin) { setInterim(""); finalRef.current && finalRef.current(fin.trim()); }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    return () => { try { rec.stop(); } catch(e){} };
  }, []);

  const start = () => { if (!recRef.current) return; try { recRef.current.start(); setListening(true); } catch(e){} };
  const stop = () => { if (!recRef.current) return; try { recRef.current.stop(); } catch(e){} setListening(false); setInterim(""); };
  return { listening, interim, supported, start, stop };
};

// Heuristic read of a spoken answer against a four-point scale. Returns a proposed
// index plus the phrases that drove it, so the farmer can see why it landed there.
const SCALE_SIGNALS = [
  { idx:3, weight:3, words:["to a great extent","strongly agree","absolutely","definitely","every year","always","fully documented","written plan","we have a plan","completely","very confident","six months","6 months","more than six"] },
  { idx:2, weight:2, words:["agree","moderate","mostly","generally","for the most part","we do some","two three months","2-3 months","couple months","a few months","some of it","partly","working on it"] },
  { idx:1, weight:2, words:["small extent","disagree","a little","not much","not really","barely","a few weeks","couple weeks","started thinking","informally","in my head","only some"] },
  { idx:0, weight:3, words:["not at all","strongly disagree","never","nothing","none","no plan","haven't thought","have not thought","no idea","we don't","we do not","zero"] },
];

const interpretScale = (transcript) => {
  const t = (transcript||"").toLowerCase();
  if (!t.trim()) return { idx:null, confidence:"none", hits:[] };
  const tally = [0,0,0,0]; const hits = [];
  SCALE_SIGNALS.forEach(sig => sig.words.forEach(w => {
    if (t.includes(w)) { tally[sig.idx] += sig.weight; hits.push(w); }
  }));
  // bare yes / no when nothing stronger matched
  if (!hits.length) {
    if (/\bno\b|\bnope\b/.test(t)) { tally[0] += 2; hits.push("no"); }
    else if (/\byes\b|\byeah\b|\byep\b/.test(t)) { tally[2] += 2; hits.push("yes"); }
  }
  const max = Math.max(...tally);
  if (max === 0) return { idx:null, confidence:"none", hits:[] };
  const idx = tally.indexOf(max);
  const runnerUp = [...tally].sort((a,b)=>b-a)[1];
  const confidence = max >= 3 && max > runnerUp ? "high" : max > runnerUp ? "medium" : "low";
  return { idx, confidence, hits:[...new Set(hits)].slice(0,4) };
};

// Split a spoken list into items. Handles "and", commas, and filler openers.
const interpretList = (transcript) => {
  let t = (transcript||"").trim();
  if (!t) return [];
  t = t.replace(/^(well|so|um|uh|okay|ok|i guess|i'd say|i would say|we have|we've got|there's|there is|it's)[,\s]+/i, "");
  return t.split(/,|;|\bthen\b|\balso\b|\band\b/i)
    .map(s => s.replace(/[.\s]+$/,"").trim())
    // strip connectors and filler left at the head of an item by the split
    .map(s => s.replace(/^(then|also|plus|maybe|probably|we do some|we do|we have|we've got|i guess|some|a bit of)\s+/i, "").trim())
    .filter(s => s.length > 1)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .slice(0, 8);
};



// One spoken answer covering everything an operation depends on, sorted into the four
// fields by what the clause is actually about. Anything that does not clearly signal a
// supplier, a person, or a buyer falls to assets, which is the catch-all "depends on".
const DEP_KEYWORDS = {
  suppliers: ["buy","bought","buying","purchase","supplier","vendor","dealer","co-op","coop","cooperative","source","order from","get it from","get them from","comes from"],
  employees: ["work","works","working","employee","hired","hand","help","helps","labor","labour","myself","my son","my daughter","my wife","my husband","my dad","family","crew","operator","run it","runs it"],
  customers: ["sell","sold","sells","selling","buyer","customer","market","elevator","contract","ship","hauled to","haul it to","take it to","goes to","delivered to"],
  assets:    ["equipment","tractor","combine","planter","sprayer","truck","trailer","land","acres","ground","barn","shop","bin","storage","facility","irrigation","building","pens","fence","parlor","parlour"],
};

const segmentDependencies = (text) => {
  const out = { assets:[], suppliers:[], employees:[], customers:[] };
  const clauses = (text||"")
    .split(/[.;]+|,\s*|\bthen\b|\balso\b/i)
    .map(s => s.trim())
    .filter(s => s.length > 2);
  clauses.forEach(cl => {
    const low = cl.toLowerCase();
    let bestKey = "assets", bestScore = 0;
    Object.entries(DEP_KEYWORDS).forEach(([key, words]) => {
      const score = words.reduce((n,w) => n + (low.includes(w) ? 1 : 0), 0);
      if (score > bestScore) { bestScore = score; bestKey = key; }
    });
    const cleaned = cl.replace(/^(and|we|i|it|they)\s+/i, "").trim();
    if (cleaned) out[bestKey].push(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
  });
  return {
    assets: out.assets.join(", "),
    suppliers: out.suppliers.join(", "),
    employees: out.employees.join(", "),
    customers: out.customers.join(", "),
  };
};

// Five-point ratings spoken in plain language, for threat probability and severity.
const RATING_SIGNALS = {
  probability: [
    { v:5, words:["almost certain","every year","constantly","for sure","definitely will","happens all the time","guaranteed"] },
    { v:4, words:["likely","probably","pretty likely","often","every few years","more than once","expect it"] },
    { v:3, words:["maybe","possible","could happen","fifty fifty","50 50","sometimes","now and then","occasionally"] },
    { v:2, words:["unlikely","not likely","rare","rarely","hasn't happened","has not happened","doubt it","long shot"] },
    { v:1, words:["never","almost never","very unlikely","no chance","never happened","not in my lifetime"] },
  ],
  severity: [
    { v:5, words:["devastating","catastrophic","end the farm","out of business","wipe us out","lose everything","finished","ruin us"] },
    { v:4, words:["major","serious","really bad","big hit","significant","set us back years","very bad","huge"] },
    { v:3, words:["moderate","manageable","painful","hurt","sting","tough year","noticeable"] },
    { v:2, words:["minor","small","we would get by","we'd get by","annoying","inconvenient","not a big deal"] },
    { v:1, words:["negligible","barely","nothing much","hardly matter","no real impact"] },
  ],
};

const interpretRating = (transcript, kind) => {
  const t = (transcript||"").toLowerCase();
  if (!t.trim()) return { v:null, hits:[] };
  const hits = []; let best = null;
  (RATING_SIGNALS[kind]||[]).forEach(sig => sig.words.forEach(w => {
    if (t.includes(w) && best === null) { best = sig.v; hits.push(w); }
    else if (t.includes(w)) hits.push(w);
  }));
  // a bare number spoken as "three out of five" or "about a four"
  const num = t.match(/\b(one|two|three|four|five|1|2|3|4|5)\b/);
  if (best === null && num) {
    const map = { one:1, two:2, three:3, four:4, five:5 };
    best = map[num[1]] || parseInt(num[1]);
    hits.push(num[1]);
  }
  return { v:best, hits:[...new Set(hits)].slice(0,3) };
};

// Pull a phone number and email out of a spoken or typed contact answer.
const extractContactDetail = (text) => {
  const t = text || "";
  const email = (t.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [null])[0];
  const digits = (t.match(/(\+?\d[\d\s\-().]{6,}\d)/) || [null])[0];
  let name = t;
  if (email) name = name.replace(email, "");
  if (digits) name = name.replace(digits, "");
  name = name.replace(/^(talk to|call|reach out to|contact|speak to|ask for|it'?s|that'?s)\s+/i, "")
             .replace(/\b(you can reach (him|her|them) at|his|her|their|number is|email is|phone is|at|on|is)\b/gi, " ")
             .replace(/[,.\s]+/g, " ")
             .replace(/\s+(or|and)\s*$/i, "")
             .trim();
  return { name: name.slice(0, 60), phone: digits ? digits.replace(/[^\d+]/g,"") : "", email: email || "" };
};

// The question script. Sections map to the seven steps the flow covers.
const buildRiskScript = (risk) => {
  const script = [];
  RISK_CATS.forEach((c, ci) => {
    (RISK_QUESTIONS[c.id] || []).forEach(q => {
      script.push({ kind:"scale", section:`Step ${ci+1} · ${c.label}`, qId:q.id, prompt:q.text, opts:q.opts });
    });
  });
  script.push({ kind:"oplist", section:"Step 6 · Revenue operations", prompt:"Tell me the main things this farm makes money from. Just say them out loud, one after another." });
  const ops = (risk.plan?.revenueOps || []).filter(o => o.name);
  ops.slice(0,3).forEach(op => {
    script.push({ kind:"opdeps", opName:op.name, section:"Step 6 · "+op.name,
      prompt:`Walk me through ${op.name}. What does it depend on, who do you buy from, who works on it, and who buys it?`,
      hint:"One answer covers all four. Say it however it comes out and I will sort it." });
  });
  script.push({ kind:"contactlist", section:"Step 6 · Key contacts", prompt:"If something went wrong tomorrow, who would you need to call? Suppliers, buyers, vendors, anyone critical." });
  const contacts = (risk.plan?.contacts || []).filter(c => c.name);
  contacts.slice(0,3).forEach(ct => {
    script.push({ kind:"ctfield", field:"materials", ctName:ct.name, section:"Step 6 · "+ct.name, prompt:`What do you get from ${ct.name}, or what do they do for you?` });
    script.push({ kind:"ctprimary", ctName:ct.name, section:"Step 6 · "+ct.name, prompt:`Who is your main contact at ${ct.name}, and what is the best number or email?` });
    script.push({ kind:"ctalt", ctName:ct.name, section:"Step 6 · "+ct.name, prompt:`If you could not reach them, who is the backup at ${ct.name}?` });
  });

  script.push({ kind:"threats", section:"Step 7 · Threats",
    prompt:"Now the hard question. What could go wrong on this farm?",
    hint:"The categories below are there to jog your thinking. Work down them out loud and name anything that applies. Most people cover weather and prices and stop, so give the people and technology ones a moment." });
  const threats = (risk.plan?.threats || []).filter(t => t.label);
  if (threats.length) {
    script.push({ kind:"threatgaps", section:"Step 7 · Threats",
      prompt:"Anything in the areas you have not touched yet?",
      hint:"Covered categories are marked below. The unmarked ones are worth a second look before we score these." });
  }
  threats.slice(0,5).forEach(th => {
    script.push({ kind:"rating", ratingKind:"probability", threatId:th.id, section:"Step 7 · "+th.label, prompt:`How likely is "${th.label}" in the next few years?` });
    script.push({ kind:"rating", ratingKind:"severity", threatId:th.id, section:"Step 7 · "+th.label, prompt:`If "${th.label}" did happen, how badly would it hurt the operation?` });
  });
  return script;
};

// Order matters: the specific categories are tested before the broad ones, so
// "price below breakeven" lands in price rather than being swallowed by operational.
const THREAT_KEYWORDS = {
  price:      ["price","prices","commodity","market price","cash price","below cost","breakeven","break even","input cost","margin","interest rate"],
  yield:      ["yield","yields","crop failure","poor crop","low yield","production loss","death loss","conception"],
  personnel:  ["labor","labour","employee","help","hired","injury","injured","hurt","death","divorce","succession","quit","sick","dad","son","daughter","wife","husband","key person"],
  facility:   ["fire","barn","building","shop","explosion","collapse","roof","structure","grain bin","bin"],
  natural:    ["drought","flood","storm","hail","wind","tornado","freeze","frost","wildfire","weather","rain","dry","wet spring"],
  technology: ["hack","hacked","data","records","computer","internet","gps","software","cyber","network","system","ransomware"],
  social:     ["social media","reputation","video","activist","public","neighbor","neighbour","complaint","nuisance"],
  operational:["customer","buyer","contract","recall","disease","outbreak","supply","supplier","market access","delivery"],
};

// Word-boundary matching, so "grain buyer" is not caught by "rain" and "combine"
// is not caught by "bin". Multi-word phrases are matched as a unit.
const hasWord = (haystack, needle) => {
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^a-z])" + esc + "([^a-z]|$)", "i").test(haystack);
};

const categorizeThreat = (label) => {
  const t = (label||"").toLowerCase();
  for (const [cat, words] of Object.entries(THREAT_KEYWORDS)) {
    if (words.some(w => hasWord(t, w))) return cat;
  }
  return "operational";
};


// The finished plan, rendered as a document rather than a form. This is the artifact
// a farmer hands to a spouse, a successor, an employee, or an insurance agent, so it
// reads top to bottom without needing the app to explain it.
function RiskPlanDocument({ risk, profile, goCalc }) {
  const plan = risk.plan || {};
  const answers = risk.answers || {};
  const ops = (plan.revenueOps || []).filter(o => o.name);
  const contacts = (plan.contacts || []).filter(c => c.name);
  const threats = [...(plan.threats || [])].filter(t => t.label).sort((a,b)=>threatScore(b)-threatScore(a));
  const total = RISK_CATS.reduce((s,c)=>s+riskCatScore(answers,c.id),0);
  const maxTotal = RISK_CATS.reduce((s,c)=>s+c.maxScore,0);
  const answered = Object.keys(answers).length;
  const catLabel = (id) => (THREAT_CATEGORIES.find(c=>c.id===id)||{}).label || id;
  const band = (s) => s>=20 ? {t:"Immediate",k:"vuln"} : s>=12 ? {t:"Elevated",k:"watch"} : {t:"Monitor",k:"strong"};

  const H = ({children}) => <div style={{ fontSize:11, letterSpacing:"0.13em", textTransform:"uppercase", color:T.fgS, margin:"26px 0 12px", paddingBottom:6, borderBottom:`1px solid ${T.border}` }}>{children}</div>;

  return (
    <div>
      <Head eyebrow="Farm Risk · Your plan" title="Farm risk plan" sub="Everything captured in the conversation, written up as one document. Print it, or read it out to whoever else needs to know what to do." />

      <div style={cardStyle()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:14, flexWrap:"wrap", borderBottom:`2px solid ${T.navy}`, paddingBottom:12, marginBottom:4 }}>
          <div>
            <div style={{ fontSize:19, fontWeight:600, color:T.navy }}>{profile?.location ? `Farm risk plan · ${profile.location}` : "Farm risk plan"}</div>
            <div style={{ fontSize:12.5, color:T.fgS, marginTop:2 }}>Prepared from the guided Farm Risk Ready conversation</div>
          </div>
          <button onClick={()=>window.print()} style={{ ...btnStyle("outline"), fontSize:12, padding:"6px 14px" }}>Print or save as PDF</button>
        </div>

        <H>Readiness</H>
        {answered === 0 ? (
          <p style={{ fontSize:13.5, color:T.fgS, fontStyle:"italic" }}>The readiness questions have not been answered yet.</p>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:30, fontWeight:600, color:T.navy }}>{total}</span>
              <span style={{ fontSize:14, color:T.fgS }}>of {maxTotal} across {answered} answered questions</span>
            </div>
            {RISK_CATS.map(c => {
              const sc = riskCatScore(answers, c.id); const sl = riskScoreLabel(sc, c.maxScore);
              return (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"7px 0", borderBottom:`1px dashed ${T.border}` }}>
                  <span style={{ width:210, fontSize:13.5, color:T.fg, flexShrink:0 }}>{c.label}</span>
                  <div style={{ flex:1, height:7, background:"#dde1e8", borderRadius:4, overflow:"hidden" }}>
                    <div style={{ width:`${(sc/c.maxScore)*100}%`, height:"100%", background:scColor(sl.pill), borderRadius:4 }} />
                  </div>
                  <span style={{ width:56, textAlign:"right", fontSize:13.5, fontWeight:600, color:scColor(sl.pill), flexShrink:0 }}>{sc}/{c.maxScore}</span>
                </div>
              );
            })}
          </>
        )}

        <H>What this farm makes money from</H>
        {ops.length === 0 ? <p style={{ fontSize:13.5, color:T.fgS, fontStyle:"italic" }}>No revenue operations recorded.</p> :
          ops.map((o,k) => (
            <div key={k} style={{ borderLeft:`2px solid ${T.moss}`, paddingLeft:14, marginBottom:14 }}>
              <div style={{ fontSize:15, fontWeight:600, color:T.fg, marginBottom:5 }}>{o.name}</div>
              {[["Depends on",o.assets],["Bought from",o.suppliers],["Worked by",o.employees],["Sold to",o.customers]].map(([lab,val],x) => val ? (
                <div key={x} style={{ fontSize:13, color:T.fgM, marginBottom:2 }}><b style={{ color:T.fgS, fontWeight:600 }}>{lab}:</b> {val}</div>
              ) : null)}
            </div>
          ))}

        <H>Who to call</H>
        {contacts.length === 0 ? <p style={{ fontSize:13.5, color:T.fgS, fontStyle:"italic" }}>No key contacts recorded.</p> :
          contacts.map((c,k) => (
            <div key={k} style={{ background:T.bgAlt, borderRadius:8, padding:"12px 15px", marginBottom:10 }}>
              <div style={{ fontSize:14.5, fontWeight:600, color:T.fg }}>{c.name}</div>
              {c.materials && <div style={{ fontSize:12.5, color:T.fgM, margin:"2px 0 7px" }}>{c.materials}</div>}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontSize:12.5 }}>
                <div><span style={{ color:T.fgS }}>Primary: </span>{c.primaryName || "—"}{c.primaryPhone ? ` · ${c.primaryPhone}` : ""}{c.primaryEmail ? ` · ${c.primaryEmail}` : ""}</div>
                <div><span style={{ color:T.fgS }}>Backup: </span>{c.altName || "—"}{c.altPhone ? ` · ${c.altPhone}` : ""}{c.altEmail ? ` · ${c.altEmail}` : ""}</div>
              </div>
            </div>
          ))}

        <H>What could go wrong, ranked</H>
        {threats.length === 0 ? <p style={{ fontSize:13.5, color:T.fgS, fontStyle:"italic" }}>No threats recorded.</p> : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 92px 74px 74px 96px", gap:8, padding:"7px 10px", background:T.navy, borderRadius:"6px 6px 0 0" }}>
              {["Threat","Category","Likely","Impact","Priority"].map((h,x)=>(
                <span key={x} style={{ fontSize:10.5, letterSpacing:"0.08em", fontWeight:600, color:"#fff", textTransform:"uppercase", textAlign:x>=2?"center":"left" }}>{h}</span>
              ))}
            </div>
            {threats.map((t,k) => {
              const sc = threatScore(t); const b = band(sc);
              return (
                <div key={t.id} style={{ display:"grid", gridTemplateColumns:"1fr 92px 74px 74px 96px", gap:8, padding:"9px 10px", alignItems:"center", background:k%2===0?T.bgAlt:"#fff", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:13.5, color:T.fg }}>{t.label}</span>
                  <span style={{ fontSize:11.5, color:T.fgS }}>{catLabel(t.category)}</span>
                  <span style={{ fontSize:13, textAlign:"center", color:T.fgM }}>{t.probability}</span>
                  <span style={{ fontSize:13, textAlign:"center", color:T.fgM }}>{t.severity}</span>
                  <span style={{ textAlign:"center" }}><span style={pillStyle(b.k)}>{b.t} {sc}</span></span>
                </div>
              );
            })}
            <p style={{ fontSize:12, color:T.fgS, marginTop:9 }}>Priority is likelihood multiplied by impact. Anything scoring 20 or above deserves a plan before the season starts.</p>
          </>
        )}

        <H>What happens next</H>
        {(() => {
          const strat = plan.strategies || {};
          const transfers = threats.filter(t => (strat[t.id]||{}).strategy === "transfer");
          return (
            <>
              <ol style={{ fontSize:14, color:T.fgM, paddingLeft:20, margin:"0 0 14px", lineHeight:1.7 }}>
                <li>Give a copy of this document to whoever would have to act if you could not.</li>
                <li>Walk the top threats with whoever else is named in it, so the plan is not only in your head.</li>
                <li>Revisit it once a year, or any time a revenue operation or key supplier changes.</li>
              </ol>
              {transfers.length > 0 && goCalc && (
                <div style={{ background:T.greenL, border:"1px solid #dde7cd", borderRadius:9, padding:"13px 17px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:600, color:T.dgreen, margin:0 }}>
                      {transfers.length === 1 ? "One threat is set to transfer" : `${transfers.length} threats are set to transfer`}
                    </p>
                    <p style={{ fontSize:12.5, color:T.fgM, margin:"3px 0 0", maxWidth:520 }}>
                      Now that the plan says what you are protecting against, size the coverage against your actual cost of production: {transfers.slice(0,3).map(t=>t.label).join(", ")}{transfers.length>3?", and others":""}.
                    </p>
                  </div>
                  <button onClick={goCalc} style={btnStyle("primary")}>Size the coverage →</button>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

function ConversationalRisk({ risk, setRisk, onExit, profile }) {
  const [i, setI] = useState(0);
  const [draft, setDraft] = useState("");
  const [proposed, setProposed] = useState(null);
  const script = useMemo(() => buildRiskScript(risk), [risk.plan?.revenueOps, risk.plan?.contacts, risk.plan?.threats]);
  const step = script[i];
  const speech = useSpeechInput((txt) => setDraft(d => (d ? d + " " : "") + txt));

  const setPlan = (patch) => setRisk(s => ({ ...s, plan:{ ...(s.plan||{}), ...patch } }));

  useEffect(() => {
    if (!step) { setProposed(null); return; }
    if (step.kind === "scale") setProposed(interpretScale(draft));
    else if (step.kind === "rating") setProposed(interpretRating(draft, step.ratingKind));
    else setProposed(null);
  }, [draft, i]);

  if (!step) {
    return (
      <div>
        <Flag type="ok">Conversation complete. Everything you said has been scored and written into the plan below. Every field stays editable in the stage view.</Flag>
        <RiskPlanDocument risk={risk} profile={profile} />
        <div style={{ display:"flex", gap:10, marginTop:4, flexWrap:"wrap" }}>
          {(risk.plan?.threats||[]).length > 0
            ? <button onClick={()=>onExit(8)} style={btnStyle("primary")}>Build strategies for these threats →</button>
            : <button onClick={()=>onExit(5)} style={btnStyle("primary")}>Open the stages to refine it</button>}
          <button onClick={()=>onExit(5)} style={btnStyle("outline")}>See my results first</button>
          <button onClick={()=>setI(0)} style={btnStyle("ghost")}>Start over</button>
        </div>
      </div>
    );
  }

  const commit = () => {
    const text = draft.trim();
    if (step.kind === "scale") {
      const idx = proposed && proposed.idx !== null ? proposed.idx : null;
      if (idx === null) return;
      setRisk(s => ({ ...s,
        answers:{ ...(s.answers||{}), [step.qId]: idx },
        transcripts:{ ...(s.transcripts||{}), [step.qId]: text } }));
    } else if (step.kind === "oplist") {
      const names = interpretList(text);
      setPlan({ revenueOps: names.map(n => ({ name:n, assets:"", suppliers:"", employees:"", customers:"" })) });
    } else if (step.kind === "opdeps") {
      const seg = segmentDependencies(text);
      const ops = (risk.plan?.revenueOps || []).map(o => o.name === step.opName ? { ...o, ...seg } : o);
      setPlan({ revenueOps: ops });
    } else if (step.kind === "contactlist") {
      const names = interpretList(text);
      setPlan({ contacts: names.map(n => ({ name:n, materials:"", primaryName:"", primaryPhone:"", primaryEmail:"", altName:"", altPhone:"", altEmail:"" })) });
    } else if (step.kind === "ctfield") {
      const cts = (risk.plan?.contacts || []).map(c => c.name === step.ctName ? { ...c, [step.field]: text } : c);
      setPlan({ contacts: cts });
    } else if (step.kind === "ctprimary" || step.kind === "ctalt") {
      const d = extractContactDetail(text);
      const pre = step.kind === "ctprimary" ? "primary" : "alt";
      const cts = (risk.plan?.contacts || []).map(c => c.name === step.ctName
        ? { ...c, [pre+"Name"]:d.name, [pre+"Phone"]:d.phone, [pre+"Email"]:d.email } : c);
      setPlan({ contacts: cts });
    } else if (step.kind === "threats" || step.kind === "threatgaps") {
      const items = interpretList(text);
      const existing = risk.plan?.threats || [];
      setPlan({ threats: [...existing, ...items.map((label,k) => ({ id:Date.now()+k, label, category:categorizeThreat(label), probability:3, severity:3 }))] });
    } else if (step.kind === "rating") {
      const v = proposed && proposed.v ? proposed.v : 3;
      const ths = (risk.plan?.threats || []).map(t => t.id === step.threatId ? { ...t, [step.ratingKind]: v } : t);
      setPlan({ threats: ths });
    }
    setDraft(""); setProposed(null); speech.stop(); setI(n => n + 1);
  };

  const skip = () => { setDraft(""); setProposed(null); speech.stop(); setI(n => n + 1); };
  const pct = Math.round((i / script.length) * 100);
  const canCommit = step.kind === "scale" ? (proposed && proposed.idx !== null)
    : step.kind === "rating" ? (proposed && proposed.v)
    : step.kind === "threatgaps" ? true
    : draft.trim().length > 1;

  return (
    <div>
      <Head eyebrow="Farm Risk · Guided conversation" title="Talk it through, I will do the writing" sub="Answer out loud or type. Nothing is scored without showing you what it heard and letting you change it first." />

      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
        <div style={{ flex:1, height:6, background:T.div, borderRadius:3, overflow:"hidden" }}>
          <div style={{ width:`${pct}%`, height:"100%", background:T.green, borderRadius:3, transition:"width .3s" }} />
        </div>
        <span style={{ fontSize:11.5, color:T.fgS, whiteSpace:"nowrap" }}>{i+1} of {script.length}</span>
        <button onClick={onExit} style={{ ...btnStyle("outline"), fontSize:11.5, padding:"5px 12px" }}>Use the forms instead</button>
      </div>

      <div style={cardStyle()}>
        <div style={{ fontSize:10.5, letterSpacing:"0.13em", textTransform:"uppercase", color:T.fgS, marginBottom:10 }}>{step.section}</div>
        <p style={{ fontSize:19, fontWeight:600, color:T.navy, lineHeight:1.4, margin:"0 0 6px" }}>{step.prompt}</p>
        {step.hint && <p style={{ fontSize:13, color:T.fgS, fontStyle:"italic", margin:"0 0 16px" }}>{step.hint}</p>}
        {!step.hint && <div style={{ height:12 }} />}

        {/* mic + transcript */}
        <div style={{ border:`1px solid ${speech.listening?T.green:T.border}`, background:speech.listening?T.greenL:"#fff", borderRadius:9, padding:14, marginBottom:12, transition:"all .2s" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            {speech.supported ? (
              <button onClick={speech.listening ? speech.stop : speech.start}
                style={{ ...btnStyle(speech.listening ? "outline" : "primary"), fontSize:12.5, padding:"7px 14px" }}>
                {speech.listening ? "■ Stop" : "● Speak your answer"}
              </button>
            ) : (
              <span style={{ fontSize:12, color:T.fgS, fontStyle:"italic" }}>Speech input is not available in this browser. Chrome or Edge supports it. Typing works the same.</span>
            )}
            {speech.listening && <span style={{ fontSize:12, color:T.dgreen }}>Listening, speak naturally and pause when done.</span>}
          </div>
          <textarea
            style={inputStyle({ minHeight:84, fontSize:14.5, lineHeight:1.6, border:"none", background:"transparent", padding:0, resize:"vertical" })}
            value={draft + (speech.interim ? " " + speech.interim : "")}
            onChange={e=>setDraft(e.target.value)}
            placeholder="Your answer appears here as you speak, or type it yourself." />
        </div>

        {/* what it heard */}
        {step.kind === "scale" && proposed && proposed.idx !== null && (
          <div style={{ borderLeft:`2px solid ${T.blue}`, background:T.blueL, borderRadius:"0 5px 5px 0", padding:"11px 14px", marginBottom:12 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:T.blue, marginBottom:5 }}>WHAT I HEARD · {proposed.confidence.toUpperCase()} CONFIDENCE</div>
            <div style={{ fontSize:13.5, color:T.navy, fontWeight:600, marginBottom:6 }}>{step.opts[proposed.idx]}</div>
            {proposed.hits.length > 0 && <div style={{ fontSize:11.5, color:T.fgM }}>Based on: {proposed.hits.join(", ")}</div>}
            <div style={{ marginTop:9, display:"flex", gap:6, flexWrap:"wrap" }}>
              {step.opts.map((o,k) => (
                <button key={k} onClick={()=>setProposed(p=>({ ...(p||{}), idx:k, confidence:"confirmed", hits:[] }))}
                  style={{ background:proposed.idx===k?T.navy:"#fff", color:proposed.idx===k?"#fff":T.fgM, border:`1px solid ${proposed.idx===k?T.navy:T.border}`, borderRadius:4, padding:"5px 10px", fontSize:11.5, cursor:"pointer", font:"inherit", fontWeight:proposed.idx===k?600:400 }}>
                  {k+1}
                </button>
              ))}
              <span style={{ fontSize:11, color:T.fgS, alignSelf:"center" }}>tap a number to change it</span>
            </div>
          </div>
        )}
        {step.kind === "scale" && draft.trim() && (!proposed || proposed.idx === null) && (
          <Flag type="warn">I could not tell which answer that maps to. Pick the closest one below, or say it another way.
            <div style={{ marginTop:9, display:"flex", flexDirection:"column", gap:5 }}>
              {step.opts.map((o,k) => (
                <button key={k} onClick={()=>setProposed({ idx:k, confidence:"confirmed", hits:[] })}
                  style={{ textAlign:"left", background:"#fff", border:`1px solid ${T.border}`, borderRadius:5, padding:"7px 10px", fontSize:12.5, cursor:"pointer", font:"inherit", color:T.fgM }}>
                  {k+1}. {o}
                </button>
              ))}
            </div>
          </Flag>
        )}
        {step.kind === "rating" && draft.trim() && (
          <div style={{ borderLeft:`2px solid ${proposed && proposed.v ? T.blue : T.amber}`, background:proposed && proposed.v ? T.blueL : T.amberL, borderRadius:"0 5px 5px 0", padding:"11px 14px", marginBottom:12 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:proposed && proposed.v ? T.blue : T.amberT, marginBottom:7 }}>
              {proposed && proposed.v ? `WHAT I HEARD · ${step.ratingKind.toUpperCase()}` : "PICK A LEVEL"}
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
              {[1,2,3,4,5].map(v => {
                const on = proposed && proposed.v === v;
                const lab = step.ratingKind === "probability"
                  ? ["Very unlikely","Unlikely","Possible","Likely","Almost certain"][v-1]
                  : ["Negligible","Minor","Moderate","Major","Severe"][v-1];
                return (
                  <button key={v} onClick={()=>setProposed({ v, hits:[] })} title={lab}
                    style={{ background:on?T.navy:"#fff", color:on?"#fff":T.fgM, border:`1px solid ${on?T.navy:T.border}`, borderRadius:4, padding:"6px 11px", fontSize:12, cursor:"pointer", font:"inherit", fontWeight:on?600:400 }}>
                    {v} · {lab}
                  </button>
                );
              })}
            </div>
            {proposed && proposed.hits && proposed.hits.length > 0 && <div style={{ fontSize:11.5, color:T.fgM, marginTop:7 }}>Based on: {proposed.hits.join(", ")}</div>}
          </div>
        )}
        {(step.kind === "threats" || step.kind === "threatgaps") && (() => {
          const recorded = (risk.plan?.threats || []).filter(t => t.label);
          const draftCats = new Set(interpretList(draft).map(categorizeThreat));
          const savedCats = new Set(recorded.map(t => t.category));
          return (
            <div style={{ border:`1px solid ${T.border}`, borderRadius:9, padding:"13px 15px", marginBottom:14, background:T.bgAlt }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:10, flexWrap:"wrap", marginBottom:10 }}>
                <span style={{ fontSize:10.5, letterSpacing:"0.13em", textTransform:"uppercase", color:T.fgS }}>Eight areas to think through</span>
                <span style={{ fontSize:11.5, color:T.fgS }}>{savedCats.size + [...draftCats].filter(c=>!savedCats.has(c)).length} of 8 touched</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:9 }}>
                {THREAT_CATEGORIES.map(c => {
                  const saved = savedCats.has(c.id), inDraft = draftCats.has(c.id);
                  const on = saved || inDraft;
                  return (
                    <div key={c.id} style={{ background:on?T.greenL:"#fff", border:`1px solid ${on?"#dde7cd":T.border}`, borderRadius:7, padding:"9px 11px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        <span style={{ width:14, height:14, borderRadius:3, flexShrink:0, background:on?T.dgreen:"#e2e5ea", color:"#fff", fontSize:9.5, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{on ? "\u2713" : ""}</span>
                        <span style={{ fontSize:12.5, fontWeight:600, color:on?T.dgreen:T.fg }}>{c.label}</span>
                        {saved && <span style={{ fontSize:10, color:T.fgS }}>recorded</span>}
                      </div>
                      <ul style={{ margin:0, paddingLeft:20, fontSize:11.5, color:T.fgM, lineHeight:1.5 }}>
                        {(THREAT_PROMPTS[c.id]||[]).map((p,x) => <li key={x}>{p}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
        {step.kind === "opdeps" && draft.trim() && (() => {
          const seg = segmentDependencies(draft);
          const rows = [["Depends on",seg.assets],["Bought from",seg.suppliers],["Worked by",seg.employees],["Sold to",seg.customers]];
          const empty = rows.filter(r => !r[1]).map(r => r[0]);
          return (
            <div style={{ borderLeft:`2px solid ${T.moss}`, background:T.greenL, borderRadius:"0 5px 5px 0", padding:"11px 14px", marginBottom:12 }}>
              <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:T.dgreen, marginBottom:7 }}>HOW I SORTED THAT</div>
              {rows.map(([lab,val],k) => (
                <div key={k} style={{ display:"flex", gap:10, fontSize:12.5, padding:"3px 0", alignItems:"baseline" }}>
                  <span style={{ width:88, color:T.fgS, flexShrink:0, fontWeight:600 }}>{lab}</span>
                  <span style={{ color:val ? T.fg : T.fgS }}>{val || "nothing yet"}</span>
                </div>
              ))}
              {empty.length > 0 && <div style={{ fontSize:11.5, color:T.fgM, marginTop:7 }}>Nothing landed under {empty.join(", ").toLowerCase()}. Keep talking to fill those in, or leave them and edit in the stage view.</div>}
            </div>
          );
        })()}
        {(step.kind === "ctprimary" || step.kind === "ctalt") && draft.trim() && (() => {
          const d = extractContactDetail(draft);
          return (
            <div style={{ borderLeft:`2px solid ${T.moss}`, background:T.greenL, borderRadius:"0 5px 5px 0", padding:"11px 14px", marginBottom:12 }}>
              <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:T.dgreen, marginBottom:6 }}>I WILL RECORD</div>
              <div style={{ fontSize:13, color:T.fg }}>
                <div><b>Name:</b> {d.name || <span style={{ color:T.fgS }}>not caught, add it in the form later</span>}</div>
                {d.phone && <div><b>Phone:</b> {d.phone}</div>}
                {d.email && <div><b>Email:</b> {d.email}</div>}
              </div>
              {!d.phone && !d.email && <div style={{ fontSize:11.5, color:T.fgM, marginTop:6 }}>No number or email picked up. Phone digits are hard to catch by voice, so this is often quicker to type.</div>}
            </div>
          );
        })()}
        {(step.kind === "oplist" || step.kind === "threats" || step.kind === "threatgaps" || step.kind === "contactlist") && draft.trim() && (
          <div style={{ borderLeft:`2px solid ${T.moss}`, background:T.greenL, borderRadius:"0 5px 5px 0", padding:"11px 14px", marginBottom:12 }}>
            <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:T.dgreen, marginBottom:6 }}>I WILL RECORD THESE</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {interpretList(draft).map((x,k) => (
                <span key={k} style={{ background:"#fff", border:`1px solid #dde7cd`, borderRadius:4, padding:"4px 9px", fontSize:12.5, color:T.fg }}>{x}</span>
              ))}
            </div>
            {(step.kind === "threats" || step.kind === "threatgaps") && <div style={{ fontSize:11.5, color:T.fgM, marginTop:8 }}>I will ask how likely and how serious each one is next, then rank them for you.</div>}
            {step.kind === "contactlist" && <div style={{ fontSize:11.5, color:T.fgM, marginTop:8 }}>For each one I will ask what they supply and who to call.</div>}
          </div>
        )}

        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={commit} disabled={!canCommit} style={{ ...btnStyle("primary"), opacity:canCommit?1:0.45, cursor:canCommit?"pointer":"default" }}>Next question →</button>
          <button onClick={skip} style={btnStyle("ghost")}>{step.kind === "threatgaps" ? "Nothing else, move on" : "Skip"}</button>
          {i > 0 && <button onClick={()=>{ setDraft(""); setI(n=>n-1); }} style={btnStyle("ghost")}>← Back</button>}
        </div>
      </div>

      <Flag type="info">Speech runs in your browser, so nothing is sent anywhere to be transcribed. What it heard is a keyword read of your words, shown to you before anything is scored, never applied silently.</Flag>
    </div>
  );
}


// Turns a ranked threat into a first-draft strategy and contingency plan. Category
// drives the default approach, score decides whether it is worth acting on at all,
// and the people and contacts already captured in the conversation get pulled in so
// the "who" fields are not blank. Everything here is a starting point to edit, never
// a decision, and it never overwrites something the farmer has already written.
const STRATEGY_SEED = {
  price: { strategy:"transfer", action:"Size a Revenue Protection or LRP coverage level against actual cost of production using the insurance calculators, then decide how much of the remaining gap to carry.",
           response:"Check the coverage floor against current cost of production, and confirm what the policy would actually pay at today's prices.", timeline:"Before the next sales closing date" },
  yield: { strategy:"transfer", action:"Review APH and coverage level against breakeven yield. Confirm whether the current level covers full cost or only variable cost.",
           response:"Document the loss, notify the crop insurance agent, and confirm the claim window before harvest pressure starts.", timeline:"Within 72 hours of the loss" },
  facility: { strategy:"transfer", mitigationType:"consequences", action:"Confirm replacement-cost coverage and current limits on buildings and contents, then review detection and suppression on the highest-value structure.",
           response:"Ensure people are safe, call emergency services, then notify the insurance agent before moving or clearing anything.", timeline:"Immediate, then within 24 hours" },
  natural: { strategy:"transfer", action:"Confirm limits and deductibles for wind, hail, and flood exposure, and check whether any structure is excluded.",
           response:"Document damage with photographs before cleanup, then notify the agent.", timeline:"Within 48 hours" },
  personnel: { strategy:"mitigation", mitigationType:"duplication", action:"Cross-train a second person on the tasks only one person can do today, and write down the procedures for the two most critical.",
           response:"Identify which jobs stop immediately, and who covers each one this week.", timeline:"Within the first week" },
  technology: { strategy:"mitigation", mitigationType:"duplication", action:"Move farm records off a single machine, set an automatic backup, and confirm the backup actually restores.",
           response:"Disconnect the affected machine, work from the backup copy, and change passwords on financial accounts.", timeline:"Same day" },
  social: { strategy:"mitigation", mitigationType:"likelihood", action:"Agree in advance who speaks for the farm and what gets said, so the answer is not being invented under pressure.",
           response:"Do not respond immediately. Agree the facts internally, then have one named person reply once.", timeline:"Within 24 hours, not sooner" },
  operational: { strategy:"mitigation", mitigationType:"duplication", action:"Line up a named alternate supplier and an alternate buyer, and confirm each could actually take or supply the volume.",
           response:"Contact the backup on the list, and confirm what volume and timing they can handle.", timeline:"Within 48 hours" },
};

const seedStrategyForThreat = (threat, plan) => {
  const base = STRATEGY_SEED[threat.category] || STRATEGY_SEED.operational;
  const score = threatScore(threat);
  // Low-scoring threats do not warrant spend or effort; name that explicitly.
  if (score < 8) {
    return { strategy:"acceptance", mitigationType:"",
      action:`Accept for now. At a score of ${score} this does not justify the cost of transferring or mitigating it. Revisit if probability or impact changes.`,
      response:"Absorb and carry on. Note it if it happens so the score can be revisited.", who:"", roles:"", informed:"", timeline:"Review at the next annual check" };
  }
  const people = (plan.revenueOps || []).map(o => o.employees).filter(Boolean).join("; ").slice(0,120);
  const contacts = (plan.contacts || []).map(c => c.name).filter(Boolean).slice(0,3).join(", ");
  return {
    strategy: base.strategy,
    mitigationType: base.mitigationType || "",
    action: base.action,
    response: base.response,
    who: people || "",
    roles: people ? "Confirm who leads and who supports before it is needed, not during." : "",
    informed: contacts || "",
    timeline: base.timeline,
  };
};

// Stage 6 of Farm Risk — Revenue operations & key contacts
function RiskPlanRevenueOps({ risk, setRisk }) {
  const plan = risk.plan || {};
  const revenueOps = plan.revenueOps || [];
  const contacts = plan.contacts || [];
  const setPlan = (patch) => setRisk(s => ({ ...s, plan:{ ...(s.plan||{}), ...patch } }));
  const addOp = () => setPlan({ revenueOps:[...revenueOps, { name:"", assets:"", suppliers:"", employees:"", customers:"" }] });
  const updateOp = (i,field,val) => setPlan({ revenueOps: revenueOps.map((o,idx)=>idx===i?{...o,[field]:val}:o) });
  const removeOp = (i) => setPlan({ revenueOps: revenueOps.filter((_,idx)=>idx!==i) });
  const addContact = () => setPlan({ contacts:[...contacts, { name:"", materials:"", primaryName:"", primaryPhone:"", primaryEmail:"", altName:"", altPhone:"", altEmail:"" }] });
  const updateContact = (i,field,val) => setPlan({ contacts: contacts.map((c,idx)=>idx===i?{...c,[field]:val}:c) });
  const removeContact = (i) => setPlan({ contacts: contacts.filter((_,idx)=>idx!==i) });
  return (
    <div>
      <Head eyebrow="Farm Risk · Plan Builder · Stage 1" title="Revenue operations & key contacts" sub="Document each primary revenue operation and the assets, suppliers, employees, and customers it depends on — then record backup contacts for your key suppliers, vendors, and customers." />
      <div style={cardStyle()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={cardLblStyle({ marginBottom:0 })}>Primary revenue operations</div>
          {revenueOps.length<6 && <button style={{ ...btnStyle("outline"), fontSize:11, padding:"5px 12px" }} onClick={addOp}>+ Add operation</button>}
        </div>
        {revenueOps.length===0 && <div style={{ fontSize:12.5, color:T.fgS }}>No revenue operations added yet. Start with your largest — corn, cattle, custom trucking, whatever generates the most revenue.</div>}
        {revenueOps.map((op,i) => (
          <div key={i} style={{ border:`1px solid ${T.border}`, borderRadius:9, padding:14, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <label style={labelStyle}>Revenue operation (e.g., corn, cattle, vegetables, trucking)</label>
              <span onClick={()=>removeOp(i)} style={{ fontSize:11, color:T.red, cursor:"pointer", fontWeight:600 }}>Remove</span>
            </div>
            <input style={inputStyle({ marginBottom:10 })} value={op.name} onChange={e=>updateOp(i,"name",e.target.value)} placeholder="e.g., Corn" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={labelStyle}>Key assets needed</label><textarea style={inputStyle({ minHeight:60 })} value={op.assets} onChange={e=>updateOp(i,"assets",e.target.value)} /></div>
              <div><label style={labelStyle}>Key suppliers / vendors</label><textarea style={inputStyle({ minHeight:60 })} value={op.suppliers} onChange={e=>updateOp(i,"suppliers",e.target.value)} /></div>
              <div><label style={labelStyle}>Key employees</label><textarea style={inputStyle({ minHeight:60 })} value={op.employees} onChange={e=>updateOp(i,"employees",e.target.value)} /></div>
              <div><label style={labelStyle}>Key customers</label><textarea style={inputStyle({ minHeight:60 })} value={op.customers} onChange={e=>updateOp(i,"customers",e.target.value)} /></div>
            </div>
          </div>
        ))}
      </div>
      <div style={cardStyle()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={cardLblStyle({ marginBottom:0 })}>Key supplier, vendor & customer contacts</div>
          {contacts.length<6 && <button style={{ ...btnStyle("outline"), fontSize:11, padding:"5px 12px" }} onClick={addContact}>+ Add contact</button>}
        </div>
        {contacts.length===0 && <div style={{ fontSize:12.5, color:T.fgS }}>Record a primary and a backup contact for each critical relationship — this is exactly what you'll need in the first hour of a real disruption.</div>}
        {contacts.map((c,i) => (
          <div key={i} style={{ border:`1px solid ${T.border}`, borderRadius:9, padding:14, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <label style={labelStyle}>Name of supplier, vendor, or customer</label>
              <span onClick={()=>removeContact(i)} style={{ fontSize:11, color:T.red, cursor:"pointer", fontWeight:600 }}>Remove</span>
            </div>
            <input style={inputStyle({ marginBottom:8 })} value={c.name} onChange={e=>updateContact(i,"name",e.target.value)} placeholder="Company or individual name" />
            <input style={inputStyle({ marginBottom:10 })} value={c.materials} onChange={e=>updateContact(i,"materials",e.target.value)} placeholder="Materials / services provided or sold" />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.dgreen, marginBottom:6 }}>PRIMARY CONTACT</div>
                <input style={inputStyle({ marginBottom:6 })} value={c.primaryName} onChange={e=>updateContact(i,"primaryName",e.target.value)} placeholder="Name" />
                <input style={inputStyle({ marginBottom:6 })} value={c.primaryPhone} onChange={e=>updateContact(i,"primaryPhone",e.target.value)} placeholder="Phone" />
                <input style={inputStyle()} value={c.primaryEmail} onChange={e=>updateContact(i,"primaryEmail",e.target.value)} placeholder="Email" />
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.amberT, marginBottom:6 }}>ALTERNATE CONTACT</div>
                <input style={inputStyle({ marginBottom:6 })} value={c.altName} onChange={e=>updateContact(i,"altName",e.target.value)} placeholder="Name" />
                <input style={inputStyle({ marginBottom:6 })} value={c.altPhone} onChange={e=>updateContact(i,"altPhone",e.target.value)} placeholder="Phone" />
                <input style={inputStyle()} value={c.altEmail} onChange={e=>updateContact(i,"altEmail",e.target.value)} placeholder="Email" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Stage 7 of Farm Risk — Threat identification & ranking
function RiskPlanThreats({ risk, setRisk, goStrategy }) {
  const plan = risk.plan || {};
  const threats = plan.threats || [];
  const setPlan = (patch) => setRisk(s => ({ ...s, plan:{ ...(s.plan||{}), ...patch } }));
  const [draft, setDraft] = useState({ category:"facility", label:"", probability:3, severity:3 });
  const addThreat = () => { if (!draft.label.trim()) return; setPlan({ threats:[...threats, { ...draft, id:Date.now() }] }); setDraft({ category:"facility", label:"", probability:3, severity:3 }); };
  const removeThreat = (id) => setPlan({ threats: threats.filter(t=>t.id!==id) });
  const sorted = [...threats].sort((a,b)=>threatScore(b)-threatScore(a));
  return (
    <div>
      <Head eyebrow="Farm Risk · Plan Builder · Stage 2" title="Threat identification & ranking" sub="List potential threats across all eight categories, then score each on probability and severity. Threats scoring 10–25 are your most immediate concern — you'll build strategies and contingency plans for these next." />
      {goStrategy && (threats||[]).length > 0 && (
        <div style={{ background:T.greenL, border:"1px solid #dde7cd", borderRadius:9, padding:"13px 17px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:16 }}>
          <div>
            <p style={{ fontSize:14, fontWeight:600, color:T.dgreen, margin:0 }}>Ready to plan what you will do about these?</p>
            <p style={{ fontSize:12.5, color:T.fgM, margin:"3px 0 0", maxWidth:520 }}>Your ranked threats, the people you named, and your key contacts all carry forward and prefill a first draft strategy for each one.</p>
          </div>
          <button onClick={goStrategy} style={btnStyle("primary")}>Build strategies →</button>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
        {THREAT_CATEGORIES.map(c => (<div key={c.id} style={{ background:c.colorL, borderRadius:8, padding:"10px 12px" }}><div style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.label}</div><div style={{ fontSize:10.5, color:T.fgM, marginTop:2 }}>{c.desc}</div></div>))}
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Add a threat or risk</div>
        <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 110px 110px 90px", gap:10, alignItems:"end" }}>
          <div><label style={labelStyle}>Category</label><select style={inputStyle()} value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}>{THREAT_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div><label style={labelStyle}>Describe the threat</label><input style={inputStyle()} value={draft.label} onChange={e=>setDraft(d=>({...d,label:e.target.value}))} placeholder="e.g., Grain bin structure collapse" /></div>
          <div><label style={labelStyle}>Probability (1–5)</label><select style={inputStyle()} value={draft.probability} onChange={e=>setDraft(d=>({...d,probability:parseInt(e.target.value)}))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          <div><label style={labelStyle}>Severity (1–5)</label><select style={inputStyle()} value={draft.severity} onChange={e=>setDraft(d=>({...d,severity:parseInt(e.target.value)}))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          <button style={btnStyle("primary")} onClick={addThreat}>Add</button>
        </div>
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Your ranked threats — highest score first</div>
        {sorted.length===0 && <div style={{ fontSize:12.5, color:T.fgS }}>No threats added yet.</div>}
        {sorted.map(t => {
          const cat = THREAT_CATEGORIES.find(c=>c.id===t.category); const score = threatScore(t); const urgent = score>=10;
          return (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:`1px solid ${T.div}` }}>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, background:cat?.colorL, color:cat?.color, flexShrink:0 }}>{cat?.label}</span>
              <span style={{ fontSize:13, color:T.navy, flex:1 }}>{t.label}</span>
              <span style={{ fontSize:11, color:T.fgM }}>P{t.probability} × S{t.severity}</span>
              <span style={{ fontSize:16, fontWeight:800, color:urgent?T.red:T.fgM, width:36, textAlign:"right" }}>{score}</span>
              {urgent && <span style={pillStyle("vuln")}>Immediate</span>}
              <span onClick={()=>removeThreat(t.id)} style={{ fontSize:11, color:T.fgS, cursor:"pointer" }}>✕</span>
            </div>
          );
        })}
      </div>
      {sorted.filter(t=>threatScore(t)>=10).length>0 && <Flag type="warn">{sorted.filter(t=>threatScore(t)>=10).length} threat(s) scored 10–25 — these carry into the next stage for strategy and contingency planning.</Flag>}
    </div>
  );
}

// Stage 8 of Farm Risk — Strategy & contingency plans (combines Nationwide Steps 2–3)
function RiskPlanStrategy({ risk, setRisk }) {
  const plan = risk.plan || {};
  const threats = plan.threats || [];
  const strategies = plan.strategies || {};
  const contingency = plan.contingency || {};
  const setPlan = (patch) => setRisk(s => ({ ...s, plan:{ ...(s.plan||{}), ...patch } }));
  const setStrategy = (id,field,val) => setPlan({ strategies:{ ...strategies, [id]:{ ...(strategies[id]||{}), [field]:val, seeded:false } } });
  const setContingency = (id,field,val) => setPlan({ contingency:{ ...contingency, [id]:{ ...(contingency[id]||{}), [field]:val } } });
  const top = topRankedThreats(threats);

  // Prefill a first draft for any ranked threat that has not been worked yet. Runs on
  // arrival so the stage is never a wall of empty boxes, and skips anything already
  // written so it can never overwrite the farmer's own words.
  const unseeded = top.filter(t => !strategies[t.id]);
  useEffect(() => {
    if (!unseeded.length) return;
    const nextS = { ...strategies }, nextC = { ...contingency };
    unseeded.forEach(t => {
      const s = seedStrategyForThreat(t, plan);
      nextS[t.id] = { strategy:s.strategy, mitigationType:s.mitigationType, action:s.action, seeded:true };
      nextC[t.id] = { ...(nextC[t.id]||{}), response:s.response, who:s.who, roles:s.roles, informed:s.informed, timeline:s.timeline };
    });
    setRisk(st => ({ ...st, plan:{ ...(st.plan||{}), strategies:nextS, contingency:nextC } }));
  }, [unseeded.length]);

  const seededCount = top.filter(t => (strategies[t.id]||{}).seeded).length;

  return (
    <div>
      <Head eyebrow="Farm Risk · Plan Builder · Stage 3" title="Strategy & contingency plans" sub="For each of your highest-ranked threats, choose a management strategy and build your Plan A for responding if it happens." />
      {top.length===0 && <Flag type="warn">No ranked threats yet. Go back to the previous stage and add at least one.</Flag>}
      {seededCount > 0 && (
        <Flag type="info">Everything below is carried forward from your threat ranking and prefilled as a first draft, including the people and contacts you named earlier. {seededCount === 1 ? "One threat is" : `${seededCount} threats are`} showing a suggested strategy based on category and score. Change anything that does not fit, it is a starting point rather than a recommendation.</Flag>
      )}
      {top.map(t => {
        const cat = THREAT_CATEGORIES.find(c=>c.id===t.category); const s = strategies[t.id]||{}; const c2 = contingency[t.id]||{};
        return (
          <div key={t.id} style={cardStyle({ borderLeft:`4px solid ${cat?.color}` })}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, background:cat?.colorL, color:cat?.color }}>{cat?.label}</span>
              <span style={{ fontSize:15, fontWeight:700 }}>{t.label}</span>
              <span style={{ marginLeft:"auto", fontSize:15, fontWeight:800, color:T.red }}>Score: {threatScore(t)}</span>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={labelStyle}>Risk management strategy — select one</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
                {STRATEGY_OPTIONS.map(opt => { const on = s.strategy===opt.id; return (
                  <div key={opt.id} onClick={()=>setStrategy(t.id,"strategy",opt.id)} style={{ padding:"10px 12px", borderRadius:8, border:on?`2px solid ${T.blue}`:`1px solid ${T.border}`, cursor:"pointer", background:on?T.blueL:"#fff" }}>
                    <div style={{ fontSize:12.5, fontWeight:600, color:on?T.blue:T.navy }}>{opt.label}</div>
                    <div style={{ fontSize:11, color:T.fgS, marginTop:2 }}>{opt.desc}</div>
                  </div>
                );})}
              </div>
              {s.strategy==="mitigation" && (
                <div style={{ marginTop:10 }}>
                  <label style={labelStyle}>Mitigation approach</label>
                  <select style={inputStyle()} value={s.mitigationType||""} onChange={e=>setStrategy(t.id,"mitigationType",e.target.value)}>
                    <option value="">Select approach</option>
                    {MITIGATION_SUBTYPES.map(m=><option key={m.id} value={m.id}>{m.label} — {m.ex}</option>)}
                  </select>
                </div>
              )}
              <div style={{ marginTop:10 }}>
                <label style={labelStyle}>Specifically, what will you do?</label>
                <textarea style={inputStyle({ minHeight:60 })} value={s.action||""} onChange={e=>setStrategy(t.id,"action",e.target.value)} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={labelStyle}>Immediate response to recover</label><textarea style={inputStyle({ minHeight:56 })} value={c2.response||""} onChange={e=>setContingency(t.id,"response",e.target.value)} /></div>
              <div><label style={labelStyle}>Who will be involved</label><textarea style={inputStyle({ minHeight:56 })} value={c2.who||""} onChange={e=>setContingency(t.id,"who",e.target.value)} /></div>
              <div><label style={labelStyle}>Their roles / responsibilities</label><textarea style={inputStyle({ minHeight:56 })} value={c2.roles||""} onChange={e=>setContingency(t.id,"roles",e.target.value)} /></div>
              <div><label style={labelStyle}>Who will be informed</label><textarea style={inputStyle({ minHeight:56 })} value={c2.informed||""} onChange={e=>setContingency(t.id,"informed",e.target.value)} /></div>
              <div style={{ gridColumn:"1 / -1" }}><label style={labelStyle}>Timeline for response</label><input style={inputStyle()} value={c2.timeline||""} onChange={e=>setContingency(t.id,"timeline",e.target.value)} /></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Stage 9 of Farm Risk — Communicate, train & review (combines Nationwide Steps 4–5)
function RiskPlanReview({ risk, setRisk }) {
  const plan = risk.plan || {};
  const threats = plan.threats || [];
  const communication = plan.communication || {};
  const setPlan = (patch) => setRisk(s => ({ ...s, plan:{ ...(s.plan||{}), ...patch } }));
  const setComm = (id,field,val) => setPlan({ communication:{ ...communication, [id]:{ ...(communication[id]||{}), [field]:val } } });
  const top = topRankedThreats(threats);
  return (
    <div>
      <Head eyebrow="Farm Risk · Plan Builder · Stage 4" title="Communicate, train & review" sub="Make sure everyone who needs to know your plan actually knows it — then set a cadence to review, update, and test it." />
      {top.length===0 && <Flag type="warn">No ranked threats yet. Go back and add threats in Stage 12.</Flag>}
      {top.map(t => {
        const cat = THREAT_CATEGORIES.find(c=>c.id===t.category); const cm = communication[t.id]||{};
        return (
          <div key={t.id} style={cardStyle({ borderLeft:`4px solid ${cat?.color}` })}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, background:cat?.colorL, color:cat?.color }}>{cat?.label}</span>
              <span style={{ fontSize:15, fontWeight:700 }}>{t.label}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div><label style={labelStyle}>Who needs to be informed</label><textarea style={inputStyle({ minHeight:56 })} value={cm.whoInform||""} onChange={e=>setComm(t.id,"whoInform",e.target.value)} /></div>
              <div><label style={labelStyle}>How will you inform them</label><textarea style={inputStyle({ minHeight:56 })} value={cm.howInform||""} onChange={e=>setComm(t.id,"howInform",e.target.value)} /></div>
              <div><label style={labelStyle}>Training plan</label><textarea style={inputStyle({ minHeight:56 })} value={cm.training||""} onChange={e=>setComm(t.id,"training",e.target.value)} /></div>
              <div><label style={labelStyle}>Where the plan is kept</label><input style={inputStyle()} value={cm.planLocation||""} onChange={e=>setComm(t.id,"planLocation",e.target.value)} /></div>
            </div>
          </div>
        );
      })}
      <div style={cardStyle({ borderTop:`4px solid ${T.dgreen}` })}>
        <div style={cardLblStyle()}>Step 5 — Prepare, recover, and review</div>
        <div style={{ fontSize:12.5, color:T.fgM, lineHeight:1.5, marginBottom:14 }}>Recovery is about the speed of returning to normal operations after a disruption. Review your plans annually, involve your team, and set aside time to test the plan against a real scenario.</div>
        <label style={labelStyle}>Optional: crisis communications preparedness plan</label>
        <div style={{ fontSize:11.5, color:T.fgS, marginBottom:8 }}>A product safety scare, animal welfare situation, or manure spill can erode trust in your farm fast if the communication response isn't managed well.</div>
        <textarea style={inputStyle({ minHeight:80 })} value={plan.crisisComms||""} onChange={e=>setPlan({ crisisComms:e.target.value })} placeholder="Who speaks for the farm publicly? What's the first statement? Who approves it before it goes out?" />
      </div>
      <div style={{ ...cardStyle({ background:T.navy, border:"none" }) }}>
        <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:6 }}>Farm Risk Ready℠ Plan complete</div>
        <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>Share this plan with your family, employees, and your Farm Credit or Nationwide advisor. Set a calendar reminder to revisit it every year — immediately after tax filing is a natural trigger.</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FARM RISK — Stage 10: Crop insurance calculator
// ─────────────────────────────────────────────────────────────────────────────
// Models Revenue Protection (RP) mechanics using the projected/expected price only —
// it does not model the harvest-price-option feature of full RP, where the guarantee
// can rise if harvest price exceeds the projected price. That simplification is called
// out explicitly in the disclaimer rather than left implicit.
const CROP_PRESETS = {
  corn:     { label:"Corn",     unit:"bu", variable:588, fixed:200, land:280, aph:200, price:4.20 },
  soybeans: { label:"Soybeans", unit:"bu", variable:340, fixed:150, land:250, aph:55,  price:10.30 },
  wheat:    { label:"Wheat",    unit:"bu", variable:220, fixed:130, land:200, aph:60,  price:5.00 },
};
const COVERAGE_LEVELS = [50,55,60,65,70,75,80,85];

// Representative statewide average yields, not official RMA county T-yields. RMA's actual
// county-level Actuarial Data Master files aren't available as a live, queryable source —
// they're periodic FTP file drops, the same limitation we hit with FINBIN. These figures
// are an approximate starting point by state; the farmer's actual county T-yield should
// always be confirmed with their crop insurance agent before using it for real coverage
// decisions.
const STATE_YIELD_REFERENCE = {
  SD:{corn:165,soybeans:48,wheat:55}, MN:{corn:190,soybeans:52,wheat:60}, IA:{corn:200,soybeans:58,wheat:65},
  NE:{corn:185,soybeans:60,wheat:55}, IL:{corn:210,soybeans:62,wheat:68}, IN:{corn:195,soybeans:58,wheat:70},
  OH:{corn:180,soybeans:55,wheat:72}, WI:{corn:175,soybeans:50,wheat:62}, KS:{corn:145,soybeans:45,wheat:48},
  ND:{corn:145,soybeans:38,wheat:45}, MO:{corn:165,soybeans:50,wheat:58}, MI:{corn:165,soybeans:50,wheat:68},
  KY:{corn:175,soybeans:52,wheat:70}, TX:{corn:140,soybeans:40,wheat:38}, CO:{corn:175,soybeans:45,wheat:42},
};
const STATE_NAME_TO_ABBR = {
  "south dakota":"SD","minnesota":"MN","iowa":"IA","nebraska":"NE","illinois":"IL","indiana":"IN",
  "ohio":"OH","wisconsin":"WI","kansas":"KS","north dakota":"ND","missouri":"MO","michigan":"MI",
  "kentucky":"KY","texas":"TX","colorado":"CO",
};
// Parses a free-text "Location" field like "Minnehaha, SD" or "Sioux Falls, South Dakota"
const parseStateFromLocation = (location) => {
  if (!location) return null;
  const text = location.trim();
  const abbrMatch = text.match(/\b([A-Z]{2})\b\s*$/);
  if (abbrMatch && STATE_YIELD_REFERENCE[abbrMatch[1]]) return abbrMatch[1];
  const lower = text.toLowerCase();
  for (const [name, abbr] of Object.entries(STATE_NAME_TO_ABBR)) { if (lower.includes(name)) return abbr; }
  return null;
};


// What the plan says this calculator is answering, so the numbers are not abstract.
const TransferContext = ({ risk, kinds }) => {
  const plan = risk.plan || {};
  const strat = plan.strategies || {};
  const hits = (plan.threats || []).filter(t => (strat[t.id]||{}).strategy === "transfer" && kinds.includes(t.category));
  if (!hits.length) return null;
  return (
    <div style={{ borderLeft:`2px solid ${T.moss}`, background:T.greenL, borderRadius:"0 5px 5px 0", padding:"11px 14px", marginBottom:16 }}>
      <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:T.dgreen, marginBottom:5 }}>FROM YOUR PLAN</div>
      <div style={{ fontSize:13, color:T.fg }}>
        You chose to transfer {hits.length === 1 ? "this threat" : "these threats"}: {hits.map(t=>t.label).join(", ")}. This is where you find out how much of the gap the coverage actually closes.
      </div>
    </div>
  );
};

function CropInsuranceCalculator({ risk, setRisk, fa, profile }) {
  const calc = risk.cropCalc || {};
  const cropId = calc.crop || "corn";
  const preset = CROP_PRESETS[cropId];
  const setCalc = (patch) => setRisk(s => ({ ...s, cropCalc:{ ...(s.cropCalc||{}), ...patch } }));
  const loadCrop = (id) => setCalc({ crop:id, variable:CROP_PRESETS[id].variable, fixed:CROP_PRESETS[id].fixed, land:CROP_PRESETS[id].land, aph:CROP_PRESETS[id].aph, price:CROP_PRESETS[id].price, coverage:75 });

  const stateAbbr = parseStateFromLocation(profile?.location);
  const stateRef = stateAbbr ? STATE_YIELD_REFERENCE[stateAbbr] : null;
  const stateRefYield = stateRef ? stateRef[cropId] : null;

  // Pull whatever genuinely overlaps from Financial Analysis: Stage 1's grain input
  // cost/ac (most enterprise-specific) or, failing that, whole-farm figures from Stage 3
  // divided across total acres. Expected price has no FA source — FA never asks for a
  // price assumption — so that always comes from the crop preset.
  const faGrain = fa?.ratioVals?.grain || {};
  const faS3 = fa?.s3vals || {};
  const faAcres = parseFloat(faS3.acres) || 0;
  const faInputs = parseFloat(faS3.inputs) || 0;
  const faOpex = parseFloat(faS3.opex) || 0;
  const faRent = parseFloat(faS3.rent) || 0;
  const faIpa = parseFloat(faGrain.ipa) || 0;
  const derivedVariable = faIpa>0 ? faIpa : (faAcres>0 && faInputs>0 ? faInputs/faAcres : null);
  const derivedLand = (faAcres>0 && faRent>0) ? faRent/faAcres : null;
  const derivedFixed = (faAcres>0 && faOpex>0 && faInputs>0) ? Math.max(0,(faOpex-faInputs)/faAcres) : null;
  const hasFAData = derivedVariable!==null || derivedLand!==null || derivedFixed!==null;
  const useFAData = () => setCalc({
    ...(derivedVariable!==null ? { variable: Math.round(derivedVariable) } : {}),
    ...(derivedFixed!==null ? { fixed: Math.round(derivedFixed) } : {}),
    ...(derivedLand!==null ? { land: Math.round(derivedLand) } : {}),
  });
  const useStateYield = () => setCalc({ aph: stateRefYield });

  const variable = calc.variable!==undefined ? Number(calc.variable) : preset.variable;
  const fixed = calc.fixed!==undefined ? Number(calc.fixed) : preset.fixed;
  const land = calc.land!==undefined ? Number(calc.land) : preset.land;
  const aph = calc.aph!==undefined ? Number(calc.aph) : preset.aph;
  const price = calc.price!==undefined ? Number(calc.price) : preset.price;
  const coverage = calc.coverage!==undefined ? Number(calc.coverage) : 75;

  const totalCost = variable + fixed + land;
  const breakeven = aph>0 ? totalCost/aph : 0;
  const normalYearRevenue = aph * price;
  const guarantee = aph * (coverage/100) * price;
  const gapToFullCost = totalCost - guarantee;
  const gapNormalYear = totalCost - normalYearRevenue;
  const priceGap = breakeven - price;
  const maxVal = Math.max(totalCost, normalYearRevenue, guarantee, 1);
  const barPct = v => Math.max(2, Math.round((v/maxVal)*100));

  return (
    <div>
      <Head eyebrow="Farm Risk · Stage 11" title="Crop insurance calculator" sub="See how your Revenue Protection guarantee compares to your actual cost of production — and why insurance is a floor to keep the farm solvent, not a guarantee of profit." />
      <TransferContext risk={risk} kinds={["price","yield","natural"]} />

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {Object.entries(CROP_PRESETS).map(([id,c]) => (<button key={id} onClick={()=>loadCrop(id)} style={{ ...btnStyle(cropId===id?"primary":"outline"), fontSize:12, padding:"6px 16px" }}>{c.label}</button>))}
      </div>

      {hasFAData && (
        <div style={{ background:T.blueL, borderRadius:8, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div style={{ fontSize:12.5, color:"#0A6E8C", lineHeight:1.5 }}>
            <b>Financial Analysis carried over</b> — {faIpa>0 ? `your grain input cost of $${Math.round(faIpa)}/ac from Stage 1 is available.` : `whole-farm figures from Stage 3 suggest roughly $${Math.round(derivedVariable||0)}/ac in variable costs.`} These are whole-farm or blended-grain figures — if you separate corn and soybean costs, treat this as a starting point to confirm, not a precise per-crop number.
          </div>
          <button onClick={useFAData} style={{ ...btnStyle("outline"), fontSize:11.5, padding:"6px 14px", whiteSpace:"nowrap", flexShrink:0 }}>Use my Financial Analysis numbers →</button>
        </div>
      )}

      {stateRefYield && (
        <div style={{ background:T.greenL, borderRadius:8, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
          <div style={{ fontSize:12.5, color:"#2F6E28", lineHeight:1.5 }}>
            <b>Farm Profile location detected</b> — your profile lists {profile.location}. A representative {stateAbbr} statewide average yield for {preset.label.toLowerCase()} is <b>{stateRefYield} {preset.unit}/ac</b>. This is an approximate reference figure, not your actual county's official RMA T-yield — confirm the real number with your crop insurance agent.
          </div>
          <button onClick={useStateYield} style={{ ...btnStyle("outline", T.dgreen), fontSize:11.5, padding:"6px 14px", whiteSpace:"nowrap", flexShrink:0 }}>Use {stateAbbr} reference yield →</button>
        </div>
      )}

      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Your numbers</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:14 }}>
          <div><label style={labelStyle}>Variable costs ($/ac)</label><input type="number" style={inputStyle()} value={calc.variable??preset.variable} onChange={e=>setCalc({variable:e.target.value})} /></div>
          <div><label style={labelStyle}>Fixed costs ($/ac)</label><input type="number" style={inputStyle()} value={calc.fixed??preset.fixed} onChange={e=>setCalc({fixed:e.target.value})} /></div>
          <div><label style={labelStyle}>Land cost ($/ac)</label><input type="number" style={inputStyle()} value={calc.land??preset.land} onChange={e=>setCalc({land:e.target.value})} /></div>
          <div><label style={labelStyle}>APH yield ({preset.unit}/ac)</label><input type="number" style={inputStyle()} value={calc.aph??preset.aph} onChange={e=>setCalc({aph:e.target.value})} /></div>
          <div><label style={labelStyle}>Expected price (${preset.unit==="bu"?"/bu":"/"+preset.unit})</label><input type="number" step="0.01" style={inputStyle()} value={calc.price??preset.price} onChange={e=>setCalc({price:e.target.value})} /></div>
          <div><label style={labelStyle}>Coverage level ({coverage}%)</label><input type="range" min={50} max={85} step={5} value={coverage} onChange={e=>setCalc({coverage:parseInt(e.target.value,10)})} style={{ width:"100%", marginTop:10 }} /></div>
        </div>
      </div>

      <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
        <div style={cardLblStyle()}>Cost vs. guarantee</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:16 }}>
          <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Breakeven price</div>
            <div style={{ fontSize:22, fontWeight:800, color:priceGap>0?T.red:T.dgreen }}>${breakeven.toFixed(2)}/{preset.unit}</div>
          </div>
          <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Total cost per acre</div>
            <div style={{ fontSize:22, fontWeight:800, color:T.navy }}>${Math.round(totalCost).toLocaleString()}</div>
          </div>
        </div>

        {priceGap>0 && <Flag type="warn">At {aph} {preset.unit}/ac, this year's breakeven price (${breakeven.toFixed(2)}/{preset.unit}) sits ${priceGap.toFixed(2)} above your expected price (${price.toFixed(2)}/{preset.unit}) — the crop doesn't cover full cost even in a normal year, before any insurance is considered.</Flag>}

        <div style={{ marginTop:16, marginBottom:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:T.fgM, marginBottom:4 }}><span style={{ fontWeight:600 }}>Total cost per acre</span><span>${Math.round(totalCost).toLocaleString()}</span></div>
          <div style={{ height:20, background:T.red, borderRadius:4, width:`${barPct(totalCost)}%` }} />
        </div>
        <div style={{ marginBottom:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:T.fgM, marginBottom:4 }}><span style={{ fontWeight:600 }}>Normal-year revenue (APH × expected price)</span><span>${Math.round(normalYearRevenue).toLocaleString()}</span></div>
          <div style={{ height:20, background:T.amber, borderRadius:4, width:`${barPct(normalYearRevenue)}%` }} />
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:T.fgM, marginBottom:4 }}><span style={{ fontWeight:600 }}>RP guarantee at {coverage}% coverage</span><span>${Math.round(guarantee).toLocaleString()}</span></div>
          <div style={{ height:20, background:T.blue, borderRadius:4, width:`${barPct(guarantee)}%` }} />
        </div>

        <div style={{ background:gapToFullCost>0?T.redL:T.greenL, borderRadius:8, padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:gapToFullCost>0?T.red:T.dgreen, marginBottom:4 }}>Gap to full cost</div>
          <div style={{ fontSize:12.5, color:gapToFullCost>0?T.redD:"#2F6E28", lineHeight:1.5 }}>
            {gapToFullCost>0
              ? `A ${coverage}% Revenue Protection guarantee covers $${Math.round(guarantee).toLocaleString()} of your $${Math.round(totalCost).toLocaleString()} total cost per acre — a $${Math.round(gapToFullCost).toLocaleString()}/ac shortfall even if the guarantee pays out in full. Insurance is there to keep the farm solvent through a bad year, not to make a marginal year whole.`
              : `A ${coverage}% Revenue Protection guarantee of $${Math.round(guarantee).toLocaleString()}/ac fully covers your $${Math.round(totalCost).toLocaleString()} total cost per acre, with $${Math.round(Math.abs(gapToFullCost)).toLocaleString()}/ac to spare if the guarantee pays out in full.`}
          </div>
        </div>
      </div>

      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Gap to full cost by coverage level</div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${COVERAGE_LEVELS.length},1fr)`, gap:6 }}>
          {COVERAGE_LEVELS.map(cl => {
            const g = aph*(cl/100)*price; const gap = totalCost-g; const isCurrent = cl===coverage;
            return (
              <div key={cl} onClick={()=>setCalc({coverage:cl})} style={{ cursor:"pointer", textAlign:"center", padding:"10px 4px", borderRadius:8, border:isCurrent?`2px solid ${T.blue}`:`1px solid ${T.border}`, background:isCurrent?T.blueL:"#fff" }}>
                <div style={{ fontSize:11, color:T.fgS, marginBottom:4 }}>{cl}%</div>
                <div style={{ fontSize:13, fontWeight:800, color:gap>0?T.red:T.dgreen }}>{gap>0?"-":"+"}${Math.round(Math.abs(gap))}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Flag type="warn">This is an educational planning tool, not a quote. It models Revenue Protection using the expected/projected price only — actual RP policies can also raise the guarantee if the harvest price exceeds the projected price. Actual APH, projected price, and coverage options are set by RMA and confirmed with your crop insurance agent.</Flag>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FARM RISK — Stage 11: Livestock insurance calculator
// ─────────────────────────────────────────────────────────────────────────────
// Models Livestock Risk Protection (LRP) mechanics: a price floor set at coverage
// level × expected ending value, compared against cost of production per cwt.
const LIVESTOCK_PRESETS = {
  feeder: { label:"Feeder cattle", price:240, cost:205, coverageDefault:90, min:70, max:100 },
  fed:    { label:"Fed cattle",    price:185, cost:175, coverageDefault:90, min:70, max:100 },
  hogs:   { label:"Hogs",          price:83,  cost:83,  coverageDefault:90, min:70, max:100 },
};
const LIVESTOCK_COVERAGE_LEVELS = [70,75,80,85,90,95,100];

function LivestockInsuranceCalculator({ risk, setRisk }) {
  const calc = risk.livestockCalc || {};
  const typeId = calc.type || "feeder";
  const preset = LIVESTOCK_PRESETS[typeId];
  const setCalc = (patch) => setRisk(s => ({ ...s, livestockCalc:{ ...(s.livestockCalc||{}), ...patch } }));
  const loadType = (id) => setCalc({ type:id, price:LIVESTOCK_PRESETS[id].price, cost:LIVESTOCK_PRESETS[id].cost, coverage:LIVESTOCK_PRESETS[id].coverageDefault });

  const price = calc.price!==undefined ? Number(calc.price) : preset.price;
  const cost = calc.cost!==undefined ? Number(calc.cost) : preset.cost;
  const coverage = calc.coverage!==undefined ? Number(calc.coverage) : preset.coverageDefault;

  const floor = price * (coverage/100);
  const marginOverCost = floor - cost;
  const maxVal = Math.max(price, cost, floor, 1);
  const barPct = v => Math.max(2, Math.round((v/maxVal)*100));

  return (
    <div>
      <Head eyebrow="Farm Risk · Stage 12" title="Livestock insurance calculator" sub="See how a Livestock Risk Protection (LRP) price floor compares to your cost of production — and how that relationship can look very different from crop insurance depending on the market." />
      <TransferContext risk={risk} kinds={["price","yield","operational"]} />

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {Object.entries(LIVESTOCK_PRESETS).map(([id,c]) => (<button key={id} onClick={()=>loadType(id)} style={{ ...btnStyle(typeId===id?"primary":"outline"), fontSize:12, padding:"6px 16px" }}>{c.label}</button>))}
      </div>

      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Your numbers</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          <div><label style={labelStyle}>Expected price ($/cwt)</label><input type="number" step="0.01" style={inputStyle()} value={calc.price??preset.price} onChange={e=>setCalc({price:e.target.value})} /></div>
          <div><label style={labelStyle}>Cost of production ($/cwt)</label><input type="number" step="0.01" style={inputStyle()} value={calc.cost??preset.cost} onChange={e=>setCalc({cost:e.target.value})} /></div>
          <div><label style={labelStyle}>Coverage level ({coverage}%)</label><input type="range" min={70} max={100} step={5} value={coverage} onChange={e=>setCalc({coverage:parseInt(e.target.value,10)})} style={{ width:"100%", marginTop:10 }} /></div>
        </div>
      </div>

      <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
        <div style={cardLblStyle()}>Price floor vs. cost of production</div>

        <div style={{ marginBottom:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:T.fgM, marginBottom:4 }}><span style={{ fontWeight:600 }}>Expected price</span><span>${price.toFixed(2)}/cwt</span></div>
          <div style={{ height:20, background:T.amber, borderRadius:4, width:`${barPct(price)}%` }} />
        </div>
        <div style={{ marginBottom:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:T.fgM, marginBottom:4 }}><span style={{ fontWeight:600 }}>Cost of production</span><span>${cost.toFixed(2)}/cwt</span></div>
          <div style={{ height:20, background:T.red, borderRadius:4, width:`${barPct(cost)}%` }} />
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11.5, color:T.fgM, marginBottom:4 }}><span style={{ fontWeight:600 }}>LRP floor at {coverage}% coverage</span><span>${floor.toFixed(2)}/cwt</span></div>
          <div style={{ height:20, background:T.blue, borderRadius:4, width:`${barPct(floor)}%` }} />
        </div>

        <div style={{ background:marginOverCost>=0?T.greenL:T.redL, borderRadius:8, padding:"14px 16px" }}>
          <div style={{ fontSize:13, fontWeight:700, color:marginOverCost>=0?T.dgreen:T.red, marginBottom:4 }}>Margin over cost at this floor</div>
          <div style={{ fontSize:12.5, color:marginOverCost>=0?"#2F6E28":T.redD, lineHeight:1.5 }}>
            {marginOverCost>=0
              ? `A ${coverage}% LRP floor of $${floor.toFixed(2)}/cwt sits $${marginOverCost.toFixed(2)}/cwt above your cost of production — in this market, LRP can lock in a margin, not just protect solvency. That's a different relationship than crop insurance often shows in a high-input-cost year.`
              : `A ${coverage}% LRP floor of $${floor.toFixed(2)}/cwt still falls $${Math.abs(marginOverCost).toFixed(2)}/cwt short of your cost of production — the floor limits how bad a price collapse can get, but doesn't guarantee covering full cost.`}
          </div>
        </div>
      </div>

      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Margin over cost by coverage level</div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${LIVESTOCK_COVERAGE_LEVELS.length},1fr)`, gap:6 }}>
          {LIVESTOCK_COVERAGE_LEVELS.map(cl => {
            const f = price*(cl/100); const m = f-cost; const isCurrent = cl===coverage;
            return (
              <div key={cl} onClick={()=>setCalc({coverage:cl})} style={{ cursor:"pointer", textAlign:"center", padding:"10px 4px", borderRadius:8, border:isCurrent?`2px solid ${T.blue}`:`1px solid ${T.border}`, background:isCurrent?T.blueL:"#fff" }}>
                <div style={{ fontSize:11, color:T.fgS, marginBottom:4 }}>{cl}%</div>
                <div style={{ fontSize:13, fontWeight:800, color:m>=0?T.dgreen:T.red }}>{m>=0?"+":"-"}${Math.abs(m).toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Flag type="warn">This is an educational planning tool, not a quote. LRP endorsement lengths, expected ending values, and actual coverage levels are set by RMA and confirmed with your livestock insurance agent — and vary by species, weight class, and endorsement period.</Flag>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD helpers
// ─────────────────────────────────────────────────────────────────────────────
// Each lever category is now built from specific, measurable items rather than one
// blanket rating. Every item is framed so a HIGHER value (0–100) always means MORE
// opportunity — i.e. "idle capacity" or "strength," not raw utilization — so scoring
// stays consistent without needing to invert any individual item.
// Internal keys (asset/trust/risk) are unchanged from earlier builds — every opportunity
// in OPPS has a fit:{asset,trust,risk} score, and the scoring engine keys off these exact
// names. Only the display labels and the items within each lever changed: "trust" now
// assesses Human Capital (labor, skills, management, succession) instead of relationship
// capital alone, and "risk" now assesses Financial Capital more explicitly, including
// access to credit. Renaming the underlying keys would mean touching all 24 opportunity
// definitions for no functional benefit — the fit scores already reasonably approximate
// "how much does this depend on people/expertise" (trust) vs. "how much does this depend
// on financial buffer" (risk), so they carry over cleanly under the new labels.
const ASSET_ITEMS = [
  { id:"land", label:"Underutilized or marginal acres", hint:"% of total acres not in full production use — field edges, marginal ground, or land not in your core rotation", default:10 },
  { id:"equipment", label:"Field equipment idle capacity", hint:"Estimated % below full annual utilization for tillage, planting, spraying, and harvest equipment — most farms run well under 60%", default:35 },
  { id:"truckingCap", label:"Trucking & hauling capacity", hint:"% of truck, trailer, and driver time available beyond your own hauling needs — separate from field equipment", default:20 },
  { id:"storageCap", label:"Excess grain/storage capacity", hint:"% of storage capacity beyond what your own production requires in a typical year", default:15 },
  { id:"facilities", label:"Underutilized buildings & facilities", hint:"% of barns, shops, or outbuilding space not in active daily use", default:20 },
];
const HUMAN_ITEMS = [
  { id:"laborCap", label:"Available labor capacity", hint:"% of family or hired labor time available beyond core operation needs, especially shoulder seasons", default:15 },
  { id:"management", label:"Management & decision-making experience", hint:"Years actively running or co-running the operation, including succession planning and delegation", default:35 },
  { id:"expertise", label:"Recognized skills or specialized expertise", hint:"Formal or informal recognition in a specific skill — agronomy, genetics, mechanics, marketing", default:25 },
  { id:"network", label:"Professional network & buyer relationships", hint:"Strength of existing relationships with buyers, cooperatives, processors, or a direct customer base", default:30 },
  { id:"succession", label:"Family or successor involvement", hint:"Active next-generation or partner involvement in daily decisions and operations", default:15 },
];
const FINANCIAL_ITEMS = [
  { id:"workingCapital", label:"Working capital position", hint:"Relative to peer benchmark (~$692/ac is top quartile for row crop operations)", default:40 },
  { id:"debtHeadroom", label:"Balance sheet headroom", hint:"Debt-to-asset cushion — higher score means less leveraged, more room to invest", default:45 },
  { id:"cashReserve", label:"Operating cash reserve", hint:"Months of operating expenses covered by cash reserves, higher is stronger", default:30 },
  { id:"creditAccess", label:"Access to credit", hint:"Strength of your lending relationship and unused borrowing capacity with your Farm Credit or bank", default:35 },
  { id:"existingDiversification", label:"Existing revenue diversification", hint:"How spread out current income already is across enterprises, buyers, or markets", default:20 },
];
const LEVER_ITEM_GROUPS = { asset:ASSET_ITEMS, trust:HUMAN_ITEMS, risk:FINANCIAL_ITEMS };
const LEVER_META = {
  asset: { label:"Assets", color:T.dgreen, desc:"Physical assets that could generate diversified income" },
  trust: { label:"Human Capital", color:T.tan, desc:"Labor, skills, management, and relationships that can be leveraged" },
  risk: { label:"Financial Capital", color:T.blue, desc:"Financial buffers and credit capacity that let the farm absorb startup risk" },
};


const leverCategoryScore = (items, category) => {
  const group = LEVER_ITEM_GROUPS[category] || [];
  if (group.length === 0) return 0;
  const sum = group.reduce((s,it) => s + (items[it.id] !== undefined ? Number(items[it.id]) : it.default), 0);
  return Math.round(sum / group.length);
};
const leverBucket = (score) => score >= 67 ? "strong" : score >= 34 ? "some" : "none";
const LEVER_BUCKET_LABEL = { strong:"Strong", some:"Some in place", none:"Limited" };
const leverScoreColor = (score) => score >= 67 ? T.dgreen : score >= 34 ? T.amber : T.red;

const leverPct = (items, k) => leverCategoryScore(items||{}, k);
const leverColor = (items, k) => leverScoreColor(leverPct(items, k));

// Derived from the four computed financial health categories rather than a manual
// self-rating. Falls back to a neutral 3.0 until enough financial data is entered.
const faScoreOf = (fa) => {
  const { hasData, categories } = computeFARatios(fa.s3vals);
  if (!hasData) return 3.0;
  const scored = (categories||[]).filter(c => c.status !== "blank");
  if (!scored.length) return 3.0;
  const vuln = scored.filter(c => c.status === "vuln").length;
  const strong = scored.filter(c => c.status === "strong").length;
  if (vuln >= 2) return 1.5;
  if (vuln === 1) return 2.5;
  if (strong >= 3) return 4.0;
  return 3.0;
};

// Stabilize / Optimize / Advance, keyed off the sustainable growth category.
// ─────────────────────────────────────────────────────────────────────────────
// LENDER OPPORTUNITIES — derived from the Financial Analysis module
// ─────────────────────────────────────────────────────────────────────────────
// Each rule reads a specific computed ratio and, when it trips, names a concrete
// conversation the lender is positioned to bring. Rules are ordered by urgency, and
// the signal that triggered each one is shown so nothing reads as a generic pitch.
const lenderOpportunities = (fa) => {
  const r = computeFARatios(fa.s3vals);
  if (!r.hasData) return [];
  const { dscr, currentRatio, debtToAsset, sgr, oer, assetTurnover, nfi, hasAccrualData } = r;
  const pct = (v) => Math.round(v) + "%";
  const x = (v) => v.toFixed(2) + "x";
  const out = [];

  if (nfi !== null && nfi < 0) out.push({ kind:"t", tag:"STABILIZE FIRST", title:"Net farm income is negative",
    body:"Depreciation and interest are eroding equity before any growth conversation is worth having. The near-term work is cash flow and cost structure, not new capital. Anything that adds debt service now compounds the problem.",
    signal:`Signal: net farm income at ${fmt$(nfi)}` });

  if (dscr !== null && dscr < 1.0) out.push({ kind:"t", tag:"TERM DEBT", title:"Debt service is not covered by operations",
    body:"Coverage below 1.0x means the operation is not generating enough to service its existing obligations. Restructuring amortization, or terming out a portion of the operating line, is the immediate lever available to the lender.",
    signal:`Signal: debt service coverage at ${x(dscr)}` });
  else if (dscr !== null && dscr < 1.25) out.push({ kind:"w", tag:"TERM DEBT", title:"Coverage is thin enough to revisit structure",
    body:"Coverage clears 1.0x but sits under the 1.25x comfort threshold, which leaves no room for a soft year. Better to review amortization terms before the next renewal than during it.",
    signal:`Signal: debt service coverage at ${x(dscr)}` });

  if (currentRatio !== null && currentRatio < 1.5) out.push({ kind:"w", tag:"WORKING CAPITAL", title:"Short-term position is tight going into the season",
    body:"The operation is carrying limited cushion against current obligations. Right-sizing the operating line, or converting a portion of current debt to term, protects the season without changing the underlying business.",
    signal:`Signal: current ratio at ${x(currentRatio)}` });

  if (currentRatio !== null && currentRatio >= 2.0 && sgr !== null && sgr < 5) out.push({ kind:"o", tag:"CAPITAL DEPLOYMENT", title:"Liquidity is strong while equity growth has stalled",
    body:"The operation holds more short-term capital than it currently needs while the balance sheet is not compounding. That is a conversation about where the capital should go: a term investment, a revenue-generating asset, or a diversification path the Revenue Diversification module can rank against this farm's own capacity.",
    signal:`Signal: current ratio ${x(currentRatio)} against a sustainable growth rate of ${pct(sgr)}` });

  if (sgr !== null && sgr < 0) out.push({ kind:"t", tag:"EQUITY", title:"The operation is not retaining enough to fund its own growth",
    body:"After family living and taxes, earnings are not adding to net worth. Growth from here is debt-funded unless margin or withdrawals change. Worth modelling what withdrawal level or margin improvement returns the operation to positive retention.",
    signal:`Signal: sustainable growth rate at ${pct(sgr)}` });

  if (debtToAsset !== null && debtToAsset < 30) out.push({ kind:"o", tag:"BORROWING CAPACITY", title:"Unused balance sheet capacity",
    body:"Leverage sits well below the point where it constrains decisions. If the operation has an expansion, land, or facility opportunity worth taking, the balance sheet can support it. The constraint here is cash flow, not equity.",
    signal:`Signal: debt-to-asset ratio at ${pct(debtToAsset)}` });

  if (debtToAsset !== null && debtToAsset > 60) out.push({ kind:"t", tag:"LEVERAGE", title:"Leverage is limiting what the operation can do next",
    body:"At this level, further borrowing narrows rather than widens the options. The productive conversation is which assets are carrying their debt and which are not, and whether any of them should be sold or restructured.",
    signal:`Signal: debt-to-asset ratio at ${pct(debtToAsset)}` });

  if (oer !== null && oer >= 65 && oer <= 80) out.push({ kind:"w", tag:"COST STRUCTURE", title:"Operating costs are consuming most of revenue",
    body:"Above the strong threshold but not yet critical. This is the window where input financing terms, prepay timing, and enterprise-level cost visibility still change the outcome. Financial Analysis breaks the cost side out per acre.",
    signal:`Signal: operating expense ratio at ${pct(oer)}` });
  else if (oer !== null && oer > 80) out.push({ kind:"t", tag:"COST STRUCTURE", title:"Operating costs leave almost nothing to work with",
    body:"More than eighty cents of every revenue dollar is consumed before depreciation and interest. Financing structure cannot fix a cost problem of this size, but it can buy time while the cost side is addressed.",
    signal:`Signal: operating expense ratio at ${pct(oer)}` });

  if (assetTurnover !== null && assetTurnover < 20) out.push({ kind:"o", tag:"ASSET UTILISATION", title:"A large asset base relative to the revenue it produces",
    body:"Common for land-heavy operations and not automatically a problem, but worth understanding. Options include putting idle capacity to work through custom services, or reviewing whether every asset still earns its place on the balance sheet.",
    signal:`Signal: asset turnover ratio at ${pct(assetTurnover)}` });

  if (hasAccrualData) out.push({ kind:"o", tag:"ACCRUAL VIEW", title:"Accrual-adjusted numbers are available for this operation",
    body:"Most farm credit files rely on cash-basis tax figures, which move income between years. This operation has entered the balance sheet detail needed for an accrual-adjusted view, which is the same basis FINBIN and peer benchmarks use. Worth using it in the credit narrative.",
    signal:"Signal: accrual adjustments entered in Financial Analysis" });

  return out;
};

const faTierOf = (fa) => {
  const { hasData, categories } = computeFARatios(fa.s3vals);
  if (!hasData) return "Optimize";
  const g = (categories||[]).find(c => c.id === "growth");
  if (!g || g.status === "blank") return "Optimize";
  return g.status === "vuln" ? "Stabilize" : g.status === "strong" ? "Advance" : "Optimize";
};
const HIGH_CAP_OPPS = ["processing","demolition","manure","eventRental"];
const PASSIVE_TIME_OPPS = ["energy","carbon","envServices","storage"];

// Embeds Financial Analysis directly into the Revenue Diversification optimization
// logic. Two signals derived from Stage 3's actual computed ratios (via the shared
// computeFARatios engine) adjust scoring on top of the existing lever/capital/time/size
// logic: financial distress (weak DSCR or negative net farm income) shifts scoring toward
// low-capital, low-effort, high-liquidity paths and away from high-capital ones; financial
// strength (healthy DSCR and OER) modestly favors higher-capital, higher-growth-tier paths.
const faFinancialSignal = (faS3vals) => {
  const { hasData, dscr, nfi, oer } = computeFARatios(faS3vals);
  const distress = hasData && ((dscr!==null && dscr<1.0) || (nfi!==null && nfi<0));
  const strong = hasData && dscr!==null && dscr>=1.25 && oer!==null && oer<70;
  return { hasData, distress, strong };
};

const scoredOpps = (rd, faEnterprises, faS3vals) => { const d=rd.data||{}; const g=d.goals2||{}; const b=d.baseline||{}; const capMap={zero:0,low:10000,medium:50000,high:200000}; const capLimit=capMap[g.capitalAppetite]!==undefined?capMap[g.capitalAppetite]:200000; const items=d.leverItems||{};
  const sizeBucket = sizeBucketFromTier(b.revTier);
  const { distress: faDistress, strong: faStrong } = faFinancialSignal(faS3vals);
  const enterprises = faEnterprises || [];
  const faEnt = enterprises[0] || "";
  return OPPS.map(o => { const a=o.fit.asset/100*leverPct(items,"asset"), t=o.fit.trust/100*leverPct(items,"trust"), r=o.fit.risk/100*leverPct(items,"risk"); let leverMatch=(a+t+r)/3;
    const capOk = HIGH_CAP_OPPS.includes(o.id) ? (capLimit>=20000) : (capLimit>=5000 || PASSIVE_TIME_OPPS.includes(o.id) || o.id==="consulting" || o.id==="dataAdvisory");
    const timeOk = g.timeAppetite!=="minimal" || PASSIVE_TIME_OPPS.includes(o.id);
    const sizeMatch = !sizeBucket || !o.sizeFit ? true : o.sizeFit.includes(sizeBucket);
    const entMatch = !o.entSpecific || o.entSpecific===faEnt;
    // entExclude: for "add a new enterprise you don't already run" opportunities — suppress
    // if the farmer already operates any of the excluded enterprises. entRelevant: modest
    // boost if the farmer runs an enterprise this opportunity is a natural complement to.
    const isExcluded = o.entExclude && o.entExclude.some(e => enterprises.includes(e));
    const isRelevant = o.entRelevant && o.entRelevant.some(e => enterprises.includes(e));
    if (sizeMatch) leverMatch = leverMatch * 1.15; // modest boost for farms this opportunity typically suits
    if (o.entSpecific && !entMatch) leverMatch = leverMatch * 0.15; // heavily suppress enterprise-specific paths that don't apply
    if (isRelevant) leverMatch = leverMatch * 1.2; // boost — this complements an enterprise the farm already runs
    if (isExcluded) leverMatch = leverMatch * 0.2; // heavily suppress — this isn't diversification if you already run it

    // Financial-health adjustment, embedded directly from FA Stage 3's ratios
    let faAdj = 1;
    const lowFriction = (o.effort||3)<=2 || (o.liquidity||3)>=4 || PASSIVE_TIME_OPPS.includes(o.id);
    if (faDistress) faAdj = lowFriction ? 1.25 : (HIGH_CAP_OPPS.includes(o.id) ? 0.4 : 0.85);
    else if (faStrong) faAdj = (HIGH_CAP_OPPS.includes(o.id) || o.growthTier===2) ? 1.15 : 1;

    return { ...o, leverMatch:Math.round(Math.min(100,leverMatch)), capOk, timeOk, sizeMatch, entMatch, isRelevant, isExcluded, faAdj, score:leverMatch*(capOk?1:0.3)*(timeOk?1:0.7)*(entMatch?1:0.1)*faAdj }; }).sort((a,b)=>b.score-a.score); };

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 1 — Baseline & readiness
// ─────────────────────────────────────────────────────────────────────────────
function RD1({ rd, setRData, fa }) {
  const d = rd.data; const b = d.baseline || {};
  const set = (f,v) => setRData(s => ({ ...s, baseline:{ ...(s.baseline||{}), [f]:v } }));
  const faEnt = (fa.enterprises||[])[0] || ""; const faEnt2 = { grain:"Row crop (grain)", dairy:"Dairy", beef:"Beef cattle" }[faEnt] || "";
  const sc = faScoreOf(fa); const mfp = parseFloat(b.mfpScore) || sc; const rf = mfp>=3.5?"ready":mfp>=2.5?"caution":"foundation"; const rl = { ready:"Ready to diversify", caution:"Diversify with caution", foundation:"Foundation first" }[rf];
  const FARM=["Row crop (grain)","Dairy","Beef cattle","Hogs","Broilers","Layers","Mixed"], TIERS=["< $500K","$500K – $2M","$2M – $5M","$5M+"], STAGES=["Establishment (0–3 yrs)","Growth (3–7 yrs)","Consolidation (7–15 yrs)","Transition (15+ yrs / succession)"];
  const SelField = ({ label, k, opts, val }) => (<div><label style={labelStyle}>{label}</label><select style={inputStyle()} value={val} onChange={e=>set(k,e.target.value)}><option value="">Select</option>{opts.map(t=><option key={t} value={t}>{t}</option>)}</select></div>);
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 1" title="Baseline & readiness" sub="Your farm profile from the Financial Analysis module carries over automatically. Review and confirm below." />
      <FinancialHealthStrip fa={fa} />
      {faEnt && (<div style={{ background:T.waterL, color:"#0A6E8C", borderRadius:8, padding:"11px 14px", fontSize:12.5, display:"flex", alignItems:"flex-start", gap:9, marginBottom:16, lineHeight:1.5 }}><Fic type="link" /><span>Financial Analysis carried over — enterprise <b>{faEnt2||faEnt}</b> · financial-health score <b>{sc.toFixed(1)}/5</b> · readiness <b>{rl}</b></span></div>)}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Farm profile — confirm or update</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <SelField label="Farm type" k="farmType" opts={FARM} val={b.farmType||faEnt2||""} />
          <SelField label="Revenue tier" k="revTier" opts={TIERS} val={b.revTier||""} />
          <SelField label="Business stage" k="bizStage" opts={STAGES} val={b.bizStage||""} />
          <SelField label="Market orientation" k="market" opts={["Commodity / price-taker","Partially differentiated","Direct market / value-added"]} val={b.market||""} />
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}>MFP financial-health score</div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}><input type="number" style={inputStyle({ width:88 })} min={1} max={5} step={0.1} value={b.mfpScore||sc} onChange={e=>set("mfpScore",e.target.value)} /><span style={{ fontSize:13, color:T.fgS }}>out of 5.0</span></div>
          <span style={pillStyle(rf)}>{rl}</span>
          {rf==="foundation" && <div style={{ marginTop:12 }}><Flag type="danger">Foundation-first path. Strengthen core financials before diversification investment.</Flag></div>}
        </div>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}>SWOT signals</div>
          <textarea style={inputStyle({ minHeight:96, resize:"vertical", lineHeight:1.5 })} placeholder="Note strengths, weaknesses, opportunities or threats. e.g. 'Strong equipment base. Neighbor asked about custom spraying.'" value={b.swot||""} onChange={e=>set("swot",e.target.value)} />
        </div>
      </div>
      <PeerIncomeBenchmark revTier={b.revTier} bizStage={b.bizStage} />
    </div>
  );
}

// Household income mix by farm size category — USDA ERS EIB-101 / Multi-Enterprising
// Farm Households pattern. Helps a farmer see how much of household income peers like
// them typically draw from farm business vs. wages vs. nonfarm business vs. transfers.
const INCOME_BENCHMARK = [
  { label:"Residence farm", sub:"Small; operator's main job is off-farm", farm:"5–10%", wages:"55–65%", nonfarm:"10–15%", transfers:"15–25%", tiers:["< $500K"] },
  { label:"Intermediate farm", sub:"Small; farming is the primary occupation", farm:"15–25%", wages:"45–55%", nonfarm:"10–15%", transfers:"15–20%", tiers:["< $500K","$500K – $2M"] },
  { label:"Commercial family farm", sub:"≥ $350K gross cash income", farm:"55–70%", wages:"15–25%", nonfarm:"5–10%", transfers:"10–15%", tiers:["$500K – $2M","$2M – $5M"] },
  { label:"Large-scale family farm", sub:"≥ $1M gross cash income", farm:"70–85%", wages:"5–15%", nonfarm:"5–10%", transfers:"5–10%", tiers:["$2M – $5M","$5M+"] },
];
function PeerIncomeBenchmark({ revTier }) {
  const match = INCOME_BENCHMARK.filter(row => !revTier || row.tiers.includes(revTier));
  const highlight = revTier ? INCOME_BENCHMARK.find(row => row.tiers.includes(revTier)) : null;
  return (
    <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
      <div style={cardLblStyle()}>How similar farms split household income</div>
      <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>USDA ERS research on multi-enterprising farm households. Roughly 8–12% of total household income for commercial and intermediate farms comes from alternative business ventures off the farm — this is the pool your diversification plan is drawing from.</div>
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr 1fr 1fr 1fr", gap:6, background:T.bgAlt, borderRadius:6, padding:"8px 12px", marginBottom:4 }}>
        {["Farm category","Farm business","Wages/salary","Nonfarm business","Transfers/other"].map((h,i) => (<div key={i} style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.04em", textAlign:i===0?"left":"center" }}>{h}</div>))}
      </div>
      {INCOME_BENCHMARK.map((row,i) => {
        const isHighlight = highlight && row.label===highlight.label;
        return (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr 1fr 1fr 1fr", gap:6, padding:"10px 12px", borderBottom:`1px solid ${T.div}`, alignItems:"center", background:isHighlight?T.greenL:"transparent", borderRadius:isHighlight?6:0 }}>
            <div><div style={{ fontSize:12.5, fontWeight:600, color:T.navy }}>{row.label}</div><div style={{ fontSize:10.5, color:T.fgS }}>{row.sub}</div></div>
            <div style={{ fontSize:12.5, textAlign:"center", fontWeight:isHighlight?700:400 }}>{row.farm}</div>
            <div style={{ fontSize:12.5, textAlign:"center", fontWeight:isHighlight?700:400 }}>{row.wages}</div>
            <div style={{ fontSize:12.5, textAlign:"center", fontWeight:isHighlight?700:400, color:isHighlight?T.dgreen:T.navy }}>{row.nonfarm}</div>
            <div style={{ fontSize:12.5, textAlign:"center", fontWeight:isHighlight?700:400 }}>{row.transfers}</div>
          </div>
        );
      })}
      {highlight && <div style={{ marginTop:12 }}><Flag type="info">Farms in your revenue tier typically draw <b>{highlight.nonfarm}</b> of household income from nonfarm business ventures. Use this as a rough target as you weigh how much diversification makes sense for your operation.</Flag></div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 2 — Goal alignment
// ─────────────────────────────────────────────────────────────────────────────
function RD2({ rd, setRData }) {
  const g = rd.data.goals2 || {};
  const set = (f,v) => setRData(s => ({ ...s, goals2:{ ...(s.goals2||{}), [f]:v } }));
  const Qs = [
    { key:"trigger", title:"What is prompting you to think about diversification?", opts:[["income","Add a new income stream","Grow total revenue beyond the primary commodity"],["risk","Reduce commodity price dependence","One bad year in grain or milk prices is too much exposure"],["assets","Put underutilized assets to work","Land, equipment or facilities that could generate more"],["succession","Build something to pass on","Diversification as part of a legacy and transition plan"],["curiosity","Understand my options first","No specific trigger — want to see what's possible"]] },
    { key:"horizon", title:"What time horizon are you planning for?", opts:[["1yr","First revenue within 12 months","Need results quickly"],["3yr","Building toward a 3-year plan","Willing to invest in groundwork now"],["5yr","Long-term structural change","A fundamental shift in how the farm generates income"]] },
    { key:"capitalAppetite", title:"How much capital are you willing to invest?", opts:[["zero","$0 — no-capital paths only","Revenue from existing assets only"],["low","Under $10K","Small pilot investment"],["medium","$10K–$50K","Moderate investment if the return case is clear"],["high","$50K+","Meaningful investment for the right opportunity"]] },
    { key:"timeAppetite", title:"How much personal time can you commit?", opts:[["minimal","Less than 5 hours/week","Largely passive or handled by existing labor"],["moderate","5–15 hours/week","Can add a side activity without sacrificing core operations"],["significant","15+ hours/week","Willing to restructure around a new primary activity"]] },
  ];
  const Radio = ({ on }) => <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${on?T.blue:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{on && <div style={{ width:8, height:8, borderRadius:"50%", background:T.blue }} />}</div>;
  const optSty = (on) => ({ padding:"13px 15px", borderRadius:8, border:on?`2px solid ${T.blue}`:`1px solid ${T.border}`, cursor:"pointer", background:on?T.blueL:"#fff", marginBottom:8, transition:"all .12s" });
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 2" title="Goal alignment" sub="These answers shape which opportunities surface and how aggressively they are prioritized." />
      {Qs.map(q => (
        <div key={q.key} style={cardStyle()}>
          <div style={cardLblStyle()}>{q.title}</div>
          {q.opts.map(([val,title,desc]) => (
            <div key={val} style={optSty(g[q.key]===val)} onClick={()=>set(q.key,val)}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><Radio on={g[q.key]===val} /><div><div style={{ fontSize:13.5, fontWeight:600, color:g[q.key]===val?T.blue:T.navy, marginBottom:1 }}>{title}</div><div style={{ fontSize:11.5, color:T.fgS, lineHeight:1.4 }}>{desc}</div></div></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 3 — Human capital, assets & financial capital
// ─────────────────────────────────────────────────────────────────────────────
function RD3({ rd, setRData }) {
  const items = rd.data.leverItems || {};
  const setItem = (id,v) => setRData(s => ({ ...s, leverItems:{ ...(s.leverItems||{}), [id]:v } }));
  const touched = Object.keys(items).length > 0;
  const scores = { asset:leverCategoryScore(items,"asset"), trust:leverCategoryScore(items,"trust"), risk:leverCategoryScore(items,"risk") };
  const allWeak = Object.values(scores).every(s => s < 34);
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 3" title="Human capital, assets & financial capital" sub="Rate specific, measurable items across the three resources that determine which diversification paths are actually realistic for your operation — not just what sounds appealing." />
      {["asset","trust","risk"].map(cat => {
        const meta = LEVER_META[cat]; const group = LEVER_ITEM_GROUPS[cat]; const score = scores[cat];
        return (
          <div key={cat} style={cardStyle()}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, gap:12, flexWrap:"wrap" }}>
              <div><div style={{ fontSize:17, fontWeight:700, marginBottom:2 }}>{meta.label}</div><div style={{ fontSize:12.5, color:T.fgM }}>{meta.desc}</div></div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:22, fontWeight:800, color:leverScoreColor(score) }}>{score}%</div>
                <div style={{ fontSize:11, fontWeight:600, color:leverScoreColor(score) }}>{LEVER_BUCKET_LABEL[leverBucket(score)]}</div>
              </div>
            </div>
            {group.map(it => {
              const val = items[it.id] !== undefined ? Number(items[it.id]) : it.default;
              return (
                <div key={it.id} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:2 }}>
                    <label style={{ fontSize:12.5, fontWeight:600, color:T.navy }}>{it.label}</label>
                    <span style={{ fontSize:13, fontWeight:700, color:meta.color }}>{val}%</span>
                  </div>
                  <div style={{ fontSize:10.5, color:T.fgS, marginBottom:6, fontStyle:"italic" }}>{it.hint}</div>
                  <input type="range" min={0} max={100} step={5} value={val} onChange={e=>setItem(it.id, parseInt(e.target.value,10))} style={{ width:"100%" }} />
                </div>
              );
            })}
            <div style={{ height:6, background:T.div, borderRadius:3, overflow:"hidden", marginTop:4 }}><div style={{ height:"100%", width:`${score}%`, background:meta.color, borderRadius:3, transition:"width .3s" }} /></div>
          </div>
        );
      })}
      {allWeak && touched && <Flag type="danger">All three levers score below 34% — only zero-capital, passive paths are appropriate until at least one lever is strengthened.</Flag>}
      {!allWeak && touched && (
        <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
          <div style={cardLblStyle()}>Your three-lever profile</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {["asset","trust","risk"].map(cat => {
              const meta = LEVER_META[cat]; const score = scores[cat];
              return (
                <div key={cat} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:T.fgS, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>{meta.label}</div>
                  <div style={{ height:64, background:T.bgAlt, borderRadius:6, overflow:"hidden", display:"flex", alignItems:"flex-end" }}><div style={{ width:"100%", height:`${score}%`, background:meta.color, transition:"height .5s" }} /></div>
                  <div style={{ fontSize:11.5, marginTop:7, color:meta.color, fontWeight:700 }}>{score}% · {LEVER_BUCKET_LABEL[leverBucket(score)]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 4 — Opportunity mapping
// ─────────────────────────────────────────────────────────────────────────────
const GROWTH_TIER_LABEL = { 1:"Tier 1 · Fastest structural growth", 2:"Tier 2 · Strong growth", 3:"Tier 3 · Steady & selective" };
const GROWTH_TIER_COLOR = { 1:T.dgreen, 2:T.blue, 3:T.tan };

function RD4({ rd, setRData, fa }) {
  const d = rd.data; const selected = d.selectedOpps || []; const lev = d.leverItems || {}; const b = d.baseline || {};
  const [clusterFilter, setClusterFilter] = useState("all");
  const toggle = (id) => setRData(s => { const cur=s.selectedOpps||[]; return { ...s, selectedOpps: cur.includes(id)?cur.filter(x=>x!==id):[...cur,id] }; });
  const allOpps = scoredOpps(rd, fa.enterprises||[], fa.s3vals);
  const opps = clusterFilter==="all" ? allOpps : allOpps.filter(o=>o.cluster===clusterFilter);
  const sizeBucket = sizeBucketFromTier(b.revTier);
  const faSignal = faFinancialSignal(fa.s3vals);
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 4" title="Opportunity mapping" sub="Ranked by fit with your three-lever profile, farm size, and goals. Select your top 2–3 to carry into the barrier and scenario stages." />
      {faSignal.distress && (
        <Flag type="warn">Your Financial Analysis shows financial strain (weak debt service coverage or negative net farm income) — this ranking now favors low-capital, low-effort, high-liquidity paths and pulls back higher-capital ones like processing or demolition. Stabilize the core operation before committing new capital.</Flag>
      )}
      {faSignal.strong && (
        <Flag type="ok">Your Financial Analysis shows solid debt service coverage and a healthy operating expense ratio — this ranking gives a modest boost to higher-capital, faster-growth paths, since your core operation has room to support them.</Flag>
      )}
      <div style={{ background:"#FAF6EC", border:`1px solid ${T.silver}`, borderRadius:10, padding:"14px 18px", marginBottom:16 }}>
        <div style={cardLblStyle()}>Your lever inputs</div>
        <div style={{ display:"flex", gap:26, flexWrap:"wrap" }}>
          {["asset","trust","risk"].map(k => (
            <div key={k} style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:90, fontSize:12, fontWeight:600, color:T.fgM }}>{({asset:"Assets",trust:"Human",risk:"Financial"})[k]}</div>
              <div style={{ width:80, height:6, background:T.div, borderRadius:3, overflow:"hidden" }}><div style={{ height:"100%", width:`${leverPct(lev,k)}%`, background:leverColor(lev,k), borderRadius:3 }} /></div>
              <span style={{ fontSize:11.5, fontWeight:700, color:leverColor(lev,k) }}>{leverPct(lev,k)}%</span>
            </div>
          ))}
          {sizeBucket && <div style={{ display:"flex", alignItems:"center", gap:7, marginLeft:"auto" }}><span style={{ fontSize:11.5, color:T.fgM }}>Farm size:</span><span style={pillStyle("info")}>{sizeBucket} operation</span></div>}
        </div>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
        <button onClick={()=>setClusterFilter("all")} style={{ padding:"6px 13px", borderRadius:999, border:`1.5px solid ${clusterFilter==="all"?T.blue:T.border}`, cursor:"pointer", fontSize:11.5, fontWeight:600, background:clusterFilter==="all"?T.blue:"#fff", color:clusterFilter==="all"?"#fff":T.fgM }}>All clusters ({allOpps.length})</button>
        {CLUSTERS.map(c => {
          const count = allOpps.filter(o=>o.cluster===c.id).length;
          const on = clusterFilter===c.id;
          return (<button key={c.id} onClick={()=>setClusterFilter(c.id)} title={c.note} style={{ padding:"6px 13px", borderRadius:999, border:`1.5px solid ${on?T.blue:T.border}`, cursor:"pointer", fontSize:11.5, fontWeight:600, background:on?T.blue:"#fff", color:on?"#fff":T.fgM }}>{c.id} ({count})</button>);
        })}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {opps.map(o => {
          const isSel = selected.includes(o.id); const fl = o.leverMatch>=60?"ready":o.leverMatch>=35?"caution":"foundation"; const fLabel = { ready:"Strong fit", caution:"Moderate fit", foundation:"Weak fit" }[fl];
          const dimmed = (o.entSpecific && !o.entMatch) || o.isExcluded;
          return (
            <div key={o.id} onClick={()=>toggle(o.id)} style={{ background:"#fff", border:isSel?`2px solid ${T.blue}`:`1px solid ${T.border}`, borderRadius:10, padding:18, cursor:"pointer", transition:"all .15s", opacity:dimmed?0.5:(o.capOk?1:0.75), boxShadow:isSel?"0 1px 3px rgba(14,28,57,.08)":"none" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6, gap:8 }}>
                <div><div style={{ fontSize:16, fontWeight:700, color:isSel?T.blue:T.navy, lineHeight:1.15 }}>{o.label}</div><div style={{ fontSize:10, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:3, fontWeight:600 }}>{o.cluster}</div></div>
                <span style={pillStyle(fl)}>{fLabel}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                <span style={{ fontSize:10, fontWeight:700, color:GROWTH_TIER_COLOR[o.growthTier] }}>● {GROWTH_TIER_LABEL[o.growthTier]}</span>
                {o.sizeFit && sizeBucket && o.sizeFit.includes(sizeBucket) && <span style={{ fontSize:10, fontWeight:700, color:T.dgreen }}>· Good fit for your farm size</span>}
                {dimmed && !o.isExcluded && <span style={{ fontSize:10, fontWeight:700, color:T.red }}>· Requires {o.entSpecific} enterprise</span>}
                {o.isExcluded && <span style={{ fontSize:10, fontWeight:700, color:T.red }}>· You already run this enterprise</span>}
                {o.isRelevant && <span style={{ fontSize:10, fontWeight:700, color:T.dgreen }}>· Complements your current enterprise</span>}
                {o.policyPrograms && <span style={{ fontSize:10, fontWeight:700, color:"#4338CA" }}>· Policy/grant program available</span>}
              </div>
              <div style={{ fontSize:12.5, color:T.fgM, lineHeight:1.5, marginBottom:12 }}>{o.desc}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}><div style={{ fontSize:11.5, color:T.fgM }}><span style={{ fontWeight:600 }}>Time to revenue: </span>{o.time}</div><div style={{ fontSize:11.5, color:T.fgM }}><span style={{ fontWeight:600 }}>Capital: </span>{o.capital}</div></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                <div style={{ fontSize:11.5, color:T.fgM, display:"flex", alignItems:"center", gap:5 }}><span style={{ fontWeight:600 }}>Regulatory load:</span>{[1,2,3,4,5].map(n=>(<span key={n} style={{ width:6, height:6, borderRadius:"50%", background:n<=o.reg?T.red:T.div, display:"inline-block" }}/>))}</div>
                <div style={{ fontSize:11.5, color:T.fgM, display:"flex", alignItems:"center", gap:5 }}><span style={{ fontWeight:600 }}>Season conflict:</span>{[1,2,3,4,5].map(n=>(<span key={n} style={{ width:6, height:6, borderRadius:"50%", background:n<=o.seasonal?T.amber:T.div, display:"inline-block" }}/>))}</div>
              </div>
              <div>
                <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Lever fit</div>
                {[["asset","Assets",T.dgreen],["trust","Human",T.tan],["risk","Financial",T.blue]].map(([k,label,color]) => {
                  const actual = Math.round(o.fit[k]/100*leverPct(lev,k));
                  return (
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:10.5, color:T.fgS, width:42 }}>{label}</span>
                      <div style={{ flex:1, height:5, background:T.div, borderRadius:3, position:"relative" }}><div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${o.fit[k]}%`, background:color, opacity:0.22, borderRadius:3 }} /><div style={{ position:"absolute", top:0, left:0, height:"100%", width:`${actual}%`, background:color, borderRadius:3 }} /></div>
                      <span style={{ fontSize:10.5, color, fontWeight:700, width:30, textAlign:"right" }}>{actual}%</span>
                    </div>
                  );
                })}
              </div>
              {isSel && <div style={{ marginTop:10, fontSize:11.5, fontWeight:700, color:T.blue, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}><IconCheckSm color={T.blue} size={13} />Selected</div>}
            </div>
          );
        })}
      </div>
      {selected.length>0 && (<div style={{ marginTop:16 }}><Flag type="ok">{selected.length} path{selected.length>1?"s":""} selected: {selected.map(id=>{const o=OPPS.find(x=>x.id===id);return o&&o.label;}).filter(Boolean).join(", ")}.</Flag></div>)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 5 — Barrier identification
// ─────────────────────────────────────────────────────────────────────────────
// Cross-cutting regulatory & compliance checklist — surfaces for any selected path with
// meaningful regulatory load (reg >= 3), independent of that path's specific barrier list.
const COMPLIANCE_ITEMS = {
  entity: "Confirm whether this venture needs its own legal entity (LLC) separate from the core farm, to contain liability.",
  insurance: "Review your farm liability policy — most diversification paths need an endorsement or a standalone policy, not just your existing coverage.",
  zoning: "Check local zoning and land-use rules before committing capital — some ventures (events, processing, demolition) need permits your county may not grant by default.",
  licensing: "Identify any state or federal licensing requirements (food safety, DOT authority, environmental permits) and their lead time.",
  insuranceGap: "Confirm whether standard crop insurance and farm safety-net programs still apply once you diversify — several programs have limited coverage for non-standard operations.",
};
function RD5({ rd, setRData }) {
  const d = rd.data; const selected = d.selectedOpps || []; const acked = d.barriersAcked || {}; const complianceAcked = d.complianceAcked || {};
  const ack = (id,i) => setRData(s => { const key=`${id}_${i}`; return { ...s, barriersAcked:{ ...(s.barriersAcked||{}), [key]:!(s.barriersAcked||{})[key] } }; });
  const ackCompliance = (key) => setRData(s => ({ ...s, complianceAcked:{ ...(s.complianceAcked||{}), [key]:!(s.complianceAcked||{})[key] } }));
  const sel = selected.map(id => OPPS.find(o=>o.id===id)).filter(Boolean);
  const maxReg = sel.length ? Math.max(...sel.map(o=>o.reg||1)) : 0;
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 5" title="Barrier & compliance review" sub="Known barriers and regulatory considerations for each selected path. Check each one to confirm you've reviewed it before proceeding." />
      {selected.length===0 && <Flag type="warn">No opportunities selected. Go back to Stage 4.</Flag>}
      {maxReg>=3 && (
        <div style={cardStyle({ borderTop:`4px solid ${T.amber}` })}>
          <div style={cardLblStyle()}><Apex color={T.amber} />Regulatory & compliance review — before you commit capital</div>
          <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12, lineHeight:1.5 }}>At least one selected path carries meaningful regulatory load. Review these before signing contracts, leases, or making capital purchases.</div>
          {Object.entries(COMPLIANCE_ITEMS).map(([key,text]) => {
            const on = complianceAcked[key];
            return (
              <div key={key} onClick={()=>ackCompliance(key)} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"10px 0", borderBottom:`1px solid ${T.div}`, cursor:"pointer", opacity:on?0.6:1 }}>
                <div style={{ width:19, height:19, borderRadius:4, border:`1.5px solid ${on?T.amber:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, background:on?T.amber:"#fff", transition:"all .12s" }}>{on && <IconCheckSm />}</div>
                <span style={{ fontSize:12.5, color:on?T.fgS:T.navy, lineHeight:1.5, textDecoration:on?"line-through":"none" }}>{text}</span>
              </div>
            );
          })}
        </div>
      )}
      {sel.map(o => {
        const barriers = BARRIERS[o.id] || []; const allAck = barriers.every((_,i)=>acked[`${o.id}_${i}`]);
        return (
          <div key={o.id} style={cardStyle(allAck?{borderTop:`4px solid ${T.green}`}:{})}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
              <div style={{ fontSize:16, fontWeight:700 }}>{o.label}</div>
              {o.reg>=4 && <span style={pillStyle("vuln")}>High regulatory load</span>}
              {allAck && <span style={pillStyle("ready")}>All reviewed</span>}
            </div>
            {barriers.map((bar,i) => {
              const on = acked[`${o.id}_${i}`];
              return (
                <div key={i} onClick={()=>ack(o.id,i)} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"11px 0", borderBottom:i<barriers.length-1?`1px solid ${T.div}`:"none", cursor:"pointer", opacity:on?0.6:1 }}>
                  <div style={{ width:19, height:19, borderRadius:4, border:`1.5px solid ${on?T.dgreen:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, background:on?T.dgreen:"#fff", transition:"all .12s" }}>{on && <IconCheckSm />}</div>
                  <span style={{ fontSize:12.5, color:on?T.fgS:T.navy, lineHeight:1.5, textDecoration:on?"line-through":"none" }}>{bar}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 6 — Policy & grant enablers
// ─────────────────────────────────────────────────────────────────────────────
// Deliberately mirrors Barrier Identification's structure — same per-opportunity card
// layout, same checkbox-to-acknowledge pattern — but framed as tailwinds rather than
// obstacles: policy and grant programs that could actively support a selected path,
// not risks to plan around. Kept as its own stage rather than buried in the Action
// Plan, since knowing about a relevant program is a decision input, not an afterthought.
function RDPolicyEnablers({ rd, setRData }) {
  const d = rd.data; const selected = d.selectedOpps || []; const acked = d.policyAcked || {};
  const ack = (id,i) => setRData(s => { const key=`${id}_${i}`; return { ...s, policyAcked:{ ...(s.policyAcked||{}), [key]:!(s.policyAcked||{})[key] } }; });
  const sel = selected.map(id => OPPS.find(o=>o.id===id)).filter(Boolean);
  const selWithPrograms = sel.filter(o => o.policyPrograms && o.policyPrograms.length>0);
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 6" title="Policy & grant enablers" sub="Federal and state programs that could actively support your selected paths — grants, cost-share, and pending legislation worth tracking. Check each one to confirm you've reviewed it." />
      {selected.length===0 && <Flag type="warn">No opportunities selected. Go back to Stage 4.</Flag>}
      {selected.length>0 && selWithPrograms.length>0 && (
        <Flag type="warn">Program details reflect their status as of mid-2026 and are a starting point, not a guarantee — federal farm program funding, eligibility, and enrollment windows change often, and the current Farm Bill remains unresolved. Confirm current status with your local FSA/NRCS office, your Farm Credit advisor, or grants.gov before building a plan around any of them.</Flag>
      )}
      {selected.length>0 && selWithPrograms.length===0 && (
        <Flag type="info">No specific federal or state programs are currently mapped to your selected paths. That doesn't mean none exist — check with your local FSA/NRCS office or Farm Credit advisor, since program availability shifts by state and county.</Flag>
      )}
      {selWithPrograms.map(o => {
        const programs = o.policyPrograms || []; const allAck = programs.every((_,i)=>acked[`${o.id}_${i}`]);
        return (
          <div key={o.id} style={cardStyle(allAck?{borderTop:`4px solid ${T.green}`}:{ borderTop:`4px solid #4338CA` })}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
              <div style={{ fontSize:16, fontWeight:700 }}>{o.label}</div>
              {allAck && <span style={pillStyle("ready")}>All reviewed</span>}
            </div>
            {programs.map((p,i) => {
              const on = acked[`${o.id}_${i}`];
              return (
                <div key={i} onClick={()=>ack(o.id,i)} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"11px 0", borderBottom:i<programs.length-1?`1px solid ${T.div}`:"none", cursor:"pointer", opacity:on?0.6:1 }}>
                  <div style={{ width:19, height:19, borderRadius:4, border:`1.5px solid ${on?"#4338CA":T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, background:on?"#4338CA":"#fff", transition:"all .12s" }}>{on && <IconCheckSm />}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:on?T.fgS:"#3730A3", textDecoration:on?"line-through":"none", marginBottom:2 }}>{p.name}</div>
                    <div style={{ fontSize:11, color:T.fgS, marginBottom:3 }}>{p.agency}</div>
                    <span style={{ fontSize:12, color:on?T.fgS:T.navy, lineHeight:1.5 }}>{p.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 7 — Scenario comparison
// ─────────────────────────────────────────────────────────────────────────────
const VALUES_ALIGNMENT_OPTS = [
  { id:"strong", label:"Strong fit", color:T.dgreen, bg:T.greenL },
  { id:"neutral", label:"Neutral", color:T.fgS, bg:T.div },
  { id:"tension", label:"Tension", color:T.red, bg:T.redL },
];
function RD6({ rd, setRData, profile }) {
  const d = rd.data; const selected = d.selectedOpps || []; const ranked = d.rankedOpps || []; const valuesAlignment = d.valuesAlignment || {};
  const setRank = (id,rank) => setRData(s => { const cur=(s.rankedOpps||[]).filter(x=>x.id!==id); return { ...s, rankedOpps:[...cur,{id,rank}] }; });
  const getRank = (id) => { const r=ranked.find(x=>x.id===id); return r?r.rank:0; };
  const setAlignment = (id,val) => setRData(s => ({ ...s, valuesAlignment:{ ...(s.valuesAlignment||{}), [id]:val } }));
  const sel = selected.map(id => OPPS.find(o=>o.id===id)).filter(Boolean);
  const hasValues = profile && (profile.values||profile.nearTerm||profile.longTerm||profile.advantage);
  if (selected.length===0) return (<div><Head eyebrow="Revenue Diversification · Stage 7" title="Scenario comparison" sub="Compare your selected paths side by side." /><Flag type="warn">No opportunities selected. Go back to Stage 4.</Flag><OpportunityCostLens financialSel={[]} physicalSel={[]} setRData={setRData} /></div>);
  const td = { padding:"11px 14px", fontSize:12.5, textAlign:"center", borderLeft:`1px solid ${T.div}` };
  const dotRow = (val,color) => (<div style={{ display:"flex", gap:3, justifyContent:"center" }}>{[1,2,3,4,5].map(n=>(<span key={n} style={{ width:6, height:6, borderRadius:"50%", background:n<=val?color:T.div, display:"inline-block" }}/>))}</div>);
  const rows = [{ label:"Time to revenue", vals:sel.map(o=>o.time) }, { label:"Capital required", vals:sel.map(o=>o.capital) }, { label:"Primary lever", vals:sel.map(o=>o.category) }];
  const financialSel = sel.filter(o=>o.cluster==="Financial Capital Deployment");
  const physicalSel = sel.filter(o=>o.cluster!=="Financial Capital Deployment");
  const tensionCount = sel.filter(o=>valuesAlignment[o.id]==="tension").length;
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 7" title="Scenario comparison" sub="Compare your selected paths side by side, then set your priority ranking." />
      <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
        <div style={cardLblStyle()}>Your core values check</div>
        {hasValues ? (
          <>
            <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12, lineHeight:1.5 }}>From your Farm Profile — worth holding next to each option below before you rank them.</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:4 }}>
              {profile.values && <div style={{ background:T.bgAlt, borderRadius:8, padding:"10px 14px" }}><div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>Core values</div><div style={{ fontSize:12.5, color:T.navy }}>{profile.values}</div></div>}
              {profile.advantage && <div style={{ background:T.bgAlt, borderRadius:8, padding:"10px 14px" }}><div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>Competitive advantage</div><div style={{ fontSize:12.5, color:T.navy }}>{profile.advantage}</div></div>}
              {profile.nearTerm && <div style={{ background:T.bgAlt, borderRadius:8, padding:"10px 14px" }}><div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>Near-term objectives</div><div style={{ fontSize:12.5, color:T.navy }}>{profile.nearTerm}</div></div>}
              {profile.longTerm && <div style={{ background:T.bgAlt, borderRadius:8, padding:"10px 14px" }}><div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>Long-term objectives</div><div style={{ fontSize:12.5, color:T.navy }}>{profile.longTerm}</div></div>}
            </div>
          </>
        ) : (
          <Flag type="info">Your Farm Profile doesn't have core values or objectives filled in yet — add them there and this check will pull them in automatically. In the meantime, rate alignment below from memory.</Flag>
        )}
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
          <thead><tr style={{ background:T.navy }}>
            <td style={{ padding:"12px 14px", fontSize:11, fontWeight:700, color:"#fff", textTransform:"uppercase", letterSpacing:"0.06em" }}>Comparison</td>
            {sel.map(o => (<td key={o.id} style={{ padding:"12px 14px", textAlign:"center", borderLeft:"1px solid rgba(255,255,255,0.12)" }}><div style={{ fontSize:13.5, fontWeight:700, color:"#fff", lineHeight:1.2 }}>{o.label}</div></td>))}
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (<tr key={i} style={{ background:i%2===0?T.bgAlt:"#fff" }}><td style={{ padding:"11px 14px", fontSize:12.5, fontWeight:600, color:T.fgM, borderRight:`1px solid ${T.border}` }}>{r.label}</td>{r.vals.map((v2,j)=>(<td key={j} style={td}>{v2}</td>))}</tr>))}
            <tr style={{ background:T.bgAlt }}>
              <td style={{ padding:"11px 14px", fontSize:12.5, fontWeight:600, color:T.fgM, borderRight:`1px solid ${T.border}` }}>Physical effort required</td>
              {sel.map(o => (<td key={o.id} style={td}>{dotRow(o.effort||3, T.tan)}</td>))}
            </tr>
            <tr style={{ background:"#fff" }}>
              <td style={{ padding:"11px 14px", fontSize:12.5, fontWeight:600, color:T.fgM, borderRight:`1px solid ${T.border}` }}>Liquidity of capital</td>
              {sel.map(o => (<td key={o.id} style={td}>{dotRow(o.liquidity||3, T.blue)}</td>))}
            </tr>
            <tr style={{ background:"#FAF6EC" }}>
              <td style={{ padding:"11px 14px", fontSize:12.5, fontWeight:600, color:T.fgM, borderRight:`1px solid ${T.border}` }}>12-month revenue ramp</td>
              {sel.map(o => (<td key={o.id} style={{ ...td, padding:"11px 8px" }}><div style={{ height:38, display:"flex", alignItems:"flex-end", gap:2, justifyContent:"center" }}>{(REV_RAMP[o.id]||[]).slice(0,12).map((v2,i)=>(<div key={i} style={{ width:7, height:`${v2*10}%`, minHeight:2, background:T.green, borderRadius:"1px 1px 0 0", opacity:0.55+(v2/80) }} />))}</div></td>))}
            </tr>
            <tr style={{ background:"#F3E8FF" }}>
              <td style={{ padding:"11px 14px", fontSize:12.5, fontWeight:600, color:T.fgM, borderRight:`1px solid ${T.border}` }}>Values alignment</td>
              {sel.map(o => (<td key={o.id} style={td}>
                <div style={{ display:"flex", justifyContent:"center", gap:4 }}>
                  {VALUES_ALIGNMENT_OPTS.map(opt => (<button key={opt.id} onClick={()=>setAlignment(o.id,opt.id)} title={opt.label} style={{ padding:"4px 8px", borderRadius:6, border:`1.5px solid ${valuesAlignment[o.id]===opt.id?opt.color:T.border}`, cursor:"pointer", fontSize:10, fontWeight:700, background:valuesAlignment[o.id]===opt.id?opt.bg:"#fff", color:valuesAlignment[o.id]===opt.id?opt.color:T.fgS }}>{opt.label}</button>))}
                </div>
              </td>))}
            </tr>
            <tr style={{ background:T.greenL }}>
              <td style={{ padding:"11px 14px", fontSize:12.5, fontWeight:700, color:"#2F6E28", borderRight:`1px solid ${T.border}` }}>Your priority rank</td>
              {sel.map(o => (<td key={o.id} style={td}><div style={{ display:"flex", justifyContent:"center", gap:5 }}>{sel.map((_,i) => (<button key={i} onClick={()=>setRank(o.id,i+1)} style={{ width:30, height:30, borderRadius:6, border:`1.5px solid ${getRank(o.id)===i+1?T.blue:T.border}`, cursor:"pointer", fontSize:13, fontWeight:700, background:getRank(o.id)===i+1?T.blue:"#fff", color:getRank(o.id)===i+1?"#fff":T.fgS }}>{i+1}</button>))}</div></td>))}
            </tr>
          </tbody>
        </table>
      </div>
      {tensionCount>0 && <div style={{ marginTop:16 }}><Flag type="warn">You flagged {tensionCount} selected path{tensionCount>1?"s":""} as in tension with your stated values or objectives. That doesn't mean rule it out — but it's worth naming the tradeoff explicitly before ranking it highly, and revisiting whether the near-term financial case is strong enough to justify it.</Flag></div>}
      <OpportunityCostLens financialSel={financialSel} physicalSel={physicalSel} setRData={setRData} />
    </div>
  );
}

// Opportunity-cost lens: always visible on Stage 6. When both a capital-only financial
// instrument and a sweat-equity venture are selected, it frames the real tradeoff — the
// same dollar of capital, deployed two different ways, with very different effort,
// liquidity, and correlation profiles. When no financial instrument is selected yet, it
// surfaces the five available instruments with a one-click way to add one to the comparison
// without leaving this stage.
const FINANCIAL_OPP_IDS = ["annuity","wholeLife","selfInsurance","retirementPlan","sellerFinancing"];
function OpportunityCostLens({ financialSel, physicalSel, setRData }) {
  const addToComparison = (id) => setRData(s => { const cur=s.selectedOpps||[]; return cur.includes(id) ? s : { ...s, selectedOpps:[...cur,id] }; });
  if (financialSel.length === 0) {
    const notSelected = OPPS.filter(o => FINANCIAL_OPP_IDS.includes(o.id));
    return (
      <div style={cardStyle({ borderTop:`4px solid ${T.blue}`, marginTop:16 })}>
        <div style={cardLblStyle()}><Apex color={T.blue} />Opportunity-cost lens — capital vs. sweat equity</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>None of your selected paths are financial instruments yet, so there's nothing to compare against your sweat-equity ventures. Add one below to see a side-by-side view — this won't remove anything you've already selected.</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {notSelected.map(o => (
            <div key={o.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, background:T.waterL, borderRadius:8, padding:"10px 14px" }}>
              <div><div style={{ fontSize:12.5, fontWeight:700, color:"#0A6E8C" }}>{o.label}</div><div style={{ fontSize:11, color:"#0A6E8C" }}>Effort {o.effort}/5 · Liquidity {o.liquidity}/5</div></div>
              <button onClick={()=>addToComparison(o.id)} style={{ ...btnStyle("outline","#0A6E8C"), fontSize:11, padding:"5px 11px", whiteSpace:"nowrap" }}>Add →</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={cardStyle({ borderTop:`4px solid ${T.blue}`, marginTop:16 })}>
      <div style={cardLblStyle()}><Apex color={T.blue} />Opportunity-cost lens — capital vs. sweat equity</div>
      <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>Financial instruments convert capital directly into future income or risk protection with minimal physical effort. Sweat-equity ventures require ongoing labor and management but can also build equity in a business you control. Neither is inherently better — the right mix depends on your time, capital, and risk tolerance.</div>
      {physicalSel.length > 0 ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:12 }}>
          <div style={{ background:T.waterL, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#0A6E8C", marginBottom:8 }}>Capital-only path{financialSel.length>1?"s":""}</div>
            {financialSel.map(o => (<div key={o.id} style={{ fontSize:12.5, color:"#0A6E8C", marginBottom:4 }}>• <b>{o.label}</b> — effort {o.effort||1}/5, liquidity {o.liquidity||1}/5</div>))}
          </div>
          <div style={{ background:T.wheatL||T.bgAlt, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.amberT, marginBottom:8 }}>Sweat-equity path{physicalSel.length>1?"s":""}</div>
            {physicalSel.map(o => (<div key={o.id} style={{ fontSize:12.5, color:T.amberT, marginBottom:4 }}>• <b>{o.label}</b> — effort {o.effort||3}/5, liquidity {o.liquidity||3}/5</div>))}
          </div>
        </div>
      ) : (
        <Flag type="info">All selected paths in this comparison are capital-only. Consider whether adding a sweat-equity venture from an earlier stage would give you a more diversified plan — or whether minimal-effort income is exactly what you're looking for at this stage of the operation.</Flag>
      )}
      <Flag type="warn">These are educational comparisons, not financial or insurance advice. Annuities, life insurance, self-insurance structures, and lending arrangements each carry contract terms, tax treatment, and suitability requirements that vary by individual situation — work with a licensed financial advisor, insurance professional, or your Farm Credit advisor before committing capital.</Flag>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 7 — Financial reserves & sequencing
// ─────────────────────────────────────────────────────────────────────────────
// Distinct from Stage 4 (which opportunity to pursue): this stage is about capital
// placement and timing — where reserve money sits, and in what order to fund the
// equipment reserve, diversify income, and layer in longer-horizon investments.
function RD7({ rd, setRData, fa }) {
  const d = rd.data; const reserves = d.reserves || {};
  const setReserve = (patch) => setRData(s => ({ ...s, reserves:{ ...(s.reserves||{}), ...patch } }));
  const selected = d.selectedOpps || [];
  const selOpps = selected.map(id => OPPS.find(o=>o.id===id)).filter(Boolean);

  // Equipment replacement reserve gap calculator
  const usefulLife = parseFloat(reserves.usefulLife) || 0;
  const replacementCost = parseFloat(reserves.replacementCost) || 0;
  const currentContribution = parseFloat(reserves.currentContribution) || 0;
  const hasCalcData = usefulLife > 0 && replacementCost > 0;
  const requiredAnnual = hasCalcData ? replacementCost / usefulLife : null;
  const gap = hasCalcData ? requiredAnnual - currentContribution : null;
  const fundedPct = requiredAnnual ? Math.min(100, Math.round((currentContribution/requiredAnnual)*100)) : 0;
  const reserveFunded = hasCalcData && gap <= 0;

  // Sequencing status — derived from what the farmer has actually done elsewhere in the module
  const incomeOpps = selOpps.filter(o => o.cluster !== "Financial Capital Deployment");
  const longHorizonOpps = selOpps.filter(o => ["retirementPlan","agReit"].includes(o.id));
  const step1Done = hasCalcData && reserveFunded;
  const step2Done = incomeOpps.length > 0;
  const step3Done = longHorizonOpps.length > 0;

  const RESERVE_PRODUCTS = ["Dedicated equipment replacement savings account (separate from operating cash)","Money market accounts — liquid, modest yield, no lock-up","Laddered CDs — stagger maturities across 1–5 years so cash becomes available on a rolling basis as equipment ages","Farm Credit patronage/equity retention — some associations let members build equity through retained patronage dividends tied to their existing lending relationship"];
  const RISK_PRODUCTS = ["Whole Farm Revenue Protection","ARC/PLC elections","Cash-value life insurance — builds savings that can later be borrowed against for equipment, while also serving an estate-planning role"];

  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 8" title="Beyond the balance sheet: building financial reserves for what's next" sub="Diversifying income is only half the equation. The other half is knowing where to put the money you've diversified — so it's there when a piece of equipment fails or a new opportunity shows up." />

      {/* Equipment reserve calculator */}
      <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
        <div style={cardLblStyle()}>Equipment replacement reserve — funding gap calculator</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>Before chasing higher returns anywhere else, size a dedicated reserve to your equipment's expected useful life and replacement cost. This is the foundation everything else in this stage sits on top of.</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:16 }}>
          <div><label style={labelStyle}>Expected useful life (years)</label><input type="number" style={inputStyle()} value={reserves.usefulLife||""} onChange={e=>setReserve({usefulLife:e.target.value})} placeholder="e.g., 10" /></div>
          <div><label style={labelStyle}>Estimated replacement cost</label><input type="number" style={inputStyle()} value={reserves.replacementCost||""} onChange={e=>setReserve({replacementCost:e.target.value})} placeholder="e.g., 350000" /></div>
          <div><label style={labelStyle}>Current annual reserve contribution</label><input type="number" style={inputStyle()} value={reserves.currentContribution||""} onChange={e=>setReserve({currentContribution:e.target.value})} placeholder="e.g., 20000" /></div>
        </div>
        {hasCalcData && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
              <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Required annual contribution</div>
                <div style={{ fontSize:20, fontWeight:800, color:T.navy }}>${Math.round(requiredAnnual).toLocaleString()}</div>
              </div>
              <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Annual gap</div>
                <div style={{ fontSize:20, fontWeight:800, color:gap>0?T.red:T.dgreen }}>{gap>0?`$${Math.round(gap).toLocaleString()} short`:"Fully funded"}</div>
              </div>
              <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>% of target funded</div>
                <div style={{ fontSize:20, fontWeight:800, color:fundedPct>=100?T.dgreen:fundedPct>=60?T.amber:T.red }}>{fundedPct}%</div>
              </div>
            </div>
            <div style={{ height:8, background:T.div, borderRadius:4, overflow:"hidden", marginBottom:8 }}><div style={{ height:"100%", width:`${fundedPct}%`, background:fundedPct>=100?T.dgreen:fundedPct>=60?T.amber:T.red, borderRadius:4, transition:"width .3s" }} /></div>
            {gap>0 && <Flag type="warn">At your current contribution rate, you're ${Math.round(gap).toLocaleString()}/year short of fully funding this reserve by the time the equipment needs replacing.</Flag>}
            {reserveFunded && <Flag type="ok">Your reserve is on pace — consider whether the next dollar is better spent on income diversification or a longer-horizon investment.</Flag>}
          </>
        )}
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>Where the reserve can sit</div>
          {RESERVE_PRODUCTS.map((p,i) => (<div key={i} style={{ fontSize:12.5, color:T.navy, padding:"6px 0", borderBottom:i<RESERVE_PRODUCTS.length-1?`1px solid ${T.div}`:"none" }}>• {p}</div>))}
        </div>
        <div style={{ marginTop:10 }}><Flag type="info">Pair your reserve timeline with Section 179 or bonus depreciation planning — coordinating when you buy with what's already saved maximizes the after-tax benefit.</Flag></div>
      </div>

      {/* Card 2 — Risk products */}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Risk products that free up capital</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12, lineHeight:1.5 }}>Not every financial product is about growing money — some are about not needing as much of it sitting idle. Insurance and revenue protection tools reduce how large a cash cushion you need to hold against a bad year.</div>
        {RISK_PRODUCTS.map((p,i) => (<div key={i} style={{ fontSize:12.5, color:T.navy, padding:"6px 0", borderBottom:i<RISK_PRODUCTS.length-1?`1px solid ${T.div}`:"none" }}>• {p}</div>))}
      </div>

      {/* Card 3 — Income diversification vs your actual selections */}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Income diversification before investment diversification</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12, lineHeight:1.5 }}>The highest-ROI move for most operations isn't a financial product at all — it's a new income line. Diversify how money comes in before diversifying where it sits once it's in.</div>
        {incomeOpps.length > 0 ? (
          <>
            <div style={{ fontSize:11.5, fontWeight:700, color:T.dgreen, marginBottom:8 }}>From your Stage 4 selections, these are income-diversification moves:</div>
            {incomeOpps.map(o => (<div key={o.id} style={{ fontSize:12.5, color:T.navy, padding:"5px 0" }}>✓ {o.label}</div>))}
          </>
        ) : (
          <Flag type="warn">None of your currently selected paths are income-diversification moves — everything selected so far is a financial instrument. Consider whether a land-based or value-added enterprise should come first.</Flag>
        )}
      </div>

      {/* Card 4 — Longer-horizon vehicles */}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Longer-horizon investment vehicles</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12, lineHeight:1.5 }}>Once cash flow is stable and the reserve is funded, some operations layer in longer-horizon vehicles to build wealth outside the operation itself — a buffer that isn't tied to this year's yield or commodity price.</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {OPPS.filter(o=>["agReit","retirementPlan"].includes(o.id)).map(o => {
            const isSel = selected.includes(o.id);
            return (<div key={o.id} style={{ background:isSel?T.greenL:T.bgAlt, border:`1px solid ${isSel?T.dgreen:T.border}`, borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:T.navy, marginBottom:3 }}>{o.label}{isSel&&" ✓"}</div>
              <div style={{ fontSize:11.5, color:T.fgM, lineHeight:1.4 }}>{o.desc}</div>
            </div>);
          })}
        </div>
        <div style={{ fontSize:11.5, color:T.fgS, marginTop:10 }}>Ag-focused mutual funds and ETFs are another option here, though not modeled as a selectable path in Stage 4 since they're a standard brokerage product rather than an ag-specific opportunity.</div>
      </div>

      {/* Sequencing framework */}
      <div style={cardStyle({ background:T.navy, border:"none" })}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.green, marginBottom:12 }}>The order matters</div>
        {[
          { n:1, label:"Fund the reserve first", detail:"Laddered CDs or a money market account sized to your next equipment cycle.", done:step1Done },
          { n:2, label:"Diversify income before diversifying investments", detail:"New revenue lines reduce risk faster than a new asset class does.", done:step2Done },
          { n:3, label:"Layer in longer-horizon vehicles last", detail:"Once cash flow is stable and the reserve is no longer competing with this year's operating needs.", done:step3Done },
        ].map(s => (
          <div key={s.n} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:s.n<3?"1px solid rgba(255,255,255,0.1)":"none" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:s.done?T.green:"rgba(255,255,255,0.15)", color:s.done?T.navy:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>{s.done?"✓":s.n}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:2 }}>{s.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.4 }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <Flag type="warn">This is educational content, not financial advice. Coordinate reserve strategy, depreciation timing, and any investment vehicles with a licensed financial advisor, tax professional, or your Farm Credit advisor.</Flag>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RD STAGE 8 — Action plan
// ─────────────────────────────────────────────────────────────────────────────
function RD8({ rd, fa }) {
  const d = rd.data; const selected = d.selectedOpps || []; const ranked = d.rankedOpps || []; const lev = d.leverItems || {}; const b = d.baseline || {};
  const sel = selected.map(id => OPPS.find(o=>o.id===id)).filter(Boolean).sort((a,c) => { const ra=(ranked.find(r=>r.id===a.id)||{}).rank||99, rb=(ranked.find(r=>r.id===c.id)||{}).rank||99; return ra-rb; });
  const tierC = { r:{bg:T.redL,c:T.red}, a:{bg:T.amberL,c:T.amberT}, g:{bg:T.greenL,c:T.dgreen} };
  const rankColor = (i) => [T.blue,T.tan,T.dgreen][i] || T.fgS;
  const sc = faScoreOf(fa); const mfp = parseFloat(b.mfpScore) || sc;
  const summary = [["FA module","Complete"],["FA tier", faTierOf(fa)],["RD readiness", mfp>=3.5?"Ready":mfp>=2.5?"Caution":"Foundation first"],["Top RD path",(sel[0]&&sel[0].label)||"—"],["Assets",`${leverPct(lev,"asset")}% (${LEVER_BUCKET_LABEL[leverBucket(leverPct(lev,"asset"))]})`],["Human capital",`${leverPct(lev,"trust")}% (${LEVER_BUCKET_LABEL[leverBucket(leverPct(lev,"trust"))]})`],["Financial capital",`${leverPct(lev,"risk")}% (${LEVER_BUCKET_LABEL[leverBucket(leverPct(lev,"risk"))]})`]];
  const resources = [["Penn State","Advisory team assembly + insurance review"],["Purdue","Five-lever framework — price, production, cost, balance sheet, people"],["Ohio State","Whole-farm planning + succession"],["Iowa State","Equipment benchmarking for custom farming"],["UKY Center","Specialty crop diversification database"]];
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 9" title="Revenue Diversification action plan" sub="Your personalized diversification roadmap — ranked by the priority order you set in Stage 7." />
      <div style={{ background:T.navy, borderRadius:10, padding:"20px 24px", marginBottom:16 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:T.green, marginBottom:6, display:"flex", alignItems:"center", gap:7 }}>Both modules complete</div>
        <div style={{ fontSize:19, fontWeight:700, color:"#fff", marginBottom:5, lineHeight:1.2 }}>{sel.length>0 ? `${sel.length} diversification path${sel.length>1?"s":""} identified. ${sel[0].label} is your Priority 1.` : "No paths selected — revisit Stage 4."}</div>
        <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.55)" }}>{(b.farmType||"Farm")}{b.revTier?` · ${b.revTier}`:""}</div>
      </div>
      {sel.map((o,idx) => {
        const acts = RD_ACTIONS[o.id] || [];
        return (
          <div key={o.id} style={cardStyle()}>
            <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${T.div}` }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:rankColor(idx), display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>{idx+1}</div>
              <div><div style={{ fontSize:16, fontWeight:700 }}>{o.label}</div><div style={{ fontSize:11.5, color:T.fgS }}>{o.time} to first revenue · {o.capital}</div></div>
            </div>
            {acts.map((a,i) => {
              const tc = tierC[a.t];
              return (<div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 0", borderBottom:i<acts.length-1?`1px solid ${T.div}`:"none" }}><div style={{ width:26, height:26, borderRadius:"50%", background:tc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:tc.c, flexShrink:0 }}>{i+1}</div><div><div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{a.title}</div><div style={{ fontSize:12.5, color:T.fgM, lineHeight:1.5 }}>{a.d}</div></div></div>);
            })}
          </div>
        );
      })}
      <EfficiencyValueImpact sel={sel} lev={lev} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}>Land-grant advisory resources</div>
          {resources.map(([org,note],i) => (<div key={i} style={{ padding:"7px 0", borderBottom:i<resources.length-1?`1px solid ${T.div}`:"none" }}><span style={{ fontSize:12.5, fontWeight:700, color:T.blue }}>{org}: </span><span style={{ fontSize:12.5, color:T.fgM }}>{note}</span></div>))}
        </div>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}>Module summary</div>
          {summary.map(([k,v2],i) => (<div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i<summary.length-1?`1px solid ${T.div}`:"none" }}><span style={{ fontSize:11.5, color:T.fgM, fontWeight:600 }}>{k}</span><span style={{ fontSize:11.5, color:T.navy, fontWeight:600 }}>{v2}</span></div>))}
        </div>
      </div>
      <div style={{ background:T.navy, borderRadius:10, padding:14, textAlign:"center", marginTop:16 }}><div style={{ fontSize:11.5, color:"rgba(255,255,255,0.45)" }}>MFP Platform  /  Financial Analysis + Revenue Diversification  /  Idealyst Innovation  /  Farm Credit partnership</div></div>
    </div>
  );
}

// Step 8 of the diversification process: identify impact to efficiency & value —
// how the selected paths affect asset utilization, income-stream correlation, and
// whole-farm risk, not just the standalone economics of each opportunity.
function EfficiencyValueImpact({ sel, lev }) {
  if (sel.length === 0) return null;
  const avgSeasonal = sel.reduce((s,o)=>s+(o.seasonal||3),0)/sel.length;
  const avgReg = sel.reduce((s,o)=>s+(o.reg||3),0)/sel.length;
  const usesAsset = sel.some(o=>o.fit.asset>=60);
  const usesTrust = sel.some(o=>o.fit.trust>=60);
  const usesRisk = sel.some(o=>o.fit.risk>=70);
  const leverCount = [usesAsset,usesTrust,usesRisk].filter(Boolean).length;
  const calendarFit = avgSeasonal<=2 ? { label:"Complements your calendar", tone:"ok", text:"These paths largely run outside your peak planting/harvest window — labor and equipment conflicts should be minimal." }
    : avgSeasonal>=4 ? { label:"Competes with fieldwork", tone:"warn", text:"These paths draw on the same labor and equipment windows as your core operation — plan capacity carefully before committing." }
    : { label:"Partial overlap", tone:"info", text:"Some seasonal overlap with core fieldwork exists — confirm labor and equipment availability during peak weeks." };
  const correlationNote = usesRisk
    ? "At least one selected path is intentionally counter-cyclical to commodity prices — this reduces whole-farm income correlation and should smooth cash flow across a full price cycle."
    : "Your selected paths lean toward asset or trust monetization rather than counter-cyclical income — they add revenue but may not reduce your exposure to a commodity price downturn.";
  return (
    <div style={cardStyle({ borderTop:`4px solid ${T.blue}` })}>
      <div style={cardLblStyle()}><Apex color={T.blue} />Efficiency & value impact</div>
      <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>Beyond the standalone economics of each path, here's how this plan affects the efficiency and risk profile of the whole farm.</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
        <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Asset utilization</div>
          <div style={{ fontSize:12.5, color:T.navy, lineHeight:1.5 }}>{usesAsset ? "This plan puts existing land, equipment, or facilities to work rather than requiring new core-farm capital." : "This plan leans more on relationships and expertise than existing physical assets."}</div>
        </div>
        <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Calendar fit</div>
          <div style={{ fontSize:12.5, color:T.navy, lineHeight:1.5 }}>{calendarFit.text}</div>
        </div>
        <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Portfolio breadth</div>
          <div style={{ fontSize:12.5, color:T.navy, lineHeight:1.5 }}>{leverCount>=2 ? `Your selections draw on ${leverCount} of the 3 diversification levers — a genuinely diversified plan rather than one concentrated bet.` : "Your selections lean on a single lever — consider whether one more path from a different lever would strengthen the plan."}</div>
        </div>
      </div>
      <Flag type={calendarFit.tone}>{calendarFit.label}: {calendarFit.text}</Flag>
      <Flag type={usesRisk?"ok":"info"}>{correlationNote}</Flag>
      {avgReg>=3.5 && <Flag type="warn">Average regulatory load across your selected paths is high — budget extra time for entity setup, permitting, and insurance before revenue starts.</Flag>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FARM PROFILE — a single 360° farm view that fills in as the farmer completes
// onboarding and assessments, and feeds relevant fields back into FA, RD, and Risk
// so nothing has to be entered twice.
// ═════════════════════════════════════════════════════════════════════════════
const ENT_KEYWORDS = { grain:["corn","soy","soybean","wheat","grain","oats"], dairy:["dairy","milk"], beef:["cattle","beef","cow-calf","cow calf"] };
const matchEnterprisesFromText = (text) => {
  const t = (text||"").toLowerCase();
  return Object.entries(ENT_KEYWORDS).filter(([,kws]) => kws.some(k=>t.includes(k))).map(([id])=>id);
};
const revTierFromIncome = (income) => {
  const n = parseFloat(income);
  if (!n) return "";
  if (n < 500000) return "< $500K";
  if (n < 2000000) return "$500K – $2M";
  if (n < 5000000) return "$2M – $5M";
  return "$5M+";
};

// Shared finding treatment: left accent rule, chip, heading, body, source line.
// Used by both the priority action findings and the Business at a glance sections
// so the two views read as one design language.
const FIND_COLOR = {
  s:   { b:T.moss,   bg:T.greenL,  c:T.dgreen },
  w:   { b:T.blue,   bg:T.blueL,   c:T.blue },
  o:   { b:"#4338CA",bg:"#EEF2FF", c:"#4338CA" },
  t:   { b:T.amber,  bg:T.amberL,  c:T.amberT },
  none:{ b:"#cfd5dd",bg:"#eceef2", c:T.fgS },
  neutral:{ b:T.silver, bg:"#eceef2", c:T.fgS },
};

const FindingBlock = ({ kind, tag, heading, source, children }) => {
  const fc = FIND_COLOR[kind] || FIND_COLOR.none;
  return (
    <div style={{ borderLeft:`2px solid ${fc.b}`, paddingLeft:14, marginBottom:15 }}>
      <span style={{ display:"inline-block", fontSize:9.5, letterSpacing:"0.12em", fontWeight:600, padding:"3px 8px", borderRadius:3, marginBottom:6, background:fc.bg, color:fc.c }}>{tag}</span>
      <h4 style={{ fontSize:14.5, marginBottom:4, color:T.fg }}>{heading}</h4>
      {children}
      {source && <p style={{ fontSize:12, color:T.fgS, margin:"5px 0 0" }}>{source}</p>}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ACTION PLAN — twelve business areas, ranked into three priorities
// ═════════════════════════════════════════════════════════════════════════════
// Areas map to one of the four MFP categories, and some map to a guided module.
// Ranking is weight-aware: a constraint area gates everything downstream, a value
// area produces the largest near-term lift, so neither is ranked on raw score alone.
const AP_CATS = {
  fundamentals: { label:"Business Fundamentals", score:44 },
  growth:       { label:"Sustainable Growth",    score:50 },
  production:   { label:"Production",            score:45 },
  legacy:       { label:"Legacy",                score:33 },
};

const AP_AREAS = [
  { n:1,  id:"vision",     label:"Strategic vision & planning",  cat:"fundamentals", score:2.7, weight:"standard",   module:null },
  { n:2,  id:"advantage",  label:"Competitive advantage",        cat:"fundamentals", score:3.2, weight:"standard",   module:null },
  { n:3,  id:"records",    label:"Records & data management",    cat:"fundamentals", score:3.0, weight:"standard",   module:null },
  { n:4,  id:"workforce",  label:"Workforce planning",           cat:"fundamentals", score:1.3, weight:"standard",   module:null },
  { n:5,  id:"finanalysis",label:"Financial analysis",           cat:"growth",       score:2.5, weight:"value",      module:"fa" },
  { n:6,  id:"market",     label:"Market analysis",              cat:"growth",       score:2.9, weight:"standard",   module:null },
  { n:7,  id:"incomediv",  label:"Income diversification",       cat:"growth",       score:2.2, weight:"value",      module:"rd" },
  { n:8,  id:"adoption",   label:"Adoption & efficiency",        cat:"production",   score:3.4, weight:"standard",   module:null },
  { n:9,  id:"riskprot",   label:"Risk & protection",            cat:"production",   score:2.4, weight:"constraint", module:"risk" },
  { n:10, id:"ventures",   label:"Ventures beyond production",   cat:"production",   score:3.1, weight:"standard",   module:"rd" },
  { n:11, id:"knowledge",  label:"Knowledge management",         cat:"legacy",       score:1.3, weight:"constraint", module:"legacy" },
  { n:12, id:"succession", label:"Succession & transition",      cat:"legacy",       score:2.6, weight:"constraint", module:"legacy" },
];

const AP_WEIGHT_LABEL = { constraint:"constraint-weighted", value:"value-weighted", standard:"" };
const AP_WEIGHT_BOOST = { constraint:1.6, value:1.8, standard:1.0 };

// Priority score: how far the area is from 5, amplified by its weight.
const apPriorityScore = (a) => (5 - a.score) * AP_WEIGHT_BOOST[a.weight];
const apRanked = () => [...AP_AREAS].sort((x,y) => apPriorityScore(y) - apPriorityScore(x));
const apOverall = 44;

// Narrative content per area. Only the ranked-in areas need full detail; the rest
// fall back to a generic shape so the page never renders an empty card.
const AP_DETAIL = {
  knowledge: {
    vm:"Protect decades of work and know-how so the farm can keep creating value after you.",
    why:"this is a constraint area. A weakness here caps the return on everything else you improve, so it moves ahead of areas with a similar score.",
    finds:[
      ["s","STRENGTH","A records habit to build from","You already keep more than many operations at this scale. Written procedures build on that habit rather than starting from nothing.","From your assessment · Records & data (03) scored 3.0 / 5"],
      ["w","WEAKNESS","Know-how is undocumented","Decades of operating knowledge live largely with one person and are not captured for anyone who comes next.","From your assessment · Knowledge management (11) scored 1.3 / 5, high confidence"],
      ["t","THREAT","Expanding while transfer is undefined","Adding assets and ventures while the transfer plan is absent concentrates risk in one person. The most common gap in family operations, not a personal shortcoming.","From EagleEye market intelligence · high confidence, current"],
    ],
    synth:"Succession is the deeper issue here, and capturing what you know is the step that makes a succession plan executable.",
    steps:[["List the 5 to 10 decisions that only you can make today.","Start with the venture only you fully understand."],["Write a one-page checklist or procedure for the top two.",""],["Have a successor shadow you on those, then gradually let them lead.",""]],
    lender:"can review your first list and flag which decisions matter most to the credit relationship.",
    tools:[["Gripp","step 2","Procedures, task ownership, and document storage for farm teams.","Matched because you run multiple ventures with no single place for procedures."]],
    toolcount:"1 of 2 available in this area",
  },
  finanalysis: {
    vm:"Know exactly which acres, enterprises, or products are making you money, and which are burning equity.",
    why:"this is a value area. Financial visibility creates more near-term economic lift than most areas, so it outranks several lower scores.",
    finds:[
      ["s","STRENGTH","A records habit to build from","Modest in absolute terms, but one of your stronger areas. The raw material for this work already exists.","From your assessment · Records & data (03) scored 3.0 / 5"],
      ["w","WEAKNESS","Enterprise-level financial visibility is thin","With several ventures, blended numbers can hide both your best performer and a quiet drain on equity. Today it is difficult to tell which is which.","From your assessment · Financial analysis (05) scored 2.5 / 5, high confidence"],
      ["t","THREAT","Margin squeeze while input costs hold","Input costs and capital constraints keep pressuring farm margins. An industry-wide condition, not a management failure, but harder to absorb without knowing where the pressure lands.","From EagleEye market intelligence · medium confidence, near term"],
    ],
    synth:"The gap is real, the market is applying pressure to it now, and you already hold what it takes to close it.",
    steps:[["Calculate per-enterprise profitability and compare to benchmarks.","Start with the two ventures carrying the most row-crop exposure."],["Build a simple cash flow forecast for the next 12 to 18 months.",""],["Set 2 to 3 financial targets with annual check-ins.",""]],
    lender:"can benchmark the output against peer operations.",
    tools:[["Cropzilla","step 1","Per-enterprise and per-acre cost modeling.","Matched because you run several ventures on shared equipment, where cost allocation is the hard part."],["AgWorld","steps 2 and 3","Ongoing cash flow and target tracking.","Matched because your records habit means there is already data to load."]],
    toolcount:"2 of 5 available in this area",
  },
  succession: {
    vm:"Make sure the business outlives the operator, on terms the family has actually agreed to.",
    why:"this is a constraint area. Without a transfer plan, improvements elsewhere accrue to an operation whose future ownership is undefined.",
    finds:[
      ["w","WEAKNESS","No documented transition plan","Ownership, management, and timing have not been written down or agreed across the family.","From your assessment · Succession & transition (12) scored 1.6 / 5"],
      ["t","THREAT","Transition risk concentrates with age","The share of farm assets held by operators over 65 continues to rise, and unplanned transitions are the most common way a viable business ends.","From EagleEye market intelligence · high confidence, structural"],
    ],
    synth:"Nothing here is urgent this season, which is exactly why it keeps getting deferred.",
    steps:[["Name who is intended to take over management, and who is intended to own.","These are two different questions and often two different answers."],["Get a preliminary valuation so the conversation has real numbers.",""],["Set a target date for a written agreement and work backward from it.",""]],
    lender:"can outline the financing structures that make a transfer workable.",
    tools:[],
    toolcount:"No partner tools in this area yet",
  },
  riskprot: {
    vm:"Understand where the operation is exposed, and whether the coverage you carry actually closes the gap.",
    why:"this is a constraint area. An uninsured or underinsured loss can undo several years of progress everywhere else.",
    finds:[
      ["w","WEAKNESS","Coverage has not been sized against cost of production","Policies are in place, but the gap between what they pay and what production actually costs has not been calculated.","From your assessment · Risk & protection (09) scored 2.4 / 5"],
      ["t","THREAT","Cost of production above expected price","At trend yield, breakeven sits above the expected season-average price, which means a normal year does not cover full cost.","From EagleEye market intelligence · high confidence, current"],
    ],
    synth:"Coverage is a floor, not a profit guarantee. The useful question is how far the floor sits below full cost.",
    steps:[["Calculate breakeven per unit against your current coverage level.","The Farm Risk module sizes this gap directly."],["Rank your threats by probability and severity.",""],["Decide which threats to transfer, mitigate, accept, or avoid.",""]],
    lender:"can review whether current coverage protects the credit position.",
    tools:[],
    toolcount:"No partner tools in this area yet",
  },
  incomediv: {
    vm:"Find the income streams your assets, people, and balance sheet can actually support.",
    why:"this is a value area. New revenue reduces concentration risk faster than most improvements, so it outranks several lower scores.",
    finds:[
      ["s","STRENGTH","Underused capacity already exists","Equipment, storage, and labour are not fully utilised across the season, which is the raw material for a second income line.","From your assessment · Ventures beyond production (10) scored 3.1 / 5"],
      ["w","WEAKNESS","Income remains concentrated","Most revenue traces to a small number of buyers and a single production system.","From your assessment · Income diversification (07) scored 2.2 / 5"],
    ],
    synth:"The capacity is there. What is missing is a ranked, farm-specific view of which path to take first.",
    steps:[["Rate your human capital, assets, and financial capacity honestly.",""],["Map two or three opportunities against that profile, not twelve.",""],["Screen each for barriers before committing capital.",""]],
    lender:"can talk through how comparable operations financed a similar move.",
    tools:[],
    toolcount:"No partner tools in this area yet",
  },
};

const AP_FALLBACK = {
  vm:"Improve this area to lift what the rest of the operation can achieve.",
  why:"a meaningful gap, but a standard-weighted area. It neither gates other progress nor produces the largest near-term lift.",
  finds:[["none","NO FINDING YET","Your assessment conversation did not cover this area","This ranked on score and gap alone. Nothing from the conversation explains it, and no market signal points here, so treat it as a question to open rather than a conclusion.","Worth raising directly in the review, or revisit at the next assessment"]],
  synth:"Ranked by the numbers, unsupported by the conversation. The most useful thing here is a question, not a plan.",
  steps:[["Open this area in your next advisor conversation.",""],["Decide whether the score reflects reality or a gap in the assessment.",""]],
  lender:"can talk through how comparable operations have handled this.",
  tools:[], toolcount:"No partner tools in this area yet",
};

const AP_MODULE_LABEL = { fa:"Financial Analysis", rd:"Revenue Diversification", risk:"Farm Risk", legacy:"Legacy" };

// Compact carry-forward of the four financial health categories, shown inside the
// modules so the numbers travel with the farmer rather than living only on one page.
const FinancialHealthStrip = ({ fa }) => {
  const { hasData, categories } = computeFARatios(fa.s3vals);
  if (!hasData) return null;
  return (
    <div style={{ background:T.bgAlt, border:`1px solid ${T.border}`, borderRadius:8, padding:"11px 14px", marginBottom:16 }}>
      <div style={{ fontSize:10.5, fontWeight:600, letterSpacing:"0.13em", textTransform:"uppercase", color:T.fgS, marginBottom:9 }}>Financial health carried forward</div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {categories.map(c => (
          <div key={c.id} style={{ display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ fontSize:12, color:T.fgM }}>{c.label}</span>
            <span style={pillStyle(c.status)}>{c.status==="blank"?"not scored":c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function FarmProfilePage({ profile, setProfile, fa, rd, goFA, goRD, goRisk, goLegacy }) {
  const set = (field) => (e) => setProfile(s => ({ ...s, [field]: e.target.value }));
  const [pri, setPri] = useState(0);
  const [view, setView] = useState("actions");
  const { hasData: faHasData, categories: faCategories } = computeFARatios(fa.s3vals);
  const lenderOpps = lenderOpportunities(fa);

  const ranked = apRanked();
  const top3 = ranked.slice(0,3);
  const area = top3[pri] || top3[0];
  const d = AP_DETAIL[area.id] || AP_FALLBACK;
  const cat = AP_CATS[area.cat];
  const byScore = [...AP_AREAS].sort((a,b) => a.score - b.score);
  const posIdx = byScore.findIndex(a => a.id === area.id);
  const ordinal = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"][posIdx];
  const startModule = () => { if (area.module==="fa") goFA(1); else if (area.module==="rd") goRD(1); else if (area.module==="risk") goRisk(1); else if (area.module==="legacy") goLegacy(1); };

  const findColor = FIND_COLOR;

  const tierRow = (label, note, value, unit, hl) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:14, padding:hl?"9px 18px":"8px 0", borderBottom:hl?"none":`1px dashed ${T.border}`, background:hl?"#e8edf4":"transparent", margin:hl?"0 -18px":0, borderRadius:hl?4:0 }}>
      <span style={{ fontSize:13, color:T.fgM }}><b style={{ color:T.fg, fontWeight:600 }}>{label}</b> <span style={{ color:T.fgS, fontSize:12 }}>{note}</span></span>
      <span style={{ fontSize:17, fontWeight:600, whiteSpace:"nowrap" }}>{value}<span style={{ fontSize:11.5, fontWeight:400, color:T.fgS }}> {unit}</span></span>
    </div>
  );

  const snapField = (label, field, placeholder) => (
    <div style={{ background:T.bgAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
      <div style={{ fontSize:10.5, fontWeight:600, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>{label}</div>
      <textarea style={inputStyle({ minHeight:44, border:"none", background:"transparent", padding:0, fontSize:14, fontWeight:600, color:T.navy, resize:"vertical" })} value={profile[field]||""} onChange={set(field)} placeholder={placeholder} />
    </div>
  );

  const sourceCount = (fa.enterprises||[]).length + (rd.data?.selectedOpps||[]).length;
  const divLabel = sourceCount===0 ? null : sourceCount<=1 ? "Highly concentrated" : sourceCount<=3 ? "Moderately concentrated" : "Well diversified";

  return (
    <div>
      <Head eyebrow="Farm business profile" title={view==="actions" ? "Three priorities, drawn from twelve areas" : "Business at a glance"} sub={view==="actions" ? "Each card shows how the area scored, what your assessment and the market found there, and what to do first. Work them in order, the first one unlocks the others." : "The operating picture behind the priorities: what the farm is, what it is trying to become, and where its financial health currently sits."} />

      {/* view tabs */}
      <div style={{ display:"flex", gap:8, borderBottom:`1px solid ${T.border}`, marginBottom:20 }}>
        {[["actions","Priority actions"],["glance","Business at a glance"]].map(([k,lab]) => {
          const on = view===k;
          return (
            <button key={k} onClick={()=>setView(k)} style={{ background:"none", border:"none", borderBottom:`2px solid ${on?T.navy:"transparent"}`, padding:"9px 4px", marginBottom:-1, cursor:"pointer", font:"inherit", fontSize:14, fontWeight:on?600:500, color:on?T.navy:T.fgS, marginRight:14 }}>{lab}</button>
          );
        })}
      </div>

      {view==="actions" && (<>

      {/* priority tabs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:8 }}>
        {top3.map((a,j) => {
          const on = j===pri;
          return (
            <button key={a.id} onClick={()=>setPri(j)} style={{ background:"#fff", border:`1px solid ${T.border}`, borderTop:`3px solid ${on?T.navy:"#d8dce3"}`, borderRadius:"0 0 8px 8px", padding:"13px 15px", cursor:"pointer", textAlign:"left", font:"inherit", transition:"border-color .15s" }}>
              <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:on?T.navy:T.fgS }}>PRIORITY {j+1}</div>
              <div style={{ fontSize:14, fontWeight:600, margin:"4px 0 3px", color:T.fg }}>{a.label}</div>
              <div style={{ fontSize:11.5, color:T.fgS }}>{a.score.toFixed(1)} / 5 · {AP_CATS[a.cat].label}</div>
              {a.module && <span style={{ ...pillStyle("strong"), marginTop:5 }}>module</span>}
            </button>
          );
        })}
      </div>
      <p style={{ fontSize:11.5, color:T.fgS, margin:"0 0 20px", textAlign:"right" }}>Showing priority {pri+1} of 3</p>

      {/* priority card */}
      <div style={cardStyle()}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:5 }}>
          <span style={{ background:T.navy, color:"#fff", fontSize:11, letterSpacing:"0.08em", fontWeight:600, padding:"3px 10px", borderRadius:4 }}>PRIORITY {pri+1}</span>
          <span style={{ fontSize:12, color:T.fgS }}>Area {String(area.n).padStart(2,"0")} · {cat.label}{AP_WEIGHT_LABEL[area.weight] ? " · "+AP_WEIGHT_LABEL[area.weight] : ""}</span>
        </div>
        <h2 style={{ fontSize:21, letterSpacing:"-0.01em", marginBottom:3, color:T.fg }}>{area.label}</h2>
        <p style={{ fontSize:14.5, color:T.blue, fontStyle:"italic", margin:"0 0 18px" }}>{d.vm}</p>

        {/* scores */}
        <div style={{ background:T.bgAlt, borderRadius:8, padding:"16px 18px", marginBottom:20 }}>
          <div style={{ fontSize:10.5, letterSpacing:"0.13em", color:T.fgS, marginBottom:13, textTransform:"uppercase" }}>How this area scored</div>
          {tierRow("Your whole farm business", "— overall MFP score", apOverall, "/ 100", false)}
          {tierRow(cat.label, "— the category this area belongs to, 1 of 4", cat.score, "/ 100", false)}
          {tierRow(area.label, "— this action area, 1 of 12", area.score.toFixed(1), "/ 5", true)}
          {tierRow("Room to improve", "— distance from this score to 5", (5-area.score).toFixed(1), "pts", false)}

          <div style={{ marginTop:15, borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
            <p style={{ fontSize:12, color:T.fgM, margin:"0 0 9px" }}>All twelve areas of your business, weakest to strongest. This one is highlighted, {ordinal} lowest of 12 areas by score.</p>
            <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:32 }}>
              {byScore.map(a => (
                <span key={a.id} style={{ flex:1, background:a.id===area.id?T.blue:"#d3d8e0", borderRadius:"2px 2px 0 0", display:"block", height:`${Math.max(8,(a.score/5)*100)}%` }} />
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10.5, color:T.fgS, marginTop:5 }}><span>weakest</span><span>strongest</span></div>
            <p style={{ fontSize:12.5, color:T.fgM, margin:"10px 0 0", background:"#fff", borderRadius:5, padding:"9px 12px" }}>
              <b style={{ color:T.navy }}>Why it ranks {["first","second","third"][pri]}:</b> {d.why}
            </p>
          </div>
        </div>

        {/* findings */}
        <div style={{ fontSize:11, letterSpacing:"0.13em", color:T.fgS, margin:"0 0 12px", textTransform:"uppercase" }}>What your assessment and the market found here</div>
        {d.finds.map((f,i) => {
          const fc = findColor[f[0]];
          return (
            <div key={i} style={{ borderLeft:`2px solid ${fc.b}`, paddingLeft:14, marginBottom:13 }}>
              <span style={{ display:"inline-block", fontSize:9.5, letterSpacing:"0.12em", fontWeight:600, padding:"3px 8px", borderRadius:3, marginBottom:6, background:fc.bg, color:fc.c }}>{f[1]}</span>
              <h4 style={{ fontSize:14.5, marginBottom:4, color:T.fg }}>{f[2]}</h4>
              <p style={{ fontSize:13.5, color:T.fgM, margin:"0 0 5px" }}>{f[3]}</p>
              <p style={{ fontSize:12, color:T.fgS, margin:0 }}>{f[4]}</p>
            </div>
          );
        })}
        <p style={{ fontSize:13.5, color:T.fgM, fontStyle:"italic", margin:"0 0 20px" }}>{d.synth}</p>

        {/* steps */}
        <ol style={{ margin:"0 0 19px", paddingLeft:21, fontSize:14.5 }}>
          {d.steps.map((s,i) => (
            <li key={i} style={{ marginBottom:8 }}>{s[0]}
              {s[1] && <div style={{ background:T.greenL, borderLeft:`2px solid ${T.moss}`, borderRadius:"0 4px 4px 0", padding:"8px 12px", marginTop:6, fontSize:12.5, color:T.dgreen }}>{s[1]}</div>}
            </li>
          ))}
        </ol>

        {/* module CTA */}
        {area.module && (
          <div style={{ background:T.greenL, border:"1px solid #dde7cd", borderRadius:9, padding:"15px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:16 }}>
            <div>
              <p style={{ fontSize:14.5, fontWeight:600, color:T.dgreen, margin:0 }}>Work through this together in MFP</p>
              <p style={{ fontSize:13, color:T.fgM, margin:"3px 0 0", maxWidth:460 }}>The guided {AP_MODULE_LABEL[area.module]} module walks this with you and writes the numbers back into the plan.</p>
            </div>
            <button onClick={startModule} style={btnStyle("primary")}>Start module</button>
          </div>
        )}

        <p style={{ fontSize:13.5, color:T.fgM, margin:"0 0 18px" }}><b style={{ color:T.navy, fontWeight:600 }}>Your relationship manager</b> {d.lender}</p>

        {/* tools */}
        <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:17 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:12, flexWrap:"wrap", marginBottom:12 }}>
            <span style={{ fontSize:11, letterSpacing:"0.13em", color:T.fgS, textTransform:"uppercase" }}>Tools matched to this action</span>
            <span style={{ fontSize:11.5, color:T.fgS }}>{d.toolcount}</span>
          </div>
          {d.tools.length ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12 }}>
              {d.tools.map((t,i) => (
                <div key={i} style={{ background:T.bgAlt, borderRadius:8, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:8 }}>
                    <p style={{ fontSize:14.5, fontWeight:600, margin:0, color:T.fg }}>{t[0]}</p>
                    <p style={{ fontSize:11, color:T.fgS, margin:0, whiteSpace:"nowrap" }}>{t[1]}</p>
                  </div>
                  <p style={{ fontSize:12.5, color:T.fgM, margin:"4px 0 8px" }}>{t[2]}</p>
                  <p style={{ fontSize:12, color:T.green, margin:0 }}>▸ {t[3]}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize:12.5, color:T.fgS, margin:0 }}>No partner tools are matched to this area. The steps above and a conversation with your lender are the path here.</p>
          )}
        </div>
      </div>

      {/* pager */}
      <div style={{ display:"flex", justifyContent:"space-between", gap:12, marginBottom:26 }}>
        <button onClick={()=>setPri(p=>Math.max(0,p-1))} disabled={pri===0} style={{ ...btnStyle("outline"), opacity:pri===0?0.45:1, cursor:pri===0?"default":"pointer" }}>← Previous priority</button>
        <button onClick={()=>setPri(p=>Math.min(2,p+1))} disabled={pri===2} style={{ ...btnStyle("outline"), opacity:pri===2?0.45:1, cursor:pri===2?"default":"pointer" }}>Next priority →</button>
      </div>
      </>)}

      {view==="glance" && (<>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Farm snapshot</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
          {snapField("Location (state/county)", "location", "e.g., Minnehaha, SD")}
          {snapField("Size", "size", "e.g., 2,000 acres")}
          {snapField("Production mix", "productionMix", "e.g., Corn, soy, oats, cow-calf")}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {snapField("Business ventures beyond production", "ventures", "e.g., diesel repair shop, seed dealership, custom planting/harvest services")}
          {snapField("Gross farm income", "grossIncome", "e.g., 400000")}
          <div style={{ background:T.bgAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
              <span style={{ fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em" }}>Diversification concentration</span>
              <span title="Computed from your selected enterprises in Financial Analysis plus your selected paths in Revenue Diversification." style={{ fontSize:11, color:T.fgS, cursor:"help" }}>ⓘ</span>
            </div>
            {divLabel ? (<span style={pillStyle(sourceCount<=1?"vuln":sourceCount<=3?"watch":"strong")}>{divLabel}</span>) : (<div style={{ fontSize:13.5, fontStyle:"italic", color:T.fgS }}>Not scored yet</div>)}
            {sourceCount>0 && <div style={{ fontSize:11, color:T.fgS, marginTop:6 }}>{sourceCount} income source{sourceCount!==1?"s":""} across FA + RD</div>}
          </div>
        </div>
      </div>

      <div style={cardStyle()}>
        <div style={cardLblStyle()}>SWOT analysis</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:16, lineHeight:1.55 }}>Strengths and weaknesses are internal, what is already true about the operation. Opportunities and threats are external, what is happening around it. Every line below is editable and meant to be replaced with this operation's own read.</div>
        {[
          { kind:"s", tag:"STRENGTH", heading:"What the operation already does well", field:"swotStrengths", source:"Internal · from your assessment and farm profile" },
          { kind:"w", tag:"WEAKNESS", heading:"Where the operation is currently limited", field:"swotWeaknesses", source:"Internal · from your assessment and farm profile" },
          { kind:"o", tag:"OPPORTUNITY", heading:"What the operation could move toward", field:"swotOpportunities", source:"External · from EagleEye market intelligence" },
          { kind:"t", tag:"THREAT", heading:"What could disrupt the operation", field:"swotThreats", source:"External · from EagleEye market intelligence" },
        ].map(q => (
          <FindingBlock key={q.field} kind={q.kind} tag={q.tag} heading={q.heading} source={q.source}>
            <textarea style={inputStyle({ minHeight:56, border:"none", background:"transparent", padding:0, fontSize:13.5, color:T.fgM, resize:"vertical", lineHeight:1.6 })} value={profile[q.field]||""} onChange={set(q.field)} placeholder="Add what is true for this operation" />
          </FindingBlock>
        ))}
      </div>

      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Strategy & values</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:16, lineHeight:1.55 }}>What the operation is trying to become, and what it will not trade away to get there. These four answers set the filter every diversification and risk decision gets tested against.</div>
        {[
          { kind:"w", tag:"NEAR TERM", heading:"Objectives for the next one to three years", field:"nearTerm", source:"From your farm profile · revisit each year" },
          { kind:"o", tag:"LONG TERM", heading:"Where the operation is headed beyond that", field:"longTerm", source:"From your farm profile · revisit each year" },
          { kind:"s", tag:"ADVANTAGE", heading:"What this operation does better than its peers", field:"advantage", source:"From your farm profile · tested against benchmarking" },
          { kind:"neutral", tag:"CORE VALUES", heading:"What the operation will not trade away", field:"values", source:"From your farm profile · applied in the values check" },
        ].map(q => (
          <FindingBlock key={q.field} kind={q.kind} tag={q.tag} heading={q.heading} source={q.source}>
            <textarea style={inputStyle({ minHeight:52, border:"none", background:"transparent", padding:0, fontSize:13.5, color:T.fgM, resize:"vertical", lineHeight:1.6 })} value={profile[q.field]||""} onChange={set(q.field)} placeholder="Add what is true for this operation" />
          </FindingBlock>
        ))}
      </div>

      <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={cardLblStyle({ marginBottom:0 })}>Whole-farm financial health</div>
          {!faHasData && <button onClick={()=>goFA(3)} style={{ ...btnStyle("outline"), fontSize:11.5, padding:"6px 14px" }}>Go to Financial Analysis →</button>}
        </div>
        {faHasData ? (
          <>
            <div style={{ fontSize:12.5, color:T.fgM, marginBottom:16, lineHeight:1.55 }}>Four categories, pulled live from the financial data in Financial Analysis. Each category takes the weakest of its ratios, so one soft number is never hidden behind two strong ones.</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
              {faCategories.map(c => (
                <div key={c.id} style={{ background:T.bgAlt, borderRadius:8, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <span style={{ fontSize:14, fontWeight:600, color:T.navy }}>{c.label}</span>
                    <span style={pillStyle(c.status)}>{c.status==="blank"?"not scored":c.status}</span>
                  </div>
                  <div style={{ fontSize:11.5, color:T.fgS, marginBottom:10, lineHeight:1.45 }}>{c.desc}</div>
                  {c.ratios.map((r,i) => (
                    <div key={r.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:10, padding:"6px 0", borderBottom:i<c.ratios.length-1?`1px dashed ${T.border}`:"none" }}>
                      <span style={{ fontSize:12, color:T.fgM }}>{r.label}</span>
                      <span style={{ fontSize:13.5, fontWeight:600, color:scColor(r.status), whiteSpace:"nowrap" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ fontSize:13.5, fontStyle:"italic", color:T.fgS }}>Not scored yet. Complete the financial data in Financial Analysis to see liquidity, solvency, sustainable growth and efficiency here.</div>
        )}
      </div>

      <div style={cardStyle({ borderTop:`4px solid ${T.blue}` })}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, gap:12, flexWrap:"wrap" }}>
          <div style={cardLblStyle({ marginBottom:0 })}>Opportunities for your lender</div>
          <span style={{ fontSize:11.5, color:T.fgS }}>{lenderOpps.length ? `${lenderOpps.length} surfaced from Financial Analysis` : "Nothing surfaced yet"}</span>
        </div>
        {faHasData ? (
          lenderOpps.length ? (
            <>
              <div style={{ fontSize:12.5, color:T.fgM, marginBottom:16, lineHeight:1.55 }}>Read straight off the financial analysis, not a product list. Each one names the ratio that triggered it, so the conversation starts from this operation's own numbers.</div>
              {lenderOpps.map((o,i) => (
                <FindingBlock key={i} kind={o.kind} tag={o.tag} heading={o.title} source={o.signal}>
                  <p style={{ fontSize:13.5, color:T.fgM, margin:0, lineHeight:1.6 }}>{o.body}</p>
                </FindingBlock>
              ))}
              <Flag type="info">These are conversation starters drawn from ratio thresholds, not credit decisions or product recommendations. Which ones are actually appropriate depends on the full credit picture.</Flag>
            </>
          ) : (
            <div style={{ fontSize:13.5, fontStyle:"italic", color:T.fgS }}>No thresholds tripped. On the numbers entered, this operation is not showing a financial condition that points to a specific lender action.</div>
          )
        ) : (
          <div style={{ fontSize:13.5, fontStyle:"italic", color:T.fgS }}>Not available yet. Complete the financial data in Financial Analysis and any lender-relevant conditions will surface here.</div>
        )}
      </div>

      <div style={cardStyle({ borderTop:`4px solid ${T.navy}` })}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, gap:12, flexWrap:"wrap" }}>
          <div style={cardLblStyle({ marginBottom:0 })}>MFP assessment scores</div>
          <span style={{ fontSize:11.5, color:T.fgS }}>Four categories, twelve dimensions</span>
        </div>

        {/* overall */}
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", gap:14, background:T.bgAlt, borderRadius:8, padding:"14px 18px", marginBottom:16 }}>
          <span style={{ fontSize:13.5, color:T.fgM }}><b style={{ color:T.fg, fontWeight:600 }}>Your whole farm business</b> <span style={{ color:T.fgS, fontSize:12 }}>— overall MFP score</span></span>
          <span style={{ fontSize:28, fontWeight:600, color:T.navy, whiteSpace:"nowrap" }}>{apOverall}<span style={{ fontSize:13, fontWeight:400, color:T.fgS }}> / 100</span></span>
        </div>

        {/* four categories */}
        <div style={{ fontSize:11, letterSpacing:"0.13em", color:T.fgS, textTransform:"uppercase", marginBottom:10 }}>Category scores</div>
        <div style={{ marginBottom:20 }}>
          {Object.entries(AP_CATS).map(([cid,c]) => {
            const st = c.score>=67?"strong":c.score>=34?"watch":"vuln";
            return (
              <div key={cid} style={{ display:"flex", alignItems:"center", gap:14, padding:"9px 0", borderBottom:`1px dashed ${T.border}` }}>
                <span style={{ width:170, fontSize:13.5, fontWeight:600, color:T.fg, flexShrink:0 }}>{c.label}</span>
                <div style={{ flex:1, height:8, background:"#dde1e8", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${c.score}%`, height:"100%", background:scColor(st), borderRadius:4 }} />
                </div>
                <span style={{ width:62, textAlign:"right", fontSize:15, fontWeight:600, color:scColor(st), flexShrink:0 }}>{c.score}<span style={{ fontSize:11, fontWeight:400, color:T.fgS }}> /100</span></span>
              </div>
            );
          })}
        </div>

        {/* twelve dimensions, grouped by category */}
        <div style={{ fontSize:11, letterSpacing:"0.13em", color:T.fgS, textTransform:"uppercase", marginBottom:10 }}>Dimension index scores</div>
        {Object.entries(AP_CATS).map(([cid,c]) => (
          <div key={cid} style={{ marginBottom:14 }}>
            <div style={{ fontSize:11.5, fontWeight:600, color:T.blue, marginBottom:5 }}>{c.label}</div>
            {AP_AREAS.filter(a => a.cat===cid).map(a => {
              const st = a.score>=3.5?"strong":a.score>=2.5?"watch":"vuln";
              return (
                <div key={a.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"6px 0 6px 12px", borderLeft:`2px solid ${T.div}` }}>
                  <span style={{ width:26, fontSize:11, color:T.fgS, flexShrink:0 }}>{String(a.n).padStart(2,"0")}</span>
                  <span style={{ width:200, fontSize:12.5, color:T.fgM, flexShrink:0 }}>{a.label}</span>
                  <div style={{ flex:1, height:6, background:"#dde1e8", borderRadius:3, overflow:"hidden" }}>
                    <div style={{ width:`${(a.score/5)*100}%`, height:"100%", background:scColor(st), borderRadius:3 }} />
                  </div>
                  <span style={{ width:50, textAlign:"right", fontSize:13, fontWeight:600, color:scColor(st), flexShrink:0 }}>{a.score.toFixed(1)}<span style={{ fontSize:10.5, fontWeight:400, color:T.fgS }}> /5</span></span>
                  {a.module && <span style={{ ...pillStyle("strong"), flexShrink:0 }}>module</span>}
                </div>
              );
            })}
          </div>
        ))}
        <Flag type="info">The three lowest-scoring dimensions, weighted for whether they gate other progress or drive near-term lift, become the priorities on the Priority actions tab.</Flag>
      </div>

      <Flag type="info">This profile is shared across all three modules. Financial Analysis and Revenue Diversification each offer a one-click way to pull matching fields from here instead of re-entering them.</Flag>
      </>)}
    </div>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// LEGACY — Transition readiness
// ═════════════════════════════════════════════════════════════════════════════
// Deliberately does NOT open with assets. Operational transition is about who runs
// the business; succession is about who owns it. This module tests the operating
// question so the ownership question can be answered honestly, and hands off to
// Legacy Acres for the inventory only once the family is actually ready for it.
//
// Three rules this module holds to: the three transfers stay separated everywhere,
// nothing here scores the family, and the tool is willing to say "not yet".

const LEG_STAGES = [
  { n:1,  label:"Where you are today" },
  { n:2,  label:"The three transfers" },
  { n:3,  label:"The next chapter" },
  { n:4,  label:"Two households" },
  { n:5,  label:"Successor readiness" },
  { n:6,  label:"Who knows what" },
  { n:7,  label:"Fair is not equal" },
  { n:8,  label:"Triggers & contingencies" },
  { n:9,  label:"Rented ground & relationships" },
  { n:10, label:"Where this leaves you" },
];

const TRANSFERS = [
  { id:"labor",      label:"Labor",      desc:"Who does the physical work" },
  { id:"management", label:"Management", desc:"Who makes the decisions" },
  { id:"ownership",  label:"Ownership",  desc:"Whose name is on the asset" },
];
const HORIZONS = [
  { id:"now",  label:"Today" },
  { id:"y3",   label:"In 3 years" },
  { id:"y5",   label:"In 5 years" },
  { id:"y10",  label:"In 10 years" },
];

// Exposure, not competence. Each unchecked item is a specific decision to hand over.
const SUCCESSOR_EXPOSURE = [
  { id:"lease",     label:"Negotiated a lease on their own" },
  { id:"loan",      label:"Sat a loan meeting without you in the room" },
  { id:"marketing", label:"Made a grain or livestock marketing decision alone" },
  { id:"hire",      label:"Hired or let go of someone" },
  { id:"capital",   label:"Chosen a capital purchase and lived with it" },
  { id:"landlord",  label:"Handled a landlord conversation start to finish" },
  { id:"budget",    label:"Built and managed a full crop or enterprise budget" },
];

const KNOWS_WHAT = [
  { id:"successor",   label:"The successor" },
  { id:"seniorSpouse",label:"Senior generation spouse" },
  { id:"succSpouse",  label:"Successor's spouse or partner" },
  { id:"offFarm",     label:"Off-farm children" },
  { id:"advisors",    label:"Attorney, accountant, lender" },
];
const KNOWS_LEVEL = ["Not discussed", "Assumed but never said", "Talked about it", "In writing"];

const FAIR_APPROACHES = [
  { id:"insurance", label:"Life insurance funds the non-farm heirs", body:"Land stays whole and stays farmed. The off-farm heirs are made whole in cash rather than in acres." },
  { id:"splitOwn",  label:"Separate ownership from operating rights", body:"Off-farm heirs hold land; the on-farm heir holds a long-term lease with a right of first refusal. Everyone owns something, one person farms it." },
  { id:"buysell",   label:"Buy-sell agreement with an agreed formula", body:"The valuation method is settled now, in calm conditions, rather than argued later at the worst possible moment." },
  { id:"sweat",     label:"Explicit credit for sweat equity", body:"The on-farm heir's years of below-market wages are written down as a number rather than left as an unspoken debt." },
];

const CONTINGENCIES = [
  { id:"death",       label:"Death", note:"The one most plans are built around." },
  { id:"disability",  label:"Disability", note:"More likely than death during the transition window and harder on the business. It consumes cash and attention at the same time while triggering none of the estate mechanisms.", weight:true },
  { id:"divorce",     label:"Divorce", note:"Either generation. Can put farm assets in front of a court." },
  { id:"disagreement",label:"Disagreement", note:"The two generations stop being able to work together." },
  { id:"disinterest", label:"Disinterest", note:"The successor decides in five years that they do not want it after all." },
];

const READINESS_TIERS = {
  conversation: { label:"Conversation stage", pill:"vuln",
    signal:"Assumptions have not been voiced, successor clarity is missing, or the identity question is unanswered.",
    rec:"Have the structured family conversation first. An asset inventory right now would be premature, and filling one out will not move anything." },
  operational: { label:"Operational stage", pill:"watch",
    signal:"A successor is identified, but management transfer has not started or is incomplete.",
    rec:"Work the management handover list from the successor readiness stage. You can begin the asset inventory alongside it." },
  structural: { label:"Structural stage", pill:"watch",
    signal:"Management is genuinely transferring, the two-household math is done, and the family is broadly aligned.",
    rec:"Full asset inventory and valuation in Legacy Acres, then take it to your advisors." },
  execution: { label:"Execution stage", pill:"strong",
    signal:"The decisions are made. What is missing is the paperwork.",
    rec:"Take the output to your attorney, accountant, and lender. This module has done its job." },
};

// Tier is derived from process state, never from a judgement about the family.
const legacyTier = (leg) => {
  const d = leg.data || {};
  const t = d.transfers || {};
  const mgmtNow = Number((t.management||{}).now || 0);
  const hasSuccessor = d.successorStatus === "identified" || d.successorStatus === "working";
  const noSuccessorPath = d.successorStatus === "none" && !!d.noSuccessorPath;
  const identityAnswered = !!(d.nextChapterWeek && d.nextChapterRole);
  const householdsDone = !!d.householdModelled;
  const toldKey = ["successor","seniorSpouse","offFarm"].every(k => { const v=(d.knows||{})[k]; return v === 2 || v === 3; });
  const fairWritten = (d.fairParagraph||"").trim().length > 40;
  const contingenciesDone = CONTINGENCIES.filter(c => ((d.contingency||{})[c.id]||"").trim().length > 3).length >= 3;

  if (!(hasSuccessor || noSuccessorPath) || !identityAnswered || !toldKey) return "conversation";
  if (mgmtNow < 30) return "operational";
  if (!householdsDone || !fairWritten) return "structural";
  if (contingenciesDone) return "execution";
  return "structural";
};

const legRow = (label, children, sub) => (
  <div style={{ marginBottom:16 }}>
    <label style={labelStyle}>{label}</label>
    {sub && <div style={{ fontSize:11.5, color:T.fgS, marginBottom:6, fontStyle:"italic" }}>{sub}</div>}
    {children}
  </div>
);



// ═════════════════════════════════════════════════════════════════════════════
// LAND VALUATION — Phase 1 engine
// ═════════════════════════════════════════════════════════════════════════════
// Land class routes to a method rather than one model with adjustments bolted on.
// Two independent methods run on income-producing classes and their divergence
// sets confidence, so the tier is derived rather than asserted. Refer-out classes
// return no number at all, which is the point: a tool that knows what it does not
// know is worth more than one that returns a number for everything.
//
// WHAT IS NOT HERE: live USDA SDA soil queries and live NASS ingestion. The spec
// is explicit that both belong in a scheduled batch job writing to our own table,
// which needs a backend this app does not have yet. Benchmarks below are labelled
// placeholders and every one is user-overridable. Provenance records which is which,
// so a placeholder can never be mistaken for a USDA figure.

const LAND_CLASSES = [
  { id:"dryland",   label:"Dryland row crop",       methods:"both",   series:"cropland",   conf:"High",   note:"Soil-driven. The method works best here." },
  { id:"irrigated", label:"Irrigated row crop",     methods:"both",   series:"irrigated",  conf:"Medium", note:"Water right is flagged separately and is not valued here." },
  { id:"pasture",   label:"Pasture / rangeland",    methods:"both",   series:"pasture",    conf:"Medium", note:"Carrying capacity matters more than soil index in the West." },
  { id:"crp",       label:"CRP / conservation",     methods:"incomeOnly", series:"cropland", conf:"Medium", note:"Valued off the contract payment, not a rental market." },
  { id:"nontillable",label:"Non-tillable",          methods:"discount", series:"cropland",  conf:"Low",    note:"Woods, waste, wetland, roads. Discounted against the parcel's class." },
  { id:"timber",    label:"Timberland",             methods:"refer",  series:null,         conf:"Refer",  note:"Value is standing volume and stumpage market. Not derivable from soil and a county average." },
  { id:"permanent", label:"Permanent crops",        methods:"refer",  series:null,         conf:"Refer",  note:"Orchard, vineyard, grove. Value is in the trees, their age and variety, and the water." },
  { id:"farmstead", label:"Farmstead / building site", methods:"refer", series:null,       conf:"Refer",  note:"Improvements dominate. Handled as a separate asset class." },
];

// PLACEHOLDER benchmarks. Approximate, round, and not USDA figures. They exist so
// the engine runs and the maths is inspectable before the ingestion job is built.
// Every one is editable per parcel and provenance marks the source as placeholder.
const BENCH_PLACEHOLDER = {
  IA:{cropland:11500,irrigated:12500,pasture:3900,rentCropland:280,rentIrrigated:300,rentPasture:60,nccpiMean:0.72},
  IL:{cropland:9800, irrigated:10500,pasture:3400,rentCropland:265,rentIrrigated:285,rentPasture:55,nccpiMean:0.70},
  IN:{cropland:8600, irrigated:9200, pasture:3100,rentCropland:245,rentIrrigated:265,rentPasture:52,nccpiMean:0.66},
  MN:{cropland:8100, irrigated:8800, pasture:2600,rentCropland:225,rentIrrigated:245,rentPasture:45,nccpiMean:0.63},
  NE:{cropland:6400, irrigated:9100, pasture:1300,rentCropland:175,rentIrrigated:275,rentPasture:32,nccpiMean:0.55},
  OH:{cropland:7900, irrigated:8300, pasture:2900,rentCropland:215,rentIrrigated:230,rentPasture:48,nccpiMean:0.64},
  SD:{cropland:4200, irrigated:5600, pasture:1500,rentCropland:145,rentIrrigated:190,rentPasture:35,nccpiMean:0.50},
  ND:{cropland:3100, irrigated:4200, pasture:1000,rentCropland:110,rentIrrigated:150,rentPasture:25,nccpiMean:0.47},
  KS:{cropland:3300, irrigated:5200, pasture:1600,rentCropland:105,rentIrrigated:180,rentPasture:28,nccpiMean:0.46},
  MO:{cropland:5600, irrigated:6400, pasture:3000,rentCropland:165,rentIrrigated:195,rentPasture:45,nccpiMean:0.54},
  WI:{cropland:6100, irrigated:6700, pasture:2700,rentCropland:160,rentIrrigated:180,rentPasture:48,nccpiMean:0.58},
  KY:{cropland:5400, irrigated:5900, pasture:3600,rentCropland:160,rentIrrigated:175,rentPasture:42,nccpiMean:0.52},
  TX:{cropland:2600, irrigated:4400, pasture:2200,rentCropland:45, rentIrrigated:130,rentPasture:8, nccpiMean:0.38},
  MT:{cropland:1400, irrigated:3200, pasture:900, rentCropland:38, rentIrrigated:110,rentPasture:9, nccpiMean:0.34},
  CO:{cropland:2400, irrigated:5100, pasture:900, rentCropland:55, rentIrrigated:160,rentPasture:10,nccpiMean:0.40},
};
const BENCH_STATES = Object.keys(BENCH_PLACEHOLDER);
const NONTILLABLE_RATE = 0.35; // fraction of the parcel class rate applied to non-tillable acres

const lcOf = (id) => LAND_CLASSES.find(c => c.id === id) || LAND_CLASSES[0];

// Runs the routed valuation for one parcel and returns the numbers plus the
// provenance needed to reproduce it later, which is the whole point of the design.
const valueParcel = (p) => {
  const cls = lcOf(p.landClass);
  const bench = BENCH_PLACEHOLDER[p.state] || null;
  const deeded = parseFloat(p.deededAcres) || 0;
  const tillable = parseFloat(p.tillableAcres) || 0;
  const nonTillable = Math.max(0, deeded - tillable);

  const base = { cls, requiresAppraisal:false, methodA:null, methodB:null, divergence:null,
                 confidence:cls.conf, low:null, mid:null, high:null, provenance:{} };

  if (cls.methods === "refer") {
    return { ...base, requiresAppraisal:true,
      why:`${cls.label} is outside the model. ${cls.note}`,
      provenance:{ landClass:cls.id, routed:"refer-out", reason:cls.note } };
  }
  if (!bench) {
    return { ...base, requiresAppraisal:true,
      why:"No benchmark is loaded for this state yet. Enter a value per acre manually, or wait for the benchmark ingestion job.",
      provenance:{ landClass:cls.id, routed:"no-benchmark", state:p.state || "not set" } };
  }

  const seriesKey = cls.series === "irrigated" ? "irrigated" : cls.series === "pasture" ? "pasture" : "cropland";
  const rentKey   = seriesKey === "irrigated" ? "rentIrrigated" : seriesKey === "pasture" ? "rentPasture" : "rentCropland";
  const benchVal  = parseFloat(p.benchOverride) || bench[seriesKey];
  const cashRent  = parseFloat(p.rentOverride)  || bench[rentKey];
  const meanNccpi = bench.nccpiMean;
  const parcelNccpi = parseFloat(p.nccpi) || meanNccpi;      // falls back to the state mean
  const usedRegionalSoil = !p.nccpi;
  const prodMult  = meanNccpi > 0 ? parcelNccpi / meanNccpi : 1;

  // Method A — sales comparison proxy, productivity indexed
  const methodA = benchVal * prodMult * tillable + nonTillable * (benchVal * NONTILLABLE_RATE);

  // Cap rate is derived from the STATE table baseline, never from a parcel override.
  // Deriving it from the overridden benchmark would make Method B track Method A
  // algebraically (B reduces to benchmark x acres), and the convergence check would
  // read zero on exactly the parcels it exists to catch. Anchoring the rate to the
  // state baseline is what lets an override on one method contradict the other.
  const baselineBench = bench[seriesKey];
  const baselineRent  = bench[rentKey];
  const derivedCap = baselineBench > 0 ? baselineRent / baselineBench : 0;
  const capRate = parseFloat(p.capOverride) ? parseFloat(p.capOverride)/100 : derivedCap;
  const capDerivation = parseFloat(p.capOverride) ? "user_supplied" : "derived_from_state_baseline";

  // Method B — income capitalisation. CRP uses the contract payment as the stream.
  let methodB = null;
  if (cls.methods === "both" && capRate > 0) methodB = (cashRent * tillable) / capRate;
  if (cls.methods === "incomeOnly" && capRate > 0) {
    const crpRate = parseFloat(p.crpPayment) || 0;
    methodB = crpRate > 0 ? (crpRate * tillable) / capRate : null;
  }
  if (cls.methods === "discount") methodB = null;

  let divergence = null, confidence = cls.conf, requiresAppraisal = false, why = null;
  if (methodA && methodB) {
    divergence = Math.abs(methodA - methodB) / ((methodA + methodB) / 2);
    if (divergence < 0.15) confidence = "High";
    else if (divergence <= 0.35) confidence = "Medium";
    else { confidence = "Low"; requiresAppraisal = true;
      why = "Comparable-sales methods value this ground well above what its rental income supports, which often indicates non-agricultural development value. This parcel is a good candidate for a professional appraisal."; }
  }

  const vals = [methodA, methodB].filter(v => v && v > 0);
  const mid = vals.length ? vals.reduce((a,b)=>a+b,0) / vals.length : null;
  const low = vals.length ? Math.min(...vals) : null;
  const high = vals.length ? Math.max(...vals) : null;

  return {
    cls, methodA, methodB, divergence, confidence, requiresAppraisal, why,
    low, mid, high,
    provenance: {
      landClass: cls.id,
      benchmark: benchVal, benchmarkSource: p.benchOverride ? "user_supplied" : "placeholder_table",
      benchmarkVintage: p.benchOverride ? "entered by user" : "placeholder, pending NASS ingestion",
      series: seriesKey, cashRent, cashRentSource: p.rentOverride ? "user_supplied" : "placeholder_table",
      nccpi: parcelNccpi, nccpiSource: usedRegionalSoil ? "state mean, no boundary supplied" : "user_supplied",
      stateMeanNccpi: meanNccpi, productivityMultiplier: prodMult,
      capRate, capRateDerivation: capDerivation,
      capRateCaveat: capDerivation === "derived_from_state_baseline" ? "Derived from the same benchmark series as Method A, so the two methods are only partially independent at state-average productivity. A published regional cap rate would separate them properly." : null,
      tillableAcres: tillable, nonTillableAcres: nonTillable, nonTillableRate: NONTILLABLE_RATE,
      methodVersion: "phase1-v1",
    },
  };
};

// ── Stage 1 — Where you are today ────────────────────────────────────────────
function LEG1({ leg, setLegData }) {
  const d = leg.data || {};
  const v = (k) => d[k] || "";
  const set = (k) => (e) => setLegData({ [k]: e.target.value });
  return (
    <div>
      <Head eyebrow="Legacy · Stage 1" title="Where you are today" sub="Before anything hard, just the situation. Who is involved, who is on the farm, who is not, and whether anything is written down." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>The people</div>
        {legRow("Who is involved in the operation today, and what does each person do?",
          <textarea style={inputStyle({ minHeight:78 })} value={v("people")} onChange={set("people")} placeholder="Names, roles, rough ages. Include anyone whose absence would be felt." />)}
        {legRow("Who is off the farm but still part of the family picture?",
          <textarea style={inputStyle({ minHeight:60 })} value={v("offFarmPeople")} onChange={set("offFarmPeople")} placeholder="Off-farm children, siblings with an interest in the ground, anyone with an expectation." />,
          "These are the people most often left out and the most common source of trouble later.")}
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>The successor question</div>
        {legRow("Is there an identified successor?",
          <select style={inputStyle()} value={v("successorStatus")} onChange={set("successorStatus")}>
            <option value="">Select</option>
            <option value="working">Yes, and they are already working in the business</option>
            <option value="identified">Yes, identified but not yet involved day to day</option>
            <option value="maybe">Maybe, more than one candidate or nobody has said it out loud</option>
            <option value="none">No, there is no successor</option>
          </select>)}
        {d.successorStatus === "none" && (
          <>
            <Flag type="info">No successor is a legitimate path, not a failure. Families in this position are the worst served by most succession tools and often the most stuck. It has its own track and it deserves the same rigour.</Flag>
            {legRow("Which direction makes most sense to explore?",
              <select style={inputStyle()} value={v("noSuccessorPath")} onChange={set("noSuccessorPath")}>
                <option value="">Select</option>
                <option value="sale">Orderly sale of the operation</option>
                <option value="lease">Lease the ground to a neighbouring operation</option>
                <option value="employee">Transition to a non-family employee</option>
                <option value="winddown">Planned wind-down over a set number of years</option>
                <option value="unsure">Genuinely unsure, that is the question</option>
              </select>)}
          </>
        )}
        {d.successorStatus === "maybe" && (
          <Flag type="warn">More than one candidate, or nobody having said it out loud, is the most common starting point. Naming it is the work of the next few stages rather than something to resolve here.</Flag>
        )}
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>What exists on paper</div>
        {legRow("What is in writing today?",
          <textarea style={inputStyle({ minHeight:64 })} value={v("inWriting")} onChange={set("inWriting")} placeholder="Wills, trusts, operating agreements, buy-sell, leases, anything. If the answer is nothing, that is a common and useful answer." />)}
        {legRow("If you had to hand the whole thing over Monday morning, what would break first?",
          <textarea style={inputStyle({ minHeight:64 })} value={v("breakFirst")} onChange={set("breakFirst")} placeholder="" />,
          "This one question usually locates the real gap faster than anything else in the module.")}
      </div>
    </div>
  );
}

// ── Stage 2 — The three transfers ────────────────────────────────────────────
function LEG2({ leg, setLegData }) {
  const d = leg.data || {};
  const t = d.transfers || {};
  const setT = (tid, hid, val) => setLegData({ transfers:{ ...t, [tid]:{ ...(t[tid]||{}), [hid]:val } } });
  const gap = (tid) => {
    const now = Number((t[tid]||{}).now || 0), y10 = Number((t[tid]||{}).y10 || 0);
    return y10 - now;
  };
  return (
    <div>
      <Head eyebrow="Legacy · Stage 2" title="The three transfers" sub="Labor, management, and ownership move independently. Farmers experience transition as one event, which is what creates the standoff. Separating them is most of the work." />
      <Flag type="info">Zero means entirely senior generation. One hundred means entirely successor. Set where each one sits today, then where it should sit at each horizon.</Flag>
      {TRANSFERS.map(tr => (
        <div key={tr.id} style={cardStyle()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:12, flexWrap:"wrap", marginBottom:4 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:T.navy }}>{tr.label}</div>
              <div style={{ fontSize:12.5, color:T.fgS }}>{tr.desc}</div>
            </div>
            {gap(tr.id) !== 0 && <span style={pillStyle(gap(tr.id) > 0 ? "info" : "watch")}>{gap(tr.id) > 0 ? `+${gap(tr.id)} points over ten years` : "moving backward"}</span>}
          </div>
          {HORIZONS.map(h => {
            const val = Number((t[tr.id]||{})[h.id] || 0);
            return (
              <div key={h.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"7px 0" }}>
                <span style={{ width:82, fontSize:12.5, color:T.fgM, flexShrink:0 }}>{h.label}</span>
                <input type="range" min="0" max="100" step="5" value={val} onChange={e=>setT(tr.id, h.id, e.target.value)} style={{ flex:1 }} />
                <span style={{ width:74, textAlign:"right", fontSize:12.5, color:T.fgM, flexShrink:0 }}>{val}% successor</span>
              </div>
            );
          })}
        </div>
      ))}
      <div style={cardStyle({ borderTop:`4px solid ${T.navy}` })}>
        <div style={cardLblStyle()}>What this looks like on a timeline</div>
        <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:120, padding:"0 4px", marginBottom:8 }}>
          {HORIZONS.map(h => (
            <div key={h.id} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:96 }}>
                {TRANSFERS.map((tr,k) => {
                  const val = Number((t[tr.id]||{})[h.id] || 0);
                  const col = [T.moss, T.blue, T.navy][k];
                  return <div key={tr.id} title={`${tr.label} ${val}%`} style={{ width:16, height:`${Math.max(2,val)}%`, background:col, borderRadius:"2px 2px 0 0" }} />;
                })}
              </div>
              <span style={{ fontSize:11, color:T.fgS }}>{h.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          {TRANSFERS.map((tr,k) => (
            <span key={tr.id} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:T.fgM }}>
              <span style={{ width:10, height:10, borderRadius:2, background:[T.moss,T.blue,T.navy][k] }} />{tr.label}
            </span>
          ))}
        </div>
        {Number((t.labor||{}).now||0) - Number((t.management||{}).now||0) >= 30 && (
          <div style={{ marginTop:14 }}>
            <Flag type="warn">Labor has transferred considerably further than management. This is the single most common pattern in stalled transitions: the successor has been doing the work for years without ever making the calls. It is also the most fixable, and the successor readiness stage turns it into a specific list.</Flag>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stage 3 — The next chapter ───────────────────────────────────────────────
function LEG3({ leg, setLegData }) {
  const d = leg.data || {};
  const v = (k) => d[k] || "";
  const set = (k) => (e) => setLegData({ [k]: e.target.value });
  return (
    <div>
      <Head eyebrow="Legacy · Stage 3" title="The next chapter" sub="Asked before anything financial, because this is where most plans actually stall. For many operators the farm is not what they do, it is who they are, and transition can read as erasure." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>For the senior generation</div>
        {legRow("What does your week look like in the first year after transition?",
          <textarea style={inputStyle({ minHeight:74 })} value={v("nextChapterWeek")} onChange={set("nextChapterWeek")} placeholder="Not what you will stop doing. What you will actually be doing." />)}
        {legRow("What are you still responsible for?",
          <textarea style={inputStyle({ minHeight:64 })} value={v("nextChapterRole")} onChange={set("nextChapterRole")} placeholder="Something real and specific. Marketing, the cattle, the landlord relationships, the books." />,
          "A defined ongoing role, written down, is the artifact that unlocks conversations that otherwise never happen. Even a modest one.")}
        {legRow("What would you miss most?",
          <textarea style={inputStyle({ minHeight:60 })} value={v("missMost")} onChange={set("missMost")} placeholder="" />)}
        {legRow("Have you told anyone what you just wrote here?",
          <select style={inputStyle()} value={v("toldNextChapter")} onChange={set("toldNextChapter")}>
            <option value="">Select</option>
            <option value="no">No, this is the first time it has been said</option>
            <option value="spouse">My spouse knows</option>
            <option value="successor">The successor and I have discussed it</option>
            <option value="family">The whole family has discussed it</option>
          </select>)}
      </div>
      {v("nextChapterRole") && (
        <div style={cardStyle({ borderTop:`4px solid ${T.moss}` })}>
          <div style={cardLblStyle()}>Your ongoing role, in writing</div>
          <div style={{ borderLeft:`2px solid ${T.moss}`, background:T.greenL, borderRadius:"0 5px 5px 0", padding:"13px 16px", fontSize:14, color:T.fg, lineHeight:1.6 }}>{v("nextChapterRole")}</div>
          <p style={{ fontSize:12.5, color:T.fgM, marginTop:10, marginBottom:0 }}>This is a deliverable, not a note. It travels into the plan and it is worth reading out loud to the successor.</p>
        </div>
      )}
    </div>
  );
}

// ── Stage 4 — Two households ─────────────────────────────────────────────────
function LEG4({ leg, setLegData, fa }) {
  const d = leg.data || {};
  const v = (k) => d[k] || "";
  const set = (k) => (e) => setLegData({ [k]: e.target.value });
  const n = (k) => parseFloat(d[k]) || 0;
  const { hasData, nfifo } = computeFARatios(fa.s3vals);
  const draws = n("seniorDraw") + n("succDraw");
  const covered = hasData && nfifo !== null ? nfifo - draws : null;
  const independent = n("seniorNonFarmIncome");
  return (
    <div>
      <Head eyebrow="Legacy · Stage 4" title="Can the operation support two households?" sub="The financial question that governs everything else, and the honest answer is often no. Better to know that now than to discover it after the paperwork is signed." />
      <FinancialHealthStrip fa={fa} />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>What each household needs</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {legRow("Senior generation annual draw", <input type="number" style={inputStyle()} value={v("seniorDraw")} onChange={set("seniorDraw")} placeholder="$" />)}
          {legRow("Successor household annual draw", <input type="number" style={inputStyle()} value={v("succDraw")} onChange={set("succDraw")} placeholder="$" />)}
          {legRow("Senior non-farm income", <input type="number" style={inputStyle()} value={v("seniorNonFarmIncome")} onChange={set("seniorNonFarmIncome")} placeholder="$" />, "Off-farm work, social security, pension, investment income.")}
          {legRow("Senior non-farm assets", <input type="number" style={inputStyle()} value={v("seniorNonFarmAssets")} onChange={set("seniorNonFarmAssets")} placeholder="$" />, "Anything not tied up in the operation.")}
        </div>
      </div>
      {hasData && draws > 0 && (
        <div style={cardStyle({ borderTop:`4px solid ${covered >= 0 ? T.moss : T.red}` })}>
          <div style={cardLblStyle()}>Against what the operation actually earns</div>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap", marginBottom:12 }}>
            {[["Net farm income from operations", fmt$(nfifo)],["Both households drawing", fmt$(draws)],["Left over", fmt$(covered)]].map(([lab,val],k)=>(
              <div key={k}>
                <div style={{ fontSize:11, color:T.fgS, marginBottom:3 }}>{lab}</div>
                <div style={{ fontSize:20, fontWeight:600, color:k===2 ? (covered>=0?T.dgreen:T.red) : T.navy }}>{val}</div>
              </div>
            ))}
          </div>
          {covered < 0
            ? <Flag type="danger">On these numbers the operation does not cover both households. That is not a reason to stop, it is the number the rest of the plan has to solve. The structures below exist precisely for this.</Flag>
            : <Flag type="ok">On these numbers the operation covers both households with {fmt$(covered)} left over. Worth stress-testing against a bad year before treating it as settled.</Flag>}
        </div>
      )}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>The two failure modes, named</div>
        <FindingBlock kind="t" tag="FAILURE MODE ONE" heading="The senior generation has no income independent of the operation" source={independent > 0 ? `You have recorded ${fmt$(independent)} of non-farm income` : "You have not recorded any non-farm income"}>
          <p style={{ fontSize:13.5, color:T.fgM, margin:0, lineHeight:1.6 }}>The business gets bled to fund a retirement it was never sized for, and the successor inherits something hollowed out. The more the retirement depends on the farm, the more urgent the structures below become.</p>
        </FindingBlock>
        <FindingBlock kind="t" tag="FAILURE MODE TWO" heading="The senior generation retains everything to be safe" source="The mirror image, and just as common">
          <p style={{ fontSize:13.5, color:T.fgM, margin:0, lineHeight:1.6 }}>The successor never builds equity, works fifteen years for wages on an asset they do not own, and eventually leaves. Retaining control feels like the cautious choice and is often the one that loses the operation.</p>
        </FindingBlock>
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Structures worth considering</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14 }}>Options, not prescriptions. Which of these fits is a conversation for your accountant and attorney, not something this tool should decide.</div>
        {[["Land retained, cash-rented to the operating entity","The rent becomes the pension while the land stays in the family and stays farmed. This needs a defensible rent figure, which is exactly what county cash rent data provides."],
          ["Machinery sold to the entity on terms","Converts equipment value into a predictable income stream without a lump-sum tax event."],
          ["Off-farm income, deferred compensation, and life insurance","Fills the gap between what the operation can pay and what retirement actually costs."]].map(([h,b],k)=>(
          <FindingBlock key={k} kind="o" tag={`OPTION ${k+1}`} heading={h}>
            <p style={{ fontSize:13.5, color:T.fgM, margin:0, lineHeight:1.6 }}>{b}</p>
          </FindingBlock>
        ))}
        {legRow("Which of these is worth exploring, and what is your reaction to the rest?",
          <textarea style={inputStyle({ minHeight:70 })} value={v("structureNotes")} onChange={set("structureNotes")} placeholder="" />)}
        <label style={{ display:"flex", alignItems:"center", gap:9, marginTop:6, cursor:"pointer", fontSize:13.5, color:T.fgM }}>
          <input type="checkbox" checked={!!d.householdModelled} onChange={e=>setLegData({ householdModelled: e.target.checked })} />
          We have actually run these numbers, not just estimated them
        </label>
      </div>
    </div>
  );
}

// ── Stage 5 — Successor readiness ────────────────────────────────────────────
function LEG5({ leg, setLegData }) {
  const d = leg.data || {};
  const ex = d.exposure || {};
  const toggle = (id) => setLegData({ exposure:{ ...ex, [id]: !ex[id] } });
  const gaps = SUCCESSOR_EXPOSURE.filter(s => !ex[s.id]);
  const done = SUCCESSOR_EXPOSURE.length - gaps.length;
  return (
    <div>
      <Head eyebrow="Legacy · Stage 5" title="Successor readiness" sub="An exposure checklist, not a competence judgement. The question is only whether they have done a thing yet, and every unchecked box is a specific decision to hand over this year." />
      <Flag type="info">This is a curriculum, not a report card. The senior generation is being asked to hand over specific decisions, which is a much easier ask than handing over "management".</Flag>
      <div style={cardStyle()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, gap:12, flexWrap:"wrap" }}>
          <div style={cardLblStyle({ marginBottom:0 })}>Has the successor independently</div>
          <span style={{ fontSize:11.5, color:T.fgS }}>{done} of {SUCCESSOR_EXPOSURE.length} done</span>
        </div>
        {SUCCESSOR_EXPOSURE.map(s => {
          const on = !!ex[s.id];
          return (
            <label key={s.id} style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 0", borderBottom:`1px solid ${T.div}`, cursor:"pointer" }}>
              <input type="checkbox" checked={on} onChange={()=>toggle(s.id)} />
              <span style={{ fontSize:14, color:on?T.fgS:T.fg, textDecoration:on?"line-through":"none" }}>{s.label}</span>
              {!on && <span style={{ ...pillStyle("watch"), marginLeft:"auto" }}>hand over</span>}
            </label>
          );
        })}
      </div>
      {gaps.length > 0 && (
        <div style={cardStyle({ borderTop:`4px solid ${T.blue}` })}>
          <div style={cardLblStyle()}>The management handover list</div>
          <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12 }}>{gaps.length === 1 ? "One item" : `${gaps.length} items`} to work through. Pick the top two for this year rather than trying to move all of them.</div>
          <ol style={{ margin:0, paddingLeft:20, fontSize:14, color:T.fgM, lineHeight:1.8 }}>
            {gaps.map(g => <li key={g.id}>{g.label.replace(/^/, "This year: ")}</li>)}
          </ol>
        </div>
      )}
      {gaps.length === 0 && done > 0 && (
        <Flag type="ok">The successor has independent exposure across all seven. Management transfer is real rather than nominal, which puts the ownership conversation genuinely within reach.</Flag>
      )}
      <div style={cardStyle()}>
        {legRow("What is the last significant decision the successor made that you disagreed with, and what happened?",
          <textarea style={inputStyle({ minHeight:74 })} value={d.disagreement || ""} onChange={e=>setLegData({ disagreement:e.target.value })} placeholder="" />,
          "How this went tells you more about readiness than any checklist.")}
        {legRow("Which decision would you find hardest to hand over?",
          <textarea style={inputStyle({ minHeight:64 })} value={d.hardestToHand || ""} onChange={e=>setLegData({ hardestToHand:e.target.value })} placeholder="" />)}
      </div>
    </div>
  );
}

// ── Stage 6 — Who knows what ─────────────────────────────────────────────────
function LEG6({ leg, setLegData }) {
  const d = leg.data || {};
  const k = d.knows || {};
  const setK = (id, val) => setLegData({ knows:{ ...k, [id]: val } });
  const unvoiced = KNOWS_WHAT.filter(p => (k[p.id] === 0 || k[p.id] === 1));
  return (
    <div>
      <Head eyebrow="Legacy · Stage 6" title="Who actually knows what" sub="The most common regret in farm succession is an assumption nobody voiced. One person assumed they would inherit the home place, the other assumed it would be bought, and neither asked for twenty years." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Where each person actually stands</div>
        {KNOWS_WHAT.map(p => (
          <div key={p.id} style={{ padding:"11px 0", borderBottom:`1px solid ${T.div}` }}>
            <div style={{ fontSize:14, color:T.fg, marginBottom:7 }}>{p.label}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {KNOWS_LEVEL.map((lab,idx) => {
                const on = k[p.id] === idx;
                return (
                  <button key={idx} onClick={()=>setK(p.id, idx)}
                    style={{ background:on?T.navy:"#fff", color:on?"#fff":T.fgM, border:`1px solid ${on?T.navy:T.border}`, borderRadius:4, padding:"5px 11px", fontSize:12, cursor:"pointer", font:"inherit", fontWeight:on?600:400 }}>
                    {lab}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Two groups that get left out</div>
        <FindingBlock kind="w" tag="SPOUSES" heading="Both generations, and they hold enormous influence" source="Frequently no seat at the table until something goes wrong">
          <p style={{ fontSize:13.5, color:T.fgM, margin:0, lineHeight:1.6 }}>A plan the spouses have not agreed to is not a plan. This is the most common place a settled arrangement comes apart.</p>
        </FindingBlock>
        <FindingBlock kind="w" tag="OFF-FARM SIBLINGS" heading="Expectations stay unexamined until they are a problem" source="The most common source of family blowups in transition">
          <p style={{ fontSize:13.5, color:T.fgM, margin:0, lineHeight:1.6 }}>They are usually not asked because the conversation is uncomfortable and they are not involved day to day. That is precisely why their assumptions go unchecked the longest.</p>
        </FindingBlock>
      </div>
      <div style={cardStyle()}>
        {legRow("What have you deliberately not talked about?",
          <textarea style={inputStyle({ minHeight:74 })} value={d.notDiscussed || ""} onChange={e=>setLegData({ notDiscussed:e.target.value })} placeholder="" />,
          "What has been avoided is usually more diagnostic than what has been decided.")}
        {legRow("Is there an assumption you are making that you have never confirmed?",
          <textarea style={inputStyle({ minHeight:64 })} value={d.assumption || ""} onChange={e=>setLegData({ assumption:e.target.value })} placeholder="" />)}
      </div>
      {unvoiced.length > 0 && (
        <Flag type="warn">{unvoiced.length === 1 ? "One group" : `${unvoiced.length} groups`} still sit at unvoiced or assumed: {unvoiced.map(p=>p.label.toLowerCase()).join(", ")}. Until those move, the ownership conversation rests on guesses.</Flag>
      )}
    </div>
  );
}

// ── Stage 7 — Fair is not equal ──────────────────────────────────────────────
function LEG7({ leg, setLegData }) {
  const d = leg.data || {};
  const chosen = d.fairApproaches || {};
  const toggle = (id) => setLegData({ fairApproaches:{ ...chosen, [id]: !chosen[id] } });
  const para = d.fairParagraph || "";
  return (
    <div>
      <Head eyebrow="Legacy · Stage 7" title="Fair is not equal" sub="One heir farms and three do not. Land is both the family's wealth and the business's means of production, so dividing it equally destroys the thing everyone says they want to preserve." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Approaches families use</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14 }}>Presented, not recommended. Mark any worth exploring. Which one fits is a question for your attorney and accountant.</div>
        {FAIR_APPROACHES.map(a => {
          const on = !!chosen[a.id];
          return (
            <div key={a.id} onClick={()=>toggle(a.id)} style={{ border:`1px solid ${on?T.moss:T.border}`, background:on?T.greenL:"#fff", borderRadius:8, padding:"12px 15px", marginBottom:9, cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:4 }}>
                <input type="checkbox" checked={on} onChange={()=>toggle(a.id)} onClick={e=>e.stopPropagation()} />
                <span style={{ fontSize:14.5, fontWeight:600, color:on?T.dgreen:T.fg }}>{a.label}</span>
              </div>
              <p style={{ fontSize:13, color:T.fgM, margin:"0 0 0 27px", lineHeight:1.6 }}>{a.body}</p>
            </div>
          );
        })}
      </div>
      <div style={cardStyle({ borderTop:`4px solid ${T.navy}` })}>
        <div style={cardLblStyle()}>The actual deliverable</div>
        <p style={{ fontSize:14, color:T.fgM, marginTop:0, lineHeight:1.6 }}>Not an instrument. A paragraph. In your own words, why unequal is fair. This is the thing that either holds the family together or does not, and a plan the off-farm children first hear about at the reading of the will is a lawsuit.</p>
        <textarea style={inputStyle({ minHeight:130, fontSize:14.5, lineHeight:1.7 })} value={para} onChange={e=>setLegData({ fairParagraph:e.target.value })} placeholder="Write it as if you were saying it to all of your children at the same table. Because eventually you will be." />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, marginTop:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:11.5, color:T.fgS }}>{para.trim() ? `${para.trim().split(/\s+/).length} words` : "Nothing written yet"}</span>
          <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:T.fgM, cursor:"pointer" }}>
            <input type="checkbox" checked={!!d.fairSaid} onChange={e=>setLegData({ fairSaid:e.target.checked })} />
            I have actually said this to them
          </label>
        </div>
      </div>
      {para.trim().length > 40 && !d.fairSaid && (
        <Flag type="warn">Written but not said. The paragraph does its work in the room, not in the file. This is the step families most often stop one short of.</Flag>
      )}
    </div>
  );
}

// ── Stage 8 — Triggers & contingencies ───────────────────────────────────────
function LEG8({ leg, setLegData }) {
  const d = leg.data || {};
  const c = d.contingency || {};
  const set = (id) => (e) => setLegData({ contingency:{ ...c, [id]: e.target.value } });
  return (
    <div>
      <Head eyebrow="Legacy · Stage 8" title="Triggers and contingencies" sub="Plans without dates do not happen, and plans that only work if everyone stays healthy until seventy-five are not plans." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}>Target dates</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {legRow("When should management transfer be complete?", <input style={inputStyle()} value={d.dateManagement||""} onChange={e=>setLegData({ dateManagement:e.target.value })} placeholder="A year, or a triggering event" />)}
          {legRow("When should ownership transfer begin?", <input style={inputStyle()} value={d.dateOwnership||""} onChange={e=>setLegData({ dateOwnership:e.target.value })} placeholder="A year, or a triggering event" />)}
        </div>
      </div>
      {CONTINGENCIES.map(sc => (
        <div key={sc.id} style={cardStyle(sc.weight ? { borderLeft:`3px solid ${T.amber}` } : {})}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4, flexWrap:"wrap" }}>
            <span style={{ fontSize:16, fontWeight:600, color:T.navy }}>{sc.label}</span>
            {sc.weight && <span style={pillStyle("watch")}>weight this heavily</span>}
          </div>
          <p style={{ fontSize:12.5, color:T.fgM, margin:"0 0 11px", lineHeight:1.6 }}>{sc.note}</p>
          <textarea style={inputStyle({ minHeight:64 })} value={c[sc.id]||""} onChange={set(sc.id)} placeholder="What happens to the operation, and who does what?" />
        </div>
      ))}
      <Flag type="info">One factual point worth knowing, and a reason to get sequencing advice before moving anything: inherited land receives a stepped-up basis, and gifting appreciated farmland during life can be considerably worse than letting it pass at death, because the heir loses the step-up and inherits the capital gains exposure. Families who start transferring land early to be safe sometimes cost themselves a great deal. This is a reason to ask your accountant about order of operations, not advice about what to do.</Flag>
    </div>
  );
}

// ── Stage 9 — Rented ground & relationships ──────────────────────────────────
function LEG9({ leg, setLegData }) {
  const d = leg.data || {};
  const ll = d.landlords || [];
  const setLL = (i, field, val) => { const next = ll.map((x,k)=>k===i?{...x,[field]:val}:x); setLegData({ landlords:next }); };
  const add = () => setLegData({ landlords:[...ll, { name:"", acres:"", written:"", relationship:"", met:"" }] });
  const remove = (i) => setLegData({ landlords: ll.filter((_,k)=>k!==i) });
  const notMet = ll.filter(x => x.name && x.met === "no");
  return (
    <div>
      <Head eyebrow="Legacy · Stage 9" title="Rented ground and relationships" sub="If a meaningful share of the operation is rented, its viability rests on leases and relationships that do not transfer automatically. They are personal, often built over decades, and a successor who has never met the landlords can lose the acres." />
      <div style={cardStyle()}>
        {legRow("Roughly what share of the operation is rented ground?",
          <select style={inputStyle()} value={d.rentedShare||""} onChange={e=>setLegData({ rentedShare:e.target.value })}>
            <option value="">Select</option>
            <option value="none">None, all owned</option>
            <option value="under25">Under a quarter</option>
            <option value="25to50">A quarter to half</option>
            <option value="50to75">Half to three quarters</option>
            <option value="over75">More than three quarters</option>
          </select>)}
        {(d.rentedShare === "over75" || d.rentedShare === "50to75") && (
          <Flag type="warn">At this share, the leases are the business. A transition plan that covers the owned ground and not the rented relationships covers the smaller half of the operation.</Flag>
        )}
      </div>
      {d.rentedShare && d.rentedShare !== "none" && (
        <div style={cardStyle()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, gap:12, flexWrap:"wrap" }}>
            <div style={cardLblStyle({ marginBottom:0 })}>Your landlords</div>
            <button onClick={add} style={{ ...btnStyle("outline"), fontSize:12, padding:"6px 13px" }}>+ Add a landlord</button>
          </div>
          {ll.length === 0 && <p style={{ fontSize:13.5, color:T.fgS, fontStyle:"italic", margin:0 }}>None added yet. Even a partial list is useful, and the ones you hesitate over are usually the important ones.</p>}
          {ll.map((x,i) => (
            <div key={i} style={{ border:`1px solid ${T.border}`, borderRadius:8, padding:"13px 15px", marginBottom:10 }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:10 }}>
                <input style={inputStyle()} value={x.name} onChange={e=>setLL(i,"name",e.target.value)} placeholder="Landlord name" />
                <input style={inputStyle()} value={x.acres} onChange={e=>setLL(i,"acres",e.target.value)} placeholder="Acres" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <select style={inputStyle()} value={x.written} onChange={e=>setLL(i,"written",e.target.value)}>
                  <option value="">Lease in writing?</option>
                  <option value="written">Written lease</option>
                  <option value="handshake">Handshake</option>
                </select>
                <select style={inputStyle()} value={x.relationship} onChange={e=>setLL(i,"relationship",e.target.value)}>
                  <option value="">Whose relationship?</option>
                  <option value="senior">Senior generation's</option>
                  <option value="both">Both generations</option>
                  <option value="successor">Successor's</option>
                </select>
                <select style={inputStyle()} value={x.met} onChange={e=>setLL(i,"met",e.target.value)}>
                  <option value="">Successor met them?</option>
                  <option value="yes">Yes, knows them</option>
                  <option value="briefly">Met once or twice</option>
                  <option value="no">Never met</option>
                </select>
              </div>
              <button onClick={()=>remove(i)} style={{ ...btnStyle("ghost"), marginTop:9, fontSize:11.5 }}>Remove</button>
            </div>
          ))}
        </div>
      )}
      {notMet.length > 0 && (
        <div style={cardStyle({ borderTop:`4px solid ${T.moss}` })}>
          <div style={cardLblStyle()}>Landlord introduction list</div>
          <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12 }}>Concrete transition work that costs nothing and is almost universally skipped. Take the successor along to each of these before the next lease renewal.</div>
          <ol style={{ margin:0, paddingLeft:20, fontSize:14, color:T.fgM, lineHeight:1.8 }}>
            {notMet.map((x,i) => <li key={i}>{x.name}{x.acres ? ` · ${x.acres} acres` : ""}{x.written === "handshake" ? " · handshake lease, worth putting in writing at the same time" : ""}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}


// ── Stage 11 — Parcels and land valuation ────────────────────────────────────
function LEG11({ leg, setLegData, profile }) {
  const d = leg.data || {};
  const parcels = d.parcels || [];
  const tierKey = legacyTier(leg);
  const ready = tierKey === "structural" || tierKey === "execution";
  const [open, setOpen] = useState(null);

  const setP = (i, field, val) => setLegData({ parcels: parcels.map((x,k)=>k===i?{...x,[field]:val}:x) });
  const add = () => { setLegData({ parcels:[...parcels, { label:"", state:(profile?.location||"").slice(-2).toUpperCase(), county:"", landClass:"dryland", deededAcres:"", tillableAcres:"", nccpi:"", irrigated:"", waterRight:"", useValue:"", boundary:"acreage" }] }); setOpen(parcels.length); };
  const remove = (i) => setLegData({ parcels: parcels.filter((_,k)=>k!==i) });

  const results = parcels.map(valueParcel);
  const totalMid = results.reduce((s,r,i) => s + (parseFloat(parcels[i].overrideValue) || r.mid || 0), 0);
  const needAppraisal = results.filter(r => r.requiresAppraisal).length;
  const noBoundary = parcels.filter(p => !p.nccpi).length;

  const confPill = (c) => c==="High" ? "strong" : c==="Medium" ? "watch" : c==="Refer" ? "info" : "vuln";

  return (
    <div>
      <Head eyebrow="Legacy · Stage 11" title="Parcels and land valuation" sub="A value for every parcel the family owns. That number flows into estate size, buy-sell funding, insurance sizing, and the equalisation maths between heirs, so if it is wrong everything downstream is wrong." />

      {!ready && (
        <Flag type="warn">The readiness stages put this family at {READINESS_TIERS[tierKey].label.toLowerCase()}. You can value parcels here, but the numbers will sit in front of decisions that have not been made yet. {READINESS_TIERS[tierKey].rec}</Flag>
      )}

      <Flag type="danger">These are planning estimates, not qualified appraisals. Estate and gift tax filings require a qualified appraisal. No use-value or assessed figure appears anywhere in this module as an asset value, because those are tax figures and routinely sit thirty to eighty percent below market.</Flag>

      <div style={cardStyle({ borderTop:`4px solid ${T.amber}` })}>
        <div style={cardLblStyle()}>Before you trust these numbers</div>
        <p style={{ fontSize:13.5, color:T.fgM, margin:"0 0 10px", lineHeight:1.6 }}>The benchmark values behind this engine are <b>placeholders</b>, not USDA figures. Live SSURGO soil queries and the NASS land value and cash rent series belong in a scheduled ingestion job writing to our own table, which needs a backend this app does not have yet.</p>
        <p style={{ fontSize:13.5, color:T.fgM, margin:0, lineHeight:1.6 }}>Every benchmark, cash rent, and cap rate below is editable per parcel. Provenance records whether each figure came from the placeholder table or from you, so a placeholder can never be mistaken for a survey figure.</p>
      </div>

      <div style={cardStyle()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:12 }}>
          <div style={cardLblStyle({ marginBottom:0 })}>Parcels</div>
          <button onClick={add} style={{ ...btnStyle("outline"), fontSize:12, padding:"6px 13px" }}>+ Add a parcel</button>
        </div>
        {parcels.length === 0 && <p style={{ fontSize:13.5, color:T.fgS, fontStyle:"italic", margin:0 }}>No parcels yet. Add the ground the family owns, one parcel per deed where you can.</p>}

        {parcels.map((p,i) => {
          const r = results[i];
          const isOpen = open === i;
          const override = parseFloat(p.overrideValue) || null;
          return (
            <div key={i} style={{ border:`1px solid ${r.requiresAppraisal?T.amber:T.border}`, borderRadius:9, marginBottom:11, overflow:"hidden" }}>
              <div onClick={()=>setOpen(isOpen?null:i)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, padding:"12px 15px", cursor:"pointer", background:isOpen?T.bgAlt:"#fff", flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontSize:14.5, fontWeight:600, color:T.navy }}>{p.label || `Parcel ${i+1}`}</div>
                  <div style={{ fontSize:12, color:T.fgS }}>{r.cls.label}{p.deededAcres?` · ${p.deededAcres} acres`:""}{p.state?` · ${p.state}`:""}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={pillStyle(confPill(r.confidence))}>{r.confidence}</span>
                  <span style={{ fontSize:16, fontWeight:600, color:override?T.blue:T.navy }}>
                    {override ? fmt$(override) : r.mid ? fmt$(r.mid) : "—"}
                  </span>
                </div>
              </div>

              {isOpen && (
                <div style={{ padding:"14px 15px", borderTop:`1px solid ${T.border}` }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
                    <div><label style={labelStyle}>Label</label><input style={inputStyle()} value={p.label} onChange={e=>setP(i,"label",e.target.value)} placeholder="Home place, north 80" /></div>
                    <div><label style={labelStyle}>State</label>
                      <select style={inputStyle()} value={p.state} onChange={e=>setP(i,"state",e.target.value)}>
                        <option value="">Select</option>
                        {BENCH_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select></div>
                    <div><label style={labelStyle}>County</label><input style={inputStyle()} value={p.county} onChange={e=>setP(i,"county",e.target.value)} /></div>
                  </div>

                  <div style={{ marginBottom:12 }}>
                    <label style={labelStyle}>Land class</label>
                    <select style={inputStyle()} value={p.landClass} onChange={e=>setP(i,"landClass",e.target.value)}>
                      {LAND_CLASSES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    <div style={{ fontSize:11.5, color:T.fgS, marginTop:5, fontStyle:"italic" }}>{r.cls.note}</div>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
                    <div><label style={labelStyle}>Deeded acres</label><input type="number" style={inputStyle()} value={p.deededAcres} onChange={e=>setP(i,"deededAcres",e.target.value)} /></div>
                    <div><label style={labelStyle}>Tillable acres</label><input type="number" style={inputStyle()} value={p.tillableAcres} onChange={e=>setP(i,"tillableAcres",e.target.value)} /></div>
                    <div><label style={labelStyle}>Productivity index</label><input type="number" step="0.01" min="0" max="1" style={inputStyle()} value={p.nccpi} onChange={e=>setP(i,"nccpi",e.target.value)} placeholder="state mean" />
                      <div style={{ fontSize:11, color:T.fgS, marginTop:4 }}>NCCPI 0 to 1. Blank uses the state mean.</div></div>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
                    <div><label style={labelStyle}>Irrigated</label>
                      <select style={inputStyle()} value={p.irrigated} onChange={e=>setP(i,"irrigated",e.target.value)}>
                        <option value="">Unknown</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                    <div><label style={labelStyle}>Water right</label>
                      <select style={inputStyle()} value={p.waterRight} onChange={e=>setP(i,"waterRight",e.target.value)}>
                        <option value="">Unknown</option><option value="conveyed">Conveys with the land</option>
                        <option value="separate">Separately held</option><option value="na">Not applicable</option></select></div>
                    <div><label style={labelStyle}>Use-value enrolled</label>
                      <select style={inputStyle()} value={p.useValue} onChange={e=>setP(i,"useValue",e.target.value)}>
                        <option value="">Unknown</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                  </div>

                  {p.landClass === "crp" && (
                    <div style={{ marginBottom:12 }}><label style={labelStyle}>CRP contract payment per acre</label>
                      <input type="number" style={inputStyle()} value={p.crpPayment||""} onChange={e=>setP(i,"crpPayment",e.target.value)} placeholder="$ per acre per year" /></div>
                  )}

                  <details style={{ marginBottom:12 }}>
                    <summary style={{ fontSize:12.5, color:T.blue, cursor:"pointer", marginBottom:8 }}>Override the benchmark figures for this parcel</summary>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:8 }}>
                      <div><label style={labelStyle}>Value per acre</label><input type="number" style={inputStyle()} value={p.benchOverride||""} onChange={e=>setP(i,"benchOverride",e.target.value)} placeholder={r.provenance.benchmark ? String(Math.round(r.provenance.benchmark)) : ""} /></div>
                      <div><label style={labelStyle}>Cash rent per acre</label><input type="number" style={inputStyle()} value={p.rentOverride||""} onChange={e=>setP(i,"rentOverride",e.target.value)} placeholder={r.provenance.cashRent ? String(Math.round(r.provenance.cashRent)) : ""} /></div>
                      <div><label style={labelStyle}>Cap rate %</label><input type="number" step="0.1" style={inputStyle()} value={p.capOverride||""} onChange={e=>setP(i,"capOverride",e.target.value)} placeholder={r.provenance.capRate ? (r.provenance.capRate*100).toFixed(2) : ""} /></div>
                    </div>
                  </details>

                  {/* the two methods and their divergence */}
                  {r.requiresAppraisal && r.why && !r.methodA ? (
                    <Flag type="warn">{r.why}</Flag>
                  ) : (
                    <div style={{ background:T.bgAlt, borderRadius:8, padding:"13px 15px", marginBottom:12 }}>
                      <div style={{ fontSize:10.5, letterSpacing:"0.13em", textTransform:"uppercase", color:T.fgS, marginBottom:10 }}>Two methods, compared</div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                        {[["Market comparison", r.methodA, "Benchmark per acre, indexed by soil productivity"],
                          ["Income capitalisation", r.methodB, "County cash rent divided by the cap rate"],
                          ["Divergence", r.divergence!=null ? Math.round(r.divergence*100)+"%" : null, "How far apart the two methods land"]].map(([lab,val,sub],k)=>(
                          <div key={k}>
                            <div style={{ fontSize:11, color:T.fgS, marginBottom:3 }}>{lab}</div>
                            <div style={{ fontSize:17, fontWeight:600, color:k===2?(r.divergence>0.35?T.red:r.divergence>0.15?T.amberT:T.dgreen):T.navy }}>
                              {k===2 ? (val||"—") : (val ? fmt$(val) : "not run")}
                            </div>
                            <div style={{ fontSize:10.5, color:T.fgS, marginTop:3, lineHeight:1.4 }}>{sub}</div>
                          </div>
                        ))}
                      </div>
                      {r.mid && (
                        <div style={{ marginTop:12, paddingTop:11, borderTop:`1px solid ${T.border}` }}>
                          <div style={{ fontSize:11, color:T.fgS, marginBottom:3 }}>Working range</div>
                          <div style={{ fontSize:15, color:T.fg }}>{fmt$(r.low)} to {fmt$(r.high)}, midpoint <b>{fmt$(r.mid)}</b></div>
                        </div>
                      )}
                      {r.why && <div style={{ marginTop:11 }}><Flag type="warn">{r.why}</Flag></div>}
                      {r.divergence === 0 && r.methodB && (
                        <div style={{ marginTop:9, fontSize:11.5, color:T.fgS, fontStyle:"italic" }}>
                          Zero divergence here is a limitation, not a result. At state-average productivity with a derived cap rate, the two methods reduce to the same expression. The check only does real work once soil differs from the state mean or a benchmark is overridden.
                        </div>
                      )}
                    </div>
                  )}

                  {p.waterRight === "separate" && (
                    <Flag type="warn">The water right on this parcel is held separately from the land. A family dividing ground among heirs can strand the water on the wrong parcel. This module flags it and does not value it. Take it to counsel.</Flag>
                  )}
                  {p.useValue === "yes" && (
                    <Flag type="info">This parcel is enrolled in current-use assessment. Transfer can trigger rollback or recoupment, which varies by state and routinely blindsides families. The tax bill's figure is not the estate's figure.</Flag>
                  )}

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:12, marginBottom:10 }}>
                    <div><label style={labelStyle}>Override the value</label><input type="number" style={inputStyle()} value={p.overrideValue||""} onChange={e=>setP(i,"overrideValue",e.target.value)} placeholder="$ total" /></div>
                    <div><label style={labelStyle}>Reason for the override</label><input style={inputStyle()} value={p.overrideReason||""} onChange={e=>setP(i,"overrideReason",e.target.value)} placeholder="Required. An appraisal, a recent offer, a known sale next door." /></div>
                  </div>

                  <details>
                    <summary style={{ fontSize:12.5, color:T.blue, cursor:"pointer" }}>Provenance, every input and where it came from</summary>
                    <div style={{ marginTop:9, background:"#fff", border:`1px solid ${T.border}`, borderRadius:6, padding:"11px 13px" }}>
                      {Object.entries(r.provenance).filter(([,v])=>v!==null&&v!==undefined).map(([k,v])=>(
                        <div key={k} style={{ display:"flex", gap:10, fontSize:11.5, padding:"3px 0", borderBottom:`1px dashed ${T.div}` }}>
                          <span style={{ width:170, color:T.fgS, flexShrink:0 }}>{k}</span>
                          <span style={{ color:T.fg }}>{typeof v === "number" ? (v<1 && v>0 ? v.toFixed(4) : Math.round(v).toLocaleString()) : String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </details>

                  <button onClick={()=>remove(i)} style={{ ...btnStyle("ghost"), marginTop:11, fontSize:11.5 }}>Remove this parcel</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {parcels.length > 0 && (
        <div style={cardStyle({ borderTop:`4px solid ${T.navy}` })}>
          <div style={cardLblStyle()}>Portfolio</div>
          <div style={{ display:"flex", gap:26, flexWrap:"wrap", marginBottom:14 }}>
            {[["Parcels", parcels.length],
              ["Total acres", parcels.reduce((s,p)=>s+(parseFloat(p.deededAcres)||0),0).toLocaleString()],
              ["Working value", fmt$(totalMid)],
              ["Need an appraisal", needAppraisal]].map(([lab,val],k)=>(
              <div key={k}>
                <div style={{ fontSize:11, color:T.fgS, marginBottom:3 }}>{lab}</div>
                <div style={{ fontSize:21, fontWeight:600, color:k===3&&needAppraisal>0?T.amberT:T.navy }}>{val}</div>
              </div>
            ))}
          </div>
          {needAppraisal > 0 && <Flag type="warn">{needAppraisal === 1 ? "One parcel needs" : `${needAppraisal} parcels need`} professional appraisal before the number is usable in a plan. That is the engine working, not failing.</Flag>}
          {noBoundary > 0 && <Flag type="info">{noBoundary === 1 ? "One parcel is" : `${noBoundary} parcels are`} using the state mean productivity index because no soil index was entered. Adding a real index is the single biggest improvement available to these estimates.</Flag>}
        </div>
      )}
    </div>
  );
}

// ── Stage 10 — Where this leaves you ─────────────────────────────────────────
function LEG10({ leg, profile }) {
  const d = leg.data || {};
  const tierKey = legacyTier(leg);
  const tier = READINESS_TIERS[tierKey];
  const t = d.transfers || {};
  const gaps = SUCCESSOR_EXPOSURE.filter(s => !(d.exposure||{})[s.id]);
  const notMet = (d.landlords||[]).filter(x => x.name && x.met === "no");
  const unvoiced = KNOWS_WHAT.filter(p => ((d.knows||{})[p.id] === 0 || (d.knows||{})[p.id] === 1));
  const ready = tierKey === "structural" || tierKey === "execution";

  const H = ({children}) => <div style={{ fontSize:11, letterSpacing:"0.13em", textTransform:"uppercase", color:T.fgS, margin:"24px 0 11px", paddingBottom:6, borderBottom:`1px solid ${T.border}` }}>{children}</div>;

  return (
    <div>
      <Head eyebrow="Legacy · Stage 10" title="Where this leaves you" sub="Not a plan. A readiness profile, and a sequenced list of what to actually do next." />

      <div style={cardStyle({ borderTop:`4px solid ${tierKey==="execution"?T.moss:tierKey==="conversation"?T.red:T.amber}` })}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:10 }}>
          <div style={{ fontSize:22, fontWeight:600, color:T.navy }}>{tier.label}</div>
          <span style={pillStyle(tier.pill)}>{tierKey}</span>
        </div>
        <p style={{ fontSize:14, color:T.fgM, margin:"0 0 12px", lineHeight:1.6 }}>{tier.signal}</p>
        <div style={{ borderLeft:`2px solid ${T.blue}`, background:T.blueL, borderRadius:"0 5px 5px 0", padding:"12px 15px" }}>
          <div style={{ fontSize:10, letterSpacing:"0.12em", fontWeight:600, color:T.blue, marginBottom:5 }}>WHAT TO DO NEXT</div>
          <p style={{ fontSize:13.5, color:T.navy, margin:0, lineHeight:1.6 }}>{tier.rec}</p>
        </div>
        <p style={{ fontSize:12, color:T.fgS, marginTop:12, marginBottom:0, fontStyle:"italic" }}>This describes where the process is, not the people in it.</p>
      </div>

      <div style={cardStyle()}>
        <H>The three transfers, today</H>
        {TRANSFERS.map((tr,k) => {
          const now = Number((t[tr.id]||{}).now || 0), y10 = Number((t[tr.id]||{}).y10 || 0);
          return (
            <div key={tr.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:`1px dashed ${T.border}` }}>
              <span style={{ width:110, fontSize:13.5, fontWeight:600, color:T.fg, flexShrink:0 }}>{tr.label}</span>
              <div style={{ flex:1, height:8, background:"#dde1e8", borderRadius:4, overflow:"hidden", position:"relative" }}>
                <div style={{ width:`${now}%`, height:"100%", background:[T.moss,T.blue,T.navy][k], borderRadius:4 }} />
              </div>
              <span style={{ width:150, textAlign:"right", fontSize:12.5, color:T.fgM, flexShrink:0 }}>{now}% now, {y10}% at ten years</span>
            </div>
          );
        })}

        {gaps.length > 0 && (<>
          <H>Management to hand over</H>
          <ol style={{ margin:0, paddingLeft:20, fontSize:14, color:T.fgM, lineHeight:1.8 }}>
            {gaps.slice(0,3).map(g => <li key={g.id}>{g.label}</li>)}
          </ol>
          {gaps.length > 3 && <p style={{ fontSize:12.5, color:T.fgS, marginTop:8, marginBottom:0 }}>Plus {gaps.length-3} more. Two per year is a realistic pace.</p>}
        </>)}

        {unvoiced.length > 0 && (<>
          <H>Conversations not yet had</H>
          <ul style={{ margin:0, paddingLeft:20, fontSize:14, color:T.fgM, lineHeight:1.8 }}>
            {unvoiced.map(p => <li key={p.id}>{p.label}</li>)}
          </ul>
        </>)}

        {d.nextChapterRole && (<>
          <H>The senior generation's ongoing role</H>
          <div style={{ borderLeft:`2px solid ${T.moss}`, background:T.greenL, borderRadius:"0 5px 5px 0", padding:"12px 15px", fontSize:13.5, color:T.fg, lineHeight:1.6 }}>{d.nextChapterRole}</div>
        </>)}

        {(d.fairParagraph||"").trim() && (<>
          <H>Why unequal is fair, in their words</H>
          <div style={{ borderLeft:`2px solid ${T.navy}`, background:T.bgAlt, borderRadius:"0 5px 5px 0", padding:"12px 15px", fontSize:13.5, color:T.fg, lineHeight:1.7 }}>{d.fairParagraph}</div>
          {!d.fairSaid && <p style={{ fontSize:12.5, color:T.amberT, marginTop:8, marginBottom:0 }}>Written but not yet said out loud.</p>}
        </>)}

        {notMet.length > 0 && (<>
          <H>Landlords to introduce</H>
          <ul style={{ margin:0, paddingLeft:20, fontSize:14, color:T.fgM, lineHeight:1.8 }}>
            {notMet.map((x,i) => <li key={i}>{x.name}{x.acres?` · ${x.acres} acres`:""}</li>)}
          </ul>
        </>)}
      </div>

      <div style={cardStyle({ borderTop:`4px solid ${ready?T.moss:T.silver}` })}>
        <div style={cardLblStyle()}>Asset inventory and valuation</div>
        {ready ? (
          <>
            <p style={{ fontSize:14, color:T.fgM, marginTop:0, lineHeight:1.6 }}>The operating question has been tested far enough that the ownership question can be answered intelligently. Legacy Acres picks up here, and it opens with context rather than a blank form: which ground is operationally central, which is exposed to the fair-versus-equal problem, and which is rented out versus farmed.</p>
            <a href="https://legacyacres.co/" target="_blank" rel="noopener noreferrer" style={{ ...btnStyle("primary"), display:"inline-block", textDecoration:"none" }}>Continue in Legacy Acres →</a>
          </>
        ) : (
          <>
            <Flag type="warn">Not yet. Filling out an asset inventory from here would produce a tidy document that changes nothing, and it is the most common way succession software gets opened once and abandoned.</Flag>
            <p style={{ fontSize:14, color:T.fgM, marginBottom:0, lineHeight:1.6 }}>Work the recommendation above first. Come back to this page afterwards and the handoff will open on its own.</p>
          </>
        )}
      </div>

      <div style={cardStyle()}>
        <div style={cardLblStyle()}>What this module does not do</div>
        <ul style={{ margin:0, paddingLeft:20, fontSize:13.5, color:T.fgM, lineHeight:1.9 }}>
          <li>No legal documents. No operating agreements, buy-sells, or wills.</li>
          <li>No tax advice. Sequencing questions go to your accountant before assets move.</li>
          <li>No scoring of your family. The tier above describes the process, never the people.</li>
        </ul>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═════════════════════════════════════════════════════════════════════════════
// Generic farm SWOT, pre-populated so the quadrants open with a real starting point
// rather than four empty boxes. Every line is editable and meant to be replaced with
// the operation's own read once the conversation gets specific.
const GENERIC_FARM_SWOT = {
  swotStrengths: "Owned land base and established equity position. Multi-generational operating knowledge and a known local reputation. Long-standing relationships with buyers, lenders, and suppliers. Equipment and infrastructure already in place and paid down.",
  swotWeaknesses: "Income concentrated in a small number of commodities and buyers. Records kept for tax filing rather than management decisions. No documented succession or transition plan. Limited visibility into cost and margin at the enterprise level.",
  swotOpportunities: "Underused equipment, storage, and labour capacity across the season. Local and regional demand for direct-marketed or value-added product. Conservation and energy programs that pay for practices already underway. Adjacent ventures that use existing assets without buying land.",
  swotThreats: "Margin compression as supply chain concentration continues. Input cost and interest rate volatility. Weather variability and more frequent extreme events. An aging operator base and thin local labour availability.",
};


// Generic strategy and values, seeded alongside the SWOT so the glance view opens
// with a coherent operating picture rather than empty fields.
const GENERIC_FARM_STRATEGY = {
  location: "Midwest corn belt, mixed county",
  size: "1,100 acres owned and rented",
  productionMix: "Corn and soybean rotation with a small cow-calf herd on marginal ground",
  ventures: "Custom planting and harvest for two neighbours, on-farm grain storage",
  grossIncome: "920000",
  nearTerm: "Complete a written succession plan. Get enterprise-level cost visibility in place before the next operating loan renewal. Hold gross margin steady through the current input cost cycle.",
  longTerm: "Transition ownership and management to the next generation on agreed terms. Add a second meaningful income stream that does not move with commodity price. Grow the land base slowly, and only where it adjoins existing ground.",
  advantage: "Long-standing local relationships that surface land and business opportunities before they are publicly listed, paired with a reputation for doing what was agreed.",
  values: "Leave the operation stronger than it was received. Keep the family involved in the decisions that matter. Farm in a way the next generation can be proud of and the ground can sustain.",
};

// Illustrative whole-farm financials, seeded so the four health categories compute
// on first load. Replaced the moment a real operation enters its own numbers.
const GENERIC_FARM_FINANCIALS = {
  gross:"920000", opex:"690000", inputs:"310000", rent:"145000", depr:"78000",
  interest:"52000", acres:"1100", principal:"40000",
  currentAssets:"480000", currentLiab:"190000",
  beginAssets:"2850000", beginLiab:"1240000", endAssets:"2960000", endLiab:"1195000",
  livingWithdrawals:"68000", incomeTaxes:"34000",
};

export default function App() {
  const [module, setModule] = useState("profile");
  const [fa, setFA] = useState({ stage:1, enterprises:[], goals:{}, wholeFarm:{}, ratioVals:{}, s3vals:{ ...GENERIC_FARM_FINANCIALS }, s4bench:{}, s5:{}, actionChecked:{} });
  const [rd, setRD] = useState({ stage:1, data:{} });
  const [risk, setRisk] = useState({ stage:1, answers:{} });
  const [leg, setLeg] = useState({ stage:1, data:{} });
  const [riskConvo, setRiskConvo] = useState(false);
  const [profile, setProfile] = useState({ ...GENERIC_FARM_SWOT, ...GENERIC_FARM_STRATEGY });

  const setRData = (fn) => setRD(s => ({ ...s, data: fn(s.data||{}) }));
  const goFA = (n) => { setModule("fa"); setFA(s => ({ ...s, stage:n })); };
  const goRD = (n) => { setModule("rd"); setRD(s => ({ ...s, stage:n })); };
  const goRisk = (n) => { setModule("risk"); setRisk(s => ({ ...s, stage:n })); };
  const goLegacy = (n) => { setModule("legacy"); setLeg(s => ({ ...s, stage:n })); };
  const setLegData = (patch) => setLeg(s => ({ ...s, data:{ ...(s.data||{}), ...patch } }));

  const isFA = module === "fa", isRD = module === "rd", isRisk = module === "risk", isProfile = module === "profile", isLeg = module === "legacy";
  const faTotal = FA_STAGES.length, rdTotal = RD_STAGES.length, riskTotal = RISK_STAGES.length, legTotal = LEG_STAGES.length;
  const stage = isFA ? fa.stage : isRD ? rd.stage : isLeg ? leg.stage : risk.stage;
  const total = isFA ? faTotal : isRD ? rdTotal : isLeg ? legTotal : riskTotal;
  const stageDefs = isFA ? FA_STAGES : isRD ? RD_STAGES : isLeg ? LEG_STAGES : RISK_STAGES;
  const faPct = Math.round(Math.min(fa.stage,faTotal)/faTotal*100);
  const rdPct = Math.round(Math.min(rd.stage,rdTotal)/rdTotal*100);
  const riskPct = Math.round(Math.min(risk.stage,riskTotal)/riskTotal*100);
  const PROFILE_FIELDS = ["location","size","productionMix","ventures","grossIncome","nearTerm","longTerm","advantage","values","swotStrengths","swotWeaknesses","swotOpportunities","swotThreats"];
  const profilePct = Math.round((PROFILE_FIELDS.filter(f=>(profile[f]||"").trim()).length / PROFILE_FIELDS.length) * 100);
  const legPct = Math.round(Math.min(leg.stage,legTotal)/legTotal*100);
  const pct = isFA ? faPct : isRD ? rdPct : isLeg ? legPct : riskPct;

  const canAdvance = useMemo(() => {
    if (isFA) { if (fa.stage===1) return fa.enterprises.length>0; if (fa.stage===2) { const g=fa.goals; return !!(g.trigger&&g.concern&&g.outcome); } return true; }
    if (isRD) { const d = rd.data, g = d.goals2||{}, leverItems = d.leverItems||{}, b = d.baseline||{}, sel = d.selectedOpps||[];
      if (rd.stage===1) return !!(b.farmType&&b.revTier); if (rd.stage===2) return !!(g.trigger&&g.horizon&&g.capitalAppetite&&g.timeAppetite); if (rd.stage===3) return Object.keys(leverItems).length>0; if (rd.stage===4) return sel.length>0; return true; }
    return true;
  }, [isFA, isRD, fa, rd]);

  const faScore = faScoreOf(fa);
  const faTier = faTierOf(fa);
  const faSumEnt = [...new Set(fa.enterprises)].map(e=>ENT[e]&&ENT[e].label).filter(Boolean).join(", ") || "No enterprise selected";
  const riskAnsweredTotal = Object.keys(risk.answers||{}).length;

  const chips = isFA ? fa.enterprises.map(e => ({ label: ENT[e]?ENT[e].label:e }))
    : isRD ? (rd.data.selectedOpps||[]).slice(0,3).map(id => { const o=OPPS.find(x=>x.id===id); return { label:o?o.label:id }; })
    : isLeg ? [{ label: READINESS_TIERS[legacyTier(leg)].label }]
    : [{ label:`${riskAnsweredTotal}/32 answered` }];

  let backLabel = "← Back"; let backDisabled = (isRisk && risk.stage===1) || (isLeg && leg.stage===1);
  const onBack = () => { if (isFA) { if (fa.stage>1) goFA(fa.stage-1); else setModule("profile"); } else if (isRD) { if (rd.stage>1) goRD(rd.stage-1); else goFA(FA_STAGES.length); } else if (isLeg) { if (leg.stage>1) goLegacy(leg.stage-1); } else { if (risk.stage>1) goRisk(risk.stage-1); } };
  if (isFA && fa.stage===1) backLabel = "← Farm Profile";
  if (isRD && rd.stage===1) backLabel = "← Financial Analysis";

  let nextLabel = "Continue →";
  const onNext = () => {
    if (!canAdvance) return;
    if (isFA) { if (fa.stage<faTotal) goFA(fa.stage+1); else goRD(1); }
    else if (isRD) { if (rd.stage<rdTotal) goRD(rd.stage+1); else { setModule("fa"); setFA(s=>({...s,stage:1})); } }
    else if (isLeg) { if (leg.stage<legTotal) goLegacy(leg.stage+1); else setLeg(s=>({...s,stage:1})); }
    else { if (risk.stage<riskTotal) goRisk(risk.stage+1); else setRisk(s=>({...s,stage:1})); }
  };
  if (isFA && fa.stage===faTotal) nextLabel = "Revenue Diversification →";
  if (isRD && rd.stage===rdTotal) nextLabel = "Start over ↺";
  if (isRisk && risk.stage===riskTotal) nextLabel = "Start over ↺";
  if (isLeg && leg.stage===legTotal) nextLabel = "Start over ↺";

  const FA_BODY = [
    <FA1 fa={fa} setFA={setFA} />, <FA2 fa={fa} setFA={setFA} />, <FA3 fa={fa} setFA={setFA} />,
    <FA4 fa={fa} setFA={setFA} />,
  ];
  const RD_BODY = [
    <RD1 rd={rd} setRData={setRData} fa={fa} />, <RD2 rd={rd} setRData={setRData} />, <RD3 rd={rd} setRData={setRData} />,
    <RD4 rd={rd} setRData={setRData} fa={fa} />, <RD5 rd={rd} setRData={setRData} />, <RDPolicyEnablers rd={rd} setRData={setRData} />,
    <RD6 rd={rd} setRData={setRData} profile={profile} />, <RD7 rd={rd} setRData={setRData} fa={fa} />, <RD8 rd={rd} fa={fa} />,
  ];
  const RISK_BODY = [
    ...RISK_CATS.map((c,i) => <RiskCategoryStage key={c.id} risk={risk} setRisk={setRisk} catIndex={i} fa={fa} onStartConvo={i===0?()=>setRiskConvo(true):null} />),
    <RiskResultsStage risk={risk} />,
    <RiskPlanRevenueOps risk={risk} setRisk={setRisk} />, <RiskPlanThreats risk={risk} setRisk={setRisk} goStrategy={()=>goRisk(8)} />,
    <RiskPlanStrategy risk={risk} setRisk={setRisk} />, <RiskPlanReview risk={risk} setRisk={setRisk} />,
    <RiskPlanDocument risk={risk} profile={profile} goCalc={()=>goRisk(11)} />,
    <CropInsuranceCalculator risk={risk} setRisk={setRisk} fa={fa} profile={profile} />, <LivestockInsuranceCalculator risk={risk} setRisk={setRisk} />,
  ];
  const riskConvoActive = isRisk && riskConvo;
  const LEG_BODY = [
    <LEG1 leg={leg} setLegData={setLegData} />, <LEG2 leg={leg} setLegData={setLegData} />,
    <LEG3 leg={leg} setLegData={setLegData} />, <LEG4 leg={leg} setLegData={setLegData} fa={fa} />,
    <LEG5 leg={leg} setLegData={setLegData} />, <LEG6 leg={leg} setLegData={setLegData} />,
    <LEG7 leg={leg} setLegData={setLegData} />, <LEG8 leg={leg} setLegData={setLegData} />,
    <LEG9 leg={leg} setLegData={setLegData} />, <LEG10 leg={leg} profile={profile} />,
  ];
  const body = riskConvoActive
    ? <ConversationalRisk risk={risk} setRisk={setRisk} profile={profile} onExit={(stage)=>{ setRiskConvo(false); setRisk(s=>({ ...s, stage: stage || 5 })); }} />
    : isFA ? FA_BODY[stage-1] : isRD ? RD_BODY[stage-1] : isLeg ? LEG_BODY[stage-1] : RISK_BODY[stage-1];

  const tabBase = { display:"flex", alignItems:"center", gap:11, padding:"8px 14px", borderRadius:8, cursor:"pointer", transition:"all .15s", border:"1.5px solid transparent" };
  const faTabStyle = isFA ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const rdTabStyle = isRD ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const riskTabStyle = isRisk ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const profileTabStyle = isProfile ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const legTabStyle = isLeg ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const lblOn = { fontSize:14.5, fontWeight:700, color:T.navy, letterSpacing:"0.01em" };
  const lblOff = { ...lblOn, fontWeight:600, color:T.fgS };

  return (
    <div className="mfp-root" style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden", background:T.bgAlt }}>
      <FontStyles />

      {/* Header */}
      <header style={{ background:"#fff", borderBottom:`1px solid ${T.border}`, height:66, display:"flex", alignItems:"center", gap:18, padding:"0 22px", flexShrink:0, zIndex:5 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <svg width="26" height="26" viewBox="0 0 24 24"><polygon points="12,2 22,20 2,20" fill={T.navy} /><polygon points="12,8 17,20 7,20" fill={T.green} /></svg>
          <span style={{ fontWeight:700, fontSize:15, color:T.navy, letterSpacing:"0.01em", whiteSpace:"nowrap" }}>MAXIMUM FARM POTENTIAL</span>
        </div>
        <div style={{ width:1, height:30, background:T.border }} />
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div onClick={()=>setModule("profile")} style={profileTabStyle}>
            <IconProfile />
            <div>
              <div style={isProfile?lblOn:lblOff}>Farm Profile</div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:3 }}>
                <div style={{ width:62, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${profilePct}%`, background:T.green, borderRadius:2 }} /></div>
                <span style={{ fontSize:11, color:T.fgS, whiteSpace:"nowrap" }}>{profilePct}%</span>
              </div>
            </div>
          </div>
          <div onClick={()=>setModule("fa")} style={faTabStyle}>
            <IconChart />
            <div>
              <div style={isFA?lblOn:lblOff}>Financial Analysis</div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:3 }}>
                <div style={{ width:62, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${faPct}%`, background:T.green, borderRadius:2 }} /></div>
                <span style={{ fontSize:11, color:T.fgS, whiteSpace:"nowrap" }}>{faPct}%</span>
              </div>
            </div>
          </div>
          <div onClick={()=>setModule("rd")} style={rdTabStyle}>
            <IconSprout />
            <div>
              <div style={isRD?lblOn:lblOff}>Revenue Diversification</div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:3 }}>
                <div style={{ width:62, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${rdPct}%`, background:T.green, borderRadius:2 }} /></div>
                <span style={{ fontSize:11, color:T.fgS, whiteSpace:"nowrap" }}>{rd.stage===1 && Object.keys(rd.data).length===0 ? "Continues from FA" : `${rdPct}%`}</span>
              </div>
            </div>
          </div>
          <div onClick={()=>setModule("risk")} style={riskTabStyle}>
            <IconShield />
            <div>
              <div style={isRisk?lblOn:lblOff}>Farm Risk</div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:3 }}>
                <div style={{ width:62, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${riskPct}%`, background:T.green, borderRadius:2 }} /></div>
                <span style={{ fontSize:11, color:T.fgS, whiteSpace:"nowrap" }}>{riskPct}%</span>
              </div>
            </div>
          </div>
          <div onClick={()=>setModule("legacy")} style={legTabStyle}>
            <IconProfile />
            <div>
              <div style={isLeg?lblOn:lblOff}>Legacy</div>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:3 }}>
                <div style={{ width:62, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${legPct}%`, background:T.green, borderRadius:2 }} /></div>
                <span style={{ fontSize:11, color:T.fgS, whiteSpace:"nowrap" }}>{legPct}%</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:11, color:T.fgS, maxWidth:190, textAlign:"right", lineHeight:1.4 }}>Your farm profile carries across all modules</span>
          <div style={{ width:38, height:38, borderRadius:"50%", background:T.blue, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:15 }}>RM</div>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {isProfile ? (
          <>
            <aside style={{ width:240, background:T.navy, display:"flex", flexDirection:"column", flexShrink:0, overflowY:"auto" }}>
              <div style={{ padding:"22px 18px 14px" }}>
                <div style={{ fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:T.green, display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>Farm Profile</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>360° farm business view</div>
              </div>
              <div style={{ height:1, background:"rgba(255,255,255,0.09)", margin:"0 0 8px" }} />
              <div style={{ padding:"10px 16px", fontSize:12.5, color:"rgba(255,255,255,0.7)", lineHeight:1.6 }}>Fill this in once — Financial Analysis and Revenue Diversification each pull matching fields from here instead of asking twice.</div>
              <div style={{ marginTop:"auto", padding:"14px 18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:5 }}><span>Profile completeness</span><span>{profilePct}%</span></div>
                <div style={{ height:4, background:"rgba(255,255,255,0.12)", borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${profilePct}%`, background:T.green, borderRadius:2, transition:"width .4s" }} /></div>
              </div>
            </aside>
            <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
              <div style={{ background:"#fff", borderBottom:`1px solid ${T.border}`, padding:"0 28px", height:50, display:"flex", alignItems:"center", flexShrink:0 }}>
                <div style={{ fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:T.fgM }}>Farm Profile</div>
              </div>
              <div style={{ height:3, background:T.div, flexShrink:0 }}><div style={{ height:"100%", width:`${profilePct}%`, background:T.green, transition:"width .4s" }} /></div>
              <div style={{ flex:1, padding:"30px 34px", maxWidth:960, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
                <div key="profile" className="mfp-body-anim"><FarmProfilePage profile={profile} setProfile={setProfile} fa={fa} rd={rd} goFA={goFA} goRD={goRD} goRisk={goRisk} goLegacy={goLegacy} /></div>
                <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", paddingTop:22, borderTop:`1px solid ${T.border}`, marginTop:26 }}>
                  <button onClick={()=>goFA(1)} style={btnStyle("primary")}>Continue to Financial Analysis →</button>
                </div>
              </div>
            </div>
          </>
        ) : (
        <>
        {/* Rail */}
        <aside style={{ width:240, background:T.navy, display:"flex", flexDirection:"column", flexShrink:0, overflowY:"auto" }}>
          <div style={{ padding:"22px 18px 14px" }}>
            <div style={{ fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:T.green, display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>{isFA?"Financial Analysis":isRD?"Revenue Diversification":"Farm Risk Assessment"}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>{isFA?"6-stage diagnostic":isRD?"7-stage planning":"10-stage risk review"}</div>
          </div>
          <div style={{ height:1, background:"rgba(255,255,255,0.09)", margin:"0 0 8px" }} />
          <nav style={{ flex:1 }}>
            {stageDefs.map(s => {
              const active = s.n===stage, done = s.n<stage;
              return (
                <div key={s.n} onClick={()=>{ if (s.n<=stage) { isFA?goFA(s.n):isRD?goRD(s.n):goRisk(s.n); } }} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"10px 16px", cursor:s.n<=stage?"pointer":"default", background:active?"rgba(123,191,50,0.12)":"transparent", borderLeft:active?`3px solid ${T.green}`:"3px solid transparent" }}>
                  <div style={{ width:21, height:21, borderRadius:"50%", flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, background:done?T.green:active?T.blue:"rgba(255,255,255,0.12)", color:done||active?"#fff":"rgba(255,255,255,0.5)" }}>
                    {done ? <IconCheckSm size={11} /> : s.n}
                  </div>
                  <div style={{ fontSize:12.5, fontWeight:active?600:400, color:done?"rgba(255,255,255,0.7)":active?"#fff":"rgba(255,255,255,0.42)", lineHeight:1.4 }}>{s.label}</div>
                </div>
              );
            })}
          </nav>
          {isRD && (
            <div style={{ margin:"8px 12px", background:"rgba(123,191,50,0.10)", border:"1px solid rgba(123,191,50,0.22)", borderRadius:8, padding:"11px 13px" }}>
              <div style={{ fontWeight:700, fontSize:10, letterSpacing:"0.14em", color:T.green, marginBottom:6 }}>FINANCIAL ANALYSIS</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", lineHeight:1.55 }}>{faSumEnt}<br/>Score {faScore.toFixed(1)}/5 · {faTier}</div>
              <div onClick={()=>setModule("fa")} style={{ marginTop:9, fontSize:11, fontWeight:600, color:T.green, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:4 }}>← Back to Financial Analysis</div>
            </div>
          )}
          <div style={{ padding:"14px 18px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:5 }}><span>{isFA?"Financial Analysis":isRD?"Revenue Diversification":"Farm Risk"} progress</span><span>{pct}%</span></div>
            <div style={{ height:4, background:"rgba(255,255,255,0.12)", borderRadius:2, overflow:"hidden" }}><div style={{ height:"100%", width:`${pct}%`, background:T.green, borderRadius:2, transition:"width .4s" }} /></div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
          <div style={{ background:"#fff", borderBottom:`1px solid ${T.border}`, padding:"0 28px", height:50, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:T.fgM }}>Stage {stage} of {total} · {stageDefs[stage-1].label}</div>
            <div style={{ display:"flex", gap:6 }}>{chips.map((c,i) => (<span key={i} style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:999, background:T.greenL, color:"#2F6E28", whiteSpace:"nowrap" }}>{c.label}</span>))}</div>
          </div>
          <div style={{ height:3, background:T.div, flexShrink:0 }}><div style={{ height:"100%", width:`${pct}%`, background:T.green, transition:"width .4s" }} /></div>

          <div style={{ flex:1, padding:"30px 34px", maxWidth:960, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
            <div key={riskConvoActive ? "risk-convo" : `${module}-${stage}`} className="mfp-body-anim">{body}</div>
            {!riskConvoActive && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:22, borderTop:`1px solid ${T.border}`, marginTop:26 }}>
                <button onClick={onBack} style={{ ...btnStyle("outline"), opacity:backDisabled?0.4:1, pointerEvents:backDisabled?"none":"auto" }}>{backLabel}</button>
                <button onClick={onNext} style={{ ...btnStyle("primary"), opacity:canAdvance?1:0.4, pointerEvents:canAdvance?"auto":"none" }}>{nextLabel}</button>
              </div>
            )}
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
