import type { FarmContext } from './context'
import { rankThreats } from './strategy'
import { scoreQuiz } from './quiz'
import { CATEGORIES } from './categories'
import { startingPosition, suggestedRules, activeAlerts } from './plan'

export const STEPS = [
  { short: 'Welcome', title: 'Welcome', why: '' },
  {
    short: 'Your operation',
    title: 'Your operation',
    why: 'Every recommendation in this plan starts here. Your farm type, what you raise, the side businesses you run and the assets you rely on tell us which risks matter most — so you don’t answer questions that don’t apply to you.',
  },
  {
    short: 'In place',
    title: 'What you already have in place',
    why: 'Most farms already have more protection than they realize. Telling us what you have means we recommend reviewing what you’ve got instead of selling you on what you don’t need — and it answers part of the readiness check for you.',
  },
  {
    short: 'Readiness',
    title: 'Readiness check',
    why: 'These 12 questions come from the Farm Risk Ready assessment. They measure how ready the farm is today across four areas. Anything you already told us is filled in — check it and change it if it’s wrong.',
  },
  {
    short: 'Your risks',
    title: 'Your risks',
    why: 'A threat is anything that could cost the farm money, people or time. Left to themselves, most people only think of two or three kinds. We start with threats matched to your operation and walk you through all eight areas so nothing big is missed.',
  },
  {
    short: 'Strategies',
    title: 'Your strategies',
    why: 'For your highest-scoring threats, decide how you will handle each one: avoid it, accept it, transfer it, or reduce it. We recommend one based on what you already have — you confirm or change it.',
  },
  {
    short: 'Communicate',
    title: 'Communicate, train & review',
    why: 'A plan only works if the people on the farm know it exists and what their part is. This step sets who to call, who holds a copy, how people are trained and when you will look at the plan again.',
  },
  { short: 'Your plan', title: 'Your plan', why: '' },
] as const

export type Tip = { title: string; body: string }

/** Deterministic coach tips — also the fallback when AI is not configured. */
export function coachTips(step: number, c: FarmContext): Tip[] {
  const p = c.state.profile
  const tips: Tip[] = []
  switch (step) {
    case 0:
      tips.push({ title: 'Try the sample farm', body: 'Short on time? Load the sample Ohio corn, soybean and cow-calf farm to see how the plan builds itself.' })
      break
    case 1:
      if (!p.farmType) tips.push({ title: 'Start with farm type', body: 'Pick the one description that fits best. We will show the enterprises and side businesses that usually go with it first.' })
      else if (!p.enterprises.length) tips.push({ title: 'Add what you raise', body: 'Each enterprise — corn, cow-calf, hay — brings its own price and yield risks. Pick every one that brings in money.' })
      if (p.farmType && !p.adjacent.length) tips.push({ title: 'Don’t skip side businesses', body: 'Custom hauling, a farm stand or a hunting lease often fall outside a standard farm policy. They are where surprises hide.' })
      if (c.topBuyer && c.topBuyer.share > 50) tips.push({ title: 'One buyer, most of the money', body: `${c.topBuyer.name} takes about ${c.topBuyer.share}% of your revenue. We will add a “loss of main buyer” threat for you to consider.` })
      if (p.enterprises.length && !p.revenueOps.length) tips.push({ title: 'Build revenue operations', body: 'Use “Build from my enterprises” to turn what you raise into revenue lines — then adjust the shares.' })
      break
    case 2: {
      const sp = startingPosition(c)
      if (sp.gaps.length) tips.push({ title: 'Gaps that matter for your farm', body: `${sp.gaps.slice(0, 3).join(', ')}${sp.gaps.length > 3 ? ` and ${sp.gaps.length - 3} more` : ''}. These will be flagged on matching threats.` })
      if (sp.counts.unsure > 0) tips.push({ title: '“Not sure” is a fine answer', body: 'It means “ask my agent.” We will turn each one into a question for your next insurance review.' })
      break
    }
    case 3: {
      const q = scoreQuiz(c.state)
      if (q.complete) {
        const weakest = [...q.cats].sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0))[0]
        tips.push({ title: `Focus: ${weakest.label}`, body: `This is your lowest area at ${weakest.pct}%. The strategies step will lean on it.` })
      } else tips.push({ title: 'Pre-filled answers', body: 'Questions marked “answered from your inventory” used what you told us in step 2. Change any that don’t sound right.' })
      break
    }
    case 4: {
      const s = suggestedRules(c)
      const covered = new Set(c.state.threats.map((t) => t.category))
      const missing = CATEGORIES.filter((x) => !covered.has(x.key))
      if (s.length) tips.push({ title: `${s.length} threats matched to your farm`, body: 'Accept the ones that fit, edit the wording, or dismiss them. Nothing is added until you choose.' })
      if (missing.length && c.state.threats.length) tips.push({ title: 'Areas you haven’t covered', body: `${missing.map((m) => m.label.toLowerCase()).join(', ')}. Even one threat per area makes the plan stronger.` })
      break
    }
    case 5: {
      const top = rankThreats(c.state.threats, c)[0]
      if (top) tips.push({ title: 'Start with your top threat', body: `“${top.threat.label}” scores ${top.score}. Confirm a strategy for it first.` })
      tips.push({ title: 'Transfer isn’t always “buy more”', body: 'If you already have the coverage, the recommended action is a review of limits and exclusions with your agent.' })
      break
    }
    case 6:
      if (!c.state.contacts.length) tips.push({ title: 'Add suggested contacts', body: 'We can add the roles most farms like yours need — agent, vet, buyer, fire department — so you just fill in names.' })
      tips.push({ title: 'Review annually and after big changes', body: 'A new building, a new employee or a new side business all change your risks. Review the plan then.' })
      break
    case 7:
      if (activeAlerts(c).length) tips.push({ title: 'Bring this to your agent', body: 'Print or save this plan as a PDF and take it to your next insurance review.' })
      tips.push({ title: 'Share the contact sheet', body: 'Post the contact sheet in the shop and the house so anyone can find it in an emergency.' })
      break
  }
  return tips.slice(0, 2)
}

export const GLOSSARY: Record<string, string> = {
  APH: 'Actual Production History — your average yield over recent years. Crop insurance guarantees are built on it.',
  RP: 'Revenue Protection — crop insurance that pays if your revenue falls below a guarantee because of low yield, low price or both.',
  YP: 'Yield Protection — crop insurance that pays only when yield falls below your guarantee.',
  LRP: 'Livestock Risk Protection — insurance that sets a price floor on livestock you plan to sell.',
  Umbrella: 'An umbrella policy adds extra liability limits on top of your farm and auto policies.',
  'Business income': 'Coverage that replaces lost income while you rebuild after a covered loss like a fire.',
  Deductible: 'The amount you pay out of pocket on a claim before insurance pays.',
  Exclusion: 'Something a policy specifically does not cover. Reading the exclusions is how you find gaps.',
}
