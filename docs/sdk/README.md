# Pexipay SDKs

Official SDKs for integrating with the Pexipay payment platform. Accept card payments and convert them to cryptocurrency seamlessly.

## Available SDKs

| Language | Package | Documentation | Status |
|----------|---------|--------------|---------|
| JavaScript/TypeScript | `@pexipay/sdk` | [Docs](./javascript/README.md) | ✅ Stable |
| Python | `pexipay` | [Docs](./python/README.md) | ✅ Stable |
| PHP | `pexipay/sdk` | [Docs](./php/README.md) | ✅ Stable |
| Ruby | `pexipay` | [Docs](./ruby/README.md) | 🚧 Coming Soon |
| Go | `github.com/pexipay/sdk-go` | [Docs](./go/README.md) | 🚧 Coming Soon |

## Quick Start

### JavaScript/TypeScript

```bash
npm install @pexipay/sdk
# or
yarn add @pexipay/sdk
# or
pnpm add @pexipay/sdk
```

```typescript
import { PexipayClient } from '@pexipay/sdk';

const client = new PexipayClient({
  apiKey: 'your_api_key',
  environment: 'production' // or 'sandbox'
});

const payment = await client.payments.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Order #1234',
  customerEmail: 'customer@example.com'
});
```

### Python

```bash
pip install pexipay
```

```python
from pexipay import PexipayClient

client = PexipayClient(
    api_key='your_api_key',
    environment='production'  # or 'sandbox'
)

payment = client.payments.create(
    amount=100.00,
    currency='USD',
    description='Order #1234',
    customer_email='customer@example.com'
)
```

### PHP

```bash
composer require pexipay/sdk
```

```php
<?php
require 'vendor/autoload.php';

use Pexipay\PexipayClient;

$client = new PexipayClient([
    'api_key' => 'your_api_key',
    'environment' => 'production' // or 'sandbox'
]);

$payment = $client->payments->create([
    'amount' => 100.00,
    'currency' => 'USD',
    'description' => 'Order #1234',
    'customer_email' => 'customer@example.com'
]);
```

## Features

- ✅ **Full API Coverage** - Complete access to all Pexipay APIs
- ✅ **Type Safety** - Full TypeScript support with detailed type definitions
- ✅ **Error Handling** - Comprehensive error handling with detailed messages
- ✅ **Webhooks** - Built-in webhook signature verification
- ✅ **Idempotency** - Automatic idempotency key handling
- ✅ **Retry Logic** - Configurable automatic retries with exponential backoff
- ✅ **Test Mode** - Full sandbox environment support
- ✅ **Well Documented** - Extensive documentation and examples

## Core Concepts

### Authentication

All SDKs require an API key for authentication. You can obtain your API key from the [Pexipay Dashboard](https://app.pexipay.com/dashboard/api-keys).

```javascript
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY
});
```

### Environments

- **Production**: `https://api.pexipay.com/v1`
- **Sandbox**: `https://sandbox-api.pexipay.com/v1`

### Resources

The SDK provides access to the following resources:

- **Payments** - Create and manage payments
- **PaymentLinks** - Generate hosted payment links
- **Customers** - Manage customer data
- **Refunds** - Process refunds
- **Webhooks** - Handle webhook events
- **Balance** - Check account balance
- **Transactions** - View transaction history

## Examples

### Create a Payment Link

```typescript
const paymentLink = await client.paymentLinks.create({
  amount: 250.00,
  currency: 'USD',
  description: 'Premium Subscription',
  customerInfo: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  returnUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel'
});

console.log(paymentLink.url); // Share this URL with your customer
```

### Process a Direct Payment

```typescript
const payment = await client.payments.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Product Purchase',
  paymentMethod: {
    card: {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2025,
      cvc: '123'
    }
  },
  customerInfo: {
    name: 'Jane Smith',
    email: 'jane@example.com'
  }
});

if (payment.status === 'succeeded') {
  console.log('Payment successful!');
}
```

### Handle 3D Secure Authentication

```typescript
const payment = await client.payments.create({
  amount: 500.00,
  currency: 'EUR',
  // ... other fields
});

if (payment.requires3DS) {
  // Redirect customer to payment.threeDSUrl
  console.log('Redirect to:', payment.threeDSUrl);
  
  // After customer completes 3DS, confirm the payment
  const confirmed = await client.payments.confirm3DS(
    payment.id,
    threeDSResult
  );
}
```

### Verify Webhook Signatures

```typescript
import { verifyWebhookSignature } from '@pexipay/sdk';

app.post('/webhooks/pexipay', async (req, res) => {
  const signature = req.headers['x-pexipay-signature'];
  const payload = req.body;
  
  const isValid = await verifyWebhookSignature(
    payload,
    signature,
    process.env.PEXIPAY_WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
  
  // Process webhook event
  switch (payload.event) {
    case 'payment.succeeded':
      console.log('Payment succeeded:', payload.data);
      break;
    case 'payment.failed':
      console.log('Payment failed:', payload.data);
      break;
  }
  
  res.status(200).send('OK');
});
```

### Process a Refund

```typescript
const refund = await client.refunds.create({
  paymentId: 'pay_1234567890',
  amount: 50.00, // Partial refund (optional, omit for full refund)
  reason: 'Customer requested refund'
});

console.log('Refund status:', refund.status);
```

### List Transactions

```typescript
const transactions = await client.transactions.list({
  limit: 50,
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  status: 'succeeded'
});

transactions.data.forEach(txn => {
  console.log(`${txn.id}: ${txn.amount} ${txn.currency}`);
});
```

## Error Handling

All SDKs provide structured error handling:

```typescript
import { PexipayError } from '@pexipay/sdk';

try {
  const payment = await client.payments.create({
    amount: 100.00,
    currency: 'USD'
  });
} catch (error) {
  if (error instanceof PexipayError) {
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('HTTP status:', error.statusCode);
    console.error('Request ID:', error.requestId);
  }
}
```

## Webhooks

Pexipay uses webhooks to notify your application of events. All SDKs include webhook verification utilities.

### Supported Events

- `payment.created` - Payment initiated
- `payment.succeeded` - Payment completed successfully
- `payment.failed` - Payment failed
- `payment.requires_action` - Payment requires 3DS authentication
- `refund.created` - Refund initiated
- `refund.succeeded` - Refund completed
- `refund.failed` - Refund failed

## Testing

### Test Cards

Use these test cards in sandbox mode:

| Card Number | Description | Result |
|-------------|-------------|--------|
| 4242 4242 4242 4242 | Standard test card | Success |
| 4000 0000 0000 0002 | Declined card | Declined |
| 4000 0000 0000 3220 | 3DS required | Requires 3DS |
| 4000 0000 0000 0341 | Attach card fails | Card declined |

Use any future expiry date, any 3-digit CVC, and any postal code.

## Support

- **Documentation**: [docs.pexipay.com](https://docs.pexipay.com)
- **API Reference**: [api.pexipay.com/docs](https://api.pexipay.com/docs)
- **Discord**: [discord.gg/pexipay](https://discord.gg/pexipay)
- **Email**: support@pexipay.com
- **GitHub Issues**: Report issues for each SDK in their respective repositories

## Contributing

We welcome contributions! Please see the CONTRIBUTING.md file in each SDK repository for guidelines.

## License

All Pexipay SDKs are released under the MIT License. See LICENSE file for details.
