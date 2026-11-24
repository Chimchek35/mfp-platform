import { useState } from 'react'
import { createPortal } from 'react-dom'
import useSWRMutation from 'swr/mutation'
import { MessageCircle, Sparkles, X } from 'lucide-react'
import { useStore } from '../lib/store'
import { coachTips } from '../lib/steps'
import { AI_LABEL } from '../lib/config'
import { buildCoachRequest, type CoachRequest } from '../lib/coach-request'
import { Btn } from './ui'

async function askCoach(url: string, { arg }: { arg: CoachRequest }) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(arg) })
  if (!res.ok) throw new Error('Coach unavailable')
  return (await res.json()) as { source: 'ai' | 'rules'; text: string }
}

function CoachBody() {
  const { state, ctx } = useStore()
  const tips = coachTips(state.step, ctx)
  const { trigger, data, isMutating, error, reset } = useSWRMutation('/api/coach', askCoach)
  const [askedStep, setAskedStep] = useState<number | null>(null)
  const showAnswer = data && askedStep === state.step

  return (
    <div className="flex flex-col gap-3">
      {tips.length === 0 && <p className="text-sm text-muted-foreground">Keep going — tips appear as you answer.</p>}
      {tips.map((t) => (
        <div key={t.title} className="rounded-md border border-border bg-tint-green p-3">
          <p className="text-sm font-semibold text-navy">{t.title}</p>
          <p className="text-sm leading-relaxed">{t.body}</p>
        </div>
      ))}
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <Btn
          size="sm"
          variant="ghost"
          className="justify-start px-0"
          disabled={isMutating}
          onClick={() => {
            reset()
            setAskedStep(state.step)
            trigger(buildCoachRequest(state, state.step, tips)).catch(() => {})
          }}
        >
          <Sparkles className="size-4" aria-hidden />
          {isMutating ? 'Thinking…' : 'Explain this step for my farm'}
        </Btn>
        <div aria-live="polite">
          {error && askedStep === state.step && <p className="text-sm text-red">The coach couldn’t answer right now. The tips above still apply.</p>}
          {showAnswer && (
            <div className="rounded-md border border-border bg-background p-3">
              {data.source === 'ai' ? (
                <p className="mb-1 text-xs font-semibold text-amber-ink">{AI_LABEL}</p>
              ) : (
                <p className="mb-1 text-xs font-semibold text-muted-foreground">From the plan rules (AI not configured)</p>
              )}
              <p className="text-sm leading-relaxed">{data.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CoachSidebar() {
  return (
    <aside aria-labelledby="coach-title" className="sticky top-4 flex w-72 shrink-0 flex-col gap-3 self-start print:hidden">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 id="coach-title" className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
          <MessageCircle className="size-4" aria-hidden /> Your coach
        </h2>
        <CoachBody />
      </div>
    </aside>
  )
}

/**
 * Rendered through a portal: the platform shell's animated main column acts as the containing
 * block for `position: fixed`, which would otherwise pin the sheet inside that column.
 */
export function CoachSheet() {
  const [open, setOpen] = useState(false)
  return createPortal(
    <div className="frr-root print:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-full border border-brand bg-brand px-4 text-sm font-semibold text-primary-foreground"
        aria-haspopup="dialog"
      >
        <MessageCircle className="size-4" aria-hidden /> Your coach
      </button>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end" role="dialog" aria-modal="true" aria-labelledby="coach-sheet-title">
          <button type="button" aria-label="Close coach" className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} />
          <div className="relative max-h-[75vh] w-full overflow-y-auto rounded-t-xl border-t border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="coach-sheet-title" className="flex items-center gap-2 text-base font-semibold text-navy">
                <MessageCircle className="size-4" aria-hidden /> Your coach
              </h2>
              <Btn size="sm" variant="ghost" onClick={() => setOpen(false)} aria-label="Close coach" autoFocus>
                <X className="size-4" aria-hidden />
              </Btn>
            </div>
            <CoachBody />
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}
