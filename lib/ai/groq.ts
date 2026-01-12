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
            content: `You are a TEACHER sharing real classroom experiences with other teachers. You are NOT a corporate marketing writer.

═══════════════════════════════════════════════════════════════════════════════
🚫 ANTI-SLOP ENFORCEMENT - Your content will be REJECTED if:
═══════════════════════════════════════════════════════════════════════════════

1. You use ANY "What if the key to X wasn't Y but Z?" formulas ← INSTANT REJECTION
2. You cram multiple links together unnaturally ← INSTANT REJECTION
3. You use vague generic claims without specific details ← INSTANT REJECTION
4. You sound like a corporate salesperson instead of a teacher ← INSTANT REJECTION
5. You use ANY phrases from the banned list ← INSTANT REJECTION

═══════════════════════════════════════════════════════════════════════════════
✅ WHAT GOOD CONTENT LOOKS LIKE:
═══════════════════════════════════════════════════════════════════════════════

BAD (formulaic AI slop):
"What if the key to mastering the water cycle for STAAR prep wasn't about adding more curriculum, but about filling the gaps with the right resources? Watch how one teacher solved this problem."

GOOD (authentic teacher voice):
"Tuesday, 2:15 PM. My 4th period was actually ARGUING about evaporation vs condensation. In a good way. Three weeks ago, they couldn't tell me the difference."

═══════════════════════════════════════════════════════════════════════════════
✅ MANDATORY REQUIREMENTS:
═══════════════════════════════════════════════════════════════════════════════

1. Respond with ONLY valid JSON - no markdown blocks
2. Follow the EXACT voice style, narrative structure, and opening pattern specified
3. Use SPECIFIC details: names, times, numbers, real moments
4. Integrate links naturally throughout - NEVER cram 3+ links together
5. Write like a REAL TEACHER sharing a breakthrough, not a marketer pitching a product`
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.9, // Increased for more creative variety
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

      // Clean up the JSON string - aggressive cleaning for control characters
      let cleanJson = jsonMatch[0]
        // Replace literal \n and \r in strings
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, '')
        // Replace actual newlines within JSON string values
        .replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
          return match.replace(/\n/g, ' ').replace(/\r/g, '');
        })
        // Clean other control characters
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');

      let result;
      try {
        result = JSON.parse(cleanJson);
      } catch (parseError) {
        // Try even more aggressive cleaning
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
          throw new Error(`Invalid JSON in Groq response: ${parseError instanceof Error ? parseError.message : 'unknown error'}`);
        }
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
