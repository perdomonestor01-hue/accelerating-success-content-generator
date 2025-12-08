import { AIProviderClient, ContentGenerationParams, GeneratedContent } from './types';
import { buildContentGenerationPrompt } from './prompts';

export class DeepSeekProvider implements AIProviderClient {
  constructor() {
    // DeepSeek uses OpenAI-compatible API
  }

  isAvailable(): boolean {
    return !!process.env.DEEPSEEK_API_KEY;
  }

  async generate(params: ContentGenerationParams): Promise<GeneratedContent> {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key not configured');
    }

    const prompt = buildContentGenerationPrompt(params);

    try {
      // DeepSeek uses OpenAI-compatible API endpoint
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
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
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API returned ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content in DeepSeek response');
      }

      // Extract JSON from the response - handle markdown code blocks
      let jsonText = content.trim();

      // Remove markdown code blocks if present
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\s*/g, '');
      }

      // Try to find JSON object
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('DeepSeek response (first 500 chars):', content.substring(0, 500));
        throw new Error('No valid JSON found in DeepSeek response');
      }

      // Clean up the JSON string - aggressive cleaning for control characters
      let cleanJson = jsonMatch[0]
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, '')
        .replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
          return match.replace(/\n/g, ' ').replace(/\r/g, '');
        })
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');

      let result;
      try {
        result = JSON.parse(cleanJson);
      } catch (parseError) {
        console.log('First JSON parse failed, trying aggressive cleanup...');
        cleanJson = cleanJson
          .replace(/\n/g, ' ')
          .replace(/\r/g, '')
          .replace(/\t/g, ' ')
          .replace(/\s+/g, ' ');
        try {
          result = JSON.parse(cleanJson);
          console.log('✅ Aggressive cleanup succeeded');
        } catch (e) {
          console.error('JSON parse error:', parseError);
          console.error('Attempted to parse (first 500 chars):', cleanJson.substring(0, 500));
          throw new Error(`Invalid JSON in DeepSeek response: ${parseError instanceof Error ? parseError.message : 'unknown error'}`);
        }
      }

      // Validate the response structure
      if (!result.ideaTitle || !result.linkedinPost || !result.redditPost ||
          !result.facebookPost || !result.twitterPost) {
        throw new Error('Invalid response structure from DeepSeek');
      }

      return result as GeneratedContent;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`DeepSeek API error: ${error.message}`);
      }
      throw error;
    }
  }
}
