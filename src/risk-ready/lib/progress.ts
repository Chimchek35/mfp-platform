import { STEPS } from './steps'
import { scoreQuiz } from './quiz'
import type { FarmState } from './types'

export type StepStatus = 'done' | 'started' | 'todo'

export const LAST_STEP = STEPS.length - 1

export const STATUS_TEXT: Record<StepStatus, string> = { done: 'Done', started: 'In progress', todo: 'Not started' }

export function stepStatus(i: number, s: FarmState): StepStatus {
  const p = s.profile
  switch (i) {
    case 0:
      return s.visited.length > 1 ? 'done' : 'todo'
    case 1:
      return p.farmType && p.enterprises.length + p.adjacent.length > 0 ? 'done' : p.farmType || p.enterprises.length ? 'started' : 'todo'
    case 2: {
      const n = Object.keys(s.protections).length
      return n >= 15 && s.insuranceReview ? 'done' : n > 0 ? 'started' : 'todo'
    }
    case 3: {
      const q = scoreQuiz(s)
      return q.complete ? 'done' : q.answered ? 'started' : 'todo'
    }
    case 4:
      return s.threats.length >= 3 ? 'done' : s.threats.length ? 'started' : 'todo'
    case 5:
      return Object.keys(s.strategies).length >= Math.min(6, s.threats.length) && s.threats.length ? 'done' : Object.keys(s.strategies).length ? 'started' : 'todo'
    case 6:
      return s.contacts.length >= 2 && s.nextInsuranceReview ? 'done' : s.contacts.length ? 'started' : 'todo'
    default:
      return s.visited.includes(i) ? 'done' : 'todo'
  }
}

/** Summary the platform shell uses for its header, tab and progress bars. */
export function planProgress(s: FarmState) {
  const step = Math.min(Math.max(s.step, 0), LAST_STEP)
  const statuses = STEPS.map((_, i) => stepStatus(i, s))
  const done = statuses.filter((st) => st === 'done').length
  return {
    step,
    total: STEPS.length,
    label: STEPS[step].short,
    title: STEPS[step].title,
    done,
    pct: Math.round((done / STEPS.length) * 100),
    statuses,
  }
}
