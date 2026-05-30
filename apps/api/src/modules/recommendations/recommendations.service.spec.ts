import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RecommendationsService } from './recommendations.service';
import { PrismaService } from '../../database/prisma.service';

const mockArticle = {
  id: 'article-2',
  title: 'Artigo Recomendado',
  slug: 'artigo-recomendado',
  status: 'PUBLISHED',
  viewCount: 200,
  publishedAt: new Date('2024-01-01'),
  author: { id: 'user-1', name: 'Autor', avatar: null },
  category: { id: 'cat-1', name: 'Tech', slug: 'tech' },
  tags: [],
  _count: { comments: 3, favorites: 5 },
};

const mockPrismaService = {
  readHistory: { findMany: jest.fn(), upsert: jest.fn() },
  article: { findMany: jest.fn(), findUnique: jest.fn() },
};

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecommendationsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // getPopular()
  // ─────────────────────────────────────────────
  describe('getPopular', () => {
    it('deve retornar artigos populares ordenados por viewCount', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([mockArticle]);

      const result = await service.getPopular();

      expect(result).toHaveLength(1);
      const callArgs = mockPrismaService.article.findMany.mock.calls[0][0];
      expect(callArgs.where).toMatchObject({ status: 'PUBLISHED' });
      expect(callArgs.orderBy).toEqual({ viewCount: 'desc' });
    });

    it('deve respeitar limit customizado', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([]);

      await service.getPopular(3);

      expect(mockPrismaService.article.findMany.mock.calls[0][0].take).toBe(3);
    });
  });

  // ─────────────────────────────────────────────
  // getSimilar()
  // ─────────────────────────────────────────────
  describe('getSimilar', () => {
    it('deve retornar artigos similares por categoria/tags', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        categoryId: 'cat-1',
        tags: [{ tagId: 'tag-1' }],
      });
      mockPrismaService.article.findMany.mockResolvedValue([mockArticle]);

      const result = await service.getSimilar('article-1');

      expect(result).toHaveLength(1);
    });

    it('deve retornar array vazio quando artigo não existe', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      const result = await service.getSimilar('inexistente');

      expect(result).toEqual([]);
    });

    it('deve excluir o próprio artigo dos resultados', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        categoryId: 'cat-1',
        tags: [],
      });
      mockPrismaService.article.findMany.mockResolvedValue([]);

      await service.getSimilar('article-1');

      const whereArg = mockPrismaService.article.findMany.mock.calls[0][0].where;
      expect(whereArg.id).toMatchObject({ not: 'article-1' });
    });
  });

  // ─────────────────────────────────────────────
  // getForUser()
  // ─────────────────────────────────────────────
  describe('getForUser', () => {
    it('deve retornar recomendações baseadas no histórico de leitura', async () => {
      mockPrismaService.readHistory.findMany.mockResolvedValue([
        {
          articleId: 'article-1',
          article: { categoryId: 'cat-1', tags: [{ tagId: 'tag-1' }] },
        },
      ]);
      // Primeira chamada: artigos recomendados por categoria/tags
      // Segunda chamada: populares para complementar (retorna vazio — já temos suficiente)
      mockPrismaService.article.findMany
        .mockResolvedValueOnce([mockArticle])
        .mockResolvedValueOnce([]);

      const result = await service.getForUser('user-1');

      expect(result).toHaveLength(1);
    });

    it('deve complementar com populares quando recomendações insuficientes', async () => {
      mockPrismaService.readHistory.findMany.mockResolvedValue([
        { articleId: 'article-1', article: { categoryId: 'cat-1', tags: [] } },
      ]);
      // Primeira chamada: recomendações por categoria/tags (retorna menos que o limit)
      mockPrismaService.article.findMany
        .mockResolvedValueOnce([])
        // Segunda chamada: populares para completar
        .mockResolvedValueOnce([mockArticle]);

      const result = await service.getForUser('user-1', 6);

      // Deve ter chamado findMany duas vezes (recomendados + populares)
      expect(mockPrismaService.article.findMany).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(1);
    });

    it('deve retornar populares quando usuário não tem histórico', async () => {
      mockPrismaService.readHistory.findMany.mockResolvedValue([]);
      mockPrismaService.article.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockArticle]);

      await service.getForUser('user-sem-historico', 6);

      expect(mockPrismaService.article.findMany).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────────────────────
  // trackReadHistory()
  // ─────────────────────────────────────────────
  describe('trackReadHistory', () => {
    it('deve fazer upsert do histórico de leitura', async () => {
      mockPrismaService.readHistory.upsert.mockResolvedValue({});

      await service.trackReadHistory('user-1', 'article-1');

      expect(mockPrismaService.readHistory.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_articleId: { userId: 'user-1', articleId: 'article-1' } },
          create: expect.objectContaining({ userId: 'user-1', articleId: 'article-1' }),
        }),
      );
    });

    it('deve popular readTimeSpent e completed quando fornecidos', async () => {
      mockPrismaService.readHistory.upsert.mockResolvedValue({});

      await service.trackReadHistory('user-1', 'article-1', 120, true);

      expect(mockPrismaService.readHistory.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ readTimeSpent: 120, completed: true }),
          update: expect.objectContaining({ readTimeSpent: 120, completed: true }),
        }),
      );
    });
  });
});
