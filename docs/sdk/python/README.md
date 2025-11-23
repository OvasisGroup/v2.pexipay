# Pexipay Python SDK

Official Python SDK for Pexipay - Accept card payments and convert them to cryptocurrency seamlessly.

[![PyPI version](https://img.shields.io/pypi/v/pexipay.svg)](https://pypi.org/project/pexipay/)
[![Python versions](https://img.shields.io/pypi/pyversions/pexipay.svg)](https://pypi.org/project/pexipay/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Full type hints** for better IDE support
- ✅ **Async/await support** for concurrent operations
- ✅ **Automatic retries** with exponential backoff
- ✅ **Webhook signature verification** for security
- ✅ **Complete API coverage** - payments, refunds, customers, and more
- ✅ **Python 3.8+** compatibility

## Installation

```bash
pip install pexipay
```

## Quick Start

```python
from pexipay import PexipayClient

# Initialize the client
client = PexipayClient(
    api_key='your_api_key',
    environment='production'  # or 'sandbox' for testing
)

# Create a payment
payment = client.payments.create(
    amount=100.00,
    currency='USD',
    description='Order #1234',
    customer_email='customer@example.com'
)

print(f'Payment status: {payment["status"]}')
```

## Configuration

```python
client = PexipayClient(
    api_key='your_api_key',
    environment='production',  # 'production' or 'sandbox'
    timeout=30,  # Request timeout in seconds (default: 30)
    max_retries=3  # Maximum retry attempts (default: 3)
)
```

## Core Resources

### Payments

```python
# Create a payment
payment = client.payments.create(
    amount=250.00,
    currency='USD',
    description='Premium subscription',
    customer_email='customer@example.com',
    payment_method={
        'type': 'card',
        'card': {
            'number': '4242424242424242',
            'exp_month': 12,
            'exp_year': 2025,
            'cvc': '123'
        }
    }
)

# Retrieve a payment
payment = client.payments.retrieve('pay_123456')

# List payments
payments = client.payments.list(
    limit=10,
    status='succeeded'
)

# Handle 3D Secure
if payment['requires3DS']:
    confirmed = client.payments.confirm_3ds(
        payment['id'],
        three_ds_result
    )

# Cancel a payment
client.payments.cancel('pay_123456')

# Capture a payment
client.payments.capture('pay_123456', amount=100.00)
```

### Payment Links

```python
# Create a payment link
link = client.payment_links.create(
    amount=199.99,
    currency='USD',
    description='Annual membership',
    customer_info={
        'name': 'John Doe',
        'email': 'john@example.com'
    },
    return_url='https://yoursite.com/success',
    cancel_url='https://yoursite.com/cancel'
)

print(f'Payment URL: {link["url"]}')

# Retrieve a payment link
link = client.payment_links.retrieve('link_123456')

# List payment links
links = client.payment_links.list(status='active')

# Cancel a payment link
client.payment_links.cancel('link_123456')
```

### Customers

```python
# Create a customer
customer = client.customers.create(
    email='customer@example.com',
    name='Jane Smith',
    phone='+1234567890',
    address={
        'line1': '123 Main St',
        'city': 'San Francisco',
        'state': 'CA',
        'postal_code': '94111',
        'country': 'US'
    }
)

# Retrieve a customer
customer = client.customers.retrieve('cus_123456')

# Update a customer
customer = client.customers.update(
    'cus_123456',
    name='Jane Doe'
)

# List customers
customers = client.customers.list(limit=50)

# Delete a customer
client.customers.delete('cus_123456')
```

### Refunds

```python
# Create a full refund
refund = client.refunds.create(
    payment_id='pay_123456',
    reason='Customer requested refund'
)

# Create a partial refund
refund = client.refunds.create(
    payment_id='pay_123456',
    amount=50.00,
    reason='Partial refund'
)

# Retrieve a refund
refund = client.refunds.retrieve('ref_123456')

# List refunds
refunds = client.refunds.list(payment_id='pay_123456')

# Cancel a refund
client.refunds.cancel('ref_123456')
```

### Transactions

```python
# Retrieve a transaction
transaction = client.transactions.retrieve('txn_123456')

# List transactions
transactions = client.transactions.list(
    limit=100,
    type='payment',
    status='completed'
)
```

### Balance

```python
# Get account balance
balance = client.balance.retrieve()

print(f'Available: {balance["available"]}')
print(f'Pending: {balance["pending"]}')

# List balance transactions
transactions = client.balance.list_transactions(limit=50)
```

## Webhooks

```python
from flask import Flask, request
from pexipay import verify_webhook_signature

app = Flask(__name__)

@app.route('/webhooks/pexipay', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Pexipay-Signature')
    payload = request.get_data(as_text=True)
    
    # Verify signature
    is_valid = verify_webhook_signature(
        payload,
        signature,
        'your_webhook_secret'
    )
    
    if not is_valid:
        return 'Invalid signature', 400
    
    event = request.get_json()
    
    # Handle event
    if event['type'] == 'payment.succeeded':
        print(f'Payment succeeded: {event["data"]}')
    elif event['type'] == 'payment.failed':
        print(f'Payment failed: {event["data"]}')
    
    return 'OK', 200
```

## Error Handling

```python
from pexipay import (
    PexipayError,
    ValidationError,
    AuthenticationError,
    RateLimitError
)

try:
    payment = client.payments.create(
        amount=100.00,
        currency='USD'
    )
except ValidationError as e:
    print(f'Validation error: {e.message}')
    print(f'Details: {e.details}')
except AuthenticationError as e:
    print(f'Authentication failed: {e.message}')
except RateLimitError as e:
    print(f'Rate limit exceeded')
    print(f'Retry after: {e.retry_after} seconds')
except PexipayError as e:
    print(f'API error: {e.message}')
    print(f'Status code: {e.status_code}')
    print(f'Request ID: {e.request_id}')
```

## Testing

Use sandbox mode for testing:

```python
client = PexipayClient(
    api_key='test_api_key',
    environment='sandbox'
)

# Test card numbers
test_cards = {
    'success': '4242424242424242',
    'declined': '4000000000000002',
    '3ds_required': '4000000000003220'
}
```

## Support

- **Documentation**: [docs.pexipay.com](https://docs.pexipay.com)
- **API Reference**: [api.pexipay.com/docs](https://api.pexipay.com/docs)
- **Discord**: [discord.gg/pexipay](https://discord.gg/pexipay)
- **Email**: support@pexipay.com

## License

MIT License - see LICENSE file for details.
