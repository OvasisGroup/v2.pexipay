'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  CodeBracketIcon, 
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function ApiDocumentation() {
  const [activeTab, setActiveTab] = useState('overview');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => window.history.back()} className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block">
            ← Back
          </button>
          <div className="flex items-center space-x-3">
            <CodeBracketIcon className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PexiPay API Documentation</h1>
              <p className="text-gray-600 mt-1">Complete reference for integrating payment processing</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase">Navigation</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'overview' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('authentication')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'authentication' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Authentication
                </button>
                <button
                  onClick={() => setActiveTab('create-payment')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'create-payment' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Create Payment (Hosted)
                </button>
                <button
                  onClick={() => setActiveTab('direct-payment')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'direct-payment' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Create Payment (Direct)
                </button>
                <button
                  onClick={() => setActiveTab('list-transactions')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'list-transactions' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List Transactions
                </button>
                <button
                  onClick={() => setActiveTab('get-transaction')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'get-transaction' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Get Transaction
                </button>
                <button
                  onClick={() => setActiveTab('webhooks')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'webhooks' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Webhooks
                </button>
                <button
                  onClick={() => setActiveTab('errors')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    activeTab === 'errors' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Error Codes
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/docs/api-keys"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  → API Keys Guide
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                  <p className="text-gray-700 mb-4">
                    The PexiPay API allows you to accept payments, manage transactions, and integrate payment processing into your applications. Our REST API uses standard HTTP methods and returns JSON responses.
                  </p>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <p className="text-sm text-blue-900">
                      <strong>Base URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">https://api.pexipay.com/v1</code>
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <CreditCardIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Multiple Payment Methods</h4>
                        <p className="text-sm text-gray-600">Accept cards, bank transfers, and digital wallets</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ShieldCheckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Built-in Fraud Detection</h4>
                        <p className="text-sm text-gray-600">Advanced fraud prevention and risk scoring</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ArrowPathIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Real-time Webhooks</h4>
                        <p className="text-sm text-gray-600">Get instant notifications for payment events</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900">3DS Authentication</h4>
                        <p className="text-sm text-gray-600">Secure payments with 3D Secure support</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
                  <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                    <li>Create an account and get your API keys from the dashboard</li>
                    <li>Test your integration using sandbox keys</li>
                    <li>Implement webhooks to handle payment notifications</li>
                    <li>Switch to production keys when ready to go live</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeTab === 'authentication' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                  <p className="text-gray-700 mb-4">
                    The PexiPay API uses API keys to authenticate requests. Include your API key in the Authorization header of every request.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">API Key Format</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-4 relative">
                    <button
                      onClick={() => copyCode('Authorization: Bearer pxp_test_your_api_key_here')}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>Authorization: Bearer pxp_test_your_api_key_here</code>
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                      <p className="text-sm text-yellow-900">
                        <strong>Important:</strong> Keep your API keys secure. Never expose them in client-side code or public repositories.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Environments</h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                      <h4 className="font-semibold text-blue-900 mb-1">Sandbox (Testing)</h4>
                      <p className="text-sm text-blue-800 mb-2">Keys start with <code className="bg-blue-100 px-2 py-0.5 rounded">pxp_test_</code></p>
                      <p className="text-sm text-blue-800">Use for development and testing. No real money is processed.</p>
                    </div>
                    <div className="border-l-4 border-red-500 bg-red-50 p-4">
                      <h4 className="font-semibold text-red-900 mb-1">Production (Live)</h4>
                      <p className="text-sm text-red-800 mb-2">Keys start with <code className="bg-red-100 px-2 py-0.5 rounded">pxp_live_</code></p>
                      <p className="text-sm text-red-800">Use for processing real payments. Transactions are charged.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create Payment */}
            {activeTab === 'create-payment' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Payment (Hosted)</h2>
                  <p className="text-gray-700 mb-4">
                    Creates a new payment and returns a hosted payment URL where customers can complete the transaction. This method is recommended for most integrations as it handles PCI compliance automatically.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">POST</span>
                      <code className="text-blue-900 font-mono text-sm mt-1">/api/payments</code>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Body</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Required</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">amount</td>
                          <td className="px-4 py-3 text-sm text-gray-600">number</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment amount in cents (e.g., 1000 = $10.00)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">currency</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Three-letter ISO currency code (default: USD)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">paymentMethod</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">CARD, BANK_TRANSFER, WALLET, or OTHER</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">customerEmail</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Customer&apos;s email address</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">customerName</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Customer&apos;s full name</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">externalId</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Your internal reference ID</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">returnUrl</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">URL to redirect after successful payment</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">cancelUrl</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">URL to redirect if payment is cancelled</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">metadata</td>
                          <td className="px-4 py-3 text-sm text-gray-600">object</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Custom key-value pairs for your reference</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`curl -X POST https://api.pexipay.com/v1/api/payments \\
  -H "Authorization: Bearer pxp_test_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "USD",
    "paymentMethod": "CARD",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "externalId": "order_12345",
    "returnUrl": "https://yoursite.com/success",
    "cancelUrl": "https://yoursite.com/cancel",
    "metadata": {
      "orderId": "12345",
      "productId": "prod_abc"
    }
  }'`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`curl -X POST https://api.pexipay.com/v1/api/payments \\
  -H "Authorization: Bearer pxp_test_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "USD",
    "paymentMethod": "CARD",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "externalId": "order_12345",
    "returnUrl": "https://yoursite.com/success",
    "cancelUrl": "https://yoursite.com/cancel",
    "metadata": {
      "orderId": "12345",
      "productId": "prod_abc"
    }
  }'`}</code>
                    </pre>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`{
  "transactionId": "txn_1234567890",
  "status": "PROCESSING",
  "paymentUrl": "https://pay.pexipay.com/checkout/abc123",
  "requires3DS": false,
  "threeDSUrl": null
}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`{
  "transactionId": "txn_1234567890",
  "status": "PROCESSING",
  "paymentUrl": "https://pay.pexipay.com/checkout/abc123",
  "requires3DS": false,
  "threeDSUrl": null
}`}</code>
                    </pre>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <div className="flex">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Next Steps</p>
                        <p>Redirect your customer to the <code className="bg-blue-100 px-1 rounded">paymentUrl</code> to complete the payment. You&apos;ll receive a webhook notification when the payment status changes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Direct Payment */}
            {activeTab === 'direct-payment' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Payment (Direct)</h2>
                  <p className="text-gray-700 mb-4">
                    Process card payments directly on your server without redirecting customers. This method requires you to collect and securely handle card details.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-900">
                        <p className="font-semibold mb-1">PCI Compliance Required</p>
                        <p>When using direct payment integration, you are responsible for securely handling card data and maintaining PCI DSS compliance. Consider using card tokenization for production environments.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">POST</span>
                      <code className="text-blue-900 font-mono text-sm mt-1">/api/payments/direct</code>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Body</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Required</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">amount</td>
                          <td className="px-4 py-3 text-sm text-gray-600">number</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment amount in cents</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">currency</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Three-letter ISO currency code (default: USD)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">cardNumber</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Card number (13-19 digits)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">cardExpiry</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Card expiry in MM/YY format</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">cardCvv</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Card CVV (3-4 digits)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">cardHolderName</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Name on the card</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">billingAddress</td>
                          <td className="px-4 py-3 text-sm text-gray-600">object</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Billing address object (see below)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">customerEmail</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Customer&apos;s email address</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">customerName</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Customer&apos;s full name</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">metadata</td>
                          <td className="px-4 py-3 text-sm text-gray-600">object</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Custom key-value pairs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Billing Address Object</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Required</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">line1</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Address line 1</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">line2</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Address line 2</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">city</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">City name</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">state</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-semibold">No</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">State/Province</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">postalCode</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">Postal/ZIP code</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">country</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-semibold">Yes</span></td>
                          <td className="px-4 py-3 text-sm text-gray-700">ISO 3166-1 alpha-2 country code</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`curl -X POST https://api.pexipay.com/v1/api/payments/direct \\
  -H "Authorization: Bearer pxp_test_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "USD",
    "cardNumber": "4111111111111111",
    "cardExpiry": "12/25",
    "cardCvv": "123",
    "cardHolderName": "John Doe",
    "billingAddress": {
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    },
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "metadata": {
      "orderId": "12345"
    }
  }'`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`curl -X POST https://api.pexipay.com/v1/api/payments/direct \\
  -H "Authorization: Bearer pxp_test_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "USD",
    "cardNumber": "4111111111111111",
    "cardExpiry": "12/25",
    "cardCvv": "123",
    "cardHolderName": "John Doe",
    "billingAddress": {
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    },
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "metadata": {
      "orderId": "12345"
    }
  }'`}</code>
                    </pre>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response (Success)</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`{
  "transactionId": "txn_1234567890",
  "status": "SUCCEEDED",
  "amount": 5000,
  "currency": "USD",
  "message": "Payment successful"
}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`{
  "transactionId": "txn_1234567890",
  "status": "SUCCEEDED",
  "amount": 5000,
  "currency": "USD",
  "message": "Payment successful"
}`}</code>
                    </pre>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response (3D Secure Required)</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`{
  "transactionId": "txn_1234567890",
  "status": "REQUIRES_ACTION",
  "requires3DS": true,
  "threeDSUrl": "https://3ds.pexipay.com/auth/abc123",
  "message": "Additional authentication required"
}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`{
  "transactionId": "txn_1234567890",
  "status": "REQUIRES_ACTION",
  "requires3DS": true,
  "threeDSUrl": "https://3ds.pexipay.com/auth/abc123",
  "message": "Additional authentication required"
}`}</code>
                    </pre>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      <div className="text-sm text-green-900">
                        <p className="font-semibold mb-1">Advantages</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>No redirect - seamless checkout experience</li>
                          <li>Full control over payment UI and branding</li>
                          <li>Immediate payment confirmation</li>
                          <li>3D Secure support when required</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List Transactions */}
            {activeTab === 'list-transactions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">List Transactions</h2>
                  <p className="text-gray-700 mb-4">
                    Retrieves a paginated list of transactions for your merchant account.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">GET</span>
                      <code className="text-green-900 font-mono text-sm mt-1">/api/payments</code>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Query Parameters</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Default</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">limit</td>
                          <td className="px-4 py-3 text-sm text-gray-600">number</td>
                          <td className="px-4 py-3 text-sm text-gray-600">50</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Number of transactions to return (max: 100)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">offset</td>
                          <td className="px-4 py-3 text-sm text-gray-600">number</td>
                          <td className="px-4 py-3 text-sm text-gray-600">0</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Number of transactions to skip (for pagination)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`curl -X GET "https://api.pexipay.com/v1/api/payments?limit=20&offset=0" \\
  -H "Authorization: Bearer pxp_test_your_api_key"`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`curl -X GET "https://api.pexipay.com/v1/api/payments?limit=20&offset=0" \\
  -H "Authorization: Bearer pxp_test_your_api_key"`}</code>
                    </pre>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response</h3>
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <button
                      onClick={() => copyCode(`{
  "transactions": [
    {
      "id": "txn_1234567890",
      "externalId": "order_12345",
      "amount": 5000,
      "currency": "USD",
      "status": "SUCCEEDED",
      "paymentMethod": "CARD",
      "customerEmail": "customer@example.com",
      "createdAt": "2025-11-21T10:30:00Z",
      "processedAt": "2025-11-21T10:30:45Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`{
  "transactions": [
    {
      "id": "txn_1234567890",
      "externalId": "order_12345",
      "amount": 5000,
      "currency": "USD",
      "status": "SUCCEEDED",
      "paymentMethod": "CARD",
      "customerEmail": "customer@example.com",
      "createdAt": "2025-11-21T10:30:00Z",
      "processedAt": "2025-11-21T10:30:45Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Get Transaction */}
            {activeTab === 'get-transaction' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Transaction</h2>
                  <p className="text-gray-700 mb-4">
                    Retrieves detailed information about a specific transaction.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-2">
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">GET</span>
                      <code className="text-green-900 font-mono text-sm mt-1">/api/payments/:id</code>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Path Parameters</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Parameter</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">id</td>
                          <td className="px-4 py-3 text-sm text-gray-600">string</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Transaction ID</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`curl -X GET "https://api.pexipay.com/v1/api/payments/txn_1234567890" \\
  -H "Authorization: Bearer pxp_test_your_api_key"`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`curl -X GET "https://api.pexipay.com/v1/api/payments/txn_1234567890" \\
  -H "Authorization: Bearer pxp_test_your_api_key"`}</code>
                    </pre>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response</h3>
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <button
                      onClick={() => copyCode(`{
  "transaction": {
    "id": "txn_1234567890",
    "externalId": "order_12345",
    "amount": 5000,
    "currency": "USD",
    "status": "SUCCEEDED",
    "paymentMethod": "CARD",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "customerIp": "192.168.1.1",
    "fraudScore": 15,
    "fraudStatus": "CLEAN",
    "merchantFee": 145,
    "superMerchantFee": 50,
    "pspFee": 0,
    "netAmount": 4805,
    "requires3DS": false,
    "circoFlowsId": "cf_abc123",
    "circoFlowsStatus": "succeeded",
    "metadata": {
      "orderId": "12345",
      "productId": "prod_abc"
    },
    "createdAt": "2025-11-21T10:30:00Z",
    "processedAt": "2025-11-21T10:30:45Z",
    "updatedAt": "2025-11-21T10:30:45Z"
  }
}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`{
  "transaction": {
    "id": "txn_1234567890",
    "externalId": "order_12345",
    "amount": 5000,
    "currency": "USD",
    "status": "SUCCEEDED",
    "paymentMethod": "CARD",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "customerIp": "192.168.1.1",
    "fraudScore": 15,
    "fraudStatus": "CLEAN",
    "merchantFee": 145,
    "superMerchantFee": 50,
    "pspFee": 0,
    "netAmount": 4805,
    "requires3DS": false,
    "circoFlowsId": "cf_abc123",
    "circoFlowsStatus": "succeeded",
    "metadata": {
      "orderId": "12345",
      "productId": "prod_abc"
    },
    "createdAt": "2025-11-21T10:30:00Z",
    "processedAt": "2025-11-21T10:30:45Z",
    "updatedAt": "2025-11-21T10:30:45Z"
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Webhooks */}
            {activeTab === 'webhooks' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhooks</h2>
                  <p className="text-gray-700 mb-4">
                    Webhooks allow you to receive real-time notifications when payment events occur. PexiPay sends HTTP POST requests to your webhook endpoint.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Types</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Event</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">payment.succeeded</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment completed successfully</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">payment.failed</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment failed or was declined</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">payment.processing</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment is being processed</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">payment.refunded</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment was refunded</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Webhook Payload</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`{
  "event": "payment.succeeded",
  "transactionId": "txn_1234567890",
  "amount": 5000,
  "currency": "USD",
  "status": "SUCCEEDED",
  "customerEmail": "customer@example.com",
  "metadata": {
    "orderId": "12345"
  },
  "timestamp": "2025-11-21T10:30:45Z"
}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`{
  "event": "payment.succeeded",
  "transactionId": "txn_1234567890",
  "amount": 5000,
  "currency": "USD",
  "status": "SUCCEEDED",
  "customerEmail": "customer@example.com",
  "metadata": {
    "orderId": "12345"
  },
  "timestamp": "2025-11-21T10:30:45Z"
}`}</code>
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                      <div className="text-sm text-yellow-900">
                        <p className="font-semibold mb-1">Best Practices</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Always verify webhook signatures</li>
                          <li>Return 200 OK quickly (process async if needed)</li>
                          <li>Implement idempotency to handle duplicate events</li>
                          <li>Use HTTPS endpoints only</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Codes */}
            {activeTab === 'errors' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Codes</h2>
                  <p className="text-gray-700 mb-4">
                    PexiPay uses conventional HTTP response codes to indicate the success or failure of an API request.
                  </p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">HTTP Status Codes</h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Code</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">200</td>
                          <td className="px-4 py-3 text-sm text-green-600 font-semibold">OK</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Request succeeded</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">400</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-semibold">Bad Request</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Invalid request data or parameters</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">401</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-semibold">Unauthorized</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Invalid or missing API key</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">403</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-semibold">Forbidden</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Insufficient permissions or blocked by fraud detection</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">404</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-semibold">Not Found</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Resource not found</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">429</td>
                          <td className="px-4 py-3 text-sm text-yellow-600 font-semibold">Too Many Requests</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Rate limit exceeded</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">500</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-semibold">Internal Server Error</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Something went wrong on our end</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Error Response Format</h3>
                  <div className="bg-gray-900 rounded-lg p-4 mb-6 relative">
                    <button
                      onClick={() => copyCode(`{
  "error": "Invalid request data",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}`)}
                      className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition"
                    >
                      <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    <pre className="text-gray-300 text-sm overflow-x-auto">
                      <code>{`{
  "error": "Invalid request data",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}`}</code>
                    </pre>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction Status Codes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">PENDING</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment created, awaiting processing</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">PROCESSING</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment is being processed</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">SUCCEEDED</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment completed successfully</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">FAILED</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment failed or was declined</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">REFUNDED</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment was refunded</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">CANCELLED</td>
                          <td className="px-4 py-3 text-sm text-gray-700">Payment was cancelled by customer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
