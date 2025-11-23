import { AxiosInstance } from 'axios';
import type { Customer, CustomerCreateParams, CustomerUpdateParams, CustomerListParams } from '../types/customer';
import type { ListResponse } from '../types/config';

export class CustomersResource {
  constructor(private httpClient: AxiosInstance) {}

  /**
   * Create a new customer
   */
  async create(params: CustomerCreateParams): Promise<Customer> {
    const response = await this.httpClient.post('/customers', params);
    return response.data.data;
  }

  /**
   * Retrieve a customer by ID
   */
  async retrieve(customerId: string): Promise<Customer> {
    const response = await this.httpClient.get(`/customers/${customerId}`);
    return response.data.data;
  }

  /**
   * Update a customer
   */
  async update(customerId: string, params: CustomerUpdateParams): Promise<Customer> {
    const response = await this.httpClient.patch(`/customers/${customerId}`, params);
    return response.data.data;
  }

  /**
   * Delete a customer
   */
  async delete(customerId: string): Promise<{ deleted: boolean; id: string }> {
    const response = await this.httpClient.delete(`/customers/${customerId}`);
    return response.data;
  }

  /**
   * List customers
   */
  async list(params?: CustomerListParams): Promise<ListResponse<Customer>> {
    const response = await this.httpClient.get('/customers', { params });
    return response.data;
  }
}
