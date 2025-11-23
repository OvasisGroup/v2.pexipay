'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function CreatePaymentLink() {
  const router = useRouter();
  const [paymentLinkForm, setPaymentLinkForm] = useState({
    amount: '',
    currency: 'USD',
    description: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    expiresAt: '',
  });
  const [createdPaymentLink, setCreatedPaymentLink] = useState<{
    paymentUrl: string;
    sessionId: string;
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreatedPaymentLink(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again');
        return;
      }

      // Prepare expiration date if provided
      let expiresAt = undefined;
      if (paymentLinkForm.expiresAt) {
        expiresAt = new Date(paymentLinkForm.expiresAt).toISOString();
      }

      const response = await fetch('/api/super-merchant/payment-links', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(paymentLinkForm.amount),
          currency: paymentLinkForm.currency,
          description: paymentLinkForm.description,
          customerInfo: paymentLinkForm.customerName || paymentLinkForm.customerEmail ? {
            name: paymentLinkForm.customerName || undefined,
            email: paymentLinkForm.customerEmail || undefined,
            phone: paymentLinkForm.customerPhone || undefined,
          } : undefined,
          expiresAt,
          metadata: {
            source: 'super-merchant-dashboard'
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment link');
      }

      if (data.success && data.paymentLink) {
        setCreatedPaymentLink({
          paymentUrl: data.paymentLink.paymentUrl,
          sessionId: data.paymentLink.sessionId,
        });
        
        // Reset form
        setPaymentLinkForm({
          amount: '',
          currency: 'USD',
          description: '',
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          expiresAt: '',
        });
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      alert(error instanceof Error ? error.message : 'Failed to create payment link');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <DashboardLayout requiredRole="SUPER_MERCHANT">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/super-merchant/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Payment Link</h1>
          <p className="text-gray-600 mt-2">
            Generate a secure payment link to share with your customers. They can pay directly through the link.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {createdPaymentLink ? (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-900 mb-1">Payment Link Created Successfully!</h3>
                          <p className="text-sm text-green-700">Share this link with your customer to collect payment securely.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={createdPaymentLink.paymentUrl}
                          readOnly
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(createdPaymentLink.paymentUrl)}
                          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Share this link via email, SMS, or any messaging platform.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session ID</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={createdPaymentLink.sessionId}
                          readOnly
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(createdPaymentLink.sessionId)}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Use this ID to track the payment status and webhook events.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setCreatedPaymentLink(null);
                        }}
                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                      >
                        Create Another Link
                      </button>
                      <button
                        onClick={() => {
                          window.open(createdPaymentLink.paymentUrl, '_blank');
                        }}
                        className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview Payment Page
                      </button>
                      <Link
                        href="/super-merchant/dashboard"
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                      >
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCreatePaymentLink} className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            value={paymentLinkForm.amount}
                            onChange={(e) => setPaymentLinkForm({ ...paymentLinkForm, amount: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="100.00"
                          />
                        </div>

                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={paymentLinkForm.currency}
                            onChange={(e) => setPaymentLinkForm({ ...paymentLinkForm, currency: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={paymentLinkForm.description}
                        onChange={(e) => setPaymentLinkForm({ ...paymentLinkForm, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Payment for Order #12345"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Provide a clear description that your customer will see on the payment page.
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information (Optional)</h2>
                      <p className="text-sm text-gray-600 mb-4">
                        Pre-fill customer information to make the payment process faster. This information can still be edited by the customer.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                          <input
                            type="text"
                            value={paymentLinkForm.customerName}
                            onChange={(e) => setPaymentLinkForm({ ...paymentLinkForm, customerName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                          <input
                            type="email"
                            value={paymentLinkForm.customerEmail}
                            onChange={(e) => setPaymentLinkForm({ ...paymentLinkForm, customerEmail: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="customer@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
                          <input
                            type="tel"
                            value={paymentLinkForm.customerPhone}
                            onChange={(e) => setPaymentLinkForm({ ...paymentLinkForm, customerPhone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="+1234567890"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h2>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration Date/Time (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={paymentLinkForm.expiresAt}
                          onChange={(e) => setPaymentLinkForm({ ...paymentLinkForm, expiresAt: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Set an expiration date to automatically invalidate the payment link after this time. Leave blank for no expiration.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                      <Link
                        href="/super-merchant/dashboard"
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isCreating ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            Create Payment Link
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar with Tips */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tips
              </h3>
              <div className="space-y-4 text-sm text-blue-900">
                <div>
                  <p className="font-semibold mb-1">✓ Share Securely</p>
                  <p className="text-blue-800">Only share payment links with your intended customers. Each link is unique and traceable.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">✓ Track Payments</p>
                  <p className="text-blue-800">Use the session ID to track payment status via the API or receive webhook notifications.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">✓ Set Expiration</p>
                  <p className="text-blue-800">Add an expiration date for time-sensitive payments to prevent unauthorized late payments.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">✓ Customer Info</p>
                  <p className="text-blue-800">Pre-filling customer information speeds up the checkout process and reduces errors.</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <Link 
                  href="/docs/payment-links"
                  className="text-sm text-blue-700 hover:text-blue-800 underline"
                >
                  View Payment Links Documentation →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
