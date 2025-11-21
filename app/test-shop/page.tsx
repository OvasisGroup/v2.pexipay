'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCartIcon, 
  CreditCardIcon,
  ShoppingBagIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    image: '/images/products/headphones.jpg',
    category: 'Electronics',
  },
  {
    id: 'prod_2',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking and notifications',
    price: 399.99,
    image: '/images/products/smartwatch.jpg',
    category: 'Electronics',
  },
  {
    id: 'prod_3',
    name: 'Laptop Backpack',
    description: 'Durable backpack with laptop compartment',
    price: 79.99,
    image: '/images/products/backpack.jpg',
    category: 'Accessories',
  },
  {
    id: 'prod_4',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 49.99,
    image: '/images/products/mouse.jpg',
    category: 'Electronics',
  },
  {
    id: 'prod_5',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI and card readers',
    price: 59.99,
    image: '/images/products/usb-hub.jpg',
    category: 'Accessories',
  },
  {
    id: 'prod_6',
    name: 'Desk Lamp LED',
    description: 'Adjustable LED desk lamp with touch controls',
    price: 45.00,
    image: '/images/products/lamp.jpg',
    category: 'Home',
  },
];

export default function TestShopPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`Added another ${product.name} to cart`);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
      toast.success(`${product.name} added to cart`);
    }
    
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    setCart(cart.filter(item => item.product.id !== productId));
    if (item) {
      toast.success(`${item.product.name} removed from cart`);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = () => {
    // Store cart in sessionStorage for checkout page
    sessionStorage.setItem('testShopCart', JSON.stringify(cart));
    router.push('/test-shop/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBagIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PexiPay Test Shop</h1>
                <p className="text-sm text-gray-600">Demo payment integration</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-6xl">🎧</div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className={`lg:col-span-1 ${showCart ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCartIcon className="w-6 h-6" />
                Shopping Cart
              </h3>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-100 rounded hover:bg-gray-200 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="font-semibold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-blue-600">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
