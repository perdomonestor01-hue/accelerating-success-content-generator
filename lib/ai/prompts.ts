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
(Implemented 2024-2025 School Year per §112.25)
═══════════════════════════════════════════════════════════════════════════════

All Accelerating Success content is aligned to TEKS Chapter 112 standards. When creating content, emphasize this official Texas curriculum alignment.

WHAT ACCELERATING SUCCESS OFFERS:

📚 ELEMENTARY SCIENCE (Grades 3-5) - TEKS Chapter 112, Subchapter A:
- Physical Science: matter & states of matter, forces & motion, energy transfer, circuits, light
- Earth Science: weather & seasons, water cycle, rocks & minerals, natural resources, conservation
- Life Science: animal & plant adaptations, food chains & webs, ecosystems, life cycles

═══════════════════════════════════════════════════════════════════════════════
🔬 MIDDLE SCHOOL SCIENCE - TEKS Chapter 112, Subchapter B (§112.26-112.28)
Adopted 2021, Implemented 2024-2025 per §112.25
═══════════════════════════════════════════════════════════════════════════════

📗 GRADE 6 SCIENCE (§112.26):
MATTER AND ENERGY:
- Compare solids, liquids, gases (structure, shape, volume, kinetic energy)
- Distinguish pure substances, homogeneous & heterogeneous mixtures
- Identify elements as metals, nonmetals, metalloids on Periodic Table
- Compare density of substances relative to fluids
- Identify chemical changes (gas production, thermal energy, precipitate, color change)

FORCE, MOTION, AND ENERGY:
- Forces: gravity, friction, magnetism, applied forces, normal forces
- Calculate net force, balanced vs unbalanced forces
- Newton's Third Law of Motion (equal & opposite force pairs)
- Potential vs kinetic energy (gravitational, elastic, chemical)
- Energy conservation through transfers and transformations
- Transverse and longitudinal waves

EARTH AND SPACE:
- Seasons (tilted Earth revolving around Sun)
- Ocean tides (daily, spring, neap) from gravitational forces
- Earth's spheres: biosphere, hydrosphere, atmosphere, geosphere
- Layers of Earth: inner core, outer core, mantle, crust
- Rock cycle: metamorphic, igneous, sedimentary rocks

ORGANISMS AND ENVIRONMENTS:
- Ecosystems: biotic factors, abiotic factors, competition
- Predatory, competitive, symbiotic relationships (mutualism, parasitism, commensalism)
- Hierarchical organization: organism → population → community → ecosystem
- Cell theory and characteristics of prokaryotic/eukaryotic, unicellular/multicellular organisms
- Variations affecting population survival

📘 GRADE 7 SCIENCE (§112.27):
MATTER AND ENERGY:
- Elements vs compounds (atoms, molecules, chemical symbols, formulas)
- Using the periodic table to identify atoms in chemical formulas
- Physical vs chemical changes
- Aqueous solutions (solute, solvent, concentration, dilution)
- Factors affecting dissolution (temperature, surface area, agitation)

FORCE, MOTION, AND ENERGY:
- Calculate average speed using distance and time
- Speed vs velocity (distance, displacement, direction)
- Distance-time graphs
- Newton's First Law of Motion (balanced/unbalanced forces)
- Thermal energy transfer: conduction, convection, radiation
- Thermal equilibrium
- Temperature and kinetic energy relationship

EARTH AND SPACE:
- Solar system: Sun, planets, moons, meteors, asteroids, comets, Kuiper belt, Oort cloud
- Gravity governing motion in solar system
- Earth's characteristics that allow life
- Plate tectonics: fossils, superposition, earthquakes, mountains, volcanoes

ORGANISMS AND ENVIRONMENTS:
- Energy flow through trophic levels (energy pyramids)
- Matter and nutrient cycling in biosphere
- Human body systems (circulatory, respiratory, skeletal, muscular, digestive, etc.)
- Cells → tissues → organs → organ systems
- Sexual vs asexual reproduction
- Natural and artificial selection
- Taxonomic classification system

📙 GRADE 8 SCIENCE (§112.28):
MATTER AND ENERGY:
- Elements, compounds, homogeneous/heterogeneous mixtures
- Chemical reactions using periodic table
- Properties of water (cohesion, adhesion, surface tension)
- Acids and bases (pH relative to water)
- Conservation of mass in chemical reactions
- Photosynthesis equation

FORCE, MOTION, AND ENERGY:
- Newton's Second Law (F=ma, acceleration dependent on net force and mass)
- All three Newton's Laws working together in systems
- Wave characteristics: amplitude, frequency, wavelength
- Electromagnetic spectrum applications (radiation therapy, wireless, fiber optics, X-rays)

EARTH AND SPACE:
- Star life cycles, Hertzsprung-Russell diagram
- Galaxy types: spiral, elliptical, irregular
- Milky Way and Earth's location
- Origin of universe theories
- Weather systems and climate
- Ocean currents and tropical cyclones
- Climate impacts from natural events and human activity
- Carbon cycle

ORGANISMS AND ENVIRONMENTS:
- Cell organelles (membrane, wall, nucleus, ribosomes, cytoplasm, mitochondria, chloroplasts, vacuoles)
- Genes and chromosomes determining inherited traits
- Ecological succession (primary and secondary)
- Biodiversity and ecosystem stability
- Adaptations influencing survival

📋 TEKS SCIENTIFIC & ENGINEERING PRACTICES (40% instructional time requirement):
- Ask questions and define problems based on observations
- Plan and conduct descriptive, comparative, and experimental investigations
- Collect quantitative (SI units) and qualitative data as evidence
- Construct tables, graphs, maps, and charts to organize data
- Develop and use models to represent phenomena
- Distinguish among scientific hypotheses, theories, and laws
- Engage in scientific argumentation using empirical evidence

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
5. End with CTAs:
   - PRIMARY: Start 7-day free trial → subscription link
   - SECONDARY (NOT for LinkedIn): Not ready? Join email list for free resources → email signup link
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
🎁 CTA:
   • All platforms: "Ready to try? [Start your free trial](subscription-link) - 7 days, no commitment"
   • NOT for LinkedIn: "Want to explore first? [Join our email list](email-link) for free lesson samples"
📱 Hashtags: Relevant to platform and topic

CRITICAL LINK FORMATTING:
Use embedded links with SHORT text (2-3 words max):

PRIMARY CTA (Trial):
- LinkedIn: [Start your free trial](https://accelerating-success.com/subscriptions/)
- Reddit: [Try it free for 7 days](https://accelerating-success.com/subscriptions/)
- Facebook: [Get your free trial](https://accelerating-success.com/subscriptions/)
- Twitter: "Start free trial → https://accelerating-success.com/subscriptions/"

SECONDARY CTA (Email List) - NOT for LinkedIn:
- Reddit: [Sign up for updates](https://accelerating-success.com/subscribe)
- Facebook: [Get free resources](https://accelerating-success.com/subscribe)
- Twitter: "Free resources → https://accelerating-success.com/subscribe"

Keep link text SHORT and actionable!

CRITICAL - VARIETY REQUIREMENT:
⚠️ NEVER repeat the same hook or title from previous posts!
⚠️ Each day's content MUST feel completely fresh and different!

VARY YOUR HOOKS - Use a DIFFERENT one each time from categories like:
• PAIN POINTS: "Late night grading...", "Parent conference stress...", "STAAR anxiety...", "Differentiation headaches...", "ELL student struggles..."
• QUESTIONS: "What if you could...?", "Remember when...?", "Have you ever...?", "Why do teachers...?"
• STORYTELLING: "Last Tuesday, a student...", "My principal walked in during...", "A parent email changed..."
• OBSERVATIONS: "I noticed something...", "Here's what top teachers do...", "The secret to engaged students..."
• SEASONAL: "Back to school chaos...", "End of semester crunch...", "Testing season survival..."

DO NOT USE "Sunday Prep Struggle" or variations of it! Create completely NEW hooks based on the specific ${concept} being taught.

EXAMPLE HOOKS FOR DIFFERENT TOPICS (use as inspiration, NOT to copy):
• Newton's Laws: "My students thought they understood force... until the egg drop challenge 🥚"
• Water Cycle: "Why do kids forget evaporation by the next day? Here's what finally worked..."
• Photosynthesis: "I used to dread teaching photosynthesis until I discovered this game-changer 🌱"
• Cells: "That moment when your students can actually LABEL a cell diagram correctly ✨"
• Ecosystems: "Food webs used to confuse my class. Now they're teaching EACH OTHER."
---

BILINGUAL REQUIREMENT:
Generate content in BOTH English and Spanish. Accelerating Success is a bilingual platform, so provide Spanish translations of all posts.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "ideaTitle": "A UNIQUE creative title based on ${concept} - NEVER use 'Sunday Prep Struggle'",
  "linkedinPost": "full LinkedIn post here in ENGLISH with a FRESH hook...",
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
