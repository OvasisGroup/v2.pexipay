'use client';

import { useState } from 'react';

interface CardFormProps {
  onSubmit: (cardData: CardData) => void;
  loading?: boolean;
}

export interface CardData {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardHolderName: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}

export default function CardForm({ onSubmit, loading = false }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NY');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format card number (add spaces every 4 digits)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry (MM/YY)
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Validate card number using Luhn algorithm
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Detect card type
  const getCardType = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    return 'Unknown';
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Card number
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry
    if (!cardExpiry) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = cardExpiry.split('/').map(Number);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.cardExpiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.cardExpiry = 'Card expired';
      }
    }

    // CVV
    if (!cardCvv) {
      newErrors.cardCvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      newErrors.cardCvv = 'Invalid CVV';
    }

    // Card holder name
    if (!cardHolderName.trim()) {
      newErrors.cardHolderName = 'Card holder name is required';
    }

    // Billing address
    if (!line1.trim()) newErrors.line1 = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const cardData: CardData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      cardExpiry,
      cardCvv,
      cardHolderName,
      billingAddress: {
        line1,
        line2: line2 || undefined,
        city,
        state,
        postalCode,
        country,
      },
    };

    onSubmit(cardData);
  };

  const cardType = getCardType(cardNumber);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
        
        {/* Card Number */}
        <div className="mb-4">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {cardType !== 'Unknown' && (
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">
                {cardType}
              </span>
            )}
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              id="cardExpiry"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.cardExpiry && (
              <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
            )}
          </div>

          {/* CVV */}
          <div>
            <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              id="cardCvv"
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cardCvv ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.cardCvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cardCvv}</p>
            )}
          </div>
        </div>

        {/* Card Holder Name */}
        <div className="mt-4">
          <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            id="cardHolderName"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            placeholder="JOHN DOE"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
              errors.cardHolderName ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.cardHolderName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardHolderName}</p>
          )}
        </div>
      </div>

      {/* Billing Address Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h3>

        {/* Address Line 1 */}
        <div className="mb-4">
          <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 1
          </label>
          <input
            type="text"
            id="line1"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            placeholder="123 Main Street"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.line1 ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {errors.line1 && (
            <p className="mt-1 text-sm text-red-600">{errors.line1}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="mb-4">
          <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-2">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="line2"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Apt 4B"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="NY"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
              required
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="10001"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="NL">Netherlands</option>
              <option value="BE">Belgium</option>
              <option value="CH">Switzerland</option>
              <option value="SE">Sweden</option>
              <option value="NO">Norway</option>
              <option value="DK">Denmark</option>
              <option value="FI">Finland</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-800">
              Your card details are transmitted securely using industry-standard encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-secondary/90 focus:ring-4 focus:ring-secondary focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
}
