import axios from 'axios';

/**
 * Image Service - Fetches free images from Unsplash
 * Uses Unsplash's free API for education-themed images
 *
 * Safety features:
 * - 30 second timeout on all requests
 * - Fallback images if API fails
 */

// Constants
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds

export interface ImageResult {
  url: string;           // Direct image URL
  thumbnailUrl: string;  // Smaller preview
  photographer: string;  // Attribution
  photographerUrl: string;
  downloadUrl: string;   // Unsplash download endpoint (triggers their analytics)
  width: number;
  height: number;
}

// Education/teaching themed search terms for variety
const EDUCATION_SEARCH_TERMS = [
  'teacher classroom',
  'science education',
  'student learning',
  'classroom teaching',
  'school science lab',
  'elementary school',
  'children learning science',
  'teacher helping student',
  'science experiment kids',
  'school education',
  'happy classroom',
  'teaching children',
];

// Fallback images if API fails (Unsplash direct URLs that are stable)
const FALLBACK_IMAGES: ImageResult[] = [
  {
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    photographer: 'Element5 Digital',
    photographerUrl: 'https://unsplash.com/@element5digital',
    downloadUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    width: 1200,
    height: 800,
  },
  {
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400',
    photographer: 'NeONBRAND',
    photographerUrl: 'https://unsplash.com/@neonbrand',
    downloadUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
    width: 1200,
    height: 800,
  },
  {
    url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400',
    photographer: 'Element5 Digital',
    photographerUrl: 'https://unsplash.com/@element5digital',
    downloadUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45',
    width: 1200,
    height: 800,
  },
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400',
    photographer: 'ThisisEngineering',
    photographerUrl: 'https://unsplash.com/@thisisengineering',
    downloadUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b',
    width: 1200,
    height: 800,
  },
  {
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    photographer: 'Brooke Cagle',
    photographerUrl: 'https://unsplash.com/@brookecagle',
    downloadUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    width: 1200,
    height: 800,
  },
];

export class ImageService {
  private accessKey: string | undefined;
  private lastUsedIndex: number = -1;

  constructor() {
    this.accessKey = process.env.UNSPLASH_ACCESS_KEY;
  }

  /**
   * Check if the image service is properly configured
   */
  isEnabled(): boolean {
    return !!this.accessKey;
  }

  /**
   * Search for an education-related image
   * @param customQuery Optional custom search term (will be combined with education context)
   */
  async searchImage(customQuery?: string): Promise<ImageResult> {
    // If no API key, use fallback images
    if (!this.accessKey) {
      console.log('⚠️ Unsplash API key not configured, using fallback images');
      return this.getFallbackImage();
    }

    try {
      // Build search query
      const baseQuery = customQuery
        ? `${customQuery} education classroom`
        : this.getRandomSearchTerm();

      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: baseQuery,
          per_page: 10,
          orientation: 'landscape', // Best for LinkedIn
          content_filter: 'high',   // Safe for work
        },
        headers: {
          Authorization: `Client-ID ${this.accessKey}`,
        },
        timeout: REQUEST_TIMEOUT_MS,
      });

      const photos = response.data.results;

      if (!photos || photos.length === 0) {
        console.log('No images found for query, using fallback');
        return this.getFallbackImage();
      }

      // Pick a random photo from results
      const photo = photos[Math.floor(Math.random() * photos.length)];

      // Trigger Unsplash download endpoint (required by their guidelines)
      await this.triggerDownload(photo.links.download_location);

      return {
        url: `${photo.urls.regular}&w=1200`,
        thumbnailUrl: photo.urls.small,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        downloadUrl: photo.links.download_location,
        width: photo.width,
        height: photo.height,
      };
    } catch (error: any) {
      console.error('Unsplash API error:', error.message);
      return this.getFallbackImage();
    }
  }

  /**
   * Get a random image without searching (faster, uses curated collection)
   */
  async getRandomImage(): Promise<ImageResult> {
    if (!this.accessKey) {
      return this.getFallbackImage();
    }

    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query: this.getRandomSearchTerm(),
          orientation: 'landscape',
          content_filter: 'high',
        },
        headers: {
          Authorization: `Client-ID ${this.accessKey}`,
        },
        timeout: REQUEST_TIMEOUT_MS,
      });

      const photo = response.data;

      // Trigger download
      await this.triggerDownload(photo.links.download_location);

      return {
        url: `${photo.urls.regular}&w=1200`,
        thumbnailUrl: photo.urls.small,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        downloadUrl: photo.links.download_location,
        width: photo.width,
        height: photo.height,
      };
    } catch (error: any) {
      console.error('Unsplash random API error:', error.message);
      return this.getFallbackImage();
    }
  }

  /**
   * Download image binary data (for LinkedIn upload)
   */
  async downloadImageBuffer(imageUrl: string): Promise<Buffer> {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: REQUEST_TIMEOUT_MS,
    });
    return Buffer.from(response.data);
  }

  /**
   * Trigger Unsplash download endpoint (required by API guidelines)
   */
  private async triggerDownload(downloadUrl: string): Promise<void> {
    try {
      await axios.get(downloadUrl, {
        headers: {
          Authorization: `Client-ID ${this.accessKey}`,
        },
        timeout: REQUEST_TIMEOUT_MS,
      });
    } catch (error) {
      // Non-critical, just log
      console.log('Download trigger failed (non-critical)');
    }
  }

  /**
   * Get a random education-themed search term
   */
  private getRandomSearchTerm(): string {
    const index = Math.floor(Math.random() * EDUCATION_SEARCH_TERMS.length);
    return EDUCATION_SEARCH_TERMS[index];
  }

  /**
   * Get a fallback image (rotates through list)
   */
  private getFallbackImage(): ImageResult {
    this.lastUsedIndex = (this.lastUsedIndex + 1) % FALLBACK_IMAGES.length;
    return FALLBACK_IMAGES[this.lastUsedIndex];
  }
}

// Singleton export
export const imageService = new ImageService();
