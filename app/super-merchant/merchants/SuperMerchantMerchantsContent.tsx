'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BuildingStorefrontIcon, CheckCircleIcon, ClockIcon, XCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
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
}

export default function SuperMerchantMerchantsContent() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMerchants = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/super-merchant/merchants', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMerchants(data.merchants || []);
      } else {
        showToast('Failed to fetch merchants', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
      showToast('Failed to fetch merchants', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const handleDeleteMerchant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this merchant? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/super-merchant/merchants/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToast('Merchant deleted successfully', 'success');
        fetchMerchants();
      } else {
        showToast('Failed to delete merchant', 'error');
      }
    } catch (error) {
      console.error('Failed to delete merchant:', error);
      showToast('Failed to delete merchant', 'error');
    }
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

  const filteredMerchants = merchants.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  return (
    <DashboardLayout requiredRole="SUPER_MERCHANT">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sub-Merchants</h1>
          <Link
            href="/super-merchant/merchants/new"
            className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Sub-Merchant
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Total Merchants</div>
                <div className="text-3xl font-bold text-gray-900">{merchants.length}</div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                <BuildingStorefrontIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Active</div>
                <div className="text-3xl font-bold text-green-600">
                  {merchants.filter(m => m.status === 'ACTIVE').length}
                </div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Pending KYC</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {merchants.filter(m => m.status === 'PENDING_KYC').length}
                </div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Suspended</div>
                <div className="text-3xl font-bold text-red-600">
                  {merchants.filter(m => m.status === 'SUSPENDED').length}
                </div>
              </div>
              <div className="shrink-0 w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircleIcon className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Merchants
              </button>
              <button
                onClick={() => setFilter('ACTIVE')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'ACTIVE'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('PENDING_KYC')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'PENDING_KYC'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending KYC
              </button>
              <button
                onClick={() => setFilter('SUSPENDED')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'SUSPENDED'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Suspended
              </button>
            </div>
          </div>

          {/* Merchants Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading merchants...</p>
            </div>
          ) : filteredMerchants.length === 0 ? (
            <div className="text-center py-12">
              <BuildingStorefrontIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No merchants found</h3>
              <p className="text-gray-600 mb-6">
                Get started by adding your first sub-merchant.
              </p>
              <Link
                href="/super-merchant/merchants/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Sub-Merchant
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMerchants.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-lg">
                              {m.businessName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{m.businessName}</div>
                            <div className="text-sm text-gray-500">{m.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{m.name}</div>
                        <div className="text-sm text-gray-500">{m.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {m.businessType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(m.status)}`}>
                          {m.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {m.transactionFee}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/super-merchant/merchants/${m.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer border border-blue-600 hover:border-blue-900 px-3 py-1 rounded inline-block"
                        >
                          View
                        </Link>
                        <Link 
                          href={`/super-merchant/merchants/${m.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 mr-3 cursor-pointer border border-gray-600 hover:border-gray-900 px-3 py-1 rounded inline-block"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteMerchant(m.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer border border-red-600 hover:border-red-900 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
