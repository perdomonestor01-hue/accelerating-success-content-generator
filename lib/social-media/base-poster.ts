import { PostingResult, SocialMediaPoster, Platform } from './types';

export abstract class BasePoster implements SocialMediaPoster {
  abstract platform: Platform;

  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    const delays = [1000, 2000, 4000];

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        if (i === maxRetries) throw error;

        const delay = delays[i] || delays[delays.length - 1];
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  abstract isEnabled(): Promise<boolean>;
  abstract post(content: string, mediaUrl?: string): Promise<PostingResult>;
  abstract testConnection(): Promise<boolean>;
}
