# Pexipay SDK Integration Guide

Complete guide for integrating Pexipay payment APIs into your applications.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [SDK Installation](#sdk-installation)
4. [Core Concepts](#core-concepts)
5. [API Resources](#api-resources)
6. [Webhooks](#webhooks)
7. [Testing](#testing)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Pexipay account ([Sign up](https://app.pexipay.com/signup))
- API keys from your [Dashboard](https://app.pexipay.com/dashboard/api-keys)
- Development environment (Node.js 16+, Python 3.8+, or PHP 7.4+)

### Quick Start Checklist

- [ ] Create Pexipay account
- [ ] Generate API keys (sandbox and production)
- [ ] Install SDK for your language
- [ ] Configure environment variables
- [ ] Test with sandbox mode
- [ ] Set up webhook endpoint
- [ ] Deploy to production

## Authentication

All API requests require authentication using your API key. Keys are environment-specific:

- **Sandbox**: Use for development and testing
- **Production**: Use for live transactions

### API Key Format

```
test_sk_xxxxxxxxxxxxxxxxxxxx  # Sandbox secret key
live_sk_xxxxxxxxxxxxxxxxxxxx  # Production secret key
```

### Security Best Practices

1. **Never expose keys in client-side code**
2. **Use environment variables** for configuration
3. **Rotate keys periodically** (every 90 days recommended)
4. **Use separate keys per environment**
5. **Monitor key usage** in your dashboard

## SDK Installation

### JavaScript/TypeScript

```bash
npm install @pexipay/sdk
# or
yarn add @pexipay/sdk
# or
pnpm add @pexipay/sdk
```

**Requirements**: Node.js >= 16.0.0

### Python

```bash
pip install pexipay
```

**Requirements**: Python >= 3.8

### PHP

```bash
composer require pexipay/sdk
```

**Requirements**: PHP >= 7.4

## Core Concepts

### Environments

```typescript
// Sandbox - for development
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_TEST_API_KEY,
  environment: 'sandbox'
});

// Production - for live transactions
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY,
  environment: 'production'
});
```

### Amount Handling

Amounts should be provided as decimal numbers in the major currency unit:

```typescript
{
  amount: 100.50,  // $100.50 USD
  currency: 'USD'
}
```

The SDK automatically converts to cents/minor units when calling the API.

### Idempotency

Critical operations support idempotency keys to prevent duplicate charges:

```typescript
const payment = await client.payments.create(
  {
    amount: 100.00,
    currency: 'USD'
  },
  {
    idempotencyKey: 'unique-operation-id-123'
  }
);
```

### Metadata

Store custom data with any resource using metadata:

```typescript
{
  metadata: {
    orderId: '12345',
    customerId: 'cus_abc',
    source: 'mobile_app'
  }
}
```

## API Resources

### Payments

Direct payment processing with card details.

**Use cases**:
- In-app checkout
- Mobile payments
- Subscription billing

```typescript
const payment = await client.payments.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Order #1234',
  paymentMethod: {
    type: 'card',
    card: {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2025,
      cvc: '123'
    }
  }
});
```

### Payment Links

Hosted payment pages for easy integration.

**Use cases**:
- Email invoices
- Social media sales
- No-code solutions

```typescript
const link = await client.paymentLinks.create({
  amount: 199.99,
  currency: 'USD',
  description: 'Annual subscription',
  expiresAt: '2025-12-31T23:59:59Z'
});

// Share link.url with customer
```

### Customers

Manage customer information and payment history.

**Use cases**:
- Recurring billing
- Customer profiles
- Payment history

```typescript
const customer = await client.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  metadata: {
    userId: '12345'
  }
});
```

### Refunds

Process full or partial refunds.

**Use cases**:
- Order cancellations
- Returns
- Dispute resolution

```typescript
const refund = await client.refunds.create({
  paymentId: 'pay_123456',
  amount: 50.00, // Optional for partial refund
  reason: 'Customer requested refund'
});
```

### Transactions

View all account transactions.

**Use cases**:
- Accounting
- Reports
- Reconciliation

```typescript
const transactions = await client.transactions.list({
  createdAfter: '2025-01-01T00:00:00Z',
  createdBefore: '2025-01-31T23:59:59Z',
  status: 'completed'
});
```

### Balance

Check account balance and available funds.

```typescript
const balance = await client.balance.retrieve();

console.log('Available:', balance.available);
console.log('Pending:', balance.pending);
```

## Webhooks

Webhooks notify your application of payment events in real-time.

### Setup

1. Configure webhook URL in your [Dashboard](https://app.pexipay.com/dashboard/webhooks)
2. Save the webhook secret
3. Implement webhook handler
4. Verify signatures

### Event Types

| Event | Description |
|-------|-------------|
| `payment.created` | Payment initiated |
| `payment.succeeded` | Payment completed successfully |
| `payment.failed` | Payment failed |
| `payment.requires_action` | 3DS authentication required |
| `payment.canceled` | Payment canceled |
| `refund.created` | Refund initiated |
| `refund.succeeded` | Refund completed |
| `refund.failed` | Refund failed |
| `payment_link.created` | Payment link created |
| `payment_link.completed` | Payment via link completed |
| `payment_link.expired` | Payment link expired |

### Implementation

#### Node.js/Express

```typescript
import express from 'express';
import { verifyWebhookSignature } from '@pexipay/sdk';

app.post('/webhooks/pexipay',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['x-pexipay-signature'];
    
    if (!verifyWebhookSignature(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET
    )) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(req.body.toString());
    
    // Handle event
    await handleWebhookEvent(event);
    
    res.status(200).send('OK');
  }
);
```

#### Python/Flask

```python
from flask import Flask, request
from pexipay import verify_webhook_signature

@app.route('/webhooks/pexipay', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Pexipay-Signature')
    payload = request.get_data(as_text=True)
    
    if not verify_webhook_signature(payload, signature, WEBHOOK_SECRET):
        return 'Invalid signature', 400
    
    event = request.get_json()
    handle_webhook_event(event)
    
    return 'OK', 200
```

#### PHP

```php
<?php
use Pexipay\Webhook;

$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PEXIPAY_SIGNATURE'];

try {
    $event = Webhook::constructEvent($payload, $signature, WEBHOOK_SECRET);
    handleWebhookEvent($event);
    http_response_code(200);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
}
```

## Testing

### Test Mode

Always use sandbox environment for development:

```typescript
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_TEST_API_KEY,
  environment: 'sandbox'
});
```

### Test Cards

| Card Number | Scenario | Result |
|-------------|----------|--------|
| 4242 4242 4242 4242 | Standard test card | Success |
| 4111 1111 1111 1111 | Visa test card | Success |
| 5555 5555 5555 4444 | Mastercard test card | Success |
| 4000 0000 0000 0002 | Declined card | Card declined |
| 4000 0000 0000 3220 | 3DS required | Requires authentication |
| 4000 0000 0000 9995 | Insufficient funds | Declined |

**Note**: Use any future expiry date and any 3-digit CVC.

### Testing Webhooks

Use tools like:
- [ngrok](https://ngrok.com/) for local development
- [Webhook.site](https://webhook.site/) for testing
- Pexipay Dashboard webhook tester

### Example Test Suite

```typescript
import { PexipayClient } from '@pexipay/sdk';

describe('Pexipay Integration', () => {
  const client = new PexipayClient({
    apiKey: process.env.PEXIPAY_TEST_API_KEY,
    environment: 'sandbox'
  });

  test('creates successful payment', async () => {
    const payment = await client.payments.create({
      amount: 100.00,
      currency: 'USD',
      paymentMethod: {
        type: 'card',
        card: {
          number: '4242424242424242',
          expMonth: 12,
          expYear: 2025,
          cvc: '123'
        }
      }
    });

    expect(payment.status).toBe('succeeded');
  });

  test('handles declined card', async () => {
    await expect(
      client.payments.create({
        amount: 100.00,
        currency: 'USD',
        paymentMethod: {
          type: 'card',
          card: {
            number: '4000000000000002',
            expMonth: 12,
            expYear: 2025,
            cvc: '123'
          }
        }
      })
    ).rejects.toThrow();
  });
});
```

## Best Practices

### 1. Error Handling

Always implement comprehensive error handling:

```typescript
try {
  const payment = await client.payments.create(params);
} catch (error) {
  if (error instanceof PexipayError) {
    // Log error details
    logger.error('Payment failed', {
      message: error.message,
      code: error.code,
      requestId: error.requestId
    });
    
    // Show user-friendly message
    showError('Payment failed. Please try again.');
  }
}
```

### 2. Retry Logic

The SDK includes automatic retries, but implement application-level retries for critical operations:

```typescript
async function createPaymentWithRetry(params, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await client.payments.create(params, {
        idempotencyKey: `payment-${orderId}-${attempt}`
      });
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(1000 * attempt); // Exponential backoff
    }
  }
}
```

### 3. Logging

Log all API interactions for debugging:

```typescript
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY,
  environment: 'production'
});

// Log all requests
client.on('request', (req) => {
  logger.info('API Request', {
    method: req.method,
    endpoint: req.endpoint,
    requestId: req.id
  });
});

// Log all responses
client.on('response', (res) => {
  logger.info('API Response', {
    statusCode: res.statusCode,
    requestId: res.requestId
  });
});
```

### 4. Security

- **Never log sensitive data** (card numbers, API keys)
- **Use HTTPS** for all communications
- **Validate webhook signatures** before processing
- **Implement rate limiting** to prevent abuse
- **Monitor for suspicious activity**

### 5. Performance

- **Cache customer data** to reduce API calls
- **Use bulk operations** when available
- **Implement pagination** for large result sets
- **Monitor API response times**

## Troubleshooting

### Common Issues

#### 1. Authentication Failed

**Error**: `401 Unauthorized`

**Solutions**:
- Verify API key is correct
- Check environment (sandbox vs production)
- Ensure key hasn't expired or been revoked

#### 2. Payment Declined

**Error**: `402 Payment Failed`

**Solutions**:
- Use different test card in sandbox
- Check card details are valid
- Verify sufficient funds (production)

#### 3. Webhook Signature Invalid

**Error**: `400 Invalid Signature`

**Solutions**:
- Use correct webhook secret
- Don't modify request body
- Check for proxy/middleware altering headers

#### 4. Rate Limit Exceeded

**Error**: `429 Too Many Requests`

**Solutions**:
- Implement exponential backoff
- Reduce request frequency
- Contact support for limit increase

### Debug Mode

Enable debug logging:

```typescript
// JavaScript
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY,
  debug: true
});
```

```python
# Python
import logging
logging.basicConfig(level=logging.DEBUG)

client = PexipayClient(api_key=API_KEY)
```

```php
// PHP
$client = new PexipayClient([
    'api_key' => $apiKey,
    'debug' => true
]);
```

### Getting Help

- **Documentation**: [docs.pexipay.com](https://docs.pexipay.com)
- **API Reference**: [api.pexipay.com/docs](https://api.pexipay.com/docs)
- **Status Page**: [status.pexipay.com](https://status.pexipay.com)
- **Discord Community**: [discord.gg/pexipay](https://discord.gg/pexipay)
- **Email Support**: support@pexipay.com
- **Priority Support**: Available for enterprise plans

### Request ID

All API responses include a `requestId` for debugging:

```typescript
try {
  const payment = await client.payments.create(params);
} catch (error) {
  console.error('Request ID:', error.requestId);
  // Share this with support team
}
```

## Additional Resources

- **GitHub Examples**: [github.com/pexipay/examples](https://github.com/pexipay/examples)
- **Video Tutorials**: [youtube.com/pexipay](https://youtube.com/pexipay)
- **Blog**: [blog.pexipay.com](https://blog.pexipay.com)
- **Changelog**: [changelog.pexipay.com](https://changelog.pexipay.com)

## Feedback

We're constantly improving our SDKs. Share your feedback:

- **Feature Requests**: [github.com/pexipay/sdk-javascript/issues](https://github.com/pexipay/sdk-javascript/issues)
- **Bug Reports**: Same as above
- **General Feedback**: feedback@pexipay.com

---

**Last Updated**: November 23, 2025  
**SDK Versions**: JavaScript 1.0.0, Python 1.0.0, PHP 1.0.0
