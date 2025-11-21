'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

function Mock3DSContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [authenticating, setAuthenticating] = useState(false);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);

  const handleAuthenticate = async (success: boolean) => {
    setAuthenticating(true);
    
    // Simulate 3DS authentication delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (success) {
      setResult('success');
      // Redirect back to checkout/success after 2 seconds
      setTimeout(() => {
        router.push(`/test-shop/success?transactionId=${id}&status=COMPLETED`);
      }, 2000);
    } else {
      setResult('failed');
      setTimeout(() => {
        router.push('/test-shop/checkout?error=3ds_failed');
      }, 2000);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <XCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
          <p className="text-gray-600 mb-6">No transaction ID provided</p>
          <button
            onClick={() => router.push('/test-shop')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (result === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Successful!</h1>
          <p className="text-gray-600 mb-6">Your payment has been verified. Redirecting...</p>
          <div className="animate-pulse text-blue-600">Completing payment...</div>
        </div>
      </div>
    );
  }

  if (result === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <XCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
          <p className="text-gray-600 mb-6">3D Secure verification was not successful. Redirecting...</p>
          <div className="animate-pulse text-red-600">Returning to checkout...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <ShieldCheckIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">3D Secure Authentication</h1>
          <p className="text-gray-600">Additional verification required for your security</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Transaction ID</span>
            <code className="text-xs font-mono text-blue-600">{id.substring(0, 16)}...</code>
          </div>
          <div className="text-xs text-gray-500 mt-3">
            <strong>Test Mode:</strong> This is a simulated 3D Secure authentication page. 
            In production, this would be your bank's authentication page.
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Verification Steps:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Confirm your identity using the method below</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Click "Authenticate" to approve the payment</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>You'll be redirected back to complete your purchase</span>
              </li>
            </ol>
          </div>
        </div>

        {authenticating ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Authenticating...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => handleAuthenticate(true)}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Authenticate Payment
            </button>
            
            <button
              onClick={() => handleAuthenticate(false)}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <XCircleIcon className="w-5 h-5" />
              Decline (Test Failure)
            </button>

            <button
              onClick={() => router.push('/test-shop/checkout')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            <strong>Secure Connection:</strong> Your payment information is encrypted and secure.
            This transaction is protected by 3D Secure technology.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Mock3DSPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <Mock3DSContent />
    </Suspense>
  );
}
