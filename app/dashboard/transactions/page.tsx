'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon, 
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Transaction {
  id: string;
  externalId: string | null;
  amount: number;
  currency: string;
  status: string;
  merchantId: string;
  customerEmail: string | null;
  customerName: string | null;
  customerIp: string | null;
  paymentMethod: string;
  fraudScore: number | null;
  fraudStatus: string | null;
  circoFlowsId: string | null;
  circoFlowsStatus: string | null;
  requires3DS: boolean;
  threeDSStatus: string | null;
  merchantFee: number;
  superMerchantFee: number;
  pspFee: number;
  netAmount: number;
  metadata: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const offset = (currentPage - 1) * pagination.limit;
    
    try {
      const response = await fetch(`/api/transactions?limit=${pagination.limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setPagination({
          total: data.total || 0,
          limit: data.limit || 20,
          offset: data.offset || 0,
        });
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch transactions' }));
        toast.error(error.error || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pagination.limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, filter]);

  const handleViewDetails = async (transaction: Transaction) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/payments/${transaction.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedTransaction(data.transaction);
        setShowDetailsModal(true);
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch transaction details' }));
        toast.error(error.error || 'Failed to fetch transaction details');
      }
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);
      toast.error('Failed to fetch transaction details');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCEEDED':
      case 'CAPTURED':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'PENDING':
      case 'PROCESSING':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'FAILED':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCEEDED':
      case 'CAPTURED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFraudBadgeColor = (fraudStatus: string | null, fraudScore: number | null) => {
    if (!fraudStatus) return '';
    if (fraudStatus === 'BLOCKED') return 'bg-red-100 text-red-800 border-red-200';
    if (fraudStatus === 'REVIEW' || (fraudScore && fraudScore > 70)) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = !searchQuery || 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.externalId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: transactions.reduce((sum, t) => {
      if (t.status === 'COMPLETED' || t.status === 'SUCCEEDED' || t.status === 'CAPTURED') {
        const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount);
        return sum + amount;
      }
      return sum;
    }, 0),
    completed: transactions.filter(t => t.status === 'COMPLETED' || t.status === 'SUCCEEDED' || t.status === 'CAPTURED').length,
    pending: transactions.filter(t => t.status === 'PENDING' || t.status === 'PROCESSING').length,
    failed: transactions.filter(t => t.status === 'FAILED').length,
    refunded: transactions.filter(t => t.status === 'REFUNDED').length,
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const exportToCSV = () => {
    try {
      const headers = ['ID', 'Date', 'Customer', 'Email', 'Amount', 'Status', 'Payment Method', 'Fraud Score'];
      const rows = filteredTransactions.map(t => [
        t.id,
        new Date(t.createdAt).toLocaleString(),
        t.customerName || '',
        t.customerEmail || '',
        t.amount,
        t.status,
        t.paymentMethod,
        t.fraudScore || '',
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString()}.csv`;
      a.click();
      toast.success(`Exported ${filteredTransactions.length} transactions to CSV`);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export transactions');
    }
  };

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all payment transactions</p>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Revenue</div>
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatAmount(stats.total, 'USD')}</div>
            <div className="text-xs text-gray-500 mt-1">{pagination.total} total transactions</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Completed</div>
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-500 mt-1">Successful payments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Pending</div>
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-500 mt-1">In progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Failed</div>
              <XCircleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-xs text-gray-500 mt-1">Unsuccessful</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Refunded</div>
              <ArrowPathIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.refunded}</div>
            <div className="text-xs text-gray-500 mt-1">Money returned</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, customer, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('COMPLETED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                  filter === 'COMPLETED'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                  filter === 'PENDING'
                    ? 'bg-yellow-600 text-white border-yellow-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('FAILED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                  filter === 'FAILED'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Failed
              </button>
              <button
                onClick={() => setFilter('REFUNDED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                  filter === 'REFUNDED'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Refunded
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-gray-400 text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {filter === 'all' && !searchQuery
                  ? "You haven't processed any transactions yet. Start accepting payments to see them here."
                  : `No transactions match your current filters.`}
              </p>
              {filter === 'all' && !searchQuery && (
                <Link
                  href="/test-shop"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Try Test Shop
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount & Fees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">{getStatusIcon(t.status)}</div>
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                {t.id.substring(0, 8)}...
                              </div>
                              {t.externalId && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  Ext: {t.externalId}
                                </div>
                              )}
                              {t.circoFlowsId && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  CF: {t.circoFlowsId.substring(0, 12)}...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {t.customerName || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">{t.customerEmail || 'No email'}</div>
                          {t.customerIp && (
                            <div className="text-xs text-gray-400 mt-0.5">IP: {t.customerIp}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            {formatAmount(t.amount, t.currency)}
                          </div>
                          <div className="text-xs text-gray-500 space-y-0.5 mt-1">
                            <div>Merchant Fee: {formatAmount(t.merchantFee, t.currency)}</div>
                            <div>Net: {formatAmount(t.netAmount, t.currency)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {t.paymentMethod}
                            </span>
                          </div>
                          {t.requires3DS && (
                            <div className="flex items-center text-xs text-blue-600 mt-1">
                              <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                              3DS: {t.threeDSStatus || 'Required'}
                            </div>
                          )}
                          {t.fraudScore !== null && t.fraudScore > 0 && (
                            <div className={`inline-flex items-center text-xs mt-1 px-2 py-0.5 rounded-full border ${getFraudBadgeColor(t.fraudStatus, t.fraudScore)}`}>
                              <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                              Fraud: {t.fraudScore}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(t.status)}`}>
                            {t.status}
                          </span>
                          {t.circoFlowsStatus && t.circoFlowsStatus !== t.status && (
                            <div className="text-xs text-gray-500 mt-1">
                              CF: {t.circoFlowsStatus}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(t.createdAt).toLocaleTimeString()}
                          </div>
                          {t.processedAt && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              Processed: {new Date(t.processedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => handleViewDetails(t)}
                            className="flex items-center text-blue-600 hover:text-blue-900 font-medium"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{pagination.offset + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.offset + pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> transactions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Transaction Details Modal */}
        {showDetailsModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Transaction Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Transaction Information</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs text-gray-500">ID</dt>
                        <dd className="text-sm font-mono text-gray-900">{selectedTransaction.id}</dd>
                      </div>
                      {selectedTransaction.externalId && (
                        <div>
                          <dt className="text-xs text-gray-500">External ID</dt>
                          <dd className="text-sm font-mono text-gray-900">{selectedTransaction.externalId}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-xs text-gray-500">Status</dt>
                        <dd>
                          <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full border ${getStatusBadgeColor(selectedTransaction.status)}`}>
                            {selectedTransaction.status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Created</dt>
                        <dd className="text-sm text-gray-900">{new Date(selectedTransaction.createdAt).toLocaleString()}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Information</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs text-gray-500">Name</dt>
                        <dd className="text-sm text-gray-900">{selectedTransaction.customerName || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Email</dt>
                        <dd className="text-sm text-gray-900">{selectedTransaction.customerEmail || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">IP Address</dt>
                        <dd className="text-sm font-mono text-gray-900">{selectedTransaction.customerIp || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Payment Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="text-sm font-bold text-gray-900">{formatAmount(selectedTransaction.amount, selectedTransaction.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Merchant Fee</span>
                      <span className="text-red-600">-{formatAmount(selectedTransaction.merchantFee, selectedTransaction.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Super Merchant Fee</span>
                      <span className="text-red-600">-{formatAmount(selectedTransaction.superMerchantFee, selectedTransaction.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">PSP Fee</span>
                      <span className="text-red-600">-{formatAmount(selectedTransaction.pspFee, selectedTransaction.currency)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between">
                      <span className="text-sm font-semibold text-gray-900">Net Amount</span>
                      <span className="text-sm font-bold text-green-600">{formatAmount(selectedTransaction.netAmount, selectedTransaction.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Fraud & Security */}
                {(selectedTransaction.fraudScore !== null || selectedTransaction.requires3DS) && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Fraud & Security</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTransaction.fraudScore !== null && (
                        <div>
                          <dt className="text-xs text-gray-500">Fraud Score</dt>
                          <dd className="text-2xl font-bold text-gray-900">{selectedTransaction.fraudScore}</dd>
                          <dd className={`text-xs mt-1 ${getFraudBadgeColor(selectedTransaction.fraudStatus, selectedTransaction.fraudScore)}`}>
                            {selectedTransaction.fraudStatus}
                          </dd>
                        </div>
                      )}
                      {selectedTransaction.requires3DS && (
                        <div>
                          <dt className="text-xs text-gray-500">3D Secure</dt>
                          <dd className="text-sm font-semibold text-blue-600">Required</dd>
                          <dd className="text-xs text-gray-500 mt-1">
                            Status: {selectedTransaction.threeDSStatus || 'Pending'}
                          </dd>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {selectedTransaction.metadata && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Metadata</h3>
                    <pre className="bg-gray-50 rounded-lg p-4 text-xs overflow-x-auto">
                      {JSON.stringify(JSON.parse(selectedTransaction.metadata), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
