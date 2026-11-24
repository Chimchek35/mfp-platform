import { categoryDef, threatBand, threatScore, BAND_LABEL } from './categories'
import type { FarmContext } from './context'
import { PROTECTIONS, STATUS_LABEL } from './options'
import { getRecord, type CatalogRecord } from './catalog'
import { RULES, type Rule } from './rules'
import type { ProtectionKey, ProtectionStatus, Strategy, StrategyEntry, Threat, ThreatCategory } from './types'

export const STRATEGIES: { key: Strategy; label: string; meaning: string; example: string }[] = [
  {
    key: 'avoidance',
    label: 'Avoidance',
    meaning: 'Stop doing the thing that creates the risk.',
    example: 'You stop letting kids under 16 drive the UTV, or you decide not to start custom hauling.',
  },
  {
    key: 'acceptance',
    label: 'Acceptance',
    meaning: 'Knowingly carry the risk yourself because it is small or cheap to absorb.',
    example: 'A fence repair after a storm costs less than raising coverage, so you budget for it.',
  },
  {
    key: 'transfer',
    label: 'Transfer',
    meaning: 'Shift the cost of the risk to someone else — usually insurance or a contract.',
    example: 'Revenue Protection crop insurance carries the cost if prices and yields fall together.',
  },
  {
    key: 'mitigation',
    label: 'Mitigation',
    meaning: 'Make the risk less likely, or less damaging when it happens.',
    example: 'Cross-training a second person on the grain dryer so harvest keeps moving if you are hurt.',
  },
]

export const strategyLabel = (s: Strategy) => STRATEGIES.find((x) => x.key === s)!.label

/** Spec §5 defaults per category. */
const CATEGORY_DEFAULTS: Record<ThreatCategory, { strategy: Strategy; getAction: string; haveAction: string; supports: string[] }> = {
  price: { strategy: 'transfer', getAction: 'Size RP or LRP coverage against your actual cost of production.', haveAction: 'Review your RP or LRP coverage level against actual cost of production with your agent.', supports: ['cv_crop_ins', 'cv_lrp', 'r_ag_financial'] },
  yield: { strategy: 'transfer', getAction: 'Review APH and coverage against breakeven yield.', haveAction: 'Review APH and coverage level against breakeven yield with your agent.', supports: ['cv_crop_ins', 'c_agronomy'] },
  facility: { strategy: 'transfer', getAction: 'Confirm replacement-cost coverage and limits; review fire and failure detection.', haveAction: 'Review limits and exclusions with your agent; confirm replacement cost and review detection.', supports: ['k_farm_fire', 'c_property_eng', 'a_hub'] },
  natural: { strategy: 'transfer', getAction: 'Confirm wind, hail and flood limits and exclusions.', haveAction: 'Review wind, hail and flood limits and exclusions with your agent.', supports: ['t_severe_weather', 'k_weather_hub', 'k_storm_roof'] },
  personnel: { strategy: 'mitigation', getAction: 'Cross-train a second person; document the top two procedures.', haveAction: 'Confirm your backup has run each critical job this year; update the written steps.', supports: ['p_every_step', 'tr_training'] },
  technology: { strategy: 'mitigation', getAction: 'Get records off a single machine; confirm a backup actually restores.', haveAction: 'Test a restore from your backup this quarter.', supports: ['cv_cyber', 'cv_identity_fraud'] },
  social: { strategy: 'mitigation', getAction: 'Agree who speaks for the farm before it is needed.', haveAction: 'Review talking points with your spokesperson and family.', supports: ['cv_liability', 'r_library'] },
  operational: { strategy: 'mitigation', getAction: 'Name an alternate supplier and buyer; confirm volume.', haveAction: 'Confirm your alternates can still take or supply your volume.', supports: ['k_contingency', 'r_contract_transfer'] },
}

/** Section 0: have → review, not sure → confirm, don't have → add. */
export type ActionMode = 'review' | 'confirm' | 'add'
export const GAP_MULTIPLIER: Record<ActionMode, number> = { review: 1.0, confirm: 1.2, add: 1.5 }
export const ACTION_MODE_LABEL: Record<ActionMode, string> = { review: 'Review what you have', confirm: 'Confirm what you have', add: 'Add this protection' }

export function actionMode(status: ProtectionStatus | undefined): ActionMode {
  return status === 'have' ? 'review' : status === 'none' ? 'add' : 'confirm'
}

export const ruleFor = (t: Threat): Rule | undefined => (t.ruleId ? RULES.find((r) => r.id === t.ruleId) : undefined)

export function matchingProtection(t: Threat, c: FarmContext): ProtectionKey {
  return ruleFor(t)?.protection ?? categoryDef(t.category).defaultProtection(c)
}

export const protectionLabel = (k: ProtectionKey) => PROTECTIONS.find((p) => p.key === k)!.label

export function gapFor(t: Threat, c: FarmContext): { key: ProtectionKey; status: ProtectionStatus | undefined; mode: ActionMode; multiplier: number } {
  const key = matchingProtection(t, c)
  const status = c.protection(key)
  const mode = actionMode(status)
  return { key, status, mode, multiplier: GAP_MULTIPLIER[mode] }
}

/** All catalog support ids that apply to a threat, in priority order. */
export function supportIdsFor(t: Threat): string[] {
  return ruleFor(t)?.supports ?? CATEGORY_DEFAULTS[t.category].supports
}

/**
 * Up to 3 matched supports per threat, deduped across threats: higher-ranked threats claim a
 * support first; lower-ranked threats get the next unclaimed ones. A threat whose supports
 * were all claimed shows its first one, marked shared.
 */
export function assignSupports(ranked: { threat: Threat }[], max = 3): Map<string, { record: CatalogRecord; shared: boolean }[]> {
  const claimed = new Set<string>()
  const out = new Map<string, { record: CatalogRecord; shared: boolean }[]>()
  for (const { threat } of ranked) {
    const records = supportIdsFor(threat).map(getRecord).filter((r): r is CatalogRecord => !!r)
    const fresh = records.filter((r) => !claimed.has(r.id)).slice(0, max)
    fresh.forEach((r) => claimed.add(r.id))
    out.set(threat.id, fresh.length ? fresh.map((record) => ({ record, shared: false })) : records.slice(0, 1).map((record) => ({ record, shared: true })))
  }
  return out
}

export function rankThreats(threats: Threat[], c: FarmContext) {
  return threats
    .map((t) => {
      const score = threatScore(t.probability, t.severity)
      const gap = gapFor(t, c)
      return { threat: t, score, band: threatBand(score), gap, priority: score * gap.multiplier }
    })
    .sort((a, b) => b.score - a.score || b.priority - a.priority)
}

export interface Recommendation {
  strategy: Strategy
  action: string
  why: string[]
  mode: ActionMode
  supports: string[]
  calculator?: 'crop' | 'livestock'
  involved: string
  informed: string
}

export function recommend(t: Threat, c: FarmContext): Recommendation {
  const rule = ruleFor(t)
  const def = CATEGORY_DEFAULTS[t.category]
  const score = threatScore(t.probability, t.severity)
  const gap = gapFor(t, c)
  const hasIt = gap.status === 'have'
  const why: string[] = []

  if (rule) why.push(`We suggested this because ${rule.because(c)}.`)
  why.push(`You rated it ${t.probability} for likelihood and ${t.severity} for impact — a score of ${score} (${BAND_LABEL[threatBand(score)]}).`)
  why.push(
    gap.status
      ? `For “${protectionLabel(gap.key)}” you answered “${STATUS_LABEL[gap.status]}”${
          hasIt ? ', so the step is to review it, not to buy something new.' : gap.mode === 'confirm' ? ', so the first step is to confirm what you have.' : ', so this is a gap to close.'
        }`
      : `You haven’t told us yet whether you have “${protectionLabel(gap.key)}”, so the first step is to confirm it.`,
  )

  let strategy: Strategy = rule?.strategy ?? def.strategy
  const getAction = rule?.actionGet ?? def.getAction
  let action =
    gap.mode === 'review'
      ? (rule?.actionHave ?? def.haveAction)
      : gap.mode === 'confirm'
        ? (rule?.actionConfirm ?? `Confirm with your agent whether you have ${protectionLabel(gap.key).toLowerCase()}. If you don’t: ${lowerFirst(getAction)}`)
        : getAction

  if (score < 8) {
    strategy = 'acceptance'
    action = `Accept and monitor. At a score of ${score} this does not justify the cost of transferring or mitigating it — note it and revisit at your next plan review.`
    why.push(`Because the score is under 8, we recommend acceptance instead of ${strategyLabel(rule?.strategy ?? def.strategy).toLowerCase()}.`)
  }

  const p = c.state.profile
  const involved =
    p.people.filter((x) => x.name.trim()).map((x) => x.name.trim()).join(', ') ||
    (p.farmName ? `${p.farmName} owner/operator` : 'Owner/operator')
  const contacts = c.state.contacts.filter((x) => x.primaryName.trim())
  const rolePattern =
    strategy === 'transfer' ? /agent|insur|lender|bank/ : t.category === 'operational' || t.category === 'price' ? /buyer|supplier|agent|lender/ : null
  const relevant = rolePattern ? contacts.filter((x) => rolePattern.test(x.role.toLowerCase())) : contacts
  const informed = (relevant.length ? relevant : contacts).map((x) => `${x.primaryName.trim()} (${x.role})`).join(', ') || 'Your insurance agent and family (add contacts in step 6)'

  return {
    strategy,
    action,
    why,
    mode: gap.mode,
    supports: supportIdsFor(t),
    calculator: score >= 8 && strategy === 'transfer' && (t.category === 'price' || t.category === 'yield') ? (rule?.calculator ?? (c.lrpLivestock && !c.crops ? 'livestock' : 'crop')) : undefined,
    involved,
    informed,
  }
}

export function entryFromRecommendation(r: Recommendation): StrategyEntry {
  return { strategy: r.strategy, action: r.action, involved: r.involved, informed: r.informed, notes: '', seeded: true }
}

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}
