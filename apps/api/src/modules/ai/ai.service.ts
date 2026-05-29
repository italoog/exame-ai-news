import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import OpenAI from 'openai'
import { QUEUE_AI_SUMMARY, QUEUE_TRENDING } from '../queue/queue.module'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)
  private openai: OpenAI | null = null

  constructor(
    private config: ConfigService,
    @InjectQueue(QUEUE_AI_SUMMARY) private aiSummaryQueue: Queue,
    @InjectQueue(QUEUE_TRENDING) private trendingQueue: Queue,
  ) {
    const apiKey = config.get<string>('OPENAI_API_KEY')
    if (apiKey) {
      this.openai = new OpenAI({ apiKey })
    } else {
      this.logger.warn('OPENAI_API_KEY não configurada — usando sumarização local')
    }
  }

  async enqueueAiSummary(articleId: string, title: string, content: string): Promise<void> {
    await this.aiSummaryQueue.add(
      'generate-summary',
      { articleId, title, content },
      { jobId: `summary-${articleId}`, delay: 1000 },
    )
    this.logger.log(`Job de resumo enfileirado para artigo ${articleId}`)
  }

  async enqueueTrendingCalculation(): Promise<void> {
    await this.trendingQueue.add(
      'calculate-trending',
      {},
      { jobId: 'trending-calc', removeOnComplete: true },
    )
  }

  async generateSummary(title: string, content: string): Promise<string> {
    const plainContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    const truncated = plainContent.slice(0, 3000)

    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'Você é um editor da revista EXAME. Gere um resumo executivo em português de 2-3 frases para o artigo fornecido, destacando os pontos mais importantes.',
            },
            {
              role: 'user',
              content: `Título: ${title}\n\nConteúdo: ${truncated}`,
            },
          ],
          max_tokens: 200,
          temperature: 0.5,
        })
        return response.choices[0]?.message?.content ?? this.localSummary(plainContent)
      } catch (err) {
        this.logger.error('Erro ao chamar OpenAI, usando fallback', err)
        return this.localSummary(plainContent)
      }
    }

    return this.localSummary(plainContent)
  }

  private localSummary(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? []
    return sentences.slice(0, 3).join(' ').trim() || text.slice(0, 300)
  }
}
