import { initialState } from './sample'
import { US_STATES } from './options'
import type { AdjacentKey, EnterpriseKey, FarmState, FarmType } from './types'

/** The parts of the platform's Farm Profile and Financial Analysis the Plan Builder can read. */
export interface MfpProfileLike {
  location?: string
  size?: string
  productionMix?: string
  ventures?: string
  [key: string]: unknown
}
export interface MfpFinancialLike {
  enterprises?: string[]
  s3vals?: { acres?: string | number }
  [key: string]: unknown
}

const ENTERPRISE_WORDS: [EnterpriseKey, RegExp][] = [
  ['corn', /\bcorn\b/i],
  ['soybeans', /\bsoy(a|bean)/i],
  ['wheat', /\bwheat|small grains?\b/i],
  ['hay', /\bhay|alfalfa|forage|pasture\b/i],
  ['produce', /\bproduce|vegetable|market garden|specialty crop|cut flower|berr/i],
  ['orchard', /\borchard|apple|peach|cherr|fruit|vineyard|grape|nut\b/i],
  ['cowCalf', /\bcow[- ]calf|beef|cattle|stocker/i],
  ['feedlot', /\bfeedlot|feeder cattle|finishing cattle/i],
  ['dairyHerd', /\bdairy|milk/i],
  ['hogs', /\bhog|swine|pig|farrow/i],
  ['poultryFlock', /\bpoultry|broiler|layer|chicken|turkey|egg/i],
  ['horses', /\bhorse|equine/i],
  ['smallRuminants', /\bsheep|goat|lamb|ewe/i],
]

const ADJACENT_WORDS: [AdjacentKey, RegExp][] = [
  ['agritourism', /\bagritourism|agri-tourism|pumpkin|corn maze|u-pick|pick-your-own|farm tour/i],
  ['directMarket', /\bfarm store|farm stand|farmers'? market|direct[- ]market|csa\b|roadside/i],
  ['customHauling', /\bhauling|trucking|freight/i],
  ['customHarvest', /\bcustom (planting|harvest|work|farming|spraying|baling)|custom-/i],
  ['grainHandling', /\bgrain (storage|handling|elevator|drying)|on-farm storage|grain bins?/i],
  ['agService', /\bseed (dealer|sales)|ag(ronomy)? service|crop consult|spraying service/i],
  ['boarding', /\bboarding/i],
  ['events', /\bwedding|event venue|events?\b|venue/i],
  ['energyLease', /\bsolar|wind (lease|turbine|farm)|energy lease|pipeline/i],
  ['huntingLease', /\bhunting|outfitt/i],
  ['processing', /\bprocessing|butcher|meat locker|creamery|cidery|winery|value[- ]added/i],
  ['fuelDistribution', /\bfuel (sales|distribution|delivery)|propane/i],
]

const FA_ENTERPRISE_MAP: Record<string, EnterpriseKey[]> = {
  grain: ['corn', 'soybeans'],
  dairy: ['dairyHerd'],
  beef: ['cowCalf'],
  hogs: ['hogs'],
  perennials: ['orchard'],
  produce: ['produce'],
}

const LIVESTOCK: EnterpriseKey[] = ['cowCalf', 'feedlot', 'dairyHerd', 'hogs', 'poultryFlock', 'horses', 'smallRuminants']
const CROPS: EnterpriseKey[] = ['corn', 'soybeans', 'wheat', 'hay', 'produce', 'orchard']

function inferFarmType(enterprises: EnterpriseKey[]): FarmType | null {
  if (!enterprises.length) return null
  const crops = enterprises.filter((e) => CROPS.includes(e))
  const stock = enterprises.filter((e) => LIVESTOCK.includes(e))
  if (crops.length && stock.length) return 'mixed'
  if (stock.length) {
    if (stock.includes('dairyHerd')) return 'dairy'
    if (stock.includes('hogs')) return 'swine'
    if (stock.includes('poultryFlock')) return 'poultry'
    if (stock.includes('horses')) return 'equine'
    return 'beef'
  }
  const specialty = crops.every((e) => e === 'produce' || e === 'orchard')
  return specialty ? 'specialtyCrop' : 'rowCrop'
}

function matchState(location: string): string {
  if (!location) return ''
  for (const [code, name] of US_STATES) {
    if (new RegExp(`\\b${name}\\b`, 'i').test(location)) return code
  }
  const abbrev = location.match(/(?:,|\b)\s*([A-Z]{2})\b(?!\w)/)
  if (abbrev && US_STATES.some(([code]) => code === abbrev[1])) return abbrev[1]
  return ''
}

function parseAcres(size: string, fallback?: string | number): number | null {
  const m = size?.match(/([\d,]+(?:\.\d+)?)\s*(?:ac\b|acre)/i)
  const n = m ? Number(m[1].replace(/,/g, '')) : Number(String(fallback ?? '').replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null
}

/**
 * Seeds a brand-new plan from what the farm has already told the platform, so the
 * "Your operation" step opens with the farm type, enterprises, state and acres filled in.
 * Only used when no plan exists yet; after that the plan is the source of truth.
 */
export function seedPlanFromMfp(profile?: MfpProfileLike | null, fa?: MfpFinancialLike | null): FarmState {
  const base = initialState()
  const text = `${profile?.productionMix ?? ''} ${profile?.ventures ?? ''}`
  const enterprises = new Set<EnterpriseKey>()
  for (const id of fa?.enterprises ?? []) (FA_ENTERPRISE_MAP[id] ?? []).forEach((e) => enterprises.add(e))
  for (const [key, rx] of ENTERPRISE_WORDS) if (rx.test(text)) enterprises.add(key)
  const adjacent = new Set<AdjacentKey>()
  for (const [key, rx] of ADJACENT_WORDS) if (rx.test(profile?.ventures ?? '')) adjacent.add(key)

  const ent = [...enterprises]
  const seeded: FarmState = {
    ...base,
    profile: {
      ...base.profile,
      farmType: inferFarmType(ent),
      enterprises: ent,
      adjacent: [...adjacent],
      state: matchState(profile?.location ?? ''),
      acres: parseAcres(profile?.size ?? '', fa?.s3vals?.acres),
    },
  }
  const p = seeded.profile
  if (p.farmType || p.enterprises.length || p.adjacent.length || p.state || p.acres) seeded.seededFrom = 'mfp'
  return seeded
}
