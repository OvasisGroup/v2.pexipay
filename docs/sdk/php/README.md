# Pexipay PHP SDK

Official PHP SDK for Pexipay - Accept card payments and convert them to cryptocurrency seamlessly.

[![Packagist Version](https://img.shields.io/packagist/v/pexipay/sdk.svg)](https://packagist.org/packages/pexipay/sdk)
[![PHP Version](https://img.shields.io/packagist/php-v/pexipay/sdk.svg)](https://packagist.org/packages/pexipay/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Modern PHP** (7.4+) with type hints
- ✅ **PSR-4 autoloading** for easy integration
- ✅ **Automatic retries** with exponential backoff
- ✅ **Webhook signature verification** for security
- ✅ **Complete API coverage** - payments, refunds, customers, and more
- ✅ **Composer support** for dependency management

## Installation

```bash
composer require pexipay/sdk
```

## Quick Start

```php
<?php
require 'vendor/autoload.php';

use Pexipay\PexipayClient;

// Initialize the client
$client = new PexipayClient([
    'api_key' => 'your_api_key',
    'environment' => 'production' // or 'sandbox' for testing
]);

// Create a payment
$payment = $client->payments->create([
    'amount' => 100.00,
    'currency' => 'USD',
    'description' => 'Order #1234',
    'customer_email' => 'customer@example.com'
]);

echo 'Payment status: ' . $payment['status'];
```

## Configuration

```php
$client = new PexipayClient([
    'api_key' => 'your_api_key',
    'environment' => 'production', // 'production' or 'sandbox'
    'timeout' => 30, // Request timeout in seconds (default: 30)
    'max_retries' => 3 // Maximum retry attempts (default: 3)
]);
```

## Core Resources

### Payments

```php
// Create a payment
$payment = $client->payments->create([
    'amount' => 250.00,
    'currency' => 'USD',
    'description' => 'Premium subscription',
    'customer_email' => 'customer@example.com',
    'payment_method' => [
        'type' => 'card',
        'card' => [
            'number' => '4242424242424242',
            'exp_month' => 12,
            'exp_year' => 2025,
            'cvc' => '123'
        ]
    ]
]);

// Retrieve a payment
$payment = $client->payments->retrieve('pay_123456');

// List payments
$payments = $client->payments->list([
    'limit' => 10,
    'status' => 'succeeded'
]);

// Handle 3D Secure
if ($payment['requires3DS']) {
    $confirmed = $client->payments->confirm3DS(
        $payment['id'],
        $threeDSResult
    );
}

// Cancel a payment
$client->payments->cancel('pay_123456');

// Capture a payment
$client->payments->capture('pay_123456', 100.00);
```

### Payment Links

```php
// Create a payment link
$link = $client->paymentLinks->create([
    'amount' => 199.99,
    'currency' => 'USD',
    'description' => 'Annual membership',
    'customer_info' => [
        'name' => 'John Doe',
        'email' => 'john@example.com'
    ],
    'return_url' => 'https://yoursite.com/success',
    'cancel_url' => 'https://yoursite.com/cancel'
]);

echo 'Payment URL: ' . $link['url'];

// Retrieve a payment link
$link = $client->paymentLinks->retrieve('link_123456');

// List payment links
$links = $client->paymentLinks->list(['status' => 'active']);

// Cancel a payment link
$client->paymentLinks->cancel('link_123456');
```

### Customers

```php
// Create a customer
$customer = $client->customers->create([
    'email' => 'customer@example.com',
    'name' => 'Jane Smith',
    'phone' => '+1234567890',
    'address' => [
        'line1' => '123 Main St',
        'city' => 'San Francisco',
        'state' => 'CA',
        'postal_code' => '94111',
        'country' => 'US'
    ]
]);

// Retrieve a customer
$customer = $client->customers->retrieve('cus_123456');

// Update a customer
$customer = $client->customers->update('cus_123456', [
    'name' => 'Jane Doe'
]);

// List customers
$customers = $client->customers->list(['limit' => 50]);

// Delete a customer
$client->customers->delete('cus_123456');
```

### Refunds

```php
// Create a full refund
$refund = $client->refunds->create([
    'payment_id' => 'pay_123456',
    'reason' => 'Customer requested refund'
]);

// Create a partial refund
$refund = $client->refunds->create([
    'payment_id' => 'pay_123456',
    'amount' => 50.00,
    'reason' => 'Partial refund'
]);

// Retrieve a refund
$refund = $client->refunds->retrieve('ref_123456');

// List refunds
$refunds = $client->refunds->list(['payment_id' => 'pay_123456']);

// Cancel a refund
$client->refunds->cancel('ref_123456');
```

### Transactions

```php
// Retrieve a transaction
$transaction = $client->transactions->retrieve('txn_123456');

// List transactions
$transactions = $client->transactions->list([
    'limit' => 100,
    'type' => 'payment',
    'status' => 'completed'
]);
```

### Balance

```php
// Get account balance
$balance = $client->balance->retrieve();

echo 'Available: ' . json_encode($balance['available']);
echo 'Pending: ' . json_encode($balance['pending']);

// List balance transactions
$transactions = $client->balance->listTransactions(['limit' => 50]);
```

## Webhooks

```php
<?php
use Pexipay\Webhook;

// Get webhook data
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PEXIPAY_SIGNATURE'];

try {
    // Verify and parse webhook
    $event = Webhook::constructEvent(
        $payload,
        $signature,
        'your_webhook_secret'
    );
    
    // Handle event
    switch ($event['type']) {
        case 'payment.succeeded':
            echo 'Payment succeeded: ' . json_encode($event['data']);
            break;
        case 'payment.failed':
            echo 'Payment failed: ' . json_encode($event['data']);
            break;
    }
    
    http_response_code(200);
} catch (\InvalidArgumentException $e) {
    http_response_code(400);
    echo 'Invalid signature';
}
```

## Error Handling

```php
use Pexipay\Exceptions\PexipayException;

try {
    $payment = $client->payments->create([
        'amount' => 100.00,
        'currency' => 'USD'
    ]);
} catch (PexipayException $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
    echo 'Status code: ' . $e->getStatusCode() . PHP_EOL;
    echo 'Error code: ' . $e->getErrorCode() . PHP_EOL;
    echo 'Request ID: ' . $e->getRequestId() . PHP_EOL;
    echo 'Details: ' . json_encode($e->getDetails()) . PHP_EOL;
}
```

## Testing

Use sandbox mode for testing:

```php
$client = new PexipayClient([
    'api_key' => 'test_api_key',
    'environment' => 'sandbox'
]);

// Test card numbers
$testCards = [
    'success' => '4242424242424242',
    'declined' => '4000000000000002',
    '3ds_required' => '4000000000003220'
];
```

## Support

- **Documentation**: [docs.pexipay.com](https://docs.pexipay.com)
- **API Reference**: [api.pexipay.com/docs](https://api.pexipay.com/docs)
- **Discord**: [discord.gg/pexipay](https://discord.gg/pexipay)
- **Email**: support@pexipay.com

## License

MIT License - see LICENSE file for details.
