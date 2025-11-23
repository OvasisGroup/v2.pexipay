'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Transaction {
  id: string;
  amount: string | number;
  status: string;
  customerEmail?: string;
  createdAt: string;
}

interface ChartDataPoint {
  date: string;
  transactions: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [userName] = useState(() => {
    if (typeof window === 'undefined') return 'Admin';
    const token = localStorage.getItem('token');
    if (!token) return 'Admin';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email?.split('@')[0] || 'Admin';
    } catch {
      return 'Admin';
    }
  });
  
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    declinedTransactions: 0,
    successRate: 0,
    totalRevenue: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Get current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);

    // Fetch dashboard stats
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch transactions from last 30 days
        const transactionsRes = await fetch('/api/transactions', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          const transactions: Transaction[] = transactionsData.transactions || [];
          
          // Filter last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const recentTxns = transactions.filter((t: Transaction) => 
            new Date(t.createdAt) >= thirtyDaysAgo
          );

          const successful = recentTxns.filter((t: Transaction) => 
            t.status === 'CAPTURED' || t.status === 'COMPLETED'
          );
          
          const declined = recentTxns.filter((t: Transaction) => 
            t.status === 'FAILED' || t.status === 'CANCELLED'
          );

          const revenue = successful.reduce((sum: number, t: Transaction) => 
            sum + parseFloat(String(t.amount || 0)), 0
          );

          const successRate = recentTxns.length > 0 
            ? (successful.length / recentTxns.length) * 100 
            : 0;

          setStats({
            totalTransactions: recentTxns.length,
            successfulTransactions: successful.length,
            declinedTransactions: declined.length,
            successRate,
            totalRevenue: revenue,
          });

          // Set recent 5 transactions
          setRecentTransactions(transactions.slice(0, 5));

          // Prepare chart data - group by day for last 30 days
          const dailyData: { [key: string]: { transactions: number; revenue: number } } = {};
          
          for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dailyData[dateKey] = { transactions: 0, revenue: 0 };
          }

          recentTxns.forEach((t: Transaction) => {
            const dateKey = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dailyData[dateKey]) {
              dailyData[dateKey].transactions += 1;
              if (t.status === 'CAPTURED' || t.status === 'COMPLETED') {
                dailyData[dateKey].revenue += parseFloat(String(t.amount || 0));
              }
            }
          });

          const formattedChartData: ChartDataPoint[] = Object.entries(dailyData).map(([date, data]) => ({
            date,
            transactions: data.transactions,
            revenue: Math.round(data.revenue * 100) / 100,
          }));

          setChartData(formattedChartData);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-semibold">{userName}</span>! Here&apos;s what&apos;s happening with your business.
          </p>
          {currentTime && (
            <p className="text-sm text-gray-500 mt-2">📅 {currentTime}</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Total Transactions</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</div>
                <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Success</div>
                <div className="text-3xl font-bold text-green-600">{stats.successfulTransactions}</div>
                <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Declined</div>
                <div className="text-3xl font-bold text-red-600">{stats.declinedTransactions}</div>
                <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Success Rate</div>
                <div className="text-3xl font-bold text-blue-600">{stats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume (Last 30 Days)</h3>
            <div className="w-full" style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} width={40} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ color: '#111827', fontWeight: 600 }}
                  />
                  <Bar dataKey="transactions" fill="#3b82f6" name="Transactions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h3>
            <div className="w-full" style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} width={50} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ color: '#111827', fontWeight: 600 }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Revenue ($)"
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500">{recentTransactions.length} transactions</p>
            </div>
            <Link 
              href="/dashboard/transactions"
              className="text-sm text-secondary hover:text-secondary/80 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="p-6">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">💳</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h4>
                <p className="text-gray-600 mb-6">
                  Start accepting payments to see your transaction history here. 
                  Create your first transaction to get started.
                </p>
                <Link
                  href="/test-shop"
                  className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition"
                >
                  Create Payment Link
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((txn: Transaction) => (
                  <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        txn.status === 'CAPTURED' || txn.status === 'COMPLETED' ? 'bg-green-500' : 
                        txn.status === 'FAILED' || txn.status === 'CANCELLED' ? 'bg-red-500' : 
                        'bg-yellow-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900">${parseFloat(String(txn.amount || 0)).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{txn.customerEmail || 'No email'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        txn.status === 'CAPTURED' || txn.status === 'COMPLETED' ? 'text-green-600' : 
                        txn.status === 'FAILED' || txn.status === 'CANCELLED' ? 'text-red-600' : 
                        'text-yellow-600'
                      }`}>
                        {txn.status}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
