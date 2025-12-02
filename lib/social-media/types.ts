// Social Media Posting Types
import { Platform as PrismaPlatform, PostingStatus as PrismaPostingStatus } from '@prisma/client';

// Re-export Prisma enums
export type Platform = PrismaPlatform;
export type PostingStatus = PrismaPostingStatus;

export interface PostingResult {
  success: boolean;
  platform: Platform;
  postId?: string;
  postUrl?: string;
  error?: string;
  rateLimited?: boolean;
  retryAfter?: number;
}

export interface SocialMediaPoster {
  platform: Platform;
  isEnabled(): Promise<boolean>;
  post(content: string, mediaUrl?: string): Promise<PostingResult>;
  testConnection(): Promise<boolean>;
  refreshToken?(): Promise<void>;
}

export interface PlatformConfig {
  enabled: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  config?: Record<string, any>;
}
