import { prisma } from '@/lib/prisma';
import { ledgerService } from './ledger';
import { auditLogger } from '@/lib/audit/logger';

export class SettlementService {
  /**
   * Process daily settlements for all merchants
   */
  async processDailySettlements(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active merchants
    const merchants = await prisma.merchant.findMany({
      where: { status: 'ACTIVE' },
      include: { SuperMerchant: true },
    });

    for (const merchant of merchants) {
      await this.processMerchantSettlement(merchant.id, yesterday, today);
    }

    // Process super-merchants
    const superMerchants = await prisma.superMerchant.findMany({
      where: { status: 'ACTIVE' },
    });

    for (const superMerchant of superMerchants) {
      await this.processSuperMerchantSettlement(superMerchant.id, yesterday, today);
    }
  }

  /**
   * Process settlement for a single merchant
   */
  async processMerchantSettlement(
    merchantId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<void> {
    // Get all successful transactions in the period
    const transactions = await prisma.transaction.findMany({
      where: {
        merchantId,
        status: 'CAPTURED',
        processedAt: {
          gte: periodStart,
          lt: periodEnd,
        },
      },
    });

    if (transactions.length === 0) {
      return;
    }

    // Calculate totals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalAmount = transactions.reduce((sum: number, transaction: any) => sum + Number(transaction.amount), 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalFees = transactions.reduce((sum: number, transaction: any) => sum + Number(transaction.merchantFee), 0);
    const netAmount = totalAmount - totalFees;

    // Create settlement record
    const settlement = await prisma.settlement.create({
      data: {
        id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        merchantId,
        amount: totalAmount,
        feeTotal: totalFees,
        netAmount,
        periodStart,
        periodEnd,
        transactionCount: transactions.length,
        status: 'PENDING',
        updatedAt: new Date(),
      },
    });

    // Create ledger entry
    const balance = await ledgerService.getAccountBalance(merchantId, 'merchant');
    await prisma.ledgerEntry.create({
      data: {
        id: `le_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        merchantId,
        settlementId: settlement.id,
        type: 'SETTLEMENT_DEBIT',
        amount: netAmount,
        balance: balance - netAmount,
        description: `Settlement ${settlement.id} for period ${periodStart.toISOString()} to ${periodEnd.toISOString()}`,
      },
    });

    // Update settlement status
    await prisma.settlement.update({
      where: { id: settlement.id },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
      },
    });

    // Log audit
    await auditLogger.logSettlementProcessed(settlement.id, merchantId, netAmount);
  }

  /**
   * Process settlement for a super-merchant
   */
  async processSuperMerchantSettlement(
    superMerchantId: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<void> {
    // Get all commission entries in the period
    const commissionEntries = await prisma.ledgerEntry.findMany({
      where: {
        superMerchantId,
        type: 'COMMISSION_CREDIT',
        createdAt: {
          gte: periodStart,
          lt: periodEnd,
        },
      },
    });

    if (commissionEntries.length === 0) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCommission = commissionEntries.reduce(
      (sum: number, entry: any) => sum + Number(entry.amount),
      0
    );

    // Create settlement record
    const settlement = await prisma.settlement.create({
      data: {
        id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        superMerchantId,
        amount: totalCommission,
        feeTotal: 0,
        netAmount: totalCommission,
        periodStart,
        periodEnd,
        transactionCount: commissionEntries.length,
        status: 'PENDING',
        updatedAt: new Date(),
      },
    });

    // Create ledger entry
    const balance = await ledgerService.getAccountBalance(superMerchantId, 'super-merchant');
    await prisma.ledgerEntry.create({
      data: {
        id: `le_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        superMerchantId,
        settlementId: settlement.id,
        type: 'SETTLEMENT_DEBIT',
        amount: totalCommission,
        balance: balance - totalCommission,
        description: `Settlement ${settlement.id} for period ${periodStart.toISOString()} to ${periodEnd.toISOString()}`,
      },
    });

    // Update settlement status
    await prisma.settlement.update({
      where: { id: settlement.id },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
      },
    });

    // Log audit
    await auditLogger.logSettlementProcessed(settlement.id, superMerchantId, totalCommission);
  }

  /**
   * Get settlement history for an account
   */
  async getSettlementHistory(
    accountId: string,
    accountType: 'merchant' | 'super-merchant',
    limit: number = 50
  ) {
    return prisma.settlement.findMany({
      where:
        accountType === 'merchant'
          ? { merchantId: accountId }
          : { superMerchantId: accountId },
      orderBy: { periodEnd: 'desc' },
      take: limit,
    });
  }
}

// Export singleton instance
export const settlementService = new SettlementService();
