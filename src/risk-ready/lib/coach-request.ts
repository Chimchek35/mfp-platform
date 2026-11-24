import { farmTypeDef } from './options'
import { STEPS, type Tip } from './steps'
import type { FarmState } from './types'

export interface CoachRequest {
  step: number
  stepTitle: string
  summary: string
  fallback: string
}

/**
 * Everything the /api/coach function needs, prepared in the browser so the serverless
 * function stays free of the rule engine: a compact farm summary for the model and the
 * rules-based answer it returns when AI is not configured.
 */
export function buildCoachRequest(state: FarmState, step: number, tips: Tip[]): CoachRequest {
  const p = state.profile
  const summary = [
    p.farmType && `Farm type: ${farmTypeDef(p.farmType).label}`,
    p.enterprises.length && `Enterprises: ${p.enterprises.join(', ')}`,
    p.adjacent.length && `Farm-adjacent enterprises: ${p.adjacent.join(', ')}`,
    p.state && `State: ${p.state}`,
    p.acres && `${p.acres} acres`,
    p.head && `${p.head} head`,
    `Hired employees: ${(p.seasonalEmployees ?? 0) + (p.yearRoundEmployees ?? 0)}`,
    `Assets: ${Object.keys(p.assets).filter((k) => p.assets[k as keyof typeof p.assets]).join(', ') || 'none listed'}`,
    `Protections: ${Object.entries(state.protections).map(([k, v]) => `${k}=${v}`).join(', ') || 'none answered'}`,
    `Threats so far: ${state.threats.map((t) => `${t.label} (${t.category}, ${t.probability}x${t.severity})`).join('; ') || 'none'}`,
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 3000)

  const fallback = tips.map((t) => `${t.title}. ${t.body}`).join(' ') || STEPS[step].why || 'Keep going — every answer sharpens your plan.'

  return { step, stepTitle: STEPS[step].title, summary, fallback: fallback.slice(0, 2000) }
}
