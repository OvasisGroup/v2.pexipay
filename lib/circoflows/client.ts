const CIRCOFLOWS_API_URL = process.env.CIRCOFLOWS_API_URL || 'https://api.circoflows.com/v1';
const CIRCOFLOWS_API_KEY = process.env.CIRCOFLOWS_API_KEY || '';
const CIRCOFLOWS_TEST_MODE = process.env.CIRCOFLOWS_TEST_MODE === 'true';

export interface CircoFlowsPaymentRequest {
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  description?: string;
  merchantReference?: string;
  returnUrl?: string;
  cancelUrl?: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface CircoFlowsPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  paymentUrl?: string;
  requires3DS: boolean;
  threeDSUrl?: string;
  createdAt: string;
  gatewayTransactionId?: string;
  webhookQueued?: boolean;
}

// CircoFlows API response format
interface CircoFlowsApiResponse {
  success: boolean;
  message: string;
  data: {
    transaction_id: string;
    amount: number;
    currency: string;
    status: string;
    gateway_transaction_id?: string;
    created_at: string;
    webhook_queued?: boolean;
    requires_3ds?: boolean;
    three_ds_url?: string;
    requires_action?: boolean;
    action_type?: string;
    action_data?: {
      '3ds_url'?: string;
    };
    payment_url?: string;
  };
}

export interface CircoFlows3DSConfirmRequest {
  paymentId: string;
  threeDSResult: string;
}

export interface CircoFlowsWebhookPayload {
  event: string;
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  timestamp: string;
  signature: string;
}

export class CircoFlowsClient {
  private apiUrl: string;
  private apiKey: string;
  private testMode: boolean;

  constructor() {
    this.apiUrl = CIRCOFLOWS_API_URL;
    this.apiKey = CIRCOFLOWS_API_KEY;
    this.testMode = CIRCOFLOWS_TEST_MODE;
  }

  /**
   * Create a direct payment
   */
  async createDirectPayment(
    request: CircoFlowsPaymentRequest
  ): Promise<CircoFlowsPaymentResponse> {
    // Mock response in test mode with placeholder URL
    if (this.testMode && this.apiUrl.includes('example.com')) {
      const mockId = `cf_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate random payment outcomes for testing
      const outcomes = ['succeeded', 'failed', 'requires_3ds'];
      const weights = [0.8, 0.1, 0.1]; // 80% success, 10% fail, 10% 3DS
      const rand = Math.random();
      let outcome = outcomes[0];
      
      if (rand < weights[1]) {
        outcome = outcomes[1];
      } else if (rand < weights[1] + weights[2]) {
        outcome = outcomes[2];
      }
      
      // Check if card number indicates specific test scenario
      const metadata = request.metadata as Record<string, unknown> | undefined;
      const cardNumber = (metadata?.card_number as string) || '';
      
      if (cardNumber.startsWith('4000000000000002')) {
        outcome = 'failed'; // Declined card
      } else if (cardNumber.startsWith('4000000000003220')) {
        outcome = 'requires_3ds'; // 3DS required
      } else if (cardNumber.startsWith('4111111111111111') || cardNumber.startsWith('4242424242424242') || cardNumber.startsWith('5555555555554444')) {
        outcome = 'succeeded'; // Standard test cards always succeed
      }
      
      const response: CircoFlowsPaymentResponse = {
        id: mockId,
        status: outcome === 'succeeded' ? 'succeeded' : outcome === 'requires_3ds' ? 'requires_action' : 'failed',
        amount: request.amount,
        currency: request.currency,
        requires3DS: outcome === 'requires_3ds',
        createdAt: new Date().toISOString(),
      };
      
      if (outcome === 'requires_3ds') {
        response.threeDSUrl = `${process.env.APP_URL}/test-shop/mock-3ds?id=${mockId}`;
      }
      
      return response;
    }

    // Format request to match CircoFlows API structure
    const metadata = request.metadata as Record<string, unknown> | undefined;
    const circoFlowsRequest = {
      amount: request.amount,
      currency: request.currency,
      payment_method: 'card',
      card_number: metadata?.card_number as string,
      expiry_month: metadata?.expiry_month as string,
      expiry_year: metadata?.expiry_year as string,
      cvv: metadata?.cvv as string,
      customer_info: {
        name: request.customerName || '',
        email: request.customerEmail || '',
        phone: (metadata?.phone as string) || '',
        address: metadata?.billingAddress || {},
      },
      metadata: {
        merchant_reference: request.merchantReference,
        ...(metadata?.metadata as Record<string, unknown>),
      },
      webhook_url: request.webhookUrl,
      return_url: request.returnUrl,
    };

    const response = await this.makeRequest<CircoFlowsApiResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify(circoFlowsRequest),
    });

    // Transform CircoFlows response to our internal format
    return {
      id: response.data.transaction_id,
      status: this.mapStatus(response.data.status),
      amount: response.data.amount,
      currency: response.data.currency,
      requires3DS: response.data.requires_3ds || response.data.requires_action || false,
      threeDSUrl: response.data.three_ds_url || response.data.action_data?.['3ds_url'],
      createdAt: response.data.created_at,
      gatewayTransactionId: response.data.gateway_transaction_id,
      webhookQueued: response.data.webhook_queued,
    };
  }

  /**
   * Map CircoFlows status to our internal status
   */
  private mapStatus(circoFlowsStatus: string): string {
    const statusMap: Record<string, string> = {
      'completed': 'succeeded',
      'success': 'succeeded',
      'pending': 'processing',
      'processing': 'processing',
      'failed': 'failed',
      'declined': 'failed',
      'requires_action': 'requires_action',
      'requires_3ds': 'requires_action',
    };
    return statusMap[circoFlowsStatus.toLowerCase()] || circoFlowsStatus;
  }

  /**
   * Create a hosted payment
   */
  async createHostedPayment(
    request: CircoFlowsPaymentRequest
  ): Promise<CircoFlowsPaymentResponse> {
    // Mock response in test mode with placeholder URL
    if (this.testMode && this.apiUrl.includes('example.com')) {
      const mockId = `cf_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: mockId,
        status: 'pending',
        amount: request.amount,
        currency: request.currency,
        paymentUrl: `${process.env.APP_URL}/test-shop/mock-payment?id=${mockId}`,
        requires3DS: false,
        createdAt: new Date().toISOString(),
      };
    }

    const response = await this.makeRequest<CircoFlowsApiResponse>('/payments/hosted', {
      method: 'POST',
      body: JSON.stringify({
        ...request,
        testMode: this.testMode,
      }),
    });

    return {
      id: response.data.transaction_id,
      status: this.mapStatus(response.data.status),
      amount: response.data.amount,
      currency: response.data.currency,
      paymentUrl: response.data.payment_url,
      requires3DS: response.data.requires_3ds || false,
      threeDSUrl: response.data.three_ds_url,
      createdAt: response.data.created_at,
      gatewayTransactionId: response.data.gateway_transaction_id,
    };
  }

  /**
   * Confirm 3DS authentication
   */
  async confirm3DS(
    request: CircoFlows3DSConfirmRequest
  ): Promise<CircoFlowsPaymentResponse> {
    const response = await this.makeRequest<CircoFlowsApiResponse>(`/payments/${request.paymentId}/3ds/confirm`, {
      method: 'POST',
      body: JSON.stringify({
        threeDSResult: request.threeDSResult,
      }),
    });

    return {
      id: response.data.transaction_id,
      status: this.mapStatus(response.data.status),
      amount: response.data.amount,
      currency: response.data.currency,
      requires3DS: false,
      createdAt: response.data.created_at,
      gatewayTransactionId: response.data.gateway_transaction_id,
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<CircoFlowsPaymentResponse> {
    // Mock response in test mode with placeholder URL
    if (this.testMode && this.apiUrl.includes('example.com')) {
      return {
        id: paymentId,
        status: 'succeeded',
        amount: 0,
        currency: 'USD',
        requires3DS: false,
        createdAt: new Date().toISOString(),
      };
    }

    const response = await this.makeRequest<CircoFlowsApiResponse>(`/payments/${paymentId}`, {
      method: 'GET',
    });

    return {
      id: response.data.transaction_id,
      status: this.mapStatus(response.data.status),
      amount: response.data.amount,
      currency: response.data.currency,
      requires3DS: response.data.requires_3ds || response.data.requires_action || false,
      threeDSUrl: response.data.three_ds_url || response.data.action_data?.['3ds_url'],
      createdAt: response.data.created_at,
      gatewayTransactionId: response.data.gateway_transaction_id,
    };
  }

  /**
   * Capture a payment
   */
  async capturePayment(
    paymentId: string,
    amount?: number
  ): Promise<CircoFlowsPaymentResponse> {
    const response = await this.makeRequest<CircoFlowsApiResponse>(`/payments/${paymentId}/capture`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });

    return {
      id: response.data.transaction_id,
      status: this.mapStatus(response.data.status),
      amount: response.data.amount,
      currency: response.data.currency,
      requires3DS: false,
      createdAt: response.data.created_at,
      gatewayTransactionId: response.data.gateway_transaction_id,
    };
  }

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<CircoFlowsPaymentResponse> {
    const response = await this.makeRequest<CircoFlowsApiResponse>(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });

    return {
      id: response.data.transaction_id,
      status: this.mapStatus(response.data.status),
      amount: response.data.amount,
      currency: response.data.currency,
      requires3DS: false,
      createdAt: response.data.created_at,
      gatewayTransactionId: response.data.gateway_transaction_id,
    };
  }

  /**
   * Verify webhook signature
   */
  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    const crypto = await import('crypto');
    const webhookSecret = process.env.CIRCOFLOWS_WEBHOOK_SECRET || '';
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Make HTTP request to CircoFlows API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    console.log(`[CircoFlows] ${options.method || 'GET'} ${url}`);
    console.log(`[CircoFlows] Test Mode: ${this.testMode}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-API-Version': '1.0',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[CircoFlows] Error: ${response.status}`, errorData);
      throw new Error(
        `CircoFlows API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log(`[CircoFlows] Response:`, responseData);
    return responseData as T;
  }
}

// Export singleton instance
export const circoFlowsClient = new CircoFlowsClient();
