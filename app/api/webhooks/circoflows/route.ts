import { NextRequest, NextResponse } from 'next/server';
import { circoFlowsClient } from '@/lib/circoflows/client';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-circoflows-signature') || '';

    // Verify webhook signature
    const isValid = await circoFlowsClient.verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);

    // Find transaction
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { circoFlowsId: payload.paymentId },
          { id: payload.metadata?.transactionId },
        ],
      },
      include: {
        Merchant: {
          include: {
            SuperMerchant: true,
          },
        },
      },
    });

    if (!transaction) {
      console.error('Transaction not found for webhook:', payload);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction based on webhook event
    let newStatus = transaction.status;
    let processedAt = transaction.processedAt;

    switch (payload.event) {
      case 'payment.authorized':
        newStatus = 'AUTHORIZED';
        break;
      case 'payment.captured':
      case 'payment.succeeded':
        newStatus = 'CAPTURED';
        processedAt = new Date();
        
        // Record in ledger
        const { ledgerService } = await import('@/lib/settlement/ledger');
        await ledgerService.recordTransaction(
          transaction.id,
          transaction.merchantId,
          transaction.Merchant.superMerchantId,
          Number(transaction.amount),
          Number(transaction.merchantFee),
          Number(transaction.superMerchantFee),
          transaction.currency
        );
        break;
      case 'payment.failed':
        newStatus = 'FAILED';
        processedAt = new Date();
        break;
      case 'payment.refunded':
        newStatus = 'REFUNDED';
        
        // Record refund in ledger
        const { ledgerService: ledgerServiceRefund } = await import('@/lib/settlement/ledger');
        await ledgerServiceRefund.recordRefund(
          transaction.id,
          transaction.merchantId,
          transaction.Merchant.superMerchantId,
          Number(transaction.amount),
          transaction.currency
        );
        break;
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: newStatus,
        circoFlowsStatus: payload.status,
        processedAt,
      },
    });

    // Create webhook event record
    await prisma.webhookEvent.create({
      data: {
        id: `whev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        eventType: 'TRANSACTION_UPDATED',
        status: 'SENT',
        targetUrl: 'internal',
        payload: body,
        signature,
        transactionId: transaction.id,
        sentAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('CircoFlows webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
