import { useState } from 'react'
import { useStore } from '../../lib/store'
import { CATEGORIES, PROBABILITY_LEVELS, SEVERITY_LEVELS, classify, categoryDef, examplesFor, rankedCategories, threatBand, threatScore } from '../../lib/categories'
import { uid } from '../../lib/context'
import { suggestedRules } from '../../lib/plan'
import { RULES, type Rule } from '../../lib/rules'
import { gapFor, protectionLabel } from '../../lib/strategy'
import { interpretThreat } from '../../lib/voice'
import type { Threat, ThreatCategory } from '../../lib/types'
import { cn } from '../../lib/utils'
import { Btn, Card, GapFlag, LearnWhy, SectionTitle, ThreatBadge, inputClass } from '../ui'
import { TalkItThrough } from '../talk-it-through'
import { FactCards } from '../supports'

function Slider({ id, label, value, onChange, levels }: { id: string; label: string; value: number; onChange: (v: number) => void; levels: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">{value} of 5</span>
      </label>
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value} — ${levels[value - 1]}`}
        className="w-full accent-[var(--brand)]"
      />
      <p className="text-xs text-muted-foreground">{levels[value - 1]}</p>
    </div>
  )
}

function ScoreSliders({ idBase, probability, severity, onChange }: { idBase: string; probability: number; severity: number; onChange: (p: number, s: number) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Slider id={`${idBase}-p`} label="How likely?" value={probability} levels={PROBABILITY_LEVELS} onChange={(v) => onChange(v, severity)} />
      <Slider id={`${idBase}-s`} label="How bad if it happens?" value={severity} levels={SEVERITY_LEVELS} onChange={(v) => onChange(probability, v)} />
    </div>
  )
}

function ThreatRow({ threat }: { threat: Threat }) {
  const { ctx, update } = useStore()
  const score = threatScore(threat.probability, threat.severity)
  const gap = gapFor(threat, ctx)
  const set = (patch: Partial<Threat>) => update((s) => ({ ...s, threats: s.threats.map((t) => (t.id === threat.id ? { ...t, ...patch } : t)) }))
  return (
    <li className="flex flex-col gap-3 rounded-md border border-border bg-card p-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <label className="flex flex-1 flex-col gap-1">
          <span className="sr-only">Threat description</span>
          <input className={inputClass} value={threat.label} onChange={(e) => set({ label: e.target.value })} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <ThreatBadge band={threatBand(score)} score={score} />
          {gap.status !== 'have' && <GapFlag status={gap.status} />}
        </div>
      </div>
      <ScoreSliders idBase={threat.id} probability={threat.probability} severity={threat.severity} onChange={(p, s) => set({ probability: p, severity: s })} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Category</span>
          <select className={cn(inputClass, 'min-h-9 w-auto py-1')} value={threat.category} onChange={(e) => set({ category: e.target.value as ThreatCategory })}>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-muted-foreground">Matched protection: {protectionLabel(gap.key)}</p>
        <Btn
          size="sm"
          variant="danger"
          onClick={() =>
            update((s) => {
              const strategies = { ...s.strategies }
              delete strategies[threat.id]
              return { ...s, threats: s.threats.filter((t) => t.id !== threat.id), strategies }
            })
          }
        >
          Remove
        </Btn>
      </div>
    </li>
  )
}

function SuggestionCard({ rule }: { rule: Rule }) {
  const { ctx, update } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(rule.threat)
  const status = rule.protection ? ctx.protection(rule.protection) : undefined
  const score = threatScore(draft.probability, draft.severity)

  const accept = (t = draft) =>
    update((s) => ({
      ...s,
      threats: [...s.threats, { id: uid(), label: t.label, category: t.category, probability: t.probability, severity: t.severity, source: 'suggested', ruleId: rule.id }],
    }))

  return (
    <li className="flex flex-col gap-3 rounded-md border border-dashed border-brand/40 bg-tint-blue p-3">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Suggested for your farm</p>
        {editing ? (
          <label className="flex flex-col gap-1 text-sm">
            <span className="sr-only">Edit threat</span>
            <input className={inputClass} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          </label>
        ) : (
          <p className="font-medium">{rule.threat.label}</p>
        )}
        <p className="text-sm text-muted-foreground">Because {rule.because(ctx)}.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ThreatBadge band={threatBand(score)} score={score} />
        {rule.protection && status !== 'have' && <GapFlag status={status} />}
        {rule.protection && status === 'have' && <span className="text-xs text-green">You have {protectionLabel(rule.protection).toLowerCase()}</span>}
      </div>
      {editing && <ScoreSliders idBase={`sug-${rule.id}`} probability={draft.probability} severity={draft.severity} onChange={(p, s) => setDraft({ ...draft, probability: p, severity: s })} />}
      <LearnWhy>{rule.learn}</LearnWhy>
      <div className="flex flex-wrap gap-2">
        <Btn size="sm" variant="primary" onClick={() => accept()}>
          {editing ? 'Add to my plan' : 'Accept'}
        </Btn>
        {!editing && (
          <Btn size="sm" onClick={() => setEditing(true)}>
            Edit first
          </Btn>
        )}
        <Btn size="sm" variant="ghost" onClick={() => update((s) => ({ ...s, dismissedRules: [...s.dismissedRules, rule.id] }))}>
          Dismiss
        </Btn>
      </div>
    </li>
  )
}

function AddOwn({ category, placeholder }: { category?: ThreatCategory; placeholder: string }) {
  const { update } = useStore()
  const [text, setText] = useState('')
  const guess = category ? null : classify(text)
  const [override, setOverride] = useState<ThreatCategory | ''>('')
  const finalCat = category ?? (override || guess?.category || null)
  const id = `add-${category ?? 'any'}`

  const add = () => {
    if (!text.trim() || !finalCat) return
    update((s) => ({ ...s, threats: [...s.threats, { id: uid(), label: text.trim(), category: finalCat, probability: 3, severity: 3, source: 'custom' }] }))
    setText('')
    setOverride('')
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        add()
      }}
    >
      <label htmlFor={id} className="text-sm font-medium">
        {category ? 'Add your own' : 'Describe a risk in your own words'}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input id={id} className={inputClass} value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)} />
        <Btn type="submit" variant="primary" disabled={!text.trim() || !finalCat} className="shrink-0">
          Add
        </Btn>
      </div>
      {!category && text.trim() && (
        <div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
          {guess?.category ? (
            <span>
              Sounds like <strong>{categoryDef(guess.category).label}</strong>
              <span className="text-muted-foreground"> (heard: {guess.matches.join(', ')})</span>
            </span>
          ) : (
            <span className="text-amber-ink">We couldn’t tell the category — please pick one.</span>
          )}
          <label className="flex items-center gap-1">
            <span className="sr-only">Category</span>
            <select className={cn(inputClass, 'min-h-9 w-auto py-1')} value={override} onChange={(e) => setOverride(e.target.value as ThreatCategory | '')}>
              <option value="">{guess?.category ? 'Keep this category' : 'Choose category'}</option>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </form>
  )
}

function CoverageMeter() {
  const { state } = useStore()
  const covered = new Set(state.threats.map((t) => t.category))
  const missing = CATEGORIES.filter((c) => !covered.has(c.key))
  return (
    <Card className="flex flex-col gap-3" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-navy">
          {covered.size} of 8 risk areas covered
        </h2>
        <span className="text-sm text-muted-foreground">{state.threats.length} threats listed</span>
      </div>
      <ol className="grid grid-cols-8 gap-1" aria-hidden>
        {CATEGORIES.map((c) => (
          <li key={c.key} className={cn('h-2 rounded-full', covered.has(c.key) ? 'bg-green' : 'bg-muted')} />
        ))}
      </ol>
      {missing.length > 0 ? (
        <p className="text-sm">
          Not yet covered:{' '}
          {missing.map((m, i) => (
            <span key={m.key}>
              <a href={`#cat-${m.key}`} className="text-brand underline underline-offset-2">
                {m.label}
              </a>
              {i < missing.length - 1 ? ', ' : ''}
            </span>
          ))}
          . Even one entry per area makes the plan stronger.
        </p>
      ) : (
        <p className="text-sm text-green">Every risk area has at least one entry.</p>
      )}
    </Card>
  )
}

const LEVEL_TEXT = { high: 'High relevance for you', medium: 'Relevant for you', standard: 'Standard — check anyway' }
const LEVEL_CLASS = { high: 'bg-tint-amber text-amber-ink', medium: 'bg-tint-blue text-brand', standard: 'bg-muted text-muted-foreground' }

export function RisksStep() {
  const { state, ctx, update } = useStore()
  const suggestions = suggestedRules(ctx)
  const dismissed = state.dismissedRules.map((id) => RULES.find((r) => r.id === id)).filter((r): r is Rule => !!r && r.when(ctx))

  return (
    <div className="flex flex-col gap-6">
      <FactCards step={4} />
      <CoverageMeter />

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Type a worry the way you’d say it. We’ll sort it into a risk area — you can change it.">Add your own</SectionTitle>
        <AddOwn placeholder="e.g. our grain buyer goes under, prices below breakeven" />
      </Card>

      <TalkItThrough
        stepKey="threats"
        prompt="Tell me about something that worries you — what could happen, how likely, and how bad."
        example="Pretty likely we get hail every few years, and a bad one would wipe us out honestly."
        interpret={interpretThreat}
        commitLabel="Add this threat"
      />

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-navy">Risk areas, most relevant to your farm first</h2>
        <p className="text-sm text-muted-foreground">Ordered by your farm type, enterprises, side businesses and assets. All 8 are always here.</p>
      </div>

      {rankedCategories(ctx).map(({ def, rel }) => {
        const catSuggestions = suggestions.filter((r) => r.threat.category === def.key)
        const catThreats = state.threats.filter((t) => t.category === def.key)
        return (
          <section key={def.key} id={`cat-${def.key}`} aria-labelledby={`cat-${def.key}-h`} className="scroll-mt-24">
            <Card className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 id={`cat-${def.key}-h`} className="text-base font-semibold text-navy">
                    {def.label}
                  </h3>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', LEVEL_CLASS[rel.level])}>{LEVEL_TEXT[rel.level]}</span>
                </div>
                <p className="text-sm text-muted-foreground">{def.question}</p>
                {rel.reasons.length > 0 && <p className="text-sm">Why it matters for you: {rel.reasons.join('; ')}.</p>}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Examples</p>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {examplesFor(def.key, ctx).map((ex) => (
                    <li key={ex.text}>
                      <button
                        type="button"
                        className={cn('rounded-full border px-3 py-1 text-left text-sm hover:bg-tint-blue focus-visible:outline-2 focus-visible:outline-ring', ex.tailored ? 'border-brand/40 text-brand' : 'border-border')}
                        onClick={() =>
                          update((s) => ({ ...s, threats: [...s.threats, { id: uid(), label: ex.text, category: def.key, probability: 3, severity: 3, source: 'custom' }] }))
                        }
                      >
                        <span className="sr-only">Add example: </span>+ {ex.text}
                        {ex.tailored && <span className="sr-only"> (matched to your farm)</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {catSuggestions.length > 0 && (
                <ul className="flex flex-col gap-3" aria-label={`Suggested ${def.label} threats`}>
                  {catSuggestions.map((r) => (
                    <SuggestionCard key={r.id} rule={r} />
                  ))}
                </ul>
              )}

              {catThreats.length > 0 && (
                <ul className="flex flex-col gap-3" aria-label={`Your ${def.label} threats`}>
                  {catThreats.map((t) => (
                    <ThreatRow key={t.id} threat={t} />
                  ))}
                </ul>
              )}

              <AddOwn category={def.key} placeholder={`Another ${def.label.toLowerCase()} risk`} />
            </Card>
          </section>
        )
      })}

      {dismissed.length > 0 && (
        <Card className="flex flex-col gap-2">
          <SectionTitle>Dismissed suggestions</SectionTitle>
          <ul className="flex flex-col gap-2">
            {dismissed.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span>{r.threat.label}</span>
                <Btn size="sm" variant="ghost" onClick={() => update((s) => ({ ...s, dismissedRules: s.dismissedRules.filter((x) => x !== r.id) }))}>
                  Restore
                </Btn>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
