import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { circoFlowsClient } from '@/lib/circoflows/client';
import { z } from 'zod';

const confirmSchema = z.object({
  transactionId: z.string(),
  threeDSResult: z.string().optional(),
  paymentId: z.string().optional(),
});

/**
 * POST /api/payments/3ds-confirm
 * Confirm 3DS authentication after user completes 3DS flow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = confirmSchema.parse(body);

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: data.transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (!transaction.circoFlowsId) {
      return NextResponse.json(
        { error: 'CircoFlows payment ID not found' },
        { status: 400 }
      );
    }

    // Confirm 3DS with CircoFlows
    const circoFlowsResponse = await circoFlowsClient.confirm3DS({
      paymentId: transaction.circoFlowsId,
      threeDSResult: data.threeDSResult || 'authenticated',
    });

    // Determine final status
    let finalStatus: 'CAPTURED' | 'FAILED' | 'PROCESSING';
    if (circoFlowsResponse.status === 'succeeded') {
      finalStatus = 'CAPTURED';
    } else if (circoFlowsResponse.status === 'failed') {
      finalStatus = 'FAILED';
    } else {
      finalStatus = 'PROCESSING';
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: finalStatus,
        circoFlowsStatus: circoFlowsResponse.status,
        circoFlowsResponse: JSON.stringify(circoFlowsResponse),
        threeDSStatus: 'completed',
        processedAt: finalStatus === 'CAPTURED' ? new Date() : null,
      },
    });

    // Return response
    if (finalStatus === 'CAPTURED') {
      return NextResponse.json({
        transactionId: transaction.id,
        status: 'COMPLETED',
        amount: transaction.amount.toNumber(),
        currency: transaction.currency,
        message: '3DS authentication successful',
      });
    }

    if (finalStatus === 'FAILED') {
      return NextResponse.json(
        {
          transactionId: transaction.id,
          status: 'FAILED',
          message: '3DS authentication failed',
        },
        { status: 402 }
      );
    }

    return NextResponse.json({
      transactionId: transaction.id,
      status: 'PROCESSING',
      message: 'Payment processing',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('3DS confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm 3DS authentication' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payments/3ds-confirm?transactionId=xxx
 * Check 3DS confirmation status (for redirect callback)
 */
export async function GET(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Map database status to user-friendly status
    let displayStatus: string = transaction.status;
    if (transaction.status === 'CAPTURED') {
      displayStatus = 'COMPLETED';
    } else if (transaction.status === 'PROCESSING') {
      displayStatus = 'PROCESSING';
    } else if (transaction.status === 'FAILED') {
      displayStatus = 'FAILED';
    }

    return NextResponse.json({
      transactionId: transaction.id,
      status: displayStatus,
      amount: transaction.amount.toNumber(),
      currency: transaction.currency,
      circoFlowsStatus: transaction.circoFlowsStatus,
      threeDSStatus: transaction.threeDSStatus,
    });

  } catch (error) {
    console.error('3DS status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check 3DS status' },
      { status: 500 }
    );
  }
}
