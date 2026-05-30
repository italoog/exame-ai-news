import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { FavoritesService } from './favorites.service'
import { PrismaService } from '../../database/prisma.service'

const mockPrismaService = {
  favorite: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}

const mockArticle = {
  id: 'article-1',
  title: 'Artigo Teste',
  slug: 'artigo-teste',
  summary: 'Resumo',
  coverImage: null,
  publishedAt: new Date('2024-01-01'),
  readTime: 5,
  author: { id: 'user-2', name: 'Autor', avatar: null },
  category: { id: 'cat-1', name: 'Tech', slug: 'tech' },
}

describe('FavoritesService', () => {
  let service: FavoritesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<FavoritesService>(FavoritesService)
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // toggle()
  // ─────────────────────────────────────────────
  describe('toggle', () => {
    it('deve adicionar favorito quando ainda não existe e retornar favorited: true', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue(null)
      mockPrismaService.favorite.create.mockResolvedValue({})

      const result = await service.toggle('article-1', 'user-1')

      expect(result).toEqual({ favorited: true })
      expect(mockPrismaService.favorite.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', articleId: 'article-1' },
      })
    })

    it('deve remover favorito quando já existe e retornar favorited: false', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue({ userId: 'user-1', articleId: 'article-1' })
      mockPrismaService.favorite.delete.mockResolvedValue({})

      const result = await service.toggle('article-1', 'user-1')

      expect(result).toEqual({ favorited: false })
      expect(mockPrismaService.favorite.delete).toHaveBeenCalledWith({
        where: { userId_articleId: { userId: 'user-1', articleId: 'article-1' } },
      })
    })
  })

  // ─────────────────────────────────────────────
  // findByUser()
  // ─────────────────────────────────────────────
  describe('findByUser', () => {
    it('deve retornar lista paginada de favoritos do usuário', async () => {
      const favorites = [{ userId: 'user-1', articleId: 'article-1', article: mockArticle }]
      mockPrismaService.favorite.findMany.mockResolvedValue(favorites)
      mockPrismaService.favorite.count.mockResolvedValue(1)

      const result = await service.findByUser('user-1', 1, 12)

      expect(result.data).toHaveLength(1)
      expect(result.meta).toEqual({ page: 1, limit: 12, total: 1, totalPages: 1 })
    })

    it('deve aplicar skip correto para página 2', async () => {
      mockPrismaService.favorite.findMany.mockResolvedValue([])
      mockPrismaService.favorite.count.mockResolvedValue(0)

      await service.findByUser('user-1', 2, 12)

      const callArgs = mockPrismaService.favorite.findMany.mock.calls[0][0]
      expect(callArgs.skip).toBe(12)
      expect(callArgs.take).toBe(12)
    })

    it('deve calcular totalPages corretamente', async () => {
      mockPrismaService.favorite.findMany.mockResolvedValue([])
      mockPrismaService.favorite.count.mockResolvedValue(25)

      const result = await service.findByUser('user-1', 1, 12)

      expect(result.meta.totalPages).toBe(3)
    })
  })

  // ─────────────────────────────────────────────
  // check()
  // ─────────────────────────────────────────────
  describe('check', () => {
    it('deve retornar favorited: true quando artigo é favorito do usuário', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue({ userId: 'user-1', articleId: 'article-1' })

      const result = await service.check('article-1', 'user-1')

      expect(result).toEqual({ favorited: true })
    })

    it('deve retornar favorited: false quando artigo não é favorito', async () => {
      mockPrismaService.favorite.findUnique.mockResolvedValue(null)

      const result = await service.check('article-1', 'user-1')

      expect(result).toEqual({ favorited: false })
    })
  })
})
