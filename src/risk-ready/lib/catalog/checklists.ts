/**
 * Section 3.5 — every Property Risk Solutions checklist, guide and article, plus the universal
 * maintenance & loss-prevention set. URLs copied from nationwide-risk-catalog.md only.
 */
import { FARM_RANCH, rec, type CatalogRecord, type Format, type Industry, type ReadinessCategory, type SupportType, type Subtopic, type Topic } from './taxonomy'

const NW = 'https://www.nationwide.com'
const PRS = `${NW}/business/agribusiness/safety-risk-management/safety-programs/property-risk-solutions`
const LIB = `${NW}/business/agribusiness/safety-risk-management/resource-library/articles`
const LC = `${NW}/lc/resources/farm-and-agribusiness/articles`
const SA = `${NW}/staticassets`

function k(
  id: string,
  title: string,
  url: string,
  summary: string,
  triggers: string[],
  readinessCategory: ReadinessCategory,
  topic: Topic[],
  subtopic: Subtopic[],
  format: Format,
  extra: { type?: SupportType; universal?: boolean; industry?: Industry[] } = {},
): CatalogRecord {
  const isArticle = format === 'Articles'
  return rec({
    id,
    title,
    url,
    summary,
    triggers,
    readinessCategory,
    type: extra.type ?? (isArticle ? 'tip' : 'checklist'),
    taxonomy: { industry: extra.industry ?? FARM_RANCH, topic, subtopic, format },
    universal: extra.universal,
  })
}

export const CHECKLISTS: CatalogRecord[] = [
  // ---------- a) Buildings & materials ----------
  k('k_bm_hub', 'Buildings & materials', `${PRS}/buildings-materials/`, 'Build and renovate with fire and weather in mind.', ['new building', 'renovation'], 'managing', ['Property & structural protection'], ['Engineering & structural controls'], 'Safety tips and guides', { type: 'program' }),
  k('k_bldg_reno_fire', 'Building or renovating with fire in mind', `${SA}/agrm-GCO-1200AO_BldgReno_Fire_tcm108-108905.pdf`, 'Design choices that keep a fire from taking the whole building.', ['new building', 'renovation'], 'managing', ['Property & structural protection', 'Fires & explosions'], ['Engineering & structural controls'], 'Checklists and forms'),
  k('k_fire_resist', 'Fire-resistant construction checklist', `${SA}/agrm-GCO-1199AO_FireResistChecklist_tcm108-107287.pdf`, 'Materials and assemblies that slow fire spread.', ['new building'], 'managing', ['Property & structural protection', 'Fires & explosions'], ['Engineering & structural controls'], 'Checklists and forms'),
  k('k_fire_sep', 'Fire separation checklist', `${SA}/agrm-GCO-1195AO_FireSep_Checklist_tcm108-106582.pdf`, 'Space and separate buildings so one fire doesn’t become three.', ['new building', 'shop', 'livestock barns'], 'managing', ['Property & structural protection', 'Fires & explosions'], ['Engineering & structural controls'], 'Checklists and forms'),
  k('k_fire_walls', 'Fire separation walls & fire doors', `${SA}/agrm-GCO-1196AO_FireSepWalls-Firedoors_tcm108-106583.pdf`, 'When and how to use fire walls and rated doors.', ['new building'], 'managing', ['Property & structural protection', 'Fires & explosions'], ['Engineering & structural controls'], 'Technical bulletins'),
  k('k_spray_foam', 'Plastic spray foam insulation risks', `${LIB}/plastic-spray-foam-insulation-risks`, 'Exposed foam insulation can turn a small fire into a fast one.', ['new building', 'renovation'], 'identify', ['Property & structural protection', 'Fires & explosions'], ['Hazards & risks'], 'Articles'),
  k('k_construction_fire', 'Construction materials & fire safety', `${LIB}/construction-materials-and-fire-safety`, 'How common farm building materials behave in a fire.', ['new building'], 'identify', ['Property & structural protection', 'Fires & explosions'], ['Hazards & risks'], 'Articles'),

  // ---------- b) Operations & fire hazards ----------
  k('k_ops_hub', 'Operations & fire hazards', `${PRS}/operations-fire-hazards/`, 'Everyday operations that start farm fires, and how to control them.', ['any buildings'], 'identify', ['Fires & explosions'], ['Hazards & risks'], 'Safety tips and guides', { type: 'program' }),
  k('k_electrical_fires', 'Preventing electrical fires', `${SA}/Preventing_Electrical_Fires_tcm108-93186.pdf`, 'Wiring, panels and cords — the leading cause of barn fires.', ['livestock barns', 'shop', 'any buildings'], 'managing', ['Fires & explosions'], ['Inspections & maintenance'], 'Safety tips and guides'),
  k('k_afci', 'Electrical fires & arc-fault circuit interrupters', `${SA}/Electrical_fires_and_arc_fault_circuit_interrupters_tcm108-93129.pdf`, 'How AFCIs stop arcing faults before they start a fire.', ['livestock barns', 'farm home'], 'managing', ['Fires & explosions'], ['Engineering & structural controls'], 'Technical bulletins'),
  k('k_arc_flash', 'Protecting against arc flash', `${SA}/agrm-GCO-1239AO_ProtectingArcFlash_tcm108-108471.pdf`, 'Working safely around high-energy electrical equipment.', ['grain dryer', 'large electrical'], 'managing', ['Employee health & workplace safety', 'Fires & explosions'], ['PPE', 'Safe operating procedures'], 'Technical bulletins'),
  k('k_power_surge', 'Power surges', `${SA}/agrm-GCO-1272AO_PowerSrgs_tcm108-109495.pdf`, 'Protect controllers, computers and ventilation from surges.', ['livestock barns', 'computer records'], 'managing', ['Property & structural protection'], ['Engineering & structural controls'], 'Technical bulletins'),
  k('k_livestock_bldg_fire', 'Preventing livestock & poultry building fires', `${LIB}/prevent-poultry-building-fires`, 'Heaters, wiring and dust in confinement and poultry houses.', ['livestock barns', 'poultry houses'], 'managing', ['Fires & explosions', 'Livestock & poultry'], ['Hazards & risks'], 'Articles'),
  k('k_solar_article', 'Solar energy: benefits, risks & smart planning', `${LIB}/solar-energy-benefits-risks-and-smart-planning-for-agricultural-operations`, 'What to check before and after adding solar on a farm.', ['solar', 'solar lease'], 'identify', ['Fires & explosions', 'Property & structural protection'], ['Hazards & risks'], 'Articles'),
  k('k_pv_roof', 'Photovoltaic roof inspection guide', `${SA}/Photovoltaic_roof_inspection_guide_tcm108-90408.pdf`, 'Inspect roof-mounted solar for damage and fire risk.', ['solar'], 'managing', ['Property & structural protection'], ['Inspections & maintenance'], 'Checklists and forms'),
  k('k_pv_array', 'Photovoltaic array inspection checklist', `${SA}/Photovoltaic_Array_Inspection_Checklist_tcm108-90245.pdf`, 'Ground-mount and roof array inspection checklist.', ['solar'], 'managing', ['Property & structural protection'], ['Inspections & maintenance'], 'Checklists and forms'),
  k('k_ev', 'EV charging: minimize your risk', `${LIB}/electric-vehicle-charging-minimize-your-risk`, 'Placement and maintenance of EV chargers on the farm.', ['EV charging'], 'managing', ['Fires & explosions'], ['Hazards & risks'], 'Articles'),
  k('k_lithium', 'Lithium-ion batteries: reduce fire risk', `${SA}/agrm-GCO-1201AO_Lithium-ionBtrys_RdceFireRsk_tcm108-106584.pdf`, 'Storing and charging tool, UTV and drone batteries safely.', ['batteries', 'shop', 'drones'], 'managing', ['Fires & explosions'], ['Safe operating procedures'], 'Checklists and forms'),
  k('k_heaters', 'Portable heater safety', `${SA}/agrm-GCO-1220AO_PortableHtrSfty_tcm108-107286.pdf`, 'Clearances and placement for heaters in shops and barns.', ['heaters', 'shop'], 'managing', ['Fires & explosions'], ['Safe operating procedures'], 'Checklists and forms'),
  k('k_wood_stove', 'Wood stove safety for farms', `${SA}/agrm-GCO-1227AO_WoodStoveSafetyFarms_tcm108-108908.pdf`, 'Installation, chimney care and ash handling.', ['wood stove'], 'managing', ['Fires & explosions'], ['Inspections & maintenance'], 'Checklists and forms'),
  k('k_flammable', 'Flammable & combustible liquids', `${SA}/agrm-GCO-1202AO_FlamCombustLiquids_tcm108-107455.pdf`, 'Storing fuel, solvents and oils safely.', ['fuel storage', 'shop', 'chemical storage'], 'managing', ['Hazardous materials', 'Fires & explosions'], ['Safe operating procedures'], 'Checklists and forms'),
  k('k_hydraulic', 'Hydraulic fluids', `${SA}/agrm-GCO-1205AO_HydrlcFluids_tcm108-107459.pdf`, 'Hydraulic leaks near hot surfaces are a common equipment-fire cause.', ['combine', 'shop'], 'managing', ['Fires & explosions', 'Harvest & machinery safety'], ['Inspections & maintenance'], 'Technical bulletins'),
  k('k_lp_system', 'Maintain a safe LP gas system', `${LIB}/maintain-a-safe-lp-gas-system`, 'Tank placement, regulators, lines and leak checks.', ['propane', 'grain dryer', 'barn heaters'], 'managing', ['Fires & explosions', 'Hazardous materials'], ['Inspections & maintenance'], 'Articles'),
  k('k_propane_accidents', 'Preventing propane accidents', `${LC}/preventing-propane-accidents`, 'Common propane mistakes and how to avoid them.', ['propane'], 'managing', ['Fires & explosions'], ['Hazards & risks'], 'Articles'),
  k('k_dust_collectors', 'Maintaining dust collectors', `${SA}/agrm-GCO-1240AO_MaintDustCollectors_tcm108-109205.pdf`, 'Keep dust collection from becoming the explosion source.', ['grain dryer', 'grain handling', 'feed mill'], 'managing', ['Fires & explosions', 'Grain operations safety'], ['Inspections & maintenance'], 'Technical bulletins', { industry: ['Farm & ranch', 'Traditional agribusiness'] }),
  k('k_dha', 'Dust hazard analysis (DHA)', `${SA}/agrm-GCO-1268AO_DustHzrdAnlys_tcm108-109494.pdf`, 'A structured review of where combustible dust can ignite.', ['grain dryer', 'bucket elevator', 'grain handling'], 'identify', ['Fires & explosions', 'Grain operations safety'], ['Hazards & risks', 'Regulatory compliance & standards'], 'Technical bulletins', { industry: ['Farm & ranch', 'Traditional agribusiness'] }),
  k('k_nut_hull', 'Nut hull fire prevention checklist', `${SA}/agrm-GCO-1217AO_Nut_hull_fire_prevention_checklist_tcm108-107458.pdf`, 'Preventing self-heating fires in stored nut hulls.', ['orchard', 'nut hulls'], 'managing', ['Fires & explosions'], ['Inspections & maintenance'], 'Checklists and forms'),
  k('k_ammonia', 'Ammonia refrigeration safety guide', `${SA}/agrm-GCO-1226AO_AmmoniaRefrigSafetyGuide_tcm108-108468.pdf`, 'Safe operation of ammonia refrigeration in processing and storage.', ['refrigeration', 'processing'], 'managing', ['Hazardous materials', 'Food & feed safety'], ['Safe operating procedures'], 'Technical bulletins', { industry: ['Food & beverage processing', 'Farm & ranch'] }),
  k('k_hidden_fire', 'Hidden fire risks in food processing', `${LIB}/hidden-fire-risks`, 'Ovens, fryers, dust and packaging that start processing fires.', ['on-farm processing'], 'identify', ['Fires & explosions', 'Food & feed safety'], ['Hazards & risks'], 'Articles', { industry: ['Food & beverage processing', 'Farm & ranch'] }),
  k('k_kitchen', 'Commercial kitchen fire prevention', `${SA}/agrm-GCO-1236AO_CmrclKtchn-FirePrvntn_tcm108-109216.pdf`, 'Hood, suppression and grease controls for farm kitchens and bakeries.', ['on-farm processing', 'farm stand'], 'managing', ['Fires & explosions', 'Food & feed safety'], ['Engineering & structural controls'], 'Checklists and forms', { industry: ['Food & beverage processing', 'Farm & ranch'] }),
  k('k_pallets', 'Safe storage of pallets and bins', `${LIB}/safe-storage-of-pallets-and-bins`, 'Idle pallets and bins are a large fire load — store them away from buildings.', ['packing shed', 'orchard', 'processing'], 'managing', ['Fires & explosions'], ['Safe operating procedures'], 'Articles'),

  // ---------- c) Fire protection systems ----------
  k('k_fps_hub', 'Fire protection systems', `${PRS}/fire-protection-systems/`, 'Extinguishers, alarms and sprinklers that actually work when needed.', ['any buildings'], 'managing', ['Fires & explosions'], ['Engineering & structural controls'], 'Safety tips and guides', { type: 'program' }),
  k('k_extinguisher', 'Fire extinguisher best-practice guide', `${SA}/agrm-GCO-1231AO_FireExtinguishers-BestPracticeGuide_tcm108-108465.pdf`, 'The right extinguisher, in the right place, inspected monthly.', ['shop', 'any buildings', 'combine'], 'managing', ['Fires & explosions'], ['Inspections & maintenance'], 'Checklists and forms'),
  k('k_ext_training', 'Fire extinguisher training checklist', `${SA}/agrm-GCO-1232AO_FireExt_TrainingCL_tcm108-108598.pdf`, 'Make sure everyone has actually used one.', ['hired employees', 'shop'], 'communicating', ['Fires & explosions', 'Employee health & workplace safety'], ['Safe operating procedures'], 'Checklists and forms'),
  k('k_pass', 'PASS fire extinguisher method', `${SA}/agrm-GCO-1230AO_PASS-FireExtinguisher_tcm108-108596.pdf`, 'Pull, Aim, Squeeze, Sweep — a toolbox talk.', ['shop', 'any buildings'], 'communicating', ['Fires & explosions'], ['Safe operating procedures'], 'Toolbox talks'),
  k('k_alarms', 'Fire alarm & detection', `${SA}/agrm-GCO-1269AO_FireAlarmDetection_tcm108-109433.pdf`, 'Choosing and maintaining detection in farm buildings.', ['sprinklers/alarms', 'livestock barns'], 'managing', ['Fires & explosions'], ['Technology & monitoring systems'], 'Technical bulletins'),
  k('k_sprinkler_itm', 'Inspection, testing & maintenance of water sprinklers (NFPA 25)', `${SA}/agrm-GCO-1246AO_InspTestMaint_WtrSprnklrs_tcm108-109190.pdf`, 'A sprinkler that’s impaired is no protection at all.', ['sprinklers/alarms'], 'managing', ['Fires & explosions'], ['Inspections & maintenance', 'Regulatory compliance & standards'], 'Technical bulletins'),
  k('k_sprinkler_freeze', 'Protecting fire sprinklers from freezing', `${LIB}/protecting-fire-sprinkler-systems-from-freezing-temperatures`, 'Winterize dry and wet systems before the first hard freeze.', ['sprinklers/alarms', 'snow states'], 'managing', ['Fires & explosions', 'Weather & environment'], ['Inspections & maintenance'], 'Articles'),
  k('k_enforcer_article', 'Farm fire suppression with EnforcerOne', `${LC}/farm-fire-suppression-with-enforcerone`, 'Partner article on equipment fire suppression systems.', ['combine', 'harvest equipment'], 'managing', ['Fires & explosions', 'Harvest & machinery safety'], ['Technology & monitoring systems'], 'Articles'),
  k('k_fireball_article', 'What is a fire ball?', `${LC}/what-is-a-fireball`, 'Partner article on self-activating fire extinguisher balls.', ['combine', 'shop', 'hay'], 'managing', ['Fires & explosions'], ['Technology & monitoring systems'], 'Articles'),
  k('k_prevtech_article', 'Farm electrical safety with PrevTech', `${LC}/farm-electrical-safety-with-prevtech`, 'Partner article on electrical network monitoring.', ['livestock barns', 'confinement'], 'managing', ['Fires & explosions'], ['Technology & monitoring systems'], 'Articles'),
  k('k_thermal_article', 'Thermal imaging on the farm', `${LC}/thermal-imaging`, 'Find hot motors, bearings and wiring before they start a fire.', ['electrical', 'hay', 'grain'], 'identify', ['Fires & explosions'], ['Technology & monitoring systems', 'Inspections & maintenance'], 'Articles'),

  // ---------- d) Weather & environmental ----------
  k('k_weather_hub', 'Weather & environmental risks', `${PRS}/weather-environmental-risks/`, 'Snow, hail, wind, wildfire, earthquake and water damage.', ['location'], 'identify', ['Weather & environment'], ['Hazards & risks'], 'Safety tips and guides', { type: 'program' }),
  k('k_snow_load', 'Farm snow load management checklist', `${SA}/agrm-GCO-1252AO_FarmSnowldMgmtCL_tcm108-109188.pdf`, 'Know your roof load limits, warning signs, and who clears snow — safely.', ['snow states', 'buildings'], 'contingency', ['Weather & environment', 'Property & structural protection'], ['Emergency preparedness & response', 'Inspections & maintenance'], 'Checklists and forms'),
  k('k_snow_article', 'Roof snow management', `${LIB}/roof-snow-management`, 'When snow becomes dangerous on a farm roof and how to remove it.', ['snow states', 'buildings'], 'identify', ['Weather & environment', 'Property & structural protection'], ['Hazards & risks'], 'Articles'),
  k('k_winter', 'Prepare & protect: winter weather hazards', `${SA}/agrm-GCO-1253AO_Prep-protect_WntrWthrHzrds_tcm108-109428.pdf`, 'Frozen pipes, ice dams and heater fires — a winter checklist.', ['snow states'], 'contingency', ['Weather & environment'], ['Emergency preparedness & response'], 'Checklists and forms'),
  k('k_hail', 'Hail resilience guidelines', `${SA}/agrm-GCO-1248AO_HailResilienceGLs_Ag_Cml_tcm108-109430.pdf`, 'Roofing and skylight choices that hold up to hail.', ['hail region'], 'managing', ['Weather & environment', 'Property & structural protection'], ['Engineering & structural controls'], 'Technical bulletins'),
  k('k_high_wind_doors', 'High-wind checklist for large commercial doors', `${SA}/High_wind_checklist_for_large_commercial_doors_tcm108-93154.pdf`, 'Big doors are the first thing to fail in a windstorm.', ['wind region', 'shop', 'machine sheds'], 'managing', ['Weather & environment', 'Property & structural protection'], ['Engineering & structural controls'], 'Checklists and forms'),
  k('k_storm_roof', 'Storm roof checklist', `${SA}/agrm-GCO-1223AO_StormCmrclRoofCL_tcm108-108595.pdf`, 'Before and after storm roof checks.', ['hail region', 'wind region'], 'contingency', ['Weather & environment', 'Property & structural protection'], ['Inspections & maintenance'], 'Checklists and forms'),
  k('k_wildfire_guide', 'Wildfire prevention guide', `${SA}/agrm-GCO-1245AO_WildfirePrevGuide_tcm108-108593.pdf`, 'Reduce the chance a wildfire reaches farm buildings.', ['wildfire-prone'], 'managing', ['Weather & environment', 'Fires & explosions'], ['Environmental considerations'], 'Safety tips and guides'),
  k('k_wildfire_steps', 'Wildfire preparedness steps', `${SA}/agrm-GCO-1251AO_WildfirePreparedness_tcm108-109213.pdf`, 'What to do before, during and after a wildfire threat.', ['wildfire-prone'], 'contingency', ['Weather & environment'], ['Emergency preparedness & response'], 'Checklists and forms'),
  k('k_defensible', 'Defensible space', `${SA}/agrm-GCO-1244AO_DefensibleSpace_tcm108-108466.pdf`, 'Clear zones around buildings that give firefighters a chance.', ['wildfire-prone'], 'managing', ['Weather & environment', 'Fires & explosions'], ['Engineering & structural controls'], 'Checklists and forms'),
  k('k_earthquake', 'Affordable ways to protect against earthquake damage', `${SA}/Affordable_and_effective_ways_to_protect_against_earthquake_damage_tcm108-92920.pdf`, 'Bracing tanks, shelving and equipment.', ['earthquake zone'], 'managing', ['Weather & environment', 'Property & structural protection'], ['Engineering & structural controls'], 'Safety tips and guides'),
  k('k_water_damage', 'Exterior building maintenance & water damage guide', `${SA}/agrm-GCO-1228AO_ExtBldgMaintInspGuide_tcm108-109189.pdf`, 'Gutters, grading and sump pumps that keep water out.', ['flood', 'sump pumps'], 'managing', ['Weather & environment', 'Property & structural protection'], ['Inspections & maintenance'], 'Safety tips and guides'),

  // ---------- e) Maintenance & loss prevention (universal set first) ----------
  k('k_mlp_hub', 'Maintenance & loss prevention', `${PRS}/maintenance-loss-prevention/`, 'The everyday maintenance that prevents most farm losses.', ['every farm'], 'managing', ['Property & structural protection'], ['Inspections & maintenance'], 'Safety tips and guides', { type: 'program' }),
  k('k_farm_fire', 'Farm & ranch fire safety checklist', `${SA}/agrm-GCO-0704M1_Fire_Safety_Checklist_tcm108-101641.pdf`, 'A walk-through fire checklist for every building and machine on the farm.', ['every farm'], 'identify', ['Fires & explosions'], ['Inspections & maintenance'], 'Checklists and forms', { universal: true }),
  k('k_home_fire', 'Farm home fire safety checklist', `${SA}/agrm-GCO-1215AO_FarmhomefireSftyCL_tcm108-107285.pdf`, 'Smoke alarms, heating, cooking and escape plans for the farmhouse.', ['every farm'], 'identify', ['Fires & explosions'], ['Inspections & maintenance'], 'Checklists and forms', { universal: true }),
  k('k_eap', 'Farm emergency action plan (EAP)', `${SA}/GPO-0224AO-3%20_WS-EAP_Farm_tcm108-92793.pdf`, 'A fill-in worksheet: who to call, where to meet, how to shut things off.', ['every farm'], 'contingency', ['Weather & environment', 'Employee health & workplace safety'], ['Emergency preparedness & response'], 'Checklists and forms', { universal: true }),
  k('k_contingency', 'Business contingency planning', `${SA}/agrm-GCO-0185AO_Business_Contingency_Planning_tcm108-96858.pdf`, 'How the farm keeps running — or restarts — after a major loss.', ['every farm'], 'contingency', ['Property & structural protection'], ['Emergency preparedness & response'], 'Checklists and forms', { universal: true }),
  k('k_fire_prevention', 'Farm fire prevention', `${LIB}/fire-prevention-farms`, 'The most common causes of farm fires and simple fixes.', ['any buildings'], 'identify', ['Fires & explosions'], ['Hazards & risks'], 'Articles'),
  k('k_generators', 'Commercial generators for power outages', `${SA}/Commercial_Generators_for_Power_Outages_tcm108-93120.pdf`, 'Sizing, transfer switches and testing a standby generator.', ['livestock barns', 'milking/refrigeration', 'poultry houses'], 'contingency', ['Property & structural protection', 'Livestock & poultry'], ['Emergency preparedness & response'], 'Technical bulletins'),
  k('k_crime', 'Crime prevention for agricultural operations', `${LIB}/crime-prevention-agricultural`, 'Theft of fuel, equipment and chemicals from remote sites.', ['remote buildings', 'theft'], 'managing', ['Property & structural protection'], ['Hazards & risks'], 'Articles'),
  k('k_hot_work', 'Protecting your operation from hot work', `${LIB}/protecting-your-operation-from-hot-work`, 'Welding and grinding sparks start many shop and harvest fires.', ['shop', 'combine'], 'managing', ['Fires & explosions'], ['Safe operating procedures'], 'Articles'),
  k('k_housekeeping', 'Housekeeping & loss prevention', `${LIB}/housekeeping-loss-prevention`, 'Clean shops and barns burn less.', ['shop', 'any buildings'], 'managing', ['Fires & explosions'], ['Inspections & maintenance'], 'Articles'),
  k('k_electrical_cl', 'Electrical walk-through checklist (NFPA 70B)', `${SA}/agrm-GCO-1242AO_ElectricWalkThroughCklist_tcm108-108472.pdf`, 'A building-by-building electrical inspection.', ['livestock barns', 'shop', 'any buildings'], 'identify', ['Fires & explosions'], ['Inspections & maintenance', 'Regulatory compliance & standards'], 'Checklists and forms'),
  k('k_thermal_pdf', 'Take advantage of Nationwide thermal imaging', `${SA}/agrm-GCO-1238AO_Take_advntge_NWthrml_tcm108-107462.pdf`, 'How customers can request a thermal imaging survey.', ['electrical', 'barns', 'hay', 'grain dryer'], 'identify', ['Fires & explosions'], ['Technology & monitoring systems'], 'Safety tips and guides'),
  k('k_exterior_cl', 'Exterior building inspection checklist', `${SA}/agrm-GCO-1229AO_ExtBldngInspCL_tcm108-108467.pdf`, 'Roofs, walls, doors and drainage — a seasonal walk-around.', ['any buildings'], 'identify', ['Property & structural protection'], ['Inspections & maintenance'], 'Checklists and forms'),
]
