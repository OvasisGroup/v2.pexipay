# CircoFlows API Integration Guide

Complete guide for integrating CircoFlows payment gateway with PexiPay.

## Overview

CircoFlows is integrated as the payment gateway for processing card payments. The integration supports:

- ✅ Hosted payment pages
- ✅ Direct API payments
- ✅ 3DS authentication
- ✅ Payment capture and authorization
- ✅ Refunds
- ✅ Webhook notifications
- ✅ Test mode

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# CircoFlows API Configuration
CIRCOFLOWS_API_URL="https://api-test.circoflows.com/v1"
CIRCOFLOWS_API_KEY="pk_bihAoCPC6oy0bd3XjjjiliWh3tKyxvY3"
CIRCOFLOWS_WEBHOOK_SECRET="sk_fZaJBbYjIoNl1akMCNPf8ojs4RwnVorMjSr4xcbGAnHfdzmrXfe9OmWY0pA9dCyo"
CIRCOFLOWS_TEST_MODE="true"
```

**Production:**
```env
CIRCOFLOWS_API_URL="https://api.circoflows.com/v1"
CIRCOFLOWS_API_KEY="pk_live_your_key_here"
CIRCOFLOWS_WEBHOOK_SECRET="sk_live_webhook_secret_here"
CIRCOFLOWS_TEST_MODE="false"
```

## Client Usage

### Initialize Client

```typescript
import { circoFlowsClient } from '@/lib/circoflows/client';
```

The client is a singleton instance, automatically configured from environment variables.

### Create Hosted Payment

```typescript
const payment = await circoFlowsClient.createHostedPayment({
  amount: 100.00,
  currency: 'USD',
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  description: 'Order #12345',
  merchantReference: 'txn_abc123',
  returnUrl: 'https://yoursite.com/payment/success',
  cancelUrl: 'https://yoursite.com/payment/cancel',
  webhookUrl: 'https://yoursite.com/api/webhooks/circoflows',
  metadata: {
    orderId: '12345',
    customField: 'value',
  },
});

// Redirect customer to payment page
window.location.href = payment.paymentUrl;
```

### Create Direct Payment

```typescript
const payment = await circoFlowsClient.createDirectPayment({
  amount: 100.00,
  currency: 'USD',
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  merchantReference: 'txn_abc123',
  webhookUrl: 'https://yoursite.com/api/webhooks/circoflows',
});

// Check if 3DS is required
if (payment.requires3DS) {
  window.location.href = payment.threeDSUrl;
}
```

### Get Payment Status

```typescript
const status = await circoFlowsClient.getPaymentStatus('payment_id_here');

console.log(status.status); // 'pending', 'authorized', 'succeeded', 'failed'
```

### Capture Payment

```typescript
// Capture full amount
await circoFlowsClient.capturePayment('payment_id_here');

// Partial capture
await circoFlowsClient.capturePayment('payment_id_here', 50.00);
```

### Refund Payment

```typescript
// Full refund
await circoFlowsClient.refundPayment('payment_id_here');

// Partial refund
await circoFlowsClient.refundPayment(
  'payment_id_here',
  25.00,
  'Customer requested refund'
);
```

## Webhook Integration

### Endpoint Setup

The webhook endpoint is at `/api/webhooks/circoflows/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { circoFlowsClient } from '@/lib/circoflows/client';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-circoflows-signature') || '';

  // Verify webhook signature
  const isValid = await circoFlowsClient.verifyWebhookSignature(body, signature);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body);
  
  // Process webhook event
  // ... update transaction status
  
  return NextResponse.json({ success: true });
}
```

### Webhook Events

CircoFlows sends these webhook events:

| Event | Description |
|-------|-------------|
| `payment.created` | Payment session created |
| `payment.authorized` | Payment authorized (not captured) |
| `payment.captured` | Payment captured successfully |
| `payment.succeeded` | Payment completed successfully |
| `payment.failed` | Payment failed |
| `payment.canceled` | Payment canceled |
| `payment.refunded` | Payment refunded |

### Webhook Payload

```typescript
{
  "event": "payment.succeeded",
  "paymentId": "pay_abc123",
  "status": "succeeded",
  "amount": 100.00,
  "currency": "USD",
  "timestamp": "2024-01-01T12:00:00Z",
  "signature": "hmac_sha256_signature",
  "metadata": {
    "transactionId": "txn_123",
    "merchantId": "mch_456"
  }
}
```

### Configure CircoFlows Webhook

1. Login to CircoFlows dashboard
2. Navigate to **Settings** → **Webhooks**
3. Add webhook URL: `https://yourdomain.com/api/webhooks/circoflows`
4. Select events to receive
5. Save and copy the webhook secret
6. Add secret to `.env` as `CIRCOFLOWS_WEBHOOK_SECRET`

## Payment Flow

### Hosted Payment Flow

```
┌─────────────┐
│   Your App  │
│             │
└──────┬──────┘
       │ 1. Create payment request
       ↓
┌─────────────────┐
│  POST /payments │
│                 │
└──────┬──────────┘
       │ 2. Call CircoFlows API
       ↓
┌─────────────────┐
│   CircoFlows    │
│   Creates       │
│   Session       │
└──────┬──────────┘
       │ 3. Return payment URL
       ↓
┌─────────────────┐
│  Redirect to    │
│  Hosted Page    │
└──────┬──────────┘
       │ 4. Customer enters card
       ↓
┌─────────────────┐
│   CircoFlows    │
│   Processes     │
│   Payment       │
└──────┬──────────┘
       │ 5. Send webhook
       ↓
┌─────────────────┐
│  Your Webhook   │
│  Endpoint       │
└──────┬──────────┘
       │ 6. Update transaction
       ↓
┌─────────────────┐
│  Redirect to    │
│  Success/Cancel │
└─────────────────┘
```

## Status Mapping

Map CircoFlows statuses to internal transaction statuses:

```typescript
const statusMap: Record<string, string> = {
  'pending': 'PENDING',
  'processing': 'PROCESSING',
  'authorized': 'AUTHORIZED',
  'succeeded': 'COMPLETED',
  'failed': 'FAILED',
  'canceled': 'CANCELLED',
  'refunded': 'REFUNDED',
};
```

## Error Handling

### API Errors

```typescript
try {
  const payment = await circoFlowsClient.createHostedPayment(data);
} catch (error) {
  if (error.message.includes('401')) {
    // Invalid API key
  } else if (error.message.includes('400')) {
    // Invalid request data
  } else if (error.message.includes('429')) {
    // Rate limit exceeded
  } else {
    // Other error
  }
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Invalid request | Check request parameters |
| 401 | Unauthorized | Verify API key |
| 403 | Forbidden | Check account status |
| 404 | Not found | Verify payment ID |
| 429 | Rate limit | Implement retry logic |
| 500 | Server error | Retry with backoff |

## Testing

### Test Cards

Use these test card numbers in test mode:

**Successful Payment:**
```
Card Number: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
```

**3DS Authentication:**
```
Card Number: 4000 0000 0000 3220
Expiry: 12/25
CVV: 123
```

**Declined Payment:**
```
Card Number: 4000 0000 0000 0002
Expiry: 12/25
CVV: 123
```

**Insufficient Funds:**
```
Card Number: 4000 0000 0000 9995
Expiry: 12/25
CVV: 123
```

### Test Mode vs Production

| Feature | Test Mode | Production |
|---------|-----------|------------|
| Real charges | ❌ No | ✅ Yes |
| Test cards | ✅ Yes | ❌ No |
| Webhooks | ✅ Yes | ✅ Yes |
| API calls | ✅ Yes | ✅ Yes |
| 3DS flow | ✅ Simulated | ✅ Real |

## Security Best Practices

### 1. API Key Protection
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Different keys for test/production

### 2. Webhook Security
- Always verify webhook signatures
- Use HTTPS for webhook URLs
- Implement idempotency
- Log all webhook events

### 3. PCI Compliance
- Never store card numbers
- Use hosted payment pages
- Implement 3DS authentication
- Follow PCI-DSS guidelines

### 4. Amount Validation
```typescript
// Always validate amounts server-side
if (amount <= 0 || amount > MAX_AMOUNT) {
  throw new Error('Invalid amount');
}

// Prevent decimal precision issues
const roundedAmount = Math.round(amount * 100) / 100;
```

## Monitoring

### Key Metrics to Track

1. **Payment Success Rate**
   ```sql
   SELECT 
     COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(*) as success_rate
   FROM transactions
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

2. **Average Processing Time**
   ```sql
   SELECT 
     AVG(EXTRACT(EPOCH FROM (processed_at - created_at))) as avg_seconds
   FROM transactions
   WHERE processed_at IS NOT NULL;
   ```

3. **Webhook Delivery Rate**
   ```sql
   SELECT 
     COUNT(CASE WHEN status = 'SENT' THEN 1 END) * 100.0 / COUNT(*) as delivery_rate
   FROM webhook_events
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

### Alerts to Set Up

- Payment success rate drops below 95%
- Webhook delivery fails 3+ times
- High number of declined payments
- Unusual refund activity
- API response time > 5 seconds

## Troubleshooting

### Payment Not Processing

1. **Check API credentials**
   ```bash
   echo $CIRCOFLOWS_API_KEY
   ```

2. **Verify test mode setting**
   ```typescript
   console.log('Test mode:', process.env.CIRCOFLOWS_TEST_MODE);
   ```

3. **Check API logs**
   - Review CircoFlows dashboard
   - Check application server logs
   - Verify network connectivity

### Webhook Not Received

1. **Verify webhook URL is accessible**
   ```bash
   curl -X POST https://yourdomain.com/api/webhooks/circoflows \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

2. **Check webhook configuration in CircoFlows dashboard**

3. **Verify signature validation**
   ```typescript
   console.log('Webhook secret:', process.env.CIRCOFLOWS_WEBHOOK_SECRET ? 'Set' : 'Missing');
   ```

### Transaction Status Not Updating

1. **Check database connection**
2. **Verify transaction ID mapping**
3. **Review audit logs**
4. **Check for errors in webhook endpoint**

## API Reference

### Request Headers

All API requests require these headers:

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_API_KEY',
  'X-API-Version': '1.0'
}
```

### Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| Create Payment | 100/minute |
| Get Payment | 300/minute |
| Capture/Refund | 50/minute |
| Webhooks | No limit |

## Support

### CircoFlows Support
- Documentation: https://docs.circoflows.com
- Support Email: support@circoflows.com
- Dashboard: https://dashboard.circoflows.com

### PexiPay Resources
- Test Shop: `/test-shop`
- API Documentation: `/docs/api-keys`
- Audit Logs: `/admin/audit`

## Migration Guide

### From Test to Production

1. **Update environment variables**
   ```env
   CIRCOFLOWS_TEST_MODE="false"
   CIRCOFLOWS_API_KEY="pk_live_xxx"
   CIRCOFLOWS_WEBHOOK_SECRET="sk_live_xxx"
   ```

2. **Update webhook URL in CircoFlows dashboard**

3. **Test with small transaction**

4. **Monitor for 24 hours**

5. **Gradually increase volume**

### Version Updates

Always check CircoFlows API changelog before updating:
- Review breaking changes
- Test in staging environment
- Update API version header
- Monitor error rates post-deployment

---

**Last Updated:** November 2025  
**API Version:** 1.0  
**CircoFlows Integration Version:** 1.0.0
