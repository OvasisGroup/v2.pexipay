# PexiPay Test Shop

A demonstration e-commerce shop integrated with the PexiPay payment gateway and CircoFlows API.

## Overview

The test shop demonstrates a complete payment flow:

1. **Product Catalog** - Browse and add products to cart
2. **Shopping Cart** - Review items and adjust quantities
3. **Checkout** - Enter billing information
4. **Payment Processing** - Redirect to CircoFlows hosted payment page
5. **Success/Cancel** - Handle payment results

## Features

### 🛍️ Product Catalog
- 6 sample products across different categories
- Product cards with images, descriptions, and prices
- Add to cart functionality

### 🛒 Shopping Cart
- Real-time cart updates
- Quantity adjustment
- Item removal
- Running total calculation
- Sticky sidebar on desktop

### 💳 Checkout Flow
- Billing information form
- Order summary
- Secure payment badge indicators
- Integration with CircoFlows API

### ✅ Payment Results
- Success page with transaction ID
- Cancel page for abandoned payments
- Links back to shop and dashboard

## Routes

- `/test-shop` - Main shop page with product catalog
- `/test-shop/checkout` - Checkout and billing information
- `/test-shop/success` - Payment success confirmation
- `/test-shop/cancel` - Payment cancellation page

## API Integration

The test shop uses the following API endpoints:

### Create Payment
```typescript
POST /api/payments
Authorization: Bearer {token}

{
  "amount": 299.99,
  "currency": "USD",
  "paymentMethod": "CARD",
  "customerEmail": "customer@example.com",
  "customerName": "Test Customer",
  "returnUrl": "https://yoursite.com/test-shop/success",
  "cancelUrl": "https://yoursite.com/test-shop/cancel",
  "metadata": {
    "source": "test-shop",
    "items": [...],
    "shippingAddress": {...}
  }
}
```

Response:
```typescript
{
  "transactionId": "txn_xxx",
  "status": "PROCESSING",
  "paymentUrl": "https://checkout.circoflows.com/pay/xxx",
  "requires3DS": false,
  "threeDSUrl": null
}
```

## Testing the Integration

### Prerequisites

1. **Login Required**: You must be logged in as a merchant or admin
2. **API Configuration**: CircoFlows API credentials must be configured in `.env`
3. **Webhook Setup**: CircoFlows webhook must point to `/api/webhooks/circoflows`

### Test Flow

1. **Navigate to Test Shop**
   ```
   http://localhost:3000/test-shop
   ```

2. **Add Products to Cart**
   - Click "Add" button on any product
   - Adjust quantities in the sidebar cart
   - View running total

3. **Proceed to Checkout**
   - Click "Proceed to Checkout" button
   - Fill in billing information (pre-filled with test data)
   - Review order summary

4. **Complete Payment**
   - Click "Pay $XXX.XX" button
   - System creates transaction in database
   - Redirects to CircoFlows hosted payment page
   - Enter test card details (provided by CircoFlows)
   - Complete 3DS authentication if required

5. **View Results**
   - Success: Redirected to `/test-shop/success` with transaction ID
   - Cancel: Redirected to `/test-shop/cancel`
   - View transaction in merchant dashboard

### Test Cards (CircoFlows)

Refer to CircoFlows documentation for test card numbers:

**Successful Payment:**
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**3DS Required:**
- Card: 4000 0000 0000 3220
- Requires 3DS authentication flow

**Declined Payment:**
- Card: 4000 0000 0000 0002
- Payment will be declined

## Data Flow

```
┌─────────────┐
│  Test Shop  │
│   (React)   │
└──────┬──────┘
       │ POST /api/payments
       ↓
┌─────────────────┐
│  Payment API    │
│  (Next.js)      │
└──────┬──────────┘
       │ 1. Create Transaction
       │ 2. Call CircoFlows API
       ↓
┌─────────────────┐
│   CircoFlows    │
│  Hosted Page    │
└──────┬──────────┘
       │ Customer enters card
       │ 3DS authentication
       ↓
┌─────────────────┐
│    Webhook      │
│  /api/webhooks  │
└──────┬──────────┘
       │ Update Transaction
       │ Update Ledger
       ↓
┌─────────────────┐
│   Success or    │
│   Cancel Page   │
└─────────────────┘
```

## Environment Variables

Required environment variables for the test shop:

```env
# CircoFlows Integration
CIRCOFLOWS_API_URL="https://api-test.example.com"
CIRCOFLOWS_API_KEY="pk_test_xxx"
CIRCOFLOWS_WEBHOOK_SECRET="sk_webhook_xxx"
CIRCOFLOWS_TEST_MODE="true"

# Application
APP_URL="http://localhost:3000"
```

## Security Features

### Test Mode Protection
- All payments are marked as test transactions
- No real money is processed
- Test mode indicator in checkout

### Webhook Verification
- HMAC signature verification
- Rejects invalid webhook requests
- Logs all webhook events

### Fraud Detection
- Automatic fraud scoring
- High-risk transaction blocking
- Fraud case creation for review

### PCI Compliance
- No card data stored locally
- Redirects to PCI-compliant hosted page
- Uses tokenization for recurring payments

## Customization

### Adding Products

Edit the `products` array in `/app/test-shop/page.tsx`:

```typescript
const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Your Product',
    description: 'Product description',
    price: 99.99,
    image: '/images/products/your-product.jpg',
    category: 'Electronics',
  },
  // ... more products
];
```

### Styling

The test shop uses Tailwind CSS. Customize colors and styles by modifying the component classes.

### Payment Metadata

Add custom metadata to track additional information:

```typescript
metadata: {
  source: 'test-shop',
  campaignId: 'summer-2024',
  referrer: 'google-ads',
  items: cartItems,
  customField: 'value',
}
```

## Troubleshooting

### "Please login to make a payment"
- Ensure you're logged in to the PexiPay platform
- Check that `token` exists in localStorage

### "Payment URL not received"
- Verify CircoFlows API credentials
- Check API response in browser console
- Review server logs for errors

### Webhook Not Received
- Ensure CircoFlows webhook URL is configured
- Check webhook signature verification
- Review `/api/webhooks/circoflows` endpoint logs

### Transaction Not Updating
- Verify webhook endpoint is accessible
- Check database connection
- Review audit logs in admin panel

## Production Deployment

Before deploying to production:

1. **Update Environment Variables**
   - Set `CIRCOFLOWS_TEST_MODE="false"`
   - Use production API keys
   - Update `APP_URL` to production domain

2. **Configure Webhooks**
   - Set CircoFlows webhook URL to production endpoint
   - Use HTTPS for all webhook endpoints

3. **Security Hardening**
   - Enable rate limiting
   - Add CAPTCHA to checkout
   - Implement session timeout

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor webhook delivery
   - Track payment success rates

## Support

For issues or questions:
- Check CircoFlows API documentation
- Review audit logs in admin panel
- Contact PexiPay support team

## License

This test shop is part of the PexiPay platform and is intended for demonstration purposes only.
