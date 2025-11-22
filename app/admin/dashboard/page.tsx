'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch users
        const usersRes = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setStats(prev => ({ ...prev, totalUsers: usersData.users?.length || 0 }));
        }

        // Fetch merchants
        const merchantsRes = await fetch('/api/admin/merchants', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (merchantsRes.ok) {
          const merchantsData = await merchantsRes.json();
          setStats(prev => ({ ...prev, totalMerchants: merchantsData.merchants?.length || 0 }));
        }

        // Fetch transactions
        const transactionsRes = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          const transactions = transactionsData.transactions || [];
          const revenue = transactions
            .filter((t: { status: string }) => t.status === 'COMPLETED')
            .reduce((sum: number, t: { amount: string | number }) => sum + parseFloat(String(t.amount)), 0);
          
          setStats(prev => ({
            ...prev,
            totalTransactions: transactions.length,
            totalRevenue: revenue,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and monitor your payment platform</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600 mt-2">Platform users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Merchants</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalMerchants}</div>
            <div className="text-sm text-gray-600 mt-2">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Transactions</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</div>
            <div className="text-sm text-gray-600 mt-2">Total processed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Volume</div>
            <div className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-gray-600 mt-2">Platform wide</div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
            <div className="space-y-3">
              <Link
                href="/admin/users"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition"
              >
                <div className="text-2xl mr-3">👥</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">All Users</div>
                  <div className="text-sm text-gray-600">Manage system users</div>
                </div>
              </Link>
              <Link
                href="/admin/merchants"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition"
              >
                <div className="text-2xl mr-3">🏪</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Merchants</div>
                  <div className="text-sm text-gray-600">Manage all merchants</div>
                </div>
              </Link>
              <Link
                href="/admin/kyc"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition"
              >
                <div className="text-2xl mr-3">📄</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">KYC Review</div>
                  <div className="text-sm text-gray-600">Review pending KYC</div>
                </div>
              </Link>
            </div>
          </div>

          {/* System Operations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Operations</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/transactions"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition"
              >
                <div className="text-2xl mr-3">💳</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Transactions</div>
                  <div className="text-sm text-gray-600">Monitor all transactions</div>
                </div>
              </Link>
              <Link
                href="/admin/fraud"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition"
              >
                <div className="text-2xl mr-3">🛡️</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Fraud Detection</div>
                  <div className="text-sm text-gray-600">Review fraud cases</div>
                </div>
              </Link>
              <Link
                href="/admin/settlements"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition"
              >
                <div className="text-2xl mr-3">💰</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Settlements</div>
                  <div className="text-sm text-gray-600">Settlement processing</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Audit Log</h2>
            <Link href="/admin/audit" className="text-sm text-blue-600 hover:text-blue-500">
              View All →
            </Link>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">System Activity</div>
                  <div className="text-sm text-gray-600">Check audit logs for details</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Recent</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
