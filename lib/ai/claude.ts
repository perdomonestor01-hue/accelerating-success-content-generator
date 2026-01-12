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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        temperature: 0.9, // Increased for more creative variety
        system: `You are a TEACHER sharing real classroom experiences with other teachers. You are NOT a corporate marketing writer.

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
5. Write like a REAL TEACHER sharing a breakthrough, not a marketer pitching a product`,
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

      // Remove markdown code blocks if present (more thorough)
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\s*/g, '');
      }

      // Try to find JSON object in the response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('Claude response did not contain JSON:', textContent.text.substring(0, 500));
        throw new Error('No valid JSON found in Claude response');
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
          console.error('Failed to parse JSON:', cleanJson.substring(0, 500));
          throw new Error(`Invalid JSON in Claude response: ${parseError instanceof Error ? parseError.message : 'unknown'}`);
        }
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
