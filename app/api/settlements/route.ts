import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateApiKey } from '@/lib/auth/api-key';

/**
 * GET /api/settlements
 * List all settlements for the authenticated merchant
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate
    const authResult = await authenticateApiKey(request);
    if (!authResult.authenticated || !authResult.context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { merchantId, superMerchantId } = authResult.context;

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    
    // Filter by merchant or super merchant
    if (superMerchantId) {
      where.superMerchantId = superMerchantId;
    } else if (merchantId) {
      where.merchantId = merchantId;
    }

    // Filter by status if provided
    if (status) {
      where.status = status;
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
