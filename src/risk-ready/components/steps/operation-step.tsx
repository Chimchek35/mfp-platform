import { Plus, Trash2, Wand2 } from 'lucide-react'
import { useStore } from '../../lib/store'
import { derivedLocation, uid, type FarmContext } from '../../lib/context'
import {
  ADJACENT,
  AGRITOURISM_ACTIVITIES,
  ASSETS,
  ASSET_GROUPS,
  ENTERPRISES,
  EQUINE_ACTIVITIES,
  FARM_TYPES,
  LOCATION_FLAGS,
  MANURE_TYPES,
  US_STATES,
  adjacentDef,
  enterpriseDef,
  farmTypeDef,
} from '../../lib/options'
import { interpretProfile } from '../../lib/voice'
import type { AdjacentKey, AssetKey, EnterpriseKey, Profile, RevenueOp } from '../../lib/types'
import { cn } from '../../lib/utils'
import { Btn, Card, CheckTile, Field, NumberField, SectionTitle, inputClass } from '../ui'
import { TalkItThrough } from '../talk-it-through'

function likelyAssets(c: FarmContext): Set<AssetKey> {
  const out = new Set<AssetKey>()
  for (const a of c.state.profile.adjacent) adjacentDef(a).impliesAssets.forEach((k) => out.add(k))
  if (c.hasEnterprise('corn', 'soybeans', 'wheat')) ['grainBins', 'roadVehicles', 'gpsEquipment', 'fuelStorage', 'shopBuildings'].forEach((k) => out.add(k as AssetKey))
  if (c.hasEnterprise('dairyHerd', 'hogs')) ['manurePits', 'livestockBarns'].forEach((k) => out.add(k as AssetKey))
  if (c.hasEnterprise('poultryFlock')) out.add('livestockBarns')
  if (c.hasEnterprise('cowCalf', 'feedlot', 'smallRuminants', 'horses')) ['atvs', 'roadVehicles'].forEach((k) => out.add(k as AssetKey))
  if (c.farmType === 'agribusiness') ['computerRecords', 'visitors', 'contracts'].forEach((k) => out.add(k as AssetKey))
  return out
}

export function OperationStep() {
  const { state, ctx, update } = useStore()
  const p = state.profile
  const set = (patch: Partial<Profile>) => update((s) => ({ ...s, profile: { ...s.profile, ...patch } }))
  const ft = p.farmType ? farmTypeDef(p.farmType) : null
  const typicalLabel = ft ? `Common for ${ft.label.toLowerCase()}` : undefined

  const toggleEnterprise = (k: EnterpriseKey, on: boolean) =>
    set({ enterprises: on ? [...p.enterprises, k] : p.enterprises.filter((x) => x !== k) })
  const toggleAdjacent = (k: AdjacentKey, on: boolean) => set({ adjacent: on ? [...p.adjacent, k] : p.adjacent.filter((x) => x !== k) })

  const orderedEnterprises = ft
    ? [...ENTERPRISES.filter((e) => ft.typicalEnterprises.includes(e.key)), ...ENTERPRISES.filter((e) => !ft.typicalEnterprises.includes(e.key))]
    : ENTERPRISES
  const orderedAdjacent = ft
    ? [...ADJACENT.filter((a) => ft.typicalAdjacent.includes(a.key)), ...ADJACENT.filter((a) => !ft.typicalAdjacent.includes(a.key))]
    : ADJACENT

  const showPoultry = p.farmType === 'poultry' || p.enterprises.includes('poultryFlock')
  const showEquine = p.farmType === 'equine' || p.enterprises.includes('horses')
  const showAgri = p.adjacent.includes('agritourism')

  const likely = likelyAssets(ctx)
  const orderedAssets = [...ASSETS.filter((a) => likely.has(a.key)), ...ASSETS.filter((a) => !likely.has(a.key))]

  const missingOps = [
    ...p.enterprises.filter((e) => !p.revenueOps.some((o) => o.sourceKey === e)).map((e) => ({ key: e, name: enterpriseDef(e).revenueName })),
    ...p.adjacent.filter((a) => !p.revenueOps.some((o) => o.sourceKey === a)).map((a) => ({ key: a, name: adjacentDef(a).revenueName })),
  ]
  const totalShare = p.revenueOps.reduce((a, o) => a + o.share, 0)

  const buildOps = () => {
    const added: RevenueOp[] = missingOps.map((m) => ({ id: uid(), name: m.name, share: 0, buyer: '', dependencies: '', sourceKey: m.key }))
    const all = [...p.revenueOps, ...added]
    const remaining = Math.max(0, 100 - p.revenueOps.reduce((a, o) => a + o.share, 0))
    const each = added.length ? Math.floor(remaining / added.length) : 0
    set({ revenueOps: all.map((o) => (added.includes(o) ? { ...o, share: each } : o)) })
  }
  const setOp = (id: string, patch: Partial<RevenueOp>) => set({ revenueOps: p.revenueOps.map((o) => (o.id === id ? { ...o, ...patch } : o)) })

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <SectionTitle sub="The basics. Leave anything blank you’d rather not share.">The farm</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Farm name (optional)" htmlFor="farmName">
            <input id="farmName" className={inputClass} value={p.farmName} onChange={(e) => set({ farmName: e.target.value })} />
          </Field>
          <Field label="State" htmlFor="state" hint="Used for weather and snow-load risks.">
            <select id="state" className={inputClass} value={p.state} onChange={(e) => set({ state: e.target.value })}>
              <option value="">Choose a state</option>
              {US_STATES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </Field>
          <NumberField id="acres" label="Acres farmed" value={p.acres} onChange={(v) => set({ acres: v })} />
          <NumberField id="head" label="Livestock head" value={p.head} onChange={(v) => set({ head: v })} hint="Leave blank if none." />
        </div>
        {p.state && (
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">Weather & location risks for {p.state}</legend>
            <p className="text-xs leading-relaxed text-muted-foreground">Set from your state. Change any that don&apos;t fit your ground.</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {LOCATION_FLAGS.map((f) => {
                const derived = derivedLocation(p.state)[f.key]
                return (
                  <CheckTile
                    key={f.key}
                    label={f.label}
                    description={f.hint}
                    checked={ctx.loc[f.key]}
                    onChange={(on) => set({ locationOverrides: { ...p.locationOverrides, [f.key]: on } })}
                    tag={derived ? 'Typical for your state' : undefined}
                  />
                )
              })}
            </div>
          </fieldset>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Pick the one that fits best. It sets which enterprises and side businesses we show first.">Farm type</SectionTitle>
        <fieldset>
          <legend className="sr-only">Farm type</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {FARM_TYPES.map((f) => {
              const active = p.farmType === f.key
              return (
                <label
                  key={f.key}
                  className={cn(
                    'flex min-h-11 cursor-pointer flex-col gap-0.5 rounded-md border p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring',
                    active ? 'border-brand bg-tint-blue' : 'border-border bg-card hover:border-input',
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <input type="radio" name="farmType" className="size-4" checked={active} onChange={() => set({ farmType: f.key })} />
                    {f.label}
                  </span>
                  <span className="pl-6 text-xs leading-relaxed text-muted-foreground">{f.description}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Everything you grow or raise for sale. Each brings its own price and yield risks.">Farm enterprises</SectionTitle>
        <fieldset>
          <legend className="sr-only">Farm enterprises</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {orderedEnterprises.map((e) => (
              <CheckTile
                key={e.key}
                label={e.label}
                checked={p.enterprises.includes(e.key)}
                onChange={(on) => toggleEnterprise(e.key, on)}
                tag={ft?.typicalEnterprises.includes(e.key) ? typicalLabel : undefined}
              />
            ))}
          </div>
        </fieldset>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Side businesses that run alongside production. These often fall outside a standard farm policy, so they matter.">
          Farm-adjacent enterprises
        </SectionTitle>
        <fieldset>
          <legend className="sr-only">Farm-adjacent enterprises</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {orderedAdjacent.map((a) => (
              <CheckTile
                key={a.key}
                label={a.label}
                description={a.description}
                checked={p.adjacent.includes(a.key)}
                onChange={(on) => toggleAdjacent(a.key, on)}
                tag={ft?.typicalAdjacent.includes(a.key) ? typicalLabel : undefined}
              />
            ))}
          </div>
        </fieldset>
      </Card>

      {(showPoultry || showEquine || showAgri) && (
        <Card className="flex flex-col gap-5">
          <SectionTitle sub="A few questions that change what your farm policy does and doesn't cover.">Details for your operation</SectionTitle>

          {showPoultry && (
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Do you grow birds under an integrator contract?</legend>
              <div className="flex flex-wrap gap-2">
                {([
                  [true, 'Yes, integrator owns the birds'],
                  [false, 'No, I own the birds'],
                ] as const).map(([v, label]) => (
                  <label key={String(v)} className={cn('flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring', p.poultryIntegrator === v ? 'border-brand bg-tint-blue' : 'border-border bg-card')}>
                    <input type="radio" name="integrator" className="size-4" checked={p.poultryIntegrator === v} onChange={() => set({ poultryIntegrator: v })} />
                    {label}
                  </label>
                ))}
              </div>
              {p.poultryIntegrator && (
                <p className="rounded-md bg-tint-amber p-3 text-sm leading-relaxed">
                  The integrator usually owns the birds and sometimes the equipment. Your plan will include a question for your agent about what the integrator insures and what&apos;s left to you, like houses, generators and your income if a flock is lost.
                </p>
              )}
            </fieldset>
          )}

          {showEquine && (
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Which equine activities happen on your farm?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {EQUINE_ACTIVITIES.map((a) => (
                  <CheckTile
                    key={a.key}
                    label={a.label}
                    checked={p.equineActivities.includes(a.key)}
                    onChange={(on) => set({ equineActivities: on ? [...p.equineActivities, a.key] : p.equineActivities.filter((x) => x !== a.key) })}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {showAgri && (
            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium">Which agritourism activities do you offer?</legend>
              {[true, false].map((insurable) => (
                <div key={String(insurable)} className="flex flex-col gap-2">
                  <p className={cn('text-xs font-semibold uppercase tracking-wide', insurable ? 'text-green' : 'text-amber-ink')}>
                    {insurable ? 'Insurable under the agritourism program' : 'Not insurable under the agritourism program'}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {AGRITOURISM_ACTIVITIES.filter((a) => a.insurable === insurable).map((a) => (
                      <CheckTile
                        key={a.key}
                        label={a.label}
                        checked={p.agritourismActivities.includes(a.key)}
                        onChange={(on) => set({ agritourismActivities: on ? [...p.agritourismActivities, a.key] : p.agritourismActivities.filter((x) => x !== a.key) })}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {ctx.notInsurableAgri.length > 0 && (
                <p role="alert" className="rounded-md border border-amber bg-tint-amber p-3 text-sm leading-relaxed">
                  <strong>Not insurable: {ctx.notInsurableAgri.join(', ')}.</strong> Nationwide&apos;s agritourism coverage doesn&apos;t include these. Talk with your agent before you offer them, or think about dropping them.
                </p>
              )}
            </fieldset>
          )}
        </Card>
      )}

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Who does the work. Names you add here are prefilled as “who’s involved” in your strategies.">People</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="family" label="Family members working" value={p.familyWorkers} onChange={(v) => set({ familyWorkers: v })} />
          <NumberField id="seasonal" label="Seasonal employees" value={p.seasonalEmployees} onChange={(v) => set({ seasonalEmployees: v })} />
          <NumberField id="yearRound" label="Year-round employees" value={p.yearRoundEmployees} onChange={(v) => set({ yearRoundEmployees: v })} />
        </div>
        <div className="flex flex-col gap-2">
          {p.people.map((person, i) => (
            <div key={person.id} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                aria-label={`Person ${i + 1} name`}
                placeholder="Name"
                className={inputClass}
                value={person.name}
                onChange={(e) => set({ people: p.people.map((x) => (x.id === person.id ? { ...x, name: e.target.value } : x)) })}
              />
              <input
                aria-label={`Person ${i + 1} role`}
                placeholder="Role (e.g. herdsman)"
                className={cn(inputClass, 'col-span-1 row-start-2 sm:row-start-auto')}
                value={person.role}
                onChange={(e) => set({ people: p.people.map((x) => (x.id === person.id ? { ...x, role: e.target.value } : x)) })}
              />
              <Btn variant="danger" size="md" aria-label={`Remove ${person.name || `person ${i + 1}`}`} onClick={() => set({ people: p.people.filter((x) => x.id !== person.id) })}>
                <Trash2 className="size-4" aria-hidden />
              </Btn>
            </div>
          ))}
          <Btn size="sm" variant="ghost" className="self-start" onClick={() => set({ people: [...p.people, { id: uid(), name: '', role: '' }] })}>
            <Plus className="size-4" aria-hidden /> Add a key person
          </Btn>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="The ways the farm makes money. If one buyer takes more than half, we’ll flag it.">Revenue operations</SectionTitle>
        {missingOps.length > 0 && (
          <div className="flex flex-col gap-2 rounded-md bg-tint-green p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              Suggested from your enterprises: <strong>{missingOps.map((m) => m.name).join(', ')}</strong>
            </p>
            <Btn size="sm" variant="green" onClick={buildOps}>
              <Wand2 className="size-4" aria-hidden /> Add these
            </Btn>
          </div>
        )}
        {p.revenueOps.map((op, i) => (
          <div key={op.id} className="flex flex-col gap-3 rounded-md border border-border p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name" htmlFor={`op-name-${op.id}`}>
                <input id={`op-name-${op.id}`} className={inputClass} value={op.name} onChange={(e) => setOp(op.id, { name: e.target.value })} />
              </Field>
              <Field label="Main buyer (optional)" htmlFor={`op-buyer-${op.id}`}>
                <input id={`op-buyer-${op.id}`} className={inputClass} value={op.buyer} placeholder="e.g. local co-op" onChange={(e) => setOp(op.id, { buyer: e.target.value })} />
              </Field>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`op-share-${op.id}`} className="flex justify-between text-sm font-medium">
                <span>Share of revenue</span>
                <span className="tabular-nums">{op.share}%</span>
              </label>
              <input id={`op-share-${op.id}`} type="range" min={0} max={100} step={1} value={op.share} onChange={(e) => setOp(op.id, { share: Number(e.target.value) })} className="w-full accent-brand" />
            </div>
            <Field label="What it depends on" htmlFor={`op-dep-${op.id}`} hint="Equipment, people, suppliers — these show on your plan.">
              <input id={`op-dep-${op.id}`} className={inputClass} value={op.dependencies} onChange={(e) => setOp(op.id, { dependencies: e.target.value })} />
            </Field>
            <Btn size="sm" variant="danger" className="self-start" onClick={() => set({ revenueOps: p.revenueOps.filter((o) => o.id !== op.id) })}>
              <Trash2 className="size-4" aria-hidden /> Remove {op.name || `operation ${i + 1}`}
            </Btn>
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Btn size="sm" variant="ghost" onClick={() => set({ revenueOps: [...p.revenueOps, { id: uid(), name: '', share: 0, buyer: '', dependencies: '' }] })}>
            <Plus className="size-4" aria-hidden /> Add a revenue operation
          </Btn>
          {p.revenueOps.length > 0 && (
            <p className={cn('text-sm font-medium', totalShare === 100 ? 'text-green' : 'text-amber-ink')} role="status">
              Total: {totalShare}% {totalShare === 100 ? '— adds up' : '— should add up to about 100%'}
            </p>
          )}
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <SectionTitle sub="Check everything you have. Each one tailors your risks — items common for your operation are listed first, but nothing is checked for you.">
          Assets & activities
        </SectionTitle>
        {ASSET_GROUPS.map((group) => {
          const items = orderedAssets.filter((a) => a.group === group)
          const count = items.filter((a) => p.assets[a.key]).length
          return (
            <fieldset key={group} className="flex flex-col gap-2">
              <legend className="flex w-full items-center justify-between gap-2 text-sm font-semibold">
                <span>{group}</span>
                <span className="text-xs font-normal text-muted-foreground">{count} checked</span>
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((a) => (
                  <CheckTile
                    key={a.key}
                    label={a.label}
                    description={a.hint}
                    checked={!!p.assets[a.key]}
                    onChange={(on) => set({ assets: { ...p.assets, [a.key]: on } })}
                    tag={likely.has(a.key) ? 'Common for your operation' : undefined}
                  />
                ))}
              </div>
              {group === 'Livestock & manure' && p.assets.manurePits && (
                <div className="flex flex-col gap-2 rounded-md bg-tint-blue p-3">
                  <p className="text-sm font-medium">What kind of manure storage?</p>
                  <div className="flex flex-wrap gap-2">
                    {MANURE_TYPES.map((m) => (
                      <CheckTile
                        key={m.key}
                        label={m.label}
                        checked={p.manureTypes.includes(m.key)}
                        onChange={(on) => set({ manureTypes: on ? [...p.manureTypes, m.key] : p.manureTypes.filter((x) => x !== m.key) })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </fieldset>
          )
        })}
      </Card>

      <TalkItThrough
        stepKey="operation"
        prompt="Describe your farm in your own words — what you raise, any side businesses, how big, where, and who works there."
        example="We farm 1,100 acres of corn and soybeans in Ohio, run 150 cow-calf pairs, and have two hired hands. We haul grain with our own semis."
        interpret={interpretProfile}
      />
    </div>
  )
}
