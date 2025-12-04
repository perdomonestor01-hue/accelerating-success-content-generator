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
        max_tokens: 8192,
        temperature: 0.7,
        system: 'You are a marketing expert. You MUST respond with ONLY valid JSON, no markdown, no explanations, just the JSON object.',
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

      // Extract JSON from the response - handle various formats
      let jsonText = textContent.text.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to find JSON object in the response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Claude response did not contain JSON:', textContent.text.substring(0, 500));
        throw new Error('No valid JSON found in Claude response');
      }

      let result;
      try {
        result = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse JSON:', jsonMatch[0].substring(0, 500));
        throw new Error('Invalid JSON in Claude response');
      }

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
