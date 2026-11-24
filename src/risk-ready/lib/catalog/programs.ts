/**
 * Section 3 — Nationwide safety programs, their supporting pages, and in-app teaching sheets.
 * URLs are copied from nationwide-risk-catalog.md only.
 */
import { FARM_RANCH, rec, type CatalogRecord } from './taxonomy'

const NW = 'https://www.nationwide.com'
const SRM = `${NW}/business/agribusiness/safety-risk-management`
const LIB = `${SRM}/resource-library/articles`
const LC = `${NW}/lc/resources/farm-and-agribusiness/articles`
const SA = `${NW}/staticassets`

export const PROGRAMS: CatalogRecord[] = [
  // ---------- 3.1 Drive the 5 ----------
  rec({
    id: 'p_drive5',
    title: 'Drive the 5 — driver & vehicle safety',
    url: `${SRM}/safety-programs/driver-vehicle-safety/`,
    type: 'program',
    summary: 'Five habits for everyone who drives farm trucks or moves equipment on roads, with toolbox talks, driver action cards and videos.',
    triggers: ['trucks on roads', 'equipment moved on roads', 'hired drivers', 'custom hauling'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Driver & vehicle safety'], subtopic: ['Safe operating procedures', 'Substance use & impairment risk'], format: 'Programs' },
    sheet: 'drive5',
  }),
  rec({
    id: 'r_drive5_flyer',
    title: 'Drive the 5 program flyer',
    url: `${SA}/agrm-GCO-0788AO-Drivethe5-program-flyer_tcm108-96022.pdf`,
    type: 'checklist',
    summary: 'One-page overview of the five principles to post in the shop or truck.',
    triggers: ['trucks on roads'],
    readinessCategory: 'communicating',
    taxonomy: { industry: FARM_RANCH, topic: ['Driver & vehicle safety'], subtopic: ['Safe operating procedures'], format: 'Safety tips and guides' },
  }),
  rec({
    id: 'r_rules_road',
    title: 'Rules of the road',
    url: `${SRM}/safety-programs/driver-vehicle-safety/rules-of-the-road/`,
    type: 'program',
    summary: 'Regulations and good practice for farm vehicles on public roads.',
    triggers: ['trucks on roads', 'equipment moved on roads'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Driver & vehicle safety'], subtopic: ['Regulatory compliance & standards'], format: 'Programs' },
  }),
  rec({
    id: 'r_driver_tech',
    title: 'Driver safety technology resources',
    url: `${SRM}/safety-programs/driver-vehicle-safety/technology-resources/`,
    type: 'program',
    summary: 'Telematics, dash cams and driver monitoring tools that support Drive the 5.',
    triggers: ['fleet', 'hired drivers'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Driver & vehicle safety'], subtopic: ['Technology & monitoring systems'], format: 'Tools and fact finders' },
  }),
  rec({
    id: 'r_rural_roads',
    title: 'The importance of rural road safety',
    url: `${LIB}/importance-of-rural-road-safety`,
    type: 'tip',
    summary: 'Why rural roads are disproportionately dangerous and what drivers can do about it.',
    triggers: ['trucks on roads'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: ['Driver & vehicle safety'], subtopic: ['Hazards & risks'], format: 'Articles' },
  }),
  rec({
    id: 'r_ag_equip_roads',
    title: 'Ag equipment safety on rural roads',
    url: `${LIB}/ag-equipment-safety-on-rural-roads`,
    type: 'tip',
    summary: 'Lighting, marking, escort and timing for moving equipment on public roads.',
    triggers: ['equipment moved on roads'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Driver & vehicle safety', 'Harvest & machinery safety'], subtopic: ['ATV/UTV & ag equipment operation', 'Safe operating procedures'], format: 'Articles' },
  }),

  // ---------- 3.2 Every STEP Counts ----------
  rec({
    id: 'p_every_step',
    title: 'Every STEP Counts — worker safety',
    url: `${SRM}/safety-programs/worker-safety/`,
    type: 'program',
    summary: 'Four sections — Selection, Training, Events, Post-event — for hiring, training and handling injuries. Use them in any order.',
    triggers: ['hired employees', 'seasonal employees', 'minors employed', 'contractors'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Employee health & workplace safety'], subtopic: ['Safe operating procedures', 'Incident reporting & investigation'], format: 'Programs' },
    sheet: 'every_step',
  }),
  rec({
    id: 'r_worker_quiz',
    title: 'Worker safety quiz',
    url: `${NW}/cps/worker-safety-quiz.html`,
    type: 'tip',
    summary: 'A quick self-check on how your worker safety practices stack up.',
    triggers: ['hired employees'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: ['Employee health & workplace safety'], subtopic: ['Hazards & risks'], format: 'Tools and fact finders' },
  }),
  rec({
    id: 'r_worker_article',
    title: 'Enhancing worker safety',
    url: `${LIB}/enhancing-worker-safety`,
    type: 'tip',
    summary: 'Practical ways to build a safety culture with a small farm crew, including guidelines for employing minors.',
    triggers: ['hired employees', 'minors employed'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Employee health & workplace safety'], subtopic: ['Regulatory compliance & standards', 'Safe operating procedures'], format: 'Articles' },
  }),

  // ---------- 3.3 Grain safety ----------
  rec({
    id: 'p_grain',
    title: 'Grain safety program',
    url: `${SRM}/safety-programs/grain-safety/`,
    type: 'program',
    summary: 'Three pillars: safe grain structures, responsible commodity management, and bin-entry procedures.',
    triggers: ['grain bins', 'grain handling'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Grain operations safety'], subtopic: ['Grain bin safety', 'Grain/commodity management', 'Grain/commodity structures'], format: 'Programs' },
    sheet: 'grain',
  }),
  rec({
    id: 'p_gbsw',
    title: 'Grain Bin Safety Week',
    url: `${SRM}/safety-programs/grain-safety/grain-bin-safety-week/`,
    type: 'program',
    summary: 'Third full week of February. Goal: zero lives lost. Rescue tubes and first-responder training for rural fire departments.',
    triggers: ['grain bins'],
    readinessCategory: 'contingency',
    taxonomy: { industry: FARM_RANCH, topic: ['Grain operations safety'], subtopic: ['Grain bin safety', 'Emergency preparedness & response'], format: 'Programs' },
    sheet: 'grain',
  }),
  rec({
    id: 'r_grain_fire',
    title: 'Grain fire management',
    url: `${LIB}/grain-fire-management`,
    type: 'tip',
    summary: 'How grain fires start in bins and dryers, and how to respond without making it worse.',
    triggers: ['grain bins', 'grain dryer'],
    readinessCategory: 'contingency',
    taxonomy: { industry: FARM_RANCH, topic: ['Grain operations safety', 'Fires & explosions'], subtopic: ['Emergency preparedness & response'], format: 'Articles' },
  }),
  rec({
    id: 'r_spontaneous',
    title: 'Preventing spontaneous combustion (grain, hay, nut hulls)',
    url: `${LIB}/preventing-spontaneous-combustion`,
    type: 'tip',
    summary: 'Moisture and heat build-up can ignite stored hay or grain with no outside spark. Know the warning temperatures.',
    triggers: ['hay storage', 'grain bins'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Fires & explosions', 'Grain operations safety'], subtopic: ['Hazards & risks', 'Inspections & maintenance'], format: 'Articles' },
  }),
  rec({
    id: 'r_bucket_elevator',
    title: 'Bucket elevators & combustible dust',
    url: `${SA}/agrm-GCO-1241AO_BucketElevatorsCombustDust_tcm108-108469.pdf`,
    type: 'checklist',
    summary: 'Controls that keep a bucket elevator from becoming a dust-explosion source.',
    triggers: ['bucket elevator', 'grain handling'],
    readinessCategory: 'managing',
    taxonomy: { industry: ['Farm & ranch', 'Traditional agribusiness'], topic: ['Grain operations safety', 'Fires & explosions'], subtopic: ['Engineering & structural controls'], format: 'Technical bulletins' },
  }),

  // ---------- 3.4 Let's Champion Rider Safety ----------
  rec({
    id: 'p_rider',
    title: "Let's Champion Rider Safety — ATV/UTV",
    url: `${LC}/atv-utv-safety-tips`,
    type: 'program',
    summary: 'Seven rider-safety tips for every ATV and UTV on the farm, with extra care for riders under 16.',
    triggers: ['ATVs/UTVs', 'youth riders'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Harvest & machinery safety'], subtopic: ['ATV/UTV & ag equipment operation', 'PPE'], format: 'Programs' },
    sheet: 'rider',
  }),
  rec({
    id: 'r_atv_rules',
    title: 'ATV/UTV safety rules (PDF)',
    url: `${SA}/agrm-GCO-1101AO_ATV-UTV_SafetyRules_tcm108-103185.pdf`,
    type: 'checklist',
    summary: 'Printable rider rules to post where machines are parked.',
    triggers: ['ATVs/UTVs'],
    readinessCategory: 'communicating',
    taxonomy: { industry: FARM_RANCH, topic: ['Harvest & machinery safety'], subtopic: ['ATV/UTV & ag equipment operation'], format: 'Checklists and forms' },
  }),
  rec({
    id: 'r_atv_toolkit',
    title: 'ATV/UTV safety campaign toolkit',
    url: `${SA}/GCO-0718M1-atv-utv-safety-campaign-toolkit-advocate_tcm108-103115.pdf`,
    type: 'checklist',
    summary: 'Materials for sharing rider safety with family, 4-H or FFA groups.',
    triggers: ['ATVs/UTVs'],
    readinessCategory: 'communicating',
    taxonomy: { industry: FARM_RANCH, topic: ['Harvest & machinery safety'], subtopic: ['ATV/UTV & ag equipment operation'], format: 'Safety tips and guides' },
  }),
  rec({
    id: 'r_atv_vr',
    title: "Let's Champion Rider Safety VR experience",
    url: `${LC}/lets-champion-rider-safety-vr-experience`,
    type: 'training',
    summary: 'A virtual-reality rider safety experience.',
    triggers: ['ATVs/UTVs'],
    readinessCategory: 'communicating',
    taxonomy: { industry: FARM_RANCH, topic: ['Harvest & machinery safety'], subtopic: ['ATV/UTV & ag equipment operation'], format: 'Videos and training' },
  }),
  rec({
    id: 'r_atv_pillars',
    title: 'Three pillars of ATV/UTV safety',
    url: `${LC}/three-pillars-of-atv-utv-safety`,
    type: 'tip',
    summary: 'The rider, the machine and the environment.',
    triggers: ['ATVs/UTVs'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: ['Harvest & machinery safety'], subtopic: ['ATV/UTV & ag equipment operation', 'Hazards & risks'], format: 'Articles' },
  }),
  rec({
    id: 'r_atv_youth',
    title: 'ATV/UTV youth safety',
    url: `${LC}/atv-utv-youth-safety`,
    type: 'tip',
    summary: 'Matching machines to age and supervising young riders.',
    triggers: ['youth riders', 'minors employed'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Harvest & machinery safety', 'Employee health & workplace safety'], subtopic: ['ATV/UTV & ag equipment operation'], format: 'Articles' },
  }),

  // ---------- 3.5 Property Risk Solutions hub ----------
  rec({
    id: 'p_prs',
    title: 'Property Risk Solutions',
    url: `${SRM}/safety-programs/property-risk-solutions/`,
    type: 'program',
    summary: 'Nationwide’s hub of property checklists: buildings & materials, fire hazards, fire protection, weather, and maintenance.',
    triggers: ['any buildings'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: ['Property & structural protection', 'Fires & explosions'], subtopic: ['Inspections & maintenance'], format: 'Programs' },
  }),
  rec({
    id: 'r_prs_flyer',
    title: 'Property Risk Solutions overview flyer',
    url: `${SA}/GPO-0796AO_Overview-flier_tcm108-109400.pdf`,
    type: 'checklist',
    summary: 'A one-page overview of the Property Risk Solutions topic areas.',
    triggers: ['any buildings'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: ['Property & structural protection'], subtopic: ['Hazards & risks'], format: 'Safety tips and guides' },
  }),

  // ---------- 3.6 Manure pit safety ----------
  rec({
    id: 'p_manure',
    title: 'Manure pit safety',
    url: `${LC}/manure-pit-safety`,
    type: 'program',
    summary: 'Five dangerous gases, the symptoms to watch for, what a written plan needs, and the three highest-hazard jobs.',
    triggers: ['manure storage', 'confined spaces'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Confined spaces', 'Livestock & poultry', 'Hazardous materials'], subtopic: ['PPE', 'Safe operating procedures'], format: 'Programs' },
    sheet: 'manure',
  }),
  rec({
    id: 'r_necas',
    title: 'NECAS manure pit rescue training',
    url: `${LC}/manure-pit-safety-training`,
    type: 'training',
    summary: 'Rescue training for manure storage emergencies — for your crew and local first responders.',
    triggers: ['manure storage'],
    readinessCategory: 'contingency',
    taxonomy: { industry: FARM_RANCH, topic: ['Confined spaces'], subtopic: ['Emergency preparedness & response'], format: 'Videos and training' },
  }),
  rec({
    id: 't_manure_foam',
    title: 'Never go near a foaming manure pit',
    url: `${LC}/manure-pit-safety`,
    type: 'tip',
    summary: 'Methane in foam can reach about 70% at the surface. Stay away — no flames, no sparks — until the foam is gone.',
    triggers: ['manure storage'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Confined spaces', 'Fires & explosions'], subtopic: ['Hazards & risks'], format: 'Safety tips and guides' },
    sheet: 'manure',
  }),

  // ---------- 3.7 Severe weather / emergency plan tips (universal) ----------
  rec({
    id: 't_severe_weather',
    title: 'Severe weather plan tips',
    url: `${LC}/severe-weather-threatening-farms`,
    type: 'tip',
    summary: 'Farm map with escape routes, salvage and debris plan, emergency contact list, inventory system, and off-site document storage.',
    triggers: ['every farm'],
    readinessCategory: 'contingency',
    taxonomy: { industry: FARM_RANCH, topic: ['Weather & environment'], subtopic: ['Emergency preparedness & response'], format: 'Safety tips and guides' },
    universal: true,
    sheet: 'severe_weather',
  }),

  // ---------- 2.3 Training ----------
  rec({
    id: 'tr_training',
    title: 'Customer training: webinars, on-demand video & courses',
    url: `${SRM}/training/`,
    type: 'training',
    summary: 'Farm safety, rural road safety and worker safety training for customers.',
    triggers: ['hired employees', 'family workers', 'trucks on roads'],
    readinessCategory: 'communicating',
    taxonomy: { industry: FARM_RANCH, topic: ['Employee health & workplace safety', 'Driver & vehicle safety'], subtopic: ['Safe operating procedures'], format: 'Videos and training' },
  }),

  // ---------- 2.4 Succession ----------
  rec({
    id: 'p_legacy',
    title: 'Land As Your Legacy — farm succession',
    url: `${NW}/business/agribusiness/farm-insurance/ag-financial/farm-succession/`,
    type: 'program',
    summary: 'Step-by-step help planning who runs and owns the farm next.',
    triggers: ['no succession plan'],
    readinessCategory: 'contingency',
    taxonomy: { industry: FARM_RANCH, topic: ['Contracts & liability'], subtopic: ['Liability & risk transfer'], format: 'Programs' },
  }),
  rec({
    id: 'r_ag_financial',
    title: 'Ag financial services',
    url: `${NW}/business/agribusiness/farm-insurance/ag-financial/`,
    type: 'program',
    summary: 'Financial planning for farm families alongside succession.',
    triggers: ['no succession plan'],
    readinessCategory: 'contingency',
    taxonomy: { industry: FARM_RANCH, topic: ['Contracts & liability'], subtopic: ['Liability & risk transfer'], format: 'Programs' },
  }),
  rec({
    id: 'r_library',
    title: 'Safety & risk resource library',
    url: `${SRM}/resource-library/`,
    type: 'tip',
    summary: 'Nationwide’s full library of articles, checklists, toolbox talks and videos.',
    triggers: ['every farm'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: [], subtopic: [], format: 'Articles' },
  }),
  rec({
    id: 'r_contract_transfer',
    title: 'Why contracts are important (contractual risk transfer)',
    url: `${LIB}/contractual-risk-transfer`,
    type: 'tip',
    summary: 'Use written agreements with indemnity and insurance language to put risk where it belongs.',
    triggers: ['contractors', 'custom work', 'contracts'],
    readinessCategory: 'managing',
    taxonomy: { industry: ['Farm & ranch', 'Traditional agribusiness'], topic: ['Contracts & liability'], subtopic: ['Liability & risk transfer'], format: 'Articles' },
  }),
  rec({
    id: 'r_agritourism_article',
    title: 'How to manage the risks and benefits of agritourism',
    url: `${LC}/how-to-manage-the-risks-and-benefits-of-agritourism`,
    type: 'tip',
    summary: 'Guest safety, signage, waivers and what to tell your agent before you open.',
    triggers: ['agritourism', 'visitors'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: ['Contracts & liability'], subtopic: ['Hazards & risks', 'Liability & risk transfer'], format: 'Articles' },
  }),
]

/* ---------------------------------------------------------------------------------------------
 * Teaching sheets — the program principles shown in the app (not just links).
 * --------------------------------------------------------------------------------------------- */

export interface SheetSection {
  heading: string
  /** Optional big letter/number marker for acronym programs (D-R-I-V-E, S-T-E-P). */
  items: { marker?: string; term: string; text?: string }[]
}

export interface ProgramSheet {
  id: string
  title: string
  intro: string
  sections: SheetSection[]
  /** Catalog record ids linked at the bottom of the sheet. */
  links: string[]
}

export const PROGRAM_SHEETS: Record<string, ProgramSheet> = {
  drive5: {
    id: 'drive5',
    title: 'Drive the 5',
    intro: 'Five habits for every driver on the farm. Each principle comes with toolbox talks, driver action cards and videos — use one per week before harvest.',
    sections: [
      {
        heading: 'The five principles',
        items: [
          { marker: 'D', term: 'Distraction free', text: 'Phone down, radio set before you roll. Eyes on the road, not the monitor.' },
          { marker: 'R', term: 'Rested and alert', text: 'Long harvest days cause crashes. Set a hard stop and swap drivers.' },
          { marker: 'I', term: 'Impairment free', text: 'No alcohol, drugs or medications that cause drowsiness behind the wheel.' },
          { marker: 'V', term: 'Vehicle maintained', text: 'Brakes, tires, lights and SMV emblems checked before every season.' },
          { marker: 'E', term: 'Environment aware', text: 'Weather, hills, narrow bridges, school buses and traffic at shift change.' },
        ],
      },
    ],
    links: ['p_drive5', 'r_drive5_flyer', 'r_rules_road', 'r_ag_equip_roads', 'r_driver_tech'],
  },
  every_step: {
    id: 'every_step',
    title: 'Every STEP Counts',
    intro: 'A worker-safety framework in four sections. Start with whichever one you need most — they work in any order.',
    sections: [
      {
        heading: 'The four sections',
        items: [
          { marker: 'S', term: 'Selection & orientation', text: 'Hire for the job, then show every new worker the hazards and rules on day one.' },
          { marker: 'T', term: 'Training & safety programs', text: 'Short, regular training on the jobs that hurt people — and written down.' },
          { marker: 'E', term: 'Events & losses', text: 'When someone is hurt or nearly hurt, report it and record what happened.' },
          { marker: 'P', term: 'Post-event understanding & actions', text: 'Find the cause, fix it, and bring the worker back with a return-to-work plan.' },
        ],
      },
      {
        heading: 'If you employ minors',
        items: [{ term: 'Check age requirements and hazardous-occupation restrictions', text: 'Some farm jobs are off-limits to workers under 16 unless they are your own children.' }],
      },
    ],
    links: ['p_every_step', 'r_worker_quiz', 'r_worker_article', 'cv_workers_comp'],
  },
  grain: {
    id: 'grain',
    title: 'Grain safety',
    intro: 'Most grain entrapments happen to experienced people working alone. Three pillars prevent nearly all of them.',
    sections: [
      {
        heading: 'Three pillars',
        items: [
          { marker: '1', term: 'Maintain safe grain structures', text: 'Inspect walls, anchors, ladders and roof vents before filling.' },
          { marker: '2', term: 'Responsible commodity management', text: 'Store grain dry and cool so it doesn’t crust, bridge or spoil — the conditions that lead to entry.' },
          { marker: '3', term: 'Follow bin-entry procedures', text: 'Enter only when absolutely necessary: lock out augers, harness and lifeline, an observer outside.' },
        ],
      },
      {
        heading: 'Grain Bin Safety Week',
        items: [{ term: 'Third full week of February', text: 'Goal: zero lives lost. Nationwide and partners donate rescue tubes and first-responder training to rural fire departments.' }],
      },
      {
        heading: 'BinStrong',
        items: [{ term: 'Rebuild stronger', text: 'When replacing a damaged bin, choose a higher wind-speed-rated structure.' }],
      },
    ],
    links: ['p_grain', 'p_gbsw', 'r_spontaneous', 'r_grain_fire', 'r_bucket_elevator'],
  },
  rider: {
    id: 'rider',
    title: "Let's Champion Rider Safety",
    intro: '632 off-highway-vehicle operators died in preventable accidents in 2024; 119 were under 16 (Consumer Federation of America, cited by Nationwide). Seven tips for every rider:',
    sections: [
      {
        heading: 'Seven tips',
        items: [
          { marker: '1', term: 'Ride designated trails only' },
          { marker: '2', term: 'Avoid paved roads', text: 'ATV tires are not made for pavement and handle unpredictably.' },
          { marker: '3', term: 'Dress for the ride', text: 'Helmet, eye protection, long sleeves, gloves and boots.' },
          { marker: '4', term: 'Match the vehicle to the rider’s age and size' },
          { marker: '5', term: 'Supervise riders under 16' },
          { marker: '6', term: 'Never carry more riders than it was designed for' },
          { marker: '7', term: 'Take a hands-on safety course' },
        ],
      },
    ],
    links: ['p_rider', 'r_atv_rules', 'r_atv_youth', 'r_atv_vr', 'cv_atv'],
  },
  manure: {
    id: 'manure',
    title: 'Manure pit safety',
    intro: 'Enclosed pits, above- or below-ground tanks, and lagoons all release gases that can kill in minutes — and would-be rescuers often become victims.',
    sections: [
      {
        heading: 'Five gases',
        items: [{ term: 'Hydrogen sulfide' }, { term: 'Carbon dioxide' }, { term: 'Ammonia' }, { term: 'Carbon monoxide' }, { term: 'Methane' }],
      },
      {
        heading: 'Symptoms — get out and get fresh air',
        items: [
          { term: 'Eye, nose or throat irritation' },
          { term: 'Headache or dizziness' },
          { term: 'Drowsiness or confusion' },
          { term: 'Nausea' },
          { term: 'Difficulty breathing' },
        ],
      },
      {
        heading: 'What your written plan needs',
        items: [
          { term: 'Work with others who monitor and can assist' },
          { term: 'Systems for pumps and engines' },
          { term: 'PPE on hand' },
          { term: 'Review the plan with everyone who works near storage' },
          { term: 'Maintain safety devices' },
          { term: 'Do maintenance from outside the structure when possible' },
        ],
      },
      {
        heading: 'Three high-hazard jobs',
        items: [
          { marker: '1', term: 'Agitating or moving manure', text: 'Ventilation on and unblocked before you start.' },
          { marker: '2', term: 'Foaming pits', text: 'Methane can reach about 70% at the surface. Stay away until the foam is gone.' },
          { marker: '3', term: 'Gypsum bedding', text: 'Sulfate turns into hydrogen sulfide in storage. Inspect before agitating.' },
        ],
      },
      {
        heading: 'Gas monitors and rescue training',
        items: [
          { term: 'Discounted gas monitors via KC Supply', text: 'Discount code available on request through the manure pit safety page.' },
          { term: 'NECAS manure pit rescue training' },
        ],
      },
    ],
    links: ['p_manure', 'a_kcsupply', 'r_necas'],
  },
  severe_weather: {
    id: 'severe_weather',
    title: 'Severe weather plan',
    intro: 'Five things to have written down before the storm — they also form the core of your emergency action plan.',
    sections: [
      {
        heading: 'Have these ready',
        items: [
          { marker: '1', term: 'Farm map', text: 'Buildings, what’s in them, utility shutoffs and escape routes.' },
          { marker: '2', term: 'Salvage & debris plan', text: 'Who cleans up, where debris goes — including hazardous materials.' },
          { marker: '3', term: 'Emergency contact list', text: 'Owners, family, employees, employee families, suppliers and regular visitors.' },
          { marker: '4', term: 'Inventory system', text: 'Photos and lists of equipment, livestock and stored product.' },
          { marker: '5', term: 'Off-site document storage', text: 'Policies, deeds, records and this plan stored somewhere a storm can’t reach.' },
        ],
      },
    ],
    links: ['t_severe_weather', 'k_eap', 'k_contingency'],
  },
}
