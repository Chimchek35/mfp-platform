/**
 * Section 2 — Risk Management team consultation topics and service channels.
 * Consultations are free for Nationwide customers; some services vary by location and premium threshold.
 */
import { FARM_RANCH, rec, type CatalogRecord } from './taxonomy'

const NW = 'https://www.nationwide.com'
export const CONSULT_URL = `${NW}/business/agribusiness/safety-risk-management/consultations-services/`
export const CONSULT_FLYER_URL = `${NW}/staticassets/agrm-GCO-0194AO_RMS_Consulting_Services_Flyer_tcm108-79485.pdf`
export const AGENT_FINDER_URL = 'https://www.farmagentfinder.com/home/index'

export const CONSULT_NOTE = 'Free for Nationwide customers; some services vary by location and premium threshold.'

function c(id: string, title: string, summary: string, triggers: string[], extra: Partial<CatalogRecord> = {}): CatalogRecord {
  return rec({
    id,
    title,
    url: CONSULT_URL,
    type: 'consultation',
    summary,
    triggers,
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: [], subtopic: ['Hazards & risks'], format: 'Tools and fact finders' },
    ...extra,
  })
}

export const CONSULTATIONS: CatalogRecord[] = [
  c('c_agronomy', 'Agronomy operations & safe chemical handling', 'Custom application, chemical storage and handling practices.', ['crops', 'custom application', 'chemical storage'], {
    taxonomy: { industry: FARM_RANCH, topic: ['Fertilizer & pesticides', 'Hazardous materials'], subtopic: ['Safe operating procedures'], format: 'Tools and fact finders' },
  }),
  c('c_dairy_livestock', 'Dairy & livestock operational risk', 'Operational and industry risk for dairy, cattle, hog and poultry operations.', ['dairy', 'cattle', 'hog', 'poultry'], {
    taxonomy: { industry: FARM_RANCH, topic: ['Livestock & poultry'], subtopic: ['Hazards & risks'], format: 'Tools and fact finders' },
  }),
  c('c_driver', 'Driver & vehicle safety', 'Driver policies, regulations and driver behavior for farm trucks and fleets.', ['trucks/equipment on roads', 'fleet'], {
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Driver & vehicle safety'], subtopic: ['Regulatory compliance & standards'], format: 'Tools and fact finders' },
  }),
  c('c_ih', 'Industrial hygiene (Certified Industrial Hygienist)', 'Dust, chemical and confined-space exposure for your crew.', ['dust', 'chemicals', 'confined spaces', 'employees'], {
    taxonomy: { industry: FARM_RANCH, topic: ['Employee health & workplace safety', 'Confined spaces'], subtopic: ['PPE', 'Hazards & risks'], format: 'Tools and fact finders' },
  }),
  c('c_wc', "Workers' comp, health & safety", 'Injury prevention, claims and return-to-work for hired employees.', ['any hired employees'], {
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Employee health & workplace safety'], subtopic: ['Incident reporting & investigation'], format: 'Tools and fact finders' },
  }),
  c('c_fire', 'Fire prevention & thermal imaging', 'Sprinkler assessments, special hazard design, and thermal imaging of electrical systems and motors.', ['buildings', 'shop', 'hay', 'grain dryer', 'livestock barns'], {
    taxonomy: { industry: FARM_RANCH, topic: ['Fires & explosions'], subtopic: ['Technology & monitoring systems', 'Inspections & maintenance'], format: 'Tools and fact finders' },
  }),
  c('c_food_feed', 'Food & feed safety (HACCP, QMS, GMP, Food Defense)', 'Food safety systems for on-farm processing, direct sales and feed.', ['on-farm processing', 'direct sales', 'feed'], {
    readinessCategory: 'managing',
    taxonomy: { industry: ['Farm & ranch', 'Food & beverage processing'], topic: ['Food & feed safety'], subtopic: ['Regulatory compliance & standards'], format: 'Tools and fact finders' },
  }),
  c('c_lp', 'LP gas / propane safety (CETP/PERC, NFPA)', 'Propane systems, training and standards for tanks, dryers and heaters.', ['propane tanks', 'grain dryers', 'barn heaters'], {
    readinessCategory: 'managing',
    taxonomy: { industry: ['Farm & ranch', 'Fuel & propane distribution'], topic: ['Fires & explosions', 'Hazardous materials'], subtopic: ['Regulatory compliance & standards'], format: 'Tools and fact finders' },
  }),
  c('c_property_eng', 'Property engineering', 'Bulk storage, thermal processing, sprinklered warehousing and combustible dust.', ['grain handling', 'large storage', 'dryers'], {
    taxonomy: { industry: ['Farm & ranch', 'Traditional agribusiness'], topic: ['Property & structural protection', 'Fires & explosions'], subtopic: ['Engineering & structural controls'], format: 'Tools and fact finders' },
  }),
  c('c_weather_structures', 'Weather-resilient structures', 'A popular farm & ranch topic: building and retrofitting for wind, hail and snow.', ['buildings', 'weather region'], {
    taxonomy: { industry: FARM_RANCH, topic: ['Weather & environment', 'Property & structural protection'], subtopic: ['Engineering & structural controls'], format: 'Tools and fact finders' },
  }),
  rec({
    id: 'c_flyer',
    title: 'Risk Management consulting services flyer',
    url: CONSULT_FLYER_URL,
    type: 'consultation',
    summary: 'Overview of every consulting service and how to request one.',
    triggers: ['every farm'],
    readinessCategory: 'identify',
    taxonomy: { industry: FARM_RANCH, topic: [], subtopic: [], format: 'Safety tips and guides' },
  }),
  rec({
    id: 'c_agent',
    title: 'Find a farm agent',
    url: AGENT_FINDER_URL,
    type: 'consultation',
    summary: "Locate a farm agent near you. Can't find your farm type? Call 1-800-255-9913.",
    triggers: ['insurance review'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: ['Contracts & liability'], subtopic: ['Liability & risk transfer'], format: 'Tools and fact finders' },
  }),
]
