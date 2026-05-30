import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AnalyticsService } from './analytics.service'
import { PrismaService } from '../../database/prisma.service'

const mockTopArticle = {
  id: 'article-1',
  title: 'Artigo Popular',
  slug: 'artigo-popular',
  viewCount: 500,
  publishedAt: new Date('2024-01-01'),
  category: { name: 'Tecnologia', slug: 'tecnologia' },
  _count: { comments: 10, favorites: 20 },
}

const mockPrismaService = {
  analyticsEvent: { create: jest.fn() },
  article: {
    count: jest.fn(),
    aggregate: jest.fn(),
    findMany: jest.fn(),
  },
  user: { count: jest.fn() },
}

describe('AnalyticsService', () => {
  let service: AnalyticsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<AnalyticsService>(AnalyticsService)
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // trackEvent()
  // ─────────────────────────────────────────────
  describe('trackEvent', () => {
    it('deve criar evento de analytics e retornar o registro criado', async () => {
      const event = { id: 'evt-1', eventType: 'view', articleId: 'article-1' }
      mockPrismaService.analyticsEvent.create.mockResolvedValue(event)

      const result = await service.trackEvent({ eventType: 'view', articleId: 'article-1' })

      expect(result).toEqual(event)
      expect(mockPrismaService.analyticsEvent.create).toHaveBeenCalledWith({
        data: { eventType: 'view', articleId: 'article-1' },
      })
    })

    it('deve aceitar evento sem articleId (ex: acesso anônimo)', async () => {
      mockPrismaService.analyticsEvent.create.mockResolvedValue({ id: 'evt-2', eventType: 'view' })

      await expect(service.trackEvent({ eventType: 'view' })).resolves.not.toThrow()
    })
  })

  // ─────────────────────────────────────────────
  // getDashboard()
  // ─────────────────────────────────────────────
  describe('getDashboard', () => {
    it('deve retornar métricas do dashboard com totalViews somado', async () => {
      mockPrismaService.article.count.mockResolvedValueOnce(10) // totalArticles
      mockPrismaService.user.count.mockResolvedValue(25)
      mockPrismaService.article.aggregate.mockResolvedValue({ _sum: { viewCount: 1500 } })
      mockPrismaService.article.count.mockResolvedValueOnce(2) // articlesPublishedToday
      mockPrismaService.article.findMany.mockResolvedValue([mockTopArticle])

      const result = await service.getDashboard()

      expect(result.totalArticles).toBe(10)
      expect(result.totalUsers).toBe(25)
      expect(result.totalViews).toBe(1500)
      expect(result.articlesPublishedToday).toBe(2)
      expect(result.topArticles).toHaveLength(1)
    })

    it('deve retornar 0 para totalViews quando aggregate retorna null', async () => {
      mockPrismaService.article.count.mockResolvedValue(0)
      mockPrismaService.user.count.mockResolvedValue(0)
      mockPrismaService.article.aggregate.mockResolvedValue({ _sum: { viewCount: null } })
      mockPrismaService.article.findMany.mockResolvedValue([])

      const result = await service.getDashboard()

      expect(result.totalViews).toBe(0)
    })
  })

  // ─────────────────────────────────────────────
  // getTopArticles()
  // ─────────────────────────────────────────────
  describe('getTopArticles', () => {
    it('deve retornar top artigos ordenados por viewCount (limit padrão 10)', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([mockTopArticle])

      const result = await service.getTopArticles()

      expect(result).toHaveLength(1)
      const callArgs = mockPrismaService.article.findMany.mock.calls[0][0]
      expect(callArgs.take).toBe(10)
      expect(callArgs.orderBy).toEqual({ viewCount: 'desc' })
    })

    it('deve respeitar limit customizado', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([])

      await service.getTopArticles(5)

      expect(mockPrismaService.article.findMany.mock.calls[0][0].take).toBe(5)
    })
  })
})
