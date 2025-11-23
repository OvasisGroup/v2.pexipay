'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface SuperMerchant {
  id: string;
  name: string;
  businessName: string;
  email: string;
}

interface Settlement {
  id: string;
  superMerchantId: string;
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
  SuperMerchant: SuperMerchant | null;
}

export default function SettlementsContent() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    superMerchantId: '',
    amount: '',
    currency: 'USD',
    periodStart: '',
    periodEnd: '',
    transactionCount: '',
    feeTotal: '',
    netAmount: '',
  });
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const settlementsPerPage = 10;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSettlements = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/settlements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettlements(data.settlements || []);
      } else {
        showToast('Failed to fetch settlements', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
      showToast('Failed to fetch settlements', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const updateSettlementStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/admin/settlements/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        showToast('Settlement status updated successfully', 'success');
        fetchSettlements();
      } else {
        showToast('Failed to update settlement status', 'error');
      }
    } catch (error) {
      console.error('Failed to update settlement:', error);
      showToast('Failed to update settlement status', 'error');
    }
  };

  const initiateSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/settlements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Settlement initiated successfully', 'success');
        setShowModal(false);
        setFormData({
          superMerchantId: '',
          amount: '',
          currency: 'USD',
          periodStart: '',
          periodEnd: '',
          transactionCount: '',
          feeTotal: '',
          netAmount: '',
        });
        fetchSettlements();
      } else {
        const error = await response.json();
        showToast(`Failed to initiate settlement: ${error.error}`, 'error');
      }
    } catch (error) {
      console.error('Failed to initiate settlement:', error);
      showToast('Failed to initiate settlement', 'error');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSettlements = settlements.filter(s => 
    filter === 'ALL' ? true : s.status === filter
  );

  const paginatedSettlements = filteredSettlements.slice(
    (currentPage - 1) * settlementsPerPage,
    currentPage * settlementsPerPage
  );

  const totalAmount = filteredSettlements.reduce((sum, s) => sum + Number(s.amount), 0);
  const totalNetAmount = filteredSettlements.reduce((sum, s) => sum + Number(s.netAmount), 0);
  const totalFees = filteredSettlements.reduce((sum, s) => sum + Number(s.feeTotal), 0);

  if (loading) {
    return (
      <DashboardLayout requiredRole="ADMIN">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settlements...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Super Merchant Settlements</h1>
            <p className="text-gray-600 mt-1">Manage and process super merchant settlements</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Initiate Settlement
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Settlements</div>
                <div className="text-3xl font-bold text-gray-900">{filteredSettlements.length}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-blue-600">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Net Amount</div>
                <div className="text-3xl font-bold text-green-600">
                  ${totalNetAmount.toFixed(2)}
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
                <div className="text-sm font-medium text-gray-600 mb-1">Total Fees</div>
                <div className="text-3xl font-bold text-gray-600">
                  ${totalFees.toFixed(2)}
                </div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Settlements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Settlement ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Super Merchant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No settlements found
                    </td>
                  </tr>
                ) : (
                  paginatedSettlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {settlement.id.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {settlement.SuperMerchant?.businessName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {settlement.SuperMerchant?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{new Date(settlement.periodStart).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(settlement.periodEnd).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {settlement.currency} {Number(settlement.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {settlement.currency} {Number(settlement.feeTotal).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {settlement.currency} {Number(settlement.netAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {settlement.transactionCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(settlement.status)}`}>
                          {settlement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {settlement.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateSettlementStatus(settlement.id, 'PROCESSING')}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer"
                              >
                                Process
                              </button>
                              <button
                                onClick={() => updateSettlementStatus(settlement.id, 'COMPLETED')}
                                className="text-green-600 hover:text-green-900 cursor-pointer"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => updateSettlementStatus(settlement.id, 'FAILED')}
                                className="text-red-600 hover:text-red-900 cursor-pointer"
                              >
                                Fail
                              </button>
                            </>
                          )}
                          {settlement.status === 'PROCESSING' && (
                            <>
                              <button
                                onClick={() => updateSettlementStatus(settlement.id, 'COMPLETED')}
                                className="text-green-600 hover:text-green-900 cursor-pointer"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => updateSettlementStatus(settlement.id, 'FAILED')}
                                className="text-red-600 hover:text-red-900 cursor-pointer"
                              >
                                Fail
                              </button>
                            </>
                          )}
                          {(settlement.status === 'COMPLETED' || settlement.status === 'FAILED') && (
                            <span className="text-gray-400">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredSettlements.length > settlementsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * settlementsPerPage) + 1} to{' '}
                {Math.min(currentPage * settlementsPerPage, filteredSettlements.length)} of{' '}
                {filteredSettlements.length} settlements
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredSettlements.length / settlementsPerPage)))}
                  disabled={currentPage >= Math.ceil(filteredSettlements.length / settlementsPerPage)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Initiate Settlement Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Initiate New Settlement</h2>
              </div>
              <form onSubmit={initiateSettlement} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Super Merchant ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.superMerchantId}
                    onChange={(e) => setFormData({ ...formData, superMerchantId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter super merchant ID"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Period Start
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.periodStart}
                      onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Period End
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.periodEnd}
                      onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction Count
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.transactionCount}
                      onChange={(e) => setFormData({ ...formData, transactionCount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fee Total
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.feeTotal}
                      onChange={(e) => setFormData({ ...formData, feeTotal: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Net Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.netAmount}
                    onChange={(e) => setFormData({ ...formData, netAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Initiate Settlement
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            {toast.message}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
