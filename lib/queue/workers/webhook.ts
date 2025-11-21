import { Worker, Job } from 'bullmq';
import { QUEUE_NAMES } from '../config';
import { prisma } from '@/lib/prisma';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

interface WebhookJob {
  eventId: string;
}

export const webhookWorker = new Worker<WebhookJob>(
  QUEUE_NAMES.WEBHOOK,
  async (job: Job<WebhookJob>) => {
    console.log(`Processing webhook job ${job.id}:`, job.data);

    const event = await prisma.webhookEvent.findUnique({
      where: { id: job.data.eventId },
    });

    if (!event) {
      throw new Error(`Webhook event ${job.data.eventId} not found`);
    }

    if (event.status === 'SENT') {
      return { success: true, message: 'Already sent' };
    }

    try {
      // Send webhook
      const response = await fetch(event.targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': event.signature || '',
        },
        body: event.payload,
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      // Update event as sent
      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      // Update attempt count and schedule retry
      const attempts = event.attempts + 1;
      const shouldRetry = attempts < event.maxAttempts;

      await prisma.webhookEvent.update({
        where: { id: event.id },
        data: {
          status: shouldRetry ? 'RETRYING' : 'FAILED',
          attempts,
          lastError: String(error),
          nextRetryAt: shouldRetry
            ? new Date(Date.now() + Math.pow(2, attempts) * 60000) // Exponential backoff
            : null,
        },
      });

      if (!shouldRetry) {
        console.error(`Webhook ${event.id} failed after ${attempts} attempts`);
      }

      throw error;
    }
  },
  {
    connection,
    concurrency: 10,
  }
);

webhookWorker.on('completed', (job) => {
  console.log(`Webhook job ${job.id} completed`);
});

webhookWorker.on('failed', (job, err) => {
  console.error(`Webhook job ${job?.id} failed:`, err);
});
