# PexiPay Routes

## Public Routes

### Landing Page
- **GET /** - Homepage with feature overview and call-to-action

### Authentication Pages
- **GET /auth/login** - Login page for all user types
- **GET /auth/register** - Registration page with merchant/super-merchant selection
- **GET /auth/register?type=merchant** - Pre-selected merchant registration
- **GET /auth/register?type=super-merchant** - Pre-selected super-merchant registration

## API Routes

### Authentication
- **POST /api/auth/login** - User authentication (returns JWT token)
- **POST /api/auth/register** - User and merchant registration

## Protected Dashboard Routes

### Admin Dashboard
- **GET /admin/dashboard** - Admin overview with platform statistics
- Access: `ADMIN` role only

### Super-Merchant Dashboard
- **GET /super-merchant/dashboard** - Super-merchant overview with sub-merchant management
- Access: `SUPER_MERCHANT` role only

### Merchant Dashboard
- **GET /merchant/dashboard** - Merchant overview with transaction stats
- Access: `MERCHANT` role only

## Route Protection

All dashboard routes are client-side protected using localStorage tokens. Users are redirected to `/auth/login` if:
- No token is found
- User data is missing
- Role doesn't match the required access level

## Automatic Redirects After Login

Based on user role, users are redirected to:
- `ADMIN` → `/admin/dashboard`
- `SUPER_MERCHANT` → `/super-merchant/dashboard`
- `MERCHANT` → `/merchant/dashboard`

## Testing the Flow

1. **Visit Homepage**: http://localhost:3000
2. **Try Registration**: http://localhost:3000/auth/register
3. **Login with Test Accounts**: http://localhost:3000/auth/login
   - Admin: admin@pexipay.com / SuperAdmin123!
   - Super-Merchant: supermerchant@test.com / SuperMerchant123!
   - Merchant: merchant@test.com / Merchant123!
4. **Access Dashboard**: Automatically redirected after login

## Next Steps

Future routes to implement:
- `/merchant/api-keys` - API key management
- `/merchant/transactions` - Transaction history
- `/merchant/settings` - Account settings
- `/super-merchant/merchants` - Sub-merchant management
- `/super-merchant/reports` - Analytics and reports
- `/admin/users` - User management
- `/admin/kyc` - KYC review queue
- `/admin/fraud` - Fraud case management
