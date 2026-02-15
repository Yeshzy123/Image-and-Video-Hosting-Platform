const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // First, delete any existing admin user
    await prisma.user.deleteMany({
      where: { email: 'yesh@gmail.com' }
    }).catch(() => {}); // Ignore if not found

    // Hash the password
    const hashedPassword = await bcrypt.hash('BrahBrah12!', 12);
    
    // Create admin user with the specific ID from the session
    const admin = await prisma.user.create({
      data: {
        id: 'cmlntzcqo000014pk3qeb1vok', // Use the exact ID from the session
        name: 'Admin',
        email: 'yesh@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
        storageLimit: BigInt(26843545600), // 25GB for admin
      },
    });

    // Create subscription for admin
    await prisma.subscription.create({
      data: {
        userId: admin.id,
        status: 'ACTIVE',
        plan: 'PREMIUM',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: yesh@gmail.com');
    console.log('Password: BrahBrah12!');
    console.log('Role: ADMIN');
    console.log('ID:', admin.id);
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ User already exists. Deleting and recreating...');
      
      // Delete existing user and subscription
      await prisma.subscription.deleteMany({
        where: { user: { email: 'yesh@gmail.com' } }
      });
      
      await prisma.user.delete({
        where: { email: 'yesh@gmail.com' }
      });
      
      // Try again
      await createAdmin();
    } else {
      console.error('❌ Error creating admin:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
