// ─────────────────────────────────────────────────────────────────────────────
// Synthetic peer dataset generator
// ─────────────────────────────────────────────────────────────────────────────
// Generates PHYSICAL AND ECONOMIC DRIVERS, then computes financial statements
// from them. Ratios emerge from structure, so they stay internally consistent.
// Never draw a ratio directly — you get farms whose balance sheet contradicts
// their income statement, and thresholds built on them are fiction.

let seed = 20261116;                       // deterministic: same data every run
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
const norm = (mu, sd) => {                 // Box-Muller, clipped at ±2.5 sd
  const u = Math.max(rnd(), 1e-9), v = rnd();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mu + sd * Math.max(-2.5, Math.min(2.5, z));
};
const pick = a => a[Math.floor(rnd() * a.length)];

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

function makeFarm(kindKey, scale, tenure, region) {
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

  // Floors apply to the farm total, not the per-unit draw — a per-unit floor of
  // $1,000 would pin every row-crop farm to exactly $1,000/acre of machinery.
  const machVal  = Math.max(1000, Math.max(50, norm(...(isHead ? A.machInvPerHead : A.machInvPerAcre))) * units);
  const machCost = Math.max(500,  Math.max(10, norm(...(isHead ? A.machCostPerHead : A.machCostPerAcre))) * units);

  // Rent is ADDED to non-land cost, never netted out of it. Netting it cancels
  // the tenure signature, which is the single most important thing this dataset
  // has to reproduce.
  const nonLandOpex = gross * Math.max(0.30, norm(...A.opexShare));
  const opex = nonLandOpex + rent;

  const totalLabor = gross * Math.max(0.02, norm(...A.laborShare));
  const ownerLabor = Math.min(totalLabor * 0.55, 110000);
  const hiredLabor = Math.max(0, totalLabor - ownerLabor);
  const fte = Math.max(1, isHead ? head * norm(...A.fteePerHead) : (acres/1000) * norm(...A.fteePerKAcre));

  const depr = machVal * norm(0.09, 0.018);
  // Leverage correlates with tenure. Owner-heavy operations typically carry a
  // lower debt-to-asset because the ground was paid down across generations,
  // while renters carry debt against a much smaller asset base. Treating these
  // as independent produces farms whose interest burden is implausible.
  const DA_BY_TENURE = { "owner-heavy":[0.21,0.10], "mixed":[0.33,0.13], "renter-heavy":[0.44,0.15] };
  const debtToAsset = Math.max(0.02, Math.min(0.80, norm(...DA_BY_TENURE[tenure])));
  const otherAssets = gross * norm(0.22, 0.07);
  const assets = landValue + machVal + otherAssets;
  const debt = assets * debtToAsset;
  const interest = debt * norm(0.071, 0.012);
  const principal = debt * norm(0.060, 0.018);

  const currentAssets = gross * norm(0.40, 0.14);
  const currentLiab   = Math.max(1000, gross * norm(0.21, 0.09));
  const living = Math.min(gross * 0.16, norm(96000, 26000));
  const taxes  = Math.max(0, norm(24000, 12000));

  // revenue concentration — number and balance of streams
  const nStreams = 1 + (rnd() < 0.45 ? 1 : 0) + (rnd() < 0.28 ? 1 : 0) + (rnd() < 0.12 ? 1 : 0);
  let shares = Array.from({length:nStreams}, () => Math.max(0.03, rnd()));
  if (nStreams > 1) shares[0] *= 2.4;            // one usually dominates
  const tot = shares.reduce((a,b)=>a+b,0);
  shares = shares.map(s => s/tot);

  return { kind:kindKey, kindLabel:A.label, scale, tenure, region,
    acres, head, units, gross, opex, rent, depr, interest, principal,
    landValue, machVal, machCost, assets, debt, currentAssets, currentLiab,
    hiredLabor, ownerLabor, totalLabor, fte, living, taxes, shares,
    idleWeeks: A.idleWeeks ? Math.max(0, norm(...A.idleWeeks)) : null,
    storageRatio: A.storageRatio ? Math.max(0, norm(...A.storageRatio)) : null };
}

// ── Ratios computed from the structure, never drawn ──────────────────────────
function ratios(f) {
  const nfifo = f.gross - f.opex - f.depr - f.interest;
  const netWorth = f.assets - f.debt;
  const opAssets = f.assets - f.landValue;
  const hhi = f.shares.reduce((a,s)=>a+s*s, 0);
  return {
    oer:               f.opex / f.gross * 100,
    currentRatio:      f.currentAssets / f.currentLiab,
    wcToRevenue:       (f.currentAssets - f.currentLiab) / f.gross * 100,
    debtToAsset:       f.debt / f.assets * 100,
    dscr:              nfifo / Math.max(1, f.interest + f.principal),
    nfifo,
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
const farms = [];
for (const kind of Object.keys(ARCHETYPES))
  for (const scale of SCALES)
    for (const tenure of TENURES)
      for (const region of REGIONS)
        for (let i = 0; i < PER_CLASS/4; i++) {
          const f = makeFarm(kind, scale, tenure, region);
          farms.push({ ...f, r: ratios(f) });
        }

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

const path = require("path"), fs = require("fs");
const here = __dirname;
fs.writeFileSync(path.join(here, "farms.json"), JSON.stringify(farms.map(f=>({...f, shares:undefined})), null, 0));
const out = { generated:"synthetic peer dataset, seed 20261116", perClass:PER_CLASS, metrics:METRICS, scaleBands, classes:thresholds };
fs.writeFileSync(path.join(here, "..", "..", "src", "peer-thresholds.json"), JSON.stringify(out, null, 1));
console.log("Generated", farms.length, "farms across", Object.keys(classes).length, "peer classes");
