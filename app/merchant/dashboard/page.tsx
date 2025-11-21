'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function MerchantDashboard() {
  return (
    <DashboardLayout requiredRole="MERCHANT">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-gray-900">$0.00</div>
            <div className="text-sm text-green-600 mt-2">+0% from last month</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Transactions</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-2">No transactions yet</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Success Rate</div>
            <div className="text-3xl font-bold text-gray-900">0%</div>
            <div className="text-sm text-gray-600 mt-2">N/A</div>
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
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="text-3xl mr-4">🏪</div>
              <div>
                <div className="font-semibold text-gray-900">Test Shop</div>
                <div className="text-sm text-gray-600">Try demo payment flow</div>
              </div>
            </Link>
            <Link
              href="/merchant/api-keys"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="text-3xl mr-4">🔑</div>
              <div>
                <div className="font-semibold text-gray-900">API Keys</div>
                <div className="text-sm text-gray-600">Manage your API credentials</div>
              </div>
            </Link>
            <Link
              href="/docs/api"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="text-3xl mr-4">📖</div>
              <div>
                <div className="font-semibold text-gray-900">API Docs</div>
                <div className="text-sm text-gray-600">Integration guide</div>
              </div>
            </Link>
            <Link
              href="/merchant/transactions"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="text-3xl mr-4">💳</div>
              <div>
                <div className="font-semibold text-gray-900">Transactions</div>
                <div className="text-sm text-gray-600">View transaction history</div>
              </div>
            </Link>
            <Link
              href="/merchant/settings"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="text-3xl mr-4">⚙️</div>
              <div>
                <div className="font-semibold text-gray-900">Settings</div>
                <div className="text-sm text-gray-600">Configure your account</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">🚀 Get Started with PexiPay</h2>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Generate your API keys in the API Keys section</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Review the <Link href="/docs/api" className="underline font-semibold hover:text-blue-600">API Documentation</Link> to understand the integration</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Complete KYC verification to enable payment processing</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>Integrate PexiPay API into your application</span>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">5.</span>
              <span>Start accepting payments and track your transactions</span>
            </div>
          </div>
          <Link
            href="/merchant/documentation"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
