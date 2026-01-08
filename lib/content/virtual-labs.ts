/**
 * Virtual Labs Resource Library
 * Elementary Science Virtual Labs from Accelerating Success
 * These are shuffled and featured in social media posts for variety
 */

export interface VirtualLab {
  name: string;
  description: string;
  category: 'PHYSICAL_SCIENCE' | 'EARTH_SCIENCE' | 'LIFE_SCIENCE';
  subcategory: string;
  grades: string;
  url: string;
  keywords: string[]; // For matching with content topics
}

const BASE_URL = 'https://accelerating-success.com';

export const VIRTUAL_LABS: VirtualLab[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCE: Properties of Matter
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Mass Virtual Lab',
    description: 'Interactive exploration of mass measurement and comparison',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-mass/`,
    keywords: ['mass', 'weight', 'measurement', 'matter', 'properties'],
  },
  {
    name: 'Matter Detective Lab',
    description: 'Students become detectives identifying different types of matter',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '3rd-5th',
    url: `${BASE_URL}/matter-detective-lab/`,
    keywords: ['matter', 'states of matter', 'solid', 'liquid', 'gas', 'properties'],
  },
  {
    name: 'Temperature and Solubility Lab',
    description: 'Discover how temperature affects dissolving rates',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-temperature-solubility/`,
    keywords: ['temperature', 'solubility', 'dissolving', 'solutions', 'heat'],
  },
  {
    name: 'Solubility Lab',
    description: 'Investigate what dissolves and what doesn\'t',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-solubility/`,
    keywords: ['solubility', 'dissolving', 'solutions', 'mixtures'],
  },
  {
    name: 'Density Lab',
    description: 'Hands-on density investigation with virtual materials',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-density/`,
    keywords: ['density', 'mass', 'volume', 'properties of matter'],
  },
  {
    name: 'Density Tower Lab',
    description: 'Create layered density towers and predict results',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-lab-density-tower/`,
    keywords: ['density', 'layers', 'liquids', 'properties'],
  },
  {
    name: 'Thermal Conductors & Insulators Lab',
    description: 'Explore which materials transfer heat best',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-conductor-and-insulators-thermal/`,
    keywords: ['conductors', 'insulators', 'thermal', 'heat', 'energy transfer'],
  },
  {
    name: 'Electrical Conductors & Insulators Lab',
    description: 'Test materials for electrical conductivity',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Properties of Matter',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-conductor-and-insulators-electrical/`,
    keywords: ['conductors', 'insulators', 'electrical', 'circuits', 'electricity'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCE: Mixtures and Solutions
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Mixture Mansion Lab',
    description: 'Explore the mysterious Mixture Mansion to learn about mixtures',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Mixtures and Solutions',
    grades: '4th-5th',
    url: `${BASE_URL}/the-mixture-mansion-lab/`,
    keywords: ['mixtures', 'solutions', 'separating', 'compounds'],
  },
  {
    name: 'Mix Master Kitchen Lab',
    description: 'Cook up science in this kitchen-themed mixing simulation',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Mixtures and Solutions',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-mix-master-kitchen/`,
    keywords: ['mixtures', 'solutions', 'cooking', 'dissolving'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCE: Light & Circuits
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Mirror Maze Lab',
    description: 'Navigate light through mirrors and learn about reflection',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Light & Circuits',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-lab-mirror-maze/`,
    keywords: ['light', 'reflection', 'mirrors', 'optics', 'energy'],
  },
  {
    name: 'Circuits Lab',
    description: 'Build and test basic electrical circuits',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Light & Circuits',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-circuits/`,
    keywords: ['circuits', 'electricity', 'energy', 'conductors'],
  },
  {
    name: 'Parallel Circuits Lab',
    description: 'Advanced circuit building with parallel connections',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Light & Circuits',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-circuits-2/`,
    keywords: ['parallel circuits', 'series circuits', 'electricity', 'energy'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCE: Force and Motion
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Ramp Lab - Mass',
    description: 'Investigate how mass affects motion on ramps',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Force and Motion',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-force-and-motion-ramp-lab-mass/`,
    keywords: ['force', 'motion', 'mass', 'ramps', 'gravity'],
  },
  {
    name: 'Ramp Lab - Friction',
    description: 'Explore how friction affects objects on ramps',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Force and Motion',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-force-and-motion-ramp-lab-friction/`,
    keywords: ['force', 'motion', 'friction', 'ramps', 'surfaces'],
  },
  {
    name: 'Ramp Lab - Gravity',
    description: 'Study gravity\'s effects on objects rolling down ramps',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Force and Motion',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-force-and-motion-ramp-lab-gravity/`,
    keywords: ['force', 'motion', 'gravity', 'ramps', 'acceleration'],
  },
  {
    name: 'Balloon Lab - Mass',
    description: 'Balloon-powered cars explore mass and motion',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Force and Motion',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-force-and-motion-balloon-lab-mass/`,
    keywords: ['force', 'motion', 'mass', 'balloons', 'propulsion'],
  },
  {
    name: 'Balloon Lab - Friction',
    description: 'Test how friction affects balloon-powered vehicles',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Force and Motion',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-force-and-motion-balloon-lab-friction/`,
    keywords: ['force', 'motion', 'friction', 'balloons', 'surfaces'],
  },
  {
    name: 'Balloon Lab - Air Pressure',
    description: 'Explore how air pressure creates motion',
    category: 'PHYSICAL_SCIENCE',
    subcategory: 'Force and Motion',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-force-and-motion-balloon-lab-air-pressure/`,
    keywords: ['force', 'motion', 'air pressure', 'balloons', 'propulsion'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EARTH SCIENCE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Weather vs Climate Clash',
    description: 'Compare and contrast weather and climate in this interactive battle',
    category: 'EARTH_SCIENCE',
    subcategory: 'Weather & Climate',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-lab-climate-clash/`,
    keywords: ['weather', 'climate', 'atmosphere', 'temperature', 'patterns'],
  },
  {
    name: 'Sun and Shadows Lab',
    description: 'Track how the sun creates shadows throughout the day',
    category: 'EARTH_SCIENCE',
    subcategory: 'Sun & Earth',
    grades: '3rd-4th',
    url: `${BASE_URL}/virtual-lab-sun-and-shadows/`,
    keywords: ['sun', 'shadows', 'light', 'rotation', 'time'],
  },
  {
    name: 'Earth\'s Rotation Lab',
    description: 'Visualize how Earth\'s rotation causes day and night',
    category: 'EARTH_SCIENCE',
    subcategory: 'Sun & Earth',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-earths-rotation/`,
    keywords: ['rotation', 'day', 'night', 'earth', 'sun'],
  },
  {
    name: 'Sedimentary Rock Lab',
    description: 'Watch layers form into sedimentary rock over time',
    category: 'EARTH_SCIENCE',
    subcategory: 'Rocks & Minerals',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-sedimentary-rock/`,
    keywords: ['rocks', 'sedimentary', 'layers', 'fossils', 'geology'],
  },
  {
    name: 'Fossil Fuels Lab',
    description: 'Explore how fossil fuels form from ancient organisms',
    category: 'EARTH_SCIENCE',
    subcategory: 'Natural Resources',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-fossil-fuels/`,
    keywords: ['fossil fuels', 'energy', 'resources', 'oil', 'coal'],
  },
  {
    name: 'Landforms Lab',
    description: 'Explore different landforms and how they\'re created',
    category: 'EARTH_SCIENCE',
    subcategory: 'Earth\'s Surface',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-landforms/`,
    keywords: ['landforms', 'mountains', 'valleys', 'erosion', 'geography'],
  },
  {
    name: 'Solar System Lab',
    description: 'Journey through our solar system and explore each planet',
    category: 'EARTH_SCIENCE',
    subcategory: 'Space',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-solar-system/`,
    keywords: ['solar system', 'planets', 'space', 'astronomy', 'sun'],
  },
  {
    name: 'Sun, Earth, Moon System Lab',
    description: 'Model the relationships between Sun, Earth, and Moon',
    category: 'EARTH_SCIENCE',
    subcategory: 'Space',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-sun-earth-moon-system/`,
    keywords: ['sun', 'earth', 'moon', 'orbit', 'seasons', 'eclipses'],
  },
  {
    name: 'Moon Phases Lab',
    description: 'Track and predict moon phases through the lunar cycle',
    category: 'EARTH_SCIENCE',
    subcategory: 'Space',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-moon-phases/`,
    keywords: ['moon', 'phases', 'lunar cycle', 'space', 'astronomy'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Food Chains Explorer',
    description: 'Build food chains and trace energy flow through ecosystems',
    category: 'LIFE_SCIENCE',
    subcategory: 'Ecosystems',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-food-chain-explorer/`,
    keywords: ['food chains', 'ecosystems', 'producers', 'consumers', 'energy'],
  },
  {
    name: 'Food Webs Explorer',
    description: 'Connect multiple food chains into complex food webs',
    category: 'LIFE_SCIENCE',
    subcategory: 'Ecosystems',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-food-web-explorer/`,
    keywords: ['food webs', 'ecosystems', 'energy transfer', 'organisms'],
  },
  {
    name: 'Cycling of Energy and Matter Lab',
    description: 'Trace how energy and matter cycle through ecosystems',
    category: 'LIFE_SCIENCE',
    subcategory: 'Ecosystems',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-cycling-of-matter-and-energy/`,
    keywords: ['energy', 'matter', 'cycles', 'ecosystems', 'nutrients'],
  },
  {
    name: 'Ecosystem Balance Simulator',
    description: 'See what happens when ecosystem populations change',
    category: 'LIFE_SCIENCE',
    subcategory: 'Ecosystems',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-ecosystem-balance-simulator/`,
    keywords: ['ecosystems', 'balance', 'populations', 'predators', 'prey'],
  },
  {
    name: 'Biotic & Abiotic Factors Lab',
    description: 'Identify living and non-living parts of ecosystems',
    category: 'LIFE_SCIENCE',
    subcategory: 'Ecosystems',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-ecosystem-biotic-and-abiotic/`,
    keywords: ['biotic', 'abiotic', 'ecosystems', 'living', 'nonliving'],
  },
  {
    name: 'Fossil Explorer Lab',
    description: 'Dig for fossils and learn what they tell us about the past',
    category: 'LIFE_SCIENCE',
    subcategory: 'Fossils',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-fossils/`,
    keywords: ['fossils', 'paleontology', 'history', 'organisms', 'extinction'],
  },
  {
    name: 'Structure and Function Lab',
    description: 'Explore how organism structures help them survive',
    category: 'LIFE_SCIENCE',
    subcategory: 'Organisms',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-structure-and-function/`,
    keywords: ['structure', 'function', 'adaptations', 'organisms', 'survival'],
  },
  {
    name: 'Animal Behavior Lab',
    description: 'Observe and classify different animal behaviors',
    category: 'LIFE_SCIENCE',
    subcategory: 'Organisms',
    grades: '3rd-5th',
    url: `${BASE_URL}/virtual-labs-animal-behavior/`,
    keywords: ['behavior', 'animals', 'instinct', 'learned', 'survival'],
  },
  {
    name: 'Photosynthesis Lab',
    description: 'Watch plants convert sunlight into food energy',
    category: 'LIFE_SCIENCE',
    subcategory: 'Plants',
    grades: '4th-5th',
    url: `${BASE_URL}/virtual-labs-photosynthesis/`,
    keywords: ['photosynthesis', 'plants', 'energy', 'sunlight', 'chlorophyll'],
  },
  {
    name: 'Parts of a Plant Lab',
    description: 'Explore each part of a plant and its function',
    category: 'LIFE_SCIENCE',
    subcategory: 'Plants',
    grades: '3rd-4th',
    url: `${BASE_URL}/virtual-labs-parts-of-a-plant/`,
    keywords: ['plants', 'roots', 'stems', 'leaves', 'flowers', 'structure'],
  },
];

/**
 * Get a random virtual lab
 */
export function getRandomLab(): VirtualLab {
  return VIRTUAL_LABS[Math.floor(Math.random() * VIRTUAL_LABS.length)];
}

/**
 * Get a random lab by category
 */
export function getRandomLabByCategory(category: VirtualLab['category']): VirtualLab | null {
  const labs = VIRTUAL_LABS.filter(lab => lab.category === category);
  if (labs.length === 0) return null;
  return labs[Math.floor(Math.random() * labs.length)];
}

/**
 * Get labs matching keywords (for topic-relevant selection)
 */
export function getLabsByKeywords(keywords: string[]): VirtualLab[] {
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  return VIRTUAL_LABS.filter(lab =>
    lab.keywords.some(k => lowerKeywords.some(kw => k.includes(kw) || kw.includes(k)))
  );
}

/**
 * Get a random lab matching the content topic
 * Falls back to random if no match found
 */
export function getLabForTopic(concept: string, category?: string): VirtualLab {
  // Extract keywords from the concept
  const conceptWords = concept.toLowerCase().split(/[\s,]+/);

  // Find matching labs
  const matchingLabs = getLabsByKeywords(conceptWords);

  if (matchingLabs.length > 0) {
    return matchingLabs[Math.floor(Math.random() * matchingLabs.length)];
  }

  // Fall back to category match if provided
  if (category) {
    const categoryMap: Record<string, VirtualLab['category']> = {
      'PHYSICAL_SCIENCE': 'PHYSICAL_SCIENCE',
      'EARTH_SCIENCE': 'EARTH_SCIENCE',
      'LIFE_SCIENCE': 'LIFE_SCIENCE',
      'BIOLOGY': 'LIFE_SCIENCE', // Map biology to life science for elementary
    };

    const mappedCategory = categoryMap[category];
    if (mappedCategory) {
      const catLab = getRandomLabByCategory(mappedCategory);
      if (catLab) return catLab;
    }
  }

  // Ultimate fallback: random lab
  return getRandomLab();
}

/**
 * Get 2-3 featured labs for a post (shuffled)
 */
export function getFeaturedLabs(count: number = 3, concept?: string): VirtualLab[] {
  let pool = [...VIRTUAL_LABS];

  // If concept provided, prioritize matching labs
  if (concept) {
    const conceptWords = concept.toLowerCase().split(/[\s,]+/);
    const matching = getLabsByKeywords(conceptWords);
    if (matching.length >= count) {
      pool = matching;
    }
  }

  // Shuffle and take requested count
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get all unique URLs for whitelist
 */
export function getAllLabUrls(): string[] {
  return VIRTUAL_LABS.map(lab => lab.url);
}
