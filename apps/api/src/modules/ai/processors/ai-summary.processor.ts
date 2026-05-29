import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { PrismaService } from '../../../database/prisma.service'
import { AiService } from '../ai.service'
import { QUEUE_AI_SUMMARY } from '../../queue/queue.module'

interface AiSummaryJob {
  articleId: string
  title: string
  content: string
}

@Processor(QUEUE_AI_SUMMARY)
export class AiSummaryProcessor extends WorkerHost {
  private readonly logger = new Logger(AiSummaryProcessor.name)

  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {
    super()
  }

  async process(job: Job<AiSummaryJob>): Promise<void> {
    const { articleId, title, content } = job.data
    this.logger.log(`Processando resumo IA para artigo ${articleId}`)

    try {
      const summary = await this.aiService.generateSummary(title, content)

      await this.prisma.article.update({
        where: { id: articleId },
        data: { aiSummary: summary },
      })

      this.logger.log(`Resumo IA gerado para artigo ${articleId}`)
    } catch (err) {
      this.logger.error(`Falha ao gerar resumo para ${articleId}`, err)
      throw err // Permite retry pelo BullMQ
    }
  }
}
