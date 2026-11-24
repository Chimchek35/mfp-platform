import { useStore } from '../../lib/store'
import { PROTECTIONS, PROTECTION_GROUPS, REVIEW_LABEL } from '../../lib/options'
import { protectionRelevance, startingPosition } from '../../lib/plan'
import { interpretProtections } from '../../lib/voice'
import type { ProtectionStatus, ReviewRecency } from '../../lib/types'
import { Card, Segmented, SectionTitle, Term } from '../ui'
import { TalkItThrough } from '../talk-it-through'
import { FactCards } from '../supports'

const STATUS_OPTIONS: { value: ProtectionStatus; label: string; tone: 'good' | 'mid' | 'bad' }[] = [
  { value: 'have', label: 'Have', tone: 'good' },
  { value: 'unsure', label: 'Not sure', tone: 'mid' },
  { value: 'none', label: 'Don’t have', tone: 'bad' },
]

export function StartingPositionCard() {
  const { ctx, state } = useStore()
  const sp = startingPosition(ctx)
  const answered = sp.total - sp.counts.blank
  const pct = (n: number) => `${(n / sp.total) * 100}%`
  return (
    <Card className="flex flex-col gap-3" aria-live="polite">
      <h2 className="font-semibold text-navy">Starting position</h2>
      <p className="text-sm text-muted-foreground">
        {answered} of {sp.total} answered
      </p>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="bg-green" style={{ width: pct(sp.counts.have) }} />
        <div className="bg-amber" style={{ width: pct(sp.counts.unsure) }} />
        <div className="bg-red" style={{ width: pct(sp.counts.none) }} />
      </div>
      <dl className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-md bg-tint-green p-2">
          <dt className="text-xs text-green">Have</dt>
          <dd className="text-lg font-semibold text-green">{sp.counts.have}</dd>
        </div>
        <div className="rounded-md bg-tint-amber p-2">
          <dt className="text-xs text-amber-ink">Not sure</dt>
          <dd className="text-lg font-semibold text-amber-ink">{sp.counts.unsure}</dd>
        </div>
        <div className="rounded-md bg-tint-red p-2">
          <dt className="text-xs text-red">Don’t have</dt>
          <dd className="text-lg font-semibold text-red">{sp.counts.none}</dd>
        </div>
      </dl>
      {sp.gaps.length > 0 && (
        <div>
          <p className="text-sm font-medium">Gaps that matter for your farm</p>
          <ul className="mt-1 flex flex-col gap-1 text-sm">
            {sp.gaps.map((g) => (
              <li key={g} className="flex gap-2">
                <span className="text-red" aria-hidden>
                  !
                </span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}
      {state.insuranceReview && state.insuranceReview !== 'within12' && (
        <p className="rounded-md bg-tint-amber p-2 text-sm text-amber-ink">Insurance review: {REVIEW_LABEL[state.insuranceReview].toLowerCase()} — we’ll put this at the top of your plan.</p>
      )}
    </Card>
  )
}

export function ProtectionsStep() {
  const { state, ctx, update } = useStore()

  return (
    <div className="flex flex-col gap-6">
      <FactCards step={2} />
      <div className="lg:hidden">
        <StartingPositionCard />
      </div>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_16rem] lg:items-start">
        <div className="flex flex-col gap-6">
          {PROTECTION_GROUPS.map((group) => (
            <Card key={group} className="flex flex-col gap-4">
              <SectionTitle>{group}</SectionTitle>
              <ul className="flex flex-col divide-y divide-border">
                {PROTECTIONS.filter((p) => p.group === group).map((p) => {
                  const less = protectionRelevance(p.key, ctx) === 'less'
                  return (
                    <li key={p.key} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {p.term ? <Term term={p.term}>{p.label}</Term> : p.label}
                        </span>
                        {less && <span className="text-xs text-muted-foreground">Less likely to apply to your operation</span>}
                      </div>
                      <Segmented
                        name={`prot-${p.key}`}
                        legend={p.label}
                        srLegend
                        value={state.protections[p.key]}
                        options={STATUS_OPTIONS}
                        onChange={(v) => update((s) => ({ ...s, protections: { ...s.protections, [p.key]: v } }))}
                      />
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))}
          <Card className="flex flex-col gap-3">
            <SectionTitle sub="When did you last sit down with an agent and go through what is and isn’t covered?">Last insurance review with your agent</SectionTitle>
            <Segmented<ReviewRecency>
              name="insuranceReview"
              legend="Last insurance review"
              srLegend
              value={state.insuranceReview}
              options={[
                { value: 'within12', label: 'Within 12 months', tone: 'good' },
                { value: 'longer', label: 'Longer ago', tone: 'mid' },
                { value: 'never', label: 'Never', tone: 'bad' },
              ]}
              onChange={(v) => update((s) => ({ ...s, insuranceReview: v }))}
            />
          </Card>
          <TalkItThrough
            stepKey="protections"
            prompt="Tell me what coverage and plans you have, don’t have, or aren’t sure about."
            example="We have crop insurance and farm liability, workers comp for our hired man, no cyber, and I'm not sure about an umbrella. Haven't reviewed with our agent in a couple years."
            interpret={interpretProtections}
          />
        </div>
        <div className="sticky top-20 hidden lg:block">
          <StartingPositionCard />
        </div>
      </div>
    </div>
  )
}
