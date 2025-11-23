import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

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

    if (!payload || payload.role !== 'SUPER_MERCHANT') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch all sub-merchants under this super merchant
    const merchants = await prisma.merchant.findMany({
      where: {
        superMerchantId: payload.superMerchantId,
      },
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
    const formattedMerchants = merchants.map((merchant) => ({
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

export async function POST(request: NextRequest) {
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

    if (!payload || payload.role !== 'SUPER_MERCHANT') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      businessName,
      businessType,
      country,
      taxId,
      transactionFee,
      name,
      email,
      password,
    } = body;

    // Validate required fields
    if (!businessName || !email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create merchant and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create merchant
      const merchant = await tx.merchant.create({
        data: {
          id: randomBytes(16).toString('hex'),
          businessName,
          businessType: businessType || 'OTHER',
          country: country || 'US',
          taxId: taxId || '',
          status: 'PENDING',
          superMerchantId: payload.superMerchantId!,
          transactionFee: transactionFee || 2.9,
          name: businessName,
          email: email,
          updatedAt: new Date(),
        },
      });

      // Create user for the merchant
      const user = await tx.user.create({
        data: {
          id: randomBytes(16).toString('hex'),
          email,
          passwordHash,
          name,
          role: 'MERCHANT',
          status: 'ACTIVE',
          merchantId: merchant.id,
          updatedAt: new Date(),
        },
      });

      return { merchant, user };
    });

    return NextResponse.json({
      message: 'Merchant created successfully',
      merchant: result.merchant,
    });
  } catch (error) {
    console.error('Error creating merchant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
