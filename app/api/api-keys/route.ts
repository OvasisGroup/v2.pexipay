import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { generateApiKey } from '@/lib/auth/api-key';
import { auditLogger } from '@/lib/audit/logger';

export async function POST(request: NextRequest) {
  try {
    // Only merchants and super-merchants can generate API keys
    const authResult = await requireRole(request, ['MERCHANT', 'SUPER_MERCHANT', 'ADMIN']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const user = authResult.context.user!;
    
    const body = await request.json();
    const schema = z.object({
      name: z.string().min(3),
      environment: z.enum(['SANDBOX', 'PRODUCTION']),
      expiresInDays: z.number().optional(),
    });
    
    const data = schema.parse(body);

    // Generate API key with environment prefix
    const apiKeyData = generateApiKey(data.environment.toLowerCase() as 'sandbox' | 'production');

    // Calculate expiration
    const expiresAt = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    // Create API key record
    const apiKey = await prisma.apiKey.create({
      data: {
        name: data.name,
        keyHash: apiKeyData.keyHash,
        prefix: apiKeyData.prefix,
        environment: data.environment,
        merchantId: user.merchantId,
        superMerchantId: user.superMerchantId,
        expiresAt,
      },
    });

    // Log API key generation
    await auditLogger.logApiKeyGenerated(
      user.userId,
      apiKey.id,
      user.merchantId ? 'merchant' : 'super-merchant'
    );

    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKeyData.key, // Only returned once!
      prefix: apiKeyData.prefix,
      environment: apiKey.environment,
      expiresAt: apiKey.expiresAt,
      message: 'Save this API key securely. It will not be shown again.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('API key generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(request, ['MERCHANT', 'SUPER_MERCHANT', 'ADMIN']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const user = authResult.context.user!;

    // Build filter based on user role
    const whereClause: { merchantId?: string | null; superMerchantId?: string | null } = {};
    
    if (user.merchantId) {
      whereClause.merchantId = user.merchantId;
    } else if (user.superMerchantId) {
      whereClause.superMerchantId = user.superMerchantId;
    } else {
      // Admin can see all keys, or return empty if no association
      // For now, return empty array if no merchant/super-merchant association
      return NextResponse.json({ apiKeys: [] });
    }

    // Get all API keys for the user's merchant/super-merchant
    const apiKeys = await prisma.apiKey.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        prefix: true,
        status: true,
        environment: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
