'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { KeyIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  status: string;
  environment: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

function ApiKeysContent() {
  const searchParams = useSearchParams();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    fetchApiKeys();
    
    // Check if we just created a key
    const createdKey = searchParams.get('key');
    if (createdKey) {
      setNewlyCreatedKey(decodeURIComponent(createdKey));
      setShowKeyModal(true);
      // Clean URL
      window.history.replaceState({}, '', '/merchant/api-keys');
    }
  }, [searchParams]);

  const fetchApiKeys = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/api-keys', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys || []);
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch API keys' }));
        toast.error(error.error || 'Failed to fetch API keys');
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseKeyModal = () => {
    setShowKeyModal(false);
    setNewlyCreatedKey(null);
  };

  const handleToggleKey = async (keyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchApiKeys();
        toast.success(`API key ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to update API key' }));
        toast.error(error.error || 'Failed to update API key');
      }
    } catch (error) {
      console.error('Failed to toggle API key:', error);
      toast.error('Failed to update API key');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchApiKeys();
        toast.success('API key deleted successfully');
      } else {
        const error = await response.json().catch(() => ({ error: 'Failed to delete API key' }));
        toast.error(error.error || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const maskApiKey = (prefix: string) => {
    return `${prefix}${'•'.repeat(40)}`;
  };

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Total Keys</div>
            <div className="text-3xl font-bold text-gray-900">{apiKeys.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Active Keys</div>
            <div className="text-3xl font-bold text-green-600">
              {apiKeys.filter(k => k.status === 'ACTIVE').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Sandbox Keys</div>
            <div className="text-3xl font-bold text-blue-600">
              {apiKeys.filter(k => k.environment === 'SANDBOX').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600 mb-1">Production Keys</div>
            <div className="text-3xl font-bold text-red-600">
              {apiKeys.filter(k => k.environment === 'PRODUCTION').length}
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/docs/api-keys"
            className="px-6 py-3 bg-white text-secondary border-2 border-secondary rounded-lg hover:bg-secondary/5 transition font-semibold flex items-center gap-2"
          >
            <KeyIcon className="w-5 h-5" />
            API Documentation
          </Link>
          <Link
            href="/merchant/api-keys/create"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Create New API Key
          </Link>
        </div>

        {/* API Keys List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading API keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="text-gray-400 text-5xl mb-4">🔑</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first API key to start integrating with PexiPay API.
              </p>
              <Link
                href="/merchant/api-keys/create"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Create Your First API Key
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link href={`/merchant/api-keys/${apiKey.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition">
                            {apiKey.name}
                          </h3>
                        </Link>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          apiKey.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {apiKey.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          apiKey.environment === 'PRODUCTION'
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {apiKey.environment}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <code className="text-sm bg-gray-100 px-3 py-2 rounded font-mono">
                          {maskApiKey(apiKey.prefix)}
                        </code>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Created: {new Date(apiKey.createdAt).toLocaleString()}</p>
                        {apiKey.lastUsedAt && (
                          <p>Last used: {new Date(apiKey.lastUsedAt).toLocaleString()}</p>
                        )}
                        {apiKey.expiresAt && (
                          <p>Expires: {new Date(apiKey.expiresAt).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/merchant/api-keys/${apiKey.id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-medium transition"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleToggleKey(apiKey.id, apiKey.status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          apiKey.status === 'ACTIVE'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {apiKey.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newly Created Key Modal */}
        {showKeyModal && newlyCreatedKey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <KeyIcon className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key Created Successfully!</h2>
                <p className="text-gray-600">
                  Make sure to copy your API key now. You won&apos;t be able to see it again!
                </p>
              </div>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">Security Warning</p>
                    <p className="text-sm text-yellow-800">
                      This is the only time you&apos;ll see this key. Store it securely in your password manager or secret management system.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white border border-yellow-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 uppercase">Your API Key</span>
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                  <code className="text-sm font-mono text-gray-900 break-all block">{newlyCreatedKey}</code>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(newlyCreatedKey)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Copy API Key
                </button>
                <button
                  onClick={handleCloseKeyModal}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  I&apos;ve Saved It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function ApiKeysPage() {
  return (
    <Suspense fallback={
      <DashboardLayout requiredRole="ANY">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    }>
      <ApiKeysContent />
    </Suspense>
  );
}
