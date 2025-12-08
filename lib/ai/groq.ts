import Groq from 'groq-sdk';
import { AIProviderClient, ContentGenerationParams, GeneratedContent } from './types';
import { buildContentGenerationPrompt } from './prompts';

export class GroqProvider implements AIProviderClient {
  private client: Groq | null = null;

  constructor() {
    if (process.env.GROQ_API_KEY) {
      this.client = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    }
  }

  isAvailable(): boolean {
    return this.client !== null && !!process.env.GROQ_API_KEY;
  }

  async generate(params: ContentGenerationParams): Promise<GeneratedContent> {
    if (!this.client) {
      throw new Error('Groq API key not configured');
    }

    const prompt = buildContentGenerationPrompt(params);

    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing expert. You MUST respond with ONLY valid JSON, no markdown, no explanations, just the JSON object. Follow the voice style, narrative format, and opening pattern instructions EXACTLY. NEVER use banned phrases.'
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 8192,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in Groq response');
      }

      // Extract JSON from the response - handle markdown code blocks
      let jsonText = content.trim();

      // Remove markdown code blocks if present
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\s*/g, '');
      }

      // Try to find JSON object - match balanced braces
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Groq response (first 500 chars):', content.substring(0, 500));
        throw new Error('No valid JSON found in Groq response');
      }

      // Clean up the JSON string - remove control characters that break parsing
      let cleanJson = jsonMatch[0]
        .replace(/[\x00-\x1F\x7F]/g, (char) => {
          // Keep newlines and tabs, replace others with space
          if (char === '\n' || char === '\r' || char === '\t') return char;
          return ' ';
        });

      let result;
      try {
        result = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Attempted to parse (first 500 chars):', cleanJson.substring(0, 500));
        throw new Error(`Invalid JSON in Groq response: ${parseError instanceof Error ? parseError.message : 'unknown error'}`);
      }

      // Validate the response structure
      if (!result.ideaTitle || !result.linkedinPost || !result.redditPost ||
          !result.facebookPost || !result.twitterPost) {
        throw new Error('Invalid response structure from Groq');
      }

      return result as GeneratedContent;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Groq API error: ${error.message}`);
      }
      throw error;
    }
  }
}
