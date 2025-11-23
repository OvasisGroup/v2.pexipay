# Pexipay SDK Quick Reference

A quick reference guide for common operations across all Pexipay SDKs.

## 🔧 Installation

```bash
# JavaScript/TypeScript
npm install @pexipay/sdk

# Python
pip install pexipay

# PHP
composer require pexipay/sdk
```

## 🔑 Client Setup

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
import { PexipayClient } from '@pexipay/sdk';

const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY,
  environment: 'production', // or 'sandbox'
  timeout: 30000,
  maxRetries: 3
});
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
from pexipay import PexipayClient

client = PexipayClient(
    api_key=os.getenv('PEXIPAY_API_KEY'),
    environment='production',  # or 'sandbox'
    timeout=30,
    max_retries=3
)
```
</details>

<details>
<summary><strong>PHP</strong></summary>

```php
use Pexipay\PexipayClient;

$client = new PexipayClient([
    'api_key' => getenv('PEXIPAY_API_KEY'),
    'environment' => 'production',  // or 'sandbox'
    'timeout' => 30,
    'max_retries' => 3
]);
```
</details>

---

## 💳 Payments

### Create Payment

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

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
  },
  metadata: {
    orderId: '1234',
    customerId: 'cus_abc'
  }
});
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
payment = client.payments.create(
    amount=100.00,
    currency='USD',
    description='Order #1234',
    payment_method={
        'type': 'card',
        'card': {
            'number': '4242424242424242',
            'exp_month': 12,
            'exp_year': 2025,
            'cvc': '123'
        }
    },
    metadata={
        'order_id': '1234',
        'customer_id': 'cus_abc'
    }
)
```
</details>

<details>
<summary><strong>PHP</strong></summary>

```php
$payment = $client->payments->create([
    'amount' => 100.00,
    'currency' => 'USD',
    'description' => 'Order #1234',
    'payment_method' => [
        'type' => 'card',
        'card' => [
            'number' => '4242424242424242',
            'exp_month' => 12,
            'exp_year' => 2025,
            'cvc' => '123'
        ]
    ],
    'metadata' => [
        'order_id' => '1234',
        'customer_id' => 'cus_abc'
    ]
]);
```
</details>

### Retrieve Payment

```typescript
const payment = await client.payments.retrieve('pay_123456');
```

```python
payment = client.payments.retrieve('pay_123456')
```

```php
$payment = $client->payments->retrieve('pay_123456');
```

### List Payments

```typescript
const payments = await client.payments.list({
  limit: 10,
  status: 'succeeded'
});
```

```python
payments = client.payments.list(limit=10, status='succeeded')
```

```php
$payments = $client->payments->list(['limit' => 10, 'status' => 'succeeded']);
```

---

## 🔗 Payment Links

### Create Payment Link

```typescript
const link = await client.paymentLinks.create({
  amount: 199.99,
  currency: 'USD',
  description: 'Premium Plan',
  expiresAt: '2025-12-31T23:59:59Z'
});

console.log(link.url); // Share with customer
```

```python
link = client.payment_links.create(
    amount=199.99,
    currency='USD',
    description='Premium Plan',
    expires_at='2025-12-31T23:59:59Z'
)

print(link['url'])  # Share with customer
```

```php
$link = $client->paymentLinks->create([
    'amount' => 199.99,
    'currency' => 'USD',
    'description' => 'Premium Plan',
    'expires_at' => '2025-12-31T23:59:59Z'
]);

echo $link['url'];  // Share with customer
```

---

## 👤 Customers

### Create Customer

```typescript
const customer = await client.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  phone: '+1234567890'
});
```

```python
customer = client.customers.create(
    email='customer@example.com',
    name='John Doe',
    phone='+1234567890'
)
```

```php
$customer = $client->customers->create([
    'email' => 'customer@example.com',
    'name' => 'John Doe',
    'phone' => '+1234567890'
]);
```

### Update Customer

```typescript
const updated = await client.customers.update('cus_123', {
  name: 'Jane Doe',
  metadata: { vip: 'true' }
});
```

```python
updated = client.customers.update('cus_123', {
    'name': 'Jane Doe',
    'metadata': {'vip': 'true'}
})
```

```php
$updated = $client->customers->update('cus_123', [
    'name' => 'Jane Doe',
    'metadata' => ['vip' => 'true']
]);
```

---

## 💰 Refunds

### Create Refund

```typescript
// Full refund
const refund = await client.refunds.create({
  paymentId: 'pay_123456',
  reason: 'Customer requested refund'
});

// Partial refund
const partialRefund = await client.refunds.create({
  paymentId: 'pay_123456',
  amount: 50.00,
  reason: 'Partial refund'
});
```

```python
# Full refund
refund = client.refunds.create(
    payment_id='pay_123456',
    reason='Customer requested refund'
)

# Partial refund
partial_refund = client.refunds.create(
    payment_id='pay_123456',
    amount=50.00,
    reason='Partial refund'
)
```

```php
// Full refund
$refund = $client->refunds->create([
    'payment_id' => 'pay_123456',
    'reason' => 'Customer requested refund'
]);

// Partial refund
$partialRefund = $client->refunds->create([
    'payment_id' => 'pay_123456',
    'amount' => 50.00,
    'reason' => 'Partial refund'
]);
```

---

## 📊 Transactions

### List Transactions

```typescript
const transactions = await client.transactions.list({
  createdAfter: '2025-01-01T00:00:00Z',
  createdBefore: '2025-01-31T23:59:59Z',
  limit: 50
});
```

```python
transactions = client.transactions.list(
    created_after='2025-01-01T00:00:00Z',
    created_before='2025-01-31T23:59:59Z',
    limit=50
)
```

```php
$transactions = $client->transactions->list([
    'created_after' => '2025-01-01T00:00:00Z',
    'created_before' => '2025-01-31T23:59:59Z',
    'limit' => 50
]);
```

---

## 💼 Balance

### Get Account Balance

```typescript
const balance = await client.balance.retrieve();

console.log('Available:', balance.available);
console.log('Pending:', balance.pending);
```

```python
balance = client.balance.retrieve()

print(f"Available: {balance['available']}")
print(f"Pending: {balance['pending']}")
```

```php
$balance = $client->balance->retrieve();

echo "Available: " . $balance['available'] . "\n";
echo "Pending: " . $balance['pending'] . "\n";
```

---

## 🔔 Webhooks

### Verify Webhook Signature

<details>
<summary><strong>JavaScript/TypeScript (Express)</strong></summary>

```typescript
import express from 'express';
import { verifyWebhookSignature } from '@pexipay/sdk';

app.post('/webhooks/pexipay',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const signature = req.headers['x-pexipay-signature'];
    
    if (!verifyWebhookSignature(
      req.body,
      signature,
      process.env.PEXIPAY_WEBHOOK_SECRET
    )) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(req.body.toString());
    
    // Handle event
    switch (event.type) {
      case 'payment.succeeded':
        console.log('Payment succeeded:', event.data);
        break;
      case 'payment.failed':
        console.log('Payment failed:', event.data);
        break;
    }

    res.status(200).send('OK');
  }
);
```
</details>

<details>
<summary><strong>Python (Flask)</strong></summary>

```python
from flask import Flask, request
from pexipay import verify_webhook_signature

@app.route('/webhooks/pexipay', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Pexipay-Signature')
    payload = request.get_data(as_text=True)
    
    if not verify_webhook_signature(
        payload,
        signature,
        os.getenv('PEXIPAY_WEBHOOK_SECRET')
    ):
        return 'Invalid signature', 400
    
    event = request.get_json()
    
    # Handle event
    if event['type'] == 'payment.succeeded':
        print(f"Payment succeeded: {event['data']}")
    elif event['type'] == 'payment.failed':
        print(f"Payment failed: {event['data']}")
    
    return 'OK', 200
```
</details>

<details>
<summary><strong>PHP</strong></summary>

```php
use Pexipay\Webhook;

$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PEXIPAY_SIGNATURE'];

try {
    $event = Webhook::constructEvent(
        $payload,
        $signature,
        getenv('PEXIPAY_WEBHOOK_SECRET')
    );
    
    // Handle event
    switch ($event['type']) {
        case 'payment.succeeded':
            error_log('Payment succeeded: ' . json_encode($event['data']));
            break;
        case 'payment.failed':
            error_log('Payment failed: ' . json_encode($event['data']));
            break;
    }
    
    http_response_code(200);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
}
```
</details>

---

## ⚠️ Error Handling

<details>
<summary><strong>JavaScript/TypeScript</strong></summary>

```typescript
import { 
  PexipayError,
  AuthenticationError,
  ValidationError,
  RateLimitError
} from '@pexipay/sdk';

try {
  const payment = await client.payments.create(params);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded');
  } else if (error instanceof PexipayError) {
    console.error('Pexipay error:', error.message);
    console.error('Request ID:', error.requestId);
  }
}
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
from pexipay import (
    PexipayError,
    AuthenticationError,
    ValidationError,
    RateLimitError
)

try:
    payment = client.payments.create(params)
except AuthenticationError:
    print('Invalid API key')
except ValidationError as e:
    print(f'Validation error: {e.message}')
except RateLimitError:
    print('Rate limit exceeded')
except PexipayError as e:
    print(f'Pexipay error: {e.message}')
    print(f'Request ID: {e.request_id}')
```
</details>

<details>
<summary><strong>PHP</strong></summary>

```php
use Pexipay\Exceptions\PexipayException;

try {
    $payment = $client->payments->create($params);
} catch (PexipayException $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
    echo 'Status: ' . $e->getStatusCode() . "\n";
    echo 'Request ID: ' . $e->getRequestId() . "\n";
}
```
</details>

---

## 🧪 Test Cards

| Card Number | Scenario | Result |
|-------------|----------|--------|
| `4242 4242 4242 4242` | Standard test | Success |
| `4111 1111 1111 1111` | Visa test | Success |
| `5555 5555 5555 4444` | Mastercard test | Success |
| `4000 0000 0000 0002` | Declined card | Card declined |
| `4000 0000 0000 3220` | 3DS required | Requires authentication |
| `4000 0000 0000 9995` | Insufficient funds | Declined |

Use any future expiry date and any 3-digit CVC.

---

## 🔗 Quick Links

- [Full Documentation](./README.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Code Examples](./EXAMPLES.md)
- [JavaScript SDK](./javascript/README.md)
- [Python SDK](./python/README.md)
- [PHP SDK](./php/README.md)

---

**Last Updated:** November 23, 2025
