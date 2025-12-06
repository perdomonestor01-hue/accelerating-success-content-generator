import { AIProvider, AIProviderClient, ContentGenerationParams, GeneratedContent } from './types';
import { ClaudeProvider } from './claude';
import { GroqProvider } from './groq';
import { DeepSeekProvider } from './deepseek';

// Banned phrases that should never appear in titles
const BANNED_TITLE_PHRASES = [
  'sunday prep struggle',
  'prep struggle',
  'weekend prep',
  'sunday prep',
];

// Generate a replacement title if banned phrase is detected
function generateReplacementTitle(params: ContentGenerationParams): string {
  const { concept, gradeLevel } = params;
  const titleOptions = [
    `When ${concept} Finally Clicked for My ${gradeLevel} Graders`,
    `The ${concept} Breakthrough Every Teacher Needs`,
    `${gradeLevel} Grade ${concept}: A Teaching Transformation`,
    `Why My Students Now Love ${concept}`,
    `${concept} Success: From Confusion to Confidence`,
    `Teaching ${concept} the Way It Should Be Done`,
    `The ${concept} Lesson That Changed Everything`,
    `STAAR Prep for ${concept}: What Actually Works`,
  ];
  return titleOptions[Math.floor(Math.random() * titleOptions.length)];
}

// Validate and fix generated content
function validateAndFixContent(content: GeneratedContent, params: ContentGenerationParams): GeneratedContent {
  const titleLower = content.ideaTitle.toLowerCase();

  // Check if title contains any banned phrases
  const hasBannedPhrase = BANNED_TITLE_PHRASES.some(phrase => titleLower.includes(phrase));

  if (hasBannedPhrase) {
    console.log(`⚠️ Banned phrase detected in title: "${content.ideaTitle}". Replacing...`);
    content.ideaTitle = generateReplacementTitle(params);
    console.log(`✅ New title: "${content.ideaTitle}"`);
  }

  return content;
}

export class AIProviderManager {
  private providers: Map<AIProvider, AIProviderClient>;
  private defaultProvider: AIProvider;

  constructor() {
    this.providers = new Map([
      ['claude', new ClaudeProvider()],
      ['groq', new GroqProvider()],
      ['deepseek', new DeepSeekProvider()],
    ]);

    this.defaultProvider = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'claude';
  }

  /**
   * Get an available AI provider with fallback logic
   */
  private getAvailableProvider(): AIProviderClient | null {
    // Try the default provider first
    const defaultClient = this.providers.get(this.defaultProvider);
    if (defaultClient?.isAvailable()) {
      return defaultClient;
    }

    // Fallback to any available provider
    for (const [name, client] of this.providers) {
      if (client.isAvailable()) {
        console.log(`Falling back to ${name} provider`);
        return client;
      }
    }

    return null;
  }

  /**
   * Generate content using the best available AI provider
   */
  async generateContent(params: ContentGenerationParams): Promise<GeneratedContent> {
    const provider = this.getAvailableProvider();

    if (!provider) {
      throw new Error(
        'No AI provider available. Please configure at least one API key (ANTHROPIC_API_KEY, GROQ_API_KEY, or DEEPSEEK_API_KEY)'
      );
    }

    try {
      const content = await provider.generate(params);
      return validateAndFixContent(content, params);
    } catch (error) {
      // If the default provider fails, try a fallback
      console.error(`Error with primary provider, attempting fallback:`, error);

      // Try other providers
      for (const [name, client] of this.providers) {
        if (client !== provider && client.isAvailable()) {
          try {
            console.log(`Attempting fallback with ${name}`);
            const content = await client.generate(params);
            return validateAndFixContent(content, params);
          } catch (fallbackError) {
            console.error(`Fallback ${name} also failed:`, fallbackError);
          }
        }
      }

      // If all providers fail, throw the original error
      throw error;
    }
  }

  /**
   * Check which providers are available
   */
  getAvailableProviders(): AIProvider[] {
    const available: AIProvider[] = [];
    for (const [name, client] of this.providers) {
      if (client.isAvailable()) {
        available.push(name);
      }
    }
    return available;
  }

  /**
   * Get the current default provider
   */
  getDefaultProvider(): AIProvider {
    return this.defaultProvider;
  }
}

// Export a singleton instance
export const aiProvider = new AIProviderManager();
