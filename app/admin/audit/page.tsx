'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  KeyIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

interface AuditLog {
  id: string;
  userId: string | null;
  apiKeyId: string | null;
  action: string;
  entity: string;
  entityId: string;
  changes: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  User?: {
    name: string;
    email: string;
  } | null;
}

type FilterAction = 'ALL' | 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
type FilterEntity = 'ALL' | 'USER' | 'MERCHANT' | 'TRANSACTION' | 'API_KEY' | 'SETTLEMENT';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<FilterAction>('ALL');
  const [filterEntity, setFilterEntity] = useState<FilterEntity>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/audit-logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'USER':
        return 'bg-indigo-100 text-indigo-800';
      case 'MERCHANT':
        return 'bg-orange-100 text-orange-800';
      case 'TRANSACTION':
        return 'bg-cyan-100 text-cyan-800';
      case 'API_KEY':
        return 'bg-pink-100 text-pink-800';
      case 'SETTLEMENT':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLogs = logs.filter(log => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      log.entity.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.entityId.toLowerCase().includes(searchLower) ||
      log.User?.name.toLowerCase().includes(searchLower) ||
      log.User?.email.toLowerCase().includes(searchLower) ||
      log.ipAddress?.toLowerCase().includes(searchLower);

    // Action filter
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;

    // Entity filter
    const matchesEntity = filterEntity === 'ALL' || log.entity === filterEntity;

    return matchesSearch && matchesAction && matchesEntity;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterAction, filterEntity]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  const stats = {
    total: logs.length,
    creates: logs.filter(l => l.action === 'CREATE').length,
    updates: logs.filter(l => l.action === 'UPDATE').length,
    deletes: logs.filter(l => l.action === 'DELETE').length,
  };

  return (
    <DashboardLayout requiredRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600" />
            Audit Logs
          </h1>
          <p className="text-gray-600 mt-1">Track all system activities and changes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Logs</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Creates</div>
            <div className="text-3xl font-bold text-green-600">{stats.creates}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Updates</div>
            <div className="text-3xl font-bold text-blue-600">{stats.updates}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Deletes</div>
            <div className="text-3xl font-bold text-red-600">{stats.deletes}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, entity, ID, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                showFilters
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type
                </label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value as FilterAction)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Actions</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entity Type
                </label>
                <select
                  value={filterEntity}
                  onChange={(e) => setFilterEntity(e.target.value as FilterEntity)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Entities</option>
                  <option value="USER">User</option>
                  <option value="MERCHANT">Merchant</option>
                  <option value="TRANSACTION">Transaction</option>
                  <option value="API_KEY">API Key</option>
                  <option value="SETTLEMENT">Settlement</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Logs List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading audit logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 px-6">
              <ClipboardDocumentListIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Logs Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterAction !== 'ALL' || filterEntity !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'No audit logs have been recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEntityColor(log.entity)}`}>
                        {log.entity}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {formatDate(log.createdAt)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start space-x-2">
                      <UserIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-600 text-xs">User</p>
                        <p className="font-medium text-gray-900">
                          {log.User ? `${log.User.name} (${log.User.email})` : 
                           log.apiKeyId ? `API Key: ${log.apiKeyId.slice(0, 8)}...` : 
                           'System'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <KeyIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-600 text-xs">Entity ID</p>
                        <p className="font-mono text-gray-900 break-all">
                          {log.entityId}
                        </p>
                      </div>
                    </div>

                    {log.ipAddress && (
                      <div className="flex items-start space-x-2">
                        <GlobeAltIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-gray-600 text-xs">IP Address</p>
                          <p className="font-mono text-gray-900">{log.ipAddress}</p>
                        </div>
                      </div>
                    )}

                    {log.userAgent && (
                      <div className="flex items-start space-x-2">
                        <ClipboardDocumentListIcon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-gray-600 text-xs">User Agent</p>
                          <p className="text-gray-900 truncate" title={log.userAgent}>
                            {log.userAgent}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {log.changes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Changes:</p>
                      <pre className="bg-gray-50 rounded p-3 text-xs overflow-x-auto">
                        {log.changes}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredLogs.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
              {filteredLogs.length !== logs.length && (
                <span className="text-gray-400"> (filtered from {logs.length} total)</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
