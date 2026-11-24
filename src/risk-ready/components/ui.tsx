import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown, Info, Lightbulb } from 'lucide-react'
import { cn } from '../lib/utils'
import { GLOSSARY } from '../lib/steps'
import type { Band, ThreatBand } from '../lib/types'
import { BAND_TEXT } from '../lib/quiz'
import { BAND_LABEL } from '../lib/categories'

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'green' | 'danger'
export function Btn({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'min-h-9 px-3 text-sm' : 'min-h-11 px-4 text-[15px]',
        variant === 'primary' && 'border-brand bg-brand text-primary-foreground hover:bg-navy',
        variant === 'green' && 'border-green bg-green text-primary-foreground hover:opacity-90',
        variant === 'secondary' && 'border-input bg-card text-foreground hover:bg-tint-blue',
        variant === 'ghost' && 'border-transparent bg-transparent text-brand hover:bg-tint-blue',
        variant === 'danger' && 'border-input bg-card text-red hover:bg-tint-red',
        className,
      )}
    />
  )
}

export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={cn('rounded-lg border border-border bg-card p-4 md:p-5', className)}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, sub, id }: { children: ReactNode; sub?: ReactNode; id?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 id={id} className="text-lg font-semibold text-navy text-balance">
        {children}
      </h2>
      {sub && <p className="text-sm text-muted-foreground text-pretty">{sub}</p>}
    </div>
  )
}

export function WhyCard({ children }: { children: ReactNode }) {
  return (
    <aside aria-label="Why this step" className="flex gap-3 rounded-lg border border-border bg-tint-blue p-4">
      <Lightbulb className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-navy">Why this step</p>
        <p className="text-sm leading-relaxed text-foreground text-pretty">{children}</p>
      </div>
    </aside>
  )
}

export function LearnWhy({ children, label = 'Learn why' }: { children: ReactNode; label?: string }) {
  return (
    <details className="group rounded-md border border-border bg-background">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 px-3 text-sm font-medium text-brand [&::-webkit-details-marker]:hidden">
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
        {label}
      </summary>
      <div className="flex flex-col gap-2 px-3 pb-3 text-sm leading-relaxed text-pretty">{children}</div>
    </details>
  )
}

const BAND_STYLE: Record<Band, string> = {
  strong: 'bg-tint-green text-green border-green/40',
  watch: 'bg-tint-amber text-amber-ink border-amber/50',
  vulnerable: 'bg-tint-red text-red border-red/40',
  unscored: 'bg-muted text-muted-foreground border-border',
}
const BAND_DOT: Record<Band, string> = { strong: 'bg-green', watch: 'bg-amber', vulnerable: 'bg-red', unscored: 'bg-grey' }

export function BandBadge({ band }: { band: Band }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold', BAND_STYLE[band])}>
      <span className={cn('size-2 rounded-full', BAND_DOT[band])} aria-hidden />
      {BAND_TEXT[band]}
    </span>
  )
}

const THREAT_BAND: Record<ThreatBand, Band> = { immediate: 'vulnerable', elevated: 'watch', monitor: 'unscored' }
export function ThreatBadge({ band, score }: { band: ThreatBand; score: number }) {
  const b = THREAT_BAND[band]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold', BAND_STYLE[b])}>
      <span className={cn('size-2 rounded-full', BAND_DOT[b])} aria-hidden />
      {score} · {BAND_LABEL[band]}
    </span>
  )
}

export function GapFlag({ status }: { status: 'none' | 'unsure' | 'have' | undefined }) {
  if (status === 'have') return null
  if (status === 'none')
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red/40 bg-tint-red px-2 py-0.5 text-xs font-semibold text-red">
        <span aria-hidden>!</span> No protection in place
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber/50 bg-tint-amber px-2 py-0.5 text-xs font-semibold text-amber-ink">
      <span aria-hidden>?</span> Protection not confirmed
    </span>
  )
}

export function Term({ term, children }: { term: keyof typeof GLOSSARY | string; children?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])
  const def = GLOSSARY[term]
  if (!def) return <>{children ?? term}</>
  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-0.5 border-b border-dotted border-brand font-medium text-brand"
      >
        {children ?? term}
        <Info className="size-3" aria-hidden />
        <span className="sr-only">(definition)</span>
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-1 w-64 max-w-[80vw] rounded-md border border-border bg-card p-3 text-left text-sm font-normal leading-relaxed text-foreground"
        >
          <strong className="block text-navy">{term}</strong>
          {def}
        </span>
      )}
    </span>
  )
}

export const inputClass =
  'min-h-11 w-full rounded-md border border-input bg-card px-3 text-[15px] text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring'

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function NumberField({ id, label, value, onChange, hint, min = 0 }: { id: string; label: string; value: number | null; onChange: (v: number | null) => void; hint?: string; min?: number }) {
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        className={inputClass}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Math.max(min, Number(e.target.value)))}
      />
    </Field>
  )
}

/** Checkbox styled as a selectable tile. Native input keeps it keyboard- and screen-reader-operable. */
export function CheckTile({
  checked,
  onChange,
  label,
  description,
  tag,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  tag?: string
}) {
  return (
    <label
      className={cn(
        'flex min-h-11 cursor-pointer items-start gap-3 rounded-md border bg-card p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring',
        checked ? 'border-brand bg-tint-blue' : 'border-border hover:border-input',
      )}
    >
      <input type="checkbox" className="mt-1 size-4 shrink-0" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {label}
          {tag && <span className="rounded-full bg-tint-green px-2 py-0.5 text-xs font-medium text-green">{tag}</span>}
        </span>
        {description && <span className="text-xs leading-relaxed text-muted-foreground">{description}</span>}
      </span>
    </label>
  )
}

/** Segmented radio group (native radios). */
export function Segmented<T extends string | number>({
  name,
  value,
  onChange,
  options,
  legend,
  srLegend,
}: {
  name: string
  value: T | null | undefined
  onChange: (v: T) => void
  options: { value: T; label: string; tone?: 'good' | 'mid' | 'bad' }[]
  legend: string
  srLegend?: boolean
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className={cn('mb-1.5 text-sm font-medium', srLegend && 'sr-only')}>{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o.value
          return (
            <label
              key={String(o.value)}
              className={cn(
                'flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring',
                !active && 'border-input bg-card hover:bg-tint-blue',
                active && o.tone === 'good' && 'border-green bg-tint-green font-semibold text-green',
                active && o.tone === 'mid' && 'border-amber bg-tint-amber font-semibold text-amber-ink',
                active && o.tone === 'bad' && 'border-red bg-tint-red font-semibold text-red',
                active && !o.tone && 'border-brand bg-tint-blue font-semibold text-brand',
              )}
            >
              <input type="radio" className="sr-only" name={name} checked={active} onChange={() => onChange(o.value)} />
              {active && <span aria-hidden>✓</span>}
              {o.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
