// Shared types for AI providers

export type AIProvider = 'claude' | 'groq' | 'deepseek';

export interface ContentGenerationParams {
  topic: string;
  concept: string;
  gradeLevel: string;
  contentAngle: string;
  testimonialUrl: string;
  testimonialTitle: string;
  // Recent content to avoid repetition
  recentTitles?: string[];
  recentHooks?: string[];
  // Pain point focus for meaningful, specific content
  painPoint?: {
    id: string;
    title: string;
    struggle: string;
    solution: string;
    hookIdeas: string[];
  };
  // TEKS reference for accuracy (e.g., "§112.28")
  teksRef?: string;
  // Variety elements - selected BEFORE generation and EXCLUDED from recent
  varietyElements?: {
    voiceStyle: { id: string; name: string; description: string; openingStyle: string; example: string };
    narrativeFormat: { id: string; name: string; structure: string; cta_placement: string };
    openingPattern: { id: string; pattern: string; example: string };
  };
  // Recent patterns to EXCLUDE from selection
  recentPatterns?: {
    voiceStyles: string[];
    narrativeFormats: string[];
    openingPatterns: string[];
    painPointIds: string[];
  };
}

export interface VarietySelection {
  voiceStyle: { id: string; name: string; description: string; openingStyle: string; example: string };
  narrativeFormat: { id: string; name: string; structure: string; cta_placement: string };
  openingPattern: { id: string; pattern: string; example: string };
}

export interface GeneratedContent {
  ideaTitle: string;
  linkedinPost: string;
  redditPost: string;
  facebookPost: string;
  twitterPost: string;
  bloggerPost?: string;
  tumblrPost?: string;
  // Spanish versions
  linkedinPostEs?: string;
  redditPostEs?: string;
  facebookPostEs?: string;
  twitterPostEs?: string;
  bloggerPostEs?: string;
  tumblrPostEs?: string;
}

export interface AIProviderClient {
  generate(params: ContentGenerationParams): Promise<GeneratedContent>;
  isAvailable(): boolean;
}
