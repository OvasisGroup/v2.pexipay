export type PaymentLinkStatus = 'active' | 'expired' | 'completed' | 'canceled';

export interface PaymentLink {
  id: string;
  url: string;
  amount: number;
  currency: string;
  description?: string;
  status: PaymentLinkStatus;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  expiresAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentLinkCreateParams {
  amount: number;
  currency: string;
  description?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  returnUrl?: string;
  cancelUrl?: string;
  webhookUrl?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface PaymentLinkListParams {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  status?: PaymentLinkStatus;
  createdAfter?: string;
  createdBefore?: string;
}
