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

export default function SuperMerchantMerchantDetail({ merchantId }: { merchantId: string }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMerchant();
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
