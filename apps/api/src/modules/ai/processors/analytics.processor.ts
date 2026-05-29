import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { PrismaService } from '../../../database/prisma.service'
import { QUEUE_ANALYTICS } from '../../queue/queue.module'

interface AnalyticsJob {
  articleId: string
  userId?: string
  event: string
  metadata?: Record<string, unknown>
}

@Processor(QUEUE_ANALYTICS)
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name)

  constructor(private prisma: PrismaService) {
    super()
  }

  async process(job: Job<AnalyticsJob>): Promise<void> {
    const { articleId, userId, event, metadata } = job.data

    await this.prisma.analyticsEvent.create({
      data: {
        eventType: event,
        articleId,
        userId: userId ?? null,
        metadata: metadata ?? {},
      },
    })

    this.logger.debug(`Analytics event '${event}' registrado para artigo ${articleId}`)
  }
}
