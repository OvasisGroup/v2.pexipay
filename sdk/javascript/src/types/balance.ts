export interface Balance {
  available: BalanceAmount[];
  pending: BalanceAmount[];
  reserved: BalanceAmount[];
}

export interface BalanceAmount {
  amount: number;
  currency: string;
}

export interface BalanceTransaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  description?: string;
  availableOn: string;
  createdAt: string;
}
