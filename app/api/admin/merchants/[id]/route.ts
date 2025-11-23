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

    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
          take: 1,
        },
      },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    // Fetch submerchants where this merchant is their superMerchant
    const submerchants = await prisma.merchant.findMany({
      where: { superMerchantId: id },
      select: {
        id: true,
        name: true,
        email: true,
        businessName: true,
        businessType: true,
        country: true,
        status: true,
        transactionFee: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      merchant: {
        id: merchant.id,
        name: merchant.User[0]?.name || merchant.name,
        email: merchant.User[0]?.email || merchant.email,
        businessName: merchant.businessName,
        businessType: merchant.businessType,
        country: merchant.country,
        status: merchant.status,
        superMerchantId: merchant.superMerchantId,
        transactionFee: merchant.transactionFee,
        createdAt: merchant.createdAt,
        updatedAt: merchant.updatedAt,
        submerchants: submerchants,
      },
    });
  } catch (error) {
    console.error('Error fetching merchant:', error);
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
    const { name, email, businessName, businessType, country, status, transactionFee } = body;

    const { id } = await params;

    const merchant = await prisma.merchant.findUnique({
      where: { id },
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
    }

    const updatedMerchant = await prisma.merchant.update({
      where: { id },
      data: {
        name,
        email,
        businessName,
        businessType,
        country,
        status,
        transactionFee,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Merchant updated successfully',
      merchant: {
        id: updatedMerchant.id,
        name: updatedMerchant.name,
        email: updatedMerchant.email,
        businessName: updatedMerchant.businessName,
        businessType: updatedMerchant.businessType,
        country: updatedMerchant.country,
        status: updatedMerchant.status,
        superMerchantId: updatedMerchant.superMerchantId,
        transactionFee: updatedMerchant.transactionFee,
        createdAt: updatedMerchant.createdAt,
        updatedAt: updatedMerchant.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating merchant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
