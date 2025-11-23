import { AxiosInstance } from 'axios';
import type { Refund, RefundCreateParams, RefundListParams } from '../types/refund';
import type { ListResponse } from '../types/config';

export class RefundsResource {
  constructor(private httpClient: AxiosInstance) {}

  /**
   * Create a new refund
   */
  async create(params: RefundCreateParams): Promise<Refund> {
    const response = await this.httpClient.post('/refunds', params);
    return response.data.data;
  }

  /**
   * Retrieve a refund by ID
   */
  async retrieve(refundId: string): Promise<Refund> {
    const response = await this.httpClient.get(`/refunds/${refundId}`);
    return response.data.data;
  }

  /**
   * List refunds
   */
  async list(params?: RefundListParams): Promise<ListResponse<Refund>> {
    const response = await this.httpClient.get('/refunds', { params });
    return response.data;
  }

  /**
   * Cancel a refund (if still pending)
   */
  async cancel(refundId: string): Promise<Refund> {
    const response = await this.httpClient.post(`/refunds/${refundId}/cancel`);
    return response.data.data;
  }
}
