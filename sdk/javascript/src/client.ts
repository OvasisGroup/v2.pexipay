import axios, { AxiosInstance, AxiosError } from 'axios';
import { PaymentsResource } from './resources/payments';
import { PaymentLinksResource } from './resources/payment-links';
import { CustomersResource } from './resources/customers';
import { RefundsResource } from './resources/refunds';
import { TransactionsResource } from './resources/transactions';
import { BalanceResource } from './resources/balance';
import { PexipayError } from './errors';
import type { PexipayConfig, Environment } from './types/config';

const DEFAULT_API_ENDPOINTS = {
  production: 'https://api.pexipay.com/v1',
  sandbox: 'https://sandbox-api.pexipay.com/v1'
};

export class PexipayClient {
  private httpClient: AxiosInstance;
  private config: Required<PexipayConfig>;

  public payments: PaymentsResource;
  public paymentLinks: PaymentLinksResource;
  public customers: CustomersResource;
  public refunds: RefundsResource;
  public transactions: TransactionsResource;
  public balance: BalanceResource;

  constructor(config: PexipayConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required. Get your API key from https://app.pexipay.com/dashboard/api-keys');
    }

    this.config = {
      apiKey: config.apiKey,
      environment: config.environment || 'production',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      apiBaseUrl: config.apiBaseUrl || DEFAULT_API_ENDPOINTS[config.environment || 'production']
    };

    this.httpClient = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Pexipay-Version': '2025-11-23',
        'User-Agent': 'Pexipay-JS-SDK/1.0.0'
      }
    });

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const retryCount = (error.config as any)?._retryCount || 0;
        
        // Retry on network errors or 5xx errors
        if (
          retryCount < this.config.maxRetries &&
          (!error.response || error.response.status >= 500)
        ) {
          (error.config as any)._retryCount = retryCount + 1;
          
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return this.httpClient.request(error.config!);
        }

        throw this.handleError(error);
      }
    );

    // Initialize resources
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
  private handleError(error: AxiosError): PexipayError {
    const response = error.response;
    const errorData = response?.data as any;

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
  public getConfig(): Readonly<PexipayConfig> {
    return { ...this.config };
  }

  /**
   * Update the API key
   */
  public setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  }

  /**
   * Switch environment (useful for testing)
   */
  public setEnvironment(environment: Environment): void {
    this.config.environment = environment;
    this.config.apiBaseUrl = DEFAULT_API_ENDPOINTS[environment];
    this.httpClient.defaults.baseURL = this.config.apiBaseUrl;
  }
}
