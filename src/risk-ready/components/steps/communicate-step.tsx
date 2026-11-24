import { useStore } from '../../lib/store'
import { uid } from '../../lib/context'
import type { Contact, FarmState, TrainingItem } from '../../lib/types'
import { cn } from '../../lib/utils'
import { Btn, Card, Field, SectionTitle, Segmented, inputClass } from '../ui'
import { FactCards } from '../supports'

/** Who to reach when severe weather hits, from Nationwide's severe-weather plan tips. Applies to every farm. */
const SEVERE_WEATHER_GROUPS = ['Owners', 'Family members', 'Employees', 'Employee families', 'Suppliers', 'Regular visitors']

const CONTACT_ROLES = [...SEVERE_WEATHER_GROUPS, 'Insurance agent', 'Veterinarian', 'Grain buyer', 'Fuel / input supplier', 'Equipment dealer', 'Neighbor with equipment', 'Lender', 'Family spokesperson']

function ContactRow({ c, index }: { c: Contact; index: number }) {
  const { update } = useStore()
  const set = (patch: Partial<Contact>) => update((s) => ({ ...s, contacts: s.contacts.map((x) => (x.id === c.id ? { ...x, ...patch } : x)) }))
  const id = (f: string) => `ct-${c.id}-${f}`
  return (
    <li className="flex flex-col gap-3 rounded-md border border-border p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Field label={`Contact ${index + 1} role`} htmlFor={id('role')}>
          <input id={id('role')} list="contact-roles" className={inputClass} value={c.role} onChange={(e) => set({ role: e.target.value })} />
        </Field>
        <Btn size="sm" variant="danger" className="sm:mb-1" onClick={() => update((s) => ({ ...s, contacts: s.contacts.filter((x) => x.id !== c.id) }))}>
          Remove
        </Btn>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Primary name" htmlFor={id('pn')}>
          <input id={id('pn')} className={inputClass} value={c.primaryName} onChange={(e) => set({ primaryName: e.target.value })} />
        </Field>
        <Field label="Primary phone" htmlFor={id('pp')}>
          <input id={id('pp')} type="tel" inputMode="tel" autoComplete="tel" className={inputClass} value={c.primaryPhone} onChange={(e) => set({ primaryPhone: e.target.value })} />
        </Field>
        <Field label="Backup name" htmlFor={id('bn')}>
          <input id={id('bn')} className={inputClass} value={c.backupName} onChange={(e) => set({ backupName: e.target.value })} />
        </Field>
        <Field label="Backup phone" htmlFor={id('bp')}>
          <input id={id('bp')} type="tel" inputMode="tel" className={inputClass} value={c.backupPhone} onChange={(e) => set({ backupPhone: e.target.value })} />
        </Field>
      </div>
      {!c.backupName && c.primaryName && <p className="text-xs text-amber-ink">Add a backup so someone is reachable if the primary isn’t.</p>}
    </li>
  )
}

function TrainingRow({ t }: { t: TrainingItem }) {
  const { update } = useStore()
  const set = (patch: Partial<TrainingItem>) => update((s) => ({ ...s, training: s.training.map((x) => (x.id === t.id ? { ...x, ...patch } : x)) }))
  const id = (f: string) => `tr-${t.id}-${f}`
  return (
    <li className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <Field label="Topic" htmlFor={id('topic')}>
        <input id={id('topic')} className={inputClass} value={t.topic} onChange={(e) => set({ topic: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Who" htmlFor={id('aud')}>
          <select id={id('aud')} className={inputClass} value={t.audience} onChange={(e) => set({ audience: e.target.value as TrainingItem['audience'] })}>
            <option value="everyone">Everyone</option>
            <option value="employees">Employees</option>
            <option value="family">Family</option>
          </select>
        </Field>
        <Field label="When" htmlFor={id('when')}>
          <input id={id('when')} className={inputClass} placeholder="e.g. March, before planting" value={t.when} onChange={(e) => set({ when: e.target.value })} />
        </Field>
      </div>
      <Btn size="sm" variant="danger" onClick={() => update((s) => ({ ...s, training: s.training.filter((x) => x.id !== t.id) }))}>
        Remove
      </Btn>
    </li>
  )
}

function suggestedTraining(s: FarmState, ctxTopics: string[]): Omit<TrainingItem, 'id'>[] {
  const have = new Set(s.training.map((t) => t.topic.toLowerCase()))
  return ctxTopics.filter((t) => !have.has(t.toLowerCase())).map((topic) => ({ topic, audience: 'everyone', when: '' }))
}

export function CommunicateStep() {
  const { state, ctx, update } = useStore()

  const topics = [
    'Walk through the written emergency plan',
    ctx.has('grainBins') && 'Grain bin entry & lockout procedure',
    ctx.has('manurePits') && 'Manure pit gas safety',
    ctx.has('roadVehicles') && 'Safe driving with farm equipment on roads',
    ctx.has('atvs') && 'ATV/UTV rider safety',
    ctx.livestock && 'Biosecurity & visitor log',
    ctx.has('computerRecords') && 'Restore records from backup',
    ctx.employees > 0 && 'Cross-train a second person on critical jobs',
  ].filter((x): x is string => typeof x === 'string')
  const missingTraining = suggestedTraining(state, topics)

  const hasRole = (r: string) => state.contacts.some((c) => c.role.toLowerCase() === r.toLowerCase())
  const missingWeather = SEVERE_WEATHER_GROUPS.filter((r) => !hasRole(r) && !(r.startsWith('Employee') && ctx.employees === 0))
  const missingRoles = CONTACT_ROLES.filter((r) => {
    if (SEVERE_WEATHER_GROUPS.includes(r)) return false
    if (r === 'Veterinarian' && !ctx.livestock) return false
    if (r === 'Grain buyer' && !ctx.crops) return false
    return !hasRole(r)
  })

  const blank = (role: string): Contact => ({ id: uid(), role, primaryName: '', primaryPhone: '', backupName: '', backupPhone: '' })
  const addContact = (role = '') => update((s) => ({ ...s, contacts: [...s.contacts, blank(role)] }))
  const addWeatherGroups = () => update((s) => ({ ...s, contacts: [...s.contacts, ...missingWeather.map(blank)] }))

  return (
    <div className="flex flex-col gap-6">
      <FactCards step={6} />
      <datalist id="contact-roles">
        {CONTACT_ROLES.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Who gets called first — and who gets called if they don’t pick up.">Key contacts</SectionTitle>
        {state.contacts.length > 0 && (
          <ul className="flex flex-col gap-3">
            {state.contacts.map((c, i) => (
              <ContactRow key={c.id} c={c} index={i} />
            ))}
          </ul>
        )}
        {missingWeather.length > 0 && (
          <div className="flex flex-col gap-2 rounded-md border border-border bg-tint-blue p-3">
            <p className="text-sm font-medium">Severe-weather call list (every farm)</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nationwide&apos;s severe-weather tips say to know how you&apos;ll reach each of these groups before a storm: {missingWeather.join(', ').toLowerCase()}.
            </p>
            <Btn size="sm" className="self-start" onClick={addWeatherGroups}>
              Add {missingWeather.length} call-list {missingWeather.length === 1 ? 'group' : 'groups'}
            </Btn>
          </div>
        )}
        {missingRoles.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Also suggested for your farm:</p>
            <ul className="flex flex-wrap gap-2">
              {missingRoles.map((r) => (
                <li key={r}>
                  <Btn size="sm" onClick={() => addContact(r)}>
                    + {r}
                  </Btn>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Btn className="self-start" onClick={() => addContact()}>
          Add a contact
        </Btn>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="A plan only helps if the people who need it can find it — including when you’re not there.">Who holds a copy of the plan</SectionTitle>
        <Field label="Names and where the copy is kept" htmlFor="plan-holders">
          <textarea id="plan-holders" className={cn(inputClass, 'min-h-20')} placeholder="e.g. Kitchen binder; Sarah (phone); agent's file" value={state.planHolders} onChange={(e) => update((s) => ({ ...s, planHolders: e.target.value }))} />
        </Field>
        <Field label="Where key documents are stored off-site" htmlFor="offsite-docs" hint="Policies, deeds, leases, herd and field records. If the house or office is damaged, these need to survive somewhere else.">
          <textarea id="offsite-docs" className={cn(inputClass, 'min-h-20')} placeholder="e.g. Safe-deposit box at county bank; scans in cloud folder" value={state.offsiteDocs} onChange={(e) => update((s) => ({ ...s, offsiteDocs: e.target.value }))} />
        </Field>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Short, regular walk-throughs beat one long meeting. Suggestions are based on your assets and people.">Training schedule</SectionTitle>
        {state.training.length > 0 && (
          <ul className="flex flex-col gap-3">
            {state.training.map((t) => (
              <TrainingRow key={t.id} t={t} />
            ))}
          </ul>
        )}
        {missingTraining.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {missingTraining.map((t) => (
              <li key={t.topic}>
                <Btn size="sm" onClick={() => update((s) => ({ ...s, training: [...s.training, { ...t, id: uid() }] }))}>
                  + {t.topic}
                </Btn>
              </li>
            ))}
          </ul>
        )}
        <Btn className="self-start" onClick={() => update((s) => ({ ...s, training: [...s.training, { id: uid(), topic: '', audience: 'everyone', when: '' }] }))}>
          Add training
        </Btn>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="We recommend a full review once a year, plus after any major change — new building, new enterprise, a death or new hire, a disaster.">Review cadence</SectionTitle>
        <Segmented<FarmState['reviewCadence']>
          name="review-cadence"
          legend="How often will you review the plan?"
          value={state.reviewCadence}
          onChange={(v) => update((s) => ({ ...s, reviewCadence: v }))}
          options={[
            { value: 'annual', label: 'Annually (recommended)' },
            { value: 'semiannual', label: 'Twice a year' },
            { value: 'quarterly', label: 'Quarterly' },
          ]}
        />
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" className="size-5" checked={state.reviewAfterChange} onChange={(e) => update((s) => ({ ...s, reviewAfterChange: e.target.checked }))} />
          Also review after any major change (recommended)
        </label>
        <Field label="Next insurance review with your agent" htmlFor="next-review" hint={state.insuranceReview && state.insuranceReview !== 'within12' ? 'Your last review was more than 12 months ago — pick a date in the next 30 days.' : undefined}>
          <input id="next-review" type="date" className={inputClass} value={state.nextInsuranceReview} onChange={(e) => update((s) => ({ ...s, nextInsuranceReview: e.target.value }))} />
        </Field>
      </Card>
    </div>
  )
}
