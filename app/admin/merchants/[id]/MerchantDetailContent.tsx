'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

interface Merchant {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  country: string;
  status: string;
  superMerchantId: string | null;
  transactionFee: number;
  createdAt: string;
  updatedAt: string;
  submerchants?: Merchant[];
}

interface Transaction {
  id: string;
  externalId: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  customerEmail: string | null;
  customerName: string | null;
  createdAt: string;
}

interface TransactionSummary {
  totalTransactions: number;
  totalRevenue: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  completedRevenue: number;
}

export default function MerchantDetailContent({ merchantId }: { merchantId: string }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [submerchants, setSubmerchants] = useState<Merchant[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalTransactions: 0,
    totalRevenue: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    completedRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const router = useRouter();

  const fetchTransactions = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/merchants/${merchantId}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const txs = data.transactions || [];
        setTransactions(txs);
        
        // Calculate summary
        const completed = txs.filter((t: Transaction) => t.status === 'COMPLETED');
        const pending = txs.filter((t: Transaction) => t.status === 'PENDING');
        const failed = txs.filter((t: Transaction) => t.status === 'FAILED');
        
        setSummary({
          totalTransactions: txs.length,
          totalRevenue: txs.reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0),
          completedTransactions: completed.length,
          pendingTransactions: pending.length,
          failedTransactions: failed.length,
          completedRevenue: completed.reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0),
        });
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  }, [merchantId]);

  useEffect(() => {
    const fetchMerchant = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`/api/admin/merchants/${merchantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMerchant(data.merchant);
          if (data.merchant.submerchants) {
            setSubmerchants(data.merchant.submerchants);
          }
        } else {
          alert('Failed to fetch merchant details');
          router.push('/admin/merchants');
        }
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
        alert('Failed to fetch merchant details');
        router.push('/admin/merchants');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
    fetchTransactions();
  }, [merchantId, router, fetchTransactions]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_KYC':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'KYC_REJECTED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReceipt = (transaction: Transaction) => {
    const receiptContent = `
      RECEIPT
      -------
      Transaction ID: ${transaction.externalId || transaction.id}
      Amount: ${transaction.currency} ${Number(transaction.amount).toFixed(2)}
      Status: ${transaction.status}
      Payment Method: ${transaction.paymentMethod}
      Customer: ${transaction.customerName || transaction.customerEmail || 'N/A'}
      Date: ${new Date(transaction.createdAt).toLocaleString()}
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.externalId || transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="ADMIN">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading merchant details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!merchant) {
    return null;
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/admin/merchants" 
              className="text-blue-600 hover:text-blue-900 text-sm mb-2 inline-block cursor-pointer"
            >
              ← Back to Merchants
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{merchant.businessName}</h1>
            <p className="text-gray-600 mt-1">{merchant.email}</p>
          </div>
          <Link
            href={`/admin/merchants/${merchant.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer border border-blue-600 hover:border-blue-700"
          >
            Edit Merchant
          </Link>
        </div>

        {/* Transaction Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Transactions</div>
                <div className="text-3xl font-bold text-gray-900">{summary.totalTransactions}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
                <div className="text-3xl font-bold text-green-600">
                  ${summary.totalRevenue.toFixed(2)}
                </div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Completed</div>
                <div className="text-3xl font-bold text-green-600">{summary.completedTransactions}</div>
                <div className="text-xs text-gray-500 mt-1">${summary.completedRevenue.toFixed(2)}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Pending / Failed</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-yellow-600">{summary.pendingTransactions}</div>
                  <div className="text-2xl font-bold text-red-600">/ {summary.failedTransactions}</div>
                </div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Merchant Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Business Name</label>
                  <p className="mt-1 text-sm text-gray-900">{merchant.businessName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Business Type</label>
                  <p className="mt-1 text-sm text-gray-900">{merchant.businessType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Country</label>
                  <p className="mt-1 text-sm text-gray-900">{merchant.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(merchant.status)}`}>
                    {merchant.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Contact Name</label>
                  <p className="mt-1 text-sm text-gray-900">{merchant.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{merchant.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Transaction Fee</label>
                  <p className="mt-1 text-sm text-gray-900">{merchant.transactionFee}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Merchant ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{merchant.id}</p>
                </div>
                {merchant.superMerchantId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Super Merchant ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{merchant.superMerchantId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Timestamps</h2>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(merchant.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(merchant.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="px-6 py-6">
            {loadingTransactions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions
                      .slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage)
                      .map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">{tx.externalId || tx.id.substring(0, 8)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {tx.customerName || tx.customerEmail || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {tx.currency} {Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{tx.paymentMethod}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/transactions?id=${tx.id}`}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => downloadReceipt(tx)}
                              className="text-green-600 hover:text-green-900 cursor-pointer"
                            >
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length > transactionsPerPage && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * transactionsPerPage) + 1} to {Math.min(currentPage * transactionsPerPage, transactions.length)} of {transactions.length} transactions
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / transactionsPerPage)))}
                        disabled={currentPage >= Math.ceil(transactions.length / transactionsPerPage)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submerchants Section */}
        {submerchants.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sub-Merchants</h2>
            </div>
            <div className="px-6 py-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submerchants.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{sub.businessName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{sub.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{sub.businessType}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{sub.country}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(sub.status)}`}>
                            {sub.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link
                            href={`/admin/merchants/${sub.id}`}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
