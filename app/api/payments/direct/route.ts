import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { circoFlowsClient } from '@/lib/circoflows/client';
import { fraudEngine } from '@/lib/fraud/engine';
import { auditLogger } from '@/lib/audit/logger';

const directPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  externalId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  
  // Card details
  cardNumber: z.string().min(13).max(19),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/), // MM/YY format
  cardCvv: z.string().min(3).max(4),
  cardHolderName: z.string().min(1),
  
  // Billing details
  billingAddress: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string().length(2), // ISO country code
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const authResult = await requireAuth(request);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const body = await request.json();
    const data = directPaymentSchema.parse(body);

    // Get merchant ID from auth context
    let merchantId: string;
    if (authResult.context.user) {
      merchantId = authResult.context.user.merchantId!;
    } else if (authResult.context.apiKeyId) {
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
      paymentMethod: 'CARD',
    });

    // Block if fraud score is too high
    if (fraudResult.shouldBlock) {
      const transaction = await prisma.transaction.create({
        data: {
          merchantId,
          amount: data.amount,
          currency: data.currency,
          paymentMethod: 'CARD',
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
        { error: 'Transaction blocked due to fraud detection', fraudScore: fraudResult.score },
        { status: 403 }
      );
    }

    // Calculate fees
    const merchantFee = data.amount * Number(merchant.transactionFee) / 100;
    const superMerchantFee = data.amount * Number(merchant.SuperMerchant.commissionRate) / 100;
    const pspFee = 0;
    const netAmount = data.amount - merchantFee - superMerchantFee - pspFee;

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        merchantId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: 'CARD',
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

    // Process payment directly with CircoFlows
    try {
      // Parse card expiry
      const [expMonth, expYear] = data.cardExpiry.split('/');

      // Use webhook.site for testing or a valid public URL
      const webhookUrl = process.env.APP_URL?.includes('localhost') 
        ? 'https://webhook.site/unique-id-placeholder' 
        : `${process.env.APP_URL}/api/webhooks/circoflows`;

      const circoFlowsResponse = await circoFlowsClient.createDirectPayment({
        amount: data.amount,
        currency: data.currency,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerIp,
        merchantReference: transaction.id,
        webhookUrl,
        returnUrl: `${process.env.APP_URL}/payment/3ds-return`,
        metadata: {
          // Card details in CircoFlows format
          card_number: data.cardNumber,
          expiry_month: expMonth,
          expiry_year: `20${expYear}`,
          cvv: data.cardCvv,
          phone: data.customerEmail, // Add phone if available
          billingAddress: data.billingAddress,
          // Additional metadata
          metadata: {
            transactionId: transaction.id,
            merchantId,
            ...data.metadata,
          },
        },
      });

      // Determine final status based on CircoFlows response
      let finalStatus: 'CAPTURED' | 'FAILED' | 'PROCESSING' | 'PENDING';
      
      console.log('[Payment API] CircoFlows response:', JSON.stringify(circoFlowsResponse, null, 2));
      
      if (circoFlowsResponse.status === 'succeeded') {
        finalStatus = 'CAPTURED';
      } else if (circoFlowsResponse.status === 'failed') {
        finalStatus = 'FAILED';
        console.log('[Payment API] Payment FAILED - CircoFlows status:', circoFlowsResponse.status);
      } else if (circoFlowsResponse.requires3DS) {
        finalStatus = 'PROCESSING';
      } else {
        finalStatus = 'PROCESSING';
      }

      // Update transaction with CircoFlows details
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          circoFlowsId: circoFlowsResponse.id,
          circoFlowsStatus: circoFlowsResponse.status,
          circoFlowsResponse: JSON.stringify(circoFlowsResponse),
          status: finalStatus,
          requires3DS: circoFlowsResponse.requires3DS,
          processedAt: finalStatus === 'CAPTURED' ? new Date() : null,
        },
      });

      // Log audit
      await auditLogger.logTransactionCreated(
        transaction.id,
        merchantId,
        data.amount,
        authResult.context.apiKeyId
      );

      // Return response based on status
      if (circoFlowsResponse.requires3DS) {
        return NextResponse.json({
          transactionId: transaction.id,
          status: 'REQUIRES_ACTION',
          requires3DS: true,
          threeDSUrl: circoFlowsResponse.threeDSUrl,
          message: 'Additional authentication required',
        });
      }

      if (finalStatus === 'CAPTURED') {
        return NextResponse.json({
          transactionId: transaction.id,
          status: 'COMPLETED',
          amount: data.amount,
          currency: data.currency,
          message: 'Payment successful',
        });
      }

      if (finalStatus === 'FAILED') {
        return NextResponse.json(
          {
            transactionId: transaction.id,
            status: 'FAILED',
            message: 'Payment failed',
          },
          { status: 402 }
        );
      }

      return NextResponse.json({
        transactionId: transaction.id,
        status: 'PROCESSING',
        message: 'Payment processing',
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

      const errorMessage = circoFlowsError instanceof Error ? circoFlowsError.message : 'Payment processing failed';
      console.error('Payment processing error:', errorMessage);
      
      return NextResponse.json(
        { 
          error: errorMessage,
          transactionId: transaction.id,
        },
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

    console.error('Direct payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
