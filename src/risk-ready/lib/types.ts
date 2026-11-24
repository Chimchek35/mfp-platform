/** Primary farm type — the single best description of the operation. Sets the overall frame. */
export type FarmType =
  | 'rowCrop'
  | 'specialtyCrop'
  | 'beef'
  | 'dairy'
  | 'swine'
  | 'poultry'
  | 'equine'
  | 'mixed'
  | 'agribusiness'

/** Production enterprises — what the farm grows or raises. */
export type EnterpriseKey =
  | 'corn'
  | 'soybeans'
  | 'wheat'
  | 'hay'
  | 'produce'
  | 'orchard'
  | 'cowCalf'
  | 'feedlot'
  | 'dairyHerd'
  | 'hogs'
  | 'poultryFlock'
  | 'horses'
  | 'smallRuminants'

/** Farm-adjacent enterprises — businesses that run alongside production. */
export type AdjacentKey =
  | 'agritourism'
  | 'directMarket'
  | 'customHauling'
  | 'customHarvest'
  | 'grainHandling'
  | 'agService'
  | 'boarding'
  | 'events'
  | 'energyLease'
  | 'huntingLease'
  | 'processing'
  | 'fuelDistribution'

export type AssetKey =
  | 'grainBins'
  | 'grainDryer'
  | 'combine'
  | 'hayStorage'
  | 'manurePits'
  | 'livestockBarns'
  | 'milkingRefrigeration'
  | 'shopBuildings'
  | 'fuelStorage'
  | 'solarEv'
  | 'heaters'
  | 'sprinklers'
  | 'sumpPumps'
  | 'newConstruction'
  | 'remoteBuildings'
  | 'chemicalStorage'
  | 'roadVehicles'
  | 'atvs'
  | 'youthRiders'
  | 'drones'
  | 'cameras'
  | 'farmHome'
  | 'computerRecords'
  | 'gpsEquipment'
  | 'visitors'
  | 'customWork'
  | 'contractors'
  | 'minors'
  | 'contracts'

export type ManureType = 'enclosedPit' | 'tank' | 'lagoon'
export type EquineActivity = 'boarding' | 'breeding' | 'lessons' | 'training' | 'events'
export type LocationFlag = 'snow' | 'wildfire' | 'hailWind' | 'earthquake' | 'flood'

export type ProtectionKey =
  | 'farmProperty'
  | 'farmLiability'
  | 'umbrella'
  | 'cropInsurance'
  | 'lrp'
  | 'workersComp'
  | 'businessIncome'
  | 'cyber'
  | 'autoFleet'
  | 'emergencyPlan'
  | 'keyProcedures'
  | 'crossTrained'
  | 'offsiteBackup'
  | 'generator'
  | 'altBuyer'
  | 'altSupplier'
  | 'contactList'
  | 'spokesperson'
  | 'successionPlan'

export type ProtectionStatus = 'have' | 'unsure' | 'none'
export type ReviewRecency = 'within12' | 'longer' | 'never'

export type ThreatCategory =
  | 'price'
  | 'yield'
  | 'personnel'
  | 'facility'
  | 'natural'
  | 'technology'
  | 'social'
  | 'operational'

export type Strategy = 'avoidance' | 'acceptance' | 'transfer' | 'mitigation'

export type Band = 'strong' | 'watch' | 'vulnerable' | 'unscored'
export type ThreatBand = 'immediate' | 'elevated' | 'monitor'

export interface Person {
  id: string
  name: string
  role: string
}

export interface RevenueOp {
  id: string
  name: string
  share: number
  buyer: string
  dependencies: string
  /** enterprise or adjacent key this op was created from, if any */
  sourceKey?: string
}

export interface Profile {
  farmName: string
  farmType: FarmType | null
  enterprises: EnterpriseKey[]
  adjacent: AdjacentKey[]
  acres: number | null
  head: number | null
  state: string
  familyWorkers: number | null
  seasonalEmployees: number | null
  yearRoundEmployees: number | null
  people: Person[]
  revenueOps: RevenueOp[]
  assets: Partial<Record<AssetKey, boolean>>
  /** Section 5 farm-type specifics */
  poultryIntegrator: boolean | null
  equineActivities: EquineActivity[]
  agritourismActivities: string[]
  manureTypes: ManureType[]
  /** Farmer overrides of the location flags derived from state */
  locationOverrides: Partial<Record<LocationFlag, boolean>>
}

export interface Threat {
  id: string
  label: string
  category: ThreatCategory
  probability: number
  severity: number
  source: 'suggested' | 'custom' | 'voice'
  ruleId?: string
}

export interface StrategyEntry {
  strategy: Strategy
  action: string
  involved: string
  informed: string
  notes: string
  /** true while the entry still equals the recommendation; cleared on any farmer edit */
  seeded: boolean
}

export interface Contact {
  id: string
  role: string
  primaryName: string
  primaryPhone: string
  backupName: string
  backupPhone: string
}

export interface TrainingItem {
  id: string
  audience: 'employees' | 'family' | 'everyone'
  topic: string
  when: string
}

export interface Transcript {
  id: string
  step: number
  prompt: string
  text: string
  at: number
}

export interface FarmState {
  version: 2
  step: number
  visited: number[]
  profile: Profile
  protections: Partial<Record<ProtectionKey, ProtectionStatus>>
  insuranceReview: ReviewRecency | null
  quiz: Record<string, number>
  threats: Threat[]
  dismissedRules: string[]
  strategies: Record<string, StrategyEntry>
  contacts: Contact[]
  planHolders: string
  /** Where key documents are stored off-site (severe weather plan tip #5) */
  offsiteDocs: string
  training: TrainingItem[]
  reviewCadence: 'annual' | 'semiannual' | 'quarterly'
  reviewAfterChange: boolean
  nextInsuranceReview: string
  transcripts: Transcript[]
  updatedAt: number | null
  /** Set when the operation step was seeded from the platform's Farm Profile and Financial Analysis. */
  seededFrom?: 'mfp'
}
