# PexiPay - PSP Platform

A comprehensive Payment Service Provider (PSP) platform built with Next.js, featuring super-merchant management, KYC workflows, fraud detection, and seamless CircoFlows payment gateway integration.

## 🚀 Features

### Core Capabilities
- **Multi-Tier Merchant System**: Support for super-merchants and sub-merchants
- **Secure Authentication**: JWT-based authentication with API key management
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for different user roles
- **KYC Workflow**: Document upload, automated checks, and manual review queue
- **Payment Processing**: Direct integration with CircoFlows for card payments
- **Fraud Detection Engine**: Rule-based system with velocity checks and pattern scoring
- **Settlement System**: Automated daily settlements with full ledger tracking
- **Audit Logging**: Comprehensive audit trail for all system operations
- **Webhook Management**: Reliable webhook delivery with retry logic
- **Background Workers**: BullMQ-powered job processing for settlements and webhooks

### Dashboards
- **Admin Dashboard**: PSP-level management and monitoring
- **Super-Merchant Dashboard**: Multi-merchant management and commission tracking
- **Merchant Dashboard**: Transaction monitoring and business analytics
- **Fraud Monitoring Dashboard**: Real-time fraud case management

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Queue/Cache**: Redis with BullMQ
- **Storage**: AWS S3 (for KYC documents)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Payment Gateway**: CircoFlows API

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Redis 6+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies**
\`\`\`bash
pnpm install
\`\`\`

2. **Configure environment variables**
\`\`\`bash
cp .env.example .env
\`\`\`

3. **Setup database**
\`\`\`bash
pnpm prisma generate
pnpm prisma migrate dev --name init
\`\`\`

4. **Start Redis** (if not running)

5. **Run development server**
\`\`\`bash
pnpm dev
\`\`\`

The application will be available at http://localhost:3000

## 📊 Key Features Implemented

✅ Comprehensive database schema with Prisma ORM
✅ Authentication system with JWT and API keys
✅ Role-based access control (RBAC)
✅ CircoFlows payment gateway integration
✅ Fraud detection engine with configurable rules
✅ Ledger system for financial tracking
✅ Settlement processing service
✅ Audit logging for all operations
✅ BullMQ background workers
✅ Webhook management system
✅ API endpoints for payments, auth, and merchant management
✅ Dashboard UI (basic implementation)

## 🔌 API Endpoints

- \`POST /api/auth/register\` - Register merchant/super-merchant
- \`POST /api/auth/login\` - User login
- \`POST /api/payments\` - Create payment
- \`GET /api/payments\` - List transactions
- \`POST /api/api-keys\` - Generate API key
- \`GET /api/api-keys\` - List API keys
- \`POST /api/webhooks/circoflows\` - CircoFlows webhook receiver

## 🚀 Next Steps

To complete the system:
1. Run database migrations
2. Configure environment variables
3. Implement remaining dashboard pages
4. Add KYC document upload functionality
5. Setup background worker processes
6. Configure CircoFlows API credentials
7. Add rate limiting middleware
8. Implement email notifications
9. Add comprehensive testing
10. Deploy to production

---

Built with Next.js, Prisma, and modern web technologies.
