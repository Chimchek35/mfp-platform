import { useState } from 'react'
import { useStore } from '../../lib/store'
import { categoryDef } from '../../lib/categories'
import { activeAlerts } from '../../lib/plan'
import { STRATEGIES, assignSupports, entryFromRecommendation, rankThreats, recommend, strategyLabel } from '../../lib/strategy'
import type { CatalogRecord } from '../../lib/catalog'
import type { Strategy, StrategyEntry, Threat } from '../../lib/types'
import { cn } from '../../lib/utils'
import { Btn, Card, GapFlag, LearnWhy, SectionTitle, ThreatBadge, inputClass } from '../ui'
import { FactCards, SupportList } from '../supports'
import { InsuranceCalculator } from '../calculator'

export const TOP_N = 6

function StrategyExplainer() {
  return (
    <Card className="flex flex-col gap-3">
      <SectionTitle sub="Every threat gets one of four responses. None is “right” in general — it depends on the threat and what you already have.">The four strategies</SectionTitle>
      <dl className="grid gap-3 md:grid-cols-2">
        {STRATEGIES.map((s) => (
          <div key={s.key} className="rounded-md bg-muted p-3">
            <dt className="font-semibold text-navy">{s.label}</dt>
            <dd className="mt-1 flex flex-col gap-1 text-sm">
              <span>{s.meaning}</span>
              <span className="text-muted-foreground">Farm example: {s.example}</span>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

function RecommendationCard({
  threat,
  score,
  band,
  gapStatus,
  rank,
  supports,
}: {
  threat: Threat
  score: number
  band: 'immediate' | 'elevated' | 'monitor'
  gapStatus: 'have' | 'unsure' | 'none' | undefined
  rank: number
  supports: { record: CatalogRecord; shared: boolean }[]
}) {
  const { state, ctx, update } = useStore()
  const rec = recommend(threat, ctx)
  const entry = state.strategies[threat.id]
  const [editing, setEditing] = useState(false)
  const [calc, setCalc] = useState(false)
  const current: StrategyEntry = entry ?? entryFromRecommendation(rec)
  const recChanged = entry?.seeded && (entry.action !== rec.action || entry.strategy !== rec.strategy)

  const save = (patch: Partial<StrategyEntry>) =>
    update((s) => ({ ...s, strategies: { ...s.strategies, [threat.id]: { ...(s.strategies[threat.id] ?? entryFromRecommendation(rec)), ...patch, seeded: false } } }))

  const chooseStrategy = (k: Strategy) => {
    const other = k === rec.strategy ? rec.action : STRATEGIES.find((x) => x.key === k)!.meaning
    save({ strategy: k, action: entry && !entry.seeded ? entry.action : other })
    setEditing(true)
  }

  const fieldId = (f: string) => `st-${threat.id}-${f}`

  return (
    <li>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">#{rank}</span>
            <ThreatBadge band={band} score={score} />
            {gapStatus !== 'have' && <GapFlag status={gapStatus} />}
            <span className="text-xs text-muted-foreground">{categoryDef(threat.category).label}</span>
          </div>
          <h3 className="text-base font-semibold text-navy">{threat.label}</h3>
        </div>

        <div className={cn('flex flex-col gap-2 rounded-md p-3', entry ? 'bg-tint-green' : 'bg-tint-blue')}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {entry ? (entry.seeded ? 'Accepted recommendation' : 'Your strategy (edited)') : 'Recommended'}
          </p>
          <p className="font-semibold">{strategyLabel(current.strategy)}</p>
          {!editing && <p className="text-sm">{current.action}</p>}
          {!editing && (
            <dl className="grid gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="inline text-muted-foreground">Who’s involved: </dt>
                <dd className="inline">{current.involved}</dd>
              </div>
              <div>
                <dt className="inline text-muted-foreground">Who to inform: </dt>
                <dd className="inline">{current.informed}</dd>
              </div>
            </dl>
          )}
        </div>

        {recChanged && (
          <div className="flex flex-col gap-2 rounded-md bg-tint-amber p-3 text-sm text-amber-ink" role="status">
            <p>Your answers changed, so our recommendation is now: “{rec.action}”. Your saved strategy hasn’t been changed.</p>
            <Btn size="sm" className="self-start" onClick={() => update((s) => ({ ...s, strategies: { ...s.strategies, [threat.id]: entryFromRecommendation(rec) } }))}>
              Use the updated recommendation
            </Btn>
          </div>
        )}

        <div>
          <p className="text-sm font-medium">Why we recommend this</p>
          <ul className="mt-1 flex list-disc flex-col gap-1 pl-5 text-sm">
            {rec.why.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>

        <LearnWhy label="Learn more">
          <div className="flex flex-col gap-2">
            {ctx && threat.ruleId && <p>{STRATEGIES.find((s) => s.key === current.strategy)!.meaning}</p>}
          </div>
        </LearnWhy>

        <SupportList items={supports} />

        {rec.calculator && (
          <div className="flex flex-col gap-3">
            {!calc ? (
              <Btn size="sm" variant="ghost" className="self-start px-0" onClick={() => setCalc(true)}>
                Open the {rec.calculator === 'crop' ? 'crop insurance' : 'livestock risk protection'} calculator
              </Btn>
            ) : (
              <InsuranceCalculator kind={rec.calculator} onClose={() => setCalc(false)} />
            )}
          </div>
        )}

        {editing && (
          <div className="flex flex-col gap-3 rounded-md border border-border p-3">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium">Strategy</legend>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {STRATEGIES.map((s) => (
                  <label key={s.key} className={cn('flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm', current.strategy === s.key ? 'border-brand bg-tint-blue font-medium' : 'border-input')}>
                    <input type="radio" name={fieldId('strategy')} checked={current.strategy === s.key} onChange={() => chooseStrategy(s.key)} />
                    {s.label}
                    {s.key === rec.strategy && <span className="sr-only">(recommended)</span>}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Action</span>
              <textarea className={cn(inputClass, 'min-h-20')} value={current.action} onChange={(e) => save({ action: e.target.value })} />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Who’s involved</span>
                <input className={inputClass} value={current.involved} onChange={(e) => save({ involved: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Who to inform</span>
                <input className={inputClass} value={current.informed} onChange={(e) => save({ informed: e.target.value })} />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Notes</span>
              <textarea className={cn(inputClass, 'min-h-16')} value={current.notes} onChange={(e) => save({ notes: e.target.value })} />
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {!entry && (
            <Btn variant="primary" size="sm" onClick={() => update((s) => ({ ...s, strategies: { ...s.strategies, [threat.id]: entryFromRecommendation(rec) } }))}>
              Accept
            </Btn>
          )}
          <Btn size="sm" aria-expanded={editing} onClick={() => setEditing((e) => !e)}>
            {editing ? 'Done editing' : 'Edit'}
          </Btn>
          {!editing && (
            <Btn size="sm" variant="ghost" onClick={() => setEditing(true)}>
              Choose a different strategy
            </Btn>
          )}
        </div>
      </Card>
    </li>
  )
}

export function StrategiesStep() {
  const { state, ctx, goTo } = useStore()
  const ranked = rankThreats(state.threats, ctx)
  const top = ranked.slice(0, TOP_N)
  const rest = ranked.slice(TOP_N)
  const supportMap = assignSupports(ranked)
  const alerts = activeAlerts(ctx)
  const accepted = top.filter((r) => state.strategies[r.threat.id]).length

  if (!ranked.length) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <p>You haven’t listed any threats yet. Strategies are built from your top-ranked threats.</p>
        <Btn variant="primary" onClick={() => goTo(4)}>
          Go to Your risks
        </Btn>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {alerts.map((a) => (
        <div key={a.id} className="flex flex-col gap-1 rounded-lg border border-amber/40 bg-tint-amber p-4 text-amber-ink" role="note">
          <p className="font-semibold">{a.title}</p>
          <p className="text-sm">{a.detail(ctx)}</p>
        </div>
      ))}
      <FactCards step={5} />
      <StrategyExplainer />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {accepted} of {top.length} strategies confirmed. Nothing is added to your plan until you accept or edit it.
      </p>
      <ol className="flex flex-col gap-4">
        {top.map((r, i) => (
          <RecommendationCard key={r.threat.id} threat={r.threat} score={r.score} band={r.band} gapStatus={r.gap.status} rank={i + 1} supports={supportMap.get(r.threat.id) ?? []} />
        ))}
      </ol>
      {rest.length > 0 && (
        <Card className="flex flex-col gap-2">
          <SectionTitle sub="Lower-ranked threats stay in your register and plan. Revisit them at your next review.">Also on your register</SectionTitle>
          <ul className="flex flex-col gap-1 text-sm">
            {rest.map((r) => (
              <li key={r.threat.id} className="flex flex-wrap items-center gap-2">
                <ThreatBadge band={r.band} score={r.score} />
                {r.threat.label}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
