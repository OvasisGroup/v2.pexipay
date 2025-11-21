import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const authResult = await requireRole(request, ['MERCHANT', 'SUPER_MERCHANT', 'ADMIN']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const user = authResult.context.user!;
    const body = await request.json();
    const { status } = body;

    if (!status || !['ACTIVE', 'REVOKED', 'INACTIVE'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Verify ownership
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this API key
    if (apiKey.merchantId !== user.merchantId && 
        apiKey.superMerchantId !== user.superMerchantId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Update API key
    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      apiKey: updatedKey,
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const authResult = await requireRole(request, ['MERCHANT', 'SUPER_MERCHANT', 'ADMIN']);
    if (!authResult.authorized) {
      return authResult.response;
    }

    const user = authResult.context.user!;

    // Verify ownership
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this API key
    if (apiKey.merchantId !== user.merchantId && 
        apiKey.superMerchantId !== user.superMerchantId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Delete API key
    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
