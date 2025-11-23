export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: CustomerAddress;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface CustomerCreateParams {
  email: string;
  name?: string;
  phone?: string;
  address?: CustomerAddress;
  metadata?: Record<string, any>;
}

export interface CustomerUpdateParams {
  email?: string;
  name?: string;
  phone?: string;
  address?: CustomerAddress;
  metadata?: Record<string, any>;
}

export interface CustomerListParams {
  limit?: number;
  startingAfter?: string;
  endingBefore?: string;
  email?: string;
  createdAfter?: string;
  createdBefore?: string;
}
