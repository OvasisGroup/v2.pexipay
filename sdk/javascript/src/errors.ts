/**
 * Pexipay SDK Error Classes
 */

export class PexipayError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly requestId?: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    requestId?: string,
    details?: any
  ) {
    super(message);
    this.name = 'PexipayError';
    this.statusCode = statusCode;
    this.code = code;
    this.requestId = requestId;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PexipayError);
    }
  }
}

export class AuthenticationError extends PexipayError {
  constructor(message: string = 'Authentication failed', requestId?: string) {
    super(message, 401, 'authentication_error', requestId);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends PexipayError {
  constructor(message: string, details?: any, requestId?: string) {
    super(message, 400, 'validation_error', requestId, details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends PexipayError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, requestId?: string) {
    super(message, 429, 'rate_limit_error', requestId);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class NetworkError extends PexipayError {
  constructor(message: string = 'Network error occurred') {
    super(message, undefined, 'network_error');
    this.name = 'NetworkError';
  }
}

export class ResourceNotFoundError extends PexipayError {
  constructor(resource: string, resourceId: string, requestId?: string) {
    super(`${resource} not found: ${resourceId}`, 404, 'resource_not_found', requestId);
    this.name = 'ResourceNotFoundError';
  }
}

export class PaymentFailedError extends PexipayError {
  constructor(message: string, details?: any, requestId?: string) {
    super(message, 402, 'payment_failed', requestId, details);
    this.name = 'PaymentFailedError';
  }
}
