"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthenticationError: () => AuthenticationError,
  NetworkError: () => NetworkError,
  PexipayClient: () => PexipayClient,
  PexipayError: () => PexipayError,
  RateLimitError: () => RateLimitError,
  ValidationError: () => ValidationError,
  verifyWebhookSignature: () => verifyWebhookSignature
});
module.exports = __toCommonJS(index_exports);

// src/client.ts
var import_axios = __toESM(require("axios"));

// src/resources/payments.ts
var PaymentsResource = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  /**
   * Create a new payment
   */
  async create(params) {
    const response = await this.httpClient.post("/payments", params);
    return response.data.data;
  }
  /**
   * Retrieve a payment by ID
   */
  async retrieve(paymentId) {
    const response = await this.httpClient.get(`/payments/${paymentId}`);
    return response.data.data;
  }
  /**
   * List payments
   */
  async list(params) {
    const response = await this.httpClient.get("/payments", { params });
    return response.data;
  }
  /**
   * Confirm 3D Secure authentication
   */
  async confirm3DS(paymentId, threeDSResult) {
    const response = await this.httpClient.post(`/payments/${paymentId}/3ds/confirm`, {
      threeDSResult
    });
    return response.data.data;
  }
  /**
   * Cancel a payment
   */
  async cancel(paymentId) {
    const response = await this.httpClient.post(`/payments/${paymentId}/cancel`);
    return response.data.data;
  }
  /**
   * Capture a payment (for payments that require manual capture)
   */
  async capture(paymentId, amount) {
    const response = await this.httpClient.post(`/payments/${paymentId}/capture`, {
      amount
    });
    return response.data.data;
  }
};

// src/resources/payment-links.ts
var PaymentLinksResource = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  /**
   * Create a new payment link
   */
  async create(params) {
    const response = await this.httpClient.post("/payment-links", params);
    return response.data.data;
  }
  /**
   * Retrieve a payment link by ID
   */
  async retrieve(paymentLinkId) {
    const response = await this.httpClient.get(`/payment-links/${paymentLinkId}`);
    return response.data.data;
  }
  /**
   * List payment links
   */
  async list(params) {
    const response = await this.httpClient.get("/payment-links", { params });
    return response.data;
  }
  /**
   * Cancel a payment link
   */
  async cancel(paymentLinkId) {
    const response = await this.httpClient.post(`/payment-links/${paymentLinkId}/cancel`);
    return response.data.data;
  }
};

// src/resources/customers.ts
var CustomersResource = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  /**
   * Create a new customer
   */
  async create(params) {
    const response = await this.httpClient.post("/customers", params);
    return response.data.data;
  }
  /**
   * Retrieve a customer by ID
   */
  async retrieve(customerId) {
    const response = await this.httpClient.get(`/customers/${customerId}`);
    return response.data.data;
  }
  /**
   * Update a customer
   */
  async update(customerId, params) {
    const response = await this.httpClient.patch(`/customers/${customerId}`, params);
    return response.data.data;
  }
  /**
   * Delete a customer
   */
  async delete(customerId) {
    const response = await this.httpClient.delete(`/customers/${customerId}`);
    return response.data;
  }
  /**
   * List customers
   */
  async list(params) {
    const response = await this.httpClient.get("/customers", { params });
    return response.data;
  }
};

// src/resources/refunds.ts
var RefundsResource = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  /**
   * Create a new refund
   */
  async create(params) {
    const response = await this.httpClient.post("/refunds", params);
    return response.data.data;
  }
  /**
   * Retrieve a refund by ID
   */
  async retrieve(refundId) {
    const response = await this.httpClient.get(`/refunds/${refundId}`);
    return response.data.data;
  }
  /**
   * List refunds
   */
  async list(params) {
    const response = await this.httpClient.get("/refunds", { params });
    return response.data;
  }
  /**
   * Cancel a refund (if still pending)
   */
  async cancel(refundId) {
    const response = await this.httpClient.post(`/refunds/${refundId}/cancel`);
    return response.data.data;
  }
};

// src/resources/transactions.ts
var TransactionsResource = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  /**
   * Retrieve a transaction by ID
   */
  async retrieve(transactionId) {
    const response = await this.httpClient.get(`/transactions/${transactionId}`);
    return response.data.data;
  }
  /**
   * List transactions
   */
  async list(params) {
    const response = await this.httpClient.get("/transactions", { params });
    return response.data;
  }
};

// src/resources/balance.ts
var BalanceResource = class {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }
  /**
   * Retrieve account balance
   */
  async retrieve() {
    const response = await this.httpClient.get("/balance");
    return response.data.data;
  }
  /**
   * List balance transactions
   */
  async listTransactions(params) {
    const response = await this.httpClient.get("/balance/transactions", { params });
    return response.data;
  }
};

// src/errors.ts
var PexipayError = class _PexipayError extends Error {
  constructor(message, statusCode, code, requestId, details) {
    super(message);
    this.name = "PexipayError";
    this.statusCode = statusCode;
    this.code = code;
    this.requestId = requestId;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _PexipayError);
    }
  }
};
var AuthenticationError = class extends PexipayError {
  constructor(message = "Authentication failed", requestId) {
    super(message, 401, "authentication_error", requestId);
    this.name = "AuthenticationError";
  }
};
var ValidationError = class extends PexipayError {
  constructor(message, details, requestId) {
    super(message, 400, "validation_error", requestId, details);
    this.name = "ValidationError";
  }
};
var RateLimitError = class extends PexipayError {
  constructor(message = "Rate limit exceeded", retryAfter, requestId) {
    super(message, 429, "rate_limit_error", requestId);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
};
var NetworkError = class extends PexipayError {
  constructor(message = "Network error occurred") {
    super(message, void 0, "network_error");
    this.name = "NetworkError";
  }
};

// src/client.ts
var DEFAULT_API_ENDPOINTS = {
  production: "https://api.pexipay.com/v1",
  sandbox: "https://sandbox-api.pexipay.com/v1"
};
var PexipayClient = class {
  constructor(config) {
    if (!config.apiKey) {
      throw new Error("API key is required. Get your API key from https://app.pexipay.com/dashboard/api-keys");
    }
    this.config = {
      apiKey: config.apiKey,
      environment: config.environment || "production",
      timeout: config.timeout || 3e4,
      maxRetries: config.maxRetries || 3,
      apiBaseUrl: config.apiBaseUrl || DEFAULT_API_ENDPOINTS[config.environment || "production"]
    };
    this.httpClient = import_axios.default.create({
      baseURL: this.config.apiBaseUrl,
      timeout: this.config.timeout,
      headers: {
        "Authorization": `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
        "X-Pexipay-Version": "2025-11-23",
        "User-Agent": "Pexipay-JS-SDK/1.0.0"
      }
    });
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const retryCount = error.config?._retryCount || 0;
        if (retryCount < this.config.maxRetries && (!error.response || error.response.status >= 500)) {
          error.config._retryCount = retryCount + 1;
          const delay = Math.min(1e3 * Math.pow(2, retryCount), 1e4);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.httpClient.request(error.config);
        }
        throw this.handleError(error);
      }
    );
    this.payments = new PaymentsResource(this.httpClient);
    this.paymentLinks = new PaymentLinksResource(this.httpClient);
    this.customers = new CustomersResource(this.httpClient);
    this.refunds = new RefundsResource(this.httpClient);
    this.transactions = new TransactionsResource(this.httpClient);
    this.balance = new BalanceResource(this.httpClient);
  }
  /**
   * Handle API errors and convert to PexipayError
   */
  handleError(error) {
    const response = error.response;
    const errorData = response?.data;
    return new PexipayError(
      errorData?.error || errorData?.message || error.message,
      response?.status,
      errorData?.code,
      errorData?.requestId,
      errorData?.details
    );
  }
  /**
   * Get the current configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Update the API key
   */
  setApiKey(apiKey) {
    this.config.apiKey = apiKey;
    this.httpClient.defaults.headers.common["Authorization"] = `Bearer ${apiKey}`;
  }
  /**
   * Switch environment (useful for testing)
   */
  setEnvironment(environment) {
    this.config.environment = environment;
    this.config.apiBaseUrl = DEFAULT_API_ENDPOINTS[environment];
    this.httpClient.defaults.baseURL = this.config.apiBaseUrl;
  }
};

// src/webhooks.ts
var crypto = __toESM(require("crypto"));
function verifyWebhookSignature(payload, signature, webhookSecret) {
  try {
    const payloadString = typeof payload === "string" ? payload : payload.toString("utf8");
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(payloadString).digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    return false;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticationError,
  NetworkError,
  PexipayClient,
  PexipayError,
  RateLimitError,
  ValidationError,
  verifyWebhookSignature
});
