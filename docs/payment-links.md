# Payment Links API Documentation

Complete guide for creating and managing payment links using the CircoFlows Hosted Payment API.

## Overview

Payment links provide a simple way to collect payments without building a custom checkout flow. Create a secure, shareable link that customers can use to complete payments through our hosted payment page.

### Key Benefits

- ✅ **No Coding Required** - Create links through the dashboard
- ✅ **PCI Compliant** - We handle all payment data securely
- ✅ **Mobile Optimized** - Works seamlessly on all devices
- ✅ **Customizable** - Add customer info, descriptions, and expiration
- ✅ **Real-time Notifications** - Receive webhook updates
- ✅ **Multi-currency Support** - Accept USD, EUR, GBP, CAD, AUD

## Quick Start Guide

### 1. Create a Payment Link

**Via Dashboard:**
1. Log in to your super-merchant dashboard
2. Click "Create Payment Link" button
3. Fill in amount, description, and optional customer information
4. Click "Create Payment Link"
5. Copy and share the generated URL

**Via API:**
```bash
curl -X POST https://yourapp.com/api/super-merchant/payment-links \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "description": "Payment for Order #12345",
    "customerInfo": {
      "name": "John Doe",
      "email": "customer@example.com",
      "phone": "+1234567890"
    },
    "expiresAt": "2025-12-31T23:59:59Z"
  }'
```

### 2. Share the Link

Copy the payment URL from the response and share it with your customer via:
- Email
- SMS
- WhatsApp
- Social media
- Any messaging platform

### 3. Customer Completes Payment

Your customer:
1. Clicks the payment link
2. Sees a secure hosted payment page
3. Enters their payment details
4. Completes the transaction

### 4. Receive Notifications

You'll receive webhook notifications for:
- Payment success
- Payment failure
- Payment expiration

## API Reference

### Create Payment Link

**Endpoint:** `POST /api/super-merchant/payment-links`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 100.00,              // Required: Amount in dollars
  "currency": "USD",             // Required: Currency code (USD, EUR, GBP, CAD, AUD)
  "description": "Order #12345", // Required: Payment description
  "customerInfo": {              // Optional: Pre-fill customer details
    "name": "John Doe",
    "email": "customer@example.com",
    "phone": "+1234567890"
  },
  "expiresAt": "2025-12-31T23:59:59Z", // Optional: ISO 8601 expiration
  "metadata": {                  // Optional: Custom data
    "orderId": "12345",
    "customField": "value"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentLink": {
    "sessionId": "sess_ABC123DEF456",
    "paymentUrl": "https://pay.circoflows.com/sess_ABC123DEF456",
    "amount": 100.00,
    "currency": "USD",
    "description": "Order #12345",
    "status": "pending",
    "expiresAt": "2025-12-31T23:59:59Z",
    "createdAt": "2025-11-23T12:00:00Z"
  }
}
```

### Check Payment Status

**Endpoint:** `GET /api/super-merchant/payment-links?sessionId={sessionId}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "status": {
    "session_id": "sess_ABC123DEF456",
    "amount": 10000,
    "currency": "USD",
    "description": "Order #12345",
    "status": "completed",
    "transaction_id": "txn_XYZ789",
    "customer_info": {
      "name": "John Doe",
      "email": "customer@example.com"
    },
    "created_at": "2025-11-23T12:00:00Z",
    "completed_at": "2025-11-23T12:05:00Z"
  }
}
```

## Payment Statuses

| Status | Description |
|--------|-------------|
| `pending` | Payment link created, awaiting payment |
| `completed` | Payment successfully processed |
| `failed` | Payment attempt failed |
| `expired` | Payment link expired before completion |
| `cancelled` | Payment link was cancelled |

## Supported Currencies

- **USD** - US Dollar
- **EUR** - Euro
- **GBP** - British Pound
- **CAD** - Canadian Dollar
- **AUD** - Australian Dollar

## Code Examples

### JavaScript / Node.js

```javascript
const axios = require('axios');

async function createPaymentLink() {
  try {
    const response = await axios.post(
      'https://yourapp.com/api/super-merchant/payment-links',
      {
        amount: 250.00,
        currency: 'USD',
        description: 'Premium Subscription - Annual',
        customerInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        expiresAt: '2025-12-31T23:59:59Z'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.JWT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log('Payment URL:', response.data.paymentLink.paymentUrl);
      // Share this URL with your customer
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}
```

### Python

```python
import requests
import os
from datetime import datetime, timedelta

def create_payment_link():
    url = 'https://yourapp.com/api/super-merchant/payment-links'
    
    # Set expiration to 7 days from now
    expires_at = (datetime.utcnow() + timedelta(days=7)).isoformat() + 'Z'
    
    payload = {
        'amount': 250.00,
        'currency': 'USD',
        'description': 'Premium Subscription - Annual',
        'customerInfo': {
            'name': 'Jane Smith',
            'email': 'jane@example.com'
        },
        'expiresAt': expires_at
    }
    
    headers = {
        'Authorization': f"Bearer {os.environ['JWT_TOKEN']}",
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        if data['success']:
            print(f"Payment URL: {data['paymentLink']['paymentUrl']}")
            print(f"Session ID: {data['paymentLink']['sessionId']}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
```

### PHP

```php
<?php

function createPaymentLink() {
    $url = 'https://yourapp.com/api/super-merchant/payment-links';
    
    $data = [
        'amount' => 250.00,
        'currency' => 'USD',
        'description' => 'Premium Subscription - Annual',
        'customerInfo' => [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com'
        ],
        'expiresAt' => date('c', strtotime('+7 days'))
    ];
    
    $options = [
        'http' => [
            'header' => [
                "Authorization: Bearer " . getenv('JWT_TOKEN'),
                "Content-Type: application/json"
            ],
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response !== FALSE) {
        $result = json_decode($response, true);
        if ($result['success']) {
            echo "Payment URL: " . $result['paymentLink']['paymentUrl'] . "\n";
            echo "Session ID: " . $result['paymentLink']['sessionId'] . "\n";
        }
    }
}
```

## Webhooks

Payment links automatically trigger webhook notifications to keep you informed of payment status changes.

### Webhook Events

- **payment.succeeded** - Payment completed successfully
- **payment.failed** - Payment failed or was declined
- **payment.pending** - Payment is pending (e.g., 3DS authentication required)

### Webhook Payload Example

```json
{
  "event": "payment.succeeded",
  "data": {
    "transaction_id": "txn_XYZ789",
    "session_id": "sess_ABC123DEF456",
    "amount": 10000,
    "currency": "USD",
    "status": "completed",
    "customer_info": {
      "name": "John Doe",
      "email": "customer@example.com"
    },
    "metadata": {
      "orderId": "12345"
    },
    "created_at": "2025-11-23T12:00:00Z",
    "completed_at": "2025-11-23T12:05:00Z"
  },
  "timestamp": "2025-11-23T12:05:01Z"
}
```

### Webhook Security

Always verify webhook signatures to ensure authenticity:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## Best Practices

### 1. Set Expiration Dates
Always set an expiration date to prevent old links from being used indefinitely. Recommended: 7-30 days.

```javascript
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
```

### 2. Include Customer Information
Pre-filling customer details improves checkout experience and reduces errors:

```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### 3. Use Clear Descriptions
Help customers understand what they're paying for:

✅ Good: "Premium Subscription - Annual (Jan 2026 - Dec 2026)"
❌ Bad: "Payment"

### 4. Store Session IDs
Keep track of session IDs in your database for reconciliation:

```sql
CREATE TABLE payment_links (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Handle Webhooks Properly
Implement idempotent webhook handlers to prevent duplicate processing:

```javascript
async function handleWebhook(event) {
  // Check if already processed
  const existing = await db.getWebhookEvent(event.id);
  if (existing) {
    return { status: 'already_processed' };
  }
  
  // Process event
  await db.processPayment(event.data);
  
  // Mark as processed
  await db.saveWebhookEvent(event.id);
  
  return { status: 'processed' };
}
```

### 6. Send Confirmation Emails
After payment link creation, send an email to the customer with the link:

```javascript
await sendEmail({
  to: customerEmail,
  subject: 'Your Payment Link',
  body: `Hi ${customerName},\n\nClick here to complete your payment:\n${paymentUrl}\n\nThis link expires on ${expiresAt}.`
});
```

## Error Handling

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| 400 | Invalid request | Check required fields (amount, description) |
| 401 | Unauthorized | Verify your JWT token is valid |
| 403 | Forbidden | Ensure you have super-merchant role |
| 404 | Session not found | Check the session ID is correct |
| 500 | Server error | Contact support if persists |

### Example Error Response

```json
{
  "error": "Invalid amount",
  "details": "Amount must be greater than 0"
}
```

### Handling Errors in Code

```javascript
try {
  const response = await createPaymentLink(data);
  console.log('Success:', response.paymentLink.paymentUrl);
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.error);
    console.error('Details:', error.response.data.details);
  } else if (error.request) {
    // No response received
    console.error('Network error:', error.message);
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

## Testing

### Test Mode
Use test mode to create payment links without processing real payments:

```env
CIRCOFLOWS_TEST_MODE=true
```

### Test Cards
Use these test card numbers:

| Card Number | Result |
|-------------|--------|
| 4242424242424242 | Success |
| 4000000000000002 | Declined |
| 4000000000003220 | 3DS Required |

### Test Example

```javascript
// Create a test payment link
const testLink = await createPaymentLink({
  amount: 0.50, // Use small amounts for testing
  currency: 'USD',
  description: 'Test Payment - Please Ignore',
  customerInfo: {
    name: 'Test User',
    email: 'test@example.com'
  }
});

console.log('Test payment URL:', testLink.paymentUrl);
// Use test card 4242424242424242 to complete payment
```

## FAQ

### Can I customize the payment page?
The payment page is hosted by CircoFlows with standard branding. Contact support for white-label options.

### How long are payment links valid?
You can set custom expiration dates, or links remain valid indefinitely by default.

### Can customers pay in installments?
Currently, payment links support one-time payments only. Contact sales for installment options.

### What happens if a payment fails?
The customer can retry immediately. You'll receive a webhook notification of the failure.

### Can I refund a payment made through a link?
Yes, use the refund API with the transaction ID from the webhook notification.

### How do I track which link was used?
Use the session ID returned when creating the link to track status and reconcile payments.

## Support

Need help with payment links?

- 📧 Email: support@pexipay.com
- 💬 Live Chat: Available in your dashboard
- 📖 Full API Docs: https://yourapp.com/docs/api
- 🔧 Developer Community: https://yourapp.com/community

## Related Documentation

- [CircoFlows Integration Guide](./CIRCOFLOWS_INTEGRATION.md)
- [Webhook Setup](./integration-guide.md#webhooks)
- [Test Cards](./test-cards.md)
- [API Authentication](../app/docs/api)
