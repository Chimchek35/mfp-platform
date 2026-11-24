/**
 * Sections 5 & 7 — farm-type coverage modules, optional endorsements, and line coverages.
 * Each module also generates plain-language questions for the farmer to take to their agent,
 * INCLUDING what the policy does NOT cover (exclusions).
 *
 * Every coverage card in the UI shows COVERAGE_DISCLAIMER.
 */
import type { FarmContext } from '../context'
import type { ProtectionKey } from '../types'
import { FARM_RANCH, rec, type CatalogRecord, type Topic } from './taxonomy'

export const COVERAGE_DISCLAIMER = 'Availability varies by state; subject to deductibles, exclusions and conditions. Confirm with a licensed agent.'

const NW = 'https://www.nationwide.com/business/agribusiness'
const FT = `${NW}/farm-insurance/farm-types`
const OPT = `${NW}/farm-insurance/optional-coverages/`
const OPT_TYPE = `${NW}/farm-insurance/optional-coverages/type`

export const URLS = {
  rowCrop: `${FT}/row-crop`,
  dairy: `${FT}/dairy`,
  cattle: `${FT}/cattle-ranch`,
  poultry: `${FT}/poultry`,
  equine: `${FT}/equine/`,
  agritourism: `${FT}/agritourism`,
  livestock: `${OPT_TYPE}/livestock`,
  hay: `${OPT_TYPE}/hay`,
  atv: `${OPT_TYPE}/atv-utv`,
  drone: `${OPT_TYPE}/drone`,
  optional: OPT,
  workersComp: `${NW}/commercial-insurance/coverages/workers-compensation`,
  cyber: 'https://www.nationwide.com/business/insurance/cyber-liability/',
}

function cv(id: string, title: string, url: string, summary: string, triggers: string[], protection: ProtectionKey | undefined, topic: Topic[] = ['Contracts & liability']): CatalogRecord {
  return rec({
    id,
    title,
    url,
    type: 'coverage_review',
    summary,
    triggers,
    protection,
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic, subtopic: ['Liability & risk transfer'], format: 'Articles' },
  })
}

export const COVERAGE: CatalogRecord[] = [
  // ---------- Farm-type modules ----------
  cv('cv_row_crop', 'Row & specialty crop coverage', URLS.rowCrop, 'Borrowed equipment repair, rental replacement, towing, foreign object, roadbed contact, cab glass and GPS equipment.', ['crops'], 'farmProperty', ['Harvest & machinery safety']),
  cv('cv_crop_ins', 'Crop insurance (Revenue Protection)', URLS.rowCrop, 'Sets a revenue floor if prices or yields fall. Use the in-app calculator to see the gap.', ['crops'], 'cropInsurance'),
  cv('cv_dairy', 'Dairy farm coverage', URLS.dairy, 'Milking equipment breakdown, herd up to $500/head, hay up to $100,000/stack, temperature-sensitive property.', ['dairy'], 'farmProperty', ['Livestock & poultry']),
  cv('cv_dairy_elite', 'Dairy Elite', URLS.dairy, 'Milk, product and animal-health product spoilage; milk contamination & leakage; commingled product liability.', ['dairy', 'milking/refrigeration'], 'farmProperty', ['Livestock & poultry', 'Food & feed safety']),
  cv('cv_cattle', 'Cattle ranch coverage', URLS.cattle, 'Herd up to $1,000/head, hay up to $100,000/stack, animal cruelty defense, pollution liability.', ['cattle'], 'farmProperty', ['Livestock & poultry']),
  cv('cv_lrp', 'Livestock Risk Protection (LRP)', URLS.cattle, 'A price floor on cattle, hogs or lambs you plan to sell. Use the in-app calculator.', ['cattle', 'hogs', 'lambs'], 'lrp', ['Livestock & poultry']),
  cv('cv_livestock', 'Livestock coverage', URLS.livestock, 'Fire, lightning, flood, loading/unloading, collision, electrocution, attack, accidental shooting, earthquake. Not disease or old age.', ['livestock'], 'farmProperty', ['Livestock & poultry']),
  cv('cv_poultry', 'Poultry farm coverage', URLS.poultry, 'Houses, egg and service buildings, ventilation equipment breakdown, disruption of operations.', ['poultry'], 'farmProperty', ['Livestock & poultry']),
  cv('cv_equine', 'Equine farm coverage', URLS.equine, 'Boarding, breeding/stud, care custody & control, exhibitions, riding instruction, training.', ['equine'], 'farmLiability', ['Livestock & poultry']),
  cv('cv_equine_elite', 'Equine Elite', URLS.equine, 'Emergency stabling and transport, employee tack, arena footings, livestock transit, ordinance or law.', ['equine'], 'farmProperty', ['Livestock & poultry']),
  cv('cv_agritourism', 'Agritourism coverage (AgriChoice Plus)', URLS.agritourism, 'Liability for pick-your-own, farm stands, corn mazes, on-premises hay rides, petting zoos and festivals.', ['agritourism', 'visitors'], 'farmLiability'),
  cv('cv_hay', 'Hay coverage', URLS.hay, 'Up to $100,000 per stack, including spontaneous combustion.', ['hay storage'], 'farmProperty', ['Fires & explosions']),
  cv('cv_atv', 'ATV / UTV coverage', URLS.atv, 'Coverage for farm ATVs and UTVs. Road-licensed units may need commercial auto or an RV policy.', ['ATVs/UTVs'], 'farmLiability', ['Harvest & machinery safety']),
  cv('cv_drone', 'Drone coverage', URLS.drone, 'Damage and liability coverage for farm drones.', ['drones'], 'farmLiability'),
  cv('cv_workers_comp', "Workers' compensation", URLS.workersComp, 'Medical bills and lost wages for employees hurt on the job.', ['hired employees'], 'workersComp', ['Employee health & workplace safety']),
  cv('cv_cyber', 'Cyber liability', URLS.cyber, 'Recovery costs after a data breach, ransomware or cyber fraud.', ['computer records', 'precision ag', 'GPS', 'cameras'], 'cyber'),
  cv('cv_liability', 'Farm liability & umbrella', OPT, 'Liability if someone is hurt or property is damaged because of your farm; umbrella adds higher limits.', ['visitors', 'trucks on roads', 'custom work'], 'farmLiability'),
  cv('cv_auto', 'Farm truck, auto & fleet', OPT, 'Line coverage for farm trucks, autos and tractors on the road.', ['trucks on roads'], 'autoFleet', ['Driver & vehicle safety']),
  cv('cv_pollution', 'Pollution liability', URLS.cattle, 'Overspray, tank damage, off-premises transport and government-ordered cleanup.', ['manure storage', 'chemical storage', 'fuel storage'], 'farmLiability', ['Hazardous materials']),
  cv('cv_commercial', 'Commercial agribusiness coverage', OPT, 'Business auto/fleet, agribusiness property, crime, general liability, umbrella, workers’ comp, business income, cyber, surety bonds.', ['commercial ag business', 'custom work', 'grain handling for others'], 'businessIncome'),
  cv('cv_crime', 'Crime coverage', OPT, 'Theft of equipment, fuel, chemicals or money.', ['remote buildings', 'theft'], 'farmProperty'),

  // ---------- Optional endorsements (Section 7) ----------
  cv('cv_disruption', 'Disruption of farming operations', OPT, 'Helps replace lost income while a covered loss is repaired.', ['livestock barns', 'dairy', 'poultry'], 'businessIncome'),
  cv('cv_identity_fraud', 'Identity fraud expense (up to $25,000)', OPT, 'Costs to recover from identity theft.', ['computer records'], 'cyber'),
  cv('cv_earthquake', 'Earthquake endorsement', OPT, 'Earthquake damage is usually excluded unless added.', ['earthquake zone'], 'farmProperty', ['Weather & environment']),
  cv('cv_machinery_rc', 'Farm machinery & equipment replacement cost', OPT, 'Replacement cost (not depreciated value) for machinery up to 5 years old.', ['combine', 'harvest equipment'], 'farmProperty', ['Harvest & machinery safety']),
  cv('cv_peak_season', 'Peak season (harvest inventory)', OPT, 'Higher limits on grain and harvested product while your bins are full.', ['grain bins', 'harvest'], 'farmProperty', ['Grain operations safety']),
  cv('cv_sewer_sump', 'Sewer / sump pump backup', OPT, 'Water backup through drains or a failed sump is often excluded unless added.', ['flood', 'sump pumps'], 'farmProperty', ['Weather & environment']),
  cv('cv_temp_sensitive', 'Temperature-sensitive property', OPT, 'Spoilage of milk, product or medicine when refrigeration or power fails.', ['milking/refrigeration'], 'farmProperty', ['Food & feed safety']),
  cv('cv_property_plus', 'Farm property protection plus', OPT, 'Higher contents limits, including firearms and GPS units.', ['GPS equipment'], 'farmProperty'),
  cv('cv_agrichoice_elite', 'AgriChoice Elite', OPT, 'Higher limits for certain losses to equipment, buildings, livestock and products.', ['larger operations'], 'farmProperty'),
]

/* ---------------------------------------------------------------------------------------------
 * Agent questions — generated from the farm-type modules and endorsements.
 * --------------------------------------------------------------------------------------------- */

export interface AgentQuestion {
  id: string
  text: string
  /** Catalog record the question comes from. */
  recordId: string
  /** True when the question is about something the policy does NOT cover. */
  exclusion?: boolean
}

interface CoverageModule {
  id: string
  label: string
  appliesWhen: (c: FarmContext) => boolean
  questions: (c: FarmContext) => Omit<AgentQuestion, 'id'>[]
}

const animalsLabel = (c: FarmContext) =>
  c.hasEnterprise('dairyHerd') ? 'dairy cows' : c.hasEnterprise('cowCalf', 'feedlot') ? 'cattle' : c.hasEnterprise('horses') ? 'horses' : 'animals'

export const COVERAGE_MODULES: CoverageModule[] = [
  {
    id: 'row_crop',
    label: 'Row & specialty crop',
    appliesWhen: (c) => c.crops || c.farmType === 'rowCrop' || c.farmType === 'specialtyCrop',
    questions: (c) => [
      { text: 'Does my policy cover repairs to borrowed equipment and a rental replacement if my combine or planter is down at peak season?', recordId: 'cv_row_crop' },
      { text: 'Am I covered for towing/hitching, foreign-object damage, roadbed or ground contact, and cab glass (with no deductible)?', recordId: 'cv_row_crop' },
      ...(c.has('gpsEquipment') ? [{ text: 'Is my GPS guidance equipment covered when it’s moved between machines?', recordId: 'cv_row_crop' }] : []),
      { text: 'Should I add machinery replacement cost (equipment up to 5 years old) and peak season coverage for harvest inventory?', recordId: 'cv_machinery_rc' },
    ],
  },
  {
    id: 'dairy',
    label: 'Dairy',
    appliesWhen: (c) => c.farmType === 'dairy' || c.hasEnterprise('dairyHerd'),
    questions: () => [
      { text: 'Disease, old age and natural causes aren’t covered by my farm policy — should I buy mortality insurance from another insurer?', recordId: 'cv_dairy', exclusion: true },
      { text: 'Would Dairy Elite cover milk spoilage, milk contamination & leakage, and commingled product liability?', recordId: 'cv_dairy_elite' },
      { text: 'Is herd coverage of up to $500/head at no extra cost enough for my best cows, or do I need to schedule them?', recordId: 'cv_dairy' },
      { text: 'Does breakdown of my milking equipment have its own coverage?', recordId: 'cv_dairy' },
      { text: 'Dairy auto is separate — are my milk and cattle trucks on the right policy?', recordId: 'cv_auto', exclusion: true },
    ],
  },
  {
    id: 'cattle',
    label: 'Cattle ranch',
    appliesWhen: (c) => c.farmType === 'beef' || c.hasEnterprise('cowCalf', 'feedlot'),
    questions: () => [
      { text: 'Is herd coverage of up to $1,000/head at no extra cost enough, or should I schedule registered animals?', recordId: 'cv_cattle' },
      { text: 'Does my pollution liability cover overspray, tank damage, off-premises transport and government-ordered cleanup?', recordId: 'cv_pollution' },
      { text: 'Do I have animal cruelty defense coverage in my state?', recordId: 'cv_cattle' },
    ],
  },
  {
    id: 'livestock',
    label: 'Livestock (all species)',
    appliesWhen: (c) => c.livestock,
    questions: (c) => [
      { text: `Disease, old age and natural causes aren’t covered for my ${animalsLabel(c)} — should I ask about mortality insurance from another insurer?`, recordId: 'cv_livestock', exclusion: true },
      { text: 'How soon do I have to report newly acquired animals for them to be covered?', recordId: 'cv_livestock' },
      ...(c.hasEnterprise('smallRuminants') ? [{ text: 'Dog and wild-animal attack coverage doesn’t include sheep — how do I protect my flock?', recordId: 'cv_livestock', exclusion: true }] : []),
      { text: 'Should my livestock be insured individually, on a blanket basis, or as a herd?', recordId: 'cv_livestock' },
    ],
  },
  {
    id: 'poultry',
    label: 'Poultry',
    appliesWhen: (c) => c.farmType === 'poultry' || c.hasEnterprise('poultryFlock'),
    questions: (c) => [
      ...(c.integrator
        ? [
            { text: 'The integrator owns the birds and typically insures them — can I get in writing what they insure and what I’m responsible for?', recordId: 'cv_poultry', exclusion: true },
            { text: 'If the integrator ends my contract, what happens to my building loans and what coverage would still apply?', recordId: 'cv_poultry' },
          ]
        : [{ text: 'I own my birds — how are they insured, and are disease losses excluded?', recordId: 'cv_poultry', exclusion: true }]),
      { text: 'Does equipment breakdown cover my ventilation fans, controllers and house equipment?', recordId: 'cv_poultry' },
      { text: 'Do I have disruption of operations coverage if a house is down after a covered loss?', recordId: 'cv_disruption' },
    ],
  },
  {
    id: 'equine',
    label: 'Equine',
    appliesWhen: (c) => c.farmType === 'equine' || c.hasEnterprise('horses'),
    questions: (c) => [
      ...(c.equine('boarding') ? [{ text: 'I board horses — does care, custody & control coverage cover the full value of horses owned by others?', recordId: 'cv_equine', exclusion: true }] : []),
      ...(c.equine('breeding') ? [{ text: 'Do I need breeding/stud coverage for my breeding operation?', recordId: 'cv_equine' }] : []),
      ...(c.equine('lessons') ? [{ text: 'Does riding instruction coverage include on-premises trail rides?', recordId: 'cv_equine' }] : []),
      ...(c.equine('training') ? [{ text: 'Am I covered when training horses owned by clients?', recordId: 'cv_equine' }] : []),
      ...(c.equine('events') ? [{ text: 'Do I need on-premises exhibition coverage for the shows or clinics I host?', recordId: 'cv_equine' }] : []),
      { text: 'Newly acquired horses are covered at 25% of the limit for 30 days — how do I add them in time?', recordId: 'cv_equine' },
      { text: 'Would Equine Elite (emergency stabling & transport, employee tack, arena footings, livestock transit) fit my operation?', recordId: 'cv_equine_elite' },
    ],
  },
  {
    id: 'agritourism',
    label: 'Agritourism',
    appliesWhen: (c) => c.hasAdjacent('agritourism'),
    questions: (c) => [
      { text: 'I’m running agritourism — do I need AgriChoice Plus, and what did I need to tell you before starting?', recordId: 'cv_agritourism' },
      ...(c.notInsurableAgri.length
        ? [{ text: `${c.notInsurableAgri.join(', ')} ${c.notInsurableAgri.length === 1 ? 'is' : 'are'} NOT insurable under the agritourism program — how should I handle ${c.notInsurableAgri.length === 1 ? 'it' : 'them'}, or should I stop?`, recordId: 'cv_agritourism', exclusion: true }]
        : []),
      { text: 'Do my liability limits and an umbrella fit the number of guests I expect on my busiest day?', recordId: 'cv_liability' },
    ],
  },
  {
    id: 'hay',
    label: 'Hay',
    appliesWhen: (c) => c.has('hayStorage') || c.hasEnterprise('hay'),
    questions: () => [{ text: 'Is my hay covered up to $100,000 per stack, including spontaneous combustion — and are my stacks under that value?', recordId: 'cv_hay' }],
  },
  {
    id: 'commercial',
    label: 'Commercial exposure',
    appliesWhen: (c) => c.farmType === 'agribusiness' || c.hasAdjacent('customHauling', 'customHarvest', 'grainHandling', 'agService', 'fuelDistribution', 'processing'),
    questions: (c) => [
      { text: `My side business (${c.adjacentNames || 'commercial work'}) may fall outside my farm policy — which commercial coverages do I need (business auto, general liability, crime, surety bonds)?`, recordId: 'cv_commercial', exclusion: true },
    ],
  },
]

interface EndorsementQuestion {
  id: string
  when: (c: FarmContext) => boolean
  text: (c: FarmContext) => string
  recordId: string
  exclusion?: boolean
}

export const ENDORSEMENT_QUESTIONS: EndorsementQuestion[] = [
  { id: 'eq_earthquake', when: (c) => c.loc.earthquake, text: () => 'Earthquake damage is usually excluded — should I add the earthquake endorsement?', recordId: 'cv_earthquake', exclusion: true },
  { id: 'eq_sewer', when: (c) => c.loc.flood || c.has('sumpPumps'), text: () => 'Sewer or sump-pump backup is often excluded — should I add that endorsement? And is flood covered at all?', recordId: 'cv_sewer_sump', exclusion: true },
  { id: 'eq_temp', when: (c) => c.has('milkingRefrigeration'), text: () => 'If the power or refrigeration fails, is spoiled milk or product covered (temperature-sensitive endorsement)?', recordId: 'cv_temp_sensitive' },
  { id: 'eq_disruption', when: (c) => c.has('livestockBarns') || c.hasEnterprise('dairyHerd', 'poultryFlock', 'hogs'), text: () => 'Do I have disruption of farming operations coverage for income lost while a barn is rebuilt?', recordId: 'cv_disruption' },
  { id: 'eq_identity', when: (c) => c.has('computerRecords'), text: () => 'Does my policy include identity fraud expense (up to $25,000), and do I need separate cyber liability?', recordId: 'cv_identity_fraud' },
  { id: 'eq_property_plus', when: (c) => c.has('gpsEquipment'), text: () => 'Are my contents limits high enough for GPS units and other high-value items (farm property protection plus)?', recordId: 'cv_property_plus' },
  { id: 'eq_peak', when: (c) => c.has('grainBins'), text: () => 'Is my stored grain covered at full value when bins are full at harvest (peak season)?', recordId: 'cv_peak_season' },
  { id: 'eq_atv_road', when: (c) => c.has('atvs'), text: () => 'Are any of my ATVs/UTVs road-licensed? Those may need commercial auto or an RV policy instead.', recordId: 'cv_atv', exclusion: true },
  { id: 'eq_drone', when: (c) => c.has('drones'), text: () => 'Is my drone covered for damage and liability, or do I need drone coverage?', recordId: 'cv_drone' },
  { id: 'eq_wc', when: (c) => c.employees > 0 || c.has('minors'), text: (c) => `I have ${c.employees || 'some'} hired worker${c.employees === 1 ? '' : 's'}${c.has('minors') ? ', including minors' : ''} — is everyone covered by workers’ comp, including seasonal help?`, recordId: 'cv_workers_comp' },
  { id: 'eq_custom', when: (c) => c.has('customWork') || c.has('contractors'), text: () => 'Is custom work I do for others covered, and do contractors on my farm need to name me on their insurance?', recordId: 'cv_liability', exclusion: true },
  { id: 'eq_pollution', when: (c) => c.has('manurePits') || c.has('chemicalStorage'), text: () => 'Many policies limit pollution coverage — would a manure or chemical spill cleanup be covered?', recordId: 'cv_pollution', exclusion: true },
]

export function agentQuestions(c: FarmContext): { module: string; questions: AgentQuestion[] }[] {
  const groups: { module: string; questions: AgentQuestion[] }[] = []
  for (const m of COVERAGE_MODULES) {
    if (!m.appliesWhen(c)) continue
    groups.push({ module: m.label, questions: m.questions(c).map((q, i) => ({ ...q, id: `${m.id}-${i}` })) })
  }
  const endorsements = ENDORSEMENT_QUESTIONS.filter((q) => q.when(c)).map((q) => ({ id: q.id, text: q.text(c), recordId: q.recordId, exclusion: q.exclusion }))
  if (endorsements.length) groups.push({ module: 'Endorsements & add-ons', questions: endorsements })
  return groups
}
