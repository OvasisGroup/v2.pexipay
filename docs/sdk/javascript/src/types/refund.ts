export type RefundStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: RefundStatus;
  reason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RefundCreateParams {
  paymentId: string;
  amount?: number; // Optional for full refund
  reason?: string;
  metadata?: Record<string, any>;
}

export interface RefundListParams {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  paymentId?: string;
  status?: RefundStatus;
  createdAfter?: string;
  createdBefore?: string;
}
