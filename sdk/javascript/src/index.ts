/**
 * Pexipay SDK - Main Entry Point
 */

export { PexipayClient } from './client';
export { PexipayError, NetworkError, AuthenticationError, ValidationError, RateLimitError } from './errors';
export { verifyWebhookSignature } from './webhooks';

// Export types
export type {
  PexipayConfig,
  Environment,
  RequestOptions,
  PaginationParams,
  ListResponse
} from './types/config';

export type {
  Payment,
  PaymentCreateParams,
  PaymentStatus,
  PaymentMethod,
  CardDetails,
  ThreeDSParams
} from './types/payment';

export type {
  PaymentLink,
  PaymentLinkCreateParams,
  PaymentLinkStatus
} from './types/payment-link';

export type {
  Customer,
  CustomerCreateParams,
  CustomerUpdateParams,
  CustomerAddress
} from './types/customer';

export type {
  Refund,
  RefundCreateParams,
  RefundStatus
} from './types/refund';

export type {
  Transaction,
  TransactionListParams,
  TransactionType,
  TransactionStatus
} from './types/transaction';

export type {
  WebhookEvent,
  WebhookPayload,
  WebhookEventType
} from './types/webhook';

export type {
  Balance,
  BalanceTransaction
} from './types/balance';
