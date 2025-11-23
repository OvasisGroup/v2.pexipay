import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { email, name, businessName, country, password } = body;

    // Validate required fields
    if (!email || !name || !businessName || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, businessName, password' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and super merchant in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const userId = randomBytes(16).toString('hex');
      const user = await tx.user.create({
        data: {
          id: userId,
          email,
          passwordHash: hashedPassword,
          name,
          role: 'SUPER_MERCHANT',
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
      });

      // Create super merchant profile
      const superMerchantId = randomBytes(16).toString('hex');
      const superMerchant = await tx.superMerchant.create({
        data: {
          id: superMerchantId,
          name,
          email,
          businessName,
          businessType: 'BUSINESS',
          country: country || 'US',
          taxId: '',
          status: 'ACTIVE',
          commissionRate: 2.0,
          updatedAt: new Date(),
        },
      });

      // Link user to super merchant
      await tx.user.update({
        where: { id: userId },
        data: { superMerchantId: superMerchantId, updatedAt: new Date() },
      });

      // Generate API keys
      const generateApiKey = (prefix: string) => {
        const randomString = randomBytes(32).toString('hex');
        return `${prefix}_${randomString}`;
      };

      const sandboxApiKey = generateApiKey('pxp_test');
      const sandboxKeyHash = await bcrypt.hash(sandboxApiKey, 10);
      const sandboxKey = await tx.apiKey.create({
        data: {
          superMerchantId: superMerchant.id,
          name: 'Sandbox API Key',
          keyHash: sandboxKeyHash,
          prefix: 'pxp_test',
          environment: 'SANDBOX',
          status: 'ACTIVE',
        },
      });

      const productionApiKey = generateApiKey('pxp_live');
      const productionKeyHash = await bcrypt.hash(productionApiKey, 10);
      const productionKey = await tx.apiKey.create({
        data: {
          superMerchantId: superMerchant.id,
          name: 'Production API Key',
          keyHash: productionKeyHash,
          prefix: 'pxp_live',
          environment: 'PRODUCTION',
          status: 'ACTIVE',
        },
      });

      return {
        user,
        superMerchant,
        apiKeys: {
          sandbox: { ...sandboxKey, key: sandboxApiKey },
          production: { ...productionKey, key: productionApiKey },
        },
      };
    });

    // Send welcome email with credentials and documentation
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/emails/super-merchant-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: result.user.email,
          name: result.user.name,
          businessName: result.superMerchant.businessName,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login`,
          sandboxApiKey: result.apiKeys.sandbox.key,
          productionApiKey: result.apiKeys.production.key,
          documentationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/docs/api`,
          apiKeysUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/merchant/api-keys`,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Super merchant created successfully',
      data: {
        userId: result.user.id,
        superMerchantId: result.superMerchant.id,
        email: result.user.email,
        name: result.user.name,
        businessName: result.superMerchant.businessName,
        apiKeys: {
          sandbox: result.apiKeys.sandbox.key,
          production: result.apiKeys.production.key,
        },
      },
    });
  } catch (error) {
    console.error('Create super merchant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
