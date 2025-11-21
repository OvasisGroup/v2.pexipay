import { prisma } from '@/lib/prisma';

export interface FraudCheckResult {
  score: number;
  triggeredRules: string[];
  shouldBlock: boolean;
  shouldReview: boolean;
}

export interface TransactionContext {
  merchantId: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerIp?: string;
  paymentMethod: string;
  country?: string;
}

const FRAUD_SCORE_THRESHOLD = parseInt(process.env.FRAUD_SCORE_THRESHOLD || '70');
const FRAUD_AUTO_BLOCK_THRESHOLD = parseInt(process.env.FRAUD_AUTO_BLOCK_THRESHOLD || '90');

export class FraudEngine {
  /**
   * Evaluate transaction for fraud
   */
  async evaluateTransaction(context: TransactionContext): Promise<FraudCheckResult> {
    const rules = await prisma.fraudRule.findMany({
      where: { isActive: true },
    });

    let totalScore = 0;
    const triggeredRules: string[] = [];

    for (const rule of rules) {
      const ruleTriggered = await this.evaluateRule(rule, context);
      if (ruleTriggered) {
        totalScore += rule.score;
        triggeredRules.push(rule.id);
      }
    }

    return {
      score: totalScore,
      triggeredRules,
      shouldBlock: totalScore >= FRAUD_AUTO_BLOCK_THRESHOLD,
      shouldReview: totalScore >= FRAUD_SCORE_THRESHOLD && totalScore < FRAUD_AUTO_BLOCK_THRESHOLD,
    };
  }

  /**
   * Evaluate a single fraud rule
   */
  private async evaluateRule(
    rule: { id: string; type: string; config: string },
    context: TransactionContext
  ): Promise<boolean> {
    const config = JSON.parse(rule.config) as Record<string, unknown>;

    switch (rule.type) {
      case 'VELOCITY':
        return this.checkVelocity(context, config);
      case 'AMOUNT_THRESHOLD':
        return this.checkAmountThreshold(context, config);
      case 'COUNTRY_BLOCK':
        return this.checkCountryBlock(context, config);
      case 'IP_BLOCK':
        return this.checkIpBlock(context, config);
      case 'EMAIL_PATTERN':
        return this.checkEmailPattern(context, config);
      default:
        return false;
    }
  }

  /**
   * Check transaction velocity
   */
  private async checkVelocity(
    context: TransactionContext,
    config: Record<string, unknown>
  ): Promise<boolean> {
    const windowMinutes = config.windowMinutes as number || 60;
    const maxTransactions = config.maxTransactions as number || 10;
    const maxAmount = config.maxAmount as number;

    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

    // Check transaction count
    const recentTransactions = await prisma.transaction.count({
      where: {
        merchantId: context.merchantId,
        customerEmail: context.customerEmail,
        createdAt: { gte: windowStart },
      },
    });

    if (recentTransactions >= maxTransactions) {
      return true;
    }

    // Check total amount if configured
    if (maxAmount) {
      const totalAmount = await prisma.transaction.aggregate({
        where: {
          merchantId: context.merchantId,
          customerEmail: context.customerEmail,
          createdAt: { gte: windowStart },
        },
        _sum: { amount: true },
      });

      if (totalAmount._sum.amount && Number(totalAmount._sum.amount) >= maxAmount) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check amount threshold
   */
  private checkAmountThreshold(
    context: TransactionContext,
    config: Record<string, unknown>
  ): boolean {
    const threshold = config.threshold as number || 10000;
    return context.amount >= threshold;
  }

  /**
   * Check blocked countries
   */
  private checkCountryBlock(
    context: TransactionContext,
    config: Record<string, unknown>
  ): boolean {
    const blockedCountries = config.blockedCountries as string[] || [];
    return context.country ? blockedCountries.includes(context.country) : false;
  }

  /**
   * Check blocked IPs
   */
  private checkIpBlock(
    context: TransactionContext,
    config: Record<string, unknown>
  ): boolean {
    const blockedIps = config.blockedIps as string[] || [];
    return context.customerIp ? blockedIps.includes(context.customerIp) : false;
  }

  /**
   * Check email patterns
   */
  private checkEmailPattern(
    context: TransactionContext,
    config: Record<string, unknown>
  ): boolean {
    const patterns = config.patterns as string[] || [];
    if (!context.customerEmail) return false;

    return patterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(context.customerEmail!);
    });
  }

  /**
   * Create fraud case if needed
   */
  async createFraudCase(
    transactionId: string,
    merchantId: string,
    result: FraudCheckResult
  ): Promise<void> {
    if (result.shouldReview || result.shouldBlock) {
      await prisma.fraudCase.create({
        data: {
          id: `fc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          transactionId,
          merchantId,
          fraudScore: result.score,
          triggeredRules: JSON.stringify(result.triggeredRules),
          status: result.shouldBlock ? 'OPEN' : 'UNDER_REVIEW',
          updatedAt: new Date(),
        },
      });
    }
  }
}

// Export singleton instance
export const fraudEngine = new FraudEngine();
