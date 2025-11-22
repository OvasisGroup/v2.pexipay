import jwt, { Secret } from 'jsonwebtoken';

type UserRole = 'ADMIN' | 'SUPER_MERCHANT' | 'MERCHANT' | 'KYC_REVIEWER' | 'FRAUD_ANALYST';

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  merchantId?: string;
  superMerchantId?: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}
