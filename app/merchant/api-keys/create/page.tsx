'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  ArrowLeftIcon, 
  KeyIcon, 
  ShieldCheckIcon,
  ClockIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateApiKeyPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<'SANDBOX' | 'PRODUCTION'>('SANDBOX');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [rpmLimit, setRpmLimit] = useState('60');
  const [rphLimit, setRphLimit] = useState('1000');
  const [rpdLimit, setRpdLimit] = useState('10000');
  const [ipAddresses, setIpAddresses] = useState<string[]>([]);
  const [newIpAddress, setNewIpAddress] = useState('');

  const handleAddIpAddress = () => {
    if (newIpAddress.trim() && !ipAddresses.includes(newIpAddress.trim())) {
      setIpAddresses([...ipAddresses, newIpAddress.trim()]);
      setNewIpAddress('');
    }
  };

  const handleRemoveIpAddress = (ip: string) => {
    setIpAddresses(ipAddresses.filter(i => i !== ip));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Calculate expiration days if date is provided
      let expiresInDays: number | undefined;
      if (expirationDate) {
        const expDate = new Date(expirationDate);
        const now = new Date();
        const diffTime = expDate.getTime() - now.getTime();
        expiresInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      const body = {
        name,
        environment,
        description: description || undefined,
        expiresInDays,
        rateLimit: {
          rpm: parseInt(rpmLimit),
          rph: parseInt(rphLimit),
          rpd: parseInt(rpdLimit),
        },
        ipRestrictions: ipAddresses.length > 0 ? ipAddresses : undefined,
      };

      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create API key');
      }

      const data = await response.json();
      
      // Redirect to API keys page with success state and the new key
      router.push(`/merchant/api-keys?created=true&key=${encodeURIComponent(data.key)}&keyId=${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout requiredRole="ANY">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <KeyIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Create API Key</h1>
            </div>
            <p className="text-gray-600">Generate a new API key for secure integration</p>
          </div>
          <Link
            href="/merchant/api-keys"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to API Keys
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                
                {/* API Key Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    API Key Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Environment */}
                <div>
                  <label htmlFor="environment" className="block text-sm font-medium text-gray-700 mb-2">
                    Environment <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="environment"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as 'SANDBOX' | 'PRODUCTION')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SANDBOX">Sandbox (Testing)</option>
                    <option value="PRODUCTION">Production (Live)</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    {environment === 'SANDBOX' 
                      ? 'Test environment with no real transactions' 
                      : 'Live environment with real transactions'}
                  </p>
                </div>

                {/* Expiration Date */}
                <div>
                  <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <input
                    type="datetime-local"
                    id="expirationDate"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">Leave empty for no expiration</p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the purpose of this API key..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Rate Limiting */}
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Rate Limiting</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="rpmLimit" className="block text-sm font-medium text-gray-700 mb-2">
                      Requests per Minute
                    </label>
                    <input
                      type="number"
                      id="rpmLimit"
                      value={rpmLimit}
                      onChange={(e) => setRpmLimit(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="rphLimit" className="block text-sm font-medium text-gray-700 mb-2">
                      Requests per Hour
                    </label>
                    <input
                      type="number"
                      id="rphLimit"
                      value={rphLimit}
                      onChange={(e) => setRphLimit(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="rpdLimit" className="block text-sm font-medium text-gray-700 mb-2">
                      Requests per Day
                    </label>
                    <input
                      type="number"
                      id="rpdLimit"
                      value={rpdLimit}
                      onChange={(e) => setRpdLimit(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* IP Restrictions */}
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">IP Restrictions (Optional)</h2>
                
                <div>
                  <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed IP Addresses
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="ipAddress"
                      value={newIpAddress}
                      onChange={(e) => setNewIpAddress(e.target.value)}
                      placeholder="192.168.1.1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIpAddress())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddIpAddress}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add IP Address
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    ⓘ Leave empty to allow all IP addresses. Add specific IPs for enhanced security.
                  </p>

                  {/* IP Address List */}
                  {ipAddresses.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {ipAddresses.map((ip) => (
                        <div key={ip} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                          <span className="text-sm text-gray-700 font-mono">{ip}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIpAddress(ip)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <Link
                  href="/merchant/api-keys"
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={creating || !name}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <KeyIcon className="w-4 h-4" />
                      Create API Key
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar - Security Info */}
          <div className="space-y-6">
            {/* Security Best Practices */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Security Information</h3>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-3">Security Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Set appropriate rate limits for your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Set expiration dates for temporary access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Use IP restrictions for additional security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Store API secrets securely</span>
                </li>
              </ul>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <LightBulbIcon className="w-6 h-6 text-yellow-600" />
                <h3 className="font-semibold text-gray-900">Quick Tips</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <KeyIcon className="w-4 h-4 text-yellow-600" />
                    API Key Security
                  </h4>
                  <p className="text-sm text-gray-700">
                    Never share your API secret. It will only be shown once when created.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-yellow-600" />
                    Rate Limits
                  </h4>
                  <p className="text-sm text-gray-700">
                    Set appropriate rate limits based on your application&apos;s needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
