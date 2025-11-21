import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { circoFlowsClient } from '@/lib/circoflows/client';
import { requireRole } from '@/lib/middleware/auth';

// Get transaction details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireRole(request, ['MERCHANT', 'SUPER_MERCHANT', 'ADMIN']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const user = authResult.context.user;
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const transactionId = params.id;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        Merchant: {
          select: {
            businessName: true,
            email: true,
            superMerchantId: true,
            SuperMerchant: {
              select: {
                businessName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (user.role === 'MERCHANT' && transaction.merchantId !== user.merchantId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    if (user.role === 'SUPER_MERCHANT' && transaction.Merchant?.superMerchantId !== user.superMerchantId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get latest status from CircoFlows if we have a CircoFlows transaction ID
    if (transaction.circoFlowsId) {
      try {
        const paymentStatus = await circoFlowsClient.getPaymentStatus(
          transaction.circoFlowsId
        );

        // Map CircoFlows status to Prisma status
        let dbStatus: 'CAPTURED' | 'FAILED' | 'PROCESSING' | 'PENDING' = 'PROCESSING';
        if (paymentStatus.status === 'succeeded') {
          dbStatus = 'CAPTURED';
        } else if (paymentStatus.status === 'failed') {
          dbStatus = 'FAILED';
        } else if (paymentStatus.status === 'processing' || paymentStatus.status === 'requires_action') {
          dbStatus = 'PROCESSING';
        } else {
          dbStatus = 'PENDING';
        }

        // Update local status if different
        if (dbStatus !== transaction.status) {
          await prisma.transaction.update({
            where: { id: transaction.id },
            data: { status: dbStatus },
          });
          transaction.status = dbStatus;
        }
      } catch (error) {
        console.error('Failed to fetch payment status from CircoFlows:', error);
      }
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}
