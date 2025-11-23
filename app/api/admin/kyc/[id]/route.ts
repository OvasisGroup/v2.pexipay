import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

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
    const { status, reviewNotes } = body;

    const { id } = await params;

    const document = await prisma.kYCDocument.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const updatedDocument = await prisma.kYCDocument.update({
      where: { id },
      data: {
        status,
        reviewNotes,
        reviewedById: payload.userId,
        reviewedAt: new Date(),
      },
      include: {
        Merchant: {
          select: {
            id: true,
            name: true,
            businessName: true,
            email: true,
          },
        },
        SuperMerchant: {
          select: {
            id: true,
            name: true,
            businessName: true,
            email: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Document reviewed successfully', document: updatedDocument });
  } catch (error) {
    console.error('Error reviewing document:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
