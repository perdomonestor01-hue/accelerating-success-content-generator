import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed testimonial videos
  const testimonials = await Promise.all([
    prisma.testimonial.upsert({
      where: { id: 'testimonial-1' },
      update: {},
      create: {
        id: 'testimonial-1',
        title: "I'm a teacher, and I love Accelerating Success!",
        youtubeUrl: 'https://youtube.com/shorts/FC_5CXTUl9o?si=QV-bYUf9TAuACg-j',
        duration: '56s',
        theme: 'GENERAL',
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-2' },
      update: {},
      create: {
        id: 'testimonial-2',
        title: 'Why teachers love Acc',
        youtubeUrl: 'https://youtube.com/shorts/fcXj7ms7oqQ?si=RzMZDMs2x5ZykB4y',
        duration: '41s',
        theme: 'TEACHER_LOVE',
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-3' },
      update: {},
      create: {
        id: 'testimonial-3',
        title: 'Low Prep, High Engagement Teaching Made Easy!',
        youtubeUrl: 'https://youtube.com/shorts/3wWcl8OHDXs?si=QpmmQTqC3g77AlYH',
        duration: '39s',
        theme: 'LOW_PREP',
      },
    }),
    // New student testimonials showing improvement
    prisma.testimonial.upsert({
      where: { id: 'testimonial-4' },
      update: {},
      create: {
        id: 'testimonial-4',
        title: 'Student improvement testimonial',
        youtubeUrl: 'https://www.youtube.com/watch?v=lhT6sSU-pdE&t=1s',
        duration: '1m',
        theme: 'ENGAGEMENT',
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-5' },
      update: {},
      create: {
        id: 'testimonial-5',
        title: 'Kids detecting improvement in their level',
        youtubeUrl: 'https://www.youtube.com/watch?v=EiCvdwoJjks',
        duration: '45s',
        theme: 'ENGAGEMENT',
      },
    }),
    prisma.testimonial.upsert({
      where: { id: 'testimonial-6' },
      update: {},
      create: {
        id: 'testimonial-6',
        title: 'Student success story',
        youtubeUrl: 'https://www.youtube.com/watch?v=6leGU2LynA4',
        duration: '50s',
        theme: 'ENGAGEMENT',
      },
    }),
  ]);

  console.log(`✅ Created ${testimonials.length} testimonial videos`);

  // Seed default schedule configuration (optional daily rotation)
  const scheduleConfigs = await Promise.all([
    prisma.scheduleConfig.upsert({
      where: { dayOfWeek: 1 }, // Monday
      update: {},
      create: {
        dayOfWeek: 1,
        topicPreference: 'SCIENCE',
        contentAnglePreference: 'TIME_SAVER',
        enabled: true,
      },
    }),
    prisma.scheduleConfig.upsert({
      where: { dayOfWeek: 2 }, // Tuesday
      update: {},
      create: {
        dayOfWeek: 2,
        topicPreference: 'BIOLOGY',
        contentAnglePreference: 'BILINGUAL',
        enabled: true,
      },
    }),
    prisma.scheduleConfig.upsert({
      where: { dayOfWeek: 3 }, // Wednesday
      update: {},
      create: {
        dayOfWeek: 3,
        topicPreference: 'SCIENCE',
        contentAnglePreference: 'ENGAGEMENT',
        enabled: true,
      },
    }),
    prisma.scheduleConfig.upsert({
      where: { dayOfWeek: 4 }, // Thursday
      update: {},
      create: {
        dayOfWeek: 4,
        topicPreference: 'BIOLOGY',
        contentAnglePreference: 'TIME_SAVER',
        enabled: true,
      },
    }),
    prisma.scheduleConfig.upsert({
      where: { dayOfWeek: 5 }, // Friday
      update: {},
      create: {
        dayOfWeek: 5,
        topicPreference: 'SCIENCE',
        contentAnglePreference: 'STAAR_PREP',
        enabled: true,
      },
    }),
  ]);

  console.log(`✅ Created ${scheduleConfigs.length} schedule configurations`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
