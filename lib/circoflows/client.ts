const CIRCOFLOWS_API_URL = process.env.CIRCOFLOWS_API_URL || 'https://gateway.circoflows.com/api/v1';
const CIRCOFLOWS_API_KEY = process.env.CIRCOFLOWS_API_KEY || '';
const CIRCOFLOWS_TEST_MODE = process.env.CIRCOFLOWS_TEST_MODE === 'true';

export interface CircoFlowsPaymentRequest {
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
  customerIp?: string;
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
    
    // Split name into first_name and last_name as required by CircoFlows
    const fullName = (request.customerName || 'Guest Customer').trim();
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Customer';

    // Extract billing address
    const billingAddress = (metadata?.billingAddress as Record<string, unknown>) || {};

    // CircoFlows uses a FLAT structure, not nested objects
    const circoFlowsRequest = {
      first_name: firstName,
      last_name: lastName,
      email: request.customerEmail || '',
      phone: (metadata?.phone as string) || '',
      line1: (billingAddress.line1 as string) || '',
      city: (billingAddress.city as string) || '',
      state: (billingAddress.state as string) || 'N/A',
      country: (billingAddress.country as string) || 'US',
      postal_code: (billingAddress.postalCode as string) || (billingAddress.postal_code as string) || '',
      ip_address: request.customerIp || '',
      amount: request.amount.toString(),
      currency: request.currency,
      card_number: metadata?.card_number as string,
      card_expiry_month: metadata?.expiry_month as string,
      card_expiry_year: metadata?.expiry_year as string,
      card_cvv: metadata?.cvv as string,
      return_url: request.returnUrl,
      webhook_url: request.webhookUrl,
      merchant_transaction_id: request.merchantReference,
    };

    console.log('[CircoFlows] Direct payment request:', JSON.stringify(circoFlowsRequest, null, 2));

    const response = await this.makeRequest<CircoFlowsApiResponse>('/payment/create', {
      method: 'POST',
      body: JSON.stringify(circoFlowsRequest),
    });

    // Debug logging
    console.log('[CircoFlows] Raw API response (direct payment):', JSON.stringify(response, null, 2));

    // CircoFlows actual response structure: { status, reason, merchant_transaction_id, transaction_id }
    const apiResponse = response as unknown as {
      status: string;
      reason?: string;
      merchant_transaction_id?: string;
      transaction_id?: string;
      amount?: number;
      currency?: string;
      requires_3ds?: boolean;
      three_ds_url?: string;
      created_at?: string;
    };
    
    // Handle error/declined response
    if (apiResponse.status === 'declined' || apiResponse.status === 'failed' || apiResponse.status === 'error') {
      const errorMsg = apiResponse.reason || 'Payment declined';
      console.error('[CircoFlows] Payment declined:', errorMsg);
      throw new Error(`Payment declined: ${errorMsg}`);
    }
    
    // Handle success response
    if (apiResponse.status !== 'success' && !apiResponse.transaction_id) {
      console.error('[CircoFlows] Invalid response structure:', response);
      throw new Error(`CircoFlows error: ${apiResponse.reason || 'Unknown error'}`);
    }

    // Transform CircoFlows response to our internal format
    return {
      id: apiResponse.transaction_id || apiResponse.merchant_transaction_id || '',
      status: this.mapStatus(apiResponse.status),
      amount: request.amount, // Use request amount as response might not include it
      currency: request.currency,
      requires3DS: apiResponse.requires_3ds || false,
      threeDSUrl: apiResponse.three_ds_url,
      createdAt: apiResponse.created_at || new Date().toISOString(),
      gatewayTransactionId: apiResponse.transaction_id,
      webhookQueued: false,
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
    // Split name into first_name and last_name as required by CircoFlows
    const fullName = (request.customerName || 'Guest Customer').trim();
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || 'Guest';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Customer';

    // CircoFlows uses a FLAT structure, not nested objects
    const circoFlowsRequest = {
      first_name: firstName,
      last_name: lastName,
      email: request.customerEmail || '',
      phone: request.metadata?.customerPhone || request.customerEmail || '+1234567890',
      amount: request.amount.toString(),
      currency: request.currency,
      return_url: request.returnUrl,
      webhook_url: request.webhookUrl,
      merchant_transaction_id: request.merchantReference,
    };
    
    const response = await this.makeRequest<CircoFlowsApiResponse>('/payment/create', {
      method: 'POST',
      body: JSON.stringify(circoFlowsRequest),
    });

    console.log('[CircoFlows] Raw API response:', JSON.stringify(response, null, 2));

    // CircoFlows actual response structure: { status, reason, merchant_transaction_id, transaction_id }
    const apiResponse = response as unknown as {
      status: string;
      reason?: string;
      merchant_transaction_id?: string;
      transaction_id?: string;
      payment_url?: string;
      amount?: number;
      currency?: string;
      requires_3ds?: boolean;
      three_ds_url?: string;
      created_at?: string;
    };
    
    // Handle error/declined response
    if (apiResponse.status === 'declined' || apiResponse.status === 'failed' || apiResponse.status === 'error') {
      const errorMsg = apiResponse.reason || 'Payment declined';
      throw new Error(`Payment declined: ${errorMsg}`);
    }
    
    // Handle success response
    if (apiResponse.status !== 'success' && !apiResponse.transaction_id) {
      throw new Error(`CircoFlows error: ${apiResponse.reason || 'Unknown error'}`);
    }
    
    return {
      id: apiResponse.transaction_id || apiResponse.merchant_transaction_id || '',
      status: this.mapStatus(apiResponse.status),
      amount: request.amount,
      currency: request.currency,
      paymentUrl: apiResponse.payment_url,
      requires3DS: apiResponse.requires_3ds || false,
      threeDSUrl: apiResponse.three_ds_url,
      createdAt: apiResponse.created_at || new Date().toISOString(),
      gatewayTransactionId: apiResponse.transaction_id,
      webhookQueued: false,
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
    // Remove trailing slash from apiUrl and leading slash from endpoint, then join properly
    let baseUrl = this.apiUrl.replace(/\/$/, '');
    // Insert /test before the endpoint path if in test mode
    if (this.testMode && !baseUrl.includes('/test')) {
      baseUrl = baseUrl.replace('/api/v1', '/api/v1/test');
    }
    const path = endpoint.replace(/^\//, '');
    const url = `${baseUrl}/${path}`;

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
