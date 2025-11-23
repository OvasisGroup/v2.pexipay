# Pexipay SDK Documentation

Welcome to the official Pexipay SDK documentation. Our SDKs make it easy to integrate card-to-crypto payment functionality into your applications.

## 🚀 Quick Navigation

- [Getting Started](./README.md) - Overview and quick start guide
- [Integration Guide](./INTEGRATION_GUIDE.md) - Complete integration documentation
- [Code Examples](./EXAMPLES.md) - Real-world implementation examples

## 📦 Available SDKs

### JavaScript/TypeScript SDK
**Package:** `@pexipay/sdk`

Perfect for Node.js applications, React, Next.js, and modern JavaScript projects.

- [JavaScript/TypeScript Documentation](./javascript/README.md)
- [npm Package](https://www.npmjs.com/package/@pexipay/sdk)
- **Installation:** `npm install @pexipay/sdk`

**Key Features:**
- Full TypeScript support with complete type definitions
- Automatic request retries with exponential backoff
- Built-in webhook signature verification
- Works with Node.js 16+

---

### Python SDK
**Package:** `pexipay`

Ideal for Python applications, Django, Flask, FastAPI, and data science projects.

- [Python Documentation](./python/README.md)
- [PyPI Package](https://pypi.org/project/pexipay/)
- **Installation:** `pip install pexipay`

**Key Features:**
- Type hints for better IDE support
- Async/await support
- Pythonic API design
- Python 3.8+ compatible

---

### PHP SDK
**Package:** `pexipay/sdk`

Perfect for WordPress, Laravel, Symfony, and traditional PHP applications.

- [PHP Documentation](./php/README.md)
- [Packagist Package](https://packagist.org/packages/pexipay/sdk)
- **Installation:** `composer require pexipay/sdk`

**Key Features:**
- PSR-4 autoloading
- Type declarations for PHP 7.4+
- Guzzle HTTP client
- WordPress/WooCommerce examples

---

## 🎯 Common Use Cases

### Basic Payment Processing
Accept card payments and automatically convert to cryptocurrency:

```typescript
// JavaScript/TypeScript
import { PexipayClient } from '@pexipay/sdk';

const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_API_KEY
});

const payment = await client.payments.create({
  amount: 100.00,
  currency: 'USD',
  description: 'Order #1234'
});
```

```python
# Python
from pexipay import PexipayClient

client = PexipayClient(api_key=os.getenv('PEXIPAY_API_KEY'))

payment = client.payments.create(
    amount=100.00,
    currency='USD',
    description='Order #1234'
)
```

```php
// PHP
use Pexipay\PexipayClient;

$client = new PexipayClient([
    'api_key' => getenv('PEXIPAY_API_KEY')
]);

$payment = $client->payments->create([
    'amount' => 100.00,
    'currency' => 'USD',
    'description' => 'Order #1234'
]);
```

### Payment Links
Create hosted payment pages for easy checkout:

```typescript
const link = await client.paymentLinks.create({
  amount: 199.99,
  currency: 'USD',
  description: 'Premium Subscription'
});

// Share link.url with your customer
console.log(`Payment link: ${link.url}`);
```

### Webhook Integration
Securely handle payment events:

```typescript
import { verifyWebhookSignature } from '@pexipay/sdk';

app.post('/webhooks/pexipay', (req, res) => {
  const signature = req.headers['x-pexipay-signature'];
  
  if (verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
    const event = JSON.parse(req.body);
    // Handle event
  }
});
```

---

## 📖 Documentation Structure

### [README.md](./README.md)
Overview of all SDKs, quick start guides, and feature comparison table.

### [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
Comprehensive integration guide covering:
- Authentication setup
- Core concepts (environments, idempotency, metadata)
- API resources (payments, customers, refunds, etc.)
- Webhook configuration
- Testing strategies
- Best practices
- Troubleshooting

### [EXAMPLES.md](./EXAMPLES.md)
Real-world code examples including:
- E-commerce checkout flows
- Subscription billing systems
- WordPress/WooCommerce integration
- Flask and Express webhook handlers
- Refund processing
- Customer management
- Transaction reporting

---

## 🔑 Getting Your API Keys

1. [Sign up](https://app.pexipay.com/signup) for a Pexipay account
2. Navigate to [Dashboard > API Keys](https://app.pexipay.com/dashboard/api-keys)
3. Generate both **Sandbox** and **Production** keys
4. Store keys securely in environment variables

**Environment Variables:**
```bash
PEXIPAY_API_KEY=your_production_key
PEXIPAY_TEST_API_KEY=your_sandbox_key
PEXIPAY_WEBHOOK_SECRET=your_webhook_secret
```

---

## 🧪 Testing

All SDKs support sandbox mode for testing:

```typescript
const client = new PexipayClient({
  apiKey: process.env.PEXIPAY_TEST_API_KEY,
  environment: 'sandbox'
});
```

**Test Cards:**
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **3DS Required:** `4000 0000 0000 3220`

Use any future expiry date and any 3-digit CVC.

---

## 🛠️ SDK Features

| Feature | JavaScript | Python | PHP |
|---------|-----------|--------|-----|
| Type Safety | ✅ TypeScript | ✅ Type Hints | ✅ Type Declarations |
| Auto Retries | ✅ | ✅ | ✅ |
| Webhook Verification | ✅ | ✅ | ✅ |
| Environment Switching | ✅ | ✅ | ✅ |
| Error Handling | ✅ Custom Errors | ✅ Custom Exceptions | ✅ Custom Exceptions |
| Idempotency | ✅ | ✅ | ✅ |
| Metadata Support | ✅ | ✅ | ✅ |
| Pagination | ✅ | ✅ | ✅ |

---

## 💬 Support & Community

- **Documentation:** [docs.pexipay.com](https://docs.pexipay.com)
- **API Reference:** [api.pexipay.com/docs](https://api.pexipay.com/docs)
- **Discord Community:** [discord.gg/pexipay](https://discord.gg/pexipay)
- **Email Support:** support@pexipay.com
- **Status Page:** [status.pexipay.com](https://status.pexipay.com)

### GitHub Repositories
- [JavaScript/TypeScript SDK](https://github.com/pexipay/sdk-javascript)
- [Python SDK](https://github.com/pexipay/sdk-python)
- [PHP SDK](https://github.com/pexipay/sdk-php)
- [Code Examples](https://github.com/pexipay/examples)

---

## 🔄 SDK Versions

All SDKs are currently at **v1.0.0** (Stable)

- JavaScript/TypeScript: `1.0.0`
- Python: `1.0.0`
- PHP: `1.0.0`

---

## 📜 License

All Pexipay SDKs are released under the MIT License.

---

## 🚀 Next Steps

1. Choose your preferred SDK language
2. Follow the [Integration Guide](./INTEGRATION_GUIDE.md)
3. Check out [Code Examples](./EXAMPLES.md)
4. Join our [Discord Community](https://discord.gg/pexipay)
5. Start building with Pexipay!

---

**Last Updated:** November 23, 2025
