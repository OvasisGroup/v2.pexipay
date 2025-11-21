import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all merchants with their user info
    const merchants = await prisma.merchant.findMany({
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to flatten user info
    const formattedMerchants = merchants.map((merchant: typeof merchants[0]) => ({
      id: merchant.id,
      businessName: merchant.businessName,
      businessType: merchant.businessType,
      country: merchant.country,
      status: merchant.status,
      transactionFee: merchant.transactionFee,
      superMerchantId: merchant.superMerchantId,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
      name: merchant.User[0]?.name || 'N/A',
      email: merchant.User[0]?.email || 'N/A',
    }));

    return NextResponse.json({
      merchants: formattedMerchants,
      total: formattedMerchants.length,
    });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
