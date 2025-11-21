import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            PexiPay PSP Platform
          </h1>
          <p className="text-xl text-gray-700 mb-12">
            Complete Payment Service Provider solution with super-merchant management, 
            KYC workflows, fraud detection, and seamless CircoFlows integration.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Merchants</h2>
              <p className="text-gray-600 mb-6">
                Accept payments, manage transactions, and monitor your business performance.
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/register?type=merchant"
                  className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  Register as Merchant
                </Link>
                <Link
                  href="/auth/login"
                  className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">For Super-Merchants</h2>
              <p className="text-gray-600 mb-6">
                Manage multiple sub-merchants, earn commissions, and scale your payment business.
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/register?type=super-merchant"
                  className="block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register as Super-Merchant
                </Link>
                <Link
                  href="/auth/login"
                  className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg hover:bg-gray-200 transition"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-blue-600 text-4xl mb-3">🔐</div>
                <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
                <p className="text-gray-600 text-sm">
                  JWT-based auth, API key management, and role-based access control.
                </p>
              </div>
              <div>
                <div className="text-blue-600 text-4xl mb-3">📄</div>
                <h3 className="text-lg font-semibold mb-2">KYC Workflows</h3>
                <p className="text-gray-600 text-sm">
                  Document upload, automated checks, and manual review queue.
                </p>
              </div>
              <div>
                <div className="text-blue-600 text-4xl mb-3">🛡️</div>
                <h3 className="text-lg font-semibold mb-2">Fraud Detection</h3>
                <p className="text-gray-600 text-sm">
                  Rule-based engine with velocity checks and pattern scoring.
                </p>
              </div>
              <div>
                <div className="text-blue-600 text-4xl mb-3">💳</div>
                <h3 className="text-lg font-semibold mb-2">Payment Processing</h3>
                <p className="text-gray-600 text-sm">
                  Direct integration with CircoFlows for card payments and 3DS.
                </p>
              </div>
              <div>
                <div className="text-blue-600 text-4xl mb-3">💰</div>
                <h3 className="text-lg font-semibold mb-2">Settlement System</h3>
                <p className="text-gray-600 text-sm">
                  Automated daily settlements with full ledger tracking.
                </p>
              </div>
              <div>
                <div className="text-blue-600 text-4xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Real-time transaction monitoring and business insights.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6">
              Join PexiPay today and start processing payments with confidence.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Sign Up Now
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
