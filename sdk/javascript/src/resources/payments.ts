import { AxiosInstance } from 'axios';
import type { Payment, PaymentCreateParams, PaymentListParams, ThreeDSParams } from '../types/payment';
import type { ListResponse } from '../types/config';

export class PaymentsResource {
  constructor(private httpClient: AxiosInstance) {}

  /**
   * Create a new payment
   */
  async create(params: PaymentCreateParams): Promise<Payment> {
    const response = await this.httpClient.post('/payments', params);
    return response.data.data;
  }

  /**
   * Retrieve a payment by ID
   */
  async retrieve(paymentId: string): Promise<Payment> {
    const response = await this.httpClient.get(`/payments/${paymentId}`);
    return response.data.data;
  }

  /**
   * List payments
   */
  async list(params?: PaymentListParams): Promise<ListResponse<Payment>> {
    const response = await this.httpClient.get('/payments', { params });
    return response.data;
  }

  /**
   * Confirm 3D Secure authentication
   */
  async confirm3DS(paymentId: string, threeDSResult: string): Promise<Payment> {
    const response = await this.httpClient.post(`/payments/${paymentId}/3ds/confirm`, {
      threeDSResult
    });
    return response.data.data;
  }

  /**
   * Cancel a payment
   */
  async cancel(paymentId: string): Promise<Payment> {
    const response = await this.httpClient.post(`/payments/${paymentId}/cancel`);
    return response.data.data;
  }

  /**
   * Capture a payment (for payments that require manual capture)
   */
  async capture(paymentId: string, amount?: number): Promise<Payment> {
    const response = await this.httpClient.post(`/payments/${paymentId}/capture`, {
      amount
    });
    return response.data.data;
  }
}
