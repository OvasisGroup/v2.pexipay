import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { hashPassword } from '../lib/auth/password';

// Create a fresh Prisma client for seeding using pg adapter
// Parse DATABASE_URL manually to avoid parsing issues
const pool = new Pool({
  host: 'db.prisma.io',
  port: 5432,
  user: '005d853fb88afb8fe1f97c53ce57ef482393edfc575385138caa5630869fcefe',
  password: 'sk_bxVLyPGwnaUrrXYOCmfGu',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error'] });

async function main() {
  console.log('🌱 Starting seed...');

  // Create super admin user
  const hashedPassword = await hashPassword('SuperAdmin123!');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pexipay.com' },
    update: {},
    create: {
      email: 'admin@pexipay.com',
      passwordHash: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Super admin created:');
  console.log('   Email: admin@pexipay.com');
  console.log('   Password: SuperAdmin123!');
  console.log('   User ID:', admin.id);

  // Create a test super-merchant
  const superMerchant = await prisma.superMerchant.upsert({
    where: { email: 'supermerchant@test.com' },
    update: {},
    create: {
      name: 'Super Merchant Corp',
      email: 'supermerchant@test.com',
      businessName: 'Test Super Merchant',
      businessType: 'Corporation',
      country: 'US',
      taxId: 'TAX-SM-001',
      commissionRate: 2.5,
      status: 'ACTIVE',
      users: {
        create: {
          email: 'supermerchant@test.com',
          passwordHash: await hashPassword('SuperMerchant123!'),
          name: 'Super Merchant User',
          role: 'SUPER_MERCHANT',
          status: 'ACTIVE',
        },
      },
    },
    include: {
      users: true,
    },
  });

  console.log('\n✅ Test super-merchant created:');
  console.log('   Email: supermerchant@test.com');
  console.log('   Password: SuperMerchant123!');
  console.log('   Super Merchant ID:', superMerchant.id);

  // Create a test merchant under the super-merchant
  const merchant = await prisma.merchant.upsert({
    where: { email: 'merchant@test.com' },
    update: {},
    create: {
      name: 'Merchant LLC',
      email: 'merchant@test.com',
      businessName: 'Test Merchant',
      businessType: 'LLC',
      country: 'US',
      taxId: 'TAX-M-001',
      superMerchantId: superMerchant.id,
      transactionFee: 1.5,
      status: 'ACTIVE',
      users: {
        create: {
          email: 'merchant@test.com',
          passwordHash: await hashPassword('Merchant123!'),
          name: 'Merchant User',
          role: 'MERCHANT',
          status: 'ACTIVE',
        },
      },
    },
    include: {
      users: true,
    },
  });

  console.log('\n✅ Test merchant created:');
  console.log('   Email: merchant@test.com');
  console.log('   Password: Merchant123!');
  console.log('   Merchant ID:', merchant.id);

  console.log('\n🎉 Seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
