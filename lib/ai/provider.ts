import { AIProvider, AIProviderClient, ContentGenerationParams, GeneratedContent } from './types';
import { ClaudeProvider } from './claude';
import { GroqProvider } from './groq';
import { DeepSeekProvider } from './deepseek';
import { getAllLabUrls } from '../content/virtual-labs';

// ═══════════════════════════════════════════════════════════════════════════════
// URL WHITELIST - Only these URLs are allowed in AI-generated content
// ═══════════════════════════════════════════════════════════════════════════════
const BASE_ALLOWED_URLS = [
  'https://accelerating-success.com/subscriptions/',
  'https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/',
  'https://accelerating-success.com/free-8th-grade-conservation-of-mass-periodic-table-online-modules-canva-slide/',
  'https://accelerating-success.com/elementary-virtual-labs/',
  // YouTube domains for testimonials
  'https://youtube.com/',
  'https://www.youtube.com/',
  'https://youtu.be/',
];

// Get all allowed URLs including virtual labs
function getAllowedUrls(): string[] {
  return [...BASE_ALLOWED_URLS, ...getAllLabUrls()];
}

// Extract all URLs from text content
function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s\)\]"'<>]+/gi;
  const matches = text.match(urlRegex) || [];
  // Clean trailing punctuation
  return matches.map(url => url.replace(/[.,;:!?)]+$/, ''));
}

// Validate that all URLs in content are whitelisted
function validateUrls(content: GeneratedContent): { valid: boolean; invalidUrls: string[] } {
  const allowedUrls = getAllowedUrls();

  // Combine all text content
  const allText = [
    content.linkedinPost,
    content.redditPost,
    content.facebookPost,
    content.twitterPost,
    content.bloggerPost || '',
    content.tumblrPost || '',
  ].join(' ');

  const foundUrls = extractUrls(allText);
  const invalidUrls: string[] = [];

  for (const url of foundUrls) {
    const isAllowed = allowedUrls.some(allowed => url.startsWith(allowed));
    if (!isAllowed) {
      invalidUrls.push(url);
    }
  }

  return {
    valid: invalidUrls.length === 0,
    invalidUrls,
  };
}

// Remove invalid URLs from content (replace with subscription URL)
function sanitizeUrls(content: GeneratedContent): GeneratedContent {
  const allowedUrls = getAllowedUrls();
  const fallbackUrl = 'https://accelerating-success.com/subscriptions/';

  const sanitizeText = (text: string): string => {
    const urls = extractUrls(text);
    let sanitized = text;

    for (const url of urls) {
      const isAllowed = allowedUrls.some(allowed => url.startsWith(allowed));
      if (!isAllowed) {
        console.log(`🚨 Removing hallucinated URL: ${url}`);
        sanitized = sanitized.replace(url, fallbackUrl);
      }
    }

    return sanitized;
  };

  return {
    ...content,
    linkedinPost: sanitizeText(content.linkedinPost),
    redditPost: sanitizeText(content.redditPost),
    facebookPost: sanitizeText(content.facebookPost),
    twitterPost: sanitizeText(content.twitterPost),
    bloggerPost: content.bloggerPost ? sanitizeText(content.bloggerPost) : undefined,
    tumblrPost: content.tumblrPost ? sanitizeText(content.tumblrPost) : undefined,
  };
}

// Banned phrases that should never appear in titles (lowercase for comparison)
const BANNED_TITLE_PHRASES = [
  'sunday prep struggle',
  'prep struggle',
  'weekend prep',
  'sunday prep',
  'the struggle is real',
  'struggle is real',
  'reclaim your weekends',  // in title (allowed in body CTAs)
  'game changer',
  'game-changer',
];

// Banned patterns that should never appear in ANY content (body text)
const BANNED_BODY_PATTERNS = [
  'what if the key to',
  'wasn\'t about adding more',
  'but about filling the gaps',
  'watch how one teacher',
  'solved this problem',
  'discover the difference',
  'see the impact',
  'start your free trial to discover',
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

// Check for banned patterns in content body
function checkBannedPatterns(text: string): string[] {
  const textLower = text.toLowerCase();
  const found: string[] = [];

  for (const pattern of BANNED_BODY_PATTERNS) {
    if (textLower.includes(pattern)) {
      found.push(pattern);
    }
  }

  // Check for link cramming: ](url)[text](url) pattern
  if (text.match(/\]\([^)]+\)\[/)) {
    found.push('MULTIPLE_LINKS_CRAMMED');
  }

  return found;
}

// Validate and fix generated content
function validateAndFixContent(content: GeneratedContent, params: ContentGenerationParams): GeneratedContent {
  // 1. Validate and fix title
  const titleLower = content.ideaTitle.toLowerCase();
  const hasBannedPhrase = BANNED_TITLE_PHRASES.some(phrase => titleLower.includes(phrase));

  if (hasBannedPhrase) {
    console.log(`⚠️ Banned phrase detected in title: "${content.ideaTitle}". Replacing...`);
    content.ideaTitle = generateReplacementTitle(params);
    console.log(`✅ New title: "${content.ideaTitle}"`);
  }

  // 2. Check for banned patterns in body content
  const allBodyText = [
    content.linkedinPost,
    content.facebookPost,
    content.redditPost,
    content.twitterPost,
    content.bloggerPost || '',
    content.tumblrPost || '',
  ].join(' ');

  const bannedPatternsFound = checkBannedPatterns(allBodyText);
  if (bannedPatternsFound.length > 0) {
    console.log(`🚨 CRITICAL: Banned patterns detected in content body:`);
    bannedPatternsFound.forEach(pattern => console.log(`   - "${pattern}"`));
    console.log(`⚠️ This content violates anti-slop rules. Consider regenerating.`);
    // Don't auto-fix body content - log the issue for monitoring
    // This helps us identify if the AI is still producing slop despite system prompt
  }

  // 3. Validate and sanitize URLs (CRITICAL: prevent AI hallucinations)
  const urlValidation = validateUrls(content);
  if (!urlValidation.valid) {
    console.log(`🚨 AI hallucinated ${urlValidation.invalidUrls.length} invalid URL(s):`);
    urlValidation.invalidUrls.forEach(url => console.log(`   - ${url}`));
    content = sanitizeUrls(content);
    console.log(`✅ URLs sanitized - replaced with approved URLs`);
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
