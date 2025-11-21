# Test Card Numbers

Use these test card numbers to simulate different payment scenarios in the PexiPay test environment.

## Valid Test Cards

### Successful Payments

| Card Number         | Brand      | CVV | Expiry    | Result                      |
|---------------------|------------|-----|-----------|------------------------------|
| 4111111111111111    | Visa       | Any | Any future| Payment succeeds             |
| 5555555555554444    | Mastercard | Any | Any future| Payment succeeds             |
| 378282246310005     | Amex       | Any | Any future| Payment succeeds             |
| 6011111111111117    | Discover   | Any | Any future| Payment succeeds             |

### 3D Secure Authentication

| Card Number         | Brand      | CVV | Expiry    | Result                      |
|---------------------|------------|-----|-----------|------------------------------|
| 4000000000003220    | Visa       | Any | Any future| Requires 3DS authentication  |
| 5200000000001096    | Mastercard | Any | Any future| Requires 3DS authentication  |

### Failed Payments

| Card Number         | Brand      | CVV | Expiry    | Result                      |
|---------------------|------------|-----|-----------|------------------------------|
| 4000000000000002    | Visa       | Any | Any future| Card declined                |
| 4000000000009995    | Visa       | Any | Any future| Insufficient funds           |
| 4000000000000069    | Visa       | Any | Any future| Expired card                 |
| 4000000000000127    | Visa       | Any | Any future| Incorrect CVV                |

### Fraud Detection

| Card Number         | Brand      | CVV | Expiry    | Result                      |
|---------------------|------------|-----|-----------|------------------------------|
| 4100000000000019    | Visa       | Any | Any future| Blocked by fraud detection   |
| 5100000000000016    | Mastercard | Any | Any future| Flagged for manual review    |

## Test Billing Addresses

Use any of these addresses for testing:

### United States
```
123 Main Street
New York, NY 10001
US
```

### United Kingdom
```
10 Downing Street
London, SW1A 2AA
GB
```

### Canada
```
123 Maple Avenue
Toronto, ON M5H 2N2
CA
```

## CVV and Expiry Rules

- **CVV**: Use any 3-digit number (123 recommended) or 4 digits for Amex (1234 recommended)
- **Expiry**: Use any future date in MM/YY format (e.g., 12/25, 06/26)

## Notes

- All test transactions are processed in test mode and no real charges are made
- Test card numbers work in both hosted and direct payment modes
- Webhooks will still be sent for test transactions
- You can view all test transactions in your merchant dashboard
