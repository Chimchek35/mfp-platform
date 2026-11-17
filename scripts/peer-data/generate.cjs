// ─────────────────────────────────────────────────────────────────────────────
// Peer dataset generator, calibrated to the Idealyst MFP Benchmarking Survey
// (n=300, July–August 2026). Figures in calibration.json are the real survey
// results; the farms below are generated so that their structure reproduces them.
// ─────────────────────────────────────────────────────────────────────────────
// Generates PHYSICAL AND ECONOMIC DRIVERS, then computes financial statements
// from them. Ratios emerge from structure, so they stay internally consistent.
// Never draw a ratio directly — you get farms whose balance sheet contradicts
// their income statement, and thresholds built on them are fiction.

const path = require("path"), fs = require("fs");
const here = __dirname;
const CAL = JSON.parse(fs.readFileSync(path.join(here, "calibration.json"), "utf8"));

// Shared economic parameters tuned so the generated population lands near the
// survey top-box shares (see validate.cjs). Archetype-specific figures stay in
// ARCHETYPES; these are the cross-cutting balance-sheet and cost levers.
//
// The fit is a compromise and has to be. The survey's leverage figures disagree
// with each other (debt-to-asset < 30%, debt-to-equity < 0.43 and equity-to-asset
// >= 70% are the same condition, reported by 39%, 28% and 24% of respondents), and
// its combination of high leverage, thin margins and low turnover cannot all be
// reproduced while debt service coverage stays plausible. Liquidity and expense
// ratios are matched closely; leverage, returns and turnover sit within ten to
// twenty points, with the generated population somewhat stronger than the survey
// because a third of it is renter-heavy by design.
const DEFAULT_TUNE = {
  opexLift:      { rowcrop:0.03, dairy:0.03, perennial:0.04 },   // added to archetype opexShare
  currentAssets: [0.54, 0.20], currentLiab: [0.46, 0.15],
  otherAssets:   [1.60, 0.45],
  ownerLaborFloor: 70000,
  termDA:        { "owner-heavy":[0.30,0.11], "mixed":[0.48,0.13], "renter-heavy":[0.68,0.15] },
};
const TUNE = Object.assign({}, DEFAULT_TUNE, process.env.PEER_TUNE ? JSON.parse(process.env.PEER_TUNE) : {});

let seed = 20261116;                       // deterministic: same data every run
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const norm = (mu, sd) => {                 // Box-Muller, clipped at ±2.5 sd
  const u = Math.max(rnd(), 1e-9), v = rnd();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mu + sd * Math.max(-2.5, Math.min(2.5, z));
};

// ── Archetypes: the structural truth each class is built from ────────────────
const ARCHETYPES = {
  rowcrop: {
    label: "Row crop",
    acres:        { small:[300,900],  mid:[900,2500], large:[2500,6000] },
    grossPerAcre: [950, 165],      // mean, sd — corn/bean rotation, corn belt
    opexShare:    [0.52, 0.06],    // NON-LAND operating cost as share of gross; rent adds on top
    machInvPerAcre:[620, 190],
    machCostPerAcre:[152, 38],
    laborShare:   [0.10, 0.03],
    landValPerAcre:[9200, 2600],
    cashRentPerAcre:[255, 55],
    idleWeeks:    [22, 6],
    storageRatio: [1.05, 0.35],
    fteePerKAcre: [1.4, 0.4],      // FTE per 1,000 acres
  },
  dairy: {
    label: "Dairy",
    head:         { small:[60,220], mid:[220,900], large:[900,3000] },
    grossPerHead: [5400, 900],
    opexShare:    [0.66, 0.05],
    machInvPerHead:[2300, 700],
    machCostPerHead:[520, 140],
    laborShare:   [0.19, 0.04],
    landValPerAcre:[8400, 2300],
    acresPerHead: [1.6, 0.5],
    cashRentPerAcre:[230, 50],
    idleWeeks:    [2, 1.5],
    fteePerHead:  [0.013, 0.004],
  },
  perennial: {
    label: "Orchard / specialty",
    acres:        { small:[25,90], mid:[90,300], large:[300,900] },
    grossPerAcre: [9200, 3100],
    opexShare:    [0.58, 0.07],
    machInvPerAcre:[2400, 800],
    machCostPerAcre:[430, 140],
    laborShare:   [0.29, 0.06],
    landValPerAcre:[22000, 8000],
    cashRentPerAcre:[900, 320],
    idleWeeks:    [16, 5],
    storageRatio: [0.80, 0.30],
    fteePerKAcre: [14, 4],
  },
};

const SCALES  = ["small", "mid", "large"];
const TENURES = ["owner-heavy", "mixed", "renter-heavy"];
const OWNED   = { "owner-heavy":[0.70,0.12], "mixed":[0.42,0.10], "renter-heavy":[0.12,0.08] };
const REGIONS = ["cornbelt", "northern-plains", "west", "southeast"];
const REGION_ADJ = { cornbelt:1.00, "northern-plains":0.86, west:1.14, southeast:0.92 };

// ─────────────────────────────────────────────────────────────────────────────
// Business readiness, calibrated to the survey block means
// ─────────────────────────────────────────────────────────────────────────────
// Block means are the real total-sample figures. A single latent maturity term
// drives all twelve, because a farm strong on one block is usually strong on
// others, and that correlation is what makes tier clustering meaningful.
const BLOCK_MEANS = Object.fromEntries(
  Object.entries(CAL.blockMeans)
    .filter(([k]) => k.startsWith("Block "))
    .map(([k, v]) => [Number(k.match(/^Block (\d+)/)[1]), v.Total])
);
const BLOCK_SD = 0.78;        // within-block spread across respondents
const LATENT_SHARE = 0.68;    // how much of a block score the farm-level latent drives

function readiness(latent) {
  const blocks = {};
  for (const [k, mu] of Object.entries(BLOCK_MEANS)) {
    const v = mu + BLOCK_SD * (LATENT_SHARE * latent + Math.sqrt(1 - LATENT_SHARE**2) * norm(0,1));
    blocks[k] = Math.max(1, Math.min(5, Math.round(v * 100) / 100));
  }
  const composite = Object.values(blocks).reduce((a,b)=>a+b,0) / 12;
  return { blocks, composite: Math.round(composite*1000)/1000 };
}

// Tiers were defined by cluster analysis on aggregate maturity, NOT by score
// cut-points (deck slide 32). Without the original centroids, cut-points chosen
// to reproduce the published tier sizes are the closest honest approximation,
// and the output says so rather than imply it reproduces the clustering.
const TIER_SHARES = Object.entries(CAL.tiers);
function assignTiers(all) {
  const sorted = [...all].sort((a,b)=>a.readiness.composite - b.readiness.composite);
  const total = TIER_SHARES.reduce((s,t)=>s+t[1],0);
  let i = 0;
  TIER_SHARES.forEach(([name, n]) => {
    const take = Math.round(n / total * sorted.length);
    for (let k = 0; k < take && i < sorted.length; k++, i++) sorted[i].tier = name;
  });
  while (i < sorted.length) sorted[i++].tier = TIER_SHARES[TIER_SHARES.length - 1][0];
  return all;
}

function makeFarm(kindKey, scale, tenure, region, latent) {
  // One latent maturity term per farm (drawn and standardised by the caller). The
  // survey shows maturity tracks profitability upward and liquidity holding slightly
  // downward: more mature operations deploy working capital rather than sit on it.
  const A = ARCHETYPES[kindKey];
  const radj = REGION_ADJ[region];
  const isHead = !!A.head;
  const range = (isHead ? A.head : A.acres)[scale];
  const units = Math.round(range[0] + rnd() * (range[1] - range[0]));

  // ── physical and price drivers ──
  const acres = isHead ? Math.round(units * norm(...A.acresPerHead)) : units;
  const head  = isHead ? units : 0;
  const grossPerUnit = Math.max(1, norm(...(isHead ? A.grossPerHead : A.grossPerAcre))) * radj;
  const gross = grossPerUnit * units;

  const ownedShare = Math.max(0, Math.min(0.95, norm(...OWNED[tenure])));
  const ownedAcres = Math.round(acres * ownedShare);
  const rentedAcres = acres - ownedAcres;
  const landValPerAcre = Math.max(500, norm(...A.landValPerAcre) * radj);
  const landValue = ownedAcres * landValPerAcre;
  const rent = rentedAcres * Math.max(20, norm(...A.cashRentPerAcre) * radj);

  // The floor belongs on the TOTAL, not the per-unit figure. Applied per acre it
  // forced every farm to at least $1,000/ac of machinery against a $620 target,
  // inflating depreciation and interest and dragging coverage down.
  const machVal  = Math.max(25000, norm(...(isHead ? A.machInvPerHead  : A.machInvPerAcre))  * units);
  const machCost = Math.max(10000, norm(...(isHead ? A.machCostPerHead : A.machCostPerAcre)) * units);

  // Rent is ADDED to non-land cost, never netted out of it. Netting it cancels
  // the tenure signature, which is the single most important thing this dataset
  // has to reproduce.
  const nonLandOpex = gross * Math.max(0.30, norm(A.opexShare[0] + TUNE.opexLift[kindKey], A.opexShare[1]) - latent*0.018);
  const opex = nonLandOpex + rent;

  const totalLabor = gross * Math.max(0.02, norm(...A.laborShare));
  // An operator's unpaid labour and management is charged at a living wage even on a
  // small farm, and a multi-million-dollar operation carries more than one operator
  // (roughly one per $1.2M gross). Scaling it with hired labour alone made 300-acre
  // farms look like they ran themselves and left large farms with a single $110k
  // charge, which is why returns to capital came out far above the survey.
  const operators = Math.max(1, gross / 1.2e6);
  const ownerLabor = Math.min(Math.max(totalLabor * 0.55, TUNE.ownerLaborFloor * operators), 110000 * operators, gross * 0.35);
  const hiredLabor = Math.max(0, totalLabor - ownerLabor);
  const fte = Math.max(1, isHead ? head * norm(...A.fteePerHead) : (acres/1000) * norm(...A.fteePerKAcre));

  // Sized so the current ratio and working capital to revenue both land near the
  // survey top-box shares (calibration.json → financialTopBoxByTier). Those two
  // constrain each other, so neither can be set alone.
  const currentAssets = gross * Math.max(0.10, norm(...TUNE.currentAssets) - latent*0.03);
  const currentLiab   = Math.max(1000, gross * norm(...TUNE.currentLiab));
  const depr = machVal * norm(0.09, 0.018);
  // Leverage correlates with tenure. Owner-heavy operations typically carry a
  // lower debt-to-asset because the ground was paid down across generations,
  // while renters carry debt against a much smaller asset base. Treating these
  // as independent produces farms whose interest burden is implausible.
  const termDA = Math.max(0.02, Math.min(0.80, norm(...TUNE.termDA[tenure])));
  // Survey: few farms reach an asset turnover of 0.35. The first version produced
  // 67%, so the asset base was far too light. Real farms carry livestock, stored
  // crop, buildings and improvements well beyond land and machinery.
  const otherAssets = gross * norm(...TUNE.otherAssets);
  // Current assets are part of the farm's asset base. Leaving grain inventory and
  // receivables out inflated asset turnover badly against the survey.
  const assets = landValue + machVal + otherAssets + currentAssets;
  // Term debt is carried against land and machinery; the operating line is the
  // current liability already modelled. Levering current assets at the same rate
  // as land overstated interest badly and drove debt service coverage negative.
  const termDebt = (landValue + machVal) * termDA;
  const debt = termDebt + currentLiab;
  const interest = termDebt * norm(0.065, 0.011) + currentLiab * norm(0.085, 0.013);
  const principal = termDebt * norm(0.068, 0.018);     // amortises term debt only

  const living = Math.min(gross * 0.16, norm(96000, 26000));
  const taxes  = Math.max(0, norm(24000, 12000));

  // revenue concentration — number and balance of streams; mature farms run more
  const divLift = Math.max(0, latent) * 0.14;
  const nStreams = 1 + (rnd() < 0.45+divLift ? 1 : 0) + (rnd() < 0.28+divLift ? 1 : 0) + (rnd() < 0.12+divLift ? 1 : 0);
  let shares = Array.from({length:nStreams}, () => Math.max(0.03, rnd()));
  if (nStreams > 1) shares[0] *= 2.4;            // one usually dominates
  const tot = shares.reduce((a,b)=>a+b,0);
  shares = shares.map(s => s/tot);

  return { kind:kindKey, kindLabel:A.label, scale, tenure, region,
    acres, head, units, gross, opex, rent, depr, interest, principal,
    landValue, machVal, machCost, assets, debt, currentAssets, currentLiab,
    hiredLabor, ownerLabor, totalLabor, fte, living, taxes, shares,
    latent, readiness: readiness(latent),
    idleWeeks: A.idleWeeks ? Math.max(0, norm(...A.idleWeeks)) : null,
    storageRatio: A.storageRatio ? Math.max(0, norm(...A.storageRatio)) : null };
}

// ── Ratios computed from the structure, never drawn ──────────────────────────
function ratios(f) {
  const nfifo = f.gross - f.opex - f.depr - f.interest;
  const netWorth = f.assets - f.debt;
  const opAssets = f.assets - f.landValue;
  const hhi = f.shares.reduce((a,s)=>a+s*s, 0);
  const opProfit = nfifo + f.interest - f.ownerLabor;    // return to capital before interest
  return {
    oer:               f.opex / f.gross * 100,
    // Survey respondents report their expense ratio against gross with depreciation
    // and interest included; this is the figure the survey top-box share is checked
    // against. The app's OER excludes both.
    totalExpenseRatio: (f.opex + f.depr + f.interest) / f.gross * 100,
    currentRatio:      f.currentAssets / f.currentLiab,
    wcToRevenue:       (f.currentAssets - f.currentLiab) / f.gross * 100,
    debtToAsset:       f.debt / f.assets * 100,
    debtToEquity:      netWorth > 0 ? f.debt / netWorth : null,
    equityToAsset:     netWorth / f.assets * 100,
    dscr:              nfifo / Math.max(1, f.interest + f.principal),
    nfifo,
    roa:               opProfit / f.assets * 100,
    roe:               netWorth > 0 ? (nfifo - f.ownerLabor) / netWorth * 100 : null,
    opProfitMargin:    opProfit / f.gross * 100,
    sgr:               netWorth > 0 ? (nfifo - f.living - f.taxes) / netWorth * 100 : null,
    assetTurnover:     f.gross / f.assets * 100,
    opAssetTurnover:   opAssets > 0 ? f.gross / opAssets * 100 : null,
    econTotalExpense:  (f.opex + f.landValue*0.03 + f.ownerLabor + f.depr) / f.gross,
    laborEfficiency:   f.totalLabor / f.gross * 100,
    laborProductivity: f.gross / f.fte,
    machInvPerAcre:    f.acres > 0 ? f.machVal / f.acres : null,
    // Total machinery cost (depreciation, repairs, fuel) is a generated driver;
    // reading it back keeps the ratio tied to the archetype's ~$150/ac benchmark.
    machCostPerAcre:   f.acres > 0 ? f.machCost / f.acres : null,
    // Asset utilisation, three families. Intensity: land cost (cash rent plus owned
    // land charged at 3%) as a share of revenue. Turnover: revenue per machinery
    // dollar. Capacity: idle weeks and storage ratio come straight from the drivers.
    landCostPctRevenue: (f.rent + f.landValue*0.03) / f.gross * 100,
    revPerMachDollar:  f.machVal > 0 ? f.gross / f.machVal : null,
    idleWeeks:         f.idleWeeks,
    storageRatio:      f.storageRatio,
    effectiveStreams:  1 / hhi,
    grossPerAcre:      f.acres > 0 ? f.gross / f.acres : null,
  };
}

// ── Generate ─────────────────────────────────────────────────────────────────
const PER_CLASS = 120;
const N_FARMS = Object.keys(ARCHETYPES).length * SCALES.length * TENURES.length * PER_CLASS;
// The latent is drawn for the whole population first and standardised, so the block
// means it drives land on the survey means rather than drifting with the generator's
// sample mean.
const latents = Array.from({ length: N_FARMS }, () => norm(0, 1));
const lMean = latents.reduce((a,b)=>a+b,0) / N_FARMS;
const lSd = Math.sqrt(latents.reduce((a,b)=>a+(b-lMean)**2,0) / N_FARMS);
const farms = [];
let li = 0;
for (const kind of Object.keys(ARCHETYPES))
  for (const scale of SCALES)
    for (const tenure of TENURES)
      for (const region of REGIONS)
        for (let i = 0; i < PER_CLASS/4; i++) {
          const f = makeFarm(kind, scale, tenure, region, (latents[li++] - lMean) / lSd);
          farms.push({ ...f, r: ratios(f) });
        }
assignTiers(farms);

// ── Thresholds: percentiles WITHIN each peer class ───────────────────────────
const pct = (arr, p) => {
  const a = arr.filter(v => v != null && isFinite(v)).sort((x,y)=>x-y);
  if (!a.length) return null;
  return a[Math.min(a.length-1, Math.floor(p/100 * a.length))];
};
const classKey = f => `${f.kind}|${f.scale}|${f.tenure}`;
const classes = {};
farms.forEach(f => { (classes[classKey(f)] ||= []).push(f); });

const METRICS = ["oer","currentRatio","wcToRevenue","debtToAsset","dscr","assetTurnover","opAssetTurnover",
                 "econTotalExpense","laborEfficiency","laborProductivity","effectiveStreams","grossPerAcre",
                 // asset utilisation — intensity, turnover, capacity
                 "machInvPerAcre","machCostPerAcre","landCostPctRevenue","revPerMachDollar","idleWeeks","storageRatio"];
const LOWER_IS_BETTER = new Set(["oer","debtToAsset","econTotalExpense","laborEfficiency","machInvPerAcre","machCostPerAcre","landCostPctRevenue"]);
// Capacity metrics are not better or worse — more idle weeks is more diversification
// opportunity, not better management — so they carry no direction flag.
const NO_DIRECTION = new Set(["idleWeeks","storageRatio"]);

const thresholds = {};
for (const [k, fs] of Object.entries(classes)) {
  thresholds[k] = { n: fs.length, metrics: {} };
  for (const m of METRICS) {
    const vals = fs.map(f => f.r[m]);
    thresholds[k].metrics[m] = {
      p10: pct(vals,10), p25: pct(vals,25), p50: pct(vals,50),
      p75: pct(vals,75), p90: pct(vals,90),
      strongIsLow: NO_DIRECTION.has(m) ? null : LOWER_IS_BETTER.has(m),
    };
  }
}

// The app needs the same scale bands the dataset was built from, so a farm lands in
// the class whose percentiles it is compared against. Dairy head is converted to an
// acre-equivalent band because the app records acres, not head.
const scaleBands = {};
for (const [k, A] of Object.entries(ARCHETYPES)) {
  const bands = A.acres || Object.fromEntries(Object.entries(A.head).map(([s,[lo,hi]]) => [s, [Math.round(lo*A.acresPerHead[0]), Math.round(hi*A.acresPerHead[0])]]));
  scaleBands[k] = { label:A.label, unit:A.acres ? "acres" : "acre-equivalents", small:bands.small, mid:bands.mid, large:bands.large };
}

// ── Survey figures the app cites directly ────────────────────────────────────
// Top-box shares: the percentage of surveyed farms at or beyond each fixed Tier 1
// threshold. Keyed by the app's ratio key so the UI can quote "29% of surveyed
// farms" beside the fixed benchmark.
const TOPBOX_KEY = {
  "Current Ratio":"currentRatio", "Working Capital / Gross Revenue":"wcToRevenue",
  "Debt-to-Asset Ratio":"debtToAsset", "Debt-to-Equity Ratio":"debtToEquity",
  "Equity-to-Asset Ratio":"equityRatio", "Return on Assets (ROA)":"roa",
  "Operating Profit Margin":"opProfitMargin", "Return on Equity (ROE)":"roe",
  "Operating Expense Ratio":"oer", "Asset Turnover Ratio":"assetTurnover",
};
const topBox = {};
for (const [name, row] of Object.entries(CAL.financialTopBoxByTier)) {
  const key = TOPBOX_KEY[name];
  if (!key) continue;
  const byTier = Object.fromEntries(Object.entries(CAL.tiers).map(([t]) => [t, row[t]]));
  topBox[key] = { label:name, measure:row.measure, total:row.Total, byTier };
}
const blockMeans = Object.fromEntries(Object.entries(BLOCK_MEANS).map(([n, mu]) => [n, mu]));
const survey = {
  source: CAL.source, n: Object.values(CAL.tiers).reduce((a,b)=>a+b,0),
  note: CAL.note, tiers: CAL.tiers, segments: CAL.segments,
  compositeMean: CAL.blockMeans["Total Composite Score"].Total,
  blockMeans, topBox,
};

fs.writeFileSync(path.join(here, "farms.json"), JSON.stringify(farms.map(f=>({...f, shares:undefined})), null, 0));
const out = { generated:"peer dataset calibrated to " + CAL.source + ", seed 20261116", perClass:PER_CLASS, metrics:METRICS, scaleBands, survey, classes:thresholds };
fs.writeFileSync(path.join(here, "..", "..", "src", "peer-thresholds.json"), JSON.stringify(out, null, 1));
console.log("Generated", farms.length, "farms across", Object.keys(classes).length, "peer classes; calibrated to", CAL.source);
