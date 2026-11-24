/**
 * Shared types + the Section 8 resource-library taxonomy for the Nationwide support catalog.
 * Every record in /lib/catalog/* uses these. Source: nationwide-risk-catalog.md, compiled 2026-11-19.
 */

export const VERIFIED_AT = '2026-11-19' as const

export type SupportType = 'program' | 'checklist' | 'consultation' | 'training' | 'agtech' | 'coverage_review' | 'plan_action' | 'tip'

export const SUPPORT_TYPE_LABEL: Record<SupportType, string> = {
  program: 'Safety program',
  checklist: 'Checklist',
  consultation: 'Free consultation',
  training: 'Training',
  agtech: 'Partner discount',
  coverage_review: 'Coverage to review',
  plan_action: 'Plan action',
  tip: 'Safety tip',
}

/** Matches the 4 quiz categories in /lib/quiz.ts (Section 9 mapping). */
export type ReadinessCategory = 'identify' | 'managing' | 'contingency' | 'communicating'

export const INDUSTRIES = ['Farm & ranch', 'Food & beverage processing', 'Fuel & propane distribution', 'Traditional agribusiness'] as const

export const TOPICS = [
  'C-stores & retail',
  'Confined spaces',
  'Contracts & liability',
  'Driver & vehicle safety',
  'Employee health & workplace safety',
  'Fertilizer & pesticides',
  'Fires & explosions',
  'Food & feed safety',
  'Grain operations safety',
  'Harvest & machinery safety',
  'Hazardous materials',
  'Livestock & poultry',
  'Property & structural protection',
  'Weather & environment',
] as const

export const SUBTOPICS = [
  'ATV/UTV & ag equipment operation',
  'Emergency preparedness & response',
  'Engineering & structural controls',
  'Environmental considerations',
  'Grain bin safety',
  'Grain/commodity management',
  'Grain/commodity structures',
  'Hazards & risks',
  'Incident reporting & investigation',
  'Inspections & maintenance',
  'Liability & risk transfer',
  'PPE',
  'Regulatory compliance & standards',
  'Safe operating procedures',
  'Substance use & impairment risk',
  'Technology & monitoring systems',
] as const

export const FORMATS = [
  'Articles',
  'Checklists and forms',
  'Programs',
  'Safety tips and guides',
  'Technical bulletins',
  'Toolbox talks',
  'Tools and fact finders',
  'Videos and training',
  'White papers',
] as const

export type Industry = (typeof INDUSTRIES)[number]
export type Topic = (typeof TOPICS)[number]
export type Subtopic = (typeof SUBTOPICS)[number]
export type Format = (typeof FORMATS)[number]

export interface Taxonomy {
  industry: Industry[]
  topic: Topic[]
  subtopic: Subtopic[]
  format: Format
}

export interface CatalogRecord {
  id: string
  title: string
  /** Only URLs that appear in nationwide-risk-catalog.md. */
  url: string
  type: SupportType
  /** One plain-language line shown on cards. */
  summary: string
  /** Human-readable triggers from the catalog (what makes this relevant). */
  triggers: string[]
  readinessCategory: ReadinessCategory
  taxonomy: Taxonomy
  verifiedAt: typeof VERIFIED_AT
  /** Recommended for every farm regardless of profile (Section 5 universal list). */
  universal?: boolean
  /** Program detail sheet id in PROGRAM_SHEETS. */
  sheet?: string
  /** Agtech offer text, e.g. "20% off". */
  offer?: string
  /** Partner or team contact. */
  contact?: string
  /** For coverage_review: the protection in step 2 that sets have / not sure / don't have wording. */
  protection?: import('../types').ProtectionKey
}

/** Small helper so data files stay readable. */
export function rec(r: Omit<CatalogRecord, 'verifiedAt'>): CatalogRecord {
  return { ...r, verifiedAt: VERIFIED_AT }
}

export const FARM_RANCH: Industry[] = ['Farm & ranch']
