import { prisma } from '@/lib/prisma';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'API_KEY_GENERATED'
  | 'API_KEY_REVOKED'
  | 'KYC_UPLOADED'
  | 'KYC_REVIEWED'
  | 'TRANSACTION_CREATED'
  | 'FRAUD_CASE_CREATED'
  | 'FRAUD_CASE_RESOLVED'
  | 'SETTLEMENT_PROCESSED';

export interface AuditLogData {
  userId?: string;
  apiKeyId?: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export class AuditLogger {
  /**
   * Log an audit event
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: data.userId,
          apiKeyId: data.apiKeyId,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          changes: data.changes ? JSON.stringify(data.changes) : null,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        },
      });
    } catch (error) {
      // Don't throw on audit log failures, just log to console
      console.error('Failed to create audit log:', error);
    }
  }

  /**
   * Log user login
   */
  async logLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'LOGIN',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log user logout
   */
  async logLogout(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'LOGOUT',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log API key generation
   */
  async logApiKeyGenerated(
    userId: string,
    apiKeyId: string,
    merchantType: 'merchant' | 'super-merchant'
  ): Promise<void> {
    await this.log({
      userId,
      action: 'API_KEY_GENERATED',
      entity: 'ApiKey',
      entityId: apiKeyId,
      metadata: { merchantType },
    });
  }

  /**
   * Log API key revocation
   */
  async logApiKeyRevoked(userId: string, apiKeyId: string): Promise<void> {
    await this.log({
      userId,
      action: 'API_KEY_REVOKED',
      entity: 'ApiKey',
      entityId: apiKeyId,
    });
  }

  /**
   * Log KYC document upload
   */
  async logKycUploaded(userId: string, documentId: string): Promise<void> {
    await this.log({
      userId,
      action: 'KYC_UPLOADED',
      entity: 'KYCDocument',
      entityId: documentId,
    });
  }

  /**
   * Log KYC review
   */
  async logKycReviewed(
    reviewerId: string,
    documentId: string,
    status: string,
    notes?: string
  ): Promise<void> {
    await this.log({
      userId: reviewerId,
      action: 'KYC_REVIEWED',
      entity: 'KYCDocument',
      entityId: documentId,
      metadata: { status, notes },
    });
  }

  /**
   * Log transaction creation
   */
  async logTransactionCreated(
    transactionId: string,
    merchantId: string,
    amount: number,
    apiKeyId?: string
  ): Promise<void> {
    await this.log({
      apiKeyId,
      action: 'TRANSACTION_CREATED',
      entity: 'Transaction',
      entityId: transactionId,
      metadata: { merchantId, amount },
    });
  }

  /**
   * Log fraud case creation
   */
  async logFraudCaseCreated(caseId: string, transactionId: string, score: number): Promise<void> {
    await this.log({
      action: 'FRAUD_CASE_CREATED',
      entity: 'FraudCase',
      entityId: caseId,
      metadata: { transactionId, score },
    });
  }

  /**
   * Log fraud case resolution
   */
  async logFraudCaseResolved(
    userId: string,
    caseId: string,
    resolution: string
  ): Promise<void> {
    await this.log({
      userId,
      action: 'FRAUD_CASE_RESOLVED',
      entity: 'FraudCase',
      entityId: caseId,
      metadata: { resolution },
    });
  }

  /**
   * Log settlement processing
   */
  async logSettlementProcessed(
    settlementId: string,
    merchantId: string,
    amount: number
  ): Promise<void> {
    await this.log({
      action: 'SETTLEMENT_PROCESSED',
      entity: 'Settlement',
      entityId: settlementId,
      metadata: { merchantId, amount },
    });
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();
