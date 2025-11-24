import { AxiosInstance } from 'axios';

type PaymentStatus = 'pending' | 'processing' | 'requires_action' | 'succeeded' | 'failed' | 'canceled';
interface Payment {
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
interface PaymentCreateParams {
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
interface PaymentMethod {
    type: 'card';
    card: CardDetails;
}
interface CardDetails {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
}
interface PaymentMethodDetails {
    type: string;
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
    };
}
interface ThreeDSParams {
    paymentId: string;
    threeDSResult: string;
}
interface PaymentListParams {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    status?: PaymentStatus;
    customerEmail?: string;
    createdAfter?: string;
    createdBefore?: string;
}

type Environment = 'production' | 'sandbox';
interface PexipayConfig {
    /**
     * Your Pexipay API key
     */
    apiKey: string;
    /**
     * API environment
     * @default 'production'
     */
    environment?: Environment;
    /**
     * Custom API base URL (overrides environment)
     */
    apiBaseUrl?: string;
    /**
     * Request timeout in milliseconds
     * @default 30000
     */
    timeout?: number;
    /**
     * Maximum number of retry attempts
     * @default 3
     */
    maxRetries?: number;
}
interface RequestOptions {
    /**
     * Idempotency key for safe retries
     */
    idempotencyKey?: string;
    /**
     * Custom request timeout
     */
    timeout?: number;
}
interface PaginationParams {
    /**
     * Maximum number of items to return
     * @default 10
     */
    limit?: number;
    /**
     * Cursor for pagination
     */
    startingAfter?: string;
    /**
     * Cursor for pagination (reverse)
     */
    endingBefore?: string;
}
interface ListResponse<T> {
    data: T[];
    hasMore: boolean;
    totalCount?: number;
}

declare class PaymentsResource {
    private httpClient;
    constructor(httpClient: AxiosInstance);
    /**
     * Create a new payment
     */
    create(params: PaymentCreateParams): Promise<Payment>;
    /**
     * Retrieve a payment by ID
     */
    retrieve(paymentId: string): Promise<Payment>;
    /**
     * List payments
     */
    list(params?: PaymentListParams): Promise<ListResponse<Payment>>;
    /**
     * Confirm 3D Secure authentication
     */
    confirm3DS(paymentId: string, threeDSResult: string): Promise<Payment>;
    /**
     * Cancel a payment
     */
    cancel(paymentId: string): Promise<Payment>;
    /**
     * Capture a payment (for payments that require manual capture)
     */
    capture(paymentId: string, amount?: number): Promise<Payment>;
}

type PaymentLinkStatus = 'active' | 'expired' | 'completed' | 'canceled';
interface PaymentLink {
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
interface PaymentLinkCreateParams {
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
interface PaymentLinkListParams {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    status?: PaymentLinkStatus;
    createdAfter?: string;
    createdBefore?: string;
}

declare class PaymentLinksResource {
    private httpClient;
    constructor(httpClient: AxiosInstance);
    /**
     * Create a new payment link
     */
    create(params: PaymentLinkCreateParams): Promise<PaymentLink>;
    /**
     * Retrieve a payment link by ID
     */
    retrieve(paymentLinkId: string): Promise<PaymentLink>;
    /**
     * List payment links
     */
    list(params?: PaymentLinkListParams): Promise<ListResponse<PaymentLink>>;
    /**
     * Cancel a payment link
     */
    cancel(paymentLinkId: string): Promise<PaymentLink>;
}

interface Customer {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    address?: CustomerAddress;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
interface CustomerAddress {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}
interface CustomerCreateParams {
    email: string;
    name?: string;
    phone?: string;
    address?: CustomerAddress;
    metadata?: Record<string, any>;
}
interface CustomerUpdateParams {
    email?: string;
    name?: string;
    phone?: string;
    address?: CustomerAddress;
    metadata?: Record<string, any>;
}
interface CustomerListParams {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    email?: string;
    createdAfter?: string;
    createdBefore?: string;
}

declare class CustomersResource {
    private httpClient;
    constructor(httpClient: AxiosInstance);
    /**
     * Create a new customer
     */
    create(params: CustomerCreateParams): Promise<Customer>;
    /**
     * Retrieve a customer by ID
     */
    retrieve(customerId: string): Promise<Customer>;
    /**
     * Update a customer
     */
    update(customerId: string, params: CustomerUpdateParams): Promise<Customer>;
    /**
     * Delete a customer
     */
    delete(customerId: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    /**
     * List customers
     */
    list(params?: CustomerListParams): Promise<ListResponse<Customer>>;
}

type RefundStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';
interface Refund {
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
interface RefundCreateParams {
    paymentId: string;
    amount?: number;
    reason?: string;
    metadata?: Record<string, any>;
}
interface RefundListParams {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    paymentId?: string;
    status?: RefundStatus;
    createdAfter?: string;
    createdBefore?: string;
}

declare class RefundsResource {
    private httpClient;
    constructor(httpClient: AxiosInstance);
    /**
     * Create a new refund
     */
    create(params: RefundCreateParams): Promise<Refund>;
    /**
     * Retrieve a refund by ID
     */
    retrieve(refundId: string): Promise<Refund>;
    /**
     * List refunds
     */
    list(params?: RefundListParams): Promise<ListResponse<Refund>>;
    /**
     * Cancel a refund (if still pending)
     */
    cancel(refundId: string): Promise<Refund>;
}

type TransactionType = 'payment' | 'refund' | 'payout' | 'adjustment';
type TransactionStatus = 'pending' | 'completed' | 'failed' | 'canceled';
interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    description?: string;
    relatedId?: string;
    createdAt: string;
}
interface TransactionListParams {
    limit?: number;
    startingAfter?: string;
    endingBefore?: string;
    type?: TransactionType;
    status?: TransactionStatus;
    createdAfter?: string;
    createdBefore?: string;
}

declare class TransactionsResource {
    private httpClient;
    constructor(httpClient: AxiosInstance);
    /**
     * Retrieve a transaction by ID
     */
    retrieve(transactionId: string): Promise<Transaction>;
    /**
     * List transactions
     */
    list(params?: TransactionListParams): Promise<ListResponse<Transaction>>;
}

interface Balance {
    available: BalanceAmount[];
    pending: BalanceAmount[];
    reserved: BalanceAmount[];
}
interface BalanceAmount {
    amount: number;
    currency: string;
}
interface BalanceTransaction {
    id: string;
    amount: number;
    currency: string;
    type: string;
    description?: string;
    availableOn: string;
    createdAt: string;
}

declare class BalanceResource {
    private httpClient;
    constructor(httpClient: AxiosInstance);
    /**
     * Retrieve account balance
     */
    retrieve(): Promise<Balance>;
    /**
     * List balance transactions
     */
    listTransactions(params?: {
        limit?: number;
        startingAfter?: string;
        endingBefore?: string;
    }): Promise<{
        data: BalanceTransaction[];
        hasMore: boolean;
    }>;
}

declare class PexipayClient {
    private httpClient;
    private config;
    payments: PaymentsResource;
    paymentLinks: PaymentLinksResource;
    customers: CustomersResource;
    refunds: RefundsResource;
    transactions: TransactionsResource;
    balance: BalanceResource;
    constructor(config: PexipayConfig);
    /**
     * Handle API errors and convert to PexipayError
     */
    private handleError;
    /**
     * Get the current configuration
     */
    getConfig(): Readonly<PexipayConfig>;
    /**
     * Update the API key
     */
    setApiKey(apiKey: string): void;
    /**
     * Switch environment (useful for testing)
     */
    setEnvironment(environment: Environment): void;
}

/**
 * Pexipay SDK Error Classes
 */
declare class PexipayError extends Error {
    readonly statusCode?: number;
    readonly code?: string;
    readonly requestId?: string;
    readonly details?: any;
    constructor(message: string, statusCode?: number, code?: string, requestId?: string, details?: any);
}
declare class AuthenticationError extends PexipayError {
    constructor(message?: string, requestId?: string);
}
declare class ValidationError extends PexipayError {
    constructor(message: string, details?: any, requestId?: string);
}
declare class RateLimitError extends PexipayError {
    readonly retryAfter?: number;
    constructor(message?: string, retryAfter?: number, requestId?: string);
}
declare class NetworkError extends PexipayError {
    constructor(message?: string);
}

/**
 * Verify webhook signature from Pexipay
 *
 * @param payload - Raw webhook payload (as string)
 * @param signature - Signature from X-Pexipay-Signature header
 * @param webhookSecret - Your webhook secret from Pexipay dashboard
 * @returns True if signature is valid
 */
declare function verifyWebhookSignature(payload: string | Buffer, signature: string, webhookSecret: string): boolean;

type WebhookEventType = 'payment.created' | 'payment.succeeded' | 'payment.failed' | 'payment.requires_action' | 'payment.canceled' | 'refund.created' | 'refund.succeeded' | 'refund.failed' | 'payment_link.created' | 'payment_link.completed' | 'payment_link.expired';
interface WebhookEvent<T = any> {
    id: string;
    type: WebhookEventType;
    data: T;
    createdAt: string;
}
interface WebhookPayload {
    event: WebhookEventType;
    data: any;
    timestamp: string;
    signature: string;
}

export { AuthenticationError, type Balance, type BalanceTransaction, type CardDetails, type Customer, type CustomerAddress, type CustomerCreateParams, type CustomerUpdateParams, type Environment, type ListResponse, NetworkError, type PaginationParams, type Payment, type PaymentCreateParams, type PaymentLink, type PaymentLinkCreateParams, type PaymentLinkStatus, type PaymentMethod, type PaymentStatus, PexipayClient, type PexipayConfig, PexipayError, RateLimitError, type Refund, type RefundCreateParams, type RefundStatus, type RequestOptions, type ThreeDSParams, type Transaction, type TransactionListParams, type TransactionStatus, type TransactionType, ValidationError, type WebhookEvent, type WebhookEventType, type WebhookPayload, verifyWebhookSignature };
