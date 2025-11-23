import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import { TransactionStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'SUPER_MERCHANT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: merchantId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Verify the merchant belongs to this super merchant
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        superMerchantId: true,
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    if (merchant.superMerchantId !== payload.superMerchantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch transactions for this merchant
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          merchantId: merchantId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where: {
          merchantId: merchantId,
        },
      }),
    ]);

    // Calculate stats
    const stats = await prisma.transaction.aggregate({
      where: {
        merchantId: merchantId,
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const successfulTransactions = await prisma.transaction.count({
      where: {
        merchantId: merchantId,
        status: {
          in: [TransactionStatus.CAPTURED, TransactionStatus.AUTHORIZED],
        },
      },
    });

    const totalRevenue = await prisma.transaction.aggregate({
      where: {
        merchantId: merchantId,
        status: {
          in: [TransactionStatus.CAPTURED, TransactionStatus.AUTHORIZED],
        },
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        totalTransactions: stats._count?.id ?? 0,
        successfulTransactions,
        totalRevenue: totalRevenue._sum?.amount ?? 0,
        successRate: (stats._count?.id ?? 0) > 0 ? (successfulTransactions / (stats._count?.id ?? 0)) * 100 : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching merchant transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
