/**
 * Testimonial Videos Configuration
 * These YouTube Shorts will be rotated through content generation
 * Scraped from: https://youtube.com/playlist?list=PLLoHRJ_mh-3AIjz2xratC5vEi1sKFV7HR
 */

export interface TestimonialVideo {
  url: string;
  title: string;
  duration: string;
  description?: string;
}

export const testimonialVideos: TestimonialVideo[] = [
  {
    url: 'https://www.youtube.com/shorts/uJHP380LbqI',
    title: 'Science Songs Aligned to TEKS! Sample Song at end!',
    duration: '1:21',
    description: 'Overview of science songs with sample'
  },
  {
    url: 'https://www.youtube.com/shorts/FC_5CXTUl9o',
    title: "I'm a teacher, and I love Accelerating Success!",
    duration: '0:57',
    description: 'Enthusiastic teacher testimonial about our platform'
  },
  {
    url: 'https://www.youtube.com/shorts/97KvRilcO_M',
    title: 'Rigor and STAAR Test Preparation',
    duration: '0:45',
    description: 'Teacher testimonial about STAAR test prep and academic rigor'
  },
  {
    url: 'https://www.youtube.com/shorts/rPZHCvNdVdM',
    title: 'Low Prep, High Engagement: Teaching Made Easy!',
    duration: '0:40',
    description: 'How our platform makes teaching easier'
  },
  {
    url: 'https://www.youtube.com/shorts/6t-hgE7Cpcg',
    title: 'Engaging Students in Science Through Songs and Jokes!',
    duration: '0:39',
    description: 'How we engage students with fun, interactive learning'
  },
  {
    url: 'https://www.youtube.com/shorts/ZDaUZVAz6m4',
    title: 'Why Teachers Love Accelerating Success',
    duration: '0:42',
    description: 'Teachers share why they love our platform'
  },
  {
    url: 'https://www.youtube.com/shorts/-dotIxM5QnQ',
    title: 'Why Teachers Love Acc',
    duration: '0:42',
    description: 'Teacher sharing their experience with Accelerating Success'
  },
  {
    url: 'https://www.youtube.com/shorts/9A8tfWJ3G3k',
    title: '🎮 Science STAAR Vocab Game',
    duration: '0:43',
    description: 'Interactive vocabulary game for STAAR prep'
  },
  {
    url: 'https://www.youtube.com/shorts/gMBnQOC0p-4',
    title: '🎶 Science Songs Aligned to TEKS',
    duration: '0:50',
    description: 'Educational songs aligned with Texas standards'
  },
  {
    url: 'https://www.youtube.com/shorts/R4vBp7JkUJQ',
    title: '📚 New 3rd–5th Grade Resource Flow For Science Success!',
    duration: '0:43',
    description: 'Overview of grade 3-5 science resources'
  },
  {
    url: 'https://www.youtube.com/shorts/4C6r9S40sN4',
    title: '📺 YouTube Free Video Library Full of Science Content!',
    duration: '0:40',
    description: 'Free video library for science education'
  },
  {
    url: 'https://www.youtube.com/shorts/sKMTIM4awws',
    title: '🔍 TEKS Aligned Online Modules for Science Success!',
    duration: '0:49',
    description: 'TEKS-aligned online learning modules'
  },
  {
    url: 'https://www.youtube.com/shorts/xoPBLxzHSGI',
    title: '🌐 Full Spanish Translations for Science Success!',
    duration: '0:43',
    description: 'Bilingual support with full Spanish translations'
  },
  {
    url: 'https://www.youtube.com/shorts/oEkHhxHipwU',
    title: '🧪 Printable Hands On Investigations',
    duration: '0:30',
    description: 'Hands-on science activities and experiments'
  },
  {
    url: 'https://www.youtube.com/shorts/aW-dkiBbsHA',
    title: 'Science STAAR Vocabulary Games',
    duration: '0:43',
    description: 'Vocabulary games for STAAR test preparation'
  },
];

/**
 * Get a testimonial video using round-robin rotation
 * Uses current timestamp to ensure different videos over time
 */
export function getRotatedTestimonial(): TestimonialVideo {
  // Use current time to create a rotating index
  const index = Math.floor(Date.now() / 1000 / 60) % testimonialVideos.length;
  return testimonialVideos[index];
}

/**
 * Get a random testimonial video (for variety)
 */
export function getRandomTestimonial(): TestimonialVideo {
  const index = Math.floor(Math.random() * testimonialVideos.length);
  return testimonialVideos[index];
}

/**
 * Get a specific testimonial video by index
 */
export function getTestimonialByIndex(index: number): TestimonialVideo {
  const safeIndex = index % testimonialVideos.length;
  return testimonialVideos[safeIndex];
}
