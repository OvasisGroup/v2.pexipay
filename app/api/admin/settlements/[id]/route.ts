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
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const settlement = await prisma.settlement.findUnique({
      where: { id },
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

    if (!settlement) {
      return NextResponse.json({ error: 'Settlement not found' }, { status: 404 });
    }

    return NextResponse.json({ settlement });
  } catch (error) {
    console.error('Error fetching settlement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { status } = body;

    const { id } = await params;

    const settlement = await prisma.settlement.findUnique({
      where: { id },
    });

    if (!settlement) {
      return NextResponse.json({ error: 'Settlement not found' }, { status: 404 });
    }

    const updatedSettlement = await prisma.settlement.update({
      where: { id },
      data: {
        status,
        processedAt: status === 'COMPLETED' ? new Date() : settlement.processedAt,
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

    return NextResponse.json({ message: 'Settlement updated successfully', settlement: updatedSettlement });
  } catch (error) {
    console.error('Error updating settlement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
