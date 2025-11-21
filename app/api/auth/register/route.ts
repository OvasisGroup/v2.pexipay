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
  type: z.enum(['super-merchant', 'merchant']),
  superMerchantId: z.string().optional(),
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

    if (data.type === 'super-merchant') {
      // Create super-merchant
      const superMerchant = await prisma.superMerchant.create({
        data: {
          name: data.name,
          email: data.email,
          businessName: data.businessName,
          businessType: data.businessType,
          country: data.country,
          taxId: data.taxId,
          status: 'PENDING',
        },
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          name: data.name,
          role: 'SUPER_MERCHANT',
          superMerchantId: superMerchant.id,
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
      // Merchant registration requires super-merchant ID
      if (!data.superMerchantId) {
        return NextResponse.json(
          { error: 'Super-merchant ID is required for merchant registration' },
          { status: 400 }
        );
      }

      // Verify super-merchant exists
      const superMerchant = await prisma.superMerchant.findUnique({
        where: { id: data.superMerchantId },
      });

      if (!superMerchant) {
        return NextResponse.json(
          { error: 'Invalid super-merchant ID' },
          { status: 400 }
        );
      }

      // Create merchant
      const merchant = await prisma.merchant.create({
        data: {
          name: data.name,
          email: data.email,
          businessName: data.businessName,
          businessType: data.businessType,
          country: data.country,
          taxId: data.taxId,
          superMerchantId: data.superMerchantId,
          status: 'PENDING',
        },
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          name: data.name,
          role: 'MERCHANT',
          merchantId: merchant.id,
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
