import { useState } from 'react'
import { CALCULATOR_DISCLAIMER } from '../lib/config'
import { cn } from '../lib/utils'
import { Btn, Card, NumberField, Term } from './ui'

const CROP_PRESETS = {
  corn: { label: 'Corn', variable: 480, fixed: 160, land: 260, aph: 185, price: 4.4 },
  soybeans: { label: 'Soybeans', variable: 260, fixed: 130, land: 260, aph: 55, price: 10.5 },
  wheat: { label: 'Wheat', variable: 230, fixed: 110, land: 160, aph: 70, price: 5.8 },
}
const LIVESTOCK_PRESETS = {
  feeder: { label: 'Feeder cattle', unit: 'cwt', price: 255, cost: 240, weight: 8 },
  fed: { label: 'Fed cattle', unit: 'cwt', price: 185, cost: 178, weight: 14 },
  hogs: { label: 'Hogs (lean)', unit: 'cwt', price: 88, cost: 82, weight: 2.1 },
}

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function CropCalc() {
  const [preset, setPreset] = useState<keyof typeof CROP_PRESETS>('corn')
  const [v, setV] = useState(CROP_PRESETS.corn)
  const [cov, setCov] = useState(75)
  const cost = v.variable + v.fixed + v.land
  const normal = v.aph * v.price
  const guarantee = (c: number) => v.aph * v.price * (c / 100)
  const gap = cost - guarantee(cov)
  const num = (k: keyof typeof v) => (n: number | null) => setV({ ...v, [k]: n ?? 0 })

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-1 text-sm font-medium">Crop</legend>
        {(Object.keys(CROP_PRESETS) as (keyof typeof CROP_PRESETS)[]).map((k) => (
          <Btn
            key={k}
            size="sm"
            variant={preset === k ? 'primary' : 'secondary'}
            aria-pressed={preset === k}
            onClick={() => {
              setPreset(k)
              setV(CROP_PRESETS[k])
            }}
          >
            {CROP_PRESETS[k].label}
          </Btn>
        ))}
      </fieldset>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <NumberField id="c-var" label="Variable cost $/ac" value={v.variable} onChange={num('variable')} />
        <NumberField id="c-fix" label="Fixed cost $/ac" value={v.fixed} onChange={num('fixed')} />
        <NumberField id="c-land" label="Land cost $/ac" value={v.land} onChange={num('land')} />
        <NumberField id="c-aph" label="APH bu/ac" value={v.aph} onChange={num('aph')} />
        <NumberField id="c-price" label="Expected price $/bu" value={v.price} onChange={num('price')} />
        <div className="flex flex-col gap-1">
          <label htmlFor="c-cov" className="text-sm font-medium">
            Coverage {cov}%
          </label>
          <input id="c-cov" type="range" min={50} max={85} step={5} value={cov} onChange={(e) => setCov(Number(e.target.value))} />
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <div className="rounded-md bg-muted p-2">
          <dt className="text-muted-foreground">Total cost/acre</dt>
          <dd className="font-semibold">{money(cost)}</dd>
        </div>
        <div className="rounded-md bg-muted p-2">
          <dt className="text-muted-foreground">Normal-year revenue</dt>
          <dd className="font-semibold">{money(normal)}</dd>
        </div>
        <div className="rounded-md bg-tint-blue p-2">
          <dt className="text-muted-foreground">
            <Term term="RP">RP</Term> guarantee
          </dt>
          <dd className="font-semibold">{money(guarantee(cov))}</dd>
        </div>
        <div className={cn('rounded-md p-2', gap > 0 ? 'bg-tint-red' : 'bg-tint-green')}>
          <dt className="text-muted-foreground">{gap > 0 ? 'Not covered vs full cost' : 'Guarantee covers full cost'}</dt>
          <dd className={cn('font-semibold', gap > 0 ? 'text-red' : 'text-green')}>{money(Math.abs(gap))}</dd>
        </div>
      </dl>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="mb-1 text-left text-sm font-medium">Coverage sensitivity ($/acre)</caption>
          <thead>
            <tr className="text-left text-muted-foreground">
              <th scope="col" className="py-1 pr-3 font-medium">Coverage</th>
              <th scope="col" className="py-1 pr-3 font-medium">Guarantee</th>
              <th scope="col" className="py-1 font-medium">Gap to full cost</th>
            </tr>
          </thead>
          <tbody>
            {[50, 60, 70, 75, 80, 85].map((c) => (
              <tr key={c} className={cn('border-t border-border', c === cov && 'bg-tint-blue font-medium')}>
                <td className="py-1 pr-3">{c}%</td>
                <td className="py-1 pr-3 tabular-nums">{money(guarantee(c))}</td>
                <td className="py-1 tabular-nums">{money(cost - guarantee(c))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LivestockCalc() {
  const [preset, setPreset] = useState<keyof typeof LIVESTOCK_PRESETS>('feeder')
  const [v, setV] = useState(LIVESTOCK_PRESETS.feeder)
  const [cov, setCov] = useState(95)
  const floor = v.price * (cov / 100)
  const gap = v.cost - floor
  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-1 text-sm font-medium">Class</legend>
        {(Object.keys(LIVESTOCK_PRESETS) as (keyof typeof LIVESTOCK_PRESETS)[]).map((k) => (
          <Btn
            key={k}
            size="sm"
            variant={preset === k ? 'primary' : 'secondary'}
            aria-pressed={preset === k}
            onClick={() => {
              setPreset(k)
              setV(LIVESTOCK_PRESETS[k])
            }}
          >
            {LIVESTOCK_PRESETS[k].label}
          </Btn>
        ))}
      </fieldset>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <NumberField id="l-price" label="Expected price $/cwt" value={v.price} onChange={(n) => setV({ ...v, price: n ?? 0 })} />
        <NumberField id="l-cost" label="Cost of production $/cwt" value={v.cost} onChange={(n) => setV({ ...v, cost: n ?? 0 })} />
        <NumberField id="l-wt" label="Sale weight (cwt/head)" value={v.weight} onChange={(n) => setV({ ...v, weight: n ?? 0 })} />
        <div className="col-span-2 flex flex-col gap-1 md:col-span-3">
          <label htmlFor="l-cov" className="text-sm font-medium">
            Coverage {cov}%
          </label>
          <input id="l-cov" type="range" min={70} max={100} step={5} value={cov} onChange={(e) => setCov(Number(e.target.value))} />
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
        <div className="rounded-md bg-tint-blue p-2">
          <dt className="text-muted-foreground">
            <Term term="LRP">LRP</Term> price floor
          </dt>
          <dd className="font-semibold">${floor.toFixed(2)}/cwt</dd>
        </div>
        <div className="rounded-md bg-muted p-2">
          <dt className="text-muted-foreground">Cost of production</dt>
          <dd className="font-semibold">${v.cost.toFixed(2)}/cwt</dd>
        </div>
        <div className={cn('col-span-2 rounded-md p-2 md:col-span-1', gap > 0 ? 'bg-tint-red' : 'bg-tint-green')}>
          <dt className="text-muted-foreground">{gap > 0 ? 'Floor below cost, per head' : 'Floor above cost, per head'}</dt>
          <dd className={cn('font-semibold', gap > 0 ? 'text-red' : 'text-green')}>{money(Math.abs(gap * v.weight))}</dd>
        </div>
      </dl>
    </div>
  )
}

export function InsuranceCalculator({ kind, onClose }: { kind: 'crop' | 'livestock'; onClose: () => void }) {
  return (
    <Card className="flex flex-col gap-4 border-brand/40" role="region" aria-label={kind === 'crop' ? 'Crop insurance calculator' : 'Livestock risk protection calculator'}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-navy">{kind === 'crop' ? 'Crop insurance calculator (Revenue Protection)' : 'Livestock Risk Protection calculator'}</h4>
        <Btn size="sm" onClick={onClose}>
          Back to my plan
        </Btn>
      </div>
      <p className="rounded-md bg-tint-green p-3 text-sm text-green">Insurance is a floor that keeps the farm solvent — not a guarantee of profit.</p>
      {kind === 'crop' ? <CropCalc /> : <LivestockCalc />}
      <p className="text-xs text-muted-foreground">{CALCULATOR_DISCLAIMER}</p>
    </Card>
  )
}
