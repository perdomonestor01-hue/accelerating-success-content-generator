import Anthropic from '@anthropic-ai/sdk';
import { AIProviderClient, ContentGenerationParams, GeneratedContent } from './types';
import { buildContentGenerationPrompt } from './prompts';

export class ClaudeProvider implements AIProviderClient {
  private client: Anthropic | null = null;

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  isAvailable(): boolean {
    return this.client !== null && !!process.env.ANTHROPIC_API_KEY;
  }

  async generate(params: ContentGenerationParams): Promise<GeneratedContent> {
    if (!this.client) {
      throw new Error('Claude API key not configured');
    }

    const prompt = buildContentGenerationPrompt(params);

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const textContent = response.content[0];
      if (textContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Extract JSON from the response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Claude response');
      }

      const result = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (!result.ideaTitle || !result.linkedinPost || !result.redditPost ||
          !result.facebookPost || !result.twitterPost) {
        throw new Error('Invalid response structure from Claude');
      }

      return result as GeneratedContent;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Claude API error: ${error.message}`);
      }
      throw error;
    }
  }
}
