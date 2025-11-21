import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL || '';
  
  // Check if using Prisma Data Proxy or Accelerate
  if (databaseUrl.includes('db.prisma.io') || databaseUrl.includes('accelerate.prisma') || databaseUrl.startsWith('prisma://')) {
    // For Prisma managed databases, use explicit connection config
    const pool = globalForPrisma.pool ?? new Pool({
      host: 'db.prisma.io',
      port: 5432,
      user: '005d853fb88afb8fe1f97c53ce57ef482393edfc575385138caa5630869fcefe',
      password: 'sk_bxVLyPGwnaUrrXYOCmfGu',
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
    });
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.pool = pool;
    }
    
    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  
  // For regular PostgreSQL connections, use adapter
  const pool = globalForPrisma.pool ?? new Pool({
    connectionString: databaseUrl,
  });
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
  }
  
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
