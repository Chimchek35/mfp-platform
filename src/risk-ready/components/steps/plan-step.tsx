import { useStore } from '../../lib/store'
import { categoryDef } from '../../lib/categories'
import { CONTACT, DISCLAIMER, APP } from '../../lib/config'
import { ADJACENT, ENTERPRISES, FARM_TYPES, REVIEW_LABEL, US_STATES } from '../../lib/options'
import { next90Days, startingPosition, supportPlan } from '../../lib/plan'
import { BAND_TEXT, scoreQuiz } from '../../lib/quiz'
import { COVERAGE_DISCLAIMER } from '../../lib/catalog'
import { rankThreats, recommend, strategyLabel } from '../../lib/strategy'
import { BandBadge, Btn, Card, ThreatBadge } from '../ui'
import { ResourceLibrary, SupportItem } from '../supports'

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="border-b border-border pb-1 text-base font-semibold text-navy print:text-black">{children}</h3>
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

export function PlanStep() {
  const { state, ctx } = useStore()
  const p = state.profile
  const sp = startingPosition(ctx)
  const quiz = scoreQuiz(state)
  const ranked = rankThreats(state.threats, ctx)
  const actions = next90Days(ctx)
  const support = supportPlan(ctx)
  const matchedIds = support.groups.flatMap((g) => g.items.map((m) => m.record.id))
  const farmType = p.farmType ? FARM_TYPES.find((f) => f.key === p.farmType)?.label : null
  const stateName = US_STATES.find(([code]) => code === p.state)?.[1] ?? p.state
  const enterprises = p.enterprises.map((k) => ENTERPRISES.find((e) => e.key === k)?.label).filter(Boolean)
  const adjacent = p.adjacent.map((k) => ADJACENT.find((a) => a.key === k)?.label).filter(Boolean)
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">This is your plan, built live from your answers. Print it or save it as a PDF.</p>
        <Btn variant="primary" onClick={() => window.print()}>
          Print or save as PDF
        </Btn>
      </div>

      <article className="plan-doc flex flex-col gap-6 rounded-lg border border-border bg-card p-4 md:p-8 print:border-0 print:p-0" aria-labelledby="plan-title">
        <header className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{APP.name}</p>
          <h2 id="plan-title" className="text-balance text-2xl font-semibold text-navy print:text-black">
            {p.farmName || 'Our farm'} — Farm Risk Ready Plan
          </h2>
          <p className="text-sm text-muted-foreground">
            {[farmType, stateName, p.acres ? `${p.acres.toLocaleString()} acres` : null, p.head ? `${p.head.toLocaleString()} head` : null].filter(Boolean).join(' · ')}
            {' · '}Prepared {today}
          </p>
          {(enterprises.length > 0 || adjacent.length > 0) && (
            <p className="text-sm">
              {enterprises.length > 0 && <>Enterprises: {enterprises.join(', ')}. </>}
              {adjacent.length > 0 && <>Farm-adjacent: {adjacent.join(', ')}.</>}
            </p>
          )}
        </header>

        <section className="plan-section flex flex-col gap-3">
          <H>Next 90 days</H>
          {actions.length ? (
            <ol className="flex flex-col gap-2">
              {actions.map((a, i) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-primary-foreground print:border print:border-black print:bg-transparent print:text-black">{i + 1}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {a.title} <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-normal text-muted-foreground">{a.tag}</span>
                    </span>
                    <span className="text-muted-foreground">{a.detail}</span>
                    <span className="mt-1 print:inline hidden">☐ Done ____ / ____</span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <Empty>Add threats in step 4 to build your action list.</Empty>
          )}
        </section>

        <section className="plan-section flex flex-col gap-3">
          <H>Starting position</H>
          <p className="text-sm">
            Of {sp.total} protections: {sp.counts.have} in place, {sp.counts.unsure} not sure, {sp.counts.none} not in place, {sp.counts.blank} not answered. Last insurance review: {state.insuranceReview ? REVIEW_LABEL[state.insuranceReview] : 'not answered'}.
          </p>
          {sp.gaps.length > 0 && <p className="text-sm">Gaps relevant to this operation: {sp.gaps.join(', ')}.</p>}
        </section>

        <section className="plan-section flex flex-col gap-3">
          <H>Readiness scores</H>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">Overall: {quiz.pct != null ? `${quiz.pct}%` : `${quiz.answered} of 12 answered`}</span>
            <BandBadge band={quiz.band} />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th scope="col" className="py-1 pr-2 font-medium">Area</th>
                <th scope="col" className="py-1 pr-2 font-medium">Score</th>
                <th scope="col" className="py-1 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {quiz.cats.map((c) => (
                <tr key={c.key} className="border-t border-border">
                  <td className="py-1.5 pr-2">{c.label}</td>
                  <td className="py-1.5 pr-2 tabular-nums">{c.pct != null ? `${c.pct}%` : `${c.answered}/${c.total}`}</td>
                  <td className="py-1.5">
                    <BandBadge band={c.band} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {quiz.complete && <p className="text-xs text-muted-foreground">{BAND_TEXT[quiz.band]}</p>}
        </section>

        <section className="plan-section flex flex-col gap-3">
          <H>Revenue operations & dependencies</H>
          {p.revenueOps.length ? (
            <ul className="flex flex-col gap-2 text-sm">
              {p.revenueOps.map((r) => (
                <li key={r.id} className="flex flex-col">
                  <span className="font-medium">
                    {r.name || 'Unnamed operation'} — {r.share}% of revenue
                  </span>
                  <span className="text-muted-foreground">
                    Buyer: {r.buyer || 'not listed'} · Depends on: {r.dependencies || 'not listed'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No revenue operations listed.</Empty>
          )}
          {p.people.length > 0 && <p className="text-sm">People: {p.people.map((x) => `${x.name}${x.role ? ` (${x.role})` : ''}`).join(', ')}.</p>}
        </section>

        <section className="plan-section flex flex-col gap-3">
          <H>Contact sheet</H>
          {state.contacts.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th scope="col" className="py-1 pr-2 font-medium">Role</th>
                    <th scope="col" className="py-1 pr-2 font-medium">Primary</th>
                    <th scope="col" className="py-1 font-medium">Backup</th>
                  </tr>
                </thead>
                <tbody>
                  {state.contacts.map((c) => (
                    <tr key={c.id} className="border-t border-border align-top">
                      <td className="py-1.5 pr-2 font-medium">{c.role || '—'}</td>
                      <td className="py-1.5 pr-2">
                        {c.primaryName || '—'}
                        {c.primaryPhone && <div className="text-muted-foreground">{c.primaryPhone}</div>}
                      </td>
                      <td className="py-1.5">
                        {c.backupName || '—'}
                        {c.backupPhone && <div className="text-muted-foreground">{c.backupPhone}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>No contacts yet — add them in step 6.</Empty>
          )}
          <p className="text-sm">Copies of this plan: {state.planHolders || 'not recorded'}.</p>
        </section>

        <section className="plan-section flex flex-col gap-3">
          <H>Threats & strategies (sorted by score)</H>
          {ranked.length ? (
            <ul className="flex flex-col gap-3">
              {ranked.map((r) => {
                const entry = state.strategies[r.threat.id]
                const rec = recommend(r.threat, ctx)
                return (
                  <li key={r.threat.id} className="plan-row flex flex-col gap-1 border-t border-border pt-2 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <ThreatBadge band={r.band} score={r.score} />
                      <span className="font-medium">{r.threat.label}</span>
                      <span className="text-muted-foreground">· {categoryDef(r.threat.category).label}</span>
                      {r.gap.status === 'none' && <span className="text-red">· No protection in place</span>}
                    </div>
                    <p>
                      <span className="font-medium">{strategyLabel(entry?.strategy ?? rec.strategy)}:</span> {entry?.action || rec.action}
                      {!entry && <span className="text-muted-foreground"> (recommended — not yet confirmed)</span>}
                    </p>
                    {entry && (
                      <p className="text-muted-foreground">
                        Involved: {entry.involved || '—'} · Inform: {entry.informed || '—'}
                        {entry.notes && ` · Notes: ${entry.notes}`}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <Empty>No threats listed yet.</Empty>
          )}
        </section>

        <section className="plan-section flex flex-col gap-3">
          <H>Training & review</H>
          {state.training.length ? (
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
              {state.training.map((t) => (
                <li key={t.id}>
                  {t.topic || 'Untitled'} — {t.audience} {t.when && `· ${t.when}`}
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No training scheduled yet.</Empty>
          )}
          <p className="text-sm">
            Review: {state.reviewCadence === 'annual' ? 'annually' : state.reviewCadence === 'semiannual' ? 'twice a year' : 'quarterly'}
            {state.reviewAfterChange && ', and after any major change'}. Next insurance review: {state.nextInsuranceReview || 'not scheduled'}.
          </p>
        </section>

        <section className="plan-section flex flex-col gap-4" aria-labelledby="support-plan">
          <div className="flex flex-col gap-1">
            <h3 id="support-plan" className="border-b border-border pb-1 text-base font-semibold text-navy print:text-black">
              Your farm&apos;s support plan
            </h3>
            <p className="text-sm text-muted-foreground">
              {support.total} Nationwide programs, checklists, consultations and partner offers matched to your answers. The first five apply to every farm.
            </p>
          </div>
          {support.groups.map((g) =>
            g.key === 'coverage' ? (
              <div key={g.key} className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold">{g.title}</h4>
                {support.agentQuestions.length ? (
                  <div className="flex flex-col gap-3">
                    {support.agentQuestions.map((grp) => (
                      <div key={grp.module} className="flex flex-col gap-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{grp.module}</p>
                        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed">
                          {grp.questions.map((q) => (
                            <li key={q.id}>
                              {q.exclusion && <span className="font-medium text-amber-ink">Not covered: </span>}
                              {q.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty>Pick a farm type and enterprises in step 1 to generate questions.</Empty>
                )}
                {g.items.length > 0 && (
                  <ul className="grid gap-3 md:grid-cols-2">
                    {g.items.map((m) => (
                      <li key={m.record.id}>
                        <SupportItem record={m.record} reason={m.reason} />
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground">{COVERAGE_DISCLAIMER}</p>
              </div>
            ) : g.items.length ? (
              <div key={g.key} className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold">{g.title}</h4>
                {g.key === 'consultations' && (
                  <p className="text-sm">
                    Free for Nationwide policyholders. Request through the {CONTACT.teamName}: {CONTACT.phone} or {CONTACT.email}.
                  </p>
                )}
                <ul className="grid gap-3 md:grid-cols-2">
                  {g.items.map((m) => (
                    <li key={m.record.id}>
                      <SupportItem record={m.record} reason={m.reason} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        </section>

        <footer className="flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <p>{DISCLAIMER}</p>
        </footer>
      </article>

      <ResourceLibrary matchedIds={matchedIds} />

      <Card className="flex flex-col gap-3 bg-tint-blue print:hidden">
        <h3 className="text-lg font-semibold text-navy">Talk it over with an agent or the {CONTACT.teamName}</h3>
        <p className="text-sm">Bring this plan to your agent. They can confirm what your policies actually cover, check limits and exclusions, and help close the gaps flagged above.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a href={CONTACT.phoneHref} className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-primary-foreground hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Call {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-card px-4 text-sm font-semibold text-brand hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            Email {CONTACT.email}
          </a>
        </div>
      </Card>
    </div>
  )
}
