'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MerchantFormData {
  businessName: string;
  businessType: string;
  country: string;
  taxId: string;
  transactionFee: number;
  status: string;
}

export default function SuperMerchantMerchantEdit({ merchantId }: { merchantId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<MerchantFormData>({
    businessName: '',
    businessType: 'ECOMMERCE',
    country: 'US',
    taxId: '',
    transactionFee: 2.9,
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchMerchant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
        const merchant = data.merchant;
        setFormData({
          businessName: merchant.businessName,
          businessType: merchant.businessType,
          country: merchant.country,
          taxId: merchant.taxId || '',
          transactionFee: merchant.transactionFee,
          status: merchant.status,
        });
      } else {
        showToast('Failed to load merchant', 'error');
      }
    } catch (error) {
      console.error('Failed to fetch merchant:', error);
      showToast('Failed to load merchant', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/super-merchant/merchants/${merchantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Merchant updated successfully', 'success');
        setTimeout(() => {
          router.push(`/super-merchant/merchants/${merchantId}`);
        }, 1000);
      } else {
        const data = await response.json();
        showToast(data.error || 'Failed to update merchant', 'error');
      }
    } catch (error) {
      console.error('Failed to update merchant:', error);
      showToast('Failed to update merchant', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="SUPER_MERCHANT">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading merchant...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="SUPER_MERCHANT" fullWidth>
      <div className="space-y-6">
        <div>
          <Link 
            href={`/super-merchant/merchants/${merchantId}`}
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
          >
            ← Back to Merchant Details
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Merchant</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Business Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ECOMMERCE">E-commerce</option>
                  <option value="RETAIL">Retail</option>
                  <option value="SERVICES">Services</option>
                  <option value="SAAS">SaaS</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="US"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tax ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.transactionFee}
                  onChange={(e) => setFormData({ ...formData, transactionFee: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING_KYC">Pending KYC</option>
                  <option value="KYC_REJECTED">KYC Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link
              href={`/super-merchant/merchants/${merchantId}`}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
    </DashboardLayout>
  );
}
