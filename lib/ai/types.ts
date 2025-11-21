// Shared types for AI providers

export type AIProvider = 'claude' | 'groq' | 'deepseek';

export interface ContentGenerationParams {
  topic: string;
  concept: string;
  gradeLevel: string;
  contentAngle: string;
  testimonialUrl: string;
  testimonialTitle: string;
}

export interface GeneratedContent {
  ideaTitle: string;
  linkedinPost: string;
  redditPost: string;
  facebookPost: string;
  twitterPost: string;
  // Spanish versions
  linkedinPostEs?: string;
  redditPostEs?: string;
  facebookPostEs?: string;
  twitterPostEs?: string;
}

export interface AIProviderClient {
  generate(params: ContentGenerationParams): Promise<GeneratedContent>;
  isAvailable(): boolean;
}
