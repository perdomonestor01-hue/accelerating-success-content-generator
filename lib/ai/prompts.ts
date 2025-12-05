import { ContentGenerationParams } from './types';

export function buildContentGenerationPrompt(params: ContentGenerationParams): string {
  const { topic, concept, gradeLevel, contentAngle, testimonialUrl, testimonialTitle, recentTitles, recentHooks, painPoint, teksRef } = params;

  // ═══════════════════════════════════════════════════════════════════════════════
  // PAIN-POINT DRIVEN CONTENT GENERATION
  // Instead of generic "Sunday Prep Struggle" repeated with different grade levels,
  // we now create meaningful, specific content focused on real teacher struggles
  // ═══════════════════════════════════════════════════════════════════════════════

  // Build pain point section if provided (from daily cron)
  const painPointSection = painPoint ? `
═══════════════════════════════════════════════════════════════════════════════
🎯 TODAY'S PAIN POINT FOCUS: "${painPoint.title}"
═══════════════════════════════════════════════════════════════════════════════

THE STRUGGLE (what teachers experience):
${painPoint.struggle}

OUR SOLUTION (how Accelerating Success helps):
${painPoint.solution}

HOOK IDEAS FOR THIS PAIN POINT (use as inspiration, create your own):
${painPoint.hookIdeas.map((h, i) => `${i + 1}. "${h}"`).join('\n')}

⚠️ CRITICAL: Your content MUST focus on THIS specific pain point. Do NOT write generic content that just swaps out grade levels. The post should make a teacher think: "Yes! I have THAT exact problem. These people understand me."

` : '';

  // TEKS reference section for accuracy
  const teksSection = teksRef ? `
TEKS STANDARD REFERENCE: ${teksRef}
Include this reference in your content for credibility with Texas educators.
` : '';

  // Build the recent posts section to avoid repetition
  const recentPostsSection = recentTitles && recentTitles.length > 0
    ? `
RECENT POSTS (DO NOT REPEAT THESE - create something COMPLETELY DIFFERENT):
Previous titles used:
${recentTitles.map((t, i) => `${i + 1}. "${t}"`).join('\n')}

Previous hooks used:
${recentHooks?.map((h, i) => `${i + 1}. "${h}"`).join('\n') || 'None'}

YOU MUST CREATE A COMPLETELY DIFFERENT TITLE AND HOOK FROM ALL OF THE ABOVE!
`
    : '';

  return `You are a marketing expert for Accelerating Success (@AccSuccess), an educational platform offering bilingual (English/Spanish) Science resources for grades 3-8.

═══════════════════════════════════════════════════════════════════════════════
⚠️ CRITICAL REQUIREMENTS - READ CAREFULLY
═══════════════════════════════════════════════════════════════════════════════

1. TEKS/GRADE ALIGNMENT IS SACRED
   - You are writing about: "${concept}" for ${gradeLevel} grade teachers
   - This topic is ONLY taught at this grade level per Texas TEKS standards
   - NEVER suggest this topic is taught at a different grade level
   - If the topic is "DNA & heredity" for 8th grade, do NOT say "4th grade teachers teaching DNA"
   ${teksSection}

2. MEANINGFUL, SPECIFIC CONTENT (NOT GENERIC)
   - Write content that makes teachers think "Yes! That's MY exact problem!"
   - Include specific, concrete examples of classroom scenarios
   - Reference real challenges like STAAR testing pressure, admin expectations
   - DON'T just swap out grade levels to create "variety"

3. LONGER, RICHER POSTS
   - LinkedIn: 1,500-2,000 characters (substantial, story-driven)
   - Facebook: 1,200-1,500 characters (conversational, shareable)
   - Reddit: 800-1,200 characters (authentic, community-focused)
   - Include specific anecdotes, examples, and details

${recentPostsSection}
${painPointSection}

TOPIC: ${topic} - ${concept}
GRADE LEVEL: ${gradeLevel} (THIS IS TEKS-VERIFIED - do not change it!)
CONTENT ANGLE: ${contentAngle}
TESTIMONIAL VIDEO: ${testimonialUrl} (${testimonialTitle})

═══════════════════════════════════════════════════════════════════════════════
📊 CONTENT ANGLE-SPECIFIC INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

${contentAngle === 'STAAR_PREP' ? `
🎯 STAAR_PREP ANGLE - AGGRESSIVE TESTING FOCUS
This is your most important messaging angle. Go ALL IN on STAAR/TEKS:

REQUIRED ELEMENTS:
1. LEAD with STAAR in the first sentence - "STAAR is coming..." or "With STAAR just X weeks away..."
2. Mention specific TEKS standards being covered (e.g., "TEKS §112.26(b)(6)")
3. Include countdown urgency - "Only X weeks until STAAR testing"
4. Reference released STAAR questions or common STAAR problem areas
5. Highlight STAAR readiness data/scores improvement
6. Address admin pressure around STAAR data
7. Use STAAR-focused hashtags: #STAAR #STAARprep #STAARready #STAARscience

STAAR_PREP HOOK EXAMPLES:
- "STAAR is in 10 weeks. Are your students ready for the Force & Motion questions?"
- "My principal wants STAAR readiness data every Friday. Here's what saved me."
- "The TEKS standard that shows up on STAAR every single year? I finally cracked it."
- "47 TEKS standards. 12 weeks. One stressed teacher. Sound familiar?"

STAAR_PREP MESSAGING TONE:
- Urgent but not panicky
- Solution-focused (we have the answer)
- Data-driven (mention score improvements)
- Empathetic to teacher stress
` : contentAngle === 'BILINGUAL' ? `
🌎 BILINGUAL ANGLE - ELL/DUAL LANGUAGE FOCUS
Emphasize bilingual STAAR prep for ELL students:

REQUIRED ELEMENTS:
1. Address ELL students taking STAAR in English
2. Highlight that EVERY resource is in English AND Spanish
3. Mention dual language classrooms and teachers
4. Reference the challenge of TEKS concepts in two languages
5. Use bilingual hashtags: #BilingualEducation #ELLteachers #DualLanguage

BILINGUAL HOOK EXAMPLES:
- "Half my class are ELL students taking STAAR in English. Here's what finally worked."
- "Teaching TEKS in two languages is HARD. Unless you have the right resources."
- "My dual language students crushed their STAAR practice tests. Here's how."
` : contentAngle === 'TIME_SAVER' ? `
⏰ TIME_SAVER ANGLE - PREP TIME REDUCTION FOCUS
Emphasize how teachers save hours while staying TEKS-aligned:

REQUIRED ELEMENTS:
1. Quantify time savings ("Save 5+ hours of prep per week")
2. Mention ready-to-teach, TEKS-aligned modules
3. Address Sunday night/weeknight prep stress
4. Highlight that resources are already STAAR-ready
5. Use time-focused language: "no prep needed", "ready to go"

TIME_SAVER HOOK EXAMPLES:
- "I used to spend 3 hours every Sunday on TEKS-aligned lesson plans. Now? 15 minutes."
- "What if STAAR prep came ready-to-teach?"
- "Stop creating TEKS resources from scratch. Here's a better way."
` : contentAngle === 'ENGAGEMENT' ? `
🎮 ENGAGEMENT ANGLE - STUDENT ENGAGEMENT FOCUS
Emphasize game-based learning that makes TEKS concepts stick:

REQUIRED ELEMENTS:
1. Highlight game-based, interactive learning
2. Mention student engagement and participation
3. Address boring drill-and-kill STAAR prep alternatives
4. Reference student reactions and excitement
5. Use engagement language: "students beg for more", "finally engaged"

ENGAGEMENT HOOK EXAMPLES:
- "STAAR prep doesn't have to feel like STAAR prep. My students actually ASK for science now."
- "The game-based TEKS modules that made my class forget they were doing test prep."
- "From groans to cheers: how I transformed STAAR review in my classroom."
` : contentAngle === 'PAIN_POINTS' ? `
🎯 PAIN_POINTS ANGLE - TEACHER STRUGGLE FOCUS
Address the real daily challenges teachers face. Pick 2-3 pain points to weave into your content:

REQUIRED: Reference specific pain points and how Accelerating Success solves them (see TEACHER PAIN POINTS section below)
` : `
📝 ${contentAngle} ANGLE
Focus on this specific messaging while maintaining TEKS/STAAR alignment throughout.
`}

═══════════════════════════════════════════════════════════════════════════════
🎯 TOP 10 TEACHER PAIN POINTS & HOW ACCELERATING SUCCESS SOLVES THEM
═══════════════════════════════════════════════════════════════════════════════

USE THESE PAIN POINTS IN YOUR CONTENT! Pick 2-3 that relate to the topic/concept and weave them naturally into your posts.

📌 PAIN POINT 1: NOT ENOUGH TIME TO PLAN LESSONS
THE STRUGGLE: Teachers spend hours searching, prepping, and modifying materials.
HOW WE SOLVE IT:
- Ready-to-use TEKS-aligned modules
- Interactive games, vocabulary energizers, and visuals that require ZERO prep
- Printable and digital options that save teachers hours each week
HOOK IDEAS: "I used to spend 3 hours every Sunday..." / "What if your lessons came ready to teach?"

📌 PAIN POINT 2: PRESSURE TO IMPROVE STAAR 2.0 SCORES
THE STRUGGLE: Teachers face intense accountability but lack engaging, aligned resources.
HOW WE SOLVE IT:
- 100% TEKS-aligned content grades 3–Biology
- STAAR 2.0 question formats (multi-select, drag & drop, evidence-based responses)
- High-engagement practice that leads to real gains in mastery
HOOK IDEAS: "My admin wants STAAR data every Friday..." / "STAAR 2.0 formats used to terrify my students..."

📌 PAIN POINT 3: STUDENTS STRUGGLE WITH ENGAGEMENT
THE STRUGGLE: Keeping students focused—especially in science—is a daily challenge.
HOW WE SOLVE IT:
- Arcade-style games students BEG to play
- Immediate feedback loops
- Built-in competition, badges, and game mechanics that motivate learners
- Engagement skyrockets = behavior challenges drop
HOOK IDEAS: "From groans to 'Can we play again?'" / "The day my students ASKED for science practice..."

📌 PAIN POINT 4: DIFFICULTY DIFFERENTIATING INSTRUCTION
THE STRUGGLE: Teachers must support students at multiple reading and skill levels.
HOW WE SOLVE IT:
- Bilingual English/Spanish toggles
- Adjustable difficulty levels
- Multiple ways for students to access content (games, visuals, vocabulary, modules)
- Teachers can finally meet students where they are without creating 6 versions of a lesson
HOOK IDEAS: "Half my class reads below grade level..." / "ELL students AND advanced learners in one room..."

📌 PAIN POINT 5: TOO MANY DISCONNECTED OR LOW-QUALITY MATERIALS
THE STRUGGLE: Teachers often rely on Pinterest, TPT, or old worksheets that don't align well to TEKS or STAAR 2.0.
HOW WE SOLVE IT:
- A fully coherent supplemental ecosystem
- Vocabulary → visuals → games → modules all aligned
- No more piecing together random resources
- Everything consistent, cleanly designed, and TEKS-specific
HOOK IDEAS: "I was drowning in random TPT downloads..." / "When nothing you find actually matches the TEKS..."

📌 PAIN POINT 6: STUDENTS FORGET VOCABULARY QUICKLY
THE STRUGGLE: Academic language is often the biggest barrier for students in science.
HOW WE SOLVE IT:
- Vocabulary Energizers, flashcards, eBooks, and arcade-style games
- Built-in repetition & retrieval practice
- Bilingual supports that improve access
- Students retain words long-term because they practice them in multiple contexts
HOOK IDEAS: "My students couldn't remember 'photosynthesis' to save their lives..." / "Academic vocabulary was killing my STAAR scores..."

📌 PAIN POINT 7: TEACHER BURNOUT & COGNITIVE OVERLOAD
THE STRUGGLE: Teachers feel overwhelmed by new TEKS, new testing formats, and constant initiative fatigue.
HOW WE SOLVE IT:
- Simple, intuitive tools designed for Texas teachers
- No learning curve—teachers click and go
- Huge value for teachers who need resources that work without adding stress
HOOK IDEAS: "I was one more initiative away from quitting..." / "When simple actually means simple..."

📌 PAIN POINT 8: HARD TO MANAGE INDEPENDENT PRACTICE
THE STRUGGLE: Teachers need students meaningfully engaged so they can run small groups.
HOW WE SOLVE IT:
- Self-running games that keep students engaged AND quiet
- Instant feedback students can understand independently
- Perfect for stations, RTI groups, tutoring rotations, and sub days
- Teachers finally get time back to work with the kids who need them most
HOOK IDEAS: "I can finally pull small groups without chaos..." / "The sub folder that actually works..."

📌 PAIN POINT 9: CURRICULUM DOESN'T MATCH THE NEEDS OF THEIR STUDENTS
THE STRUGGLE: Teachers often feel their core HQIM or district materials aren't enough on their own.
HOW WE SOLVE IT:
- A flexible supplemental resource that fits with ANY curriculum
- Easy add-ins that strengthen core lessons or fill conceptual gaps
- Perfect for reteach, enrichment, and acceleration
- Gives teachers the freedom to adjust instruction without creating more work
HOOK IDEAS: "The textbook doesn't cover it the way STAAR tests it..." / "When your curriculum needs backup..."

📌 PAIN POINT 10: STUDENTS NEED MORE PRACTICE IN STAAR 2.0 FORMAT
THE STRUGGLE: Even when content is understood, students struggle with the new item types.
HOW WE SOLVE IT:
- Games incorporate STAAR 2.0-style interactions:
  • Drag & drop
  • Multi-select
  • Hot spots
  • Matching
- Students get comfortable with the FORMAT, not just the content
- Teachers get better performance because students aren't surprised on test day
HOOK IDEAS: "My students knew the content but bombed the STAAR format..." / "Drag & drop used to confuse them. Not anymore."

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

KEY FEATURES (mapped to Teacher Pain Points):
- ✅ TEKS Chapter 112 aligned (2024-2025 implementation) → Solves Pain Points #2, #5, #9
- ✅ STAAR 2.0 ready (drag & drop, multi-select, hot spots) → Solves Pain Points #2, #10
- ✅ Bilingual English/Spanish toggle → Solves Pain Point #4
- ✅ Arcade-style games students BEG to play → Solves Pain Points #3, #6, #8
- ✅ Zero-prep, ready-to-teach modules → Solves Pain Points #1, #7
- ✅ Vocabulary Energizers with retrieval practice → Solves Pain Point #6
- ✅ Interactive E-Books and "10 Minute Science" lessons → Solves Pain Points #3, #8
- ✅ Self-running for independent practice/stations → Solves Pain Point #8
- ✅ Adjustable difficulty levels → Solves Pain Point #4
- ✅ Coherent ecosystem (vocabulary → visuals → games → modules) → Solves Pain Point #5
- ✅ Simple, intuitive - click and go → Solves Pain Point #7
- ✅ Flexible supplemental (works with ANY curriculum) → Solves Pain Point #9
- ✅ Immediate feedback loops → Solves Pain Points #3, #8
- ✅ Competition, badges, game mechanics → Solves Pain Point #3
- Built by experienced Texas educators who understand TEKS requirements
- Subscription link: https://accelerating-success.com/subscriptions/
- Free resources: https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/
- Offer: 7-day free trial, no strings attached

═══════════════════════════════════════════════════════════════════════════════
🎯 STAAR SCIENCE TESTING - Critical Context for Texas Teachers
═══════════════════════════════════════════════════════════════════════════════

STAAR SCIENCE TESTING GRADES:
- Grade 5 Science STAAR (elementary milestone - high stakes!)
- Grade 8 Science STAAR (middle school milestone - high stakes!)
- Biology End-of-Course (EOC) STAAR (high school graduation requirement)

STAAR TESTING TIMELINE (2024-2025):
- December-February: Intensive STAAR prep season begins
- March-April: Peak anxiety - teachers scrambling to cover remaining TEKS
- April-May: STAAR testing window
- May-June: Results anxiety and reflection

TEACHER PAIN POINTS AROUND STAAR:
- "I have 47 TEKS standards to cover and only 3 months until STAAR!"
- "My admin is tracking STAAR readiness data weekly"
- "Half my students are ELL and need bilingual STAAR prep"
- "The new TEKS are harder and STAAR questions reflect that"
- "I need resources that are ACTUALLY aligned to the 2024 TEKS, not the old standards"
- "My students bomb the released STAAR questions on [concept]"
- "How do I make STAAR prep engaging instead of drill-and-kill?"

STAAR SUCCESS MESSAGING:
- "Finally - STAAR prep that doesn't feel like STAAR prep"
- "Cover more TEKS in less time with game-based learning"
- "Our resources are built FROM the TEKS standards, not retrofitted"
- "Bilingual STAAR prep: English AND Spanish for every concept"
- "Teachers report students scoring 15-20% higher on STAAR practice tests"
- "Every module maps directly to specific TEKS standards tested on STAAR"

IMPORTANT MESSAGING POINTS:
- Always mention "TEKS-aligned" or "aligned to TEKS Chapter 112" in posts
- Reference the 2024-2025 school year implementation when relevant
- Emphasize that content meets Texas state science curriculum requirements
- Highlight that resources support the 40% hands-on investigation requirement
- LEAD with STAAR and TEKS in headlines and hooks - Texas teachers search for these terms
- Mention specific TEKS standards when discussing concepts (e.g., "TEKS §112.26 for 6th grade")
- Create urgency around STAAR testing timeline
- Address bilingual/ELL STAAR challenges - huge pain point in Texas

REQUIREMENTS:
1. Create a relatable teacher pain point or engaging question for the content idea
2. Generate 7 EXTENDED posts (LinkedIn, Reddit, Facebook, Twitter/X, Blogger, Tumblr, Pinterest)
3. Include CONCRETE EXAMPLES showing how teachers actually use the platform
4. Add testimonial video naturally in the posts
5. End with CTAs:
   - PRIMARY: Start 7-day free trial → subscription link
   - SECONDARY (NOT for LinkedIn): Not ready? Join email list for free resources → email signup link
6. Platform-specific tone and formatting:
   - LinkedIn: See LINKEDIN OPTIMIZATION section below for detailed guidelines
   - Reddit: Authentic, conversational, use [text](url) for markdown links, ask for community input, 3-4 paragraphs
   - Facebook: Friendly, shareable, visual, tag-a-friend style, use [text](url) for links, 3-4 paragraphs
   - Twitter/X: Concise (under 280 chars), punchy, use "text → url" format

═══════════════════════════════════════════════════════════════════════════════
💼 LINKEDIN OPTIMIZATION - HIGH PERFORMANCE GUIDELINES
═══════════════════════════════════════════════════════════════════════════════

LinkedIn is performing well - here's how to make it even better:

LINKEDIN STRUCTURE (optimized for engagement):
1. HOOK (First 2 lines - visible before "see more")
   - Lead with STAAR/TEKS pain point or success metric
   - Use numbers when possible: "47 TEKS standards", "85% passing rate"
   - Create curiosity gap - make them want to click "see more"
   - Example: "🚨 STAAR is 10 weeks away. My 6th graders were failing every Force & Motion question. Then I found this..."

2. STORY/CONTEXT (2-3 paragraphs)
   - Share a specific teacher struggle with TEKS/STAAR
   - Use "I" statements or quote a teacher directly
   - Include specific grade level, subject, and TEKS standard
   - Build empathy: admin pressure, time constraints, ELL challenges

3. SOLUTION (1-2 paragraphs)
   - Introduce Accelerating Success as the answer
   - Highlight 2-3 specific benefits (TEKS-aligned, bilingual, game-based)
   - Include the testimonial video with context
   - Quantify results if possible (score improvements, time saved)

4. SOCIAL PROOF
   - Reference the testimonial video
   - Format: "Hear from [Teacher Name]: [video link]"
   - Or embed naturally: "Watch Maria's full story..."

5. CTA (Single, clear call-to-action)
   - ONE link only (subscription trial)
   - STAAR-focused language: "Get STAAR-ready" or "Start your TEKS-aligned trial"
   - No secondary CTA on LinkedIn (cleaner, higher conversion)

6. HASHTAGS (3-5 max)
   - Always include: #STAAR #TEKS #TexasTeachers
   - Add topic-specific: #Grade6Science #ForcesAndMotion
   - Place at END of post, not inline

LINKEDIN FORMATTING RULES:
- Use line breaks liberally (creates white space, easier to read)
- Use emojis sparingly (1-2 max) - professional tone
- Bold key phrases using *asterisks* for emphasis
- Keep paragraphs to 2-3 sentences max
- Total length: 1,500-2,000 characters (substantial, story-driven content)
- Use [text](url) format for links
- Include SPECIFIC classroom scenarios and examples - not generic platitudes

LINKEDIN ENGAGEMENT TRIGGERS:
- Ask a question at the end: "Any other Texas teachers feeling the STAAR pressure?"
- Invite comments: "Drop a 🎯 if you're prepping for STAAR right now"
- Tag relevant topics: "Texas educators" "STAAR prep" "bilingual teachers"

LINKEDIN DON'Ts:
- Don't use more than 5 hashtags (looks spammy)
- Don't include multiple CTAs (confuses the reader)
- Don't use excessive emojis (unprofessional)
- Don't be TOO SHORT - we want meaningful, substantial content (1,500+ chars is GOOD!)
- Don't forget the "see more" hook (first 2 lines are critical)
- Don't write generic content that just swaps grade levels - each post must be unique and meaningful

OTHER PLATFORMS:
- Blogger: Article-style blog post with HTML formatting, 5-7 paragraphs, educational tone, include <h2> headings, strong STAAR/TEKS focus
- Tumblr: Creative, casual, mix of text and personality, 3-4 paragraphs, use emojis, STAAR references welcome

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

PRIMARY CTA (Trial) - Emphasize STAAR/TEKS value:
- LinkedIn: [Start your STAAR prep trial](https://accelerating-success.com/subscriptions/) or [Get TEKS-aligned resources](https://accelerating-success.com/subscriptions/)
- Reddit: [Try TEKS-aligned resources free](https://accelerating-success.com/subscriptions/)
- Facebook: [Get your STAAR prep trial](https://accelerating-success.com/subscriptions/)
- Twitter: "STAAR prep trial → https://accelerating-success.com/subscriptions/"

SECONDARY CTA (Email List) - NOT for LinkedIn:
- Reddit: [Try free TEKS modules](https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/)
- Facebook: [Get free STAAR prep](https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/)
- Twitter: "Free TEKS modules → https://accelerating-success.com/free-5th-grade-properties-of-matter-online-modules/"

CTA MESSAGING VARIATIONS (rotate these):
- "Get STAAR-ready with a free 7-day trial"
- "Cover more TEKS before testing - try it free"
- "TEKS-aligned, STAAR-ready - start your free trial"
- "Don't scramble before STAAR - get prepared now"
- "Bilingual STAAR prep: 7 days free, no strings"

Keep link text SHORT and actionable!

CRITICAL - VARIETY REQUIREMENT:
⚠️ NEVER repeat the same hook or title from previous posts!
⚠️ Each day's content MUST feel completely fresh and different!

VARY YOUR HOOKS - Use a DIFFERENT one each time from categories like:
• STAAR PRESSURE: "47 TEKS standards. 3 months until STAAR. Here's my survival plan...", "My admin just asked for STAAR readiness data AGAIN...", "STAAR is in 8 weeks and I haven't covered [concept] yet..."
• TEKS COVERAGE: "How I finally covered all my TEKS standards before testing...", "The TEKS standard my students always bomb on STAAR...", "New 2024 TEKS got you stressed? Same."
• BILINGUAL STAAR: "Half my class are ELL students taking STAAR in English. Here's what helped...", "Bilingual STAAR prep that actually works..."
• STAAR SUCCESS STORIES: "My students went from 60% to 85% on STAAR practice tests...", "That moment when your class CRUSHES the released STAAR questions..."
• TEKS-SPECIFIC: "TEKS §112.26 on matter and energy was killing my class until...", "Finally cracked how to teach [TEKS standard] for STAAR..."
• TESTING TIMELINE: "12 weeks until STAAR. Here's my game plan...", "It's March and I'm panicking about STAAR. Any Texas teachers relate?"
• PAIN POINT #1 (TIME): "I used to spend 3 hours every Sunday searching for science materials...", "What if your TEKS lessons came ready to teach?", "My weekends are finally mine again..."
• PAIN POINT #3 (ENGAGEMENT): "From groans to 'Can we play again?'...", "The day my students ASKED for more science practice...", "My classroom went from chaos to engaged in one week..."
• PAIN POINT #4 (DIFFERENTIATION): "Half my class reads below grade level. Here's how I reach them all...", "ELL students AND advanced learners - same activity, different supports..."
• PAIN POINT #5 (RANDOM RESOURCES): "I was drowning in random TPT downloads that didn't even match my TEKS...", "From Pinterest chaos to actual TEKS coherence..."
• PAIN POINT #6 (VOCABULARY): "My students couldn't remember 'photosynthesis' to save their lives...", "Academic vocabulary was killing my STAAR scores. Not anymore..."
• PAIN POINT #7 (BURNOUT): "I was one more initiative away from quitting teaching...", "When 'simple' actually means simple...", "Finally, resources that don't require a PhD to set up..."
• PAIN POINT #8 (INDEPENDENT PRACTICE): "I can finally pull small groups without classroom chaos...", "The sub folder that actually works...", "Station rotations that run themselves..."
• PAIN POINT #10 (STAAR 2.0 FORMAT): "My students knew the content but bombed the STAAR format...", "Drag & drop questions used to confuse them. Not anymore..."

DO NOT USE "Sunday Prep Struggle" or variations of it! Create completely NEW hooks focused on STAAR/TEKS and the specific concept being taught.

EXAMPLE HOOKS FOR DIFFERENT TOPICS (COMBINED: Pain Point + TEKS/STAAR - use as inspiration, NOT to copy):

🔥 COMBINING PAIN POINTS WITH TEKS/STAAR IS KEY! Every hook should address BOTH a teacher struggle AND testing alignment.

• Newton's Laws + TIME SAVING: "I used to spend 4 hours prepping my Force & Motion TEKS unit. Now I click and teach STAAR-ready content in minutes 🎯"
• Water Cycle + ENGAGEMENT: "My students used to groan at Earth's water cycle. Now they BEG to play the TEKS §112.26 review games before STAAR."
• Photosynthesis + VOCABULARY: "Academic vocabulary was killing my STAAR scores on photosynthesis. Then I found Vocabulary Energizers..."
• Cells + DIFFERENTIATION: "Half my class are ELL students taking STAAR in English. Cell organelles in BOTH languages? Game changer. 🌎"
• Ecosystems + STAAR 2.0 FORMAT: "47 TEKS standards. Ecosystems alone has 6. My students knew the content but bombed the drag & drop questions. Not anymore."
• Matter & Energy + INDEPENDENT PRACTICE: "Grade 6 Matter & Energy STAAR prep that runs itself while I pull small groups? Yes, please."
• Force & Motion + BURNOUT: "I was drowning in random TPT worksheets for balanced vs unbalanced forces. Finally found TEKS-aligned resources that actually work."
• Rock Cycle + COHERENCE: "My STAAR review materials were a mess - some from Pinterest, some from TPT, none actually aligned. Now? One coherent TEKS ecosystem."
• Plate Tectonics + STAAR PRESSURE: "My admin wants STAAR readiness data every Friday. These TEKS §112.27 resources made that possible without losing my weekends."
• Energy Transfer + ENGAGEMENT: "From 'Do we HAVE to do science?' to 'Can we play the energy transfer game again?' in one week. STAAR prep that doesn't feel like STAAR prep."
---

BILINGUAL REQUIREMENT:
Generate content in BOTH English and Spanish. Accelerating Success is a bilingual platform, so provide Spanish translations of all posts.

HASHTAG STRATEGY (TEKS/STAAR focused):
Always include 2-3 of these high-value hashtags:
- #TEKS #TEKSaligned #TexasTEKS (curriculum alignment)
- #STAAR #STAARprep #STAARready #STAARscience (testing focus)
- #TexasTeachers #TxEd #TexasEducation (geographic targeting)
- #BilingualEducation #ELLteachers #DualLanguage (bilingual angle)
- #ScienceTeacher #MiddleSchoolScience #ElementaryScience (subject targeting)
- #Grade5Science #Grade8Science (grade-specific for STAAR grades)
- Plus topic-specific hashtags for the concept being taught

LinkedIn-specific: Use 3-5 hashtags max, professional tone
Twitter: Use 2-3 hashtags, space is limited
Facebook/Tumblr: Use 4-6 hashtags freely
Reddit: No hashtags (not the culture)
Blogger: Use as meta tags/categories

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "ideaTitle": "A UNIQUE creative title based on the topic - NEVER use Sunday Prep Struggle",
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
