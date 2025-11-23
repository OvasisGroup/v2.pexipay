import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { CircoFlowsClient } from '@/lib/circoflows/client';

/**
 * POST /api/super-merchant/payment-links
 * Create a payment link using CircoFlows Hosted Payment API
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
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
        { error: 'Forbidden. Super-merchant access required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      amount,
      currency = 'USD',
      description,
      customerInfo,
      expiresAt,
      metadata
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Prepare the CircoFlows client
    const circoflowsClient = new CircoFlowsClient();

    // Convert amount to cents (CircoFlows API expects amount in cents)
    const amountInCents = Math.round(amount * 100);

    // Prepare URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/webhooks/circoflows`;
    const returnUrl = `${baseUrl}/payment/success`;
    const cancelUrl = `${baseUrl}/payment/cancel`;

    // Use CircoFlows client to create hosted payment
    const paymentResponse = await circoflowsClient.createHostedPayment({
      amount: amountInCents,
      currency: currency.toUpperCase(),
      description,
      customerEmail: customerInfo?.email,
      customerName: customerInfo?.name,
      returnUrl,
      cancelUrl,
      webhookUrl,
      metadata: {
        ...metadata,
        superMerchantId: payload.superMerchantId,
        createdBy: payload.userId,
        createdAt: new Date().toISOString(),
        customerPhone: customerInfo?.phone,
        expiresAt: expiresAt || undefined
      }
    });

    // Return the payment link and session information
    return NextResponse.json({
      success: true,
      paymentLink: {
        paymentUrl: paymentResponse.paymentUrl,
        sessionId: paymentResponse.id,
        amount: amount,
        currency: currency.toUpperCase(),
        description,
        status: paymentResponse.status,
        expiresAt: expiresAt || null,
        createdAt: paymentResponse.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/super-merchant/payment-links?sessionId={sessionId}
 * Check the status of a payment link
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
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
        { error: 'Forbidden. Super-merchant access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const circoflowsApiUrl = process.env.CIRCOFLOWS_API_URL || 'https://gateway.circoflows.com';
    const circoflowsApiKey = process.env.CIRCOFLOWS_API_KEY;

    if (!circoflowsApiKey) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Call CircoFlows API to get session status
    const response = await fetch(`${circoflowsApiUrl}/api/hosted-payment/${sessionId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${circoflowsApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('CircoFlows API error:', errorData);
      
      return NextResponse.json(
        { 
          error: 'Failed to get payment link status',
          details: errorData.error || errorData.message || 'Unknown error'
        },
        { status: response.status }
      );
    }

    const statusData = await response.json();

    return NextResponse.json({
      success: true,
      status: statusData.data || statusData
    });
  } catch (error) {
    console.error('Error fetching payment link status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
