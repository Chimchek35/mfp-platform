/**
 * Section 4 — 12 agtech partner discounts for Nationwide customers.
 * Offers and contacts are "as of Nov 2026 — verify" (shown on every card).
 */
import { FARM_RANCH, rec, type CatalogRecord, type Industry, type Topic } from './taxonomy'

export const AGTECH_HUB_URL = 'https://www.nationwide.com/business/agribusiness/safety-risk-management/agtech-solutions/'
export const AGTECH_FLYER_URL = 'https://www.nationwide.com/staticassets/GCO-0660M1_Innovative_Solutions_tcm108-102987.pdf'
export const AGTECH_NOTE = 'as of Nov 2026 — verify'

function a(id: string, title: string, summary: string, offer: string, contact: string, triggers: string[], topic: Topic[], extra: { url?: string; industry?: Industry[] } = {}): CatalogRecord {
  return rec({
    id,
    title,
    url: extra.url ?? AGTECH_HUB_URL,
    type: 'agtech',
    summary,
    offer,
    contact,
    triggers,
    readinessCategory: 'managing',
    taxonomy: { industry: extra.industry ?? FARM_RANCH, topic, subtopic: ['Technology & monitoring systems'], format: 'Tools and fact finders' },
  })
}

export const AGTECH: CatalogRecord[] = [
  a('a_barnowl', 'Barn Owl — solar/cellular remote cameras', 'Watch remote buildings, equipment and livestock from your phone.', '20% off', 'sales@barnowl.tech, 1-720-594-5533', ['theft', 'remote buildings', 'livestock monitoring'], ['Property & structural protection', 'Livestock & poultry']),
  a('a_efire', 'E Fire USA — E Fire Balls', 'Self-activating fire extinguisher balls for combines, shops, barns and hay storage.', '20% off', 'info@EFireUSA.com, 1-866-354-3387', ['combines', 'shops', 'barns', 'hay'], ['Fires & explosions', 'Harvest & machinery safety']),
  a('a_enforcer', 'EnforcerOne — fire suppression systems', 'Automatic fire suppression for harvest equipment.', '20% off', 'info@enforcerone.com, 1-678-788-8413', ['equipment fires', 'harvest'], ['Fires & explosions', 'Harvest & machinery safety']),
  a('a_haytech', 'HAYTECH — digital hay probes & dashboards', 'Wireless probes report bale temperature and moisture so you catch heating before it ignites.', '10% off', 'nationwide@haytechsystem.com, 1-833-839-0175', ['hay storage'], ['Fires & explosions']),
  a('a_p3', 'P3 Propane Safety — inspections, training, Duty to Warn', 'Propane system inspections and training for distributors.', 'Preferred pricing', 'info@p3propanesafety.com, 1-888-995-9623', ['propane distribution'], ['Hazardous materials', 'Fires & explosions'], { industry: ['Fuel & propane distribution'] }),
  a('a_alertmeter', 'Predictive Safety AlertMeter', 'Quick impairment and alertness checks for employees and drivers before a shift.', 'Listed partner', 'info@predictivesafety.com, 1-720-383-4963', ['employees', 'drivers'], ['Employee health & workplace safety', 'Driver & vehicle safety']),
  a('a_prevtech', 'PrevTech — electrical network monitoring', 'Sensors that detect electrical faults in barns and confinement before they start a fire.', 'Preferred pricing', 'nationwide@prevtech.us, 1-888-224-0604', ['barns', 'confinement', 'electrical fire'], ['Fires & explosions', 'Livestock & poultry']),
  a('a_razor', 'Razor Tracking — GPS & dash cams', 'Track trucks and equipment on the road and recover stolen units.', 'Listed partner', 'nationwide@razortracking.com, 1-833-467-2967', ['trucks', 'equipment on road', 'theft'], ['Driver & vehicle safety']),
  a('a_samba', 'SambaSafety — driver monitoring', 'MVR, CSA and driver-training monitoring for hired drivers and fleets.', '20% off', 'nationwideoffer@sambasafety.com', ['hired drivers', 'fleet'], ['Driver & vehicle safety']),
  a('a_tankspotter', 'Tank Spotter — propane/fuel safety app', 'Safety app for fuel and propane distribution.', '25% off', '1-610-228-0887', ['fuel/propane distribution'], ['Hazardous materials'], { industry: ['Fuel & propane distribution'] }),
  a('a_flir', 'Teledyne FLIR — thermal imaging cameras', 'Spot hot bearings, motors, wiring, hay and grain before they become a fire.', '15% off', 'nationwide_offer@teledyne.com, 1-866-477-3687', ['electrical', 'motors', 'hay', 'grain'], ['Fires & explosions']),
  a('a_kcsupply', 'KC Supply — gas monitors', 'Discounted personal gas monitors for manure storage and confined spaces.', 'Discount code on request', 'Via the manure pit safety page', ['manure storage', 'confined spaces'], ['Confined spaces'], {
    url: 'https://www.nationwide.com/lc/resources/farm-and-agribusiness/articles/manure-pit-safety',
  }),
  rec({
    id: 'a_hub',
    title: 'Agtech partner solutions (all partners)',
    url: AGTECH_HUB_URL,
    type: 'agtech',
    summary: 'Every agtech partner discount available to Nationwide customers.',
    triggers: ['every farm'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: [], subtopic: ['Technology & monitoring systems'], format: 'Tools and fact finders' },
  }),
  rec({
    id: 'a_flyer',
    title: 'Innovative solutions flyer',
    url: AGTECH_FLYER_URL,
    type: 'agtech',
    summary: 'A printable overview of agtech partner offers.',
    triggers: ['every farm'],
    readinessCategory: 'managing',
    taxonomy: { industry: FARM_RANCH, topic: [], subtopic: ['Technology & monitoring systems'], format: 'Safety tips and guides' },
  }),
]
