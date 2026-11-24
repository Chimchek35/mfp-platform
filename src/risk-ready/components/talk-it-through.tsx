import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Mic, MicOff, MessageSquareText } from 'lucide-react'
import { useStore } from '../lib/store'
import { uid } from '../lib/context'
import type { Interpretation, Proposal, ProposalOption } from '../lib/voice'
import { cn } from '../lib/utils'
import { Btn, inputClass } from './ui'

/* eslint-disable @typescript-eslint/no-explicit-any */
const getRecognitionCtor = (): any =>
  typeof window === 'undefined' ? null : (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null

const subscribeNoop = () => () => {}

function confidenceLabel(c: number) {
  if (c >= 0.8) return 'High'
  if (c >= 0.6) return 'Medium'
  if (c > 0) return 'Low'
  return 'Not heard'
}

export function TalkItThrough({
  stepKey,
  prompt,
  example,
  interpret,
  commitLabel = 'Apply to my plan',
}: {
  stepKey: string
  prompt: string
  example: string
  interpret: (text: string) => Interpretation
  commitLabel?: string
}) {
  const { update } = useStore()
  const supported = useSyncExternalStore(subscribeNoop, () => !!getRecognitionCtor(), () => true)
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState<{ heard: string; interp: Interpretation; picks: Record<string, number | null> } | null>(null)
  const [applied, setApplied] = useState<string | null>(null)
  const recRef = useRef<any>(null)

  useEffect(() => () => recRef.current?.abort?.(), [])

  const start = () => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results as ArrayLike<any>)
        .map((r: any) => r[0].transcript)
        .join(' ')
      setText(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    setListening(true)
    rec.start()
  }
  const stop = () => recRef.current?.stop?.()

  const run = () => {
    const heard = text.trim()
    if (!heard) return
    const interp = interpret(heard)
    const picks: Record<string, number | null> = {}
    for (const p of interp.proposals) picks[p.id] = p.selected
    setResult({ heard, interp, picks })
    setApplied(null)
  }

  const apply = () => {
    if (!result) return
    const values: Record<string, ProposalOption['value'] | null> = {}
    for (const p of result.interp.proposals) {
      const i = result.picks[p.id]
      values[p.id] = i == null ? null : p.options[i].value
    }
    const heard = result.heard
    update((s) => {
      const next = result.interp.commit(s, values)
      return { ...next, transcripts: [...next.transcripts, { id: uid(), step: s.step, prompt: stepKey, text: heard, at: Date.now() }].slice(-30) }
    })
    setApplied(`Saved. The form above now shows what you confirmed.`)
    setResult(null)
    setText('')
  }

  const inputId = `talk-${stepKey}`
  const unanswered = result?.interp.proposals.filter((p) => result.picks[p.id] == null).length ?? 0

  return (
    <details className="group rounded-lg border border-border bg-card print:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 text-sm font-semibold text-brand [&::-webkit-details-marker]:hidden">
        <MessageSquareText className="size-4" aria-hidden />
        Talk it through instead
        <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">Speak or type</span>
      </summary>
      <div className="flex flex-col gap-3 border-t border-border p-4">
        <p className="text-sm leading-relaxed">{prompt}</p>
        {!supported && (
          <p className="rounded-md bg-tint-amber p-3 text-sm text-amber-ink" role="status">
            Voice input isn’t supported in this browser. You can type your answer instead — it works the same way.
          </p>
        )}
        <label htmlFor={inputId} className="text-sm font-medium">
          What you said
        </label>
        <textarea
          id={inputId}
          rows={3}
          className={cn(inputClass, 'min-h-24 py-2 leading-relaxed')}
          placeholder={example}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              run()
            }
          }}
        />
        <div className="flex flex-wrap gap-2">
          {supported && (
            <Btn onClick={listening ? stop : start} variant={listening ? 'danger' : 'secondary'} aria-pressed={listening}>
              {listening ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
              {listening ? 'Stop listening' : 'Speak'}
            </Btn>
          )}
          <Btn variant="primary" onClick={run} disabled={!text.trim()}>
            Interpret
          </Btn>
        </div>
        <div aria-live="polite" className="flex flex-col gap-3">
          {listening && <p className="text-sm text-muted-foreground">Listening…</p>}
          {applied && <p className="rounded-md bg-tint-green p-3 text-sm text-green">{applied}</p>}
          {result && (
            <div className="flex flex-col gap-3 rounded-md border border-brand/40 bg-tint-blue p-3">
              <div>
                <p className="text-sm font-semibold text-navy">What I heard</p>
                <p className="text-sm italic leading-relaxed">“{result.heard}”</p>
              </div>
              {result.interp.ask && <p className="text-sm font-medium text-amber-ink">{result.interp.ask}</p>}
              {result.interp.proposals.map((p) => (
                <ProposalRow
                  key={p.id}
                  p={p}
                  picked={result.picks[p.id]}
                  onPick={(i) => setResult((r) => (r ? { ...r, picks: { ...r.picks, [p.id]: i } } : r))}
                />
              ))}
              {result.interp.proposals.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Btn variant="green" onClick={apply} disabled={unanswered > 0 && result.interp.proposals.length <= 3}>
                    {commitLabel}
                  </Btn>
                  <Btn onClick={() => setResult(null)}>Discard</Btn>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Nothing is saved until you choose “{commitLabel}”.</p>
            </div>
          )}
        </div>
      </div>
    </details>
  )
}

function ProposalRow({ p, picked, onPick }: { p: Proposal; picked: number | null; onPick: (i: number) => void }) {
  const conf = picked === p.selected ? p.confidence : 1
  return (
    <fieldset className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3">
      <legend className="sr-only">{p.field}</legend>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">{p.field}</p>
        <p className="text-xs text-muted-foreground">
          Confidence: <span className="font-semibold">{picked !== p.selected ? 'You chose' : `${confidenceLabel(conf)}${conf ? ` (${Math.round(conf * 100)}%)` : ''}`}</span>
        </p>
      </div>
      {p.phrases.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Because you said: {p.phrases.map((ph) => `“${ph}”`).join(', ')}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {p.options.map((o, i) => (
          <label
            key={String(o.value)}
            className={cn(
              'flex min-h-9 cursor-pointer items-center rounded-md border px-2.5 text-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring',
              picked === i ? 'border-brand bg-brand font-semibold text-primary-foreground' : 'border-input bg-card hover:bg-tint-blue',
            )}
          >
            <input type="radio" className="sr-only" name={`prop-${p.id}`} checked={picked === i} onChange={() => onPick(i)} />
            {picked === i && <span aria-hidden className="mr-1">✓</span>}
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
