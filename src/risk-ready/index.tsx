import './frr-reset.css'
import './frr.css'

import { useCallback, useMemo } from 'react'
import { StoreProvider, hydratePlan } from './lib/store'
import { seedPlanFromMfp, type MfpFinancialLike, type MfpProfileLike } from './lib/prefill'
import { planProgress } from './lib/progress'
import { STEPS } from './lib/steps'
import type { FarmState } from './lib/types'
import { Builder, RiskRail } from './components/builder'

export { planProgress, STEPS }
export type { FarmState }

/** Shape of the `risk` slice in the platform record. `plan` is the Plan Builder state. */
export interface RiskRecord {
  stage?: number
  answers?: Record<string, unknown>
  plan?: Partial<FarmState>
  [key: string]: unknown
}

type SetRisk = (fn: (r: RiskRecord) => RiskRecord) => void

interface ModuleProps {
  risk: RiskRecord
  setRisk: SetRisk
  profile?: MfpProfileLike | null
  fa?: MfpFinancialLike | null
}

/** Resolves the plan the module should render: the saved plan, or a seed from the farm profile. */
export function resolvePlan(risk: RiskRecord, profile?: MfpProfileLike | null, fa?: MfpFinancialLike | null): FarmState {
  return risk?.plan ? hydratePlan(risk.plan) : seedPlanFromMfp(profile, fa)
}

function useRiskStore({ risk, setRisk, profile, fa }: ModuleProps) {
  const plan = useMemo(() => resolvePlan(risk, profile, fa), [risk, profile, fa])
  const onChange = useCallback(
    (fn: (s: FarmState) => FarmState) => setRisk((r) => ({ ...r, plan: fn(resolvePlan(r, profile, fa)) })),
    [setRisk, profile, fa],
  )
  return { plan, onChange }
}

const scrollContainer = () => document.querySelector<HTMLElement>('.mfp-flow-main')

/** Main-column body for the Risk Ready module. */
export function RiskReadyModule(props: ModuleProps) {
  const { plan, onChange } = useRiskStore(props)
  return (
    <StoreProvider state={plan} onChange={onChange} scrollContainer={scrollContainer}>
      <Builder />
    </StoreProvider>
  )
}

/** Step list for the platform's left rail; shares state with RiskReadyModule through the record. */
export function RiskReadyRail(props: ModuleProps) {
  const { plan, onChange } = useRiskStore(props)
  return (
    <StoreProvider state={plan} onChange={onChange} scrollContainer={scrollContainer}>
      <RiskRail />
    </StoreProvider>
  )
}
