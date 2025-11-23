import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settlements = await prisma.settlement.findMany({
      where: {
        superMerchantId: { not: null },
      },
      include: {
        SuperMerchant: {
          select: {
            id: true,
            name: true,
            businessName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ settlements });
  } catch (error) {
    console.error('Error fetching settlements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { superMerchantId, amount, currency, periodStart, periodEnd, transactionCount, feeTotal, netAmount } = body;

    if (!superMerchantId || !amount || !periodStart || !periodEnd || !netAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const settlement = await prisma.settlement.create({
      data: {
        id: `stl_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        superMerchantId,
        amount: Number(amount),
        currency: currency || 'USD',
        status: 'PENDING',
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        transactionCount: Number(transactionCount) || 0,
        feeTotal: Number(feeTotal) || 0,
        netAmount: Number(netAmount),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        SuperMerchant: {
          select: {
            id: true,
            name: true,
            businessName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Settlement created successfully', settlement }, { status: 201 });
  } catch (error) {
    console.error('Error creating settlement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
