export type TransactionType = 'payment' | 'refund' | 'payout' | 'adjustment';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'canceled';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description?: string;
  relatedId?: string; // Payment or refund ID
  createdAt: string;
}

export interface TransactionListParams {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  createdAfter?: string;
  createdBefore?: string;
}
