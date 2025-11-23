import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'SUPER_MERCHANT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch settlements for this super merchant
    const settlements = await prisma.settlement.findMany({
      where: {
        superMerchantId: payload.superMerchantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ settlements });
  } catch (error) {
    console.error('Failed to fetch settlements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
