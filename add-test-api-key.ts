import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function addTestApiKey() {
  const apiKey = 'pxp_test_28180ecfa2705e19654c0afb219acbe410f93a48dad377ed850e35fa6ba00071';
  const keyHash = bcrypt.hashSync(apiKey, 10);
  const prefix = apiKey.substring(0, 8);

  console.log('Creating test API key...');
  console.log('API Key:', apiKey);
  console.log('Prefix:', prefix);
  console.log('Hash:', keyHash);

  // Find a merchant to associate with
  const merchant = await prisma.merchant.findFirst();
  
  if (!merchant) {
    console.error('❌ No merchant found in database. Please create a merchant first.');
    return;
  }

  console.log('Using merchant:', merchant.id, merchant.businessName);

  try {
    const newApiKey = await prisma.apiKey.create({
      data: {
        name: 'Test API Key',
        keyHash,
        prefix,
        merchantId: merchant.id,
        status: 'ACTIVE',
        environment: 'SANDBOX',
      },
    });

    console.log('\n✅ API Key created successfully!');
    console.log('ID:', newApiKey.id);
    console.log('Name:', newApiKey.name);
    console.log('Merchant ID:', newApiKey.merchantId);
    console.log('\nYou can now use this API key:');
    console.log('Authorization: Bearer', apiKey);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('\n⚠️  API key already exists in database');
    } else {
      console.error('\n❌ Error creating API key:', error);
    }
  }
  
  await prisma.$disconnect();
}

addTestApiKey();
