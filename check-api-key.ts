import { prisma } from './lib/prisma';
import crypto from 'crypto';

async function checkApiKey() {
  const apiKey = 'pxp_test_28180ecfa2705e19654c0afb219acbe410f93a48dad377ed850e35fa6ba00071';
  
  // Hash the API key
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  console.log('API Key:', apiKey);
  console.log('Key Hash:', keyHash);
  console.log('Prefix:', apiKey.split('_')[0] + '_' + apiKey.split('_')[1]);
  console.log('\nSearching in database...\n');
  
  // Try to find by hash
  const apiKeyRecord = await prisma.apiKey.findUnique({
    where: { keyHash },
    include: {
      SuperMerchant: true,
      Merchant: true,
    },
  });
  
  if (apiKeyRecord) {
    console.log('✅ API Key found!');
    console.log(JSON.stringify(apiKeyRecord, null, 2));
  } else {
    console.log('❌ API Key not found in database');
    
    // List all API keys
    const allKeys = await prisma.apiKey.findMany({
      select: {
        prefix: true,
        name: true,
        status: true,
        environment: true,
        createdAt: true,
      },
    });
    
    console.log('\nAll API Keys in database:');
    console.log(JSON.stringify(allKeys, null, 2));
  }
  
  await prisma.$disconnect();
}

checkApiKey().catch(console.error);
