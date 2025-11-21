import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const API_KEY_LENGTH = 32;
const PREFIX_LENGTH = 8;

export interface GeneratedApiKey {
  key: string;        // Full key to return to user (only shown once)
  keyHash: string;    // Hashed key to store in database
  prefix: string;     // First 8 chars for identification
}

/**
 * Generate a new API key with environment prefix
 */
export function generateApiKey(environment: 'sandbox' | 'production' = 'sandbox'): GeneratedApiKey {
  // Generate random key with environment prefix
  const envPrefix = environment === 'production' ? 'pxp_live' : 'pxp_test';
  const randomPart = crypto.randomBytes(API_KEY_LENGTH).toString('hex');
  const key = `${envPrefix}_${randomPart}`;
  
  // Hash the key for storage
  const keyHash = bcrypt.hashSync(key, 10);
  
  // Extract prefix for identification (includes environment)
  const prefix = key.substring(0, PREFIX_LENGTH + 9); // pxp_live_ or pxp_test_ + random chars
  
  return {
    key,
    keyHash,
    prefix,
  };
}

/**
 * Verify an API key against a stored hash
 */
export async function verifyApiKey(
  key: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(key, hash);
}

/**
 * Extract prefix from an API key
 */
export function extractPrefix(key: string): string {
  return key.substring(0, PREFIX_LENGTH);
}
