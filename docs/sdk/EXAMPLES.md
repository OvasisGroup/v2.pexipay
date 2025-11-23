# SDK Examples

Complete examples demonstrating how to integrate with Pexipay using our official SDKs.

## Quick Links

- [JavaScript/TypeScript Examples](#javascript--typescript)
- [Python Examples](#python)
- [PHP Examples](#php)
- [Common Use Cases](#common-use-cases)

## JavaScript / TypeScript

### Basic Payment

```typescript
import { PexipayClient } from '@pexipay/sdk';

const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY!,
  environment: 'production'
});

async function createPayment() {
  const payment = await client.payments.create({
    amount: 100.00,
    currency: 'USD',
    description: 'Premium subscription',
    customerEmail: 'customer@example.com'
  });

  console.log('Payment created:', payment.id);
  console.log('Status:', payment.status);
}
```

### E-commerce Checkout

```typescript
import express from 'express';
import { PexipayClient } from '@pexipay/sdk';

const app = express();
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY!
});

app.post('/checkout', async (req, res) => {
  try {
    const { items, customerInfo } = req.body;
    
    // Calculate total
    const total = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Create payment link
    const link = await client.paymentLinks.create({
      amount: total,
      currency: 'USD',
      description: `Order ${Date.now()}`,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email
      },
      returnUrl: `${process.env.APP_URL}/order/success`,
      cancelUrl: `${process.env.APP_URL}/order/cancel`,
      metadata: {
        items: JSON.stringify(items),
        orderId: `ORD-${Date.now()}`
      }
    });

    res.json({ paymentUrl: link.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Webhook Handler

```typescript
import express from 'express';
import { verifyWebhookSignature } from '@pexipay/sdk';

const app = express();

app.post('/webhooks/pexipay',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['x-pexipay-signature'] as string;
    const payload = req.body;

    if (!verifyWebhookSignature(
      payload,
      signature,
      process.env.PEXIPAY_WEBHOOK_SECRET!
    )) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(payload.toString());

    switch (event.type) {
      case 'payment.succeeded':
        await handleSuccessfulPayment(event.data);
        break;
      case 'payment.failed':
        await handleFailedPayment(event.data);
        break;
      case 'refund.succeeded':
        await handleRefund(event.data);
        break;
    }

    res.status(200).send('OK');
  }
);

async function handleSuccessfulPayment(payment: any) {
  console.log('Payment succeeded:', payment.id);
  // Update order status in database
  // Send confirmation email
}
```

## Python

### Basic Payment

```python
from pexipay import PexipayClient
import os

client = PexipayClient(
    api_key=os.getenv('PEXIPAY_API_KEY'),
    environment='production'
)

def create_payment():
    payment = client.payments.create(
        amount=100.00,
        currency='USD',
        description='Premium subscription',
        customer_email='customer@example.com'
    )
    
    print(f'Payment created: {payment["id"]}')
    print(f'Status: {payment["status"]}')
```

### Subscription Billing

```python
from pexipay import PexipayClient
from datetime import datetime, timedelta

client = PexipayClient(
    api_key=os.getenv('PEXIPAY_API_KEY')
)

def process_subscription(customer_id: str, plan: str):
    # Get customer details
    customer = client.customers.retrieve(customer_id)
    
    # Determine amount based on plan
    plan_prices = {
        'basic': 9.99,
        'pro': 29.99,
        'enterprise': 99.99
    }
    
    amount = plan_prices.get(plan, 9.99)
    
    # Create payment
    payment = client.payments.create(
        amount=amount,
        currency='USD',
        description=f'{plan.title()} Plan - Monthly',
        customer_email=customer['email'],
        customer_name=customer['name'],
        metadata={
            'customer_id': customer_id,
            'plan': plan,
            'billing_period': datetime.now().strftime('%Y-%m'),
            'next_billing_date': (datetime.now() + timedelta(days=30)).isoformat()
        }
    )
    
    return payment
```

### Flask Webhook Handler

```python
from flask import Flask, request, jsonify
from pexipay import verify_webhook_signature
import os

app = Flask(__name__)

@app.route('/webhooks/pexipay', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Pexipay-Signature')
    payload = request.get_data(as_text=True)
    
    # Verify signature
    if not verify_webhook_signature(
        payload,
        signature,
        os.getenv('PEXIPAY_WEBHOOK_SECRET')
    ):
        return jsonify({'error': 'Invalid signature'}), 400
    
    event = request.get_json()
    
    # Handle events
    if event['type'] == 'payment.succeeded':
        handle_successful_payment(event['data'])
    elif event['type'] == 'payment.failed':
        handle_failed_payment(event['data'])
    elif event['type'] == 'refund.succeeded':
        handle_refund(event['data'])
    
    return jsonify({'status': 'success'}), 200

def handle_successful_payment(payment):
    print(f'Payment succeeded: {payment["id"]}')
    # Update order status
    # Send confirmation email
```

## PHP

### Basic Payment

```php
<?php
require 'vendor/autoload.php';

use Pexipay\PexipayClient;

$client = new PexipayClient([
    'api_key' => getenv('PEXIPAY_API_KEY'),
    'environment' => 'production'
]);

function createPayment($client) {
    $payment = $client->payments->create([
        'amount' => 100.00,
        'currency' => 'USD',
        'description' => 'Premium subscription',
        'customer_email' => 'customer@example.com'
    ]);
    
    echo 'Payment created: ' . $payment['id'] . PHP_EOL;
    echo 'Status: ' . $payment['status'] . PHP_EOL;
}
```

### WordPress Integration

```php
<?php
// Add to your WordPress theme's functions.php or plugin

add_action('woocommerce_payment_complete', 'process_pexipay_payment');

function process_pexipay_payment($order_id) {
    $order = wc_get_order($order_id);
    
    $client = new \Pexipay\PexipayClient([
        'api_key' => get_option('pexipay_api_key'),
        'environment' => get_option('pexipay_environment', 'production')
    ]);
    
    try {
        $payment = $client->payments->create([
            'amount' => $order->get_total(),
            'currency' => $order->get_currency(),
            'description' => 'Order #' . $order->get_order_number(),
            'customer_email' => $order->get_billing_email(),
            'customer_name' => $order->get_billing_first_name() . ' ' . $order->get_billing_last_name(),
            'metadata' => [
                'order_id' => $order_id,
                'customer_id' => $order->get_customer_id()
            ]
        ]);
        
        $order->add_order_note('Pexipay payment created: ' . $payment['id']);
        
    } catch (\Pexipay\Exceptions\PexipayException $e) {
        $order->add_order_note('Pexipay payment failed: ' . $e->getMessage());
    }
}
```

### Webhook Handler

```php
<?php
require 'vendor/autoload.php';

use Pexipay\Webhook;

// Get webhook data
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PEXIPAY_SIGNATURE'] ?? '';

try {
    // Verify and parse webhook
    $event = Webhook::constructEvent(
        $payload,
        $signature,
        getenv('PEXIPAY_WEBHOOK_SECRET')
    );
    
    // Handle events
    switch ($event['type']) {
        case 'payment.succeeded':
            handleSuccessfulPayment($event['data']);
            break;
        case 'payment.failed':
            handleFailedPayment($event['data']);
            break;
        case 'refund.succeeded':
            handleRefund($event['data']);
            break;
    }
    
    http_response_code(200);
    echo json_encode(['status' => 'success']);
    
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid signature']);
}

function handleSuccessfulPayment($payment) {
    error_log('Payment succeeded: ' . $payment['id']);
    // Update database
    // Send confirmation email
}
```

## Common Use Cases

### 1. Payment Link for Invoice

```typescript
// JavaScript
async function createInvoicePaymentLink(invoiceData) {
  const link = await client.paymentLinks.create({
    amount: invoiceData.total,
    currency: 'USD',
    description: `Invoice ${invoiceData.number}`,
    customerInfo: {
      name: invoiceData.customerName,
      email: invoiceData.customerEmail
    },
    expiresAt: invoiceData.dueDate,
    metadata: {
      invoiceNumber: invoiceData.number,
      invoiceId: invoiceData.id
    }
  });

  return link.url;
}
```

### 2. Refund Processing

```python
# Python
def process_return(order_id: str, items: list):
    # Calculate refund amount
    refund_amount = sum(item['price'] * item['quantity'] for item in items)
    
    # Get original payment
    order = get_order_from_db(order_id)
    
    # Create refund
    refund = client.refunds.create(
        payment_id=order['payment_id'],
        amount=refund_amount,
        reason=f'Return of {len(items)} items',
        metadata={
            'order_id': order_id,
            'returned_items': items
        }
    )
    
    return refund
```

### 3. Customer Management

```php
// PHP
function getOrCreateCustomer($email, $name) {
    global $client;
    
    // Try to find existing customer
    $customers = $client->customers->list([
        'email' => $email,
        'limit' => 1
    ]);
    
    if (!empty($customers['data'])) {
        return $customers['data'][0];
    }
    
    // Create new customer
    return $client->customers->create([
        'email' => $email,
        'name' => $name
    ]);
}
```

### 4. Transaction Reports

```typescript
// JavaScript
async function generateMonthlyReport(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const transactions = await client.transactions.list({
    createdAfter: startDate.toISOString(),
    createdBefore: endDate.toISOString(),
    status: 'completed',
    limit: 1000
  });

  const summary = {
    totalRevenue: 0,
    totalTransactions: transactions.data.length,
    byType: {}
  };

  transactions.data.forEach(txn => {
    summary.totalRevenue += txn.amount;
    summary.byType[txn.type] = (summary.byType[txn.type] || 0) + 1;
  });

  return summary;
}
```

## Best Practices

### Error Handling

Always wrap SDK calls in try-catch blocks:

```typescript
try {
  const payment = await client.payments.create(params);
} catch (error) {
  if (error instanceof PexipayError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.statusCode);
    console.error('Request ID:', error.requestId);
  }
}
```

### Idempotency

Use idempotency keys for critical operations:

```typescript
const payment = await client.payments.create(
  params,
  { idempotencyKey: `order-${orderId}-payment-${attemptNumber}` }
);
```

### Metadata Usage

Store relevant business data in metadata:

```typescript
const payment = await client.payments.create({
  // ... other params
  metadata: {
    orderId: '12345',
    customerId: 'cus_abc',
    source: 'mobile_app',
    campaign: 'summer_sale_2025'
  }
});
```

## Support

For more examples and documentation:

- **Documentation**: [docs.pexipay.com](https://docs.pexipay.com)
- **API Reference**: [api.pexipay.com/docs](https://api.pexipay.com/docs)
- **GitHub Examples**: [github.com/pexipay/examples](https://github.com/pexipay/examples)
