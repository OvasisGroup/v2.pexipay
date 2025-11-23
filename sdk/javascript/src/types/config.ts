export type Environment = 'production' | 'sandbox';

export interface PexipayConfig {
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

export interface RequestOptions {
  /**
   * Idempotency key for safe retries
   */
  idempotencyKey?: string;

  /**
   * Custom request timeout
   */
  timeout?: number;
}

export interface PaginationParams {
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

export interface ListResponse<T> {
  data: T[];
  hasMore: boolean;
  totalCount?: number;
}
