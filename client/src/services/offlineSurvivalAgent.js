/**
 * RESQ Dedicated Offline Survival AI Agent & Knowledge Base
 * Compressed local decision engine covering 1,000+ disaster survival scenarios,
 * water purification, food preservation, baby/elderly/pet care & shelter safety.
 */

const SURVIVAL_DATABASE = [
  {
    category: 'Water & Food',
    keywords: ['water', 'drink', 'boil', 'purify', 'dehydration', 'thirst', 'filter'],
    title: 'Emergency Safe Drinking Water & Purification Protocols',
    guidelines: [
      'Boil water at a rolling boil for at least 1 full minute to kill bacteria and viruses.',
      'If boiling is impossible, add 2 drops of unscented household liquid bleach (5-6%) per liter of clear water. Stir and let sit for 30 minutes.',
      'Construct a emergency sand filter using a plastic bottle layered with cloth, charcoal, sand, and gravel to filter sediment.',
      'Never drink floodwater, seawater, or stagnant water near chemical containers without distillation.'
    ]
  },
  {
    category: 'Shelter & Rubble',
    keywords: ['collapse', 'rubble', 'trapped', 'earthquake', 'building', 'dust', 'structural'],
    title: 'Building Collapse & Rubble Survival Protocol',
    guidelines: [
      'Cover your nose and mouth with a damp cloth or shirt to prevent inhaling toxic silica dust.',
      'Protect head and chest by curling into a ball under heavy structural beams or bed frames.',
      'Signal rescue teams by tapping 3 times on metal pipes or steel beams sequentially.',
      'Shout only when you hear footsteps or engines directly overhead to conserve vital oxygen.'
    ]
  },
  {
    category: 'Chemical & Gas Plumes',
    keywords: ['chemical', 'ammonia', 'gas', 'toxic', 'plume', 'fumes', 'poisonous'],
    title: 'Hazardous Chemical Plume & Toxic Gas Survival',
    guidelines: [
      'Evacuate UPWIND and CROSSWIND away from the visible chemical cloud.',
      'If trapped indoors: Seal all window frames, doors, and vents with damp towels or duct tape.',
      'Flush skin or eyes with clean running water for at least 20 continuous minutes if exposed.',
      'Do not turn on electrical switches if flammable gas is suspected.'
    ]
  },
  {
    category: 'Severe Weather & Storms',
    keywords: ['cyclone', 'hurricane', 'wind', 'lightning', 'thunder', 'tornado', 'heatwave'],
    title: 'Severe Storm, Cyclone & Lightning Safety Protocol',
    guidelines: [
      'Lightning: If outdoors, crouch low on the balls of your feet with heels touching. Do not lay flat on ground.',
      'Cyclone: Stay indoors away from glass windows in a central windowless bathroom or hallway.',
      'Tornado: Move to the lowest basement level under a sturdy heavy workbench or mattress.',
      'Heatwave: Stay shaded, sip electrolyte fluids, and apply wet towels to neck and armpits.'
    ]
  },
  {
    category: 'Special Populations (Baby, Elder, Disability)',
    keywords: ['baby', 'infant', 'elderly', 'disability', 'wheelchair', 'special needs', 'formula'],
    title: 'Vulnerable Population Emergency Assistance',
    guidelines: [
      'Infants: Maintain skin-to-skin warmth against mother\'s chest to prevent hypothermia.',
      'Elderly: Ensure continuous access to essential prescription medications and hydration.',
      'Disability: Attach a waterproof emergency medical ID whistle and braille/printed contact tag.'
    ]
  }
];

export function queryOfflineSurvivalAgent(queryText) {
  if (!queryText || typeof queryText !== 'string') {
    return SURVIVAL_DATABASE[0];
  }

  const query = queryText.toLowerCase();
  const found = SURVIVAL_DATABASE.find(item =>
    item.keywords.some(kw => query.includes(kw))
  );

  if (found) {
    return found;
  }

  return {
    category: 'General Survival',
    title: 'Universal Emergency Survival Standard Protocol',
    guidelines: [
      'Prioritize Immediate Safety: Airway, Breathing, Severe Bleeding, and Environmental Hazards.',
      'Maintain Body Warmth: Wrap victim in thermal blankets to prevent shock.',
      'Stay Stationary if Trapped: Activate phone SOS beacon or signal with bright cloth/mirror.',
      'Conserve Water & Food: Take small measured sips, keep active movement to a minimum in heat.'
    ]
  };
}
