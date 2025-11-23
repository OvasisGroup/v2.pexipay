import { AxiosInstance } from 'axios';
import type { Transaction, TransactionListParams } from '../types/transaction';
import type { ListResponse } from '../types/config';

export class TransactionsResource {
  constructor(private httpClient: AxiosInstance) {}

  /**
   * Retrieve a transaction by ID
   */
  async retrieve(transactionId: string): Promise<Transaction> {
    const response = await this.httpClient.get(`/transactions/${transactionId}`);
    return response.data.data;
  }

  /**
   * List transactions
   */
  async list(params?: TransactionListParams): Promise<ListResponse<Transaction>> {
    const response = await this.httpClient.get('/transactions', { params });
    return response.data;
  }
}
