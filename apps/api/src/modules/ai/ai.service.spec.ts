import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { getQueueToken } from '@nestjs/bullmq'
import { AiService } from './ai.service'
import { PrismaService } from '../../database/prisma.service'
import { QUEUE_AI_SUMMARY, QUEUE_TRENDING } from '../queue/queue.module'

const mockPrismaService = {
  article: { findUnique: jest.fn() },
}

const mockAiSummaryQueue = { add: jest.fn() }
const mockTrendingQueue = { add: jest.fn() }

function buildModule(envVars: Record<string, string | undefined>) {
  return Test.createTestingModule({
    providers: [
      AiService,
      {
        provide: ConfigService,
        useValue: { get: (key: string) => envVars[key] },
      },
      { provide: PrismaService, useValue: mockPrismaService },
      { provide: getQueueToken(QUEUE_AI_SUMMARY), useValue: mockAiSummaryQueue },
      { provide: getQueueToken(QUEUE_TRENDING), useValue: mockTrendingQueue },
    ],
  }).compile()
}

describe('AiService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // enqueueAiSummary()
  // ─────────────────────────────────────────────
  describe('enqueueAiSummary', () => {
    it('deve adicionar job na fila aiSummaryQueue com delay: 1000', async () => {
      mockAiSummaryQueue.add.mockResolvedValue({})
      const module: TestingModule = await buildModule({})
      const service = module.get<AiService>(AiService)

      await service.enqueueAiSummary('article-1', 'Título', 'Conteúdo')

      expect(mockAiSummaryQueue.add).toHaveBeenCalledWith(
        'generate-summary',
        { articleId: 'article-1', title: 'Título', content: 'Conteúdo' },
        { delay: 1000 },
      )
    })
  })

  // ─────────────────────────────────────────────
  // enqueueTrendingCalculation()
  // ─────────────────────────────────────────────
  describe('enqueueTrendingCalculation', () => {
    it('deve adicionar job com jobId fixo na trendingQueue', async () => {
      mockTrendingQueue.add.mockResolvedValue({})
      const module: TestingModule = await buildModule({})
      const service = module.get<AiService>(AiService)

      await service.enqueueTrendingCalculation()

      expect(mockTrendingQueue.add).toHaveBeenCalledWith(
        'calculate-trending',
        {},
        { jobId: 'trending-calc', removeOnComplete: true },
      )
    })
  })

  // ─────────────────────────────────────────────
  // generateSummary() — local fallback
  // ─────────────────────────────────────────────
  describe('generateSummary', () => {
    it('deve retornar resumo local quando nenhuma chave de IA está configurada', async () => {
      const module: TestingModule = await buildModule({
        GEMINI_API_KEY: undefined,
        GROQ_API_KEY: undefined,
        OPENAI_API_KEY: undefined,
      })
      const service = module.get<AiService>(AiService)

      const result = await service.generateSummary('Artigo de IA', 'Texto longo sobre inteligência artificial.')

      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })
})
