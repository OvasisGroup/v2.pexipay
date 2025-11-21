'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const status = searchParams.get('status') || 'COMPLETED';

  useEffect(() => {
    // Clear cart
    sessionStorage.removeItem('testShopCart');
  }, []);

  const webhookUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {transactionId && (
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                <code className="text-lg font-mono text-blue-600">{transactionId}</code>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  {status}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <a
              href={`${webhookUrl}/api/webhooks/circoflows`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold items-center justify-center gap-2"
            >
              View Webhook URL
              <ArrowRightIcon className="w-5 h-5" />
            </a>
            
            <Link
              href="/test-shop"
              className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Continue Shopping
            </Link>
            
            <Link
              href="/merchant/dashboard"
              className="flex w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold items-center justify-center gap-2"
            >
              View in Dashboard
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
