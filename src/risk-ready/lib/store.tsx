import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { buildContext, type FarmContext } from './context'
import { initialState, sampleState } from './sample'
import type { FarmState } from './types'

export type PlanUpdater = (fn: (s: FarmState) => FarmState) => void

interface StoreValue {
  state: FarmState
  ctx: FarmContext
  hydrated: boolean
  update: PlanUpdater
  goTo: (step: number) => void
  loadSample: () => void
  reset: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

/** Fills any keys a saved plan is missing so older or partial records still render. */
export function hydratePlan(saved: Partial<FarmState> | null | undefined): FarmState {
  const base = initialState()
  if (!saved || typeof saved !== 'object') return base
  return { ...base, ...saved, profile: { ...base.profile, ...(saved.profile ?? {}) } }
}

/**
 * The plan state is owned by the platform record (App.jsx `risk.plan`), so this provider is
 * controlled: it renders whatever it is given and pushes every change back through `onChange`.
 * Persistence (local record + signed-in sync) happens upstream with the rest of the farm record.
 */
export function StoreProvider({
  state,
  onChange,
  scrollContainer,
  children,
}: {
  state: FarmState
  onChange: PlanUpdater
  scrollContainer?: () => HTMLElement | null | undefined
  children: ReactNode
}) {
  const update = useCallback<PlanUpdater>((fn) => onChange((s) => ({ ...fn(s), updatedAt: Date.now() })), [onChange])

  const goTo = useCallback(
    (step: number) => {
      update((s) => ({ ...s, step, visited: s.visited.includes(step) ? s.visited : [...s.visited, step] }))
      const el = scrollContainer?.()
      if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
      else if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [update, scrollContainer],
  )
  const loadSample = useCallback(() => onChange(() => sampleState()), [onChange])
  const reset = useCallback(() => onChange(() => initialState()), [onChange])

  const ctx = useMemo(() => buildContext(state), [state])
  const value = useMemo(() => ({ state, ctx, hydrated: true, update, goTo, loadSample, reset }), [state, ctx, update, goTo, loadSample, reset])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const v = useContext(StoreContext)
  if (!v) throw new Error('useStore must be used inside StoreProvider')
  return v
}
