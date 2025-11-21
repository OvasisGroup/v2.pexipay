import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Only admins can view audit logs
    const authResult = await requireRole(request, ['ADMIN']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Fetch audit logs with user information
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 500, // Limit to last 500 logs
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      logs,
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
