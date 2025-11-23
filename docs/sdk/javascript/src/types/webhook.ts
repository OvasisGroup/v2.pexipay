export type WebhookEventType =
  | 'payment.created'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.requires_action'
  | 'payment.canceled'
  | 'refund.created'
  | 'refund.succeeded'
  | 'refund.failed'
  | 'payment_link.created'
  | 'payment_link.completed'
  | 'payment_link.expired';

export interface WebhookEvent<T = any> {
  id: string;
  type: WebhookEventType;
  data: T;
  createdAt: string;
}

export interface WebhookPayload {
  event: WebhookEventType;
  data: any;
  timestamp: string;
  signature: string;
}
