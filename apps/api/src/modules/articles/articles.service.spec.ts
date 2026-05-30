import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ArticleStatus, Role } from '@prisma/client'
import { ArticlesService } from './articles.service'
import { PrismaService } from '../../database/prisma.service'
import { AiService } from '../ai/ai.service'
import { NotificationsService } from '../notifications/notifications.service'

// ─── Fixture base para artigo ─────────────────────────────────────────────────
const mockArticleBase = {
  id: 'article-1',
  title: 'Artigo de Teste',
  slug: 'artigo-de-teste',
  summary: 'Resumo do artigo',
  aiSummary: null,
  coverImage: null,
  status: ArticleStatus.PUBLISHED,
  featured: false,
  publishedAt: new Date('2024-01-01'),
  readTime: 5,
  viewCount: 10,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  author: { id: 'user-1', name: 'Autor', avatar: null },
  category: { id: 'cat-1', name: 'Tecnologia', slug: 'tecnologia', color: '#ff0000' },
  tags: [],
  _count: { comments: 0, favorites: 0 },
}

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockPrismaService = {
  article: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
}

const mockAiService = {
  enqueueAiSummary: jest.fn(),
}

const mockNotificationsService = {
  sendBreakingNews: jest.fn(),
}

// ─── Suite ────────────────────────────────────────────────────────────────────
describe('ArticlesService', () => {
  let service: ArticlesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AiService, useValue: mockAiService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile()

    service = module.get<ArticlesService>(ArticlesService)
    jest.clearAllMocks()
    mockAiService.enqueueAiSummary.mockResolvedValue(undefined)
    mockPrismaService.article.update.mockResolvedValue({})
  })

  // ─────────────────────────────────────────────
  // findAll()
  // ─────────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar array paginado com meta de paginação', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([mockArticleBase])
      mockPrismaService.article.count.mockResolvedValue(1)

      const result = await service.findAll({ page: 1, limit: 12 })

      expect(result.data).toHaveLength(1)
      expect(result.meta).toEqual({ page: 1, limit: 12, total: 1, totalPages: 1 })
    })

    it('deve aplicar filtro de categoria no where da query', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([mockArticleBase])
      mockPrismaService.article.count.mockResolvedValue(1)

      await service.findAll({ page: 1, limit: 12, category: 'tecnologia' })

      const whereArg = mockPrismaService.article.findMany.mock.calls[0][0].where
      expect(whereArg).toMatchObject({ category: { slug: 'tecnologia' } })
    })

    it('deve aplicar filtro de busca por texto (OR em título e summary)', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([])
      mockPrismaService.article.count.mockResolvedValue(0)

      await service.findAll({ page: 1, limit: 12, search: 'inteligência' })

      const whereArg = mockPrismaService.article.findMany.mock.calls[0][0].where
      expect(whereArg).toHaveProperty('OR')
      expect(whereArg.OR).toHaveLength(2)
    })

    it('deve restringir a PUBLISHED para usuários sem role (unauthenticated)', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([])
      mockPrismaService.article.count.mockResolvedValue(0)

      await service.findAll({ page: 1, limit: 12 })

      const whereArg = mockPrismaService.article.findMany.mock.calls[0][0].where
      expect(whereArg).toMatchObject({ status: ArticleStatus.PUBLISHED })
    })

    it('deve calcular corretamente o totalPages', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([])
      mockPrismaService.article.count.mockResolvedValue(25)

      const result = await service.findAll({ page: 1, limit: 10 })

      expect(result.meta.totalPages).toBe(3)
    })
  })

  // ─────────────────────────────────────────────
  // findBySlug()
  // ─────────────────────────────────────────────
  describe('findBySlug', () => {
    it('deve retornar o artigo publicado pelo slug', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        ...mockArticleBase,
        content: 'Conteúdo completo',
      })

      const result = await service.findBySlug('artigo-de-teste')

      expect(result.slug).toBe('artigo-de-teste')
      expect(mockPrismaService.article.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: 'artigo-de-teste' } }),
      )
    })

    it('deve lançar NotFoundException para slug inexistente', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)

      await expect(service.findBySlug('slug-invalido')).rejects.toThrow(NotFoundException)
    })

    it('deve lançar NotFoundException para artigo não publicado (DRAFT)', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        ...mockArticleBase,
        status: ArticleStatus.DRAFT,
        content: 'rascunho',
      })

      await expect(service.findBySlug('artigo-de-teste')).rejects.toThrow(NotFoundException)
    })

    it('deve disparar incremento de viewCount de forma assíncrona', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        ...mockArticleBase,
        content: 'Conteúdo completo',
      })

      await service.findBySlug('artigo-de-teste')

      expect(mockPrismaService.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'artigo-de-teste' },
          data: { viewCount: { increment: 1 } },
        }),
      )
    })

    it('deve incluir isFavorited=false quando userId não for fornecido', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        ...mockArticleBase,
        content: 'Conteúdo completo',
      })

      const result = await service.findBySlug('artigo-de-teste')

      expect(result.isFavorited).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // create()
  // ─────────────────────────────────────────────
  describe('create', () => {
    const createDto = {
      title: 'Novo Artigo',
      content: 'Conteúdo do artigo',
      categoryId: 'cat-1',
      status: ArticleStatus.PUBLISHED,
    }

    it('deve criar o artigo com slug gerado automaticamente a partir do título', async () => {
      // findUnique retorna null → slug 'novo-artigo' está disponível
      mockPrismaService.article.findUnique.mockResolvedValue(null)
      mockPrismaService.article.create.mockResolvedValue({
        ...mockArticleBase,
        title: 'Novo Artigo',
        slug: 'novo-artigo',
      })

      await service.create(createDto, 'user-1')

      expect(mockPrismaService.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'novo-artigo',
            authorId: 'user-1',
          }),
        }),
      )
    })

    it('deve chamar enqueueAiSummary ao criar artigo com status PUBLISHED', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)
      mockPrismaService.article.create.mockResolvedValue({
        ...mockArticleBase,
        id: 'article-1',
        title: 'Novo Artigo',
        slug: 'novo-artigo',
        status: ArticleStatus.PUBLISHED,
      })

      await service.create(createDto, 'user-1')

      expect(mockAiService.enqueueAiSummary).toHaveBeenCalledWith(
        'article-1',
        'Novo Artigo',
        'Conteúdo do artigo',
      )
    })

    it('não deve chamar enqueueAiSummary para artigo em rascunho (DRAFT)', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)
      mockPrismaService.article.create.mockResolvedValue({
        ...mockArticleBase,
        status: ArticleStatus.DRAFT,
      })

      await service.create({ ...createDto, status: ArticleStatus.DRAFT }, 'user-1')

      expect(mockAiService.enqueueAiSummary).not.toHaveBeenCalled()
    })

    it('deve gerar slug com sufixo quando já existir colisão', async () => {
      // Primeira chamada: slug existe → segunda: não existe (Date.now suffix)
      mockPrismaService.article.findUnique.mockResolvedValueOnce({ slug: 'novo-artigo' })
      mockPrismaService.article.create.mockResolvedValue({
        ...mockArticleBase,
        title: 'Novo Artigo',
        slug: 'novo-artigo-123456',
        status: ArticleStatus.DRAFT,
      })

      await service.create({ ...createDto, status: ArticleStatus.DRAFT }, 'user-1')

      const createdSlug = mockPrismaService.article.create.mock.calls[0][0].data.slug as string
      expect(createdSlug).toMatch(/^novo-artigo-\d+$/)
    })
  })

  // ─────────────────────────────────────────────
  // publish()
  // ─────────────────────────────────────────────
  describe('publish', () => {
    it('deve atualizar status para PUBLISHED e definir publishedAt', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        id: 'article-1',
        authorId: 'user-1',
        content: 'conteúdo',
        title: 'Artigo',
        status: ArticleStatus.DRAFT,
      })
      mockPrismaService.article.update.mockResolvedValue({
        ...mockArticleBase,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      })

      await service.publish('article-1', 'user-1', Role.EDITOR)

      expect(mockPrismaService.article.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: ArticleStatus.PUBLISHED }),
        }),
      )
    })

    it('deve lançar ForbiddenException se o usuário não for o autor e não for ADMIN', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        id: 'article-1',
        authorId: 'outro-usuario',
        content: 'conteúdo',
      })

      await expect(service.publish('article-1', 'user-1', Role.USER)).rejects.toThrow(
        ForbiddenException,
      )
    })

    it('deve lançar NotFoundException se o artigo não existir', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)

      await expect(service.publish('inexistente', 'user-1', Role.ADMIN)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('deve permitir ADMIN publicar artigo de outro autor', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        id: 'article-1',
        authorId: 'outro-usuario',
        content: 'conteúdo',
        title: 'Artigo',
      })
      mockPrismaService.article.update.mockResolvedValue({
        ...mockArticleBase,
        status: ArticleStatus.PUBLISHED,
      })

      await expect(service.publish('article-1', 'admin-user', Role.ADMIN)).resolves.not.toThrow()
    })

    it('deve chamar enqueueAiSummary após publicar', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        id: 'article-1',
        authorId: 'user-1',
        content: 'conteúdo do artigo',
        title: 'Artigo',
        status: ArticleStatus.DRAFT,
      })
      mockPrismaService.article.update.mockResolvedValue({
        ...mockArticleBase,
        id: 'article-1',
        title: 'Artigo',
        status: ArticleStatus.PUBLISHED,
      })

      await service.publish('article-1', 'user-1', Role.EDITOR)

      expect(mockAiService.enqueueAiSummary).toHaveBeenCalledWith(
        'article-1',
        'Artigo',
        'conteúdo do artigo',
      )
    })
  })

  // ─────────────────────────────────────────────
  // update()
  // ─────────────────────────────────────────────
  describe('update', () => {
    it('deve atualizar artigo quando usuário é o autor', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        ...mockArticleBase,
        authorId: 'user-1',
        content: 'conteúdo original',
        status: ArticleStatus.PUBLISHED,
      })
      mockPrismaService.article.update.mockResolvedValue({ ...mockArticleBase, title: 'Atualizado' })

      const result = await service.update('article-1', { title: 'Atualizado' }, 'user-1', Role.EDITOR)

      expect(result.title).toBe('Atualizado')
    })

    it('deve lançar ForbiddenException quando user não é o autor e não é ADMIN', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({ ...mockArticleBase, authorId: 'outro-user', content: 'x' })

      await expect(
        service.update('article-1', { title: 'X' }, 'user-1', Role.REDATOR),
      ).rejects.toThrow(ForbiddenException)
    })

    it('deve lançar NotFoundException quando artigo não existe', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)

      await expect(service.update('inexistente', {}, 'user-1', Role.ADMIN)).rejects.toThrow(NotFoundException)
    })
  })

  // ─────────────────────────────────────────────
  // unpublish()
  // ─────────────────────────────────────────────
  describe('unpublish', () => {
    it('deve voltar artigo para DRAFT quando EDITOR é o autor', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({ ...mockArticleBase, authorId: 'user-1', content: 'x' })
      mockPrismaService.article.update.mockResolvedValue({ ...mockArticleBase, status: ArticleStatus.DRAFT })

      await service.unpublish('article-1', 'user-1', Role.EDITOR)

      expect(mockPrismaService.article.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: ArticleStatus.DRAFT, publishedAt: null } }),
      )
    })

    it('deve lançar ForbiddenException para REDATOR', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({ ...mockArticleBase, authorId: 'user-1', content: 'x' })

      await expect(service.unpublish('article-1', 'user-1', Role.REDATOR)).rejects.toThrow(ForbiddenException)
    })

    it('deve lançar NotFoundException quando artigo não existe', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)

      await expect(service.unpublish('inexistente', 'user-1', Role.ADMIN)).rejects.toThrow(NotFoundException)
    })
  })

  // ─────────────────────────────────────────────
  // archive()
  // ─────────────────────────────────────────────
  describe('archive', () => {
    it('deve arquivar artigo quando EDITOR é o autor', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({ ...mockArticleBase, authorId: 'user-1', content: 'x' })
      mockPrismaService.article.update.mockResolvedValue({ ...mockArticleBase, status: ArticleStatus.ARCHIVED })

      await service.archive('article-1', 'user-1', Role.EDITOR)

      expect(mockPrismaService.article.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: ArticleStatus.ARCHIVED } }),
      )
    })

    it('deve lançar ForbiddenException quando REDATOR tenta arquivar artigo de outro', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({ ...mockArticleBase, authorId: 'outro-user', content: 'x' })

      await expect(service.archive('article-1', 'user-1', Role.REDATOR)).rejects.toThrow(ForbiddenException)
    })

    it('deve lançar NotFoundException quando artigo não existe', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)

      await expect(service.archive('inexistente', 'user-1', Role.ADMIN)).rejects.toThrow(NotFoundException)
    })
  })

  // ─────────────────────────────────────────────
  // findTrending()
  // ─────────────────────────────────────────────
  describe('findTrending', () => {
    it('deve retornar artigos PUBLISHED ordenados por viewCount e publishedAt', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([mockArticleBase])

      const result = await service.findTrending()

      expect(result).toHaveLength(1)
      const callArgs = mockPrismaService.article.findMany.mock.calls[0][0]
      expect(callArgs.where).toMatchObject({ status: ArticleStatus.PUBLISHED })
      expect(callArgs.take).toBe(10)
    })
  })

  // ─────────────────────────────────────────────
  // findFeatured()
  // ─────────────────────────────────────────────
  describe('findFeatured', () => {
    it('deve retornar somente artigos PUBLISHED e featured=true', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([{ ...mockArticleBase, featured: true }])

      const result = await service.findFeatured()

      expect(result).toHaveLength(1)
      const callWhere = mockPrismaService.article.findMany.mock.calls[0][0].where
      expect(callWhere).toMatchObject({ status: ArticleStatus.PUBLISHED, featured: true })
    })
  })
})
