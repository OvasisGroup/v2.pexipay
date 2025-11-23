import { AxiosInstance } from 'axios';
import type { Balance, BalanceTransaction } from '../types/balance';

export class BalanceResource {
  constructor(private httpClient: AxiosInstance) {}

  /**
   * Retrieve account balance
   */
  async retrieve(): Promise<Balance> {
    const response = await this.httpClient.get('/balance');
    return response.data.data;
  }

  /**
   * List balance transactions
   */
  async listTransactions(params?: {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
  }): Promise<{ data: BalanceTransaction[]; hasMore: boolean }> {
    const response = await this.httpClient.get('/balance/transactions', { params });
    return response.data;
  }
}
