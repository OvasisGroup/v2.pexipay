export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'canceled';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  customerEmail?: string;
  customerName?: string;
  paymentMethod?: PaymentMethodDetails;
  requires3DS: boolean;
  threeDSUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCreateParams {
  amount: number;
  currency: string;
  description?: string;
  paymentMethod?: PaymentMethod;
  customerEmail?: string;
  customerName?: string;
  returnUrl?: string;
  cancelUrl?: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  type: 'card';
  card: CardDetails;
}

export interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

export interface PaymentMethodDetails {
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface ThreeDSParams {
  paymentId: string;
  threeDSResult: string;
}

export interface PaymentListParams {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  status?: PaymentStatus;
  customerEmail?: string;
  createdAfter?: string;
  createdBefore?: string;
}
