import { ContentGenerationParams } from './types';

export function buildContentGenerationPrompt(params: ContentGenerationParams): string {
  const { topic, concept, gradeLevel, contentAngle, testimonialUrl, testimonialTitle } = params;

  return `You are a marketing expert for Accelerating Success (@AccSuccess), an educational platform offering bilingual (English/Spanish) Science resources for grades 3-8.

Generate a compelling social media content idea and 4 platform-specific posts.

TOPIC: ${topic} - ${concept}
GRADE LEVEL: ${gradeLevel}
CONTENT ANGLE: ${contentAngle}
TESTIMONIAL VIDEO: ${testimonialUrl} (${testimonialTitle})

═══════════════════════════════════════════════════════════════════════════════
TEKS CHAPTER 112 ALIGNMENT - Texas Essential Knowledge and Skills for Science
(Implemented 2024-2025 School Year per §112.41 and §112.46)
═══════════════════════════════════════════════════════════════════════════════

All Accelerating Success content is aligned to TEKS Chapter 112 standards. When creating content, emphasize this official Texas curriculum alignment.

WHAT ACCELERATING SUCCESS OFFERS:

📚 SCIENCE (Grades 3-5) - TEKS Chapter 112, Subchapter A:
- Physical Science: matter & states of matter, forces & motion, energy transfer, circuits, light
- Earth Science: weather & seasons, water cycle, rocks & minerals, natural resources, conservation
- Life Science: animal & plant adaptations, food chains & webs, ecosystems, life cycles

🔬 SCIENCE (Grades 6-8 Biology) - TEKS Chapter 112, Subchapter B & C:
- Core Biology (§112.42): biological structures, cell functions, mechanisms of genetics, biological evolution, interdependence within environmental systems
- Physical Science: matter & chemical changes, forces & motion, energy transformations
- Earth Science: Earth systems & processes, weather & climate, natural resources & conservation
- Life Science: ecosystems & biomes, organism interactions, evolution & adaptation

📋 TEKS SCIENTIFIC & ENGINEERING PRACTICES (40% instructional time requirement):
- Ask questions and define problems based on observations
- Plan and conduct investigations using appropriate tools
- Collect quantitative and qualitative data as evidence
- Develop and use models to represent phenomena
- Distinguish among scientific hypotheses, theories, and laws

KEY FEATURES:
- ✅ TEKS Chapter 112 aligned (2024-2025 implementation) - meets Texas state science standards
- ✅ STAAR-ready practice questions and assessments
- Bilingual resources (every lesson in English AND Spanish)
- Game-based learning that students love
- Interactive E-Books and "10 Minute Science" lessons
- Ready-to-teach modules (saves teacher prep time)
- Supports scientific & engineering practices (hands-on investigations)
- Works for whole-group, small-group, and independent learning
- Built by experienced Texas educators who understand TEKS requirements
- Subscription link: https://accelerating-success.com/subscriptions/
- Email signup: https://accelerating-success.com/subscribe
- Offer: 7-day free trial, no strings attached

IMPORTANT MESSAGING POINTS:
- Always mention "TEKS-aligned" or "aligned to TEKS Chapter 112" in posts
- Reference the 2024-2025 school year implementation when relevant
- Emphasize that content meets Texas state science curriculum requirements
- Highlight that resources support the 40% hands-on investigation requirement

REQUIREMENTS:
1. Create a relatable teacher pain point or engaging question for the content idea
2. Generate 7 EXTENDED posts (LinkedIn, Reddit, Facebook, Twitter/X, Blogger, Tumblr, Pinterest)
3. Include CONCRETE EXAMPLES showing how teachers actually use the platform
4. Add testimonial video naturally in the posts
5. End with DUAL CTAs (offer choice):
   - PRIMARY: Start 7-day free trial → subscription link
   - SECONDARY: Not ready? Join email list for free resources → email signup link
6. Platform-specific tone and formatting:
   - LinkedIn: Professional, educator-focused, use [text](url) for links, 3-5 paragraphs
   - Reddit: Authentic, conversational, use [text](url) for markdown links, ask for community input, 3-4 paragraphs
   - Facebook: Friendly, shareable, visual, tag-a-friend style, use [text](url) for links, 3-4 paragraphs
   - Twitter/X: Concise (under 280 chars), punchy, use "text → url" format
   - Blogger: Article-style blog post with HTML formatting, 5-7 paragraphs, educational tone, include <h2> headings
   - Tumblr: Creative, casual, mix of text and personality, 3-4 paragraphs, use emojis

EXTENDED CONTENT STRUCTURE:
📌 Hook (relatable pain point or question)
📚 Specific example: "For example, when teaching ${concept} to ${gradeLevel} graders..."
💡 How it works: Describe 2-3 specific features/benefits
🎬 Testimonial: Include video with authentic teacher voice
✨ Results: What teachers experience (time saved, engagement boost, etc.)
🎁 Dual CTA:
   • Option 1: "Ready to try? [Start your free trial](subscription-link) - 7 days, no commitment"
   • Option 2: "Want to explore first? [Join our email list](email-link) for free lesson samples"
📱 Hashtags: Relevant to platform and topic

CRITICAL LINK FORMATTING:
Use embedded links with SHORT text (2-3 words max):

PRIMARY CTA (Trial):
- LinkedIn: [Start your free trial](https://accelerating-success.com/subscriptions/)
- Reddit: [Try it free for 7 days](https://accelerating-success.com/subscriptions/)
- Facebook: [Get your free trial](https://accelerating-success.com/subscriptions/)
- Twitter: "Start free trial → https://accelerating-success.com/subscriptions/"

SECONDARY CTA (Email List):
- LinkedIn: [Join our email list](https://accelerating-success.com/subscribe)
- Reddit: [Sign up for updates](https://accelerating-success.com/subscribe)
- Facebook: [Get free resources](https://accelerating-success.com/subscribe)
- Twitter: "Free resources → https://accelerating-success.com/subscribe"

Keep link text SHORT and actionable!

EXAMPLE EXTENDED POST (LinkedIn):
---
Ever spend your entire Sunday prepping a weather unit... only to have your students zone out on Monday? 🌧️

Here's what happened when I tried teaching the Water Cycle to my 4th graders last year: I spent 4 hours creating worksheets, finding videos, and printing vocab cards. Monday morning? Half the class was confused, and the other half was bored.

This year, I'm using Accelerating Success for my weather unit, and it's completely different:
• The platform has a ready-to-teach Water Cycle module aligned to TEKS Chapter 112 with game-based vocab (my kids are OBSESSED with the matching game)
• Every lesson comes in English AND Spanish - perfect for my bilingual learners
• Built-in STAAR practice questions that meet the 2024-2025 TEKS requirements
• Supports the 40% hands-on investigation time with ready-made activities
• I prep in 10 minutes instead of 4 hours

Check out what this teacher says: [video link]

The best part? I'm seeing WAY more engagement. Students are actually asking to do the vocab games during free time - and I know I'm meeting state standards!

🎁 Ready to reclaim your weekends with TEKS-aligned content? [Start your free trial](https://accelerating-success.com/subscriptions/) - 7 days, zero commitment.

Not quite ready? [Join our email list](https://accelerating-success.com/subscribe) for free TEKS-aligned lesson samples and teaching tips delivered to your inbox!

#TeacherLife #ScienceTeacher #STAAR #TEKS #BilingualEducation #EdTech #TexasTeachers
---

BILINGUAL REQUIREMENT:
Generate content in BOTH English and Spanish. Accelerating Success is a bilingual platform, so provide Spanish translations of all posts.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "ideaTitle": "The Sunday Prep Struggle",
  "linkedinPost": "full LinkedIn post here in ENGLISH...",
  "redditPost": "full Reddit post here in ENGLISH...",
  "facebookPost": "full Facebook post here in ENGLISH...",
  "twitterPost": "full Twitter post here in ENGLISH (under 280 chars)...",
  "bloggerPost": "full Blogger article with HTML tags in ENGLISH...",
  "tumblrPost": "full Tumblr post in ENGLISH...",
  "linkedinPostEs": "full LinkedIn post here in SPANISH...",
  "redditPostEs": "full Reddit post here in SPANISH...",
  "facebookPostEs": "full Facebook post here in SPANISH...",
  "twitterPostEs": "full Twitter post here in SPANISH (under 280 chars)...",
  "bloggerPostEs": "full Blogger article with HTML tags in SPANISH...",
  "tumblrPostEs": "full Tumblr post in SPANISH..."
}`;
}

export function buildRecycleVariationPrompt(
  originalIdeaTitle: string,
  originalLinkedin: string,
  params: ContentGenerationParams
): string {
  const { topic, concept, testimonialUrl } = params;

  return `Take this successful content idea and create a FRESH VARIATION.

ORIGINAL IDEA: "${originalIdeaTitle}"
ORIGINAL LINKEDIN POST: "${originalLinkedin}"

Keep:
- Same topic: ${topic} - ${concept}
- Same benefits: bilingual, ready-to-teach, time-saving, game-based
- Same testimonial video: ${testimonialUrl}
- Same subscription offer: 7-day free trial

Change:
- Different hook/pain point (new teacher struggle or question)
- Different storytelling approach
- Fresh wording throughout (not copy-paste)
- Different hashtags

Example variations of "Sunday Prep Struggle":
- "Monday Morning Panic Mode"
- "Ever wake up at 2am stressing about lesson plans?"
- "The Teacher's Weeknight Struggle"

Generate 4 new platform posts that feel completely fresh but deliver the same value.

CRITICAL: Use embedded links, not raw URLs:
- LinkedIn: [text](url)
- Reddit: [text](url)
- Facebook: [text](url)
- Twitter: "text → url"

Return ONLY valid JSON:
{
  "ideaTitle": "new idea title here",
  "linkedinPost": "...",
  "redditPost": "...",
  "facebookPost": "...",
  "twitterPost": "..."
}`;
}
