# @pexipay/sdk

Official JavaScript/TypeScript SDK for Pexipay - Accept card payments and convert them to cryptocurrency seamlessly.

[![npm version](https://img.shields.io/npm/v/@pexipay/sdk.svg)](https://www.npmjs.com/package/@pexipay/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Full TypeScript support** with comprehensive type definitions
- ✅ **Promise-based API** with async/await support
- ✅ **Automatic retries** with exponential backoff
- ✅ **Webhook signature verification** for security
- ✅ **Idempotency support** for safe retries
- ✅ **Test mode** for development and testing
- ✅ **Complete API coverage** - payments, refunds, customers, and more

## Installation

```bash
npm install @pexipay/sdk
# or
yarn add @pexipay/sdk
# or
pnpm add @pexipay/sdk
```

## Quick Start

```typescript
import { PexipayClient } from '@pexipay/sdk';

// Initialize the client
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY,
  environment: 'production' // or 'sandbox' for testing
});

// Create a payment
const payment = await client.payments.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Order #1234',
  customerEmail: 'customer@example.com',
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

console.log('Payment status:', payment.status);
```

## Configuration

### Environment Options

```typescript
const client = new PexipayClient({
  apiKey: 'your_api_key',
  environment: 'production', // 'production' or 'sandbox'
  timeout: 30000, // Request timeout in ms (default: 30000)
  maxRetries: 3 // Maximum retry attempts (default: 3)
});
```

### API Endpoints

- **Production**: `https://api.pexipay.com/v1`
- **Sandbox**: `https://sandbox-api.pexipay.com/v1`

## Core Resources

### Payments

```typescript
// Create a payment
const payment = await client.payments.create({
  amount: 250.00,
  currency: 'USD',
  description: 'Premium subscription',
  customerEmail: 'customer@example.com'
});

// Retrieve a payment
const payment = await client.payments.retrieve('pay_123456');

// List payments
const payments = await client.payments.list({
  limit: 10,
  status: 'succeeded'
});

// Handle 3D Secure
if (payment.requires3DS) {
  // Redirect customer to payment.threeDSUrl
  // After completion, confirm the payment
  const confirmed = await client.payments.confirm3DS(
    payment.id,
    threeDSResult
  );
}

// Cancel a payment
await client.payments.cancel('pay_123456');

// Capture a payment (for manual capture)
await client.payments.capture('pay_123456', 100.00);
```

### Payment Links

```typescript
// Create a payment link
const link = await client.paymentLinks.create({
  amount: 199.99,
  currency: 'USD',
  description: 'Annual membership',
  customerInfo: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  returnUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
  expiresAt: '2025-12-31T23:59:59Z'
});

console.log('Payment URL:', link.url);

// Retrieve a payment link
const link = await client.paymentLinks.retrieve('link_123456');

// List payment links
const links = await client.paymentLinks.list({
  status: 'active',
  limit: 20
});

// Cancel a payment link
await client.paymentLinks.cancel('link_123456');
```

### Customers

```typescript
// Create a customer
const customer = await client.customers.create({
  email: 'customer@example.com',
  name: 'Jane Smith',
  phone: '+1234567890',
  address: {
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94111',
    country: 'US'
  }
});

// Retrieve a customer
const customer = await client.customers.retrieve('cus_123456');

// Update a customer
const updated = await client.customers.update('cus_123456', {
  name: 'Jane Doe',
  phone: '+0987654321'
});

// List customers
const customers = await client.customers.list({
  limit: 50
});

// Delete a customer
await client.customers.delete('cus_123456');
```

### Refunds

```typescript
// Create a full refund
const refund = await client.refunds.create({
  paymentId: 'pay_123456',
  reason: 'Customer requested refund'
});

// Create a partial refund
const refund = await client.refunds.create({
  paymentId: 'pay_123456',
  amount: 50.00,
  reason: 'Partial refund for damaged item'
});

// Retrieve a refund
const refund = await client.refunds.retrieve('ref_123456');

// List refunds
const refunds = await client.refunds.list({
  paymentId: 'pay_123456'
});

// Cancel a pending refund
await client.refunds.cancel('ref_123456');
```

### Transactions

```typescript
// Retrieve a transaction
const transaction = await client.transactions.retrieve('txn_123456');

// List transactions
const transactions = await client.transactions.list({
  limit: 100,
  type: 'payment',
  status: 'completed',
  createdAfter: '2025-01-01T00:00:00Z'
});
```

### Balance

```typescript
// Get account balance
const balance = await client.balance.retrieve();

console.log('Available balance:', balance.available);
console.log('Pending balance:', balance.pending);

// List balance transactions
const transactions = await client.balance.listTransactions({
  limit: 50
});
```

## Webhooks

### Signature Verification

```typescript
import express from 'express';
import { verifyWebhookSignature } from '@pexipay/sdk';

const app = express();

app.post('/webhooks/pexipay', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['x-pexipay-signature'] as string;
    const payload = req.body;

    const isValid = verifyWebhookSignature(
      payload,
      signature,
      process.env.PEXIPAY_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(payload.toString());

    // Handle the event
    switch (event.type) {
      case 'payment.succeeded':
        console.log('Payment succeeded:', event.data);
        break;
      case 'payment.failed':
        console.log('Payment failed:', event.data);
        break;
      case 'payment.requires_action':
        console.log('Payment requires 3DS:', event.data);
        break;
      case 'refund.succeeded':
        console.log('Refund succeeded:', event.data);
        break;
    }

    res.status(200).send('OK');
  }
);
```

### Webhook Event Types

- `payment.created` - Payment initiated
- `payment.succeeded` - Payment completed successfully
- `payment.failed` - Payment failed
- `payment.requires_action` - Payment requires 3DS authentication
- `payment.canceled` - Payment was canceled
- `refund.created` - Refund initiated
- `refund.succeeded` - Refund completed
- `refund.failed` - Refund failed
- `payment_link.created` - Payment link created
- `payment_link.completed` - Payment via link completed
- `payment_link.expired` - Payment link expired

## Error Handling

```typescript
import { 
  PexipayError, 
  ValidationError, 
  AuthenticationError,
  RateLimitError 
} from '@pexipay/sdk';

try {
  const payment = await client.payments.create({
    amount: 100.00,
    currency: 'USD'
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
    console.error('Details:', error.details);
  } else if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
    console.error('Retry after:', error.retryAfter);
  } else if (error instanceof PexipayError) {
    console.error('API error:', error.message);
    console.error('Status code:', error.statusCode);
    console.error('Request ID:', error.requestId);
  }
}
```

## Testing

### Test Cards

Use these test cards in sandbox mode:

| Card Number | Description | Result |
|-------------|-------------|--------|
| 4242 4242 4242 4242 | Standard test card | Success |
| 4111 1111 1111 1111 | Visa test card | Success |
| 5555 5555 5555 4444 | Mastercard test card | Success |
| 4000 0000 0000 0002 | Declined card | Card declined |
| 4000 0000 0000 3220 | 3DS required | Requires 3DS |

Use any future expiry date, any 3-digit CVC.

### Example Test

```typescript
import { PexipayClient } from '@pexipay/sdk';

const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_TEST_API_KEY,
  environment: 'sandbox'
});

// Test successful payment
const payment = await client.payments.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Test payment',
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

console.log('Test payment status:', payment.status); // 'succeeded'
```

## TypeScript Support

The SDK is written in TypeScript and provides comprehensive type definitions:

```typescript
import type { 
  Payment, 
  PaymentCreateParams,
  PaymentLink,
  Customer,
  Refund 
} from '@pexipay/sdk';

const params: PaymentCreateParams = {
  amount: 100.00,
  currency: 'USD',
  description: 'Order #123'
};

const payment: Payment = await client.payments.create(params);
```

## Advanced Usage

### Idempotency

```typescript
const payment = await client.payments.create(
  {
    amount: 100.00,
    currency: 'USD'
  },
  {
    idempotencyKey: 'order_123_payment_attempt_1'
  }
);
```

### Custom Timeout

```typescript
const payment = await client.payments.create(
  {
    amount: 100.00,
    currency: 'USD'
  },
  {
    timeout: 60000 // 60 seconds
  }
);
```

### Switch Environment

```typescript
// Start in sandbox
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY,
  environment: 'sandbox'
});

// Switch to production
client.setEnvironment('production');
client.setApiKey(process.env.PEXIPAY_PRODUCTION_API_KEY);
```

## Support

- **Documentation**: [docs.pexipay.com](https://docs.pexipay.com)
- **API Reference**: [api.pexipay.com/docs](https://api.pexipay.com/docs)
- **Discord**: [discord.gg/pexipay](https://discord.gg/pexipay)
- **Email**: support@pexipay.com
- **Issues**: [github.com/pexipay/sdk-javascript/issues](https://github.com/pexipay/sdk-javascript/issues)

## License

MIT License - see LICENSE file for details.
