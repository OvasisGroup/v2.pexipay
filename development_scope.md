# PSP Platform Development Scope Document

## Overview
This document defines the development scope for building a Payment Service Provider (PSP) platform with support for super-merchants, sub-merchants, KYC workflows, transaction monitoring, fraud management, and integration with the CircoFlows payment gateway.

## 1. Architecture
- **Frontend:** Next.js App Router  
- **Backend:** Next.js API Routes + Worker Services  
- **DB:** PostgreSQL with Prisma ORM  
- **Queue/Cache:** Redis (BullMQ)  
- **Storage:** S3-compatible object store  
- **Integration:** CircoFlows API  
- **Security:** Vault/KMS, TLS, RBAC, Rate Limiting

## 2. Key Features
### Merchant Management
- Super-merchant onboarding
- Sub-merchant onboarding
- KYC upload + review system
- API key issuance and rotation

### Dashboards
- Super-merchant dashboard
- Merchant dashboard
- Admin dashboard (PSP)
- Fraud monitoring dashboard

### Payments API
- PSP-hosted API for merchants
- Forwarding transactions to CircoFlows
- Handling 3DS & redirects
- Webhook verification system

## 3. KYC Workflow
- Upload documents
- Automated document checks
- Manual review queue
- Status lifecycle management

## 4. Settlement & Reconciliation
- Daily settlement batches
- Ledger model per merchant and super-merchant
- Reconciliation with CircoFlows webhook events

## 5. Fraud Engine
- Rule-based system
- Velocity checks
- Transaction pattern scoring
- Case management UI

## 6. Security
- API key encryption
- Webhook signing/verification
- PCI scope minimization using hosted payment flows
- Audit logging and RBAC

## 7. Integration with CircoFlows
- Direct Payment API
- Hosted Payment API
- 3DS confirmation endpoint
- Webhook event handling
- Test environment support

## 8. Development Deliverables
- Frontend UI (Admin, Merchant, Super-merchant)
- Backend services (API routes, Workers)
- CircoFlows connector module
- Fraud engine
- KYC reviewer interface
- Database schema & migrations
- Deployment & monitoring setup

## 9. Next Steps
1. Build CircoFlows integration spike  
2. Implement database schema  
3. Develop KYC workflow  
4. Implement API key issuance  
5. Build dashboards  
6. Implement settlement & fraud systems
