import { prisma } from '@/lib/prisma';

type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export class LedgerService {
  /**
   * Record a transaction in the ledger
   */
  async recordTransaction(
    transactionId: string,
    merchantId: string,
    superMerchantId: string,
    amount: number,
    merchantFee: number,
    superMerchantFee: number,
    currency: string = 'USD'
  ): Promise<void> {
    await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Get current balances
      const merchantBalance = await this.getBalance(tx, merchantId, 'merchant');
      const superMerchantBalance = await this.getBalance(tx, superMerchantId, 'super-merchant');

      // Merchant credit (transaction amount minus fees)
      const merchantNetAmount = amount - merchantFee - superMerchantFee;
      await tx.ledgerEntry.create({
        data: {
          id: `le_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchantId,
          type: 'TRANSACTION_CREDIT',
          amount: merchantNetAmount,
          currency,
          balance: merchantBalance + merchantNetAmount,
          transactionId,
          description: `Transaction ${transactionId} - Net amount`,
        },
      });

      // Merchant fee debit
      if (merchantFee > 0) {
        await tx.ledgerEntry.create({
          data: {
            id: `le_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            merchantId,
            type: 'FEE_DEBIT',
            amount: merchantFee,
            currency,
            balance: merchantBalance + merchantNetAmount - merchantFee,
            transactionId,
            description: `Transaction ${transactionId} - Merchant fee`,
          },
        });
      }

      // Super-merchant commission credit
      if (superMerchantFee > 0) {
        await tx.ledgerEntry.create({
          data: {
            id: `le_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            superMerchantId,
            type: 'COMMISSION_CREDIT',
            amount: superMerchantFee,
            currency,
            balance: superMerchantBalance + superMerchantFee,
            transactionId,
            description: `Transaction ${transactionId} - Commission`,
          },
        });
      }
    });
  }

  /**
   * Record a refund in the ledger
   */
  async recordRefund(
    transactionId: string,
    merchantId: string,
    superMerchantId: string,
    amount: number,
    currency: string = 'USD'
  ): Promise<void> {
    await prisma.$transaction(async (tx: PrismaTransaction) => {
      const merchantBalance = await this.getBalance(tx, merchantId, 'merchant');

      // Merchant debit (refund amount)
      await tx.ledgerEntry.create({
        data: {
          id: `le_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchantId,
          type: 'REFUND_DEBIT',
          amount,
          currency,
          balance: merchantBalance - amount,
          transactionId,
          description: `Refund for transaction ${transactionId}`,
        },
      });

      // Super-merchant might also need adjustment
      // This depends on your business logic
    });
  }

  /**
   * Get current balance
   */
  private async getBalance(
    tx: PrismaTransaction,
    accountId: string,
    accountType: 'merchant' | 'super-merchant'
  ): Promise<number> {
    const lastEntry = await tx.ledgerEntry.findFirst({
      where:
        accountType === 'merchant'
          ? { merchantId: accountId }
          : { superMerchantId: accountId },
      orderBy: { createdAt: 'desc' },
      select: { balance: true },
    });

    return lastEntry ? Number(lastEntry.balance) : 0;
  }

  /**
   * Get ledger entries for an account
   */
  async getLedgerEntries(
    accountId: string,
    accountType: 'merchant' | 'super-merchant',
    limit: number = 100
  ) {
    return prisma.ledgerEntry.findMany({
      where:
        accountType === 'merchant'
          ? { merchantId: accountId }
          : { superMerchantId: accountId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get account balance
   */
  async getAccountBalance(
    accountId: string,
    accountType: 'merchant' | 'super-merchant'
  ): Promise<number> {
    const lastEntry = await prisma.ledgerEntry.findFirst({
      where:
        accountType === 'merchant'
          ? { merchantId: accountId }
          : { superMerchantId: accountId },
      orderBy: { createdAt: 'desc' },
      select: { balance: true },
    });

    return lastEntry ? Number(lastEntry.balance) : 0;
  }
}

// Export singleton instance
export const ledgerService = new LedgerService();
