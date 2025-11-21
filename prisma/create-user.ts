import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
  const email = 'info@accelerating-success.com';
  const password = 'Success2025!!';
  const name = 'Accelerating Success Admin';

  console.log('🔐 Creating user account...');

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create or update the user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name,
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });

    console.log('✅ User created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user.id}`);
    console.log('\n🎉 You can now login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
