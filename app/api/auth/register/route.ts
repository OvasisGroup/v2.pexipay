import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { auditLogger } from '@/lib/audit/logger';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  businessName: z.string().min(2),
  businessType: z.string(),
  country: z.string(),
  taxId: z.string(),
  role: z.enum(['SUPER_MERCHANT', 'MERCHANT']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    if (data.role === 'SUPER_MERCHANT') {
      // Create super-merchant
      const superMerchant = await prisma.superMerchant.create({
        data: {
          id: `sm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: data.name,
          email: data.email,
          businessName: data.businessName,
          businessType: data.businessType,
          country: data.country,
          taxId: data.taxId,
          status: 'PENDING',
          updatedAt: new Date(),
        },
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: data.email,
          passwordHash,
          name: data.name,
          role: 'SUPER_MERCHANT',
          superMerchantId: superMerchant.id,
          updatedAt: new Date(),
        },
      });

      await auditLogger.log({
        userId: user.id,
        action: 'CREATE',
        entity: 'SuperMerchant',
        entityId: superMerchant.id,
      });

      return NextResponse.json({
        message: 'Super-merchant registered successfully. Please complete KYC verification.',
        superMerchantId: superMerchant.id,
        userId: user.id,
      });
    } else {
      // Create merchant without super-merchant requirement
      const merchant = await prisma.merchant.create({
        data: {
          id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: data.businessName,
          email: data.email,
          businessName: data.businessName,
          businessType: data.businessType,
          country: data.country,
          taxId: data.taxId,
          superMerchantId: 'default',  // TODO: Update schema to make this optional or create default super merchant
          status: 'PENDING',
          transactionFee: 2.9,
          updatedAt: new Date(),
        },
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: data.email,
          passwordHash,
          name: data.name,
          role: 'MERCHANT',
          merchantId: merchant.id,
          updatedAt: new Date(),
        },
      });

      await auditLogger.log({
        userId: user.id,
        action: 'CREATE',
        entity: 'Merchant',
        entityId: merchant.id,
      });

      return NextResponse.json({
        message: 'Merchant registered successfully. Please complete KYC verification.',
        merchantId: merchant.id,
        userId: user.id,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
