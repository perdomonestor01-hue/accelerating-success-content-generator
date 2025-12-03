// Reddit Post Generator for r/AcceleratingSuccess
// Generates ready-to-copy posts for manual posting

require('dotenv').config();

const topics = [
  { topic: 'Life Science', concept: 'Plant Life Cycles', grade: '3rd-4th' },
  { topic: 'Earth Science', concept: 'Water Cycle', grade: '4th-5th' },
  { topic: 'Physical Science', concept: 'States of Matter', grade: '3rd-4th' },
  { topic: 'Life Science', concept: 'Food Chains & Ecosystems', grade: '5th-6th' },
  { topic: 'Earth Science', concept: 'Weather & Climate', grade: '4th-5th' },
  { topic: 'Physical Science', concept: 'Force & Motion', grade: '6th-7th' },
  { topic: 'Life Science', concept: 'Human Body Systems', grade: '6th-8th' },
  { topic: 'Earth Science', concept: 'Rock Cycle & Geology', grade: '5th-6th' },
  { topic: 'Physical Science', concept: 'Energy Transfer', grade: '7th-8th' },
  { topic: 'Life Science', concept: 'Cell Structure', grade: '6th-7th' },
];

const hooks = [
  "Fellow teachers, let's be real...",
  "Quick question for my science teachers out there:",
  "Anyone else feel this way?",
  "Here's something I wish I knew earlier:",
  "Teaching tip that changed my classroom:",
  "Sharing what's been working in my classroom:",
  "Real talk about science instruction:",
  "Something I learned the hard way:",
];

const testimonialVideos = [
  { url: 'https://youtube.com/shorts/FC_5CXTUl9o', title: 'Teacher Success Story' },
  { url: 'https://youtube.com/shorts/fcXj7ms7oqQ', title: 'Classroom Transformation' },
  { url: 'https://youtube.com/shorts/3wWcl8OHDXs', title: 'Real Teacher Review' },
];

function generateRedditPost() {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const testimonial = testimonialVideos[Math.floor(Math.random() * testimonialVideos.length)];

  const titles = [
    `Teaching ${topic.concept} to ${topic.grade} graders? Here's what worked for me`,
    `${topic.concept} lesson that actually got my students engaged`,
    `Bilingual ${topic.topic} resources that saved my prep time`,
    `How I stopped spending weekends on ${topic.concept} lesson plans`,
    `Game-based learning for ${topic.concept} - my classroom experience`,
    `STAAR prep for ${topic.concept} doesn't have to be boring`,
  ];

  const title = titles[Math.floor(Math.random() * titles.length)];

  const post = `${hook}

I used to spend HOURS prepping my ${topic.concept} unit for my ${topic.grade} graders. Worksheets, vocab cards, finding videos that actually work... you know the drill.

Then I found Accelerating Success, and honestly? Game changer.

**What I love about it:**
- 🎮 Game-based vocabulary that my kids actually BEG to play
- 🇺🇸🇲🇽 Every single lesson in English AND Spanish (huge for my bilingual learners)
- 📝 STAAR-aligned practice built right in
- ⏰ I prep in 10-15 minutes instead of hours

Here's a quick video from another teacher sharing their experience: ${testimonial.url}

The best part? They have a 7-day free trial so you can see if it works for your classroom: [Start your free trial](https://accelerating-success.com/subscriptions/)

Not ready to commit? [Join the email list](https://accelerating-success.com/subscribe) for free resources and teaching tips.

Would love to hear what's working in YOUR science classrooms! Drop a comment below 👇

---
*This community is for educators using Accelerating Success resources. Share your wins, ask questions, and connect with fellow teachers!*`;

  return { title, post, topic };
}

function generateMultiplePosts(count = 3) {
  console.log('\n' + '='.repeat(70));
  console.log('📋 REDDIT POSTS FOR r/AcceleratingSuccess');
  console.log('='.repeat(70));
  console.log('\nCopy and paste these directly into Reddit!\n');

  for (let i = 0; i < count; i++) {
    const { title, post, topic } = generateRedditPost();

    console.log('-'.repeat(70));
    console.log(`\n📝 POST ${i + 1}: ${topic.topic} - ${topic.concept}\n`);
    console.log('-'.repeat(70));
    console.log('\n🏷️  TITLE (copy this):\n');
    console.log(title);
    console.log('\n📄 BODY (copy this):\n');
    console.log(post);
    console.log('\n');
  }

  console.log('='.repeat(70));
  console.log('✅ Done! Copy any post above and paste into Reddit.');
  console.log('   Post to: https://www.reddit.com/r/AcceleratingSuccess/submit');
  console.log('='.repeat(70));
}

// Generate posts
const count = process.argv[2] ? parseInt(process.argv[2]) : 3;
generateMultiplePosts(count);
