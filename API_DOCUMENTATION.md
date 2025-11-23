# PexiPay API Documentation

## Introduction

Welcome to the PexiPay API documentation. This guide will help you integrate payment processing into your application. Our API uses REST principles, accepts JSON requests, and returns JSON responses.

**Base URLs:**
- **Sandbox:** `https://sandbox-api.pexipay.com` (or `http://localhost:3000` for local testing)
- **Production:** `https://api.pexipay.com`

---

## Authentication

All API requests require authentication using your API key. Include your API key in the `Authorization` header using Bearer authentication.

```http
Authorization: Bearer YOUR_API_KEY
```

### API Key Types

- **Sandbox Keys:** Start with `pxp_test_` - Use for testing without processing real payments
- **Production Keys:** Start with `pxp_live_` - Use for processing real payments

⚠️ **Never share your API keys or commit them to version control.**

---

## Environments

### Sandbox Environment

The sandbox environment is a complete replica of production where you can test your integration without processing real payments.

**Features:**
- Test card numbers that simulate various scenarios
- All API endpoints available
- Webhook testing
- No real money charged
- Data automatically cleared after 30 days

**Get Started:**
1. Log in to your dashboard
2. Navigate to **Settings** → **API Keys**
3. Copy your **Sandbox API Key** (starts with `pxp_test_`)

### Production Environment

Use production for processing real payments with real cards.

**Requirements:**
- KYC verification completed
- Business documents submitted
- Production API key (starts with `pxp_live_`)

---

## Quick Start

### 1. Install HTTP Client

```bash
# Using cURL (included in most systems)
curl --version

# Or use your preferred language
npm install axios  # Node.js
pip install requests  # Python
```

### 2. Make Your First Payment Request

```bash
curl -X POST https://sandbox-api.pexipay.com/api/payments/direct \
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

### 3. Handle the Response

```json
{
  "transactionId": "txn_1234567890abcdef",
  "status": "succeeded",
  "amount": 1000,
  "currency": "USD",
  "message": "Payment successful"
}
```

---

## API Reference

## Payments

### Create Direct Payment

Process a payment directly using card details.

**Endpoint:** `POST /api/payments/direct`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | integer | Yes | Amount in smallest currency unit (e.g., cents). `1000` = $10.00 |
| `currency` | string | Yes | Three-letter ISO currency code (e.g., `USD`, `EUR`, `GBP`) |
| `cardNumber` | string | Yes | Card number (13-19 digits, no spaces) |
| `cardExpiry` | string | Yes | Card expiry in MM/YY format (e.g., `12/25`) |
| `cardCvv` | string | Yes | Card CVV/CVC code (3-4 digits) |
| `cardHolderName` | string | Yes | Name on the card |
| `billingAddress` | object | Yes | Billing address details |
| `billingAddress.line1` | string | Yes | Street address |
| `billingAddress.line2` | string | No | Apartment, suite, etc. |
| `billingAddress.city` | string | Yes | City |
| `billingAddress.state` | string | No | State/Province |
| `billingAddress.postalCode` | string | Yes | Postal/ZIP code |
| `billingAddress.country` | string | Yes | Two-letter ISO country code (e.g., `US`) |
| `customerEmail` | string | No | Customer's email address |
| `customerName` | string | No | Customer's full name |
| `externalId` | string | No | Your internal reference ID |
| `metadata` | object | No | Additional data (key-value pairs) |

**Example Request:**

```bash
curl -X POST https://api.pexipay.com/api/payments/direct \
  -H "Authorization: Bearer pxp_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2500,
    "currency": "USD",
    "customerEmail": "john.doe@example.com",
    "customerName": "John Doe",
    "externalId": "order_12345",
    "cardNumber": "4242424242424242",
    "cardExpiry": "12/25",
    "cardCvv": "123",
    "cardHolderName": "John Doe",
    "billingAddress": {
      "line1": "456 Commerce Blvd",
      "line2": "Suite 100",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94105",
      "country": "US"
    },
    "metadata": {
      "orderId": "12345",
      "productId": "prod_xyz",
      "customerId": "cust_789"
    }
  }'
```

**Success Response (200 OK):**

```json
{
  "transactionId": "txn_1732301234567890",
  "status": "succeeded",
  "amount": 2500,
  "currency": "USD",
  "message": "Payment successful",
  "gatewayTransactionId": "gw_abc123def456",
  "createdAt": "2025-11-22T12:34:56.789Z"
}
```

**3D Secure Required Response (200 OK):**

When 3D Secure authentication is required:

```json
{
  "transactionId": "txn_1732301234567890",
  "status": "requires_action",
  "amount": 2500,
  "currency": "USD",
  "message": "3D Secure authentication required",
  "requires3DS": true,
  "threeDSUrl": "https://api.pexipay.com/3ds/authenticate?payment=txn_1732301234567890",
  "createdAt": "2025-11-22T12:34:56.789Z"
}
```

**Failed Response (200 OK):**

```json
{
  "transactionId": "txn_1732301234567890",
  "status": "failed",
  "amount": 2500,
  "currency": "USD",
  "message": "Payment declined",
  "failureCode": "card_declined",
  "failureMessage": "Your card was declined. Please try a different payment method.",
  "createdAt": "2025-11-22T12:34:56.789Z"
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "cardNumber",
      "message": "Card number must be between 13 and 19 digits"
    }
  ]
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```

---

### Get Payment Status

Retrieve the status of a payment transaction.

**Endpoint:** `GET /api/payments/{transactionId}`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `transactionId` | string | The transaction ID returned from create payment |

**Example Request:**

```bash
curl -X GET https://api.pexipay.com/api/payments/txn_1732301234567890 \
  -H "Authorization: Bearer pxp_live_YOUR_API_KEY"
```

**Success Response (200 OK):**

```json
{
  "transactionId": "txn_1732301234567890",
  "status": "succeeded",
  "amount": 2500,
  "currency": "USD",
  "customerEmail": "john.doe@example.com",
  "customerName": "John Doe",
  "externalId": "order_12345",
  "gatewayTransactionId": "gw_abc123def456",
  "createdAt": "2025-11-22T12:34:56.789Z",
  "completedAt": "2025-11-22T12:35:01.234Z",
  "metadata": {
    "orderId": "12345",
    "productId": "prod_xyz"
  }
}
```

---

### Refund Payment

Refund a completed payment, either partially or fully.

**Endpoint:** `POST /api/payments/{transactionId}/refund`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `transactionId` | string | The transaction ID to refund |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | integer | No | Amount to refund (defaults to full amount) |
| `reason` | string | No | Reason for refund |

**Example Request:**

```bash
curl -X POST https://api.pexipay.com/api/payments/txn_1732301234567890/refund \
  -H "Authorization: Bearer pxp_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "reason": "Customer returned product"
  }'
```

**Success Response (200 OK):**

```json
{
  "refundId": "ref_9876543210abcdef",
  "transactionId": "txn_1732301234567890",
  "status": "succeeded",
  "amount": 1000,
  "currency": "USD",
  "reason": "Customer returned product",
  "createdAt": "2025-11-22T14:20:30.123Z"
}
```

---

## Payment Statuses

| Status | Description |
|--------|-------------|
| `succeeded` | Payment completed successfully |
| `processing` | Payment is being processed |
| `requires_action` | Additional action required (e.g., 3D Secure) |
| `failed` | Payment failed or was declined |
| `canceled` | Payment was canceled |
| `refunded` | Payment was refunded |

---

## Testing with Sandbox

### Test Card Numbers

Use these test cards in the sandbox environment to simulate different scenarios.

#### ✅ Successful Payments

| Card Number | Brand | Description |
|------------|-------|-------------|
| `4242424242424242` | Visa | Payment succeeds |
| `4111111111111111` | Visa | Payment succeeds |
| `5555555555554444` | Mastercard | Payment succeeds |
| `378282246310005` | American Express | Payment succeeds |

**Valid Test Data:**
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`) or 4 for Amex

#### 🔐 3D Secure Authentication

| Card Number | Description |
|------------|-------------|
| `4000000000003220` | Requires 3D Secure authentication |
| `4000002500003155` | Requires 3D Secure (alternative) |

These cards return `requires_action` status with a `threeDSUrl`.

#### ❌ Declined Payments

| Card Number | Error Type | Error Message |
|------------|-----------|---------------|
| `4000000000000002` | Generic decline | "Your card was declined" |
| `4000000000009995` | Insufficient funds | "Insufficient funds" |
| `4000000000000069` | Expired card | "Your card has expired" |
| `4000000000000127` | Incorrect CVC | "Incorrect CVC code" |
| `4000000000000119` | Processing error | "An error occurred while processing your card" |

---

## Webhooks

Webhooks allow you to receive real-time notifications about payment events.

### Setting Up Webhooks

1. Log in to your dashboard
2. Navigate to **Settings** → **Webhooks**
3. Add your webhook endpoint URL
4. Select the events you want to receive
5. Copy your webhook signing secret

### Webhook Events

| Event | Description |
|-------|-------------|
| `payment.succeeded` | Payment completed successfully |
| `payment.failed` | Payment failed or was declined |
| `payment.refunded` | Payment was refunded |
| `payment.requires_action` | Payment requires additional action |

### Webhook Payload

```json
{
  "event": "payment.succeeded",
  "timestamp": "2025-11-22T12:35:01.234Z",
  "data": {
    "transactionId": "txn_1732301234567890",
    "status": "succeeded",
    "amount": 2500,
    "currency": "USD",
    "customerEmail": "john.doe@example.com",
    "externalId": "order_12345",
    "metadata": {
      "orderId": "12345",
      "productId": "prod_xyz"
    }
  }
}
```

### Verifying Webhook Signatures

Always verify webhook signatures to ensure requests are from PexiPay.

**Node.js Example:**

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express.js endpoint
app.post('/webhooks/pexipay', (req, res) => {
  const signature = req.headers['x-pexipay-signature'];
  const webhookSecret = process.env.PEXIPAY_WEBHOOK_SECRET;
  
  if (!verifyWebhookSignature(req.body, signature, webhookSecret)) {
    return res.status(401).send('Invalid signature');
  }
  
  const { event, data } = req.body;
  
  switch (event) {
    case 'payment.succeeded':
      // Update order status
      console.log('Payment succeeded:', data.transactionId);
      break;
    case 'payment.failed':
      // Handle failed payment
      console.log('Payment failed:', data.transactionId);
      break;
  }
  
  res.status(200).send('OK');
});
```

**Python Example:**

```python
import hmac
import hashlib
import json

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

# Flask endpoint
@app.route('/webhooks/pexipay', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Pexipay-Signature')
    webhook_secret = os.environ.get('PEXIPAY_WEBHOOK_SECRET')
    
    if not verify_webhook_signature(request.json, signature, webhook_secret):
        return 'Invalid signature', 401
    
    event = request.json.get('event')
    data = request.json.get('data')
    
    if event == 'payment.succeeded':
        print(f"Payment succeeded: {data['transactionId']}")
    elif event == 'payment.failed':
        print(f"Payment failed: {data['transactionId']}")
    
    return 'OK', 200
```

---

## Code Examples

### Node.js / JavaScript

```javascript
const axios = require('axios');

const pexipay = {
  apiKey: 'pxp_test_YOUR_API_KEY',
  baseUrl: 'https://sandbox-api.pexipay.com',
  
  async createPayment(paymentData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/payments/direct`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Payment failed:', error.response.data);
      throw error;
    }
  }
};

// Usage
const payment = await pexipay.createPayment({
  amount: 5000,
  currency: 'USD',
  customerEmail: 'customer@example.com',
  customerName: 'Jane Smith',
  cardNumber: '4242424242424242',
  cardExpiry: '12/25',
  cardCvv: '123',
  cardHolderName: 'Jane Smith',
  billingAddress: {
    line1: '789 Main Street',
    city: 'Austin',
    state: 'TX',
    postalCode: '78701',
    country: 'US'
  }
});

console.log('Payment successful:', payment.transactionId);
```

### Python

```python
import requests

class PexiPay:
    def __init__(self, api_key, sandbox=True):
        self.api_key = api_key
        self.base_url = 'https://sandbox-api.pexipay.com' if sandbox else 'https://api.pexipay.com'
    
    def create_payment(self, payment_data):
        response = requests.post(
            f'{self.base_url}/api/payments/direct',
            json=payment_data,
            headers={
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f'Payment failed: {response.text}')

# Usage
pexipay = PexiPay('pxp_test_YOUR_API_KEY', sandbox=True)

payment = pexipay.create_payment({
    'amount': 5000,
    'currency': 'USD',
    'customerEmail': 'customer@example.com',
    'customerName': 'Jane Smith',
    'cardNumber': '4242424242424242',
    'cardExpiry': '12/25',
    'cardCvv': '123',
    'cardHolderName': 'Jane Smith',
    'billingAddress': {
        'line1': '789 Main Street',
        'city': 'Austin',
        'state': 'TX',
        'postalCode': '78701',
        'country': 'US'
    }
})

print(f"Payment successful: {payment['transactionId']}")
```

### PHP

```php
<?php

class PexiPay {
    private $apiKey;
    private $baseUrl;
    
    public function __construct($apiKey, $sandbox = true) {
        $this->apiKey = $apiKey;
        $this->baseUrl = $sandbox 
            ? 'https://sandbox-api.pexipay.com' 
            : 'https://api.pexipay.com';
    }
    
    public function createPayment($paymentData) {
        $ch = curl_init($this->baseUrl . '/api/payments/direct');
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            return json_decode($response, true);
        } else {
            throw new Exception('Payment failed: ' . $response);
        }
    }
}

// Usage
$pexipay = new PexiPay('pxp_test_YOUR_API_KEY', true);

$payment = $pexipay->createPayment([
    'amount' => 5000,
    'currency' => 'USD',
    'customerEmail' => 'customer@example.com',
    'customerName' => 'Jane Smith',
    'cardNumber' => '4242424242424242',
    'cardExpiry' => '12/25',
    'cardCvv' => '123',
    'cardHolderName' => 'Jane Smith',
    'billingAddress' => [
        'line1' => '789 Main Street',
        'city' => 'Austin',
        'state' => 'TX',
        'postalCode' => '78701',
        'country' => 'US'
    ]
]);

echo "Payment successful: " . $payment['transactionId'];
```

### cURL

```bash
#!/bin/bash

API_KEY="pxp_test_YOUR_API_KEY"
BASE_URL="https://sandbox-api.pexipay.com"

curl -X POST "${BASE_URL}/api/payments/direct" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "currency": "USD",
    "customerEmail": "customer@example.com",
    "customerName": "Jane Smith",
    "cardNumber": "4242424242424242",
    "cardExpiry": "12/25",
    "cardCvv": "123",
    "cardHolderName": "Jane Smith",
    "billingAddress": {
      "line1": "789 Main Street",
      "city": "Austin",
      "state": "TX",
      "postalCode": "78701",
      "country": "US"
    }
  }'
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success (check response `status` field for payment status) |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Invalid or missing API key |
| `403` | Forbidden - API key doesn't have required permissions |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Something went wrong on our end |

### Error Response Format

```json
{
  "error": "Validation failed",
  "message": "One or more fields are invalid",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    },
    {
      "field": "cardExpiry",
      "message": "Card expiry must be in MM/YY format"
    }
  ]
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `invalid_request` | Request is malformed | Check request format and required fields |
| `authentication_failed` | API key is invalid | Verify your API key is correct |
| `rate_limit_exceeded` | Too many requests | Slow down your request rate |
| `card_declined` | Card was declined | Ask customer to use different card |
| `insufficient_funds` | Insufficient funds | Ask customer to use different card |
| `expired_card` | Card has expired | Ask customer to use different card |
| `incorrect_cvc` | CVC code is incorrect | Ask customer to re-enter CVC |
| `processing_error` | Payment processing failed | Retry the payment |

---

## Rate Limits

To ensure service stability, API requests are rate-limited.

**Limits:**
- **Sandbox:** 100 requests per minute
- **Production:** 1,000 requests per minute

**Headers in Response:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1732301400
```

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again in 30 seconds.",
  "retryAfter": 30
}
```

---

## Best Practices

### Security

1. **Never expose API keys** in client-side code or public repositories
2. **Use environment variables** to store API keys
3. **Always verify webhook signatures** to prevent fraudulent requests
4. **Use HTTPS** for all API requests
5. **Implement PCI compliance** when handling card data

### Payment Processing

1. **Validate input** on your side before sending to API
2. **Handle 3D Secure** flows for better approval rates
3. **Use idempotency keys** for retry logic (coming soon)
4. **Store transaction IDs** for reconciliation
5. **Implement webhooks** for real-time payment updates

### Error Handling

1. **Handle all possible statuses** (succeeded, failed, requires_action)
2. **Show clear error messages** to customers
3. **Implement retry logic** for network errors
4. **Log all API responses** for debugging
5. **Monitor webhook failures** and implement retry logic

### Testing

1. **Test in sandbox** before going to production
2. **Test all card scenarios** (success, decline, 3DS)
3. **Test webhook handling** with test events
4. **Load test** your integration before launch
5. **Test error scenarios** (network errors, timeouts)

---

## Going Live

### Pre-Launch Checklist

- [ ] Complete KYC verification
- [ ] Submit required business documents
- [ ] Test all payment flows in sandbox
- [ ] Implement webhook handling
- [ ] Verify webhook signature verification
- [ ] Test error handling
- [ ] Implement proper logging
- [ ] Switch to production API keys
- [ ] Update API base URL to production
- [ ] Set up monitoring and alerts
- [ ] Review PCI compliance requirements

### Production Configuration

```bash
# Environment variables
PEXIPAY_API_KEY=pxp_live_YOUR_PRODUCTION_KEY
PEXIPAY_BASE_URL=https://api.pexipay.com
PEXIPAY_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

---

## Support

### Resources

- **Dashboard:** [https://dashboard.pexipay.com](https://dashboard.pexipay.com)
- **Status Page:** [https://status.pexipay.com](https://status.pexipay.com)
- **Changelog:** [https://changelog.pexipay.com](https://changelog.pexipay.com)

### Contact

- **Email:** support@pexipay.com
- **Technical Support:** dev@pexipay.com
- **Emergency:** emergency@pexipay.com (24/7)

### Response Times

- **Critical Issues:** 1 hour
- **High Priority:** 4 hours
- **Normal Priority:** 24 hours

---

## Changelog

### v1.0.0 (2025-11-22)

- Initial API release
- Direct payment processing
- Payment status retrieval
- Refund functionality
- Webhook support
- Sandbox environment
- Test card numbers

---

**Last Updated:** November 22, 2025  
**API Version:** 1.0.0
