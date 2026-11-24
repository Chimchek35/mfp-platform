import { AGRITOURISM_ACTIVITIES, BUILDING_ASSETS, CROP_ENTERPRISES, LIVESTOCK_ENTERPRISES, enterpriseDef, adjacentDef } from './options'
import type {
  AdjacentKey,
  AssetKey,
  EnterpriseKey,
  EquineActivity,
  LocationFlag,
  ManureType,
  FarmState,
  FarmType,
  ProtectionKey,
  ProtectionStatus,
} from './types'

const NORTHERN_STATES = new Set([
  'AK', 'CO', 'CT', 'IA', 'ID', 'IL', 'IN', 'MA', 'ME', 'MI', 'MN', 'MT', 'ND', 'NE', 'NH',
  'NJ', 'NY', 'OH', 'PA', 'RI', 'SD', 'UT', 'VT', 'WA', 'WI', 'WY', 'WV',
])

/** Broad, editable defaults. Farmers can override each flag in step 1. */
const LOCATION_STATES: Record<LocationFlag, Set<string>> = {
  snow: NORTHERN_STATES,
  wildfire: new Set(['AK', 'AZ', 'CA', 'CO', 'ID', 'MT', 'NM', 'NV', 'OK', 'OR', 'TX', 'UT', 'WA', 'WY']),
  hailWind: new Set(['AL', 'AR', 'CO', 'GA', 'IA', 'IL', 'IN', 'KS', 'KY', 'LA', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NM', 'OH', 'OK', 'SC', 'SD', 'TN', 'TX', 'WI', 'WY', 'FL']),
  earthquake: new Set(['AK', 'AR', 'CA', 'HI', 'ID', 'KY', 'MO', 'MT', 'NV', 'OR', 'SC', 'TN', 'UT', 'WA', 'WY']),
  flood: new Set(['AR', 'FL', 'IA', 'IL', 'IN', 'KY', 'LA', 'MO', 'MS', 'NC', 'ND', 'NE', 'NJ', 'NY', 'OH', 'PA', 'SC', 'SD', 'TN', 'TX', 'WV']),
}

export function derivedLocation(state: string): Record<LocationFlag, boolean> {
  return {
    snow: LOCATION_STATES.snow.has(state),
    wildfire: LOCATION_STATES.wildfire.has(state),
    hailWind: LOCATION_STATES.hailWind.has(state),
    earthquake: LOCATION_STATES.earthquake.has(state),
    flood: LOCATION_STATES.flood.has(state),
  }
}

/** Everything a rule needs to know about the farm, derived from the store. Read-only. */
export interface FarmContext {
  state: FarmState
  farmType: FarmType | null
  has: (a: AssetKey) => boolean
  hasEnterprise: (...e: EnterpriseKey[]) => boolean
  hasAdjacent: (...a: AdjacentKey[]) => boolean
  protection: (p: ProtectionKey) => ProtectionStatus | undefined
  crops: boolean
  livestock: boolean
  /** livestock that LRP can cover (cattle, hogs, lambs) */
  lrpLivestock: boolean
  anyBuildings: boolean
  northern: boolean
  employees: number
  workers: number
  hostsPublic: boolean
  topBuyer: { name: string; share: number } | null
  enterpriseNames: string
  adjacentNames: string
  /** Location flags: derived from state, then farmer overrides applied */
  loc: Record<LocationFlag, boolean>
  /** Poultry grown under an integrator contract */
  integrator: boolean
  equine: (a: EquineActivity) => boolean
  agri: (key: string) => boolean
  /** Labels of selected agritourism activities that are NOT insurable under the program */
  notInsurableAgri: string[]
  manure: (t: ManureType) => boolean
}

export function buildContext(state: FarmState): FarmContext {
  const p = state.profile
  const has = (a: AssetKey) => !!p.assets[a]
  const hasEnterprise = (...e: EnterpriseKey[]) => e.some((k) => p.enterprises.includes(k))
  const hasAdjacent = (...a: AdjacentKey[]) => a.some((k) => p.adjacent.includes(k))
  const employees = (p.seasonalEmployees ?? 0) + (p.yearRoundEmployees ?? 0)

  const buyerShares = new Map<string, number>()
  for (const op of p.revenueOps) {
    const name = op.buyer.trim()
    if (!name) continue
    const key = name.toLowerCase()
    buyerShares.set(key, (buyerShares.get(key) ?? 0) + op.share)
  }
  let topBuyer: FarmContext['topBuyer'] = null
  for (const [key, share] of buyerShares) {
    if (!topBuyer || share > topBuyer.share) {
      const original = p.revenueOps.find((o) => o.buyer.trim().toLowerCase() === key)!.buyer.trim()
      topBuyer = { name: original, share }
    }
  }

  return {
    state,
    farmType: p.farmType,
    has,
    hasEnterprise,
    hasAdjacent,
    protection: (k) => state.protections[k],
    crops: p.enterprises.some((e) => CROP_ENTERPRISES.includes(e)),
    livestock: p.enterprises.some((e) => LIVESTOCK_ENTERPRISES.includes(e)),
    lrpLivestock: hasEnterprise('cowCalf', 'feedlot', 'hogs', 'smallRuminants'),
    anyBuildings: BUILDING_ASSETS.some(has),
    northern: NORTHERN_STATES.has(p.state),
    employees,
    workers: employees + (p.familyWorkers ?? 0),
    hostsPublic: has('visitors') || hasAdjacent('agritourism', 'directMarket', 'events', 'boarding', 'huntingLease'),
    topBuyer,
    enterpriseNames: p.enterprises.map((e) => enterpriseDef(e).label.toLowerCase()).join(', '),
    adjacentNames: p.adjacent.map((a) => adjacentDef(a).label.toLowerCase()).join(', '),
    loc: { ...derivedLocation(p.state), ...(p.locationOverrides ?? {}) },
    integrator: !!p.poultryIntegrator && (p.farmType === 'poultry' || p.enterprises.includes('poultryFlock')),
    equine: (a) => (p.equineActivities ?? []).includes(a) || (a === 'boarding' && p.adjacent.includes('boarding') && p.enterprises.includes('horses')),
    agri: (k) => p.adjacent.includes('agritourism') && (p.agritourismActivities ?? []).includes(k),
    notInsurableAgri: p.adjacent.includes('agritourism')
      ? AGRITOURISM_ACTIVITIES.filter((x) => !x.insurable && (p.agritourismActivities ?? []).includes(x.key)).map((x) => x.label)
      : [],
    manure: (t) => !!p.assets.manurePits && (p.manureTypes ?? []).includes(t),
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}
