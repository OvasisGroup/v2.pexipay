import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const accelerateUrl = process.env.PRISMA_DATABASE_URL;
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!accelerateUrl && !databaseUrl) {
    throw new Error('DATABASE_URL or PRISMA_DATABASE_URL environment variable is required');
  }
  
  // For Prisma 7 with Accelerate, use accelerateUrl option
  if (accelerateUrl) {
    return new PrismaClient({
      accelerateUrl,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  
  // Fallback to regular connection
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
