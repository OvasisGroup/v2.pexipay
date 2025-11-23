import { AxiosInstance } from 'axios';
import type { PaymentLink, PaymentLinkCreateParams, PaymentLinkListParams } from '../types/payment-link';
import type { ListResponse } from '../types/config';

export class PaymentLinksResource {
  constructor(private httpClient: AxiosInstance) {}

  /**
   * Create a new payment link
   */
  async create(params: PaymentLinkCreateParams): Promise<PaymentLink> {
    const response = await this.httpClient.post('/payment-links', params);
    return response.data.data;
  }

  /**
   * Retrieve a payment link by ID
   */
  async retrieve(paymentLinkId: string): Promise<PaymentLink> {
    const response = await this.httpClient.get(`/payment-links/${paymentLinkId}`);
    return response.data.data;
  }

  /**
   * List payment links
   */
  async list(params?: PaymentLinkListParams): Promise<ListResponse<PaymentLink>> {
    const response = await this.httpClient.get('/payment-links', { params });
    return response.data;
  }

  /**
   * Cancel a payment link
   */
  async cancel(paymentLinkId: string): Promise<PaymentLink> {
    const response = await this.httpClient.post(`/payment-links/${paymentLinkId}/cancel`);
    return response.data.data;
  }
}
