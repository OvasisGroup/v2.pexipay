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

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Build query based on user role
    let whereClause = {};
    
    if (payload.role === 'MERCHANT') {
      // Fetch user to get merchantId
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { merchantId: true },
      });

      if (!user?.merchantId) {
        return NextResponse.json(
          { error: 'Merchant not found' },
          { status: 404 }
        );
      }

      whereClause = { merchantId: user.merchantId };
    } else if (payload.role === 'SUPER_MERCHANT') {
      // Fetch user to get superMerchantId
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { superMerchantId: true },
      });

      if (!user?.superMerchantId) {
        return NextResponse.json(
          { error: 'Super-merchant not found' },
          { status: 404 }
        );
      }

      // Get all merchants under this super-merchant
      const merchants = await prisma.merchant.findMany({
        where: { superMerchantId: user.superMerchantId },
        select: { id: true },
      });

      const merchantIds = merchants.map((m: { id: string }) => m.id);
      whereClause = { merchantId: { in: merchantIds } };
    }
    // For ADMIN, no where clause (fetch all transactions)

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get total count
    const total = await prisma.transaction.count({
      where: whereClause,
    });

    // Fetch transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      transactions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
