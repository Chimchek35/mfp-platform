import type { AdjacentKey, AssetKey, EnterpriseKey, EquineActivity, FarmType, LocationFlag, ManureType, ProtectionKey } from './types'

export interface FarmTypeDef {
  key: FarmType
  label: string
  description: string
  /** enterprises shown first and pre-highlighted for this farm type */
  typicalEnterprises: EnterpriseKey[]
  /** adjacent businesses commonly seen with this farm type */
  typicalAdjacent: AdjacentKey[]
}

export const FARM_TYPES: FarmTypeDef[] = [
  {
    key: 'rowCrop',
    label: 'Row crop / grain',
    description: 'Corn, soybeans, wheat or other field crops are the main business.',
    typicalEnterprises: ['corn', 'soybeans', 'wheat', 'hay'],
    typicalAdjacent: ['customHarvest', 'customHauling', 'grainHandling', 'energyLease', 'huntingLease'],
  },
  {
    key: 'specialtyCrop',
    label: 'Specialty crop / produce',
    description: 'Fruit, vegetables, orchards, nursery or other high-value crops.',
    typicalEnterprises: ['produce', 'orchard'],
    typicalAdjacent: ['directMarket', 'agritourism', 'processing', 'events'],
  },
  {
    key: 'beef',
    label: 'Beef cattle / ranch',
    description: 'Cow-calf, stocker or feedlot cattle on pasture or in pens.',
    typicalEnterprises: ['cowCalf', 'feedlot', 'hay'],
    typicalAdjacent: ['directMarket', 'huntingLease', 'customHauling'],
  },
  {
    key: 'dairy',
    label: 'Dairy',
    description: 'Milking herd with replacement heifers and forage.',
    typicalEnterprises: ['dairyHerd', 'corn', 'hay'],
    typicalAdjacent: ['processing', 'directMarket', 'agritourism'],
  },
  {
    key: 'swine',
    label: 'Hog / swine',
    description: 'Farrow-to-finish, wean-to-finish or contract finishing.',
    typicalEnterprises: ['hogs', 'corn', 'soybeans'],
    typicalAdjacent: ['customHauling'],
  },
  {
    key: 'poultry',
    label: 'Poultry',
    description: 'Broilers, layers or turkeys, often under contract with an integrator.',
    typicalEnterprises: ['poultryFlock'],
    typicalAdjacent: ['directMarket'],
  },
  {
    key: 'equine',
    label: 'Equine',
    description: 'Breeding, training, boarding or lessons.',
    typicalEnterprises: ['horses', 'hay'],
    typicalAdjacent: ['boarding', 'events', 'agritourism'],
  },
  {
    key: 'mixed',
    label: 'Mixed crop & livestock',
    description: 'Two or more crop and livestock enterprises that depend on each other.',
    typicalEnterprises: ['corn', 'soybeans', 'hay', 'cowCalf', 'hogs'],
    typicalAdjacent: ['customHauling', 'directMarket', 'customHarvest'],
  },
  {
    key: 'agribusiness',
    label: 'Commercial agribusiness',
    description: 'Elevator, seed or chemical dealer, custom operator or other ag service business.',
    typicalEnterprises: [],
    typicalAdjacent: ['grainHandling', 'agService', 'customHarvest', 'customHauling'],
  },
]

export type EnterpriseGroup = 'crop' | 'livestock'

export interface EnterpriseDef {
  key: EnterpriseKey
  label: string
  group: EnterpriseGroup
  /** name used when this enterprise becomes a revenue operation */
  revenueName: string
}

export const ENTERPRISES: EnterpriseDef[] = [
  { key: 'corn', label: 'Corn', group: 'crop', revenueName: 'Corn' },
  { key: 'soybeans', label: 'Soybeans', group: 'crop', revenueName: 'Soybeans' },
  { key: 'wheat', label: 'Wheat / small grains', group: 'crop', revenueName: 'Wheat & small grains' },
  { key: 'hay', label: 'Hay & forage', group: 'crop', revenueName: 'Hay & forage' },
  { key: 'produce', label: 'Vegetables / produce', group: 'crop', revenueName: 'Produce' },
  { key: 'orchard', label: 'Orchard / vineyard / nursery', group: 'crop', revenueName: 'Orchard & perennial crops' },
  { key: 'cowCalf', label: 'Cow-calf', group: 'livestock', revenueName: 'Cow-calf' },
  { key: 'feedlot', label: 'Stocker / feedlot cattle', group: 'livestock', revenueName: 'Fed & feeder cattle' },
  { key: 'dairyHerd', label: 'Dairy herd', group: 'livestock', revenueName: 'Milk' },
  { key: 'hogs', label: 'Hogs', group: 'livestock', revenueName: 'Hogs' },
  { key: 'poultryFlock', label: 'Poultry flock', group: 'livestock', revenueName: 'Poultry' },
  { key: 'horses', label: 'Horses', group: 'livestock', revenueName: 'Horse sales & training' },
  { key: 'smallRuminants', label: 'Sheep / goats', group: 'livestock', revenueName: 'Sheep & goats' },
]

export interface AdjacentDef {
  key: AdjacentKey
  label: string
  description: string
  revenueName: string
  /** assets this business almost always involves — offered (never forced) on the asset checklist */
  impliesAssets: AssetKey[]
}

export const ADJACENT: AdjacentDef[] = [
  { key: 'agritourism', label: 'Agritourism / u-pick / corn maze', description: 'The public comes onto the farm.', revenueName: 'Agritourism', impliesAssets: ['visitors'] },
  { key: 'directMarket', label: 'Farm stand / direct-to-consumer', description: 'Selling food straight to customers.', revenueName: 'Direct sales', impliesAssets: ['visitors'] },
  { key: 'customHauling', label: 'Custom hauling / trucking', description: 'Hauling grain, livestock or inputs for others.', revenueName: 'Custom hauling', impliesAssets: ['roadVehicles', 'customWork'] },
  { key: 'customHarvest', label: 'Custom harvest / spraying / planting', description: 'Running your equipment on other people’s ground.', revenueName: 'Custom field work', impliesAssets: ['customWork', 'roadVehicles'] },
  { key: 'grainHandling', label: 'Grain handling / storage for others', description: 'Drying, storing or merchandising grain.', revenueName: 'Grain handling & storage', impliesAssets: ['grainBins', 'contracts'] },
  { key: 'agService', label: 'Seed, chemical or equipment dealership', description: 'Selling inputs or service to other farms.', revenueName: 'Ag service / dealership', impliesAssets: ['visitors', 'computerRecords'] },
  { key: 'boarding', label: 'Livestock or horse boarding', description: 'Caring for animals owned by others.', revenueName: 'Boarding', impliesAssets: ['visitors', 'livestockBarns'] },
  { key: 'events', label: 'Events / weddings / lessons', description: 'Hosting paying guests for events or instruction.', revenueName: 'Events & lessons', impliesAssets: ['visitors'] },
  { key: 'energyLease', label: 'Solar / renewable energy lease', description: 'Leasing ground or roofs for solar or wind, or rights to an energy company.', revenueName: 'Energy lease income', impliesAssets: ['contracts', 'solarEv'] },
  { key: 'huntingLease', label: 'Hunting / recreation lease', description: 'Leasing land access to hunters or recreation users.', revenueName: 'Hunting lease income', impliesAssets: ['visitors', 'contracts'] },
  { key: 'processing', label: 'On-farm processing / direct sales of products', description: 'Bottling, packing, butchering, baking or making products you sell.', revenueName: 'Value-added products', impliesAssets: ['visitors', 'contracts'] },
  { key: 'fuelDistribution', label: 'Fuel / propane distribution', description: 'Selling or delivering fuel or propane to others.', revenueName: 'Fuel & propane sales', impliesAssets: ['fuelStorage', 'roadVehicles'] },
]

export const EQUINE_ACTIVITIES: { key: EquineActivity; label: string }[] = [
  { key: 'boarding', label: 'Boarding horses owned by others' },
  { key: 'breeding', label: 'Breeding / stud' },
  { key: 'lessons', label: 'Riding lessons or trail rides' },
  { key: 'training', label: 'Training horses for clients' },
  { key: 'events', label: 'Shows, clinics or events' },
]

/** Section 5 agritourism lists. `insurable: false` activities are NOT insurable under the program. */
export const AGRITOURISM_ACTIVITIES: { key: string; label: string; insurable: boolean }[] = [
  { key: 'pickYourOwn', label: 'Pick-your-own', insurable: true },
  { key: 'roadsideStand', label: 'Roadside stand', insurable: true },
  { key: 'farmersMarket', label: "Farmers' market", insurable: true },
  { key: 'incidentalHunting', label: 'Incidental hunting / fishing', insurable: true },
  { key: 'selectTree', label: 'Select-your-own Christmas tree', insurable: true },
  { key: 'festivals', label: 'Festivals / haunted houses', insurable: true },
  { key: 'cornMaze', label: 'Corn maze', insurable: true },
  { key: 'hayRidesOn', label: 'On-premises hay rides', insurable: true },
  { key: 'pettingZoo', label: 'Petting zoo', insurable: true },
  { key: 'hayRidesOff', label: 'Off-premises hay rides', insurable: false },
  { key: 'inflatables', label: 'Inflatables (bounce houses, slides)', insurable: false },
  { key: 'cutTree', label: 'Cut-your-own Christmas trees', insurable: false },
]

export const MANURE_TYPES: { key: ManureType; label: string }[] = [
  { key: 'enclosedPit', label: 'Enclosed pit (under barn)' },
  { key: 'tank', label: 'Above- or below-ground tank' },
  { key: 'lagoon', label: 'Lagoon / earthen basin' },
]

export const LOCATION_FLAGS: { key: LocationFlag; label: string; hint: string }[] = [
  { key: 'snow', label: 'Heavy snow', hint: 'Roof snow load' },
  { key: 'wildfire', label: 'Wildfire', hint: 'Defensible space' },
  { key: 'hailWind', label: 'Hail & high wind', hint: 'Roofs, doors, bins' },
  { key: 'earthquake', label: 'Earthquake', hint: 'Usually excluded unless added' },
  { key: 'flood', label: 'Flood / water', hint: 'Backup and flood exclusions' },
]

export const enterpriseDef = (k: EnterpriseKey) => ENTERPRISES.find((e) => e.key === k)!
export const adjacentDef = (k: AdjacentKey) => ADJACENT.find((a) => a.key === k)!
export const farmTypeDef = (k: FarmType) => FARM_TYPES.find((f) => f.key === k)!

export const CROP_ENTERPRISES = ENTERPRISES.filter((e) => e.group === 'crop').map((e) => e.key)
export const LIVESTOCK_ENTERPRISES = ENTERPRISES.filter((e) => e.group === 'livestock').map((e) => e.key)
export const CROP_FARM_TYPES: FarmType[] = ['rowCrop', 'specialtyCrop', 'mixed']
export const LIVESTOCK_FARM_TYPES: FarmType[] = ['beef', 'dairy', 'swine', 'poultry', 'equine', 'mixed']

export type AssetGroup = 'Grain & harvest' | 'Livestock & manure' | 'Buildings, energy & fire' | 'Vehicles & technology' | 'People, visitors & contracts'
export const ASSET_GROUPS: AssetGroup[] = ['Grain & harvest', 'Livestock & manure', 'Buildings, energy & fire', 'Vehicles & technology', 'People, visitors & contracts']

export const ASSETS: { key: AssetKey; label: string; hint: string; group: AssetGroup }[] = [
  { key: 'grainBins', label: 'Grain bins / storage', hint: 'Entrapment, structural and dust hazards', group: 'Grain & harvest' },
  { key: 'grainDryer', label: 'Grain dryer or bucket elevator', hint: 'Dryer fires and dust explosions', group: 'Grain & harvest' },
  { key: 'combine', label: 'Combine / harvest equipment', hint: 'Harvest fires and breakdowns', group: 'Grain & harvest' },
  { key: 'hayStorage', label: 'Hay storage (barn or stacks)', hint: 'Spontaneous combustion', group: 'Grain & harvest' },
  { key: 'manurePits', label: 'Manure storage (pit, tank or lagoon)', hint: 'Deadly gases, foaming, spills', group: 'Livestock & manure' },
  { key: 'livestockBarns', label: 'Livestock barns, confinement or poultry houses', hint: 'Fire, ventilation failure, disease', group: 'Livestock & manure' },
  { key: 'milkingRefrigeration', label: 'Milking parlor / bulk tank refrigeration', hint: 'Milk spoilage if power fails', group: 'Livestock & manure' },
  { key: 'shopBuildings', label: 'Shop & machinery buildings', hint: 'Fire, hot work, snow load', group: 'Buildings, energy & fire' },
  { key: 'fuelStorage', label: 'Fuel, LP or propane tanks', hint: 'Fire, leaks and spills', group: 'Buildings, energy & fire' },
  { key: 'solarEv', label: 'Solar panels, EV chargers or battery storage', hint: 'Electrical and battery fires', group: 'Buildings, energy & fire' },
  { key: 'heaters', label: 'Wood stove or portable heaters', hint: 'Heater and chimney fires', group: 'Buildings, energy & fire' },
  { key: 'sprinklers', label: 'Fire sprinklers or alarm system', hint: 'Must be inspected to work', group: 'Buildings, energy & fire' },
  { key: 'sumpPumps', label: 'Sump pumps / basement drains', hint: 'Water backup', group: 'Buildings, energy & fire' },
  { key: 'remoteBuildings', label: 'Remote buildings or sites away from the home place', hint: 'Theft, slow fire detection', group: 'Buildings, energy & fire' },
  { key: 'chemicalStorage', label: 'Chemical or fertilizer storage', hint: 'Spills, fire, exposure', group: 'Buildings, energy & fire' },
  { key: 'newConstruction', label: 'Planning a new building or renovation', hint: 'Build in fire and weather resistance', group: 'Buildings, energy & fire' },
  { key: 'farmHome', label: 'Farm home on the property', hint: 'Home fire and liability', group: 'Buildings, energy & fire' },
  { key: 'roadVehicles', label: 'Trucks or equipment on public roads', hint: 'Road crashes, fleet coverage', group: 'Vehicles & technology' },
  { key: 'atvs', label: 'ATVs / UTVs', hint: 'Rollover injuries', group: 'Vehicles & technology' },
  { key: 'youthRiders', label: 'Riders under 16 on ATVs/UTVs', hint: 'Higher injury severity', group: 'Vehicles & technology' },
  { key: 'drones', label: 'Drones', hint: 'Crashes and neighbor complaints', group: 'Vehicles & technology' },
  { key: 'cameras', label: 'Security cameras / connected sensors', hint: 'Cyber exposure, monitoring', group: 'Vehicles & technology' },
  { key: 'computerRecords', label: 'Computerized records / precision ag / software', hint: 'Data loss, ransomware', group: 'Vehicles & technology' },
  { key: 'gpsEquipment', label: 'GPS-guided equipment', hint: 'Outage at planting or harvest', group: 'Vehicles & technology' },
  { key: 'visitors', label: 'Visitors or public on the farm', hint: 'Guest injury, reputation', group: 'People, visitors & contracts' },
  { key: 'minors', label: 'Minors employed (under 18)', hint: 'Age and hazardous-job rules', group: 'People, visitors & contracts' },
  { key: 'contractors', label: 'Contractors working on site', hint: 'Who is liable if they’re hurt', group: 'People, visitors & contracts' },
  { key: 'customWork', label: 'Custom work for others', hint: 'Contract and liability exposure', group: 'People, visitors & contracts' },
  { key: 'contracts', label: 'Contracts with buyers or landlords', hint: 'Contract disputes', group: 'People, visitors & contracts' },
]

export const BUILDING_ASSETS: AssetKey[] = [
  'grainBins',
  'livestockBarns',
  'shopBuildings',
  'fuelStorage',
  'farmHome',
  'hayStorage',
  'remoteBuildings',
]

export type ProtectionGroup = 'Insurance' | 'Plans & procedures' | 'Backups & alternates' | 'People & communication'

export const PROTECTIONS: { key: ProtectionKey; label: string; group: ProtectionGroup; term?: string }[] = [
  { key: 'farmProperty', label: 'Farm property insurance', group: 'Insurance' },
  { key: 'farmLiability', label: 'Farm liability insurance', group: 'Insurance' },
  { key: 'umbrella', label: 'Umbrella policy', group: 'Insurance', term: 'Umbrella' },
  { key: 'cropInsurance', label: 'Crop insurance (RP / YP)', group: 'Insurance', term: 'RP' },
  { key: 'lrp', label: 'Livestock Risk Protection (LRP)', group: 'Insurance', term: 'LRP' },
  { key: 'workersComp', label: "Workers' compensation", group: 'Insurance' },
  { key: 'businessIncome', label: 'Business income / interruption', group: 'Insurance', term: 'Business income' },
  { key: 'cyber', label: 'Cyber liability', group: 'Insurance' },
  { key: 'autoFleet', label: 'Auto / fleet coverage for farm trucks', group: 'Insurance' },
  { key: 'emergencyPlan', label: 'Written emergency plan', group: 'Plans & procedures' },
  { key: 'keyProcedures', label: 'Written key procedures', group: 'Plans & procedures' },
  { key: 'successionPlan', label: 'Written succession / transition plan', group: 'Plans & procedures' },
  { key: 'crossTrained', label: 'Someone cross-trained for each critical job', group: 'People & communication' },
  { key: 'contactList', label: 'Emergency contact list', group: 'People & communication' },
  { key: 'spokesperson', label: 'A named spokesperson for the farm', group: 'People & communication' },
  { key: 'offsiteBackup', label: 'Off-site data backup', group: 'Backups & alternates' },
  { key: 'generator', label: 'Backup generator', group: 'Backups & alternates' },
  { key: 'altBuyer', label: 'Alternate buyer', group: 'Backups & alternates' },
  { key: 'altSupplier', label: 'Alternate supplier', group: 'Backups & alternates' },
]

export const PROTECTION_GROUPS: ProtectionGroup[] = [
  'Insurance',
  'Plans & procedures',
  'People & communication',
  'Backups & alternates',
]

export const STATUS_LABEL = { have: 'Have', unsure: 'Not sure', none: "Don't have" } as const

export const REVIEW_LABEL = {
  within12: 'Within the last 12 months',
  longer: 'More than 12 months ago',
  never: 'Never',
} as const

export const US_STATES: [string, string][] = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'],
  ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'],
  ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'],
  ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'],
  ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
]
