import type { FarmContext } from './context'
import type { ProtectionKey, ThreatBand, ThreatCategory } from './types'

export interface CategoryDef {
  key: ThreatCategory
  label: string
  question: string
  examples: string[]
  /** protection that most directly answers this category when a threat has no rule of its own */
  defaultProtection: (c: FarmContext) => ProtectionKey
}

/** Spec §4: order here is also the classification test order. */
export const CATEGORIES: CategoryDef[] = [
  {
    key: 'price',
    label: 'Price',
    question: 'What if prices fall below what it costs you to produce?',
    examples: ['Commodity prices drop below breakeven', 'Input costs spike after you have priced the crop', 'Calf or milk prices fall before you sell'],
    defaultProtection: (c) => (c.lrpLivestock && !c.crops ? 'lrp' : 'cropInsurance'),
  },
  {
    key: 'yield',
    label: 'Yield',
    question: 'What if you produce a lot less than you planned?',
    examples: ['Drought cuts yields', 'Crop disease or pests', 'Poor pasture or hay shortage', 'Low conception or weaning rates'],
    defaultProtection: () => 'cropInsurance',
  },
  {
    key: 'personnel',
    label: 'Personnel',
    question: 'What if a key person is hurt, quits, or can’t work?',
    examples: ['Operator injury, death or disability', 'Key employee quits at harvest', 'Divorce or family conflict', 'Worker injured on the job'],
    defaultProtection: () => 'crossTrained',
  },
  {
    key: 'facility',
    label: 'Facility',
    question: 'What if a building, bin or major machine is lost?',
    examples: ['Barn or shop fire', 'Grain dust explosion', 'Bin or roof structural collapse'],
    defaultProtection: () => 'farmProperty',
  },
  {
    key: 'natural',
    label: 'Natural',
    question: 'What if weather or a natural event hits?',
    examples: ['Hail, wind or tornado', 'Flood', 'Wildfire', 'Late freeze or heavy snow load'],
    defaultProtection: () => 'farmProperty',
  },
  {
    key: 'technology',
    label: 'Technology',
    question: 'What if your data, software or GPS stops working?',
    examples: ['Records lost on a single computer', 'Ransomware or email fraud', 'GPS or autosteer outage at planting'],
    defaultProtection: () => 'offsiteBackup',
  },
  {
    key: 'social',
    label: 'Social',
    question: 'What if the farm’s reputation takes a hit?',
    examples: ['Negative social media post or video', 'Neighbor complaint about odor, dust or noise', 'Local news story after an accident'],
    defaultProtection: () => 'spokesperson',
  },
  {
    key: 'operational',
    label: 'Operational',
    question: 'What if a buyer, supplier or market disappears?',
    examples: ['Loss of your main buyer', 'Supplier can’t deliver feed, seed or fuel', 'Product recall', 'Livestock disease outbreak closes markets'],
    defaultProtection: () => 'altBuyer',
  },
]

export const categoryDef = (k: ThreatCategory) => CATEGORIES.find((c) => c.key === k)!

/** Tailored example threats per category, keyed to farm type, enterprises and adjacent businesses. */
const TAILORED: { category: ThreatCategory; when: (c: FarmContext) => boolean; text: string }[] = [
  { category: 'price', when: (c) => c.hasEnterprise('corn', 'soybeans', 'wheat'), text: 'Corn, soybean or wheat prices fall below breakeven at harvest' },
  { category: 'price', when: (c) => c.hasEnterprise('cowCalf', 'feedlot'), text: 'Feeder or fed cattle prices drop before you sell' },
  { category: 'price', when: (c) => c.hasEnterprise('dairyHerd'), text: 'Milk price falls below your cost of production' },
  { category: 'price', when: (c) => c.hasEnterprise('hogs'), text: 'Lean hog prices fall below cost for several months' },
  { category: 'price', when: (c) => c.hasEnterprise('poultryFlock'), text: 'Integrator cuts pay rate or bird placements' },
  { category: 'price', when: (c) => c.hasEnterprise('produce', 'orchard'), text: 'Wholesale prices collapse in a glut year' },
  { category: 'price', when: (c) => c.livestock, text: 'Feed costs spike faster than livestock prices' },
  { category: 'yield', when: (c) => c.hasEnterprise('corn', 'soybeans', 'wheat'), text: 'Drought or derecho cuts yields below your APH' },
  { category: 'yield', when: (c) => c.hasEnterprise('hay', 'cowCalf'), text: 'Dry summer leaves you short on hay and pasture' },
  { category: 'yield', when: (c) => c.hasEnterprise('produce', 'orchard'), text: 'Late freeze or hail wipes out a harvest window' },
  { category: 'yield', when: (c) => c.hasEnterprise('dairyHerd'), text: 'Heat stress drops milk production' },
  { category: 'personnel', when: (c) => c.has('grainBins'), text: 'Someone is trapped entering a grain bin' },
  { category: 'personnel', when: (c) => c.employees > 0, text: 'Hired worker injured; you lose them for the season' },
  { category: 'personnel', when: (c) => c.has('atvs'), text: 'ATV or UTV rollover injury' },
  { category: 'personnel', when: (c) => c.hasEnterprise('dairyHerd'), text: 'No one else can run milking if the herdsman is out' },
  { category: 'facility', when: (c) => c.has('grainBins') || c.hasAdjacent('grainHandling'), text: 'Dryer fire or grain dust explosion' },
  { category: 'facility', when: (c) => c.has('livestockBarns'), text: 'Confinement barn fire or ventilation failure' },
  { category: 'facility', when: (c) => c.has('fuelStorage'), text: 'Fuel tank fire or leak' },
  { category: 'facility', when: (c) => c.hasAdjacent('processing'), text: 'Cooler or processing equipment failure spoils product' },
  { category: 'natural', when: (c) => c.northern && c.anyBuildings, text: 'Heavy snow load collapses a barn or shop roof' },
  { category: 'natural', when: (c) => c.has('manurePits'), text: 'Heavy rain causes a lagoon overflow or spill' },
  { category: 'natural', when: (c) => c.livestock, text: 'Extended power outage during a storm' },
  { category: 'technology', when: (c) => c.has('gpsEquipment'), text: 'GPS correction or autosteer goes down at planting' },
  { category: 'technology', when: (c) => c.has('computerRecords'), text: 'Ransomware locks your farm records' },
  { category: 'technology', when: (c) => c.hasAdjacent('agService', 'directMarket'), text: 'Point-of-sale or customer data breach' },
  { category: 'social', when: (c) => c.hostsPublic, text: 'Guest posts a bad experience online' },
  { category: 'social', when: (c) => c.has('manurePits') || c.hasEnterprise('hogs', 'poultryFlock'), text: 'Neighbors complain about odor' },
  { category: 'social', when: (c) => c.has('drones'), text: 'Neighbor complaint about drone flights' },
  { category: 'operational', when: (c) => !!c.topBuyer && c.topBuyer.share > 50, text: 'Your main buyer stops taking your product' },
  { category: 'operational', when: (c) => c.hasEnterprise('poultryFlock', 'hogs'), text: 'Integrator or packer ends your contract' },
  { category: 'operational', when: (c) => c.livestock, text: 'Disease outbreak closes markets or forces depopulation' },
  { category: 'operational', when: (c) => c.hasAdjacent('customHauling', 'customHarvest'), text: 'Customer disputes damage or payment on custom work' },
  { category: 'operational', when: (c) => c.hasAdjacent('directMarket', 'processing'), text: 'Food safety recall on a farm product' },
]

export function examplesFor(category: ThreatCategory, c: FarmContext): { text: string; tailored: boolean }[] {
  const tailored = TAILORED.filter((t) => t.category === category && t.when(c)).map((t) => ({ text: t.text, tailored: true }))
  const generic = categoryDef(category).examples.map((text) => ({ text, tailored: false }))
  return [...tailored, ...generic].slice(0, 4)
}

/** Risk identification areas: how strongly each category applies, and why. */
export function categoryRelevance(category: ThreatCategory, c: FarmContext): { level: 'high' | 'medium' | 'standard'; reasons: string[] } {
  const reasons: string[] = []
  const add = (cond: boolean, why: string) => cond && reasons.push(why)
  switch (category) {
    case 'price':
      add(c.crops, 'you sell commodity crops')
      add(c.livestock, 'you sell livestock or milk')
      add(c.hasEnterprise('poultryFlock'), 'your pay depends on an integrator contract')
      break
    case 'yield':
      add(c.crops, 'crop yields drive revenue')
      add(c.hasEnterprise('hay', 'cowCalf', 'dairyHerd'), 'you depend on forage')
      break
    case 'personnel':
      add(c.employees > 0, `you have ${c.employees} hired employee${c.employees === 1 ? '' : 's'}`)
      add(c.has('grainBins') || c.has('manurePits'), 'you work around bins or pits')
      add(c.has('atvs') || c.has('roadVehicles'), 'you run ATVs or trucks on the road')
      add(c.protection('successionPlan') !== 'have', 'there is no written succession plan')
      break
    case 'facility':
      add(c.has('grainBins') || c.hasAdjacent('grainHandling'), 'you store or handle grain')
      add(c.has('livestockBarns'), 'you have livestock buildings')
      add(c.has('fuelStorage'), 'you store fuel')
      add(c.hasAdjacent('processing'), 'you process product on the farm')
      break
    case 'natural':
      add(c.northern && c.anyBuildings, 'your buildings face snow load')
      add(c.crops, 'weather hits crops directly')
      add(c.has('manurePits'), 'lagoons can overflow in heavy rain')
      break
    case 'technology':
      add(c.has('computerRecords'), 'your records are on computers or software')
      add(c.has('gpsEquipment'), 'you rely on GPS guidance')
      add(c.hasAdjacent('agService', 'directMarket'), 'you take customer payments')
      break
    case 'social':
      add(c.hostsPublic, 'the public comes onto your farm')
      add(c.has('manurePits') || c.hasEnterprise('hogs', 'poultryFlock'), 'odor can draw complaints')
      add(c.has('roadVehicles'), 'your equipment is visible on public roads')
      break
    case 'operational':
      add(!!c.topBuyer && c.topBuyer.share > 50, `${c.topBuyer?.name} takes ${c.topBuyer?.share}% of revenue`)
      add(c.livestock, 'disease can close livestock markets')
      add(c.has('customWork') || c.has('contracts'), 'you work under contracts')
      add(c.state.profile.adjacent.length > 0, 'you run side businesses that depend on customers')
      break
  }
  const level = reasons.length >= 2 ? 'high' : reasons.length === 1 ? 'medium' : 'standard'
  return { level, reasons }
}

export function rankedCategories(c: FarmContext) {
  const weight = { high: 2, medium: 1, standard: 0 }
  return CATEGORIES.map((def, i) => ({ def, i, rel: categoryRelevance(def.key, c) }))
    .sort((a, b) => weight[b.rel.level] - weight[a.rel.level] || b.rel.reasons.length - a.rel.reasons.length || a.i - b.i)
}

/** Keyword auto-categorization. Word-boundary matching; tested in spec order (price/yield before operational). */
const KEYWORDS: Record<ThreatCategory, string[]> = {
  price: ['price', 'prices', 'pricing', 'breakeven', 'break-even', 'break even', 'market price', 'basis', 'cost of production', 'input costs?', 'feed costs?', 'margin', 'margins', 'cheap', 'commodity'],
  yield: ['yield', 'yields', 'drought', 'dry', 'blight', 'pests?', 'insects?', 'weeds?', 'crop disease', 'hail', 'freeze', 'frost', 'production', 'conception', 'weaning', 'harvest loss', 'short crop'],
  personnel: ['injury', 'injured', 'hurt', 'death', 'die', 'dies', 'died', 'disability', 'disabled', 'divorce', 'employees?', 'workers?', 'labor', 'labour', 'hired', 'quit', 'quits', 'sick', 'illness', 'operator', 'entrapment', 'trapped', 'rollover', 'crash', 'succession'],
  facility: ['fire', 'explosion', 'collapse', 'barn', 'shop', 'bins?', 'building', 'buildings', 'roof', 'dryer', 'structure', 'structural', 'silo', 'tank', 'equipment breakdown'],
  natural: ['storm', 'storms', 'floods?', 'flooding', 'wildfire', 'tornado', 'wind', 'snow', 'ice', 'lightning', 'rain', 'weather', 'hurricane', 'derecho', 'earthquake', 'power outage'],
  technology: ['data', 'computer', 'computers', 'software', 'hack', 'hacked', 'hacker', 'ransomware', 'cyber', 'gps', 'autosteer', 'email', 'phishing', 'internet', 'records', 'virus'],
  social: ['reputation', 'social media', 'facebook', 'video', 'neighbors?', 'neighbours?', 'complaints?', 'news', 'protest', 'activists?', 'odor', 'odour', 'public image'],
  operational: ['buyers?', 'markets?', 'market access', 'recall', 'suppliers?', 'supply', 'contracts?', 'integrator', 'packer', 'elevator', 'processor', 'outbreak', 'disease', 'biosecurity', 'delivery', 'customer', 'customers', 'landlord', 'lease'],
}

const PATTERNS = (Object.keys(KEYWORDS) as ThreatCategory[]).map((cat) => ({
  cat,
  terms: KEYWORDS[cat],
  re: new RegExp(`\\b(${KEYWORDS[cat].join('|')})\\b`, 'gi'),
}))

export function classify(text: string): { category: ThreatCategory | null; matches: string[] } {
  for (const p of PATTERNS) {
    p.re.lastIndex = 0
    const found = text.match(p.re)
    if (found && found.length) {
      // a buyer/market phrase outranks a bare crop word like "grain" — but price/yield still win first per spec
      return { category: p.cat, matches: [...new Set(found.map((f) => f.toLowerCase()))] }
    }
  }
  return { category: null, matches: [] }
}

export function threatScore(probability: number, severity: number) {
  return probability * severity
}

export function threatBand(score: number): ThreatBand {
  if (score >= 20) return 'immediate'
  if (score >= 12) return 'elevated'
  return 'monitor'
}

export const BAND_LABEL: Record<ThreatBand, string> = {
  immediate: 'Immediate',
  elevated: 'Elevated',
  monitor: 'Monitor',
}

export const PROBABILITY_LEVELS = [
  'Rare — hasn’t happened here and isn’t expected',
  'Unlikely — could happen once in 10+ years',
  'Possible — might happen once in 5–10 years',
  'Likely — happens every few years',
  'Almost certain — expect it most years',
]

export const SEVERITY_LEVELS = [
  'Minor — a bad day, little cost',
  'Moderate — a setback you absorb this year',
  'Serious — hurts this year’s profit',
  'Major — threatens the year or a whole enterprise',
  'Severe — could end the operation',
]
