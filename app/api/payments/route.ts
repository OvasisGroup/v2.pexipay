import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { circoFlowsClient } from '@/lib/circoflows/client';
import { fraudEngine } from '@/lib/fraud/engine';
import { auditLogger } from '@/lib/audit/logger';

const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  paymentMethod: z.enum(['CARD', 'BANK_TRANSFER', 'WALLET', 'OTHER']),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  externalId: z.string().optional(),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const body = await request.json();
    const data = createPaymentSchema.parse(body);

    // Get merchant ID from auth context
    let merchantId: string;
    if (authResult.context.user) {
      merchantId = authResult.context.user.merchantId!;
    } else if (authResult.context.apiKeyId) {
      // Get merchant from API key
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: authResult.context.apiKeyId },
        select: { merchantId: true },
      });
      merchantId = apiKey!.merchantId!;
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get merchant details
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      include: { SuperMerchant: true },
    });

    if (!merchant || merchant.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Merchant not active' },
        { status: 403 }
      );
    }

    // Run fraud check
    const customerIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      undefined;
    
    const fraudResult = await fraudEngine.evaluateTransaction({
      merchantId,
      amount: data.amount,
      currency: data.currency,
      customerEmail: data.customerEmail,
      customerIp,
      paymentMethod: data.paymentMethod,
    });

    // Block if fraud score is too high
    if (fraudResult.shouldBlock) {
      const transaction = await prisma.transaction.create({
        data: {
          merchantId,
          amount: data.amount,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          status: 'FAILED',
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          customerIp,
          externalId: data.externalId,
          fraudScore: fraudResult.score,
          fraudStatus: 'BLOCKED',
          merchantFee: 0,
          superMerchantFee: 0,
          pspFee: 0,
          netAmount: 0,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        },
      });

      await fraudEngine.createFraudCase(transaction.id, merchantId, fraudResult);

      return NextResponse.json(
        { error: 'Transaction blocked due to fraud detection' },
        { status: 403 }
      );
    }

    // Calculate fees
    const merchantFee = data.amount * Number(merchant.transactionFee) / 100;
    const superMerchantFee = data.amount * Number(merchant.SuperMerchant.commissionRate) / 100;
    const pspFee = 0; // PSP can also take a fee
    const netAmount = data.amount - merchantFee - superMerchantFee - pspFee;

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        merchantId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        status: 'PENDING',
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerIp,
        externalId: data.externalId,
        fraudScore: fraudResult.score,
        fraudStatus: fraudResult.shouldReview ? 'REVIEW' : 'CLEAN',
        merchantFee,
        superMerchantFee,
        pspFee,
        netAmount,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });

    // Create fraud case if needed
    if (fraudResult.shouldReview) {
      await fraudEngine.createFraudCase(transaction.id, merchantId, fraudResult);
    }

    // Send to CircoFlows
    try {
      const circoFlowsResponse = await circoFlowsClient.createHostedPayment({
        amount: data.amount,
        currency: data.currency,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        merchantReference: transaction.id,
        returnUrl: data.returnUrl,
        cancelUrl: data.cancelUrl,
        webhookUrl: `${process.env.APP_URL}/api/webhooks/circoflows`,
        metadata: {
          ...data.metadata,
          transactionId: transaction.id,
          merchantId,
        },
      });

      // Update transaction with CircoFlows details
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          circoFlowsId: circoFlowsResponse.id,
          circoFlowsStatus: circoFlowsResponse.status,
          circoFlowsResponse: JSON.stringify(circoFlowsResponse),
          status: 'PROCESSING',
          requires3DS: circoFlowsResponse.requires3DS,
        },
      });

      // Log audit
      await auditLogger.logTransactionCreated(
        transaction.id,
        merchantId,
        data.amount,
        authResult.context.apiKeyId
      );

      return NextResponse.json({
        transactionId: transaction.id,
        status: 'PROCESSING',
        paymentUrl: circoFlowsResponse.paymentUrl,
        requires3DS: circoFlowsResponse.requires3DS,
        threeDSUrl: circoFlowsResponse.threeDSUrl,
      });
    } catch (circoFlowsError) {
      // Update transaction as failed
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          circoFlowsResponse: JSON.stringify({ error: String(circoFlowsError) }),
        },
      });

      return NextResponse.json(
        { error: 'Payment processing failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }

    // Get merchant ID from auth context
    let merchantId: string | undefined;
    if (authResult.context.user) {
      merchantId = authResult.context.user.merchantId;
    } else if (authResult.context.apiKeyId) {
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: authResult.context.apiKeyId },
        select: { merchantId: true },
      });
      merchantId = apiKey?.merchantId || undefined;
    }

    if (!merchantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        externalId: true,
        amount: true,
        currency: true,
        status: true,
        paymentMethod: true,
        customerEmail: true,
        createdAt: true,
        processedAt: true,
      },
    });

    const total = await prisma.transaction.count({
      where: { merchantId },
    });

    return NextResponse.json({
      transactions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
