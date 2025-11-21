import { Worker, Job } from 'bullmq';
import { QUEUE_NAMES } from '../config';
import { settlementService } from '@/lib/settlement/service';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

interface SettlementJob {
  merchantId?: string;
  superMerchantId?: string;
  periodStart: string;
  periodEnd: string;
}

export const settlementWorker = new Worker<SettlementJob>(
  QUEUE_NAMES.SETTLEMENT,
  async (job: Job<SettlementJob>) => {
    console.log(`Processing settlement job ${job.id}:`, job.data);

    const periodStart = new Date(job.data.periodStart);
    const periodEnd = new Date(job.data.periodEnd);

    if (job.data.merchantId) {
      await settlementService.processMerchantSettlement(
        job.data.merchantId,
        periodStart,
        periodEnd
      );
    } else if (job.data.superMerchantId) {
      await settlementService.processSuperMerchantSettlement(
        job.data.superMerchantId,
        periodStart,
        periodEnd
      );
    } else {
      // Process all settlements
      await settlementService.processDailySettlements();
    }

    return { success: true };
  },
  {
    connection,
    concurrency: 5,
  }
);

settlementWorker.on('completed', (job) => {
  console.log(`Settlement job ${job.id} completed`);
});

settlementWorker.on('failed', (job, err) => {
  console.error(`Settlement job ${job?.id} failed:`, err);
});
