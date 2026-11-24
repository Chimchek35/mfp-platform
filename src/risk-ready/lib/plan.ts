import type { FarmContext } from './context'
import { PROTECTIONS } from './options'
import { agentQuestions, getRecord, UNIVERSAL_IDS, type CatalogRecord, type SupportType } from './catalog'
import { PLAN_ALERTS, RULES, type Rule } from './rules'
import { rankThreats, recommend, strategyLabel, supportIdsFor } from './strategy'
import type { ProtectionKey } from './types'

/** Rules currently triggered by the profile + protections, minus accepted or dismissed ones. */
export function suggestedRules(c: FarmContext): Rule[] {
  const accepted = new Set(c.state.threats.map((t) => t.ruleId).filter(Boolean))
  const dismissed = new Set(c.state.dismissedRules)
  return RULES.filter((r) => r.when(c) && !accepted.has(r.id) && !dismissed.has(r.id))
}

export function activeAlerts(c: FarmContext) {
  return PLAN_ALERTS.filter((a) => a.when(c))
}

/** Which protections are most relevant to this farm (so we can tag the rest "less relevant"). */
export function protectionRelevance(key: ProtectionKey, c: FarmContext): 'relevant' | 'less' {
  switch (key) {
    case 'cropInsurance':
      return c.crops ? 'relevant' : 'less'
    case 'lrp':
      return c.lrpLivestock ? 'relevant' : 'less'
    case 'workersComp':
      return c.employees > 0 ? 'relevant' : 'less'
    case 'cyber':
    case 'offsiteBackup':
      return c.has('computerRecords') || c.has('gpsEquipment') || c.hasAdjacent('agService', 'directMarket') ? 'relevant' : 'less'
    case 'autoFleet':
      return c.has('roadVehicles') || c.hasAdjacent('customHauling') ? 'relevant' : 'less'
    case 'generator':
      return c.livestock || c.has('grainBins') ? 'relevant' : 'less'
    case 'altBuyer':
      return c.state.profile.revenueOps.length > 0 || c.crops || c.livestock ? 'relevant' : 'less'
    default:
      return 'relevant'
  }
}

export interface ActionItem {
  id: string
  title: string
  detail: string
  priority: number
  tag: string
}

export function next90Days(c: FarmContext): ActionItem[] {
  const items: ActionItem[] = activeAlerts(c).map((a) => ({ id: a.id, title: a.title, detail: a.detail(c), priority: Infinity, tag: 'Start here' }))
  for (const r of rankThreats(c.state.threats, c)) {
    const entry = c.state.strategies[r.threat.id] ?? null
    const rec = recommend(r.threat, c)
    const strategy = entry?.strategy ?? rec.strategy
    if (strategy === 'acceptance') continue
    items.push({
      id: r.threat.id,
      title: entry?.action || rec.action,
      detail: `${r.threat.label} — score ${r.score}${r.gap.status === 'none' ? ', no protection in place' : ''}. Strategy: ${strategyLabel(strategy)}${entry ? '' : ' (recommended, not yet confirmed)'}.`,
      priority: r.priority,
      tag: r.gap.status === 'none' ? 'Gap' : r.band === 'immediate' ? 'Immediate' : r.band === 'elevated' ? 'Elevated' : 'Monitor',
    })
  }
  return items.sort((a, b) => b.priority - a.priority).slice(0, 8)
}

export interface MatchedSupport {
  record: CatalogRecord
  reason: string
}

/**
 * Every catalog record that fits this farm, deduped, each with the first reason it matched.
 * Order: universal items, plan alerts, the farmer's own threats (by score), then any other triggered rule.
 */
export function matchedSupports(c: FarmContext): MatchedSupport[] {
  const out = new Map<string, string>()
  const add = (id: string, reason: string) => {
    if (!out.has(id) && getRecord(id)) out.set(id, reason)
  }
  for (const id of UNIVERSAL_IDS) add(id, 'Recommended for every farm')
  for (const a of activeAlerts(c)) for (const id of a.supports) add(id, a.title)
  for (const r of rankThreats(c.state.threats, c)) for (const id of supportIdsFor(r.threat)) add(id, `For: ${r.threat.label}`)
  for (const r of RULES.filter((x) => x.when(c))) for (const id of r.supports) add(id, `Because ${r.because(c)}`)
  add('tr_training', 'Training for family and employees')
  return [...out].map(([id, reason]) => ({ record: getRecord(id)!, reason }))
}

export type SupportGroupKey = 'programs' | 'checklists' | 'consultations' | 'agtech' | 'coverage'

export const SUPPORT_GROUPS: { key: SupportGroupKey; title: string; types: SupportType[] }[] = [
  { key: 'programs', title: 'Programs to start', types: ['program', 'training', 'tip'] },
  { key: 'checklists', title: 'Checklists to complete', types: ['checklist', 'plan_action'] },
  { key: 'consultations', title: 'Consultations to request', types: ['consultation'] },
  { key: 'agtech', title: 'Partner discounts that fit', types: ['agtech'] },
  { key: 'coverage', title: 'Coverage questions for your agent', types: ['coverage_review'] },
]

export function supportPlan(c: FarmContext) {
  const all = matchedSupports(c)
  const groups = SUPPORT_GROUPS.map((g) => ({ ...g, items: all.filter((m) => g.types.includes(m.record.type)) }))
  return { groups, agentQuestions: agentQuestions(c), total: all.length }
}

export function startingPosition(c: FarmContext) {
  const counts = { have: 0, unsure: 0, none: 0, blank: 0 }
  const gaps: string[] = []
  for (const p of PROTECTIONS) {
    const s = c.protection(p.key)
    if (!s) counts.blank++
    else counts[s]++
    if (s === 'none' && protectionRelevance(p.key, c) === 'relevant') gaps.push(p.label)
  }
  return { counts, gaps, total: PROTECTIONS.length }
}
