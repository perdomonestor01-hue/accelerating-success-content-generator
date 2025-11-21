// Texas TEKS 2025 Curriculum Mapping for Grades 3-8
// Focused on Science and Biology

export const texasCurriculum = {
  'Science': [
    'Force, Motion & Energy',
    'Matter & Energy',
    'Light & Sound',
    'Electricity & Magnetism',
    'Heat Transfer',
    'Properties of Matter',
    'Physical & Chemical Changes',
    'Weather & Water Cycle',
    'Rocks, Minerals & Soil',
    'Earth\'s Surface & Landforms',
    'Oceans & Water Systems',
    'Climate & Seasons',
    'Natural Resources',
    'Fossils & Earth History',
    'Solar System & Space',
    'Plant & Animal Life Cycles',
    'Ecosystems & Habitats',
    'Food Chains & Webs',
    'Inherited Traits & Adaptations',
    'Cell Structure & Function',
    'Classification of Organisms',
    'Photosynthesis & Respiration',
    'Human Body Systems',
  ],
  'Biology': [
    'Cell Biology & Genetics',
    'DNA & Heredity',
    'Evolution & Natural Selection',
    'Cellular Respiration',
    'Protein Synthesis',
    'Mitosis & Meiosis',
    'Genetics & Punnett Squares',
    'Biological Molecules',
    'Enzyme Function',
    'Homeostasis',
    'Molecular Biology',
    'Ecology & Populations',
  ],
};

export type CurriculumTopic = keyof typeof texasCurriculum;
