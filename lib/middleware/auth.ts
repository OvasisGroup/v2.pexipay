import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JwtPayload } from '@/lib/auth/jwt';
import { verifyApiKey } from '@/lib/auth/api-key';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/auth/rbac';

export interface AuthContext {
  user?: JwtPayload;
  apiKeyId?: string;
}

/**
 * Extract token from Authorization header
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  // Support both "Bearer <token>" and "ApiKey <key>" formats
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;
  
  return parts[1];
}

/**
 * Authenticate request with JWT
 */
export async function authenticateJWT(
  request: NextRequest
): Promise<JwtPayload | null> {
  const token = extractToken(request);
  if (!token) return null;
  
  try {
    const payload = verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Authenticate request with API Key
 */
export async function authenticateApiKey(
  request: NextRequest
): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  
  // Support both "ApiKey <key>" and "Bearer <key>" formats for API keys
  let apiKey: string | null = null;
  if (authHeader.startsWith('ApiKey ')) {
    apiKey = authHeader.substring(7);
  } else if (authHeader.startsWith('Bearer ')) {
    apiKey = authHeader.substring(7);
    // Only process as API key if it starts with pxp_
    if (!apiKey.startsWith('pxp_')) {
      return null; // This is a JWT token, not an API key
    }
  } else {
    return null;
  }
  
  if (!apiKey) return null;
  
  try {
    // Find API key by prefix for better performance
    const prefix = apiKey.substring(0, 8);
    const apiKeyRecord = await prisma.apiKey.findFirst({
      where: {
        prefix,
        status: 'ACTIVE',
      },
    });
    
    if (!apiKeyRecord) return null;
    
    // Verify the full key
    const isValid = await verifyApiKey(apiKey, apiKeyRecord.keyHash);
    if (!isValid) return null;
    
    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });
    
    return apiKeyRecord.id;
  } catch {
    return null;
  }
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ authorized: true; context: AuthContext } | { authorized: false; response: NextResponse }> {
  // Try JWT first
  const jwtPayload = await authenticateJWT(request);
  if (jwtPayload) {
    return {
      authorized: true,
      context: { user: jwtPayload },
    };
  }
  
  // Try API Key
  const apiKeyId = await authenticateApiKey(request);
  if (apiKeyId) {
    return {
      authorized: true,
      context: { apiKeyId },
    };
  }
  
  // Unauthorized
  return {
    authorized: false,
    response: NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    ),
  };
}

/**
 * Middleware to require specific role
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{ authorized: true; context: AuthContext } | { authorized: false; response: NextResponse }> {
  const authResult = await requireAuth(request);
  
  if (!authResult.authorized) {
    return authResult;
  }
  
  // API keys have limited permissions
  if (authResult.context.apiKeyId && !authResult.context.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden - API key cannot access this resource' },
        { status: 403 }
      ),
    };
  }
  
  const user = authResult.context.user!;
  
  if (!allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      ),
    };
  }
  
  return authResult;
}

/**
 * Middleware to require specific permission
 */
export async function requirePermission(
  request: NextRequest,
  permission: string
): Promise<{ authorized: true; context: AuthContext } | { authorized: false; response: NextResponse }> {
  const authResult = await requireAuth(request);
  
  if (!authResult.authorized) {
    return authResult;
  }
  
  // API keys have limited permissions
  if (authResult.context.apiKeyId && !authResult.context.user) {
    // API keys can only access transaction endpoints
    if (!permission.startsWith('transactions:')) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Forbidden - API key cannot access this resource' },
          { status: 403 }
        ),
      };
    }
  } else {
    const user = authResult.context.user!;
    
    if (!hasPermission(user.role, permission)) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        ),
      };
    }
  }
  
  return authResult;
}
