import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || payload.role !== 'SUPER_MERCHANT') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch merchant and verify it belongs to this super merchant
    const merchant = await prisma.merchant.findFirst({
      where: {
        id,
        superMerchantId: payload.superMerchantId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
          },
          take: 1,
        },
      },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ merchant });
  } catch (error) {
    console.error('Error fetching merchant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || payload.role !== 'SUPER_MERCHANT') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Verify merchant belongs to this super merchant
    const existingMerchant = await prisma.merchant.findFirst({
      where: {
        id,
        superMerchantId: payload.superMerchantId,
      },
    });

    if (!existingMerchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      businessName,
      businessType,
      country,
      taxId,
      transactionFee,
      status,
    } = body;

    // Update merchant
    const updatedMerchant = await prisma.merchant.update({
      where: { id },
      data: {
        businessName,
        businessType,
        country,
        taxId,
        transactionFee,
        status,
        name: businessName,
      },
    });

    return NextResponse.json({
      message: 'Merchant updated successfully',
      merchant: updatedMerchant,
    });
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || payload.role !== 'SUPER_MERCHANT') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Verify merchant belongs to this super merchant
    const existingMerchant = await prisma.merchant.findFirst({
      where: {
        id,
        superMerchantId: payload.superMerchantId,
      },
    });

    if (!existingMerchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    // Delete associated users and merchant
    await prisma.$transaction(async (tx) => {
      await tx.user.deleteMany({
        where: { merchantId: id },
      });
      await tx.merchant.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      message: 'Merchant deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
