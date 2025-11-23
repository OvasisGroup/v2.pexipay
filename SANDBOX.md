# PexiPay Sandbox Environment

## Overview

The PexiPay sandbox environment allows you to test payment flows without processing real transactions. All API calls in sandbox mode use test API keys and test card numbers.

## Getting Started

### 1. Get Sandbox API Keys

Sandbox API keys start with `pxp_test_`:
- Log in to your dashboard
- Go to **Settings** → **API Keys**
- Copy your **Sandbox API Key**

### 2. Test Card Numbers

Use these test card numbers to simulate different payment scenarios:

#### ✅ Successful Payments

| Card Number | Brand | Description |
|------------|-------|-------------|
| `4242424242424242` | Visa | Standard success |
| `4111111111111111` | Visa | Alternative success |
| `5555555555554444` | Mastercard | Success |
| `378282246310005` | American Express | Success |

**Valid Expiry:** Any future date (e.g., `12/25`)  
**Valid CVV:** Any 3 digits (e.g., `123`) or 4 for Amex (e.g., `1234`)

#### 🔐 3D Secure Required

| Card Number | Description |
|------------|-------------|
| `4000000000003220` | Requires 3DS authentication |
| `4000002500003155` | Alternative 3DS card |

These cards will return a `requires_action` status with a 3DS URL.

#### ❌ Declined Payments

| Card Number | Error Type | Message |
|------------|-----------|---------|
| `4000000000000002` | Generic decline | "Your card was declined" |
| `4000000000009995` | Insufficient funds | "Insufficient funds" |
| `4000000000000069` | Expired card | "Your card has expired" |
| `4000000000000127` | Incorrect CVC | "Incorrect CVC code" |
| `4000000000000119` | Processing error | "An error occurred while processing your card" |

## API Usage

### Create a Direct Payment

```bash
curl -X POST https://api.pexipay.com/api/payments/direct \
  -H "Authorization: Bearer pxp_test_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "USD",
    "customerEmail": "customer@example.com",
    "customerName": "John Doe",
    "cardNumber": "4242424242424242",
    "cardExpiry": "12/25",
    "cardCvv": "123",
    "cardHolderName": "John Doe",
    "billingAddress": {
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }
  }'
```

### Successful Response

```json
{
  "transactionId": "sandbox_1234567890_abc123",
  "status": "succeeded",
  "amount": 1000,
  "currency": "USD",
  "message": "Payment successful",
  "gatewayTransactionId": "gw_abc123def456"
}
```

### Failed Response

```json
{
  "transactionId": "sandbox_1234567890_xyz789",
  "status": "failed",
  "amount": 1000,
  "currency": "USD",
  "message": "Payment declined",
  "failureCode": "card_declined",
  "failureMessage": "Your card was declined"
}
```

### 3D Secure Response

```json
{
  "transactionId": "sandbox_1234567890_3ds456",
  "status": "requires_action",
  "amount": 1000,
  "currency": "USD",
  "message": "3D Secure authentication required",
  "requires3DS": true,
  "threeDSUrl": "https://api.pexipay.com/sandbox/3ds?payment=sandbox_1234567890_3ds456"
}
```

## Testing Scenarios

### Test Successful Payment

```javascript
const payment = {
  amount: 1000, // $10.00
  currency: 'USD',
  cardNumber: '4242424242424242', // Success card
  cardExpiry: '12/25',
  cardCvv: '123',
  cardHolderName: 'Test User',
  billingAddress: {
    line1: '123 Test St',
    city: 'Test City',
    postalCode: '12345',
    country: 'US'
  }
};
```

### Test 3D Secure Flow

```javascript
const payment = {
  amount: 5000, // $50.00
  currency: 'USD',
  cardNumber: '4000000000003220', // 3DS required
  cardExpiry: '12/25',
  cardCvv: '123',
  cardHolderName: 'Test User',
  billingAddress: {
    line1: '123 Test St',
    city: 'Test City',
    postalCode: '12345',
    country: 'US'
  }
};

// 1. Submit payment - returns requires_action
// 2. Redirect to threeDSUrl
// 3. Complete authentication (auto-succeeds in sandbox)
// 4. Webhook receives payment.succeeded event
```

### Test Declined Payment

```javascript
const payment = {
  amount: 2000, // $20.00
  currency: 'USD',
  cardNumber: '4000000000000002', // Declined card
  cardExpiry: '12/25',
  cardCvv: '123',
  cardHolderName: 'Test User',
  billingAddress: {
    line1: '123 Test St',
    city: 'Test City',
    postalCode: '12345',
    country: 'US'
  }
};
```

## Webhooks in Sandbox

Sandbox webhooks work exactly like production webhooks. Set up webhook URLs in your dashboard to receive real-time notifications about payment events.

### Test Webhook Events

```json
{
  "event": "payment.succeeded",
  "data": {
    "id": "sandbox_1234567890_abc123",
    "amount": 1000,
    "currency": "USD",
    "status": "succeeded",
    "merchantId": "your_merchant_id",
    "createdAt": "2025-11-22T12:00:00.000Z"
  }
}
```

## Amounts & Behavior

- **Any amount** can be tested in sandbox
- Payments are **never actually charged**
- All data is **isolated** from production
- Sandbox data is **automatically cleared** after 30 days

## Switching to Production

When ready to go live:

1. Replace `pxp_test_` API key with `pxp_live_` production key
2. Use real card numbers (test cards will be declined)
3. Update webhook URLs to production endpoints
4. Enable production mode in your environment variables:
   ```
   CIRCOFLOWS_TEST_MODE=false
   ```

## Limits

- **Rate limit:** 100 requests/minute
- **Daily transactions:** Unlimited
- **Retention:** 30 days

## Support

Need help testing? Contact support@pexipay.com or visit our [documentation](https://docs.pexipay.com).
