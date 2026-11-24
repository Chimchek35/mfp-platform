import { useMemo, useRef, useState } from 'react'
import { BookOpen, ExternalLink, X } from 'lucide-react'
import {
  AGTECH_NOTE,
  CATALOG,
  COVERAGE_DISCLAIMER,
  FORMATS,
  HEADLINE_FACTS,
  PROGRAM_SHEETS,
  SUPPORT_TYPE_LABEL,
  TOPICS,
  getRecord,
  type CatalogRecord,
  type SupportType,
} from '../lib/catalog'
import { useStore } from '../lib/store'
import { cn } from '../lib/utils'
import { Btn, Card, SectionTitle } from './ui'

const TYPE_TONE: Record<SupportType, string> = {
  program: 'bg-tint-green text-strong',
  training: 'bg-tint-green text-strong',
  tip: 'bg-tint-green text-strong',
  checklist: 'bg-tint-blue text-brand',
  plan_action: 'bg-tint-blue text-brand',
  consultation: 'bg-tint-blue text-navy',
  agtech: 'bg-tint-amber text-foreground',
  coverage_review: 'bg-tint-amber text-foreground',
}

export function TypeLabel({ type }: { type: SupportType }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-xs font-medium', TYPE_TONE[type])}>
      {SUPPORT_TYPE_LABEL[type]}
    </span>
  )
}

function ExtLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('inline-flex items-start gap-1.5 font-medium text-brand underline-offset-2 hover:underline', className)}
    >
      <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  )
}

/** The fine print a support must always carry (coverage and partner discounts). */
export function SupportNote({ record }: { record: CatalogRecord }) {
  if (record.type === 'coverage_review') return <p className="text-xs leading-relaxed text-muted-foreground">{COVERAGE_DISCLAIMER}</p>
  if (record.type === 'agtech') return <p className="text-xs text-muted-foreground">{record.offer ? `${record.offer} · ` : ''}{AGTECH_NOTE}</p>
  return null
}

/** Compact support row used on threat and strategy cards and in the plan. */
export function SupportItem({ record, reason, shared }: { record: CatalogRecord; reason?: string; shared?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <TypeLabel type={record.type} />
        <ExtLink href={record.url} className="text-sm">
          {record.title}
        </ExtLink>
      </div>
      <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{record.summary}</p>
      {reason && <p className="text-xs text-muted-foreground">{reason}</p>}
      {shared && <p className="text-xs text-muted-foreground">Also listed on a higher-ranked threat.</p>}
      <SupportNote record={record} />
      {record.contact && <p className="text-xs text-muted-foreground">Contact: {record.contact}</p>}
      {record.sheet && PROGRAM_SHEETS[record.sheet] && <SheetButton sheetId={record.sheet} />}
    </div>
  )
}

export function SupportList({ items }: { items: { record: CatalogRecord; shared?: boolean }[] }) {
  if (!items.length) return null
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Support that fits ({items.length})</p>
      <ul className="flex flex-col gap-3 rounded-md border border-border bg-background p-3">
        {items.map(({ record, shared }) => (
          <li key={record.id}>
            <SupportItem record={record} shared={shared} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------
 * Teaching sheets
 * --------------------------------------------------------------------------------------------- */

export function SheetButton({ sheetId, label }: { sheetId: string; label?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const sheet = PROGRAM_SHEETS[sheetId]
  if (!sheet) return null
  return (
    <>
      <Btn size="sm" variant="ghost" className="self-start px-0 print:hidden" onClick={() => ref.current?.showModal()}>
        <BookOpen className="size-4" aria-hidden />
        {label ?? `Open the ${sheet.title} teaching sheet`}
      </Btn>
      <dialog
        ref={ref}
        aria-labelledby={`sheet-${sheetId}`}
        className="m-auto w-[min(40rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-2rem)] rounded-lg border border-border bg-card p-0 text-foreground backdrop:bg-navy/50"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close()
        }}
      >
        <SheetBody sheetId={sheetId} onClose={() => ref.current?.close()} />
      </dialog>
    </>
  )
}

export function SheetBody({ sheetId, onClose }: { sheetId: string; onClose?: () => void }) {
  const sheet = PROGRAM_SHEETS[sheetId]
  if (!sheet) return null
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <TypeLabel type="program" />
          <h2 id={`sheet-${sheetId}`} className="text-xl font-semibold text-balance text-navy">
            {sheet.title}
          </h2>
        </div>
        {onClose && (
          <Btn size="sm" variant="ghost" aria-label="Close teaching sheet" onClick={onClose}>
            <X className="size-4" aria-hidden />
          </Btn>
        )}
      </div>
      <p className="leading-relaxed text-pretty">{sheet.intro}</p>
      {sheet.sections.map((s) => (
        <section key={s.heading} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-navy">{s.heading}</h3>
          <ul className="flex flex-col gap-2">
            {s.items.map((it) => (
              <li key={it.term} className="flex gap-3">
                {it.marker && (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-navy text-sm font-bold text-primary-foreground" aria-hidden>
                    {it.marker}
                  </span>
                )}
                <div className="flex flex-col text-sm leading-relaxed">
                  <span className="font-medium">{it.term}</span>
                  {it.text && <span className="text-muted-foreground">{it.text}</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {sheet.links.length > 0 && (
        <section className="flex flex-col gap-2 border-t border-border pt-3">
          <h3 className="text-sm font-semibold text-navy">Go deeper</h3>
          <ul className="flex flex-col gap-2">
            {sheet.links
              .map(getRecord)
              .filter((r): r is CatalogRecord => !!r)
              .map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2">
                  <TypeLabel type={r.type} />
                  <ExtLink href={r.url} className="text-sm">
                    {r.title}
                  </ExtLink>
                </li>
              ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------
 * Education fact cards (Section 1)
 * --------------------------------------------------------------------------------------------- */

export function FactCards({ step, topics }: { step: number; topics?: Partial<Record<'atv' | 'fire' | 'property' | 'safety', boolean>> }) {
  const { state } = useStore()
  const applies = { atv: !!state.profile.assets.atvs, ...topics }
  const facts = HEADLINE_FACTS.filter((f) => f.steps.includes(step) && (!f.topic || applies[f.topic] !== false))
  if (!facts.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {facts.map((f) => (
        <figure key={f.id} className="flex flex-col gap-1 rounded-lg border border-border bg-tint-blue p-4">
          <p className="text-2xl font-bold text-navy">{f.value}</p>
          <blockquote className="text-sm leading-relaxed text-pretty">{f.text}</blockquote>
          <figcaption className="text-xs text-muted-foreground">{f.source}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------------------------------
 * Resource library (Section 8 taxonomy)
 * --------------------------------------------------------------------------------------------- */

const ALL_TYPES = Object.keys(SUPPORT_TYPE_LABEL) as SupportType[]

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-9 rounded-full border px-3 text-sm transition-colors',
        active ? 'border-navy bg-navy text-primary-foreground' : 'border-border bg-card text-foreground hover:border-brand',
      )}
    >
      {children}
    </button>
  )
}

export function ResourceLibrary({ matchedIds }: { matchedIds: string[] }) {
  const [onlyMatched, setOnlyMatched] = useState(true)
  const [topic, setTopic] = useState<string | null>(null)
  const [type, setType] = useState<SupportType | null>(null)
  const [format, setFormat] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const matched = useMemo(() => new Set(matchedIds), [matchedIds])

  const results = CATALOG.filter((r) => {
    if (onlyMatched && !matched.has(r.id)) return false
    if (topic && !r.taxonomy.topic.includes(topic as never)) return false
    if (type && r.type !== type) return false
    if (format && r.taxonomy.format !== format) return false
    if (query) {
      const q = query.toLowerCase()
      if (!`${r.title} ${r.summary} ${r.triggers.join(' ')}`.toLowerCase().includes(q)) return false
    }
    return true
  })
  const topicsInUse = TOPICS.filter((t) => CATALOG.some((r) => r.taxonomy.topic.includes(t)))
  const formatsInUse = FORMATS.filter((f) => CATALOG.some((r) => r.taxonomy.format === f))

  return (
    <Card className="flex flex-col gap-4 print:hidden" id="library">
      <SectionTitle sub={`Every Nationwide resource in this tool (${CATALOG.length}). It starts filtered to the ${matched.size} that match your farm.`}>Resource library</SectionTitle>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Scope">
          <FilterChip active={onlyMatched} onClick={() => setOnlyMatched(true)}>
            Matched to my farm ({matched.size})
          </FilterChip>
          <FilterChip active={!onlyMatched} onClick={() => setOnlyMatched(false)}>
            Everything ({CATALOG.length})
          </FilterChip>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Search
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. grain, fire, roads"
            className="min-h-10 rounded-md border border-border bg-card px-3 text-base font-normal"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">Topic</legend>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={!topic} onClick={() => setTopic(null)}>
              All
            </FilterChip>
            {topicsInUse.map((t) => (
              <FilterChip key={t} active={topic === t} onClick={() => setTopic(topic === t ? null : t)}>
                {t}
              </FilterChip>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Kind of support
            <select value={type ?? ''} onChange={(e) => setType((e.target.value || null) as SupportType | null)} className="min-h-10 rounded-md border border-border bg-card px-2 text-base font-normal">
              <option value="">All kinds</option>
              {ALL_TYPES.filter((t) => CATALOG.some((r) => r.type === t)).map((t) => (
                <option key={t} value={t}>
                  {SUPPORT_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Format
            <select value={format ?? ''} onChange={(e) => setFormat(e.target.value || null)} className="min-h-10 rounded-md border border-border bg-card px-2 text-base font-normal">
              <option value="">All formats</option>
              {formatsInUse.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {results.length} {results.length === 1 ? 'resource' : 'resources'}
      </p>
      {results.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {results.map((r) => (
            <li key={r.id} className="flex flex-col gap-1 rounded-md border border-border bg-background p-3">
              <SupportItem record={r} />
              <p className="text-xs text-muted-foreground">
                {r.taxonomy.topic.join(' · ')} — {r.taxonomy.format}
                {matched.has(r.id) ? ' — matched to your farm' : ''}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">No resources match these filters.</p>
      )}
    </Card>
  )
}
