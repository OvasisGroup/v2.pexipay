import { Queue, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

// Define queue names
export const QUEUE_NAMES = {
  SETTLEMENT: 'settlement',
  WEBHOOK: 'webhook',
  FRAUD_CHECK: 'fraud-check',
  NOTIFICATION: 'notification',
};

// Create queues
export const settlementQueue = new Queue(QUEUE_NAMES.SETTLEMENT, { connection });
export const webhookQueue = new Queue(QUEUE_NAMES.WEBHOOK, { connection });
export const fraudCheckQueue = new Queue(QUEUE_NAMES.FRAUD_CHECK, { connection });
export const notificationQueue = new Queue(QUEUE_NAMES.NOTIFICATION, { connection });

// Queue events for monitoring
export const settlementQueueEvents = new QueueEvents(QUEUE_NAMES.SETTLEMENT, { connection });
export const webhookQueueEvents = new QueueEvents(QUEUE_NAMES.WEBHOOK, { connection });

// Helper function to add job with retry logic
export async function addJobWithRetry<T>(
  queue: Queue,
  jobName: string,
  data: T,
  options?: {
    attempts?: number;
    backoff?: { type: 'exponential' | 'fixed'; delay: number };
    delay?: number;
  }
) {
  return queue.add(jobName, data, {
    attempts: options?.attempts || 3,
    backoff: options?.backoff || {
      type: 'exponential',
      delay: 5000,
    },
    delay: options?.delay,
    removeOnComplete: {
      age: 86400, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 604800, // Keep failed jobs for 7 days
    },
  });
}
