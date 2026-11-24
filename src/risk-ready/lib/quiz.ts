import type { Band, FarmState, ProtectionKey, ProtectionStatus } from './types'

export type QuizCategory = 'identify' | 'managing' | 'contingency' | 'communicating'

export const QUIZ_CATEGORIES: { key: QuizCategory; label: string; blurb: string }[] = [
  { key: 'identify', label: 'Identifying risk', blurb: 'Knowing what could go wrong on your farm.' },
  { key: 'managing', label: 'Managing & preventing risk', blurb: 'Steps you take before something happens.' },
  { key: 'contingency', label: 'Contingency planning', blurb: 'Knowing what you will do when it does.' },
  { key: 'communicating', label: 'Communicating the plan', blurb: 'Making sure everyone knows the plan.' },
]

export const EXTENT_SCALE = ['Not at all', 'A little', 'Somewhat', 'To a great extent']
export const AGREE_SCALE = ['Strongly disagree', 'Disagree', 'Agree', 'Strongly agree']

export interface QuizQuestion {
  id: string
  category: QuizCategory
  text: string
  scale: string[]
  /** answer this from the protections inventory when possible */
  fromInventory?: (s: FarmState) => { value: number; because: string } | null
}

const STATUS_VALUE: Record<ProtectionStatus, number> = { have: 4, unsure: 2, none: 1 }
const STATUS_WORD: Record<ProtectionStatus, string> = { have: 'have', unsure: 'not sure', none: 'don’t have' }

function fromProtection(key: ProtectionKey, label: string) {
  return (s: FarmState) => {
    const st = s.protections[key]
    if (!st) return null
    return { value: STATUS_VALUE[st], because: `${label}: “${STATUS_WORD[st]}”` }
  }
}

function fromAverage(keys: ProtectionKey[], label: string) {
  return (s: FarmState) => {
    const vals = keys.map((k) => s.protections[k]).filter(Boolean) as ProtectionStatus[]
    if (vals.length < keys.length) return null
    const avg = vals.reduce((a, v) => a + STATUS_VALUE[v], 0) / vals.length
    return { value: Math.max(1, Math.min(4, Math.round(avg))), because: `${label}: ${vals.map((v) => STATUS_WORD[v]).join(', ')}` }
  }
}

export const QUIZ: QuizQuestion[] = [
  { id: 'i1', category: 'identify', scale: EXTENT_SCALE, text: 'I have identified the risks that could affect each part of my operation.' },
  { id: 'i2', category: 'identify', scale: EXTENT_SCALE, text: 'I know which parts of my operation depend on a single buyer, supplier or person.' },
  {
    id: 'i3',
    category: 'identify',
    scale: EXTENT_SCALE,
    text: 'I have reviewed my insurance with an agent to understand what is and isn’t covered.',
    fromInventory: (s) => {
      if (!s.insuranceReview) return null
      const map = { within12: 4, longer: 2, never: 1 } as const
      const word = { within12: 'within 12 months', longer: 'more than 12 months ago', never: 'never' }
      return { value: map[s.insuranceReview], because: `Last insurance review: ${word[s.insuranceReview]}` }
    },
  },
  {
    id: 'm1',
    category: 'managing',
    scale: AGREE_SCALE,
    text: 'I’ve transferred my risk by purchasing insurance.',
    fromInventory: fromAverage(['farmProperty', 'farmLiability'], 'Farm property and liability insurance'),
  },
  {
    id: 'm2',
    category: 'managing',
    scale: AGREE_SCALE,
    text: 'I have written procedures for the most dangerous and most important jobs on the farm.',
    fromInventory: fromProtection('keyProcedures', 'Written key procedures'),
  },
  { id: 'm3', category: 'managing', scale: AGREE_SCALE, text: 'I take steps to prevent losses before they happen — training, maintenance and inspections.' },
  {
    id: 'c1',
    category: 'contingency',
    scale: EXTENT_SCALE,
    text: 'I have a written plan for what to do in a fire, storm or serious injury.',
    fromInventory: fromProtection('emergencyPlan', 'Written emergency plan'),
  },
  {
    id: 'c2',
    category: 'contingency',
    scale: EXTENT_SCALE,
    text: 'Someone else could run each critical job if I or a key worker were out.',
    fromInventory: fromProtection('crossTrained', 'Someone cross-trained for each critical job'),
  },
  {
    id: 'c3',
    category: 'contingency',
    scale: EXTENT_SCALE,
    text: 'My records and data are backed up somewhere off the farm.',
    fromInventory: fromProtection('offsiteBackup', 'Off-site data backup'),
  },
  {
    id: 'c4',
    category: 'contingency',
    scale: EXTENT_SCALE,
    text: 'I have a backup buyer, supplier and power source lined up.',
    fromInventory: fromAverage(['altBuyer', 'altSupplier', 'generator'], 'Alternate buyer, alternate supplier, generator'),
  },
  {
    id: 'k1',
    category: 'communicating',
    scale: AGREE_SCALE,
    text: 'Everyone on the farm knows who to call and what to do in an emergency.',
    fromInventory: fromProtection('contactList', 'Emergency contact list'),
  },
  {
    id: 'k2',
    category: 'communicating',
    scale: AGREE_SCALE,
    text: 'We have agreed who speaks for the farm and who holds a copy of the plan.',
    fromInventory: fromProtection('spokesperson', 'A named spokesperson'),
  },
]

/** Effective answer: farmer's explicit answer wins; otherwise an inventory-derived answer (shown as such). */
export function quizAnswer(q: QuizQuestion, s: FarmState): { value: number | null; source: 'farmer' | 'inventory' | null; because?: string } {
  if (s.quiz[q.id] != null) return { value: s.quiz[q.id], source: 'farmer' }
  const inv = q.fromInventory?.(s)
  if (inv) return { value: inv.value, source: 'inventory', because: inv.because }
  return { value: null, source: null }
}

export function bandFor(pct: number | null): Band {
  if (pct == null) return 'unscored'
  if (pct >= 75) return 'strong'
  if (pct >= 50) return 'watch'
  return 'vulnerable'
}

export const BAND_TEXT: Record<Band, string> = {
  strong: 'Strong',
  watch: 'Watch',
  vulnerable: 'Vulnerable',
  unscored: 'Not scored',
}

export interface CategoryScore {
  key: QuizCategory
  label: string
  score: number
  max: number
  answered: number
  total: number
  pct: number | null
  band: Band
}

export function scoreQuiz(s: FarmState) {
  const cats: CategoryScore[] = QUIZ_CATEGORIES.map((c) => {
    const qs = QUIZ.filter((q) => q.category === c.key)
    const vals = qs.map((q) => quizAnswer(q, s).value).filter((v): v is number => v != null)
    const max = qs.length * 4
    const score = vals.reduce((a, v) => a + v, 0)
    const complete = vals.length === qs.length
    const pct = complete ? Math.round((score / max) * 100) : null
    return { key: c.key, label: c.label, score, max, answered: vals.length, total: qs.length, pct, band: bandFor(pct) }
  })
  const answered = cats.reduce((a, c) => a + c.answered, 0)
  const complete = answered === QUIZ.length
  const score = cats.reduce((a, c) => a + c.score, 0)
  const max = QUIZ.length * 4
  const pct = complete ? Math.round((score / max) * 100) : null
  return { cats, answered, complete, score, max, pct, band: bandFor(pct) }
}

export function interpretQuiz(result: ReturnType<typeof scoreQuiz>): string {
  if (!result.complete) return 'Answer the remaining questions to see your full readiness picture.'
  const weakest = [...result.cats].sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0))[0]
  const strongest = [...result.cats].sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0))[0]
  const lead =
    result.band === 'strong'
      ? 'Your farm is in a strong position — you have already done much of the work most farms skip.'
      : result.band === 'watch'
        ? 'You have a solid start, with some clear gaps worth closing this year.'
        : 'Your farm is exposed right now — but that is common, and the gaps are fixable one step at a time.'
  const same = weakest.key === strongest.key
  return `${lead} ${same ? '' : `Your strongest area is ${strongest.label.toLowerCase()} (${strongest.pct}%). `}The area that needs the most attention is ${weakest.label.toLowerCase()} (${weakest.pct}%), so the next steps of this plan put extra weight there.`
}
