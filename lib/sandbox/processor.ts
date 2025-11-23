import { getTestCardOutcome } from './test-cards';

export interface SandboxPaymentRequest {
  amount: number;
  currency: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardHolderName: string;
  customerEmail?: string;
  customerName?: string;
}

export interface SandboxPaymentResponse {
  id: string;
  status: 'succeeded' | 'failed' | 'requires_action' | 'processing';
  amount: number;
  currency: string;
  message: string;
  requires3DS: boolean;
  threeDSUrl?: string;
  failureCode?: string;
  failureMessage?: string;
  gatewayTransactionId: string;
  createdAt: string;
}

/**
 * Sandbox payment processor
 * Simulates payment processing with realistic responses
 */
export class SandboxProcessor {
  /**
   * Process a payment in sandbox mode
   */
  static async processPayment(request: SandboxPaymentRequest): Promise<SandboxPaymentResponse> {
    const transactionId = `sandbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const gatewayId = `gw_${Math.random().toString(36).substr(2, 16)}`;
    
    // Check for test card scenarios
    const testCardOutcome = getTestCardOutcome(request.cardNumber);
    
    // Validate expiry date
    const expiryValidation = this.validateExpiry(request.cardExpiry);
    if (!expiryValidation.valid) {
      return {
        id: transactionId,
        status: 'failed',
        amount: request.amount,
        currency: request.currency,
        message: expiryValidation.message || 'Invalid card expiry',
        requires3DS: false,
        failureCode: 'expired_card',
        failureMessage: expiryValidation.message,
        gatewayTransactionId: gatewayId,
        createdAt: new Date().toISOString(),
      };
    }
    
    // Validate CVV
    if (request.cardCvv === '000') {
      return {
        id: transactionId,
        status: 'failed',
        amount: request.amount,
        currency: request.currency,
        message: 'Incorrect CVV code',
        requires3DS: false,
        failureCode: 'incorrect_cvc',
        failureMessage: 'The CVV code is incorrect',
        gatewayTransactionId: gatewayId,
        createdAt: new Date().toISOString(),
      };
    }
    
    // Test card specific outcomes
    if (testCardOutcome) {
      switch (testCardOutcome.outcome) {
        case 'success':
          return {
            id: transactionId,
            status: 'succeeded',
            amount: request.amount,
            currency: request.currency,
            message: 'Payment successful',
            requires3DS: false,
            gatewayTransactionId: gatewayId,
            createdAt: new Date().toISOString(),
          };
          
        case 'requires_3ds':
          return {
            id: transactionId,
            status: 'requires_action',
            amount: request.amount,
            currency: request.currency,
            message: '3D Secure authentication required',
            requires3DS: true,
            threeDSUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/sandbox/3ds?payment=${transactionId}`,
            gatewayTransactionId: gatewayId,
            createdAt: new Date().toISOString(),
          };
          
        case 'declined':
        case 'insufficient_funds':
        case 'expired':
        case 'invalid':
          return {
            id: transactionId,
            status: 'failed',
            amount: request.amount,
            currency: request.currency,
            message: testCardOutcome.message || 'Payment failed',
            requires3DS: false,
            failureCode: testCardOutcome.outcome,
            failureMessage: testCardOutcome.message,
            gatewayTransactionId: gatewayId,
            createdAt: new Date().toISOString(),
          };
      }
    }
    
    // Default: random outcome for non-test cards (80% success)
    const shouldSucceed = Math.random() < 0.8;
    
    if (shouldSucceed) {
      return {
        id: transactionId,
        status: 'succeeded',
        amount: request.amount,
        currency: request.currency,
        message: 'Payment successful',
        requires3DS: false,
        gatewayTransactionId: gatewayId,
        createdAt: new Date().toISOString(),
      };
    } else {
      return {
        id: transactionId,
        status: 'failed',
        amount: request.amount,
        currency: request.currency,
        message: 'Payment declined',
        requires3DS: false,
        failureCode: 'card_declined',
        failureMessage: 'Your card was declined',
        gatewayTransactionId: gatewayId,
        createdAt: new Date().toISOString(),
      };
    }
  }
  
  /**
   * Validate card expiry date
   */
  private static validateExpiry(expiry: string): { valid: boolean; message?: string } {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      return { valid: false, message: 'Invalid expiry format. Use MM/YY' };
    }
    
    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    
    if (month < 1 || month > 12) {
      return { valid: false, message: 'Invalid expiry month' };
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { valid: false, message: 'Card has expired' };
    }
    
    return { valid: true };
  }
  
  /**
   * Complete 3DS authentication (always succeeds in sandbox)
   */
  static async complete3DS(paymentId: string): Promise<SandboxPaymentResponse> {
    const gatewayId = `gw_${Math.random().toString(36).substr(2, 16)}`;
    
    // In sandbox, 3DS always succeeds
    return {
      id: paymentId,
      status: 'succeeded',
      amount: 0, // Would fetch from stored payment
      currency: 'USD',
      message: 'Payment successful after 3DS authentication',
      requires3DS: false,
      gatewayTransactionId: gatewayId,
      createdAt: new Date().toISOString(),
    };
  }
}
