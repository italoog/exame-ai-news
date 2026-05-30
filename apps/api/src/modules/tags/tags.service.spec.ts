import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TagsService } from './tags.service'
import { PrismaService } from '../../database/prisma.service'

const mockPrismaService = {
  tag: {
    findMany: jest.fn(),
    upsert: jest.fn(),
  },
}

describe('TagsService', () => {
  let service: TagsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<TagsService>(TagsService)
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // findAll()
  // ─────────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar todas as tags em ordem alfabética', async () => {
      const tags = [
        { id: '1', name: 'IA', slug: 'ia' },
        { id: '2', name: 'Startups', slug: 'startups' },
      ]
      mockPrismaService.tag.findMany.mockResolvedValue(tags)

      const result = await service.findAll()

      expect(result).toEqual(tags)
      expect(mockPrismaService.tag.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      })
    })

    it('deve retornar array vazio quando não há tags', async () => {
      mockPrismaService.tag.findMany.mockResolvedValue([])

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })

  // ─────────────────────────────────────────────
  // findPopular()
  // ─────────────────────────────────────────────
  describe('findPopular', () => {
    it('deve retornar tags populares com contagem de artigos (limit padrão 20)', async () => {
      const popular = [{ id: '1', name: 'IA', slug: 'ia', _count: { articles: 10 } }]
      mockPrismaService.tag.findMany.mockResolvedValue(popular)

      const result = await service.findPopular()

      expect(result).toEqual(popular)
      const call = mockPrismaService.tag.findMany.mock.calls[0][0]
      expect(call.take).toBe(20)
      expect(call.orderBy).toEqual({ articles: { _count: 'desc' } })
    })

    it('deve respeitar limit customizado', async () => {
      mockPrismaService.tag.findMany.mockResolvedValue([])

      await service.findPopular(5)

      expect(mockPrismaService.tag.findMany.mock.calls[0][0].take).toBe(5)
    })
  })

  // ─────────────────────────────────────────────
  // upsertMany()
  // ─────────────────────────────────────────────
  describe('upsertMany', () => {
    it('deve fazer upsert de cada tag e retornar array de resultados', async () => {
      const tag = { id: '1', name: 'IA', slug: 'ia' }
      mockPrismaService.tag.upsert.mockResolvedValue(tag)

      const result = await service.upsertMany(['IA', 'Startups'])

      expect(result).toHaveLength(2)
      expect(mockPrismaService.tag.upsert).toHaveBeenCalledTimes(2)
    })

    it('deve normalizar espaços para hifens no slug', async () => {
      mockPrismaService.tag.upsert.mockResolvedValue({ id: '1', name: 'Machine Learning', slug: 'machine-learning' })

      await service.upsertMany(['Machine Learning'])

      const upsertArgs = mockPrismaService.tag.upsert.mock.calls[0][0]
      expect(upsertArgs.where.slug).toBe('machine-learning')
      expect(upsertArgs.create.slug).toBe('machine-learning')
    })

    it('deve retornar array vazio para input vazio', async () => {
      const result = await service.upsertMany([])
      expect(result).toEqual([])
    })
  })
})
