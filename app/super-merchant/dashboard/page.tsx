'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function SuperMerchantDashboard() {
  return (
    <DashboardLayout requiredRole="SUPER_MERCHANT">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Commission</div>
            <div className="text-3xl font-bold text-gray-900">$0.00</div>
            <div className="text-sm text-green-600 mt-2">+0% from last month</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Sub-Merchants</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-2">Active merchants</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Volume</div>
            <div className="text-3xl font-bold text-gray-900">$0.00</div>
            <div className="text-sm text-gray-600 mt-2">All merchants</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Pending Settlement</div>
            <div className="text-3xl font-bold text-gray-900">$0.00</div>
            <div className="text-sm text-gray-600 mt-2">Next payout in N/A</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link
              href="/test-shop"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <div className="text-3xl mr-4">🛒</div>
              <div>
                <div className="font-semibold text-gray-900">Test Shop</div>
                <div className="text-sm text-gray-600">Try demo payment flow</div>
              </div>
            </Link>
            <Link
              href="/super-merchant/merchants"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <div className="text-3xl mr-4">🏪</div>
              <div>
                <div className="font-semibold text-gray-900">Sub-Merchants</div>
                <div className="text-sm text-gray-600">Manage your merchants</div>
              </div>
            </Link>
            <Link
              href="/super-merchant/api-keys"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <div className="text-3xl mr-4">🔑</div>
              <div>
                <div className="font-semibold text-gray-900">API Keys</div>
                <div className="text-sm text-gray-600">Manage API credentials</div>
              </div>
            </Link>
            <Link
              href="/docs/api"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <div className="text-3xl mr-4">📖</div>
              <div>
                <div className="font-semibold text-gray-900">API Docs</div>
                <div className="text-sm text-gray-600">Integration guide</div>
              </div>
            </Link>
            <Link
              href="/super-merchant/reports"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition"
            >
              <div className="text-3xl mr-4">📊</div>
              <div>
                <div className="font-semibold text-gray-900">Reports</div>
                <div className="text-sm text-gray-600">View analytics & reports</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            No recent activity to display
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-3">🚀 Super-Merchant Features</h2>
          <div className="space-y-3 text-sm text-indigo-800">
            <div className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Onboard and manage unlimited sub-merchants</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Earn commissions on all sub-merchant transactions</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Access consolidated reporting across all merchants</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span>Manage KYC verification for your sub-merchants</span>
            </div>
          </div>
          <Link
            href="/super-merchant/documentation"
            className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
