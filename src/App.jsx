import { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FONTS  (Barlow Condensed for display / Montserrat for body — matches the
// Idealyst brand system used in the design export. In production, swap this
// @import for the bundled TTFs shipped in /fonts in the .dc.html package.)
// ─────────────────────────────────────────────────────────────────────────────
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;900&family=Montserrat:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;}
    .mfp-root{font-family:"Montserrat","Segoe UI",sans-serif;color:#0F1C39;}
    .mfp-root a{color:#0A4576;text-decoration:none;}
    .mfp-root input,.mfp-root select,.mfp-root textarea,.mfp-root button{font-family:inherit;}
    .mfp-root input:focus,.mfp-root select:focus,.mfp-root textarea:focus{border-color:#0A4576!important;box-shadow:0 0 0 3px rgba(10,69,118,0.12);outline:none;}
    .mfp-root input[type=range]{accent-color:#0A4576;}
    .mfp-root ::-webkit-scrollbar{width:10px;height:10px;}
    .mfp-root ::-webkit-scrollbar-thumb{background:#CFD4DD;border-radius:5px;}
    .mfp-root ::-webkit-scrollbar-track{background:transparent;}
    @keyframes mfpFade{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:none;}}
    .mfp-body-anim{animation:mfpFade .32s cubic-bezier(0.16,1,0.3,1);}
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — extracted verbatim from the Idealyst brand palette
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  navy:"#0F1C39", blue:"#0A4576", blueH:"#083A63", green:"#7BBF32", dgreen:"#388633",
  water:"#03A6D2", skies:"#99DFF9", amber:"#FFA400", amberT:"#B26A00", tan:"#C7893E",
  red:"#D7282F", redD:"#B0242A", silver:"#D2DCE5",
  bg:"#fff", bgAlt:"#F5F7FA", fg:"#0F1C39", fgM:"#4A5A75", fgS:"#6F7788",
  border:"#E1E6ED", div:"#EEF1F5", greenL:"#E4F2D6", amberL:"#FFF1DB",
  redL:"#FBE0E1", waterL:"#E1F4FB", blueL:"#EDF3F8",
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
const cardStyle = (extra={}) => ({ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:24, marginBottom:16, boxShadow:"0 1px 2px rgba(15,28,57,0.06)", ...extra });
const h1Style = { fontFamily:"'Barlow Condensed',sans-serif", fontSize:34, fontWeight:700, color:T.navy, margin:"0 0 4px", letterSpacing:"-0.01em", lineHeight:1.05 };
const eyebrowStyle = { fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.14em", textTransform:"uppercase", color:T.blue, display:"flex", alignItems:"center", gap:8, marginBottom:8 };
const subStyle = { fontSize:14, color:T.fgS, margin:"0 0 26px", maxWidth:660, lineHeight:1.6 };
const cardLblStyle = (extra={}) => ({ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:T.fgS, marginBottom:16, display:"flex", alignItems:"center", gap:8, ...extra });
const inputStyle = (extra={}) => ({ width:"100%", padding:"9px 11px", border:`1px solid ${T.border}`, borderRadius:6, fontSize:14, background:"#fff", color:T.fg, boxSizing:"border-box", ...extra });
const labelStyle = { fontSize:12, fontWeight:600, color:T.fgM, marginBottom:5, display:"block" };
const btnStyle = (variant, color) => {
  const col = color || T.blue;
  if (variant === "outline") return { padding:"10px 20px", borderRadius:6, cursor:"pointer", fontSize:13, fontWeight:600, background:"transparent", color:col, border:`1.5px solid ${col}`, letterSpacing:"0.02em", transition:"all .15s" };
  if (variant === "ghost") return { padding:"5px 12px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, background:T.div, color:T.fgM, border:"none" };
  return { padding:"10px 22px", borderRadius:6, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:col, color:"#fff", letterSpacing:"0.02em", transition:"all .15s" };
};
const pillStyle = (s) => {
  const m = { strong:{bg:T.greenL,c:"#2F6E28"}, ready:{bg:T.greenL,c:"#2F6E28"}, watch:{bg:T.amberL,c:T.amberT}, caution:{bg:T.amberL,c:T.amberT}, vuln:{bg:T.redL,c:T.redD}, foundation:{bg:T.redL,c:T.redD}, info:{bg:T.waterL,c:"#0A6E8C"}, blank:{bg:T.div,c:T.fgS} };
  const st = m[s] || m.blank;
  return { display:"inline-flex", alignItems:"center", gap:5, padding:"3px 11px", borderRadius:999, fontSize:11, fontWeight:700, background:st.bg, color:st.c, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.04em", textTransform:"uppercase" };
};
const scColor = (s) => ({ strong:T.dgreen, watch:T.amberT, vuln:T.red, blank:"#9FA4B0" }[s] || "#9FA4B0");
const fmt$ = (n, d=0) => { if (n===null||n===undefined||isNaN(n)) return "—"; const s=Math.abs(n).toFixed(d).replace(/\B(?=(\d{3})+(?!\d))/g,","); return (n<0?"-$":"$")+s; };
const classify = (r, val) => { if (val===""||val===null||val===undefined||isNaN(parseFloat(val))) return "blank"; const v=parseFloat(val); return r.lb ? (v<=r.sv?"strong":v>=r.vv?"vuln":"watch") : (v>=r.sv?"strong":v<=r.vv?"vuln":"watch"); };

const Flag = ({ type, children }) => {
  const m = { ok:{bg:T.greenL,c:"#2F6E28"}, warn:{bg:T.amberL,c:T.amberT}, danger:{bg:T.redL,c:T.redD}, info:{bg:T.waterL,c:"#0A6E8C"} }[type];
  return <div style={{ background:m.bg, color:m.c, borderRadius:8, padding:"11px 14px", fontSize:12.5, display:"flex", alignItems:"flex-start", gap:9, marginBottom:10, lineHeight:1.5 }}><Fic type={type} /><span>{children}</span></div>;
};

const Head = ({ eyebrow, title, sub }) => (
  <div>
    <div style={eyebrowStyle}><Apex color={T.green} />{eyebrow}</div>
    <h1 style={h1Style}>{title}</h1>
    <p style={subStyle}>{sub}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const FA_STAGES = [
  { n:1, label:"Enterprise dashboard" }, { n:2, label:"Goal alignment" }, { n:3, label:"Ratio deep dive" },
  { n:4, label:"Peer benchmarking" }, { n:5, label:"Scenario modeling" }, { n:6, label:"Action plan & monitoring" },
];
const RD_STAGES = [
  { n:1, label:"Baseline & readiness" }, { n:2, label:"Goal alignment" }, { n:3, label:"Asset & readiness inventory" },
  { n:4, label:"Opportunity mapping" }, { n:5, label:"Barrier identification" }, { n:6, label:"Scenario comparison" },
  { n:7, label:"Financial reserves & sequencing" }, { n:8, label:"Action plan" },
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
  { n:5, label:"Revenue ops & key contacts" }, { n:6, label:"Threat identification & ranking" },
  { n:7, label:"Strategy & contingency plans" }, { n:8, label:"Communicate, train & review" },
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
  { id:"energy", label:"Renewable energy lease", category:"Risk-smoothing", cluster:"Environmental & Energy", growthTier:1, sizeFit:["mid","large"], desc:"Solar or wind developer leases your land. Passive income, no capital required.", time:"12–24 months", capital:"$0–$2K", fit:{asset:40,trust:30,risk:80}, reg:4, seasonal:1 , effort:1, liquidity:2 },
  { id:"specialty", label:"Specialty grain contracts", category:"Trust leverage", cluster:"Value-Added Processing & Brands", growthTier:2, sizeFit:["small","mid"], desc:"Grow identity-preserved grains — malting barley, non-GMO corn, food-grade soybeans — under contract.", time:"8–14 months", capital:"$5K–$20K", fit:{asset:60,trust:80,risk:50}, reg:2, seasonal:4 , effort:4, liquidity:3 },
  { id:"custom", label:"Custom farming services", category:"Asset leverage", cluster:"Custom Field Services", growthTier:2, sizeFit:["mid","large"], desc:"Hire out equipment and labor to neighboring farms for tillage, planting, or spraying.", time:"3–6 months", capital:"$0 if equipment audit passes", fit:{asset:90,trust:60,risk:40}, reg:2, seasonal:5 , effort:5, liquidity:3 },
  { id:"carbon", label:"Carbon & conservation programs", category:"Risk-smoothing", cluster:"Environmental & Energy", growthTier:1, sizeFit:["small","mid","large"], desc:"Enroll in USDA conservation programs or voluntary carbon markets.", time:"6–18 months", capital:"$0–$5K", fit:{asset:30,trust:40,risk:90}, reg:3, seasonal:1 , effort:2, liquidity:2 },
  { id:"education", label:"On-farm education & agritourism", category:"Trust leverage", cluster:"Space, Storage & Experience", growthTier:3, sizeFit:["small","mid"], desc:"Host farm tours, workshops, or agritourism experiences.", time:"3–9 months", capital:"$2K–$15K", fit:{asset:40,trust:90,risk:30}, reg:3, seasonal:3 , effort:4, liquidity:3 },
  { id:"processing", label:"Value-added processing", category:"Asset leverage", cluster:"Value-Added Processing & Brands", growthTier:2, sizeFit:["mid","large"], desc:"Process or package a portion of production for direct sale — flour, cheese, meat cuts, spirits.", time:"12–24 months", capital:"$20K–$150K", fit:{asset:70,trust:70,risk:50}, reg:5, seasonal:2 , effort:4, liquidity:2 },
  { id:"consulting", label:"Agricultural consulting", category:"Trust leverage", cluster:"Data & Knowledge Services", growthTier:1, sizeFit:["small","mid","large"], desc:"Sell management expertise to other farmers.", time:"1–3 months", capital:"$500–$2K", fit:{asset:10,trust:95,risk:60}, reg:2, seasonal:2 , effort:3, liquidity:4 },
  { id:"storage", label:"Grain storage as a service", category:"Asset leverage", cluster:"Space, Storage & Experience", growthTier:2, sizeFit:["mid","large"], desc:"Rent existing grain storage to neighboring farms during off-peak periods.", time:"1–3 months", capital:"$0", fit:{asset:85,trust:50,risk:70}, reg:2, seasonal:2 , effort:2, liquidity:3 },
  { id:"trucking", label:"Grain & bulk trucking", category:"Asset leverage", cluster:"Trucking & Heavy Equipment", growthTier:2, sizeFit:["mid","large"], desc:"Haul grain, feed, fertilizer, or bulk freight for local elevators and plants using your own trucks and authority.", time:"6–12 months", capital:"$10K–$40K", fit:{asset:80,trust:40,risk:50}, reg:4, seasonal:2 , effort:4, liquidity:2 },
  { id:"demolition", label:"Demolition & excavation", category:"Asset leverage", cluster:"Trucking & Heavy Equipment", growthTier:2, sizeFit:["mid","large"], desc:"Structure teardown, concrete removal, and site clearing using existing excavators, loaders, and trucks.", time:"6–12 months", capital:"$15K–$60K", fit:{asset:75,trust:35,risk:45}, reg:5, seasonal:1 , effort:5, liquidity:2 },
  { id:"beefOnDairy", label:"Beef-on-dairy breeding program", category:"Risk-smoothing", cluster:"Livestock-Specific Ventures", growthTier:2, sizeFit:["mid","large"], desc:"Breed a share of the dairy herd to beef genetics — crossbred calves sell at a significant premium over straight dairy calves.", time:"9–15 months", capital:"$5K–$15K (semen + sorting)", fit:{asset:50,trust:30,risk:75}, reg:1, seasonal:2, entSpecific:"dairy" , effort:3, liquidity:3 },
  { id:"breeding", label:"Breeding stock sales", category:"Trust leverage", cluster:"Livestock-Specific Ventures", growthTier:3, sizeFit:["small","mid"], desc:"Market high-quality breeding animals to other farmers, building on recognized genetics or bloodlines.", time:"12–24 months", capital:"$5K–$20K", fit:{asset:55,trust:70,risk:40}, reg:2, seasonal:2 , effort:3, liquidity:2 },
  { id:"manure", label:"Manure-to-value (compost/biogas)", category:"Asset leverage", cluster:"Livestock-Specific Ventures", growthTier:3, sizeFit:["mid","large"], desc:"Convert livestock waste into compost, organic fertilizer, or biogas for sale rather than a disposal cost.", time:"6–18 months", capital:"$10K–$75K", fit:{asset:70,trust:30,risk:60}, reg:3, seasonal:2 , effort:4, liquidity:2 },
  { id:"dtcBrand", label:"Direct-to-consumer food brand", category:"Trust leverage", cluster:"Value-Added Processing & Brands", growthTier:2, sizeFit:["small","mid"], desc:"Sell meat, eggs, or specialty grains directly via farm stores, CSAs, online, or farmers markets at retail pricing.", time:"6–12 months", capital:"$5K–$25K", fit:{asset:35,trust:85,risk:45}, reg:3, seasonal:3 , effort:4, liquidity:3 },
  { id:"dataAdvisory", label:"Precision ag & data advisory", category:"Trust leverage", cluster:"Data & Knowledge Services", growthTier:1, sizeFit:["mid","large"], desc:"Offer precision ag consulting, AI-assisted agronomy, or risk decision-support to other operations.", time:"3–9 months", capital:"$1K–$10K", fit:{asset:15,trust:80,risk:55}, reg:1, seasonal:2 , effort:3, liquidity:4 },
  { id:"envServices", label:"Environmental & ecosystem services", category:"Risk-smoothing", cluster:"Environmental & Energy", growthTier:1, sizeFit:["mid","large"], desc:"Water-quality credits, habitat leasing, or biodiversity programs layered on top of existing conservation practices.", time:"9–18 months", capital:"$0–$8K", fit:{asset:35,trust:35,risk:90}, reg:4, seasonal:1 , effort:2, liquidity:2 },
  { id:"inputRetail", label:"Input sales & agronomy retail", category:"Trust leverage", cluster:"Custom Field Services", growthTier:3, sizeFit:["small","mid"], desc:"Sell seed, fertilizer, or crop inputs to neighboring farms, leveraging existing supplier relationships and expertise.", time:"3–9 months", capital:"$5K–$15K", fit:{asset:25,trust:75,risk:50}, reg:2, seasonal:3 , effort:3, liquidity:3 },
  { id:"eventRental", label:"Facility rental & hosted events", category:"Trust leverage", cluster:"Space, Storage & Experience", growthTier:3, sizeFit:["small","mid"], desc:"Rent barns, fields, or converted buildings for weddings, retreats, or community markets during the off-season.", time:"6–12 months", capital:"$5K–$30K", fit:{asset:60,trust:75,risk:35}, reg:3, seasonal:3 , effort:4, liquidity:2 },
  // ── Financial capital deployment — opportunity-cost alternatives to physical/sweat-equity
  // ventures. These convert capital directly into future income or risk protection with
  // minimal ongoing physical effort. Not financial advice — for comparison only; a licensed
  // financial advisor or Farm Credit advisor should be consulted before committing capital.
  { id:"annuity", label:"Fixed or fixed-indexed annuity", category:"Risk-smoothing", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["mid","large"], desc:"Convert a lump sum or systematic contributions into a guaranteed income stream. Fixed-indexed versions (FIAs) link partial growth to a market index like the S&P 500 while protecting principal from downturns — a way to pursue inflation-beating growth without direct exposure to commodity or stock market losses.", time:"Immediate or deferred by years", capital:"$25K–$250K+", fit:{asset:5,trust:10,risk:95}, reg:2, seasonal:1, effort:1, liquidity:1 },
  { id:"wholeLife", label:"Whole life insurance (cash value)", category:"Risk-smoothing", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["small","mid","large"], desc:"Builds tax-advantaged cash value you can borrow against to self-finance equipment or land, while providing a death benefit for succession planning.", time:"Cash value meaningfully usable after 5–10 years", capital:"$5K–$50K+ annual premium", fit:{asset:5,trust:15,risk:85}, reg:2, seasonal:1, effort:1, liquidity:2 },
  { id:"selfInsurance", label:"Self-insurance reserve fund", category:"Risk-smoothing", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["large"], desc:"Build and manage your own reserve fund to self-insure against certain risks instead of paying rising commercial premiums — typically a large-operation strategy.", time:"Meaningful protection after 3–5 years of funding", capital:"$25K–$500K+", fit:{asset:10,trust:10,risk:90}, reg:3, seasonal:1, effort:1, liquidity:1 },
  { id:"retirementPlan", label:"Qualified retirement plan (SEP-IRA / defined benefit)", category:"Risk-smoothing", cluster:"Financial Capital Deployment", growthTier:2, sizeFit:["mid","large"], desc:"Shelter high-income years from current taxation by contributing to a SEP-IRA or defined benefit plan — converting today's profit into guaranteed future retirement income.", time:"Tax benefit immediate; income access at retirement age", capital:"Up to $70K+/year (SEP) or more for defined benefit", fit:{asset:0,trust:5,risk:90}, reg:2, seasonal:1, effort:1, liquidity:1 },
  { id:"sellerFinancing", label:"Seller financing / ag lending to peers", category:"Risk-smoothing", cluster:"Financial Capital Deployment", growthTier:3, sizeFit:["large"], desc:"Use farm equity or cash reserves to finance land or equipment sales to other farmers, earning interest income secured by the asset sold.", time:"Income begins as soon as the note is originated", capital:"$50K–$500K+ (secured against the asset)", fit:{asset:20,trust:30,risk:70}, reg:3, seasonal:1, effort:2, liquidity:1 },
  { id:"agReit", label:"Farmland fund or ag REIT investment", category:"Risk-smoothing", cluster:"Financial Capital Deployment", growthTier:2, sizeFit:["mid","large"], desc:"Passive exposure to farmland appreciation through an ag-focused REIT or farmland investment platform (AcreTrader-style) — without buying, financing, or managing more acreage yourself.", time:"Typically a multi-year hold; some platforms offer periodic liquidity windows", capital:"$10K–$100K+", fit:{asset:10,trust:15,risk:85}, reg:2, seasonal:1, effort:1, liquidity:2 },
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
  trucking:[0,0,2,4,5,5,5,4,4,5,5,4], demolition:[0,0,0,1,3,5,6,6,5,3,2,1], beefOnDairy:[0,0,0,0,2,3,4,5,5,5,5,5], breeding:[0,0,0,0,0,1,2,3,3,4,4,4], manure:[0,0,0,1,2,3,3,4,4,4,4,4], dtcBrand:[0,1,2,3,4,4,5,5,5,5,5,5], dataAdvisory:[1,2,3,3,4,4,4,4,4,4,4,4], envServices:[0,0,0,0,0,1,2,3,3,3,3,3], inputRetail:[0,0,1,2,3,3,4,4,4,4,3,2], eventRental:[0,0,1,3,4,5,5,4,3,2,3,4],
  annuity:[3,3,3,3,3,3,3,3,3,3,3,3], wholeLife:[0,0,0,0,0,0,1,1,1,1,1,1], selfInsurance:[0,0,0,0,1,1,1,2,2,2,2,2], retirementPlan:[2,2,2,2,2,2,2,2,2,2,2,2], sellerFinancing:[4,4,4,4,4,4,4,4,4,4,4,4], agReit:[0,0,0,2,2,2,2,2,2,2,2,2] };

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 1 — Enterprise dashboard
// ─────────────────────────────────────────────────────────────────────────────
function FA1({ fa, setFA }) {
  const active = fa.enterprises;
  const toggle = (k) => setFA(s => ({ ...s, enterprises: s.enterprises.includes(k) ? s.enterprises.filter(x=>x!==k) : [...s.enterprises, k] }));
  const wfFields = [
    { key:"liquidity", label:"Liquidity", opts:["Strong — current ratio > 2.0","Watch — 1.0–2.0","Vulnerable — < 1.0"] },
    { key:"solvency", label:"Solvency", opts:["Strong — D/A < 40%","Watch — 40–60%","Vulnerable — > 60%"] },
    { key:"profitability", label:"Profitability", opts:["Strong — ROA > 5%","Watch — 1–5%","Vulnerable — < 1%"] },
    { key:"efficiency", label:"Operating expense ratio", opts:["Strong — OER < 65%","Watch — 65–80%","Weak — > 80%"] },
  ];
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 1" title="Enterprise dashboard" sub="Select the enterprises you operate. Each one gets its own ratio scorecard, and this profile flows into the Revenue Diversification module." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Select your enterprises</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {Object.entries(ENT).map(([k,v]) => {
            const on = active.includes(k);
            return (
              <button key={k} onClick={()=>toggle(k)} style={{ padding:"16px 15px", borderRadius:9, border:on?`2px solid ${T.blue}`:`1px solid ${T.border}`, cursor:"pointer", background:on?T.blueL:"#fff", textAlign:"left", display:"flex", flexDirection:"column", gap:8, transition:"all .12s" }}>
                <EntIcon type={k} color={on?T.blue:T.fgS} size={26} />
                <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700, color:on?T.blue:T.navy }}>{v.label}</div><div style={{ fontSize:11.5, color:T.fgS, marginTop:1 }}>{v.sub}</div></div>
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
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><EntIcon type={ek} color={T.blue} size={24} /><div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:700 }}>{ec.label}</div><div style={{ fontSize:11.5, color:T.fgS }}>{ec.sub}</div></div></div>
              <div style={{ fontSize:12.5, fontWeight:700, color:tC, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.02em" }}>{tL}</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:cols, gap:6, background:T.bgAlt, borderRadius:6, padding:"8px 12px", marginBottom:2 }}>
              {["Ratio","Strong","Watch","Vuln.","Your value"].map((hh,i)=>(<div key={i} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", textAlign:i===0?"left":"center" }}>{hh}</div>))}
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
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Whole-farm health</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
          {wfFields.map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <select style={inputStyle()} value={fa.wholeFarm[f.key]||""} onChange={e=>setFA(s=>({...s,wholeFarm:{...s.wholeFarm,[f.key]:e.target.value}}))}>
                <option value="">Select</option>{f.opts.map((o,i)=><option key={i} value={["strong","watch","vuln"][i]}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
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
          <div style={cardLblStyle()}><Apex color={T.green} />{q.title}</div>
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
        <div style={cardLblStyle()}><Apex color={T.green} />Financial tracking (select all that apply)</div>
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
function FA3({ fa, setFA }) {
  const s3 = fa.s3vals;
  const gv = id => parseFloat(s3[id])||0; const v = id => s3[id]||""; const sv = (id,val) => setFA(s=>({...s,s3vals:{...s.s3vals,[id]:val}}));
  const gross=gv("gross"), opex=gv("opex"), inputs=gv("inputs"), depr=gv("depr"), interest=gv("interest"), acres=gv("acres"), principal=gv("principal");
  const hasData = gross>0 && opex>0 && acres>0;
  const oer = hasData ? opex/gross*100 : null, ipa = hasData&&inputs>0 ? inputs/acres : null, grpa = hasData ? gross/acres : null, nrpa = hasData ? (gross-opex)/acres : null, nfi = hasData ? gross-opex-depr-interest : null;
  const totalDebt = interest+principal, dscr = hasData&&totalDebt>0 ? nfi/totalDebt : null;
  const fP = n => n===null?"—":Math.round(n)+"%"; const fD = n => n===null?"—":n.toFixed(2)+"x";
  const stR = (val,sv2,vv,lb) => val===null?"blank":(lb?(val<=sv2?"strong":val>=vv?"vuln":"watch"):(val>=sv2?"strong":val<=vv?"vuln":"watch"));
  const INPUTS = [{id:"gross",label:"Gross farm income",sub:"Sch F, Line 11",pre:"$"},{id:"opex",label:"Total operating expenses",sub:"Sch F, Line 33",pre:"$"},{id:"inputs",label:"Input costs (seed, fert, chem, fuel)",sub:"Sch F Lines 7–10",pre:"$"},{id:"rent",label:"Land rent paid",sub:"Sch F, Line 24",pre:"$"},{id:"depr",label:"Depreciation",sub:"Sch F, Line 16",pre:"$"},{id:"interest",label:"Interest paid",sub:"Sch F, Line 21",pre:"$"},{id:"acres",label:"Total acres farmed",sub:"Owned + rented",suf:"ac"},{id:"principal",label:"Annual principal payments",sub:"From loan statements",pre:"$"}];
  const RATIOS = [{label:"Operating expense ratio",val:fP(oer),status:stR(oer,65,80,true),bench:"Strong < 65%"},{label:"Input cost per acre",val:fmt$(ipa)+"/ac",status:stR(ipa,478,535,true),bench:"Strong < $478"},{label:"Gross revenue per acre",val:fmt$(grpa)+"/ac",status:stR(grpa,951,800,false),bench:"Strong > $951"},{label:"Net return per acre",val:fmt$(nrpa)+"/ac",status:stR(nrpa,150,50,false),bench:"Strong > $150"},{label:"Net farm income",val:fmt$(nfi),status:nfi===null?"blank":nfi>=0?"strong":"vuln",bench:"Positive covers full cost"},{label:"Debt service coverage",val:fD(dscr),status:stR(dscr,1.25,1.0,false),bench:"Strong > 1.25x"}];
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 3" title="Ratio deep dive" sub={(fa.goals.tracking||[]).includes("schedF") ? "Schedule F path active — enter your line numbers below. Ratios calculate automatically." : "Enter your financial data. Ratios calculate automatically as you type."} />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Financial data</div>
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
      {hasData && (
        <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
          <div style={cardLblStyle()}><Apex color={T.green} />Ratio scorecard</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 160px", gap:8, background:T.bgAlt, borderRadius:6, padding:"8px 12px", marginBottom:4 }}>
            {["Ratio","Your value","Benchmark"].map((hh,i)=>(<div key={i} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", textAlign:i===1?"right":"left" }}>{hh}</div>))}
          </div>
          {RATIOS.map((r,i) => (
            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 100px 160px", gap:8, padding:"10px 12px", borderBottom:`1px solid ${T.div}`, alignItems:"center" }}>
              <div style={{ fontSize:13 }}>{r.label}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:scColor(r.status), textAlign:"right" }}>{r.val}</div>
              <div style={{ fontSize:11.5, color:T.fgS }}>{r.bench}</div>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            {nfi!==null && nfi<0 && <Flag type="danger">Net farm income is negative — depreciation and interest are eroding equity.</Flag>}
            {oer!==null && oer>80 && <Flag type="danger">OER above 80% — operating costs consume more than 80 cents of every revenue dollar.</Flag>}
            {dscr!==null && dscr<1 && <Flag type="danger">DSCR below 1.0x — net income does not cover debt service. Contact your Farm Credit advisor.</Flag>}
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
        <div style={cardLblStyle()}><Apex color={T.green} />Enter your values</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {B.map(bb => (<div key={bb.key}><label style={labelStyle}>{bb.label} ({bb.unit})</label><input type="number" style={inputStyle()} placeholder={`e.g. ${bb.avg}`} value={v(bb.key)} onChange={e=>sv(bb.key,e.target.value)} /></div>))}
          <div><label style={labelStyle}>Acres farmed</label><input type="number" style={inputStyle()} placeholder="e.g. 1200" value={v("acres")} onChange={e=>sv("acres",e.target.value)} /></div>
        </div>
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Your position vs. peers</div>
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
              <div style={{ textAlign:"right" }}>{hasVal && <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:800, color:barC, marginBottom:3 }}>{val}{unitSuf(bb)}</div>}<span style={pillStyle(status)}>{pillLabel[status]}</span></div>
            </div>
          );
        })}
      </div>
      {gaps.length>0 && (
        <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
          <div style={cardLblStyle()}><Apex color={T.green} />Gap analysis — annual value of reaching top quartile</div>
          {gaps.map((g,i) => (<div key={i} style={{ padding:"10px 0", borderBottom:i<gaps.length-1?`1px solid ${T.div}`:"none" }}><div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{g.label}</div><div style={{ fontSize:12.5, color:T.dgreen, fontWeight:600 }}>Recover {fmt$(g.toTop)} annually vs. top quartile</div></div>))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 5 — Scenario modeling
// ─────────────────────────────────────────────────────────────────────────────
function FA5({ fa, setFA }) {
  const s5 = fa.s5;
  const gv = (k,def) => s5[k]!==undefined ? s5[k] : def; const sv = (k,v2) => setFA(s=>({...s,s5:{...s.s5,[k]:v2}}));
  const acres=gv("acres",1200), pctCorn=gv("pctCorn",55)/100, yldCorn=gv("yldCorn",183), yldSoy=gv("yldSoy",53);
  const cornP=gv("cornP",4.20), soyP=gv("soyP",10.30), inputChg=gv("inputChg",0), rentChg=gv("rentChg",0), yieldVar=gv("yieldVar",0), fwd=gv("fwd",0)/100;
  const baseInputs=gv("baseInputs",505), baseRent=gv("baseRent",240), overhead=gv("overhead",120), debt=gv("debt",180000), baseCornP=gv("baseCornP",4.20), baseSoyP=gv("baseSoyP",10.30);
  const aYC=yldCorn*(1+yieldVar/100), aYS=yldSoy*(1+yieldVar/100); const bCorn=fwd*baseCornP+(1-fwd)*cornP, bSoy=fwd*baseSoyP+(1-fwd)*soyP;
  const grpa=pctCorn*aYC*bCorn+(1-pctCorn)*aYS*bSoy; const totalCostPA=baseInputs*(1+inputChg/100)+baseRent*(1+rentChg/100)+overhead;
  const nrpa=grpa-totalCostPA, oer=grpa>0?totalCostPA/grpa*100:0, nfi=nrpa*acres, dscr=debt>0?nfi/debt:null;
  const basegrpa=pctCorn*yldCorn*baseCornP+(1-pctCorn)*yldSoy*baseSoyP, baseNrpa=basegrpa-(baseInputs+baseRent+overhead);
  const SCENS = [{label:"Baseline",cornP:baseCornP,soyP:baseSoyP,yieldVar:0,inputChg:0,rentChg:0,fwd:0},{label:"Price −15%",cornP:baseCornP*0.85,soyP:baseSoyP*0.85,yieldVar:0,inputChg:0,rentChg:0,fwd:0},{label:"Drought −20%",cornP:baseCornP,soyP:baseSoyP,yieldVar:-20,inputChg:0,rentChg:0,fwd:0},{label:"Input +12%",cornP:baseCornP,soyP:baseSoyP,yieldVar:0,inputChg:12,rentChg:0,fwd:0},{label:"Top quartile",cornP:baseCornP,soyP:baseSoyP,yieldVar:0,inputChg:-11,rentChg:-8,fwd:35}];
  const loadScen = s2 => { sv("cornP",+s2.cornP.toFixed(2)); sv("soyP",+s2.soyP.toFixed(2)); sv("yieldVar",s2.yieldVar); sv("inputChg",s2.inputChg); sv("rentChg",s2.rentChg); sv("fwd",s2.fwd); };
  const metrics = [{label:"Gross rev/ac",val:"$"+Math.round(grpa),delta:Math.round(grpa-basegrpa),pos:grpa>=basegrpa},{label:"Net return/ac",val:"$"+Math.round(nrpa),delta:Math.round(nrpa-baseNrpa),pos:nrpa>=baseNrpa,status:nrpa>150?"strong":nrpa>=50?"watch":"vuln"},{label:"OER",val:Math.round(oer)+"%",pos:oer<=(baseInputs+baseRent+overhead)/basegrpa*100},{label:"DSCR",val:dscr?dscr.toFixed(2)+"x":"N/A",status:dscr?(dscr>1.25?"strong":dscr>=1?"watch":"vuln"):"blank"},{label:"Net farm income",val:(nfi<0?"-$":"$")+Math.abs(Math.round(nfi)).toLocaleString(),pos:nfi>=0}];
  const SL = [{key:"cornP",label:"Corn price ($/bu)",min:3,max:6.5,step:0.05,fmt:x=>"$"+parseFloat(x).toFixed(2)},{key:"soyP",label:"Soy price ($/bu)",min:8,max:16,step:0.05,fmt:x=>"$"+parseFloat(x).toFixed(2)},{key:"yieldVar",label:"Yield variance (%)",min:-30,max:20,step:1,fmt:x=>(x>0?"+":"")+x+"%"},{key:"inputChg",label:"Input cost change (%)",min:-20,max:25,step:1,fmt:x=>(x>0?"+":"")+x+"%"},{key:"rentChg",label:"Rent change (%)",min:-20,max:20,step:1,fmt:x=>(x>0?"+":"")+x+"%"},{key:"fwd",label:"Forward contracted (%)",min:0,max:80,step:5,fmt:x=>x+"%"}];
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 5" title="Scenario modeling" sub="Adjust the levers to see how your ratios respond, or load a preset stress scenario." />
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Baseline inputs</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
          {[{k:"acres",l:"Acres",d:1200},{k:"pctCorn",l:"% corn",d:55},{k:"baseCornP",l:"Base corn $/bu",d:4.20},{k:"baseSoyP",l:"Base soy $/bu",d:10.30},{k:"baseInputs",l:"Input $/ac",d:505},{k:"baseRent",l:"Rent $/ac",d:240},{k:"overhead",l:"Overhead $/ac",d:120},{k:"debt",l:"Debt service $",d:180000}].map(f => (<div key={f.k}><label style={labelStyle}>{f.l}</label><input type="number" style={inputStyle()} value={gv(f.k,f.d)} onChange={e=>sv(f.k,parseFloat(e.target.value)||0)} /></div>))}
        </div>
      </div>
      <div style={cardStyle()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <div style={cardLblStyle({ marginBottom:0 })}><Apex color={T.green} />Scenario levers</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{SCENS.map((s2,i)=>(<button key={i} style={{ ...btnStyle("outline"), fontSize:11, padding:"5px 11px" }} onClick={()=>loadScen(s2)}>{s2.label}</button>))}</div>
        </div>
        {SL.map(sl => (<div key={sl.key} style={{ display:"grid", gridTemplateColumns:"170px 1fr 64px", gap:12, alignItems:"center", marginBottom:15 }}><div style={{ fontSize:13 }}>{sl.label}</div><input type="range" min={sl.min} max={sl.max} step={sl.step} value={gv(sl.key,0)} onChange={e=>sv(sl.key,parseFloat(e.target.value))} style={{ width:"100%" }} /><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, textAlign:"right" }}>{sl.fmt(gv(sl.key,0))}</div></div>))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:16 }}>
        {metrics.map((m,i) => (<div key={i} style={{ background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 12px", textAlign:"center" }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:T.fgS, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:600 }}>{m.label}</div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:m.status?scColor(m.status):(m.pos!==undefined?(m.pos?T.dgreen:T.red):T.navy) }}>{m.val}</div>{m.delta!=null && <div style={{ fontSize:10.5, color:m.pos?T.dgreen:T.red, marginTop:4 }}>{(m.delta>0?"+":"")+m.delta}/ac vs base</div>}</div>))}
      </div>
      {nrpa<0 && <Flag type="danger">Net return is negative at ${Math.round(nrpa)}/acre in this scenario.</Flag>}
      {nrpa>=0 && nrpa<50 && <Flag type="warn">Net return ${Math.round(nrpa)}/acre — below the $50 watch threshold.</Flag>}
      {nrpa>=50 && oer<=80 && <Flag type="ok">Ratios in acceptable range. OER {Math.round(oer)}%, net return ${Math.round(nrpa)}/ac.</Flag>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 6 — Farm risk assessment
// ─────────────────────────────────────────────────────────────────────────────
// Adapted from the Nationwide Farm Risk Ready℠ framework (risk identification,
// managing/preventing risk, contingency planning, communicating the plan) plus
// financial, insurance, production, market, succession, and cyber layers specific
// to MFP. Restyled to the Idealyst design system — color-coded categories, no
// decorative icons, consistent with the rest of the app.
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
function RiskCategoryStage({ risk, setRisk, catIndex }) {
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
      {catAnswered>0 && <div style={{ marginBottom:16 }}><span style={pillStyle(catSL.pill)}>{catSL.label}</span><span style={{ fontSize:11.5, color:T.fgM, marginLeft:10 }}>{catAnswered}/{cat.questions} answered · {catScore}/{cat.maxScore} points</span></div>}
      {qs.map((q,qi) => {
        const selected = answers[q.id];
        return (
          <div key={q.id} style={cardStyle()}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:cat.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>{qi+1}</div>
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
];
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

// Stage 2 of Farm Risk — Revenue operations & key contacts
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
          <div style={cardLblStyle({ marginBottom:0 })}><Apex color={T.green} />Primary revenue operations</div>
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
          <div style={cardLblStyle({ marginBottom:0 })}><Apex color={T.green} />Key supplier, vendor & customer contacts</div>
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

// Stage 3 of Farm Risk — Threat identification & ranking
function RiskPlanThreats({ risk, setRisk }) {
  const plan = risk.plan || {};
  const threats = plan.threats || [];
  const setPlan = (patch) => setRisk(s => ({ ...s, plan:{ ...(s.plan||{}), ...patch } }));
  const [draft, setDraft] = useState({ category:"facility", label:"", probability:3, severity:3 });
  const addThreat = () => { if (!draft.label.trim()) return; setPlan({ threats:[...threats, { ...draft, id:Date.now() }] }); setDraft({ category:"facility", label:"", probability:3, severity:3 }); };
  const removeThreat = (id) => setPlan({ threats: threats.filter(t=>t.id!==id) });
  const sorted = [...threats].sort((a,b)=>threatScore(b)-threatScore(a));
  return (
    <div>
      <Head eyebrow="Farm Risk · Plan Builder · Stage 2" title="Threat identification & ranking" sub="List potential threats across all six categories, then score each on probability and severity. Threats scoring 10–25 are your most immediate concern — you'll build strategies and contingency plans for these next." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
        {THREAT_CATEGORIES.map(c => (<div key={c.id} style={{ background:c.colorL, borderRadius:8, padding:"10px 12px" }}><div style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.label}</div><div style={{ fontSize:10.5, color:T.fgM, marginTop:2 }}>{c.desc}</div></div>))}
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Add a threat or risk</div>
        <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 110px 110px 90px", gap:10, alignItems:"end" }}>
          <div><label style={labelStyle}>Category</label><select style={inputStyle()} value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}>{THREAT_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div><label style={labelStyle}>Describe the threat</label><input style={inputStyle()} value={draft.label} onChange={e=>setDraft(d=>({...d,label:e.target.value}))} placeholder="e.g., Grain bin structure collapse" /></div>
          <div><label style={labelStyle}>Probability (1–5)</label><select style={inputStyle()} value={draft.probability} onChange={e=>setDraft(d=>({...d,probability:parseInt(e.target.value)}))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          <div><label style={labelStyle}>Severity (1–5)</label><select style={inputStyle()} value={draft.severity} onChange={e=>setDraft(d=>({...d,severity:parseInt(e.target.value)}))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
          <button style={btnStyle("primary")} onClick={addThreat}>Add</button>
        </div>
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Your ranked threats — highest score first</div>
        {sorted.length===0 && <div style={{ fontSize:12.5, color:T.fgS }}>No threats added yet.</div>}
        {sorted.map(t => {
          const cat = THREAT_CATEGORIES.find(c=>c.id===t.category); const score = threatScore(t); const urgent = score>=10;
          return (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:`1px solid ${T.div}` }}>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, background:cat?.colorL, color:cat?.color, flexShrink:0 }}>{cat?.label}</span>
              <span style={{ fontSize:13, color:T.navy, flex:1 }}>{t.label}</span>
              <span style={{ fontSize:11, color:T.fgM }}>P{t.probability} × S{t.severity}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:800, color:urgent?T.red:T.fgM, width:36, textAlign:"right" }}>{score}</span>
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

// Stage 4 of Farm Risk — Strategy & contingency plans (combines Nationwide Steps 2–3)
function RiskPlanStrategy({ risk, setRisk }) {
  const plan = risk.plan || {};
  const threats = plan.threats || [];
  const strategies = plan.strategies || {};
  const contingency = plan.contingency || {};
  const setPlan = (patch) => setRisk(s => ({ ...s, plan:{ ...(s.plan||{}), ...patch } }));
  const setStrategy = (id,field,val) => setPlan({ strategies:{ ...strategies, [id]:{ ...(strategies[id]||{}), [field]:val } } });
  const setContingency = (id,field,val) => setPlan({ contingency:{ ...contingency, [id]:{ ...(contingency[id]||{}), [field]:val } } });
  const top = topRankedThreats(threats);
  return (
    <div>
      <Head eyebrow="Farm Risk · Plan Builder · Stage 3" title="Strategy & contingency plans" sub="For each of your highest-ranked threats, choose a management strategy and build your Plan A for responding if it happens." />
      {top.length===0 && <Flag type="warn">No ranked threats yet. Go back to the previous stage and add at least one.</Flag>}
      {top.map(t => {
        const cat = THREAT_CATEGORIES.find(c=>c.id===t.category); const s = strategies[t.id]||{}; const c2 = contingency[t.id]||{};
        return (
          <div key={t.id} style={cardStyle({ borderLeft:`4px solid ${cat?.color}` })}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999, background:cat?.colorL, color:cat?.color }}>{cat?.label}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:700 }}>{t.label}</span>
              <span style={{ marginLeft:"auto", fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:800, color:T.red }}>Score: {threatScore(t)}</span>
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

// Stage 5 of Farm Risk — Communicate, train & review (combines Nationwide Steps 4–5)
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
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:700 }}>{t.label}</span>
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
        <div style={cardLblStyle()}><Apex color={T.green} />Step 5 — Prepare, recover, and review</div>
        <div style={{ fontSize:12.5, color:T.fgM, lineHeight:1.5, marginBottom:14 }}>Recovery is about the speed of returning to normal operations after a disruption. Review your plans annually, involve your team, and set aside time to test the plan against a real scenario.</div>
        <label style={labelStyle}>Optional: crisis communications preparedness plan</label>
        <div style={{ fontSize:11.5, color:T.fgS, marginBottom:8 }}>A product safety scare, animal welfare situation, or manure spill can erode trust in your farm fast if the communication response isn't managed well.</div>
        <textarea style={inputStyle({ minHeight:80 })} value={plan.crisisComms||""} onChange={e=>setPlan({ crisisComms:e.target.value })} placeholder="Who speaks for the farm publicly? What's the first statement? Who approves it before it goes out?" />
      </div>
      <div style={{ ...cardStyle({ background:T.navy, border:"none" }) }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:700, color:"#fff", marginBottom:6 }}>Farm Risk Ready℠ Plan complete</div>
        <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>Share this plan with your family, employees, and your Farm Credit or Nationwide advisor. Set a calendar reminder to revisit it every year — immediately after tax filing is a natural trigger.</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FA STAGE 6 — Action plan & monitoring
// ─────────────────────────────────────────────────────────────────────────────
function FA6({ fa, goRD }) {
  const enterprises = fa.enterprises;
  const isDairy = enterprises.includes("dairy"); const isDistress = fa.wholeFarm.profitability==="vuln" || fa.wholeFarm.liquidity==="vuln";
  const s3 = fa.s3vals; const dscr_ = (s3.interest&&s3.principal) ? ((parseFloat(s3.gross||0)-parseFloat(s3.opex||0)-parseFloat(s3.depr||0)-parseFloat(s3.interest||0))/(parseFloat(s3.interest||0)+parseFloat(s3.principal||0))) : null;
  const ACTIONS = isDairy ? [
    { tier:"r", label:"Schedule Farm Credit advisor meeting this week", detail:"Present IOFC, NCOP, OER and DSCR. Bring your most recent milk check and feed invoices.", impact:"Non-cash — preserves options worth $50K–$1M+" },
    { tier:"r", label:"DMC enrollment at $9.50/cwt maximum coverage", detail:"Contact FSA before the enrollment deadline. Annual premium ~$5,000 on 5M lbs.", impact:"$15K–$120K depending on production history" },
    { tier:"a", label:"Commission a ration audit — independent nutritionist", detail:"A 5–8% feed cost reduction across 250 cows recovers $35K–$56K annually.", impact:"$35K–$80K annually" },
    { tier:"g", label:"DHIA enrollment — individual cow production records", detail:"Build the data foundation for culling, breeding and benchmarking.", impact:"Enables $10K–$40K in annual management precision" },
  ] : [
    { tier:"r", label:"Proactive lender disclosure", detail:`DSCR at ${(dscr_==null?0:dscr_).toFixed(2)}x. Schedule a Farm Credit meeting. Do not wait for annual review.`, impact:"Non-cash — preserves restructuring options worth $50K–$500K+" },
    { tier:"a", label:"Forward contracting — 30–40% of production", detail:"Write a marketing plan targeting pre-harvest contracting. Compeer: best-in-class earn $66/ac more through marketing discipline.", impact:"$36K–$108K on 1,200 acres in a down-price year" },
    { tier:"a", label:"Input cost audit — fertilizer rate verification", detail:"Soil tests on all fields vs. current application rates. Compeer: best-in-class spend $57/ac less on inputs.", impact:"$24K–$72K annually on 1,200 acres" },
    { tier:"g", label:"Annual monitoring system", detail:"Track OER, net return/ac, working capital/ac and DSCR every March after tax filing.", impact:"Systemic — early warning prevents $50K–$500K+ distress events" },
  ];
  const tierC = { r:{bg:T.redL,c:T.red,label:"Now"}, a:{bg:T.amberL,c:T.amberT,label:"This quarter"}, g:{bg:T.greenL,c:T.dgreen,label:"Ongoing"} };
  const xsell = isDairy ? [{l:"Operating line relief"},{l:"DMC enrollment"},{l:"Succession planning"},{l:"Loan covenant review"}] : [{l:"Operating line review"},{l:"Crop insurance optimization"},{l:"Succession planning"},{l:"Energy lease covenant review"},{l:"Grain storage loan"}];
  const subCopy = fa.goals.outcome==="lenderready" ? "Lender-ready track — ratios and narrative prepared for your advisor." : fa.goals.outcome==="monitor" ? "Monitoring track — a repeatable annual process." : fa.goals.outcome==="improve" ? "Improvement track — your highest-leverage actions first." : "Understanding track — your numbers, in plain language.";
  return (
    <div>
      <Head eyebrow="Financial Analysis · Stage 6" title="Action plan & monitoring" sub={subCopy} />
      <div style={{ background:T.navy, borderRadius:10, padding:"20px 24px", marginBottom:16 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:T.green, marginBottom:6, display:"flex", alignItems:"center", gap:7 }}><Apex color={T.green} />Financial Analysis complete</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:19, fontWeight:700, color:"#fff", marginBottom:5, lineHeight:1.2 }}>Your priority actions and Farm Credit triggers are below. When ready, continue to Revenue Diversification.</div>
        <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.55)" }}>{[...new Set(enterprises)].map(e=>ENT[e]&&ENT[e].label).filter(Boolean).join(" · ") || "No enterprise selected"}</div>
      </div>
      {isDistress && (
        <div style={{ background:T.redL, border:`1.5px solid ${T.red}`, borderRadius:10, padding:"15px 18px", marginBottom:16 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:700, color:T.red, marginBottom:5 }}>Financial distress — stabilization first</div>
          <div style={{ fontSize:12.5, color:T.redD, lineHeight:1.5 }}>Lender communication and cash triage must precede any diversification planning.</div>
        </div>
      )}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Priority actions</div>
        {ACTIONS.map((a,i) => {
          const tc = tierC[a.tier];
          return (
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:13, padding:"13px 0", borderBottom:i<ACTIONS.length-1?`1px solid ${T.div}`:"none" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, background:tc.bg, color:tc.c, flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}><div style={{ fontSize:13.5, fontWeight:700 }}>{a.label}</div><span style={pillStyle({r:"vuln",a:"watch",g:"strong"}[a.tier])}>{tc.label}</span></div>
                <div style={{ fontSize:12.5, color:T.fgM, marginBottom:5, lineHeight:1.5 }}>{a.detail}</div>
                <span style={{ fontSize:11.5, color:T.dgreen, fontWeight:600 }}>{a.impact}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Farm Credit cross-sell triggers</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {xsell.map((x,i) => (<span key={i} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:6, fontSize:12.5, background:T.blueL, color:T.blue, fontWeight:500 }}><span style={{ padding:"1px 7px", borderRadius:999, fontSize:10, fontWeight:700, background:T.greenL, color:"#2F6E28", fontFamily:"'Barlow Condensed',sans-serif" }}>FA</span>{x.l}</span>))}
        </div>
      </div>
      <div style={cardStyle({ borderTop:`4px solid ${T.green}`, marginBottom:0 })}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:700, color:T.navy, marginBottom:6 }}>Ready to explore revenue diversification?</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.55, maxWidth:640 }}>Your enterprise type, financial-health tier and MFP score carry into the Revenue Diversification module automatically — you won't re-enter your farm profile.</div>
        <button style={btnStyle("primary")} onClick={()=>goRD(1)}>Continue to Revenue Diversification →</button>
      </div>
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
const ASSET_ITEMS = [
  { id:"land", label:"Underutilized or marginal acres", hint:"% of total acres not in full production use — field edges, marginal ground, or land not in your core rotation", default:10 },
  { id:"equipment", label:"Field equipment idle capacity", hint:"Estimated % below full annual utilization for tillage, planting, spraying, and harvest equipment — most farms run well under 60%", default:35 },
  { id:"truckingCap", label:"Trucking & hauling capacity", hint:"% of truck, trailer, and driver time available beyond your own hauling needs — separate from field equipment", default:20 },
  { id:"storageCap", label:"Excess grain/storage capacity", hint:"% of storage capacity beyond what your own production requires in a typical year", default:15 },
  { id:"facilities", label:"Underutilized buildings & facilities", hint:"% of barns, shops, or outbuilding space not in active daily use", default:20 },
  { id:"laborCap", label:"Available labor capacity", hint:"% of family or hired labor time available beyond core operation needs, especially shoulder seasons", default:15 },
];
const TRUST_ITEMS = [
  { id:"buyerRel", label:"Buyer & cooperative relationships", hint:"Strength of existing purchase relationships with elevators, cooperatives, or processors", default:30 },
  { id:"reputation", label:"Community reputation & network", hint:"Local visibility, word-of-mouth reach, and standing among neighboring operations", default:40 },
  { id:"expertise", label:"Recognized expertise or credentials", hint:"Formal or informal recognition in a specific skill — agronomy, genetics, mechanics, marketing", default:25 },
  { id:"customerRel", label:"Direct-to-consumer relationships", hint:"Existing CSA members, farm-stand customers, or online buyer base", default:15 },
];
const RISK_ITEMS = [
  { id:"workingCapital", label:"Working capital position", hint:"Relative to peer benchmark (~$692/ac is top quartile for row crop operations)", default:40 },
  { id:"debtHeadroom", label:"Balance sheet headroom", hint:"Debt-to-asset cushion — higher score means less leveraged, more room to invest", default:45 },
  { id:"cashReserve", label:"Operating cash reserve", hint:"Months of operating expenses covered by cash reserves, higher is stronger", default:30 },
  { id:"existingDiversification", label:"Existing revenue diversification", hint:"How spread out current income already is across enterprises, buyers, or markets", default:20 },
];
const LEVER_ITEM_GROUPS = { asset:ASSET_ITEMS, trust:TRUST_ITEMS, risk:RISK_ITEMS };
const LEVER_META = {
  asset: { label:"Asset leverage", color:T.dgreen, desc:"Physical assets that could generate diversified income" },
  trust: { label:"Trust leverage", color:T.tan, desc:"Relationships, reputation, and knowledge that can be monetized" },
  risk: { label:"Risk-smoothing capacity", color:T.blue, desc:"Financial buffers that let the farm absorb startup risk" },
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

const faScoreOf = (fa) => { const wf=fa.wholeFarm||{}; const vuln=Object.values(wf).filter(v=>v==="vuln").length; const strong=Object.values(wf).filter(v=>v==="strong").length; if(vuln>=2)return 1.5; if(vuln===1)return 2.5; if(strong>=3)return 4.0; return 3.0; };
const HIGH_CAP_OPPS = ["processing","demolition","manure","eventRental"];
const PASSIVE_TIME_OPPS = ["energy","carbon","envServices","storage"];

const scoredOpps = (rd, faEnt) => { const d=rd.data||{}; const g=d.goals2||{}; const b=d.baseline||{}; const capMap={zero:0,low:10000,medium:50000,high:200000}; const capLimit=capMap[g.capitalAppetite]!==undefined?capMap[g.capitalAppetite]:200000; const items=d.leverItems||{};
  const sizeBucket = sizeBucketFromTier(b.revTier);
  return OPPS.map(o => { const a=o.fit.asset/100*leverPct(items,"asset"), t=o.fit.trust/100*leverPct(items,"trust"), r=o.fit.risk/100*leverPct(items,"risk"); let leverMatch=(a+t+r)/3;
    const capOk = HIGH_CAP_OPPS.includes(o.id) ? (capLimit>=20000) : (capLimit>=5000 || PASSIVE_TIME_OPPS.includes(o.id) || o.id==="consulting" || o.id==="dataAdvisory");
    const timeOk = g.timeAppetite!=="minimal" || PASSIVE_TIME_OPPS.includes(o.id);
    const sizeMatch = !sizeBucket || !o.sizeFit ? true : o.sizeFit.includes(sizeBucket);
    const entMatch = !o.entSpecific || o.entSpecific===faEnt;
    if (sizeMatch) leverMatch = leverMatch * 1.15; // modest boost for farms this opportunity typically suits
    if (o.entSpecific && !entMatch) leverMatch = leverMatch * 0.15; // heavily suppress enterprise-specific paths that don't apply

    return { ...o, leverMatch:Math.round(Math.min(100,leverMatch)), capOk, timeOk, sizeMatch, entMatch, score:leverMatch*(capOk?1:0.3)*(timeOk?1:0.7)*(entMatch?1:0.1) }; }).sort((a,b)=>b.score-a.score); };

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
      {faEnt && (<div style={{ background:T.waterL, color:"#0A6E8C", borderRadius:8, padding:"11px 14px", fontSize:12.5, display:"flex", alignItems:"flex-start", gap:9, marginBottom:16, lineHeight:1.5 }}><Fic type="link" /><span>Financial Analysis carried over — enterprise <b>{faEnt2||faEnt}</b> · financial-health score <b>{sc.toFixed(1)}/5</b> · readiness <b>{rl}</b></span></div>)}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Farm profile — confirm or update</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <SelField label="Farm type" k="farmType" opts={FARM} val={b.farmType||faEnt2||""} />
          <SelField label="Revenue tier" k="revTier" opts={TIERS} val={b.revTier||""} />
          <SelField label="Business stage" k="bizStage" opts={STAGES} val={b.bizStage||""} />
          <SelField label="Market orientation" k="market" opts={["Commodity / price-taker","Partially differentiated","Direct market / value-added"]} val={b.market||""} />
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}><Apex color={T.green} />MFP financial-health score</div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}><input type="number" style={inputStyle({ width:88 })} min={1} max={5} step={0.1} value={b.mfpScore||sc} onChange={e=>set("mfpScore",e.target.value)} /><span style={{ fontSize:13, color:T.fgS }}>out of 5.0</span></div>
          <span style={pillStyle(rf)}>{rl}</span>
          {rf==="foundation" && <div style={{ marginTop:12 }}><Flag type="danger">Foundation-first path. Strengthen core financials before diversification investment.</Flag></div>}
        </div>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}><Apex color={T.green} />SWOT signals</div>
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
      <div style={cardLblStyle()}><Apex color={T.green} />How similar farms split household income</div>
      <div style={{ fontSize:12.5, color:T.fgM, marginBottom:14, lineHeight:1.5 }}>USDA ERS research on multi-enterprising farm households. Roughly 8–12% of total household income for commercial and intermediate farms comes from alternative business ventures off the farm — this is the pool your diversification plan is drawing from.</div>
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr 1fr 1fr 1fr", gap:6, background:T.bgAlt, borderRadius:6, padding:"8px 12px", marginBottom:4 }}>
        {["Farm category","Farm business","Wages/salary","Nonfarm business","Transfers/other"].map((h,i) => (<div key={i} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.04em", textAlign:i===0?"left":"center" }}>{h}</div>))}
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
          <div style={cardLblStyle()}><Apex color={T.green} />{q.title}</div>
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
// RD STAGE 3 — Asset & readiness inventory
// ─────────────────────────────────────────────────────────────────────────────
function RD3({ rd, setRData }) {
  const items = rd.data.leverItems || {};
  const setItem = (id,v) => setRData(s => ({ ...s, leverItems:{ ...(s.leverItems||{}), [id]:v } }));
  const touched = Object.keys(items).length > 0;
  const scores = { asset:leverCategoryScore(items,"asset"), trust:leverCategoryScore(items,"trust"), risk:leverCategoryScore(items,"risk") };
  const allWeak = Object.values(scores).every(s => s < 34);
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 3" title="Asset & readiness inventory" sub="Rate specific, measurable items within each lever rather than one blanket score. This gives a far more precise read on which opportunities actually fit your operation." />
      {["asset","trust","risk"].map(cat => {
        const meta = LEVER_META[cat]; const group = LEVER_ITEM_GROUPS[cat]; const score = scores[cat];
        return (
          <div key={cat} style={cardStyle()}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, gap:12, flexWrap:"wrap" }}>
              <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:700, marginBottom:2 }}>{meta.label}</div><div style={{ fontSize:12.5, color:T.fgM }}>{meta.desc}</div></div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:leverScoreColor(score) }}>{score}%</div>
                <div style={{ fontSize:11, fontWeight:600, color:leverScoreColor(score) }}>{LEVER_BUCKET_LABEL[leverBucket(score)]}</div>
              </div>
            </div>
            {group.map(it => {
              const val = items[it.id] !== undefined ? Number(items[it.id]) : it.default;
              return (
                <div key={it.id} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:2 }}>
                    <label style={{ fontSize:12.5, fontWeight:600, color:T.navy }}>{it.label}</label>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:meta.color }}>{val}%</span>
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
          <div style={cardLblStyle()}><Apex color={T.green} />Your three-lever profile</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {["asset","trust","risk"].map(cat => {
              const meta = LEVER_META[cat]; const score = scores[cat];
              return (
                <div key={cat} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:T.fgS, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>{meta.label}</div>
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
  const faEntKey = (fa.enterprises||[])[0] || "";
  const [clusterFilter, setClusterFilter] = useState("all");
  const toggle = (id) => setRData(s => { const cur=s.selectedOpps||[]; return { ...s, selectedOpps: cur.includes(id)?cur.filter(x=>x!==id):[...cur,id] }; });
  const allOpps = scoredOpps(rd, faEntKey);
  const opps = clusterFilter==="all" ? allOpps : allOpps.filter(o=>o.cluster===clusterFilter);
  const sizeBucket = sizeBucketFromTier(b.revTier);
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 4" title="Opportunity mapping" sub="Ranked by fit with your three-lever profile, farm size, and goals. Select your top 2–3 to carry into the barrier and scenario stages." />
      <div style={{ background:"#FAF6EC", border:`1px solid ${T.silver}`, borderRadius:10, padding:"14px 18px", marginBottom:16 }}>
        <div style={cardLblStyle()}><Apex color={T.green} />Your lever inputs</div>
        <div style={{ display:"flex", gap:26, flexWrap:"wrap" }}>
          {["asset","trust","risk"].map(k => (
            <div key={k} style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:90, fontSize:12, fontWeight:600, color:T.fgM }}>{({asset:"Asset",trust:"Trust",risk:"Risk buffer"})[k]}</div>
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
          const dimmed = o.entSpecific && !o.entMatch;
          return (
            <div key={o.id} onClick={()=>toggle(o.id)} style={{ background:"#fff", border:isSel?`2px solid ${T.blue}`:`1px solid ${T.border}`, borderRadius:10, padding:18, cursor:"pointer", transition:"all .15s", opacity:dimmed?0.5:(o.capOk?1:0.75), boxShadow:isSel?"0 4px 12px rgba(15,28,57,0.10)":"0 1px 2px rgba(15,28,57,0.06)" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6, gap:8 }}>
                <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700, color:isSel?T.blue:T.navy, lineHeight:1.15 }}>{o.label}</div><div style={{ fontSize:10, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:3, fontWeight:600 }}>{o.cluster}</div></div>
                <span style={pillStyle(fl)}>{fLabel}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                <span style={{ fontSize:10, fontWeight:700, color:GROWTH_TIER_COLOR[o.growthTier] }}>● {GROWTH_TIER_LABEL[o.growthTier]}</span>
                {o.sizeFit && sizeBucket && o.sizeFit.includes(sizeBucket) && <span style={{ fontSize:10, fontWeight:700, color:T.dgreen }}>· Good fit for your farm size</span>}
                {dimmed && <span style={{ fontSize:10, fontWeight:700, color:T.red }}>· Requires {o.entSpecific} enterprise</span>}
              </div>
              <div style={{ fontSize:12.5, color:T.fgM, lineHeight:1.5, marginBottom:12 }}>{o.desc}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}><div style={{ fontSize:11.5, color:T.fgM }}><span style={{ fontWeight:600 }}>Time to revenue: </span>{o.time}</div><div style={{ fontSize:11.5, color:T.fgM }}><span style={{ fontWeight:600 }}>Capital: </span>{o.capital}</div></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                <div style={{ fontSize:11.5, color:T.fgM, display:"flex", alignItems:"center", gap:5 }}><span style={{ fontWeight:600 }}>Regulatory load:</span>{[1,2,3,4,5].map(n=>(<span key={n} style={{ width:6, height:6, borderRadius:"50%", background:n<=o.reg?T.red:T.div, display:"inline-block" }}/>))}</div>
                <div style={{ fontSize:11.5, color:T.fgM, display:"flex", alignItems:"center", gap:5 }}><span style={{ fontWeight:600 }}>Season conflict:</span>{[1,2,3,4,5].map(n=>(<span key={n} style={{ width:6, height:6, borderRadius:"50%", background:n<=o.seasonal?T.amber:T.div, display:"inline-block" }}/>))}</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Lever fit</div>
                {[["asset","Asset",T.dgreen],["trust","Trust",T.tan],["risk","Risk",T.blue]].map(([k,label,color]) => {
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
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700 }}>{o.label}</div>
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
// RD STAGE 6 — Scenario comparison
// ─────────────────────────────────────────────────────────────────────────────
function RD6({ rd, setRData }) {
  const d = rd.data; const selected = d.selectedOpps || []; const ranked = d.rankedOpps || [];
  const setRank = (id,rank) => setRData(s => { const cur=(s.rankedOpps||[]).filter(x=>x.id!==id); return { ...s, rankedOpps:[...cur,{id,rank}] }; });
  const getRank = (id) => { const r=ranked.find(x=>x.id===id); return r?r.rank:0; };
  const sel = selected.map(id => OPPS.find(o=>o.id===id)).filter(Boolean);
  if (selected.length===0) return (<div><Head eyebrow="Revenue Diversification · Stage 6" title="Scenario comparison" sub="Compare your selected paths side by side." /><Flag type="warn">No opportunities selected. Go back to Stage 4.</Flag><OpportunityCostLens financialSel={[]} physicalSel={[]} setRData={setRData} /></div>);
  const td = { padding:"11px 14px", fontSize:12.5, textAlign:"center", borderLeft:`1px solid ${T.div}` };
  const dotRow = (val,color) => (<div style={{ display:"flex", gap:3, justifyContent:"center" }}>{[1,2,3,4,5].map(n=>(<span key={n} style={{ width:6, height:6, borderRadius:"50%", background:n<=val?color:T.div, display:"inline-block" }}/>))}</div>);
  const rows = [{ label:"Time to revenue", vals:sel.map(o=>o.time) }, { label:"Capital required", vals:sel.map(o=>o.capital) }, { label:"Primary lever", vals:sel.map(o=>o.category) }];
  const financialSel = sel.filter(o=>o.cluster==="Financial Capital Deployment");
  const physicalSel = sel.filter(o=>o.cluster!=="Financial Capital Deployment");
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 6" title="Scenario comparison" sub="Compare your selected paths side by side, then set your priority ranking." />
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", background:"#fff", border:`1px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
          <thead><tr style={{ background:T.navy }}>
            <td style={{ padding:"12px 14px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, color:"#fff", textTransform:"uppercase", letterSpacing:"0.06em" }}>Comparison</td>
            {sel.map(o => (<td key={o.id} style={{ padding:"12px 14px", textAlign:"center", borderLeft:"1px solid rgba(255,255,255,0.12)" }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13.5, fontWeight:700, color:"#fff", lineHeight:1.2 }}>{o.label}</div></td>))}
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
            <tr style={{ background:T.greenL }}>
              <td style={{ padding:"11px 14px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12.5, fontWeight:700, color:"#2F6E28", borderRight:`1px solid ${T.border}` }}>Your priority rank</td>
              {sel.map(o => (<td key={o.id} style={td}><div style={{ display:"flex", justifyContent:"center", gap:5 }}>{sel.map((_,i) => (<button key={i} onClick={()=>setRank(o.id,i+1)} style={{ width:30, height:30, borderRadius:6, border:`1.5px solid ${getRank(o.id)===i+1?T.blue:T.border}`, cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, background:getRank(o.id)===i+1?T.blue:"#fff", color:getRank(o.id)===i+1?"#fff":T.fgS }}>{i+1}</button>))}</div></td>))}
            </tr>
          </tbody>
        </table>
      </div>
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
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:"#0A6E8C", marginBottom:8 }}>Capital-only path{financialSel.length>1?"s":""}</div>
            {financialSel.map(o => (<div key={o.id} style={{ fontSize:12.5, color:"#0A6E8C", marginBottom:4 }}>• <b>{o.label}</b> — effort {o.effort||1}/5, liquidity {o.liquidity||1}/5</div>))}
          </div>
          <div style={{ background:T.wheatL||T.bgAlt, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, color:T.amberT, marginBottom:8 }}>Sweat-equity path{physicalSel.length>1?"s":""}</div>
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
      <Head eyebrow="Revenue Diversification · Stage 7" title="Beyond the balance sheet: building financial reserves for what's next" sub="Diversifying income is only half the equation. The other half is knowing where to put the money you've diversified — so it's there when a piece of equipment fails or a new opportunity shows up." />

      {/* Equipment reserve calculator */}
      <div style={cardStyle({ borderTop:`4px solid ${T.green}` })}>
        <div style={cardLblStyle()}><Apex color={T.green} />Equipment replacement reserve — funding gap calculator</div>
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
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Required annual contribution</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color:T.navy }}>${Math.round(requiredAnnual).toLocaleString()}</div>
              </div>
              <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Annual gap</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color:gap>0?T.red:T.dgreen }}>{gap>0?`$${Math.round(gap).toLocaleString()} short`:"Fully funded"}</div>
              </div>
              <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>% of target funded</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color:fundedPct>=100?T.dgreen:fundedPct>=60?T.amber:T.red }}>{fundedPct}%</div>
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
        <div style={cardLblStyle()}><Apex color={T.green} />Risk products that free up capital</div>
        <div style={{ fontSize:12.5, color:T.fgM, marginBottom:12, lineHeight:1.5 }}>Not every financial product is about growing money — some are about not needing as much of it sitting idle. Insurance and revenue protection tools reduce how large a cash cushion you need to hold against a bad year.</div>
        {RISK_PRODUCTS.map((p,i) => (<div key={i} style={{ fontSize:12.5, color:T.navy, padding:"6px 0", borderBottom:i<RISK_PRODUCTS.length-1?`1px solid ${T.div}`:"none" }}>• {p}</div>))}
      </div>

      {/* Card 3 — Income diversification vs your actual selections */}
      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Income diversification before investment diversification</div>
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
        <div style={cardLblStyle()}><Apex color={T.green} />Longer-horizon investment vehicles</div>
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
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.green, marginBottom:12 }}>The order matters</div>
        {[
          { n:1, label:"Fund the reserve first", detail:"Laddered CDs or a money market account sized to your next equipment cycle.", done:step1Done },
          { n:2, label:"Diversify income before diversifying investments", detail:"New revenue lines reduce risk faster than a new asset class does.", done:step2Done },
          { n:3, label:"Layer in longer-horizon vehicles last", detail:"Once cash flow is stable and the reserve is no longer competing with this year's operating needs.", done:step3Done },
        ].map(s => (
          <div key={s.n} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:s.n<3?"1px solid rgba(255,255,255,0.1)":"none" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:s.done?T.green:"rgba(255,255,255,0.15)", color:s.done?T.navy:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:800, flexShrink:0 }}>{s.done?"✓":s.n}</div>
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
  const summary = [["FA module","Complete"],["FA tier", fa.wholeFarm.profitability==="vuln"?"Stabilize":fa.wholeFarm.profitability==="strong"?"Advance":"Optimize"],["RD readiness", mfp>=3.5?"Ready":mfp>=2.5?"Caution":"Foundation first"],["Top RD path",(sel[0]&&sel[0].label)||"—"],["Asset lever",`${leverPct(lev,"asset")}% (${LEVER_BUCKET_LABEL[leverBucket(leverPct(lev,"asset"))]})`],["Trust lever",`${leverPct(lev,"trust")}% (${LEVER_BUCKET_LABEL[leverBucket(leverPct(lev,"trust"))]})`],["Risk buffer",`${leverPct(lev,"risk")}% (${LEVER_BUCKET_LABEL[leverBucket(leverPct(lev,"risk"))]})`]];
  const resources = [["Penn State","Advisory team assembly + insurance review"],["Purdue","Five-lever framework — price, production, cost, balance sheet, people"],["Ohio State","Whole-farm planning + succession"],["Iowa State","Equipment benchmarking for custom farming"],["UKY Center","Specialty crop diversification database"]];
  return (
    <div>
      <Head eyebrow="Revenue Diversification · Stage 8" title="Revenue Diversification action plan" sub="Your personalized diversification roadmap — ranked by the priority order you set in Stage 6." />
      <div style={{ background:T.navy, borderRadius:10, padding:"20px 24px", marginBottom:16 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:T.green, marginBottom:6, display:"flex", alignItems:"center", gap:7 }}><Apex color={T.green} />Both modules complete</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:19, fontWeight:700, color:"#fff", marginBottom:5, lineHeight:1.2 }}>{sel.length>0 ? `${sel.length} diversification path${sel.length>1?"s":""} identified. ${sel[0].label} is your Priority 1.` : "No paths selected — revisit Stage 4."}</div>
        <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.55)" }}>{(b.farmType||"Farm")}{b.revTier?` · ${b.revTier}`:""}</div>
      </div>
      {sel.map((o,idx) => {
        const acts = RD_ACTIONS[o.id] || [];
        return (
          <div key={o.id} style={cardStyle()}>
            <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:14, paddingBottom:12, borderBottom:`1px solid ${T.div}` }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:rankColor(idx), display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 }}>{idx+1}</div>
              <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700 }}>{o.label}</div><div style={{ fontSize:11.5, color:T.fgS }}>{o.time} to first revenue · {o.capital}</div></div>
            </div>
            {acts.map((a,i) => {
              const tc = tierC[a.t];
              return (<div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 0", borderBottom:i<acts.length-1?`1px solid ${T.div}`:"none" }}><div style={{ width:26, height:26, borderRadius:"50%", background:tc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, color:tc.c, flexShrink:0 }}>{i+1}</div><div><div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{a.title}</div><div style={{ fontSize:12.5, color:T.fgM, lineHeight:1.5 }}>{a.d}</div></div></div>);
            })}
          </div>
        );
      })}
      <EfficiencyValueImpact sel={sel} lev={lev} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}><Apex color={T.green} />Land-grant advisory resources</div>
          {resources.map(([org,note],i) => (<div key={i} style={{ padding:"7px 0", borderBottom:i<resources.length-1?`1px solid ${T.div}`:"none" }}><span style={{ fontSize:12.5, fontWeight:700, color:T.blue }}>{org}: </span><span style={{ fontSize:12.5, color:T.fgM }}>{note}</span></div>))}
        </div>
        <div style={cardStyle({ marginBottom:0 })}>
          <div style={cardLblStyle()}><Apex color={T.green} />Module summary</div>
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
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Asset utilization</div>
          <div style={{ fontSize:12.5, color:T.navy, lineHeight:1.5 }}>{usesAsset ? "This plan puts existing land, equipment, or facilities to work rather than requiring new core-farm capital." : "This plan leans more on relationships and expertise than existing physical assets."}</div>
        </div>
        <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Calendar fit</div>
          <div style={{ fontSize:12.5, color:T.navy, lineHeight:1.5 }}>{calendarFit.text}</div>
        </div>
        <div style={{ background:T.bgAlt, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:6 }}>Portfolio breadth</div>
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

function FarmProfilePage({ profile, setProfile, fa, rd }) {
  const set = (field) => (e) => setProfile(s => ({ ...s, [field]: e.target.value }));
  const sourceCount = (fa.enterprises||[]).length + (rd.data?.selectedOpps||[]).length;
  const divLabel = sourceCount===0 ? null : sourceCount<=1 ? "Highly concentrated" : sourceCount<=3 ? "Moderately concentrated" : "Well diversified";
  const snapField = (label, field, placeholder, info) => (
    <div style={{ background:T.bgAlt, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8 }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</span>
        {info && <span title={info} style={{ fontSize:11, color:T.fgS, cursor:"help" }}>ⓘ</span>}
      </div>
      <textarea style={inputStyle({ minHeight:44, border:"none", background:"transparent", padding:0, fontSize:14, fontWeight:600, color:T.navy, resize:"vertical" })} value={profile[field]||""} onChange={set(field)} placeholder={placeholder} />
    </div>
  );
  return (
    <div>
      <Head eyebrow="MFP Farm Profile" title="MFP farm business profile" sub="A 360° view that fills in as the farmer completes onboarding and assessments — and feeds directly into Financial Analysis, Revenue Diversification, and Farm Risk so nothing has to be entered twice." />

      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Farm snapshot</div>
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
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10.5, fontWeight:700, color:T.fgS, textTransform:"uppercase", letterSpacing:"0.05em" }}>Diversification concentration</span>
              <span title="Computed from your selected enterprises in Financial Analysis plus your selected paths in Revenue Diversification." style={{ fontSize:11, color:T.fgS, cursor:"help" }}>ⓘ</span>
            </div>
            {divLabel ? (<span style={pillStyle(sourceCount<=1?"vuln":sourceCount<=3?"watch":"strong")}>{divLabel}</span>) : (<div style={{ fontSize:13.5, fontStyle:"italic", color:T.fgS }}>Not scored yet</div>)}
            {sourceCount>0 && <div style={{ fontSize:11, color:T.fgS, marginTop:6 }}>{sourceCount} income source{sourceCount!==1?"s":""} across FA + RD</div>}
          </div>
        </div>
      </div>

      <div style={cardStyle()}>
        <div style={cardLblStyle()}><Apex color={T.green} />Strategy & values</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {snapField("Near-term objectives (1–3 yrs)", "nearTerm", "e.g., complete a succession plan, maximize ethanol plant opportunities, focus on soil health")}
          {snapField("Long-term objectives", "longTerm", "e.g., explore the protein sector, update cow-calf facilities, slow steady land expansion")}
          {snapField("Key competitive advantage", "advantage", "e.g., strong community relationships driving land and business opportunities")}
          {snapField("Key core values", "values", "e.g., legacy, community involvement, sustainable soil health practices")}
        </div>
      </div>

      <Flag type="info">This profile is shared across all three modules. Financial Analysis and Revenue Diversification each offer a one-click way to pull matching fields from here instead of re-entering them.</Flag>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [module, setModule] = useState("profile");
  const [fa, setFA] = useState({ stage:1, enterprises:[], goals:{}, wholeFarm:{}, ratioVals:{}, s3vals:{}, s4bench:{}, s5:{}, actionChecked:{} });
  const [rd, setRD] = useState({ stage:1, data:{} });
  const [risk, setRisk] = useState({ stage:1, answers:{} });
  const [profile, setProfile] = useState({});

  const setRData = (fn) => setRD(s => ({ ...s, data: fn(s.data||{}) }));
  const goFA = (n) => { setModule("fa"); setFA(s => ({ ...s, stage:n })); };
  const goRD = (n) => { setModule("rd"); setRD(s => ({ ...s, stage:n })); };
  const goRisk = (n) => { setModule("risk"); setRisk(s => ({ ...s, stage:n })); };

  const isFA = module === "fa", isRD = module === "rd", isRisk = module === "risk", isProfile = module === "profile";
  const faTotal = FA_STAGES.length, rdTotal = RD_STAGES.length, riskTotal = RISK_STAGES.length;
  const stage = isFA ? fa.stage : isRD ? rd.stage : risk.stage;
  const total = isFA ? faTotal : isRD ? rdTotal : riskTotal;
  const stageDefs = isFA ? FA_STAGES : isRD ? RD_STAGES : RISK_STAGES;
  const faPct = Math.round(Math.min(fa.stage,faTotal)/faTotal*100);
  const rdPct = Math.round(Math.min(rd.stage,rdTotal)/rdTotal*100);
  const riskPct = Math.round(Math.min(risk.stage,riskTotal)/riskTotal*100);
  const PROFILE_FIELDS = ["location","size","productionMix","ventures","grossIncome","nearTerm","longTerm","advantage","values"];
  const profilePct = Math.round((PROFILE_FIELDS.filter(f=>(profile[f]||"").trim()).length / PROFILE_FIELDS.length) * 100);
  const pct = isFA ? faPct : isRD ? rdPct : riskPct;

  const canAdvance = useMemo(() => {
    if (isFA) { if (fa.stage===1) return fa.enterprises.length>0; if (fa.stage===2) { const g=fa.goals; return !!(g.trigger&&g.concern&&g.outcome); } return true; }
    if (isRD) { const d = rd.data, g = d.goals2||{}, leverItems = d.leverItems||{}, b = d.baseline||{}, sel = d.selectedOpps||[];
      if (rd.stage===1) return !!(b.farmType&&b.revTier); if (rd.stage===2) return !!(g.trigger&&g.horizon&&g.capitalAppetite&&g.timeAppetite); if (rd.stage===3) return Object.keys(leverItems).length>0; if (rd.stage===4) return sel.length>0; return true; }
    return true;
  }, [isFA, isRD, fa, rd]);

  const faScore = faScoreOf(fa);
  const faTier = fa.wholeFarm.profitability==="vuln" ? "Stabilize" : fa.wholeFarm.profitability==="strong" ? "Advance" : "Optimize";
  const faSumEnt = [...new Set(fa.enterprises)].map(e=>ENT[e]&&ENT[e].label).filter(Boolean).join(", ") || "No enterprise selected";
  const riskAnsweredTotal = Object.keys(risk.answers||{}).length;

  const chips = isFA ? fa.enterprises.map(e => ({ label: ENT[e]?ENT[e].label:e }))
    : isRD ? (rd.data.selectedOpps||[]).slice(0,3).map(id => { const o=OPPS.find(x=>x.id===id); return { label:o?o.label:id }; })
    : [{ label:`${riskAnsweredTotal}/32 answered` }];

  let backLabel = "← Back"; let backDisabled = isRisk && risk.stage===1;
  const onBack = () => { if (isFA) { if (fa.stage>1) goFA(fa.stage-1); else setModule("profile"); } else if (isRD) { if (rd.stage>1) goRD(rd.stage-1); else goFA(FA_STAGES.length); } else { if (risk.stage>1) goRisk(risk.stage-1); } };
  if (isFA && fa.stage===1) backLabel = "← Farm Profile";
  if (isRD && rd.stage===1) backLabel = "← Financial Analysis";

  let nextLabel = "Continue →";
  const onNext = () => { if (!canAdvance) return; if (isFA) { if (fa.stage<faTotal) goFA(fa.stage+1); else goRD(1); } else if (isRD) { if (rd.stage<rdTotal) goRD(rd.stage+1); else { setModule("fa"); setFA(s=>({...s,stage:1})); } } else { if (risk.stage<riskTotal) goRisk(risk.stage+1); else setRisk(s=>({...s,stage:1})); } };
  if (isFA && fa.stage===faTotal) nextLabel = "Revenue Diversification →";
  if (isRD && rd.stage===rdTotal) nextLabel = "Start over ↺";
  if (isRisk && risk.stage===riskTotal) nextLabel = "Start over ↺";

  const FA_BODY = [
    <FA1 fa={fa} setFA={setFA} />, <FA2 fa={fa} setFA={setFA} />, <FA3 fa={fa} setFA={setFA} />,
    <FA4 fa={fa} setFA={setFA} />, <FA5 fa={fa} setFA={setFA} />, <FA6 fa={fa} goRD={goRD} />,
  ];
  const RD_BODY = [
    <RD1 rd={rd} setRData={setRData} fa={fa} />, <RD2 rd={rd} setRData={setRData} />, <RD3 rd={rd} setRData={setRData} />,
    <RD4 rd={rd} setRData={setRData} fa={fa} />, <RD5 rd={rd} setRData={setRData} />, <RD6 rd={rd} setRData={setRData} />,
    <RD7 rd={rd} setRData={setRData} fa={fa} />, <RD8 rd={rd} fa={fa} />,
  ];
  const RISK_BODY = [
    ...RISK_CATS.map((c,i) => <RiskCategoryStage key={c.id} risk={risk} setRisk={setRisk} catIndex={i} />),
    <RiskPlanRevenueOps risk={risk} setRisk={setRisk} />, <RiskPlanThreats risk={risk} setRisk={setRisk} />,
    <RiskPlanStrategy risk={risk} setRisk={setRisk} />, <RiskPlanReview risk={risk} setRisk={setRisk} />,
  ];
  const body = isFA ? FA_BODY[stage-1] : isRD ? RD_BODY[stage-1] : RISK_BODY[stage-1];

  const tabBase = { display:"flex", alignItems:"center", gap:11, padding:"8px 14px", borderRadius:8, cursor:"pointer", transition:"all .15s", border:"1.5px solid transparent" };
  const faTabStyle = isFA ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const rdTabStyle = isRD ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const riskTabStyle = isRisk ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const profileTabStyle = isProfile ? { ...tabBase, background:T.blueL, border:`1.5px solid ${T.blue}` } : { ...tabBase, background:"transparent" };
  const lblOn = { fontFamily:"'Barlow Condensed',sans-serif", fontSize:14.5, fontWeight:700, color:T.navy, letterSpacing:"0.01em" };
  const lblOff = { ...lblOn, fontWeight:600, color:T.fgS };

  return (
    <div className="mfp-root" style={{ display:"flex", flexDirection:"column", height:"100vh", overflow:"hidden", background:T.bgAlt }}>
      <FontStyles />

      {/* Header */}
      <header style={{ background:"#fff", borderBottom:`1px solid ${T.border}`, height:66, display:"flex", alignItems:"center", gap:18, padding:"0 22px", flexShrink:0, zIndex:5, boxShadow:"0 1px 2px rgba(15,28,57,0.04)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <svg width="26" height="26" viewBox="0 0 24 24"><polygon points="12,2 22,20 2,20" fill={T.navy} /><polygon points="12,8 17,20 7,20" fill={T.green} /></svg>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:17, color:T.navy, letterSpacing:"0.01em" }}>IDEALYST</span>
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
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:11, color:T.fgS, maxWidth:190, textAlign:"right", lineHeight:1.4 }}>Your farm profile carries across all modules</span>
          <div style={{ width:38, height:38, borderRadius:"50%", background:T.blue, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15 }}>RM</div>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {isProfile ? (
          <>
            <aside style={{ width:240, background:T.navy, display:"flex", flexDirection:"column", flexShrink:0, overflowY:"auto" }}>
              <div style={{ padding:"22px 18px 14px" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:T.green, display:"flex", alignItems:"center", gap:7, marginBottom:4 }}><Apex color={T.green} />Farm Profile</div>
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
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:T.fgM }}>Farm Profile</div>
              </div>
              <div style={{ height:3, background:T.div, flexShrink:0 }}><div style={{ height:"100%", width:`${profilePct}%`, background:T.green, transition:"width .4s" }} /></div>
              <div style={{ flex:1, padding:"30px 34px", maxWidth:960, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
                <div key="profile" className="mfp-body-anim"><FarmProfilePage profile={profile} setProfile={setProfile} fa={fa} rd={rd} /></div>
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
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:T.green, display:"flex", alignItems:"center", gap:7, marginBottom:4 }}><Apex color={T.green} />{isFA?"Financial Analysis":isRD?"Revenue Diversification":"Farm Risk Assessment"}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)" }}>{isFA?"6-stage diagnostic":isRD?"7-stage planning":"10-stage risk review"}</div>
          </div>
          <div style={{ height:1, background:"rgba(255,255,255,0.09)", margin:"0 0 8px" }} />
          <nav style={{ flex:1 }}>
            {stageDefs.map(s => {
              const active = s.n===stage, done = s.n<stage;
              return (
                <div key={s.n} onClick={()=>{ if (s.n<=stage) { isFA?goFA(s.n):isRD?goRD(s.n):goRisk(s.n); } }} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"10px 16px", cursor:s.n<=stage?"pointer":"default", background:active?"rgba(123,191,50,0.12)":"transparent", borderLeft:active?`3px solid ${T.green}`:"3px solid transparent" }}>
                  <div style={{ width:21, height:21, borderRadius:"50%", flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, background:done?T.green:active?T.blue:"rgba(255,255,255,0.12)", color:done||active?"#fff":"rgba(255,255,255,0.5)" }}>
                    {done ? <IconCheckSm size={11} /> : s.n}
                  </div>
                  <div style={{ fontSize:12.5, fontWeight:active?600:400, color:done?"rgba(255,255,255,0.7)":active?"#fff":"rgba(255,255,255,0.42)", lineHeight:1.4 }}>{s.label}</div>
                </div>
              );
            })}
          </nav>
          {isRD && (
            <div style={{ margin:"8px 12px", background:"rgba(123,191,50,0.10)", border:"1px solid rgba(123,191,50,0.22)", borderRadius:8, padding:"11px 13px" }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.14em", color:T.green, marginBottom:6 }}>FINANCIAL ANALYSIS</div>
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
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", color:T.fgM }}>Stage {stage} of {total} · {stageDefs[stage-1].label}</div>
            <div style={{ display:"flex", gap:6 }}>{chips.map((c,i) => (<span key={i} style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:999, background:T.greenL, color:"#2F6E28", whiteSpace:"nowrap" }}>{c.label}</span>))}</div>
          </div>
          <div style={{ height:3, background:T.div, flexShrink:0 }}><div style={{ height:"100%", width:`${pct}%`, background:T.green, transition:"width .4s" }} /></div>

          <div style={{ flex:1, padding:"30px 34px", maxWidth:960, width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
            <div key={`${module}-${stage}`} className="mfp-body-anim">{body}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:22, borderTop:`1px solid ${T.border}`, marginTop:26 }}>
              <button onClick={onBack} style={{ ...btnStyle("outline"), opacity:backDisabled?0.4:1, pointerEvents:backDisabled?"none":"auto" }}>{backLabel}</button>
              <button onClick={onNext} style={{ ...btnStyle("primary"), opacity:canAdvance?1:0.4, pointerEvents:canAdvance?"auto":"none" }}>{nextLabel}</button>
            </div>
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
