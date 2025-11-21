'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import { 
  BanknotesIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface Settlement {
  id: string;
  superMerchantId: string | null;
  merchantId: string | null;
  amount: number;
  currency: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  transactionCount: number;
  feeTotal: number;
  netAmount: number;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  Merchant?: {
    name: string;
    businessName: string;
  };
  SuperMerchant?: {
    name: string;
    businessName: string;
  };
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
}

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
  });

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const offset = (currentPage - 1) * pagination.limit;
    
    const params = new URLSearchParams({
      limit: pagination.limit.toString(),
      offset: offset.toString(),
    });

    if (filter !== 'all') {
      params.append('status', filter);
    }

    try {
      const response = await fetch(`/api/settlements?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettlements(data.settlements || []);
        setPagination({
          total: data.total || 0,
          limit: data.limit || 10,
          offset: data.offset || 0,
        });
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch settlements' }));
        toast.error(error.error || 'Failed to fetch settlements');
      }
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
      toast.error('Failed to fetch settlements');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pagination.limit, filter]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const numAmount = typeof amount === 'number' ? amount : Number(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = {
    totalAmount: settlements.reduce((sum, s) => {
      if (s.status === 'COMPLETED') {
        const amount = typeof s.netAmount === 'number' ? s.netAmount : Number(s.netAmount);
        return sum + amount;
      }
      return sum;
    }, 0),
    completed: settlements.filter(s => s.status === 'COMPLETED').length,
    pending: settlements.filter(s => s.status === 'PENDING' || s.status === 'PROCESSING').length,
    failed: settlements.filter(s => s.status === 'FAILED').length,
    totalTransactions: settlements.reduce((sum, s) => sum + s.transactionCount, 0),
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const exportToCSV = () => {
    try {
      const headers = ['ID', 'Period Start', 'Period End', 'Status', 'Transactions', 'Amount', 'Fees', 'Net Amount', 'Processed Date'];
      const rows = settlements.map(s => [
        s.id,
        formatDate(s.periodStart),
        formatDate(s.periodEnd),
        s.status,
        s.transactionCount,
        s.amount,
        s.feeTotal,
        s.netAmount,
        s.processedAt ? new Date(s.processedAt).toLocaleString() : 'N/A',
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settlements-${new Date().toISOString()}.csv`;
      a.click();
      toast.success(`Exported ${settlements.length} settlements to CSV`);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export settlements');
    }
  };

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BanknotesIcon className="w-8 h-8 text-blue-600" />
              Settlements
            </h1>
            <p className="text-gray-600 mt-1">View and manage payment settlements</p>
          </div>
          <button 
            onClick={exportToCSV}
            disabled={settlements.length === 0}
            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Settled</div>
              <BanknotesIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount, 'USD')}</div>
            <div className="text-xs text-gray-500 mt-1">{stats.completed} completed settlements</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Completed</div>
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-500 mt-1">Successfully processed</div>
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
              <div className="text-sm font-medium text-gray-600">Transactions</div>
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalTransactions}</div>
            <div className="text-xs text-gray-500 mt-1">Total settled</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
              onClick={() => setFilter('PROCESSING')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                filter === 'PROCESSING'
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Processing
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
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading settlements...</p>
            </div>
          ) : settlements.length === 0 ? (
            <div className="text-center py-16 px-4">
              <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Settlements Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {filter === 'all'
                  ? "No settlements have been created yet. Settlements are automatically generated based on your configured payout schedule."
                  : `No settlements match the ${filter.toLowerCase()} status.`}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Settlement Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount & Fees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Processed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {settlements.map((settlement) => (
                      <tr key={settlement.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">{getStatusIcon(settlement.status)}</div>
                            <div>
                              <div className="text-sm font-mono font-semibold text-gray-900">
                                {settlement.id.substring(0, 12)}...
                              </div>
                              {settlement.Merchant && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {settlement.Merchant.businessName}
                                </div>
                              )}
                              {settlement.SuperMerchant && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {settlement.SuperMerchant.businessName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{formatDate(settlement.periodStart)}</div>
                            <div className="text-gray-500">to {formatDate(settlement.periodEnd)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-2xl font-bold text-blue-600">
                            {settlement.transactionCount}
                          </div>
                          <div className="text-xs text-gray-500">transactions</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            {formatAmount(typeof settlement.amount === 'number' ? settlement.amount : Number(settlement.amount), settlement.currency)}
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            Fees: {formatAmount(typeof settlement.feeTotal === 'number' ? settlement.feeTotal : Number(settlement.feeTotal), settlement.currency)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-green-600">
                            {formatAmount(typeof settlement.netAmount === 'number' ? settlement.netAmount : Number(settlement.netAmount), settlement.currency)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(settlement.status)}`}>
                            {settlement.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {settlement.processedAt ? (
                            <div>
                              <div className="text-sm text-gray-900">
                                {new Date(settlement.processedAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(settlement.processedAt).toLocaleTimeString()}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not processed</span>
                          )}
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
                  of <span className="font-medium">{pagination.total}</span> settlements
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
      </div>
    </DashboardLayout>
  );
}
