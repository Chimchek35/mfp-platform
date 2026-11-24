import { Clock, Save, ListChecks, Tractor } from 'lucide-react'
import { useStore } from '../../lib/store'
import { APP, RESILIENCY_STAT } from '../../lib/config'
import { STEPS } from '../../lib/steps'
import { Btn, Card } from '../ui'

export function WelcomeStep() {
  const { goTo, loadSample, state } = useStore()
  const started = state.updatedAt != null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-green">Farm Risk Ready</p>
        <h1 className="text-3xl font-semibold leading-tight text-navy text-balance md:text-4xl">
          Build a risk plan that starts from your farm — not a generic checklist.
        </h1>
        <p className="max-w-2xl text-pretty leading-relaxed">
          A Farm Risk Ready plan is a written record of what could go wrong on your operation, how serious each risk is, what you
          will do about it, and who needs to know. We start from what you already run and already have in place, explain why each
          risk matters for your farm, and recommend the next step. You confirm or change every recommendation.
        </p>
      </div>

      <Card className="flex flex-col gap-2 border-green/40 bg-tint-green md:flex-row md:items-center md:gap-6">
        <p className="text-4xl font-semibold text-green">{RESILIENCY_STAT.value}</p>
        <div>
          <p className="font-medium text-pretty">
            {RESILIENCY_STAT.text} A plan written before a fire, injury or bad market is what lets a farm keep running after one.
          </p>
          <p className="text-xs text-muted-foreground">{RESILIENCY_STAT.source}</p>
        </div>
      </Card>

      <ul className="grid gap-3 md:grid-cols-3">
        <li className="flex gap-3 rounded-lg border border-border bg-card p-4">
          <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-semibold">About {APP.timeEstimate.replace('~', '')}</p>
            <p className="text-sm text-muted-foreground">Skip any step and come back to it.</p>
          </div>
        </li>
        <li className="flex gap-3 rounded-lg border border-border bg-card p-4">
          <Save className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-semibold">Saves automatically</p>
            <p className="text-sm text-muted-foreground">Answers save with your farm record as you go.</p>
          </div>
        </li>
        <li className="flex gap-3 rounded-lg border border-border bg-card p-4">
          <ListChecks className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
          <div>
            <p className="font-semibold">You stay in control</p>
            <p className="text-sm text-muted-foreground">Nothing is added to your plan until you accept it.</p>
          </div>
        </li>
      </ul>

      <Card>
        <h2 className="mb-3 font-semibold text-navy">What you’ll do</h2>
        <ol className="grid gap-2 sm:grid-cols-2">
          {STEPS.slice(1).map((s, i) => (
            <li key={s.title} className="flex items-center gap-3 text-sm">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-tint-blue text-xs font-semibold text-brand">{i + 1}</span>
              {s.title}
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Btn variant="primary" onClick={() => goTo(started ? Math.max(1, state.step) : 1)}>
          {started ? 'Continue my plan' : 'Start with my operation'}
        </Btn>
        <Btn onClick={loadSample}>
          <Tractor className="size-4" aria-hidden />
          Load sample farm
        </Btn>
      </div>
      <p className="text-xs text-muted-foreground">
        Sample farm: Ohio corn & soybeans plus a 150-head cow-calf herd, two hired employees, grain bins, trucks on the road and
        precision ag — with crop insurance but no written emergency plan or cyber coverage.
      </p>
    </div>
  )
}
