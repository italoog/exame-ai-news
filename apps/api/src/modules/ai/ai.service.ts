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
  private openaiGroq: OpenAI | null = null

  constructor(
    private config: ConfigService,
    @InjectQueue(QUEUE_AI_SUMMARY) private aiSummaryQueue: Queue,
    @InjectQueue(QUEUE_TRENDING) private trendingQueue: Queue,
  ) {
    const geminiKey = config.get<string>('GEMINI_API_KEY')
    const groqKey = config.get<string>('GROQ_API_KEY')
    const openaiKey = config.get<string>('OPENAI_API_KEY')

    if (geminiKey) {
      this.openai = new OpenAI({
        apiKey: geminiKey,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      })
      this.logger.log('IA: usando Google Gemini (gemini-2.0-flash)')
    } else if (groqKey) {
      this.openai = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      })
      this.logger.log('IA: usando Groq (llama-3.3-70b-versatile)')
    } else if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey })
      this.logger.log('IA: usando OpenAI (gpt-4o-mini)')
    } else {
      this.logger.warn('Nenhuma chave de IA configurada (GEMINI_API_KEY / GROQ_API_KEY / OPENAI_API_KEY) — usando sumarização local')
    }

    // Groq como fallback independente (ativado quando Gemini é o primário)
    if (geminiKey && groqKey) {
      this.openaiGroq = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      })
      this.logger.log('IA: Groq configurado como fallback')
    }
  }

  async enqueueAiSummary(articleId: string, title: string, content: string): Promise<void> {
    await this.aiSummaryQueue.add(
      'generate-summary',
      { articleId, title, content },
      { delay: 1000 },
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
        const isGroq = this.openai.baseURL?.includes('groq')
        const isGemini = this.openai.baseURL?.includes('googleapis')
        const model = isGroq
          ? 'llama-3.3-70b-versatile'
          : isGemini
            ? 'gemini-2.0-flash'
            : 'gpt-4o-mini'
        const response = await this.openai.chat.completions.create({
          model,
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
        this.logger.error('Provedor primário falhou, tentando Groq como fallback', err)
        if (this.openaiGroq) {
          try {
            const groqResp = await this.openaiGroq.chat.completions.create({
              model: 'llama-3.3-70b-versatile',
              messages: [
                {
                  role: 'system',
                  content:
                    'Você é um editor da revista EXAME. Gere um resumo executivo em português de 2-3 frases para o artigo fornecido, destacando os pontos mais importantes.',
                },
                { role: 'user', content: `Título: ${title}\n\nConteúdo: ${truncated}` },
              ],
              max_tokens: 200,
              temperature: 0.5,
            })
            this.logger.log('Resumo gerado com sucesso via Groq (fallback)')
            return groqResp.choices[0]?.message?.content ?? this.localSummary(plainContent)
          } catch (groqErr) {
            this.logger.error('Groq também falhou, usando sumarização local', groqErr)
          }
        }
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
