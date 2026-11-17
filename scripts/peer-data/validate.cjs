const farms = require("./farms.json");
const th = require("../../src/peer-thresholds.json").classes;
const fail = [];
const chk = (c, m) => { if (!c) fail.push(m); };

// 1. Internal consistency — ratios must agree with the statements they came from
let bad = 0;
farms.forEach(f => {
  const recomputedOER = f.opex / f.gross * 100;
  if (Math.abs(recomputedOER - f.r.oer) > 0.01) bad++;
  const nw = f.assets - f.debt;
  if (nw <= 0 && f.r.sgr !== null) bad++;
});
chk(bad === 0, `${bad} farms have ratios inconsistent with their statements`);

// 2. The tenure signature must appear — this is the whole point
const byTen = {};
farms.filter(f=>f.kind==="rowcrop").forEach(f => (byTen[f.tenure] ||= []).push(f));
const mean = (a,k) => a.reduce((s,f)=>s+f.r[k],0)/a.length;
const ownOER = mean(byTen["owner-heavy"],"oer"), rentOER = mean(byTen["renter-heavy"],"oer");
const ownAT  = mean(byTen["owner-heavy"],"assetTurnover"), rentAT = mean(byTen["renter-heavy"],"assetTurnover");
const ownOAT = mean(byTen["owner-heavy"],"opAssetTurnover"), rentOAT = mean(byTen["renter-heavy"],"opAssetTurnover");
chk(rentOER > ownOER + 3, "renters should show a materially higher operating expense ratio");
chk(rentAT > ownAT * 1.5, "renters should show much higher raw asset turnover");
chk(Math.abs(rentOAT - ownOAT) / ownOAT < 0.45, "operating asset turnover should converge across tenure");

// 3. Every class has enough farms for percentiles to mean anything
Object.entries(th).forEach(([k,v]) => chk(v.n >= 30, `class ${k} has only ${v.n} farms`));

// 4. Percentiles must be monotonic
Object.entries(th).forEach(([k,v]) => {
  Object.entries(v.metrics).forEach(([m,p]) => {
    if (p.p10==null) return;
    chk(p.p10<=p.p25 && p.p25<=p.p50 && p.p50<=p.p75 && p.p75<=p.p90, `${k} ${m} percentiles not monotonic`);
  });
});

// 5. Enterprise classes must actually differ, or the peer class is pointless
const lab = k => farms.filter(f=>f.kind===k);
const labEff = k => mean(lab(k),"laborEfficiency");
chk(labEff("perennial") > labEff("rowcrop")*1.8, "orchard labour share should far exceed row crop");
chk(mean(lab("perennial"),"grossPerAcre") > mean(lab("rowcrop"),"grossPerAcre")*4, "orchard gross per acre should dwarf row crop");

// 6. Debt service coverage must be plausible at the class median
Object.entries(th).forEach(([k,v]) => {
  const d = v.metrics.dscr.p50;
  chk(d != null && d > 0.4 && d < 12, `class ${k} has an implausible median DSCR of ${d && d.toFixed(2)}`);
});

// 7. Leverage should track tenure
const daBy = t => mean(farms.filter(f=>f.tenure===t), "debtToAsset");
chk(daBy("owner-heavy") < daBy("renter-heavy") - 8, "owner-heavy farms should be less levered than renters");

// 8. Asset utilisation families must behave differently, or splitting them is
//    pointless. Land cost as a share of revenue charges owned ground at 3%, so like
//    operating asset turnover it must CONVERGE across tenure; idle weeks (capacity)
//    must not differ by tenure either — tenure is a balance sheet fact and says
//    nothing about whether the planter sits in the shed.
const rc = farms.filter(f=>f.kind==="rowcrop");
const own = rc.filter(f=>f.tenure==="owner-heavy"), rent = rc.filter(f=>f.tenure==="renter-heavy");
chk(Math.abs(mean(own,"landCostPctRevenue") - mean(rent,"landCostPctRevenue")) < 5, "economic land cost share of revenue should converge across tenure");
chk(Math.abs(mean(own,"idleWeeks") - mean(rent,"idleWeeks")) < 2, "equipment idle weeks should not vary with tenure");
chk(mean(lab("dairy"),"idleWeeks") < mean(lab("rowcrop"),"idleWeeks") * 0.3, "dairy equipment should run far more of the year than row crop");
chk(mean(rc,"machInvPerAcre") > 400 && mean(rc,"machInvPerAcre") < 900, "row crop machinery investment per acre should sit near the ~$650 benchmark");
chk(mean(rc,"machCostPerAcre") > 100 && mean(rc,"machCostPerAcre") < 220, "row crop machinery cost per acre should sit near the ~$150 benchmark");

console.log(fail.length ? "FAILURES:\n  " + fail.join("\n  ") : "ALL VALIDATION PASSED");
console.log();
console.log("ASSET UTILISATION (row crop)");
console.log("  machinery investment/ac  $" + Math.round(mean(rc,"machInvPerAcre")), " cost/ac $" + Math.round(mean(rc,"machCostPerAcre")));
console.log("  land cost % revenue      owner", mean(own,"landCostPctRevenue").toFixed(0)+"%", " renter", mean(rent,"landCostPctRevenue").toFixed(0)+"%");
console.log("  idle weeks               owner", mean(own,"idleWeeks").toFixed(1), " renter", mean(rent,"idleWeeks").toFixed(1), " dairy", mean(lab("dairy"),"idleWeeks").toFixed(1));
console.log();
console.log("  debt-to-asset  owner", daBy("owner-heavy").toFixed(0)+"%", " renter", daBy("renter-heavy").toFixed(0)+"%");
console.log();
console.log("TENURE SIGNATURE (row crop)");
console.log("  operating expense ratio   owner", ownOER.toFixed(0)+"%", " renter", rentOER.toFixed(0)+"%");
console.log("  asset turnover            owner", ownAT.toFixed(0)+"%", "  renter", rentAT.toFixed(0)+"%");
console.log("  operating asset turnover  owner", ownOAT.toFixed(0)+"%", " renter", rentOAT.toFixed(0)+"%  <- converges");
console.log();
console.log("ENTERPRISE SEPARATION");
["rowcrop","dairy","perennial"].forEach(k=>{
  const a=lab(k);
  console.log("  "+a[0].kindLabel.padEnd(20),
    "labour", mean(a,"laborEfficiency").toFixed(1)+"%",
    "| gross/ac $"+Math.round(mean(a.filter(f=>f.r.grossPerAcre),"grossPerAcre")).toLocaleString());
});
