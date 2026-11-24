import { useMemo, useState } from 'react'
import { useStore } from '../../lib/store'
import { QUIZ, QUIZ_CATEGORIES, interpretQuiz, quizAnswer, scoreQuiz } from '../../lib/quiz'
import { interpretQuizAnswer } from '../../lib/voice'
import { cn } from '../../lib/utils'
import { BandBadge, Btn, Card, Segmented, SectionTitle } from '../ui'
import { TalkItThrough } from '../talk-it-through'
import { FactCards } from '../supports'

const BAR: Record<string, string> = { strong: 'bg-green', watch: 'bg-amber', vulnerable: 'bg-red', unscored: 'bg-grey' }

export function ReadinessResults({ compact = false }: { compact?: boolean }) {
  const { state } = useStore()
  const result = scoreQuiz(state)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-2xl font-semibold text-navy">{result.pct != null ? `${result.pct}%` : `${result.answered}/${QUIZ.length}`}</p>
        <BandBadge band={result.band} />
        <p className="text-sm text-muted-foreground">
          {result.score} of {result.max} points
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {result.cats.map((c) => (
          <li key={c.key} className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium">{c.label}</span>
              <span className="flex items-center gap-2">
                <span className="tabular-nums text-muted-foreground">{c.pct != null ? `${c.pct}%` : `${c.answered}/${c.total} answered`}</span>
                <BandBadge band={c.band} />
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden>
              <div className={cn('h-full rounded-full', BAR[c.band])} style={{ width: `${c.pct ?? (c.answered / c.total) * 100}%`, opacity: c.pct == null ? 0.35 : 1 }} />
            </div>
          </li>
        ))}
      </ul>
      {!compact && <p className="text-sm leading-relaxed text-pretty">{interpretQuiz(result)}</p>}
    </div>
  )
}

export function ReadinessStep() {
  const { state, update } = useStore()
  const firstOpen = useMemo(() => QUIZ.findIndex((q) => quizAnswer(q, state).value == null), [state])
  const [talkIndex, setTalkIndex] = useState(Math.max(0, firstOpen))
  const talkQ = QUIZ[talkIndex]
  const fromInventory = QUIZ.filter((q) => quizAnswer(q, state).source === 'inventory').length

  return (
    <div className="flex flex-col gap-6">
      <FactCards step={3} />
      {fromInventory > 0 && (
        <p className="rounded-md bg-tint-green p-3 text-sm text-green" role="status">
          {fromInventory} of {QUIZ.length} questions were answered from your inventory in step 2. Check them — you can change any.
        </p>
      )}
      {QUIZ_CATEGORIES.map((cat) => (
        <Card key={cat.key} className="flex flex-col gap-4">
          <SectionTitle sub={cat.blurb}>{cat.label}</SectionTitle>
          <ol className="flex flex-col gap-5">
            {QUIZ.filter((q) => q.category === cat.key).map((q) => {
              const a = quizAnswer(q, state)
              const n = QUIZ.indexOf(q) + 1
              return (
                <li key={q.id} className="flex flex-col gap-2">
                  <Segmented<number>
                    name={`quiz-${q.id}`}
                    legend={`${n}. ${q.text}`}
                    value={a.value}
                    options={q.scale.map((label, i) => ({ value: i + 1, label }))}
                    onChange={(v) => update((s) => ({ ...s, quiz: { ...s.quiz, [q.id]: v } }))}
                  />
                  {a.source === 'inventory' && (
                    <p className="flex flex-wrap items-center gap-x-2 text-xs text-green">
                      <span className="font-semibold">Answered from your inventory</span>
                      <span className="text-muted-foreground">({a.because})</span>
                      <span className="text-muted-foreground">— pick another answer to change it.</span>
                    </p>
                  )}
                  {a.source === 'farmer' && q.fromInventory?.(state) && (
                    <Btn
                      size="sm"
                      variant="ghost"
                      className="self-start px-0 text-xs"
                      onClick={() =>
                        update((s) => {
                          const quiz = { ...s.quiz }
                          delete quiz[q.id]
                          return { ...s, quiz }
                        })
                      }
                    >
                      Use my inventory answer instead
                    </Btn>
                  )}
                </li>
              )
            })}
          </ol>
        </Card>
      ))}

      <TalkItThrough
        key={talkQ.id}
        stepKey={`quiz-${talkQ.id}`}
        prompt={`Question ${talkIndex + 1} of ${QUIZ.length}: “${talkQ.text}” Answer in your own words.`}
        example={talkQ.scale[0] === 'Not at all' ? 'Honestly not at all, I never really sat down and did that.' : 'Yeah, I agree — we mostly do that.'}
        interpret={(t) => interpretQuizAnswer(talkQ, t)}
        commitLabel="Save this answer"
      />
      <div className="-mt-4 flex flex-wrap gap-2 print:hidden">
        <Btn size="sm" disabled={talkIndex === 0} onClick={() => setTalkIndex((i) => i - 1)}>
          Previous question
        </Btn>
        <Btn size="sm" disabled={talkIndex === QUIZ.length - 1} onClick={() => setTalkIndex((i) => i + 1)}>
          Next question
        </Btn>
      </div>

      <Card className="flex flex-col gap-3">
        <SectionTitle>Your readiness results</SectionTitle>
        <ReadinessResults />
      </Card>
    </div>
  )
}
