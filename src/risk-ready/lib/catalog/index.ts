/**
 * Nationwide Agribusiness risk-management & support catalog (replaces /lib/resources.ts).
 * Source: nationwide-risk-catalog.md, compiled from public pages, verified 2026-11-19.
 */
import { AGTECH } from './agtech'
import { CHECKLISTS } from './checklists'
import { CONSULTATIONS } from './consultations'
import { COVERAGE } from './coverage'
import { PROGRAMS } from './programs'
import type { CatalogRecord } from './taxonomy'

export * from './taxonomy'
export { PROGRAMS, PROGRAM_SHEETS, type ProgramSheet } from './programs'
export { CHECKLISTS } from './checklists'
export { CONSULTATIONS, CONSULT_URL, CONSULT_NOTE, AGENT_FINDER_URL } from './consultations'
export { AGTECH, AGTECH_NOTE, AGTECH_HUB_URL } from './agtech'
export { COVERAGE, COVERAGE_DISCLAIMER, agentQuestions, type AgentQuestion } from './coverage'

export const CATALOG: CatalogRecord[] = [...PROGRAMS, ...CHECKLISTS, ...CONSULTATIONS, ...AGTECH, ...COVERAGE]

const BY_ID = new Map(CATALOG.map((r) => [r.id, r]))

export function getRecord(id: string): CatalogRecord | undefined {
  return BY_ID.get(id)
}

/** Recommended for every farm (Section 5 universal list + severe weather tips). */
export const UNIVERSAL_IDS = ['k_eap', 'k_contingency', 'k_farm_fire', 'k_home_fire', 't_severe_weather'] as const

/** Section 1 headline facts for education cards. `steps` = which flow steps show the fact. */
export interface HeadlineFact {
  id: string
  value: string
  text: string
  source: string
  steps: number[]
  /** Optional: only show when this returns true for the farm. */
  topic?: 'atv' | 'fire' | 'property' | 'safety'
}

export const HEADLINE_FACTS: HeadlineFact[] = [
  { id: 'f_resilience', value: '35%', text: 'of farmers have a resiliency plan in place.', source: 'Nationwide Farmer Resiliency Research, Dec 2024', steps: [0] },
  { id: 'f_property', value: '65%', text: 'of Nationwide farm claims dollars are property-related.', source: 'Nationwide, Property Risk Solutions', steps: [2], topic: 'property' },
  { id: 'f_fires', value: '$1.6B+', text: 'in fire losses each year on U.S. farms and ranches.', source: 'Nationwide, Property Risk Solutions', steps: [4], topic: 'fire' },
  { id: 'f_atv', value: '632', text: 'off-highway-vehicle operators died in preventable accidents in 2024 — 119 were under 16.', source: 'Consumer Federation of America, cited by Nationwide', steps: [4], topic: 'atv' },
  { id: 'f_strategies', value: '4', text: 'ways to respond to any risk: avoid it, accept it, transfer it, or mitigate it.', source: 'Nationwide Farm Risk Ready', steps: [5] },
  { id: 'f_benefits', value: '4', text: 'benefits of a written plan: an organized emergency response, quicker recovery, protection for employees and farm, and peace of mind.', source: 'Nationwide Farm Risk Ready', steps: [6] },
  { id: 'f_safety', value: 'Safety ≠ risk management', text: 'Safety protects people from immediate hazards. Risk management protects the whole operation from loss.', source: 'Nationwide Agribusiness', steps: [3], topic: 'safety' },
]
