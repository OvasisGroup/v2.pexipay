'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ArrowLeftIcon, 
  KeyIcon,
  ClockIcon,
  ShieldCheckIcon,
  CalendarIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ApiKeyDetail {
  id: string;
  name: string;
  prefix: string;
  status: string;
  environment: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export default function ApiKeyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [apiKey, setApiKey] = useState<ApiKeyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApiKeyDetail();
  }, []);

  const fetchApiKeyDetail = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/api-keys', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const key = data.apiKeys.find((k: ApiKeyDetail) => k.id === params.id);
        if (key) {
          setApiKey(key);
        } else {
          router.push('/merchant/api-keys');
        }
      }
    } catch (error) {
      console.error('Failed to fetch API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!apiKey) return;
    
    const newStatus = apiKey.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/api-keys/${apiKey.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApiKey({ ...apiKey, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to toggle API key status:', error);
    }
  };

  const handleDelete = async () => {
    if (!apiKey) return;
    
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access.')) {
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/api-keys/${apiKey.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/merchant/api-keys');
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const maskApiKey = (prefix: string) => {
    return `${prefix}${'*'.repeat(40)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="ANY">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!apiKey) {
    return (
      <DashboardLayout requiredRole="ANY">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key Not Found</h2>
          <Link href="/merchant/api-keys" className="text-blue-600 hover:text-blue-700">
            Back to API Keys
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/merchant/api-keys"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <KeyIcon className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{apiKey.name}</h1>
              </div>
              <p className="text-sm text-gray-600">
                Created {formatDate(apiKey.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                apiKey.status === 'ACTIVE'
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {apiKey.status === 'ACTIVE' ? 'Revoke Access' : 'Activate'}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <TrashIcon className="w-5 h-5" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* API Key Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">API Key</h2>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              apiKey.environment === 'PRODUCTION'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {apiKey.environment}
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-900 break-all">
                {maskApiKey(apiKey.prefix)}
              </code>
              <button
                onClick={() => copyToClipboard(maskApiKey(apiKey.prefix))}
                className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Security Notice:</strong> This is a masked version of your API key. The full key was only shown once during creation.
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              {apiKey.status === 'ACTIVE' ? (
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              ) : (
                <XCircleIcon className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-600">Status</h3>
                <p className={`text-2xl font-bold ${
                  apiKey.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {apiKey.status}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {apiKey.status === 'ACTIVE' 
                ? 'This API key is currently active and can be used for API requests.'
                : 'This API key has been revoked and cannot be used for API requests.'}
            </p>
          </div>

          {/* Permissions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Permissions</h3>
                <p className="text-2xl font-bold text-gray-900">Full Access</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This key has full access to all API endpoints for your account.
            </p>
          </div>

          {/* Last Used Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <ClockIcon className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Last Used</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDate(apiKey.lastUsedAt)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {apiKey.lastUsedAt 
                ? 'Last time this API key was used for authentication.'
                : 'This API key has never been used.'}
            </p>
          </div>

          {/* Expiration Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-600">Expires</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDate(apiKey.expiresAt)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {apiKey.expiresAt 
                ? 'This API key will automatically expire on this date.'
                : 'This API key does not have an expiration date.'}
            </p>
          </div>
        </div>

        {/* Usage Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">API Key ID</span>
              <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">{apiKey.id}</code>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Prefix</span>
              <code className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">{apiKey.prefix}</code>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Environment</span>
              <span className={`text-sm font-semibold px-3 py-1 rounded ${
                apiKey.environment === 'PRODUCTION'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {apiKey.environment}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-700">Created</span>
              <span className="text-sm text-gray-900">{formatDate(apiKey.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
