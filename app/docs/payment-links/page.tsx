'use client';

import Link from 'next/link';

export default function PaymentLinksDocumentation() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">PexiPay</span>
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Payment Links Documentation</span>
            </div>
            <Link
              href="/docs/api"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              ← Back to API Docs
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-8 md:p-12">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Links API</h1>
              <p className="text-lg text-gray-600">
                Create secure, shareable payment links for your customers using the CircoFlows Hosted Payment API.
              </p>
            </div>

            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">
                Payment links provide a simple way to collect payments without building a custom checkout flow. 
                Simply create a link, share it with your customer, and they can complete the payment securely 
                through our hosted payment page.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Key Benefits</h3>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>No coding required - create links through the dashboard</li>
                  <li>PCI compliant - we handle all payment data securely</li>
                  <li>Mobile optimized - works on all devices</li>
                  <li>Customizable - add customer info, descriptions, and expiration</li>
                  <li>Real-time notifications via webhooks</li>
                </ul>
              </div>
            </section>

            {/* Quick Start */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Create via Dashboard</h3>
                  <p className="text-gray-700">
                    Log in to your super-merchant dashboard and click the &quot;Create Payment Link&quot; button. 
                    Fill in the amount, description, and optional customer information.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2. Share the Link</h3>
                  <p className="text-gray-700">
                    Copy the generated payment URL and share it with your customer via email, SMS, 
                    or any messaging platform.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">3. Customer Pays</h3>
                  <p className="text-gray-700">
                    Your customer clicks the link, enters their payment details on the secure hosted page, 
                    and completes the transaction.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">4. Get Notified</h3>
                  <p className="text-gray-700">
                    Receive real-time webhook notifications when the payment is completed, failed, or expires.
                  </p>
                </div>
              </div>
            </section>

            {/* API Reference */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>
              
              {/* Create Payment Link */}
              <div className="mb-8">
                <div className="bg-gray-900 text-white px-4 py-3 rounded-t-lg font-mono text-sm">
                  <span className="text-green-400">POST</span> /api/super-merchant/payment-links
                </div>
                <div className="border border-gray-300 rounded-b-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Create a Payment Link</h3>
                  <p className="text-gray-700 mb-4">
                    Creates a new hosted payment session and returns a shareable payment URL.
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-2">Request Headers</h4>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
                    <div>Authorization: Bearer YOUR_JWT_TOKEN</div>
                    <div>Content-Type: application/json</div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto">
                    <pre className="text-sm">
{`{
  "amount": 100.00,                    // Required: Amount in dollars
  "currency": "USD",                   // Required: Three-letter currency code
  "description": "Payment for Order",  // Required: Description shown to customer
  "customerInfo": {                    // Optional: Pre-fill customer information
    "name": "John Doe",
    "email": "customer@example.com",
    "phone": "+1234567890"
  },
  "expiresAt": "2025-12-31T23:59:59Z", // Optional: ISO 8601 expiration date
  "metadata": {                        // Optional: Additional data to store
    "orderId": "12345",
    "customField": "value"
  }
}`}
                    </pre>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`{
  "success": true,
  "paymentLink": {
    "sessionId": "sess_ABC123DEF456",
    "paymentUrl": "https://pay.circoflows.com/sess_ABC123DEF456",
    "amount": 100.00,
    "currency": "USD",
    "description": "Payment for Order",
    "status": "pending",
    "expiresAt": "2025-12-31T23:59:59Z",
    "createdAt": "2025-11-23T12:00:00Z"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Get Payment Link Status */}
              <div className="mb-8">
                <div className="bg-gray-900 text-white px-4 py-3 rounded-t-lg font-mono text-sm">
                  <span className="text-blue-400">GET</span> /api/super-merchant/payment-links?sessionId=&#123;sessionId&#125;
                </div>
                <div className="border border-gray-300 rounded-b-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Check Payment Link Status</h3>
                  <p className="text-gray-700 mb-4">
                    Retrieves the current status of a payment link session.
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="text-sm">
                      <code className="text-red-600">sessionId</code> (required) - The session ID returned when creating the payment link
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
{`{
  "success": true,
  "status": {
    "session_id": "sess_ABC123DEF456",
    "amount": 10000,
    "currency": "USD",
    "description": "Payment for Order",
    "status": "completed",            // pending, completed, expired, cancelled
    "transaction_id": "txn_XYZ789",   // Only if completed
    "customer_info": {
      "name": "John Doe",
      "email": "customer@example.com"
    },
    "created_at": "2025-11-23T12:00:00Z",
    "completed_at": "2025-11-23T12:05:00Z"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Statuses */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Statuses</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-yellow-600">pending</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Payment link created, awaiting payment</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">completed</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Payment successfully processed</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">failed</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Payment attempt failed</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">expired</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Payment link expired before completion</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-gray-600">cancelled</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Payment link was cancelled</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Code Examples */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
              
              {/* JavaScript/TypeScript */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">JavaScript / TypeScript</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`const createPaymentLink = async () => {
  const response = await fetch('/api/super-merchant/payment-links', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: 250.00,
      currency: 'USD',
      description: 'Premium Subscription - Annual',
      customerInfo: {
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      expiresAt: '2025-12-31T23:59:59Z',
    }),
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('Payment URL:', data.paymentLink.paymentUrl);
    // Share this URL with your customer
  }
};`}
                  </pre>
                </div>
              </div>

              {/* Python */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Python</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`import requests

def create_payment_link():
    url = 'https://yourapp.com/api/super-merchant/payment-links'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        'amount': 250.00,
        'currency': 'USD',
        'description': 'Premium Subscription - Annual',
        'customerInfo': {
            'name': 'Jane Smith',
            'email': 'jane@example.com'
        },
        'expiresAt': '2025-12-31T23:59:59Z'
    }
    
    response = requests.post(url, json=payload, headers=headers)
    data = response.json()
    
    if data['success']:
        print(f"Payment URL: {data['paymentLink']['paymentUrl']}")
        # Share this URL with your customer`}
                  </pre>
                </div>
              </div>

              {/* cURL */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">cURL</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`curl -X POST https://yourapp.com/api/super-merchant/payment-links \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 250.00,
    "currency": "USD",
    "description": "Premium Subscription - Annual",
    "customerInfo": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "expiresAt": "2025-12-31T23:59:59Z"
  }'`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Webhooks */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhook Notifications</h2>
              <p className="text-gray-700 mb-4">
                When a payment link is used, CircoFlows will send webhook notifications to your configured webhook URL. 
                You&apos;ll receive notifications for the following events:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>payment.succeeded</strong> - Payment completed successfully</li>
                <li><strong>payment.failed</strong> - Payment failed or was declined</li>
                <li><strong>payment.pending</strong> - Payment is pending (e.g., 3DS authentication)</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important</h3>
                <p className="text-yellow-800">
                  Always verify webhook signatures to ensure the request is legitimate. 
                  See the <Link href="/docs/api#webhooks" className="text-blue-600 hover:underline">Webhooks documentation</Link> for details.
                </p>
              </div>
            </section>

            {/* Best Practices */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">✓ Set Expiration Dates</h3>
                  <p className="text-gray-700">
                    Always set an expiration date for payment links to prevent old links from being used indefinitely.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">✓ Include Customer Information</h3>
                  <p className="text-gray-700">
                    Pre-filling customer details improves the checkout experience and reduces errors.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">✓ Use Descriptive Descriptions</h3>
                  <p className="text-gray-700">
                    Clear descriptions help customers understand what they&apos;re paying for and reduce disputes.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">✓ Store Session IDs</h3>
                  <p className="text-gray-700">
                    Keep track of session IDs in your database to reconcile payments and check statuses later.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">✓ Monitor Webhook Events</h3>
                  <p className="text-gray-700">
                    Implement robust webhook handling to receive real-time payment notifications and update your systems accordingly.
                  </p>
                </div>
              </div>
            </section>

            {/* Support */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  If you have questions or need assistance with payment links, we&apos;re here to help:
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/docs/api"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Full API Docs
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Contact Support
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
