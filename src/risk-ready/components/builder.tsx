import { useState } from 'react'
import { useStore } from '../lib/store'
import { DISCLAIMER } from '../lib/config'
import { STEPS } from '../lib/steps'
import { LAST_STEP, STATUS_TEXT, stepStatus, type StepStatus } from '../lib/progress'
import { Btn, WhyCard } from './ui'
import { CoachSheet, CoachSidebar } from './coach-panel'
import { WelcomeStep } from './steps/welcome-step'
import { OperationStep } from './steps/operation-step'
import { ProtectionsStep } from './steps/protections-step'
import { ReadinessStep } from './steps/readiness-step'
import { RisksStep } from './steps/risks-step'
import { StrategiesStep } from './steps/strategies-step'
import { CommunicateStep } from './steps/communicate-step'
import { PlanStep } from './steps/plan-step'

/**
 * Step list rendered inside the platform's dark left rail. Styled inline to match the other
 * modules' rail items exactly, with the Plan Builder's done / in-progress / not-started dots.
 */
export function RiskRail() {
  const { state, goTo, loadSample, reset } = useStore()
  const [confirming, setConfirming] = useState(false)
  const canReset = state.visited.length > 1 || !!state.profile.farmType
  const dotColor: Record<StepStatus, string> = { done: '#358733', started: '#C98A2C', todo: 'rgba(255,255,255,0.12)' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <nav aria-label="Plan steps" style={{ flex: 1, paddingTop: 4 }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {STEPS.map((s, i) => {
            const st = stepStatus(i, state)
            const active = state.step === i
            return (
              <li key={s.short}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={active ? 'step' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 11,
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    font: 'inherit',
                    border: 'none',
                    background: active ? 'rgba(123,191,50,0.12)' : 'transparent',
                    borderLeft: active ? '3px solid #358733' : '3px solid transparent',
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 21,
                      height: 21,
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      background: active && st === 'todo' ? '#0C4477' : dotColor[st],
                      color: st === 'todo' && !active ? 'rgba(255,255,255,0.5)' : '#fff',
                      boxShadow: active ? '0 0 0 2px rgba(255,255,255,0.35)' : 'none',
                    }}
                  >
                    {st === 'done' ? <RailCheck /> : st === 'started' ? '•' : i === 0 || i === LAST_STEP ? '' : i}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 600, color: active ? '#fff' : st === 'done' ? '#97BC62' : 'rgba(255,255,255,0.72)', lineHeight: 1.35 }}>{s.short}</span>
                    <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.35 }}>{STATUS_TEXT[st]}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
      <div style={{ padding: '8px 16px 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button type="button" onClick={loadSample} style={railLink}>
          Load sample farm
        </button>
        {confirming ? (
          <span role="group" aria-label="Confirm start over" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button type="button" onClick={() => (reset(), setConfirming(false))} style={{ ...railLink, color: '#ffb4ab', fontWeight: 700 }}>
              Erase all answers
            </button>
            <button type="button" onClick={() => setConfirming(false)} style={railLink}>
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} disabled={!canReset} style={{ ...railLink, opacity: canReset ? 1 : 0.45, cursor: canReset ? 'pointer' : 'default' }}>
            Start over
          </button>
        )}
      </div>
    </div>
  )
}

function RailCheck() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

const railLink: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '4px 0',
  font: 'inherit',
  fontSize: 11.5,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.7)',
  textAlign: 'left',
  cursor: 'pointer',
}

function Pager() {
  const { state, goTo } = useStore()
  const i = state.step
  const st = stepStatus(i, state)
  if (i === 0) return null
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between print:hidden">
      <Btn onClick={() => goTo(i - 1)}>Back</Btn>
      {i < LAST_STEP && (
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {st !== 'done' && <span className="text-sm text-muted-foreground sm:mr-2">You can skip and come back — answers are saved with your farm record.</span>}
          <Btn variant="primary" onClick={() => goTo(i + 1)}>
            {st === 'done' ? 'Continue' : 'Skip for now'} to {STEPS[i + 1].short}
          </Btn>
        </div>
      )}
    </div>
  )
}

function StepBody({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <WelcomeStep />
    case 1:
      return <OperationStep />
    case 2:
      return <ProtectionsStep />
    case 3:
      return <ReadinessStep />
    case 4:
      return <RisksStep />
    case 5:
      return <StrategiesStep />
    case 6:
      return <CommunicateStep />
    default:
      return <PlanStep />
  }
}

/**
 * Main-column content of the Risk Ready module. The platform shell supplies the header and
 * the left rail (see RiskRail); this renders the step, its "why" card, the pager and the coach.
 * The coach docks as a sidebar when the column is wide enough, otherwise it is a bottom sheet.
 */
export function Builder() {
  const { state } = useStore()
  const step = Math.min(Math.max(state.step, 0), LAST_STEP)
  const meta = STEPS[step]
  const showCoach = step > 0 && step < LAST_STEP
  const prefillNotice = state.seededFrom === 'mfp' && !state.visited.includes(2)

  return (
    <div className="frr-root @container flex flex-col gap-6">
      <div className="flex gap-8">
        <main id="frr-main" className="flex min-w-0 flex-1 flex-col gap-6 pb-24 @5xl:pb-6 print:pb-0">
          {step > 0 && (
            <div className="flex flex-col gap-3 print:hidden">
              <p className="text-sm text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </p>
              <h1 className="text-balance text-2xl font-semibold text-navy md:text-3xl">{meta.title}</h1>
              {meta.why && <WhyCard>{meta.why}</WhyCard>}
            </div>
          )}
          {prefillNotice && step === 1 && (
            <p role="status" className="rounded-md border border-moss/60 bg-tint-green px-3 py-2 text-sm text-navy">
              We started this step from your Farm Profile and Financial Analysis. Check the farm type, enterprises, state and acres below and change anything that is off.
            </p>
          )}
          <StepBody step={step} />
          <Pager />
        </main>
        {showCoach && <CoachSidebar />}
      </div>
      {showCoach && <CoachSheet />}
      <footer className="border-t border-border pt-4 print:hidden">
        <p className="text-xs leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
      </footer>
    </div>
  )
}
