/**
 * LICENSING NOTE — READ BEFORE COMMERCIAL USE
 * The 12-question readiness assessment, the four risk strategies (avoidance, acceptance,
 * transfer, mitigation) and the Plan Builder framework used in this prototype derive from
 * Nationwide Agribusiness "Farm Risk Ready" materials. Licensing for use of that content
 * outside a Nationwide channel must be confirmed before any commercial use.
 */
export const LICENSING_NOTE =
  'The readiness quiz and Plan Builder framework derive from Nationwide Farm Risk Ready materials. Licensing must be confirmed before commercial use.'

export const APP = {
  name: 'Farm Risk Ready Plan Builder',
  tag: 'Prototype — Idealyst Innovation',
  timeEstimate: '~25 minutes',
  storageKey: 'frr-plan-builder-v1',
}

/** Placeholder contact details — edit here to change them everywhere in the app and plan. */
export const CONTACT = {
  teamName: 'Risk Management team',
  phone: '1-800-260-1356',
  phoneHref: 'tel:+18002601356',
  email: 'RMSolutions@nationwide.com',
}

export const RESILIENCY_STAT = {
  value: '35%',
  text: 'Only 35% of farmers have a resiliency plan in place.',
  source: 'Nationwide Farmer Resiliency Research, Dec 2024',
}

export const DISCLAIMER =
  'Educational planning tool. Not insurance advice, a quote, or a coverage determination. Confirm coverage, limits and eligibility with a licensed agent. Crop and livestock figures are illustrative; actual APH, prices and coverage options are set by USDA RMA.'

export const CALCULATOR_DISCLAIMER =
  'Educational illustration, not a quote. APH, projected price and coverage levels are set by USDA RMA and must be confirmed with a licensed agent.'

export const AI_LABEL = 'AI-generated, review before relying on it'

/** AI Gateway model used by /api/coach. The tool works fully without AI. */
export const AI_MODEL = 'anthropic/claude-haiku-5.5'
