import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

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

    // Verify the merchant belongs to this super merchant
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        superMerchantId: true,
        User: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    if (merchant.superMerchantId !== payload.superMerchantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch KYC documents for all users associated with this merchant
    const userIds = merchant.User.map((u) => u.id);

    const documents = await prisma.kYCDocument.findMany({
      where: {
        OR: [
          { merchantId: merchantId },
          { User: { id: { in: userIds } } },
        ],
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error fetching KYC documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
