import * as crypto from 'crypto';

/**
 * Verify webhook signature from Pexipay
 * 
 * @param payload - Raw webhook payload (as string)
 * @param signature - Signature from X-Pexipay-Signature header
 * @param webhookSecret - Your webhook secret from Pexipay dashboard
 * @returns True if signature is valid
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): boolean {
  try {
    const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payloadString)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Parse and verify webhook event
 * 
 * @param payload - Raw webhook payload
 * @param signature - Signature from header
 * @param webhookSecret - Your webhook secret
 * @returns Parsed webhook event
 * @throws Error if signature is invalid
 */
export function constructWebhookEvent<T = any>(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): T {
  const isValid = verifyWebhookSignature(payload, signature, webhookSecret);
  
  if (!isValid) {
    throw new Error('Invalid webhook signature');
  }

  const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
  return JSON.parse(payloadString);
}
