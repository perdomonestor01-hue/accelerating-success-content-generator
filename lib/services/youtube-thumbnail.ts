/**
 * YouTube Thumbnail Service
 * Extracts video IDs and generates thumbnail URLs for YouTube videos/shorts
 *
 * Safety features:
 * - URL domain validation (only youtube.com, youtu.be)
 * - Video ID format validation (11 chars, alphanumeric + dash/underscore)
 */

// Valid YouTube video ID: exactly 11 characters, alphanumeric + dash + underscore
const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

// Valid YouTube domains
const YOUTUBE_DOMAINS = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'];

export interface YouTubeThumbnail {
  videoId: string;
  maxres: string;      // 1280x720 (may not exist for all videos)
  hq: string;          // 480x360
  mq: string;          // 320x180
  default: string;     // 120x90
  sddefault: string;   // 640x480
}

/**
 * Validate that a video ID matches YouTube's format
 * YouTube video IDs are exactly 11 characters: [a-zA-Z0-9_-]
 */
export function isValidVideoId(videoId: string): boolean {
  return VIDEO_ID_REGEX.test(videoId);
}

/**
 * Validate that a URL is from a valid YouTube domain
 */
function isYouTubeDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    return YOUTUBE_DOMAINS.some(domain => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

/**
 * Extract video ID from various YouTube URL formats
 * Supports:
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/embed/VIDEO_ID
 *
 * Returns null if URL is not from YouTube or video ID is invalid
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Security: Validate YouTube domain first (prevent SSRF)
  if (!isYouTubeDomain(url)) {
    console.log(`⚠️ Non-YouTube URL rejected: ${url}`);
    return null;
  }

  let videoId: string | null = null;

  // YouTube Shorts format: youtube.com/shorts/VIDEO_ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) videoId = shortsMatch[1];

  // Standard watch format: youtube.com/watch?v=VIDEO_ID
  if (!videoId) {
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) videoId = watchMatch[1];
  }

  // Short URL format: youtu.be/VIDEO_ID
  if (!videoId) {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) videoId = shortMatch[1];
  }

  // Embed format: youtube.com/embed/VIDEO_ID
  if (!videoId) {
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) videoId = embedMatch[1];
  }

  // Validate video ID format
  if (videoId && !isValidVideoId(videoId)) {
    console.log(`⚠️ Invalid video ID format: ${videoId}`);
    return null;
  }

  return videoId;
}

/**
 * Get all thumbnail URLs for a YouTube video
 */
export function getYouTubeThumbnails(videoId: string): YouTubeThumbnail {
  const base = `https://img.youtube.com/vi/${videoId}`;

  return {
    videoId,
    maxres: `${base}/maxresdefault.jpg`,   // 1280x720 (best quality, may 404)
    hq: `${base}/hqdefault.jpg`,           // 480x360 (always available)
    mq: `${base}/mqdefault.jpg`,           // 320x180
    default: `${base}/default.jpg`,        // 120x90
    sddefault: `${base}/sddefault.jpg`,    // 640x480
  };
}

/**
 * Get the best available thumbnail URL for a YouTube video
 * Tries maxres first, falls back to hq
 */
export async function getBestThumbnail(url: string): Promise<string | null> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  const thumbnails = getYouTubeThumbnails(videoId);

  // Try maxres first (best quality)
  try {
    const response = await fetch(thumbnails.maxres, { method: 'HEAD' });
    if (response.ok) {
      return thumbnails.maxres;
    }
  } catch {
    // maxres not available, continue
  }

  // Fall back to hq (always available)
  return thumbnails.hq;
}

/**
 * Get thumbnail URL directly (synchronous, uses hq which is always available)
 */
export function getThumbnailUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  // Use hqdefault as it's guaranteed to exist
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Get high-quality thumbnail URL (sddefault - 640x480)
 * Good balance between quality and availability
 */
export function getHQThumbnailUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
}

/**
 * Get maxres thumbnail URL (may not exist for all videos)
 */
export function getMaxResThumbnailUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
