import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { PrismaService } from '../../../database/prisma.service'
import { QUEUE_TRENDING } from '../../queue/queue.module'

@Processor(QUEUE_TRENDING)
export class TrendingProcessor extends WorkerHost {
  private readonly logger = new Logger(TrendingProcessor.name)

  constructor(private prisma: PrismaService) {
    super()
  }

  async process(_job: Job): Promise<void> {
    this.logger.log('Calculando artigos trending...')

    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - 24)

    const trending = await this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gte: cutoff },
      },
      orderBy: { viewCount: 'desc' },
      take: 10,
      select: { id: true, title: true, viewCount: true },
    })

    this.logger.log(`Trending calculado: ${trending.length} artigos`)
  }
}
