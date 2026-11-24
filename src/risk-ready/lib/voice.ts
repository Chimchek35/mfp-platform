import { CATEGORIES, PROBABILITY_LEVELS, SEVERITY_LEVELS, classify, categoryDef } from './categories'
import { uid } from './context'
import { ADJACENT, ASSETS, ENTERPRISES, FARM_TYPES, PROTECTIONS, US_STATES } from './options'
import type { QuizQuestion } from './quiz'
import type { AdjacentKey, AssetKey, EnterpriseKey, FarmState, FarmType, ProtectionKey, ProtectionStatus, ReviewRecency, ThreatCategory } from './types'

export interface ProposalOption {
  label: string
  value: string | number | boolean
}

export interface Proposal {
  id: string
  field: string
  options: ProposalOption[]
  /** index into options; null = we didn't hear a clear answer and need to ask */
  selected: number | null
  confidence: number
  phrases: string[]
}

export interface Interpretation {
  proposals: Proposal[]
  ask?: string
  commit: (s: FarmState, picks: Record<string, ProposalOption['value'] | null>) => FarmState
}

const wb = (terms: string[]) => new RegExp(`\\b(${terms.join('|')})\\b`, 'i')
const findAll = (text: string, terms: string[]) => {
  const re = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi')
  return [...new Set((text.match(re) ?? []).map((m) => m.toLowerCase()))]
}

const NUMBER_WORDS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, twenty: 20 }
const toNum = (s: string) => (NUMBER_WORDS[s.toLowerCase()] ?? Number(s.replace(/,/g, '')))

// ---------------------------------------------------------------- Step 1: operation

const FARM_TYPE_TERMS: Record<FarmType, string[]> = {
  rowCrop: ['row crops?', 'grain farm', 'grain farmer', 'crop farm', 'cash grain'],
  specialtyCrop: ['specialty crops?', 'produce farm', 'vegetable farm', 'orchard', 'vineyard', 'nursery'],
  beef: ['ranch', 'rancher', 'beef', 'cattle operation', 'cow[- ]calf operation'],
  dairy: ['dairy', 'milking', 'milk cows'],
  swine: ['hog farm', 'hog operation', 'swine', 'pig farm'],
  poultry: ['poultry', 'broilers?', 'layers', 'chicken houses?', 'turkeys'],
  equine: ['horse farm', 'equine', 'stable'],
  mixed: ['mixed', 'crops and cattle', 'crops and livestock', 'grain and cattle', 'diversified'],
  agribusiness: ['elevator', 'dealership', 'agribusiness', 'co-?op'],
}

const ENTERPRISE_TERMS: Record<EnterpriseKey, string[]> = {
  corn: ['corn'],
  soybeans: ['soybeans?', 'soy', 'beans'],
  wheat: ['wheat', 'small grains?', 'oats', 'barley'],
  hay: ['hay', 'forage', 'alfalfa'],
  produce: ['vegetables?', 'produce', 'tomatoes', 'sweet corn', 'pumpkins?'],
  orchard: ['orchard', 'apples?', 'vineyard', 'grapes', 'nursery', 'berries'],
  cowCalf: ['cow[- ]calf', 'cows', 'calves', 'beef cows', 'momma cows', 'mother cows'],
  feedlot: ['feedlot', 'feeders?', 'stockers?', 'fat cattle', 'fed cattle'],
  dairyHerd: ['dairy', 'milk', 'milking'],
  hogs: ['hogs?', 'pigs?', 'swine', 'sows'],
  poultryFlock: ['chickens?', 'poultry', 'broilers?', 'layers', 'turkeys?', 'birds'],
  horses: ['horses?', 'equine'],
  smallRuminants: ['sheep', 'goats?', 'lambs?'],
}

const ADJACENT_TERMS: Record<AdjacentKey, string[]> = {
  agritourism: ['agritourism', 'corn maze', 'u-?pick', 'pumpkin patch', 'hayrides?', 'farm tours?'],
  directMarket: ['farm stand', 'farmers market', 'direct to consumer', 'sell direct', 'roadside stand', 'csa'],
  customHauling: ['custom hauling', 'trucking', 'haul for', 'hauling for'],
  customHarvest: ['custom harvest(ing)?', 'custom combin(e|ing)', 'custom spray(ing)?', 'custom planting', 'custom work'],
  grainHandling: ['store grain for', 'grain storage for', 'drying for', 'grain handling'],
  agService: ['dealer', 'dealership', 'seed sales', 'sell seed', 'chemical sales'],
  boarding: ['boarding', 'board horses', 'board cattle'],
  events: ['weddings?', 'events?', 'lessons', 'venue'],
  energyLease: ['solar', 'wind turbines?', 'wind lease', 'oil', 'gas lease', 'gas well'],
  huntingLease: ['hunting', 'hunters', 'hunting lease'],
  processing: ['processing', 'bottl(e|ing)', 'butcher(ing)?', 'cheese', 'value[- ]added', 'packing shed'],
  fuelDistribution: ['propane (sales|delivery|distribution)', 'sell fuel', 'fuel delivery', 'fuel distribution'],
}

const ASSET_TERMS: Record<AssetKey, string[]> = {
  grainBins: ['grain bins?', 'bins', 'grain storage'],
  grainDryer: ['grain dryers?', 'dryer', 'bucket elevators?', 'grain legs?'],
  combine: ['combines?'],
  hayStorage: ['hay barn', 'hay storage', 'hay shed', 'big bales', 'round bales'],
  manurePits: ['manure pits?', 'lagoons?', 'manure storage', 'manure tank'],
  livestockBarns: ['confinement', 'hog barns?', 'free[- ]stall', 'livestock barns?', 'chicken houses?'],
  milkingRefrigeration: ['milking parlou?r', 'bulk tank', 'milk tank', 'refrigerat(ion|ed|or)', 'cooler'],
  shopBuildings: ['shop', 'machine shed', 'machinery building', 'pole barn'],
  fuelStorage: ['fuel tanks?', 'fuel storage', 'diesel tank', 'propane tank', 'lp tank'],
  solarEv: ['solar panels?', 'solar', 'electric vehicles?', '\\bev\\b', 'batter(y|ies)'],
  heaters: ['wood stove', 'wood burner', 'space heaters?', 'heat lamps?', 'outdoor furnace'],
  sprinklers: ['sprinklers?', 'fire alarms?', 'smoke detectors?', 'alarm system'],
  sumpPumps: ['sump pumps?', 'basement'],
  newConstruction: ['new barn', 'building a', 'under construction', 'renovat(e|ing|ion)'],
  remoteBuildings: ['remote buildings?', 'out[- ]buildings?', 'far from the house', 'other farm'],
  chemicalStorage: ['chemicals?', 'pesticides?', 'herbicides?', 'anhydrous', 'fertilizer storage'],
  roadVehicles: ['semis?', 'trucks?', 'on the road', 'public roads?', 'trailers?'],
  atvs: ['atvs?', 'utvs?', 'side[- ]by[- ]sides?', 'four[- ]wheelers?', 'gators?'],
  youthRiders: ['kids ride', 'children ride', 'grandkids'],
  drones: ['drones?'],
  cameras: ['cameras?', 'security cam', 'barn cam'],
  contractors: ['contractors?', 'vendors on site', 'electrician', 'roofers?'],
  minors: ['minors', 'teenagers?', 'high school(ers)?', 'under 18', 'kids working'],
  farmHome: ['house', 'home on the farm', 'farmhouse', 'we live on'],
  computerRecords: ['computer', 'software', 'precision ag', 'records on', 'quickbooks', 'spreadsheets?'],
  gpsEquipment: ['gps', 'autosteer', 'auto[- ]steer', 'guidance'],
  visitors: ['visitors', 'the public', 'customers come', 'guests'],
  customWork: ['custom work', 'custom hire', 'work for neighbors'],
  contracts: ['contracts?', 'cash rent', 'leases?', 'landlords?'],
}

export function interpretProfile(text: string): Interpretation {
  const t = text.toLowerCase()
  const proposals: Proposal[] = []
  const yesNo = (label: string): ProposalOption[] => [
    { label: `Add ${label}`, value: true },
    { label: 'Skip', value: false },
  ]

  for (const ft of FARM_TYPES) {
    const hit = findAll(t, FARM_TYPE_TERMS[ft.key])
    if (hit.length) {
      proposals.push({
        id: 'farmType',
        field: 'Farm type',
        options: FARM_TYPES.map((f) => ({ label: f.label, value: f.key })),
        selected: FARM_TYPES.findIndex((f) => f.key === ft.key),
        confidence: 0.7,
        phrases: hit,
      })
      break
    }
  }
  for (const e of ENTERPRISES) {
    const hit = findAll(t, ENTERPRISE_TERMS[e.key])
    if (hit.length) proposals.push({ id: `ent:${e.key}`, field: 'Enterprise', options: yesNo(e.label), selected: 0, confidence: 0.85, phrases: hit })
  }
  for (const a of ADJACENT) {
    const hit = findAll(t, ADJACENT_TERMS[a.key])
    if (hit.length) proposals.push({ id: `adj:${a.key}`, field: 'Farm-adjacent enterprise', options: yesNo(a.label), selected: 0, confidence: 0.75, phrases: hit })
  }
  for (const a of ASSETS) {
    const hit = findAll(t, ASSET_TERMS[a.key])
    if (hit.length) proposals.push({ id: `asset:${a.key}`, field: 'Asset', options: yesNo(a.label), selected: 0, confidence: 0.7, phrases: hit })
  }
  const acres = t.match(/(\d[\d,]*)\s*acres?/)
  if (acres) proposals.push({ id: 'acres', field: 'Acres', options: [{ label: `${toNum(acres[1])} acres`, value: toNum(acres[1]) }, { label: 'Skip', value: false }], selected: 0, confidence: 0.95, phrases: [acres[0]] })
  const head = t.match(/(\d[\d,]*)\s*(head|cows|cattle|sows|hogs|birds|horses|pairs)/)
  if (head) proposals.push({ id: 'head', field: 'Head', options: [{ label: `${toNum(head[1])} head`, value: toNum(head[1]) }, { label: 'Skip', value: false }], selected: 0, confidence: 0.9, phrases: [head[0]] })
  const emp = t.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a)\s+(full[- ]time |year[- ]round |seasonal |part[- ]time )?(hired (hands?|men|employees?|workers?)|employees?|workers?|hands?)/)
  if (emp) {
    const n = toNum(emp[1])
    const seasonal = /seasonal|part/.test(emp[2] ?? '')
    proposals.push({
      id: 'employees',
      field: 'Hired employees',
      options: [
        { label: `${n} year-round`, value: `yr:${n}` },
        { label: `${n} seasonal`, value: `se:${n}` },
        { label: 'Skip', value: false },
      ],
      selected: seasonal ? 1 : 0,
      confidence: emp[2] ? 0.85 : 0.6,
      phrases: [emp[0]],
    })
  }
  for (const [code, name] of US_STATES) {
    if (wb([name.toLowerCase()]).test(t)) {
      proposals.push({ id: 'state', field: 'State', options: [{ label: name, value: code }, { label: 'Skip', value: false }], selected: 0, confidence: 0.95, phrases: [name.toLowerCase()] })
      break
    }
  }

  return {
    proposals,
    ask: proposals.length ? undefined : 'I didn’t catch any farm details. Try something like: “We farm 1,100 acres of corn and soybeans in Ohio with 150 cow-calf pairs and two hired hands.”',
    commit: (s, picks) => {
      const p = { ...s.profile, enterprises: [...s.profile.enterprises], adjacent: [...s.profile.adjacent], assets: { ...s.profile.assets } }
      for (const [id, v] of Object.entries(picks)) {
        if (v === null || v === false) continue
        if (id === 'farmType') p.farmType = v as FarmType
        else if (id.startsWith('ent:')) {
          const k = id.slice(4) as EnterpriseKey
          if (!p.enterprises.includes(k)) p.enterprises.push(k)
        } else if (id.startsWith('adj:')) {
          const k = id.slice(4) as AdjacentKey
          if (!p.adjacent.includes(k)) p.adjacent.push(k)
        } else if (id.startsWith('asset:')) p.assets[id.slice(6) as AssetKey] = true
        else if (id === 'acres') p.acres = v as number
        else if (id === 'head') p.head = v as number
        else if (id === 'state') p.state = v as string
        else if (id === 'employees') {
          const [kind, n] = String(v).split(':')
          if (kind === 'yr') p.yearRoundEmployees = Number(n)
          else p.seasonalEmployees = Number(n)
        }
      }
      return { ...s, profile: p }
    },
  }
}

// ---------------------------------------------------------------- Step 2: protections

const PROTECTION_TERMS: Record<ProtectionKey, string[]> = {
  farmProperty: ['farm property', 'property insurance', 'property coverage', 'building coverage', 'farm policy'],
  farmLiability: ['liability'],
  umbrella: ['umbrella'],
  cropInsurance: ['crop insurance', 'rp', 'revenue protection', 'yield protection'],
  lrp: ['lrp', 'livestock risk protection', 'livestock insurance'],
  workersComp: ['workers comp', 'workers compensation', 'work comp', 'workman.?s comp'],
  businessIncome: ['business income', 'business interruption'],
  cyber: ['cyber'],
  autoFleet: ['auto', 'fleet', 'truck insurance', 'commercial auto'],
  emergencyPlan: ['emergency plan'],
  keyProcedures: ['procedures', 'written steps', 'sops?'],
  crossTrained: ['cross[- ]trained', 'cross[- ]training', 'backup person', 'someone else can'],
  offsiteBackup: ['backup', 'back up', 'backed up', 'cloud'],
  generator: ['generator'],
  altBuyer: ['alternate buyer', 'backup buyer', 'another buyer', 'second buyer'],
  altSupplier: ['alternate supplier', 'backup supplier', 'another supplier'],
  contactList: ['contact list', 'phone list', 'emergency contacts?'],
  spokesperson: ['spokesperson', 'speaks for', 'talks to the media'],
  successionPlan: ['succession', 'transition plan', 'estate plan', 'will'],
}

const NEG = /\b(no|not|don'?t|do not|never|without|haven'?t|lack|none|nothing)\b/i
const UNSURE = /\b(not sure|unsure|maybe|i think|probably|i guess|don'?t know|no idea)\b/i

export function interpretProtections(text: string): Interpretation {
  const clauses = text.toLowerCase().split(/[.;!?\n]|,|\bbut\b|\band\b/).map((c) => c.trim()).filter(Boolean)
  const found = new Map<ProtectionKey, { status: ProtectionStatus; phrase: string; clause: string }>()
  for (const clause of clauses) {
    for (const p of PROTECTIONS) {
      const hit = findAll(clause, PROTECTION_TERMS[p.key])
      if (!hit.length || found.has(p.key)) continue
      // "offsiteBackup" shouldn't steal "backup generator" / "backup buyer"
      if (p.key === 'offsiteBackup' && /generator|buyer|supplier|person/.test(clause)) continue
      const status: ProtectionStatus = UNSURE.test(clause) ? 'unsure' : NEG.test(clause) ? 'none' : 'have'
      found.set(p.key, { status, phrase: hit[0], clause })
    }
  }
  const proposals: Proposal[] = [...found].map(([key, f]) => ({
    id: `prot:${key}`,
    field: PROTECTIONS.find((p) => p.key === key)!.label,
    options: [
      { label: 'Have', value: 'have' },
      { label: 'Not sure', value: 'unsure' },
      { label: 'Don’t have', value: 'none' },
    ],
    selected: f.status === 'have' ? 0 : f.status === 'unsure' ? 1 : 2,
    confidence: f.status === 'have' && !NEG.test(f.clause) ? 0.8 : 0.65,
    phrases: [f.phrase, ...(NEG.test(f.clause) ? [f.clause.match(NEG)![0]] : []), ...(UNSURE.test(f.clause) ? [f.clause.match(UNSURE)![0]] : [])],
  }))

  const t = text.toLowerCase()
  if (/\b(review|reviewed|went over|sat down)\b/.test(t) && /\b(agent|insurance|policy|policies)\b/.test(t)) {
    let value: ReviewRecency | null = null
    let phrase = ''
    const m1 = t.match(/\b(never)\b/)
    const m2 = t.match(/\b(this year|last year|recently|few months|last month|this spring|this winter|this fall)\b/)
    const m3 = t.match(/\b(years ago|a while|long time|couple years|two years|three years|ages)\b/)
    if (m1) [value, phrase] = ['never', m1[0]]
    else if (m3) [value, phrase] = ['longer', m3[0]]
    else if (m2) [value, phrase] = ['within12', m2[0]]
    proposals.push({
      id: 'review',
      field: 'Last insurance review',
      options: [
        { label: 'Within 12 months', value: 'within12' },
        { label: 'Longer ago', value: 'longer' },
        { label: 'Never', value: 'never' },
      ],
      selected: value ? ['within12', 'longer', 'never'].indexOf(value) : null,
      confidence: value ? 0.75 : 0,
      phrases: phrase ? [phrase] : ['review'],
    })
  }

  return {
    proposals,
    ask: proposals.length ? undefined : 'I didn’t hear any specific protections. Try: “We have crop insurance and farm liability, no cyber, and I’m not sure about an umbrella.”',
    commit: (s, picks) => {
      const protections = { ...s.protections }
      let insuranceReview = s.insuranceReview
      for (const [id, v] of Object.entries(picks)) {
        if (v === null) continue
        if (id === 'review') insuranceReview = v as ReviewRecency
        else protections[id.slice(5) as ProtectionKey] = v as ProtectionStatus
      }
      return { ...s, protections, insuranceReview }
    },
  }
}

// ---------------------------------------------------------------- Step 3: quiz answer

const EXTENT_PATTERNS: [number, RegExp][] = [
  [4, /\b(to a great extent|great extent|absolutely|definitely|completely|fully|written plan|every year|all of it|very much)\b/i],
  [1, /\b(not at all|never|nothing|no plan|haven'?t|not really)\b/i],
  [2, /\b(a little|a bit|barely|not much|slightly|a few)\b/i],
  [3, /\b(somewhat|partly|partially|kind of|sort of|mostly|pretty well|some of)\b/i],
]
const AGREE_PATTERNS: [number, RegExp][] = [
  [4, /\b(strongly agree|absolutely|definitely|completely|100 percent)\b/i],
  [1, /\b(strongly disagree|not at all|never|no way)\b/i],
  [2, /\b(disagree|not really|don'?t think so|not much|nope)\b/i],
  [3, /\b(agree|yes|yeah|we do|mostly|for the most part)\b/i],
]

export function interpretQuizAnswer(q: QuizQuestion, text: string): Interpretation {
  const patterns = q.scale[0] === 'Not at all' ? EXTENT_PATTERNS : AGREE_PATTERNS
  let selected: number | null = null
  let phrase = ''
  for (const [value, re] of patterns) {
    const m = text.match(re)
    if (m) {
      selected = value - 1
      phrase = m[0].toLowerCase()
      break
    }
  }
  return {
    proposals: [
      {
        id: q.id,
        field: q.text,
        options: q.scale.map((label, i) => ({ label, value: i + 1 })),
        selected,
        confidence: selected == null ? 0 : phrase.split(' ').length > 1 ? 0.85 : 0.6,
        phrases: phrase ? [phrase] : [],
      },
    ],
    ask: selected == null ? `I couldn’t tell which answer fits — can you pick one below, or say something like “${q.scale[0].toLowerCase()}” or “${q.scale[3].toLowerCase()}”?` : undefined,
    commit: (s, picks) => {
      const v = picks[q.id]
      return v == null ? s : { ...s, quiz: { ...s.quiz, [q.id]: v as number } }
    },
  }
}

// ---------------------------------------------------------------- Step 4: threat

const PROB_PATTERNS: [number, RegExp][] = [
  [5, /\b(every year|almost certain|all the time|always|guaranteed|constantly)\b/i],
  [4, /\b(pretty likely|very likely|likely|every few years|often|regularly|a lot)\b/i],
  [2, /\b(unlikely|rare|rarely|once in a while|hardly)\b/i],
  [1, /\b(never happened|almost never|very rare|never)\b/i],
  [3, /\b(could happen|might|possible|possibly|sometimes|once in a while)\b/i],
]
const SEV_PATTERNS: [number, RegExp][] = [
  [5, /\b(wipe us out|wipe out|end the farm|put us out of business|lose the farm|devastating|catastrophic|bankrupt)\b/i],
  [4, /\b(big hit|serious|major|really hurt|huge|lose the year|lose a year)\b/i],
  [3, /\b(hurt|set us back|costly|expensive|significant)\b/i],
  [2, /\b(minor|small|manageable|not a big deal)\b/i],
  [1, /\b(nothing|trivial|no big deal|barely notice)\b/i],
]

function match(patterns: [number, RegExp][], text: string) {
  for (const [v, re] of patterns) {
    const m = text.match(re)
    if (m) return { value: v, phrase: m[0].toLowerCase() }
  }
  return null
}

export function interpretThreat(text: string): Interpretation {
  const cls = classify(text)
  const prob = match(PROB_PATTERNS, text)
  const sev = match(SEV_PATTERNS, text)
  const label = text.trim().replace(/\s+/g, ' ').replace(/^(i'?m worried (about|that)|what if|maybe|honestly,?)\s*/i, '').replace(/[.!?]+$/, '')
  const cap = label.charAt(0).toUpperCase() + label.slice(1)
  const proposals: Proposal[] = [
    {
      id: 'category',
      field: `Category for “${cap}”`,
      options: CATEGORIES.map((c) => ({ label: c.label, value: c.key })),
      selected: cls.category ? CATEGORIES.findIndex((c) => c.key === cls.category) : null,
      confidence: cls.category ? Math.min(0.9, 0.55 + cls.matches.length * 0.15) : 0,
      phrases: cls.matches,
    },
    {
      id: 'probability',
      field: 'How likely',
      options: PROBABILITY_LEVELS.map((l, i) => ({ label: `${i + 1} — ${l.split(' — ')[0]}`, value: i + 1 })),
      selected: prob ? prob.value - 1 : null,
      confidence: prob ? 0.75 : 0,
      phrases: prob ? [prob.phrase] : [],
    },
    {
      id: 'severity',
      field: 'How bad',
      options: SEVERITY_LEVELS.map((l, i) => ({ label: `${i + 1} — ${l.split(' — ')[0]}`, value: i + 1 })),
      selected: sev ? sev.value - 1 : null,
      confidence: sev ? 0.75 : 0,
      phrases: sev ? [sev.phrase] : [],
    },
  ]
  const missing = proposals.filter((p) => p.selected == null).map((p) => p.field.split(' for')[0].toLowerCase())
  return {
    proposals,
    ask: missing.length ? `I need a little more: please choose ${missing.join(' and ')} below.` : undefined,
    commit: (s, picks) => {
      const category = (picks.category ?? cls.category) as ThreatCategory | null
      if (!category || !label) return s
      return {
        ...s,
        threats: [
          ...s.threats,
          { id: uid(), label: cap, category, probability: (picks.probability as number) ?? 3, severity: (picks.severity as number) ?? 3, source: 'voice' },
        ],
      }
    },
  }
}

export const categoryLabel = (k: ThreatCategory) => categoryDef(k).label
