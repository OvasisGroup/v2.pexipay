'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

interface Merchant {
  id: string;
  businessName: string;
  businessType: string;
  country: string;
  taxId: string | null;
  status: string;
  transactionFee: number;
  createdAt: string;
  updatedAt: string;
  User: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
}

interface KYCDocument {
  id: string;
  documentType: string;
  documentUrl: string;
  status: string;
  uploadedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

interface Transaction {
  id: string;
  amount: number | string;
  currency: string;
  status: string;
  customerEmail: string | null;
  customerName: string | null;
  createdAt: string;
}

interface TransactionStats {
  totalTransactions: number;
  successfulTransactions: number;
  totalRevenue: number;
  successRate: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function SuperMerchantMerchantDetail({ merchantId }: { merchantId: string }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    successfulTransactions: 0,
    totalRevenue: 0,
    successRate: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingKyc, setLoadingKyc] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    fetchMerchant();
    fetchKycDocuments();
    fetchTransactions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

  const fetchMerchant = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/super-merchant/merchants/${merchantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMerchant(data.merchant);
      }
    } catch (error) {
      console.error('Failed to fetch merchant:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKycDocuments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/super-merchant/merchants/${merchantId}/kyc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setKycDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Failed to fetch KYC documents:', error);
    } finally {
      setLoadingKyc(false);
    }
  };

  const fetchTransactions = async (page: number) => {
    setLoadingTransactions(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `/api/super-merchant/merchants/${merchantId}/transactions?page=${page}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchTransactions(newPage);
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'CAPTURED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateReceipt = (transaction: Transaction) => {
    const receiptContent = `
PEXIPAY RECEIPT
${'-'.repeat(50)}

Transaction ID: ${transaction.id}
Amount: ${transaction.currency} ${parseFloat(String(transaction.amount)).toFixed(2)}
Status: ${transaction.status}
Customer: ${transaction.customerName || 'N/A'}
Email: ${transaction.customerEmail || 'N/A'}
Date: ${new Date(transaction.createdAt).toLocaleString()}
Merchant: ${merchant?.businessName}

${'-'.repeat(50)}
Thank you for your business!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_KYC':
        return 'bg-yellow-100 text-yellow-800';
      case 'KYC_REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="SUPER_MERCHANT">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading merchant details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!merchant) {
    return (
      <DashboardLayout requiredRole="SUPER_MERCHANT">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Merchant Not Found</h2>
          <Link href="/super-merchant/merchants" className="text-blue-600 hover:text-blue-700">
            Back to Merchants
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const user = merchant.User[0];

  return (
    <DashboardLayout requiredRole="SUPER_MERCHANT">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link 
              href="/super-merchant/merchants"
              className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
            >
              ← Back to Merchants
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{merchant.businessName}</h1>
          </div>
          <Link
            href={`/super-merchant/merchants/${merchantId}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Merchant
          </Link>
        </div>

        {/* Status Badge */}
        <div>
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(merchant.status)}`}>
            {merchant.status.replace('_', ' ')}
          </span>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Total Transactions</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Successful</div>
                <div className="text-3xl font-bold text-green-600">{stats.successfulTransactions}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Total Revenue</div>
                <div className="text-3xl font-bold text-primary">${Number(stats.totalRevenue ?? 0).toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Success Rate</div>
                <div className="text-3xl font-bold text-secondary">{stats.successRate.toFixed(1)}%</div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Merchant Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{merchant.businessName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{merchant.businessType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900">{merchant.country}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{merchant.taxId || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction Fee</dt>
                <dd className="mt-1 text-sm text-gray-900">{merchant.transactionFee}%</dd>
              </div>
            </dl>
          </div>

          {/* Contact Information */}
          {user && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User Status</dt>
                  <dd className="mt-1">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(merchant.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(merchant.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        {/* KYC Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KYC Documents</h2>
          {loadingKyc ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading documents...</p>
            </div>
          ) : kycDocuments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-3">📄</div>
              <p className="text-gray-600">No KYC documents uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewed At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kycDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatDocumentType(doc.documentType)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDocumentStatusBadge(doc.status)}`}>
                          {doc.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.reviewedAt ? new Date(doc.reviewedAt).toLocaleString() : 'Not reviewed'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Document
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {kycDocuments.some(doc => doc.status === 'REJECTED' && doc.rejectionReason) && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Rejection Reasons:</h3>
                  {kycDocuments
                    .filter(doc => doc.status === 'REJECTED' && doc.rejectionReason)
                    .map((doc) => (
                      <div key={doc.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-red-900">{formatDocumentType(doc.documentType)}</p>
                        <p className="text-sm text-red-700 mt-1">{doc.rejectionReason}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">{pagination.totalCount} total transactions</p>
          </div>

          <div className="p-6">
            {loadingTransactions ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">💳</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h4>
                <p className="text-gray-600">This merchant hasn&apos;t processed any transactions yet.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((txn) => (
                        <tr key={txn.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900">{txn.id.substring(0, 8)}...</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {txn.currency} {parseFloat(String(txn.amount)).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{txn.customerName || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{txn.customerEmail || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionStatusBadge(txn.status)}`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(txn.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/transactions/${txn.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => generateReceipt(txn)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
                          </span>{' '}
                          of <span className="font-medium">{pagination.totalCount}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pageNum === pagination.page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/super-merchant/merchants/${merchantId}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Merchant
            </Link>
            <Link
              href="/super-merchant/merchants"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
