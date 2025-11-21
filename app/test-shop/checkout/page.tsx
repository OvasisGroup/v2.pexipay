'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCardIcon, 
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';
import CardForm, { CardData } from '@/components/CardForm';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  const [billingInfo, setBillingInfo] = useState({
    email: 'customer@example.com',
    name: 'Test Customer',
  });

  useEffect(() => {
    const cartData = sessionStorage.getItem('testShopCart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    } else {
      router.push('/test-shop');
    }
  }, [router]);

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCardSubmit = async (cardData: CardData) => {
    setLoading(true);

    try {
      // Get API key from localStorage (for demo purposes)
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to make a payment');
        setLoading(false);
        return;
      }

      // Create direct payment with card details
      const response = await fetch('/api/payments/direct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartTotal,
          currency: 'USD',
          customerEmail: billingInfo.email,
          customerName: billingInfo.name,
          ...cardData,
          metadata: {
            source: 'test-shop',
            items: cart.map(item => ({
              productId: item.product.id,
              productName: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Handle different payment statuses
      if (data.requires3DS) {
        // Redirect to 3D Secure authentication
        toast.success('Additional authentication required...');
        window.location.href = data.threeDSUrl;
        return;
      }

      if (data.status === 'COMPLETED') {
        // Payment successful
        toast.success('Payment successful!');
        setTransactionId(data.transactionId);
        setPaymentSuccessful(true);
        
        // Clear cart
        sessionStorage.removeItem('testShopCart');
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push(`/test-shop/success?transactionId=${data.transactionId}&status=${data.status}`);
        }, 2000);
      } else {
        throw new Error('Payment processing failed');
      }

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  // Show success state
  if (paymentSuccessful) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">Your order has been processed successfully.</p>
            {transactionId && (
              <p className="text-sm text-gray-500 mb-6">
                Transaction ID: {transactionId}
              </p>
            )}
            <div className="animate-pulse text-blue-600">
              Redirecting to order confirmation...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/test-shop"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Shop
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCardIcon className="w-8 h-8 text-blue-600" />
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>
              
              {/* Basic customer info */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={billingInfo.name}
                    onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <CardForm onSubmit={handleCardSubmit} loading={loading} />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600 text-xl">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-800">
                  <strong>Test Mode:</strong> No real payment will be processed. This is a demonstration of the PexiPay payment integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
