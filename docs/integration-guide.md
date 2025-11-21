# PexiPay Integration Guide

Complete guide for integrating PexiPay payment processing into your application.

## Table of Contents

- [Getting Started](#getting-started)
- [Integration Methods](#integration-methods)
- [Authentication](#authentication)
- [Test Mode](#test-mode)
- [Webhooks](#webhooks)
- [Error Handling](#error-handling)

## Getting Started

### 1. Create a Merchant Account

1. Sign up at https://pexipay.com/register
2. Complete your merchant profile
3. Verify your email address

### 2. Generate API Keys

1. Navigate to Dashboard → API Keys
2. Click "Create API Key"
3. Choose test or live mode
4. Save your API key securely (it won't be shown again)

### 3. Choose Integration Method

PexiPay offers two integration methods:

- **Hosted Payment Pages** (Recommended) - Redirect customers to secure payment page
- **Direct Integration** - Accept card details directly on your site (requires PCI compliance)

## Integration Methods

### Hosted Payment Pages

**Best for:** Most merchants who want quick integration without PCI compliance burden

**How it works:**
1. Create a payment on your server
2. Redirect customer to the returned `paymentUrl`
3. Customer completes payment on PexiPay's secure page
4. Customer is redirected back to your `returnUrl`
5. Receive webhook notification of payment status

**Example:**

```javascript
// Server-side (Node.js)
const response = await fetch('https://api.pexipay.com/v1/api/payments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 5000, // $50.00
    currency: 'USD',
    paymentMethod: 'CARD',
    customerEmail: 'customer@example.com',
    returnUrl: 'https://yoursite.com/success',
    cancelUrl: 'https://yoursite.com/cancel'
  })
});

const { paymentUrl } = await response.json();

// Redirect customer to paymentUrl
```

### Direct Integration

**Best for:** Merchants who need full control over checkout experience and can handle PCI compliance

**How it works:**
1. Collect card details securely on your site
2. Send card data to PexiPay API from your server
3. Receive immediate payment result
4. Handle 3D Secure if required
5. Show confirmation to customer

**Example:**

```javascript
// Server-side (Node.js)
const response = await fetch('https://api.pexipay.com/v1/api/payments/direct', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 5000,
    currency: 'USD',
    cardNumber: '4111111111111111',
    cardExpiry: '12/25',
    cardCvv: '123',
    cardHolderName: 'John Doe',
    billingAddress: {
      line1: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'US'
    },
    customerEmail: 'customer@example.com'
  })
});

const result = await response.json();

if (result.requires3DS) {
  // Redirect to 3D Secure authentication
  window.location.href = result.threeDSUrl;
} else if (result.status === 'SUCCEEDED') {
  // Payment successful
  console.log('Payment successful:', result.transactionId);
}
```

## Authentication

All API requests require authentication using API keys.

### API Key Format

- **Test keys:** `pxp_test_xxxxxxxxxxxx`
- **Live keys:** `pxp_live_xxxxxxxxxxxx`

### Using API Keys

Include your API key in the `Authorization` header:

```
Authorization: Bearer pxp_test_your_api_key
```

**Important:**
- Never expose API keys in client-side code
- Use environment variables to store keys
- Rotate keys if compromised
- Use test keys for development

## Test Mode

Test mode allows you to simulate payments without real charges.

### Enabling Test Mode

1. Use API keys starting with `pxp_test_`
2. All transactions will be marked as test
3. Use test card numbers (see [Test Cards](./test-cards.md))

### Test Card Numbers

Quick reference:

- **Success:** `4111111111111111`
- **Decline:** `4000000000000002`
- **3D Secure:** `4000000000003220`

See [complete test card list](./test-cards.md)

## Webhooks

Webhooks notify your server of payment events in real-time.

### Setting Up Webhooks

1. Go to Dashboard → Webhooks
2. Add your webhook URL (must be HTTPS)
3. Select events to receive
4. Save webhook secret for signature verification

### Webhook Events

- `payment.succeeded` - Payment completed successfully
- `payment.failed` - Payment failed
- `payment.refunded` - Payment refunded
- `payment.disputed` - Payment disputed (chargeback)

### Example Webhook Handler

```javascript
const crypto = require('crypto');

app.post('/webhooks/pexipay', (req, res) => {
  const signature = req.headers['x-pexipay-signature'];
  const payload = JSON.stringify(req.body);
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process event
  const { type, data } = req.body;
  
  switch (type) {
    case 'payment.succeeded':
      console.log('Payment succeeded:', data.transactionId);
      // Update order status in database
      break;
    case 'payment.failed':
      console.log('Payment failed:', data.transactionId);
      // Handle failed payment
      break;
  }
  
  res.sendStatus(200);
});
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `402` - Payment Failed
- `403` - Forbidden (account not active, fraud blocked)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Server Error

### Error Response Format

```json
{
  "error": "Payment failed",
  "details": "Card declined by issuer"
}
```

### Best Practices

1. **Always check HTTP status codes**
2. **Display user-friendly error messages**
3. **Log errors for debugging**
4. **Implement retry logic with exponential backoff**
5. **Handle network timeouts gracefully**

### Example Error Handling

```javascript
try {
  const response = await fetch('https://api.pexipay.com/v1/api/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    
    switch (response.status) {
      case 400:
        console.error('Invalid payment data:', error.details);
        break;
      case 401:
        console.error('Invalid API key');
        break;
      case 402:
        console.error('Payment declined:', error.error);
        break;
      case 403:
        console.error('Payment blocked:', error.error);
        break;
      default:
        console.error('Unexpected error:', error);
    }
    
    throw new Error(error.error);
  }
  
  const result = await response.json();
  return result;
  
} catch (error) {
  if (error.name === 'TypeError') {
    // Network error
    console.error('Network error - please try again');
  }
  throw error;
}
```

## Rate Limits

- **Test mode:** 100 requests per minute
- **Live mode:** 1000 requests per minute

Rate limit info is returned in headers:
- `X-RateLimit-Limit` - Requests allowed per minute
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Timestamp when limit resets

## Support

- **Documentation:** https://docs.pexipay.com
- **API Reference:** https://pexipay.com/docs/api
- **Support Email:** support@pexipay.com
- **Status Page:** https://status.pexipay.com

## Security Best Practices

1. **Use HTTPS only** - Never send card data over HTTP
2. **Validate card data** - Client-side validation before submission
3. **Use CSRF tokens** - Protect payment forms from CSRF attacks
4. **Log securely** - Never log full card numbers or CVV
5. **Implement rate limiting** - Prevent brute force attacks
6. **Monitor for fraud** - Review flagged transactions
7. **Keep keys secure** - Use environment variables, never commit to git
8. **Regular security audits** - Review your integration regularly

## Next Steps

1. Read the [API Documentation](/docs/api)
2. Review [Test Card Numbers](./test-cards.md)
3. Build your integration
4. Test thoroughly in test mode
5. Switch to live keys for production
6. Monitor transactions in dashboard

---

**Need Help?** Contact our integration team at integration@pexipay.com
