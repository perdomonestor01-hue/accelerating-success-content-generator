/**
 * Create Admin User Script for Production
 *
 * This script creates an admin user in your production database.
 *
 * Usage:
 *   1. Get your DATABASE_URL from Railway dashboard
 *   2. Run: DATABASE_URL="your-url" node create-admin-user.js
 *
 * Or use Railway CLI:
 *   railway run node create-admin-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creating admin user for Accelerating Success...\n');

  // Admin user configuration
  const adminEmail = 'perdomonestor01@gmail.com';
  const adminName = 'Nestor Perdomo';
  const adminPassword = 'AcceleratingSuccess2025!'; // Change this to your preferred password
  const adminRole = 'ADMIN';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingUser) {
      console.log('⚠️  User already exists with email:', adminEmail);
      console.log('   User ID:', existingUser.id);
      console.log('   Role:', existingUser.role);
      console.log('\n✅ No action needed - admin user already exists!\n');
      return;
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    // Create the admin user
    console.log('👤 Creating admin user...');
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: adminRole,
      },
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('🆔 User ID:', user.id);
    console.log('\n🔐 Login Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n⚠️  IMPORTANT: Change your password after first login!\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✅ Database connection closed\n');
  });
