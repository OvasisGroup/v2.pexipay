'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  amount: string | number;
  status: string;
  customerEmail?: string;
  createdAt: string;
  merchantId: string;
}

interface ChartDataPoint {
  date: string;
  transactions: number;
  revenue: number;
  commission: number;
}

export default function SuperMerchantDashboard() {
  const [userName] = useState(() => {
    if (typeof window === 'undefined') return 'Super Merchant';
    const token = localStorage.getItem('token');
    if (!token) return 'Super Merchant';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email?.split('@')[0] || 'Super Merchant';
    } catch {
      return 'Super Merchant';
    }
  });

  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    successfulTransactions: 0,
    declinedTransactions: 0,
    successRate: 0,
    totalRevenue: 0,
    totalCommission: 0,
    subMerchantCount: 0,
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
        // Fetch sub-merchants count
        const merchantsRes = await fetch('/api/super-merchant/merchants', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        let subMerchantCount = 0;
        if (merchantsRes.ok) {
          const merchantsData = await merchantsRes.json();
          subMerchantCount = merchantsData.merchants?.length || 0;
        }

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

          // Assume 2% commission rate for super merchant
          const commission = revenue * 0.02;

          const successRate = recentTxns.length > 0 
            ? (successful.length / recentTxns.length) * 100 
            : 0;

          setStats({
            totalTransactions: recentTxns.length,
            successfulTransactions: successful.length,
            declinedTransactions: declined.length,
            successRate,
            totalRevenue: revenue,
            totalCommission: commission,
            subMerchantCount,
          });

          // Set recent 5 transactions
          setRecentTransactions(transactions.slice(0, 5));

          // Prepare chart data - group by day for last 30 days
          const dailyData: { [key: string]: { transactions: number; revenue: number; commission: number } } = {};
          
          for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dailyData[dateKey] = { transactions: 0, revenue: 0, commission: 0 };
          }

          recentTxns.forEach((t: Transaction) => {
            const dateKey = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dailyData[dateKey]) {
              dailyData[dateKey].transactions += 1;
              if (t.status === 'CAPTURED' || t.status === 'COMPLETED') {
                const amount = parseFloat(String(t.amount || 0));
                dailyData[dateKey].revenue += amount;
                dailyData[dateKey].commission += amount * 0.02;
              }
            }
          });

          const formattedChartData: ChartDataPoint[] = Object.entries(dailyData).map(([date, data]) => ({
            date,
            transactions: data.transactions,
            revenue: Math.round(data.revenue * 100) / 100,
            commission: Math.round(data.commission * 100) / 100,
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
    <DashboardLayout requiredRole="SUPER_MERCHANT">
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
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="text-sm font-medium text-gray-600 mb-2">Sub-Merchants</div>
                <div className="text-3xl font-bold text-secondary">{stats.subMerchantCount}</div>
                <div className="text-sm text-gray-500 mt-2">Active merchants</div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Commission Earned</div>
                <div className="text-3xl font-bold text-primary">${stats.totalCommission.toFixed(2)}</div>
                <div className="text-sm text-gray-500 mt-2">Last 30 days (2%)</div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <Bar dataKey="transactions" fill="oklch(0.55 0.24 27)" name="Transactions" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Earned (Last 30 Days)</h3>
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
                    dataKey="commission" 
                    stroke="oklch(0.32 0.1 250)" 
                    strokeWidth={2}
                    name="Commission ($)"
                    dot={{ fill: 'oklch(0.32 0.1 250)', r: 3 }}
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
                  Your sub-merchants haven&apos;t made any transactions yet. 
                  Share the integration guide with them to get started.
                </p>
                <Link
                  href="/super-merchant/merchants"
                  className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition"
                >
                  Manage Sub-Merchants
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link
              href="/test-shop"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition"
            >
              <div className="text-3xl mr-4">🛒</div>
              <div>
                <div className="font-semibold text-gray-900">Test Shop</div>
                <div className="text-sm text-gray-600">Try demo payment flow</div>
              </div>
            </Link>
            <Link
              href="/super-merchant/merchants"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition"
            >
              <div className="text-3xl mr-4">🏪</div>
              <div>
                <div className="font-semibold text-gray-900">Sub-Merchants</div>
                <div className="text-sm text-gray-600">Manage your merchants</div>
              </div>
            </Link>
            <Link
              href="/super-merchant/api-keys"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition"
            >
              <div className="text-3xl mr-4">🔑</div>
              <div>
                <div className="font-semibold text-gray-900">API Keys</div>
                <div className="text-sm text-gray-600">Manage API credentials</div>
              </div>
            </Link>
            <Link
              href="/docs/api"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition"
            >
              <div className="text-3xl mr-4">📖</div>
              <div>
                <div className="font-semibold text-gray-900">API Docs</div>
                <div className="text-sm text-gray-600">Integration guide</div>
              </div>
            </Link>
            <Link
              href="/super-merchant/reports"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-secondary hover:bg-secondary/5 transition"
            >
              <div className="text-3xl mr-4">📊</div>
              <div>
                <div className="font-semibold text-gray-900">Reports</div>
                <div className="text-sm text-gray-600">View analytics & reports</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary mb-3">🚀 Super-Merchant Features</h2>
          <div className="space-y-3 text-sm text-foreground">
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
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
