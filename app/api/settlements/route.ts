import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware/auth';

/**
 * GET /api/settlements
 * List all settlements for the authenticated merchant
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }

    // Get merchant ID from auth context
    let merchantId: string | undefined;
    let superMerchantId: string | undefined;
    
    if (authResult.context.user) {
      merchantId = authResult.context.user.merchantId || undefined;
      superMerchantId = authResult.context.user.superMerchantId || undefined;
    } else if (authResult.context.apiKeyId) {
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: authResult.context.apiKeyId },
        select: { merchantId: true, Merchant: { select: { superMerchantId: true } } },
      });
      if (apiKey) {
        merchantId = apiKey.merchantId || undefined;
        superMerchantId = apiKey.Merchant?.superMerchantId || undefined;
      }
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const statusParam = searchParams.get('status');

    // Build where clause
    const where: {
      superMerchantId?: string;
      merchantId?: string;
      status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    } = {};
    
    // Filter by merchant or super merchant
    if (superMerchantId) {
      where.superMerchantId = superMerchantId;
    } else if (merchantId) {
      where.merchantId = merchantId;
    }

    // Filter by status if provided
    if (statusParam && ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].includes(statusParam)) {
      where.status = statusParam as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    }

    // Fetch settlements
    const [settlements, total] = await Promise.all([
      prisma.settlement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          Merchant: {
            select: {
              name: true,
              businessName: true,
            },
          },
          SuperMerchant: {
            select: {
              name: true,
              businessName: true,
            },
          },
        },
      }),
      prisma.settlement.count({ where }),
    ]);

    return NextResponse.json({
      settlements,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Failed to fetch settlements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settlements' },
      { status: 500 }
    );
  }
}
