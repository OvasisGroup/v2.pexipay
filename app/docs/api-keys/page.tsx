'use client';

import Link from 'next/link';
import { 
  KeyIcon, 
  ShieldCheckIcon, 
  CommandLineIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function ApiKeysDocumentation() {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => window.history.back()} className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block">
            ← Back
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <KeyIcon className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">API Keys Documentation</h1>
                <p className="text-gray-600 mt-1">Complete guide to managing and using PexiPay API keys</p>
              </div>
            </div>
            <Link
              href="/docs/api"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
            >
              View API Docs
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="#overview" className="text-blue-600 hover:text-blue-700 text-sm">• Overview</a>
            <a href="#creating" className="text-blue-600 hover:text-blue-700 text-sm">• Creating API Keys</a>
            <a href="#permissions" className="text-blue-600 hover:text-blue-700 text-sm">• Permissions</a>
            <a href="#authentication" className="text-blue-600 hover:text-blue-700 text-sm">• Authentication</a>
            <a href="#security" className="text-blue-600 hover:text-blue-700 text-sm">• Security Best Practices</a>
            <a href="#examples" className="text-blue-600 hover:text-blue-700 text-sm">• Code Examples</a>
            <a href="#troubleshooting" className="text-blue-600 hover:text-blue-700 text-sm">• Troubleshooting</a>
          </div>
        </div>

        {/* Overview */}
        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <KeyIcon className="w-7 h-7 mr-2 text-blue-600" />
            Overview
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <p className="text-gray-700">
              API keys are unique authentication tokens that allow your applications to securely communicate with PexiPay&apos;s API. 
              Each key is tied to your merchant or super merchant account and carries the same permissions as your account.
            </p>
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-900">
                <strong>Super Merchants:</strong> API keys created under your super merchant account have access to all sub-merchant data and operations. You can manage payments, settlements, and transactions for all your sub-merchants using a single API key.
              </p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-900">
                <strong>Important:</strong> API keys are sensitive credentials. Treat them like passwords and never expose them in client-side code or public repositories.
              </p>
            </div>
          </div>
        </section>

        {/* Creating API Keys */}
        <section id="creating" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating API Keys</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Step-by-Step Guide</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                  <div>
                    <strong>Navigate to API Keys:</strong> Go to your dashboard and click on &quot;API Keys&quot; in the sidebar.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                  <div>
                    <strong>Click &quot;Create New API Key&quot;:</strong> You&apos;ll see a button in the top-right corner of the page.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                  <div>
                    <strong>Name Your Key:</strong> Choose a descriptive name (e.g., &quot;Production Server&quot;, &quot;Development Environment&quot;).
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
                  <div>
                    <strong>Set Expiry (Optional):</strong> Select an expiration period for enhanced security (30, 60, 90, 180, or 365 days).
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 shrink-0">5</span>
                  <div>
                    <strong>Choose Environment:</strong> Select <span className="text-blue-600 font-semibold">Sandbox</span> for testing or <span className="text-red-600 font-semibold">Production</span> for live transactions.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 shrink-0">6</span>
                  <div>
                    <strong>Copy Your Key:</strong> <span className="text-red-600 font-semibold">Important!</span> Copy the key immediately. You won&apos;t be able to see it again.
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900">
                  <strong>Warning:</strong> API keys are shown only once at creation time. If you lose your key, you&apos;ll need to create a new one.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Permissions */}
        <section id="permissions" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Key Permissions</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Merchant API Keys</h3>
              <p className="text-gray-700 mb-3">
                Merchant API keys have access to:
              </p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside ml-4">
                <li>Create and manage payments for your merchant account</li>
                <li>View and download transaction reports</li>
                <li>Access settlement information</li>
                <li>Manage webhooks and notifications</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Super Merchant API Keys</h3>
              <p className="text-gray-700 mb-3">
                Super Merchant API keys have extended access to:
              </p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside ml-4">
                <li>All merchant-level permissions</li>
                <li>Create and manage sub-merchant accounts</li>
                <li>Access transactions across all sub-merchants</li>
                <li>View consolidated settlement reports</li>
                <li>Manage API keys for sub-merchants</li>
                <li>Configure platform-level settings</li>
              </ul>
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> Super merchants can specify sub-merchant IDs in API requests to perform operations on behalf of specific sub-merchants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section id="authentication" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon className="w-7 h-7 mr-2 text-blue-600" />
            Authentication
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Using Your API Key</h3>
              <p className="text-gray-700 mb-4">
                Include your API key in the <code className="bg-gray-100 px-2 py-1 rounded text-sm">Authorization</code> header of every API request:
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 relative">
                <button
                  onClick={() => copyCode('Authorization: Bearer YOUR_API_KEY')}
                  className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                  title="Copy to clipboard"
                >
                  <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                </button>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">API Key Environments</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold mr-2">SANDBOX</span>
                    Testing Environment
                  </h4>
                  <p className="text-sm text-blue-900 mb-2">
                    Sandbox keys are for development and testing. They start with <code className="bg-blue-100 px-1 rounded">pxp_test_</code>
                  </p>
                  <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside ml-2">
                    <li>No real money is processed</li>
                    <li>Safe for testing integration</li>
                    <li>Can simulate different payment scenarios</li>
                    <li>Unlimited test transactions</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold mr-2">PRODUCTION</span>
                    Live Environment
                  </h4>
                  <p className="text-sm text-red-900 mb-2">
                    Production keys are for live transactions. They start with <code className="bg-red-100 px-1 rounded">pxp_live_</code>
                  </p>
                  <ul className="text-sm text-red-900 space-y-1 list-disc list-inside ml-2">
                    <li>Processes real money transactions</li>
                    <li>Must be secured and never exposed</li>
                    <li>Subject to transaction fees</li>
                    <li>Requires proper error handling</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm text-yellow-900">
                  <strong>Best Practice:</strong> Always develop and test with sandbox keys first. Only switch to production keys when your integration is fully tested and ready for live transactions.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">API Key Format</h3>
              <p className="text-gray-700 mb-3">
                PexiPay API keys follow this format:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Sandbox Key Example:</div>
                  <code className="text-sm font-mono">pxp_test_1234567890abcdefghijklmnopqrstuvwxyz</code>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Production Key Example:</div>
                  <code className="text-sm font-mono">pxp_live_1234567890abcdefghijklmnopqrstuvwxyz</code>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>• <strong>Prefix:</strong> <code>pxp_</code> identifies PexiPay keys</p>
                <p>• <strong>Environment:</strong> <code>test_</code> (sandbox) or <code>live_</code> (production)</p>
                <p>• <strong>Key:</strong> 64-character unique identifier</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Best Practices */}
        <section id="security" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <LockClosedIcon className="w-7 h-7 mr-2 text-blue-600" />
            Security Best Practices
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Store Keys Securely</h4>
                  <p className="text-gray-700 text-sm">Use environment variables or secure key management services. Never hardcode keys in your source code.</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Use Different Keys for Different Environments</h4>
                  <p className="text-gray-700 text-sm">Create separate keys for development, staging, and production environments.</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Rotate Keys Regularly</h4>
                  <p className="text-gray-700 text-sm">Set expiry dates and rotate keys every 90 days or when team members with access leave.</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Never Expose Keys Client-Side</h4>
                  <p className="text-gray-700 text-sm">API keys should only be used in server-side code. Never include them in mobile apps or frontend JavaScript.</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Monitor Key Usage</h4>
                  <p className="text-gray-700 text-sm">Regularly check the &quot;Last Used&quot; timestamp to detect unauthorized access.</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Revoke Compromised Keys Immediately</h4>
                  <p className="text-gray-700 text-sm">If a key is exposed or compromised, deactivate or delete it immediately and create a new one.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-900 font-semibold mb-2">What NOT to Do:</p>
                  <ul className="text-sm text-red-900 space-y-1 list-disc list-inside">
                    <li>Don&apos;t commit API keys to Git repositories</li>
                    <li>Don&apos;t share keys via email or messaging apps</li>
                    <li>Don&apos;t use production keys in development</li>
                    <li>Don&apos;t log API keys in application logs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section id="examples" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <CommandLineIcon className="w-7 h-7 mr-2 text-blue-600" />
            Code Examples
          </h2>

          {/* Node.js Example */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Node.js (Express)</h3>
            <div className="bg-gray-900 rounded-lg p-4 relative">
              <button
                onClick={() => copyCode(`const express = require('express');
const axios = require('axios');

const app = express();
const API_KEY = process.env.PEXIPAY_API_KEY;

app.post('/create-payment', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.pexipay.com/v1/payments',
      {
        amount: 1000,
        currency: 'USD',
        description: 'Test payment'
      },
      {
        headers: {
          'Authorization': \`Bearer \${API_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);`)}
                className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                title="Copy to clipboard"
              >
                <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
              </button>
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{`const express = require('express');
const axios = require('axios');

const app = express();
const API_KEY = process.env.PEXIPAY_API_KEY;

app.post('/create-payment', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.pexipay.com/v1/payments',
      {
        amount: 1000,
        currency: 'USD',
        description: 'Test payment'
      },
      {
        headers: {
          'Authorization': \`Bearer \${API_KEY}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);`}</code>
              </pre>
            </div>
          </div>

          {/* Python Example */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Python (Flask)</h3>
            <div className="bg-gray-900 rounded-lg p-4 relative">
              <button
                onClick={() => copyCode(`import os
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)
API_KEY = os.environ.get('PEXIPAY_API_KEY')

@app.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        response = requests.post(
            'https://api.pexipay.com/v1/payments',
            json={
                'amount': 1000,
                'currency': 'USD',
                'description': 'Test payment'
            },
            headers={
                'Authorization': f'Bearer {API_KEY}',
                'Content-Type': 'application/json'
            }
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000)`)}
                className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                title="Copy to clipboard"
              >
                <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
              </button>
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{`import os
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)
API_KEY = os.environ.get('PEXIPAY_API_KEY')

@app.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        response = requests.post(
            'https://api.pexipay.com/v1/payments',
            json={
                'amount': 1000,
                'currency': 'USD',
                'description': 'Test payment'
            },
            headers={
                'Authorization': f'Bearer {API_KEY}',
                'Content-Type': 'application/json'
            }
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000)`}</code>
              </pre>
            </div>
          </div>

          {/* cURL Example */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">cURL</h3>
            <div className="bg-gray-900 rounded-lg p-4 relative">
              <button
                onClick={() => copyCode(`curl -X POST https://api.pexipay.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "USD",
    "description": "Test payment"
  }'`)}
                className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                title="Copy to clipboard"
              >
                <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
              </button>
              <pre className="text-gray-300 text-sm overflow-x-auto">
                <code>{`curl -X POST https://api.pexipay.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "USD",
    "description": "Test payment"
  }'`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Key Management */}
        <section id="management" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <ArrowPathIcon className="w-7 h-7 mr-2 text-blue-600" />
            Managing Your Keys
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Activating/Deactivating Keys</h3>
              <p className="text-gray-700 mb-3">
                You can temporarily disable a key without deleting it. This is useful when:
              </p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside ml-4">
                <li>Investigating suspicious activity</li>
                <li>Performing maintenance on systems using the key</li>
                <li>Temporarily restricting access</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Deleting Keys</h3>
              <p className="text-gray-700">
                When you delete a key, it&apos;s permanently removed and cannot be recovered. Any requests using that key will be immediately rejected.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Expiration</h3>
              <p className="text-gray-700">
                Keys with expiration dates will automatically become inactive after the expiry date. You&apos;ll need to create a new key to continue API access.
              </p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">401 Unauthorized Error</h3>
              <p className="text-gray-700 mb-2">Common causes:</p>
              <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4 text-sm">
                <li>Missing Authorization header</li>
                <li>Invalid or expired API key</li>
                <li>Inactive or deleted API key</li>
                <li>Incorrect header format (should be <code className="bg-gray-100 px-1 py-0.5 rounded">Bearer YOUR_KEY</code>)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">403 Forbidden Error</h3>
              <p className="text-gray-700 mb-2">Common causes:</p>
              <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4 text-sm">
                <li>Attempting to access resources outside your permissions</li>
                <li>Account has insufficient privileges</li>
                <li>Rate limit exceeded</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Not Working After Creation</h3>
              <p className="text-gray-700 mb-2">Checklist:</p>
              <ul className="text-gray-700 space-y-1 list-disc list-inside ml-4 text-sm">
                <li>Ensure you copied the entire key including the prefix</li>
                <li>Check that the key status is &quot;ACTIVE&quot;</li>
                <li>Verify there are no extra spaces or newlines in the key</li>
                <li>Confirm the key hasn&apos;t expired</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">
              API requests are rate-limited to ensure system stability and fair usage:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Endpoint Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rate Limit</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">Standard API calls</td>
                    <td className="px-4 py-3 text-sm text-gray-700">100 requests</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Per minute</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">Payment creation</td>
                    <td className="px-4 py-3 text-sm text-gray-700">30 requests</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Per minute</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">Webhook endpoints</td>
                    <td className="px-4 py-3 text-sm text-gray-700">1000 requests</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Per minute</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              If you exceed these limits, you&apos;ll receive a 429 Too Many Requests response. Implement exponential backoff in your retry logic.
            </p>
          </div>
        </section>

        {/* Support */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-700 mb-6">
            If you have questions about API keys or need assistance with integration, our support team is here to help.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/help" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Contact Support
            </Link>
            <a 
              href="javascript:history.back()" 
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Back to API Keys
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2025 PexiPay. All rights reserved. | <Link href="/docs" className="text-blue-600 hover:text-blue-700">Documentation</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
