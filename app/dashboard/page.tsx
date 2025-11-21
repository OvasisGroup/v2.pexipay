'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalTransactions: number;
  totalAmount: number;
  pendingSettlement: number;
  activeApiKeys: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch this from the API
    // For now, show placeholder data
    setTimeout(() => {
      setStats({
        totalTransactions: 0,
        totalAmount: 0,
        pendingSettlement: 0,
        activeApiKeys: 0,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <nav className="flex gap-4">
              <Link href="/dashboard" className="text-blue-600 font-semibold">
                Dashboard
              </Link>
              <Link href="/dashboard/transactions" className="text-gray-600 hover:text-gray-900">
                Transactions
              </Link>
              <Link href="/dashboard/api-keys" className="text-gray-600 hover:text-gray-900">
                API Keys
              </Link>
              <Link href="/dashboard/settlements" className="text-gray-600 hover:text-gray-900">
                Settlements
              </Link>
              <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900">
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalTransactions || 0}</p>
            <p className="text-sm text-green-600 mt-2">↑ View all</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Volume</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${(stats?.totalAmount || 0).toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-2">All time</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Settlement</h3>
            <p className="text-3xl font-bold text-gray-900">
              ${(stats?.pendingSettlement || 0).toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 mt-2">Next settlement: Daily</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active API Keys</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.activeApiKeys || 0}</p>
            <p className="text-sm text-gray-600 mt-2">
              <Link href="/dashboard/api-keys" className="text-blue-600 hover:underline">
                Manage keys
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/api-keys?action=create"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
            >
              <div className="text-2xl mb-2">🔑</div>
              <h3 className="font-semibold text-gray-900">Generate API Key</h3>
              <p className="text-sm text-gray-600">Create a new API key for integration</p>
            </Link>
            <Link
              href="/dashboard/transactions?action=create"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
            >
              <div className="text-2xl mb-2">💳</div>
              <h3 className="font-semibold text-gray-900">Test Payment</h3>
              <p className="text-sm text-gray-600">Create a test transaction</p>
            </Link>
            <Link
              href="/docs/api"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
            >
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-gray-900">API Documentation</h3>
              <p className="text-sm text-gray-600">View integration guides</p>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Link href="/dashboard/transactions" className="text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="text-center py-12 text-gray-500">
            <p>No transactions yet</p>
            <p className="text-sm mt-2">Start by creating your first payment or generating an API key</p>
          </div>
        </div>
      </main>
    </div>
  );
}
