import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, merchantId } = await request.json();

    if (!apiKey || !merchantId) {
      return NextResponse.json(
        { error: 'Missing required fields: apiKey, merchantId' },
        { status: 400 }
      );
    }

    const keyHash = bcrypt.hashSync(apiKey, 10);
    const prefix = apiKey.substring(0, 8);

    const newApiKey = await prisma.apiKey.create({
      data: {
        name: 'Test API Key',
        keyHash,
        prefix,
        merchantId,
        status: 'ACTIVE',
        environment: 'SANDBOX',
      },
    });

    return NextResponse.json({
      success: true,
      apiKeyId: newApiKey.id,
      message: 'API key added successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'API key already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add API key', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check merchants
export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      select: {
        id: true,
        businessName: true,
        status: true,
      },
      take: 10,
    });

    return NextResponse.json({ merchants });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch merchants', details: error.message },
      { status: 500 }
    );
  }
}
