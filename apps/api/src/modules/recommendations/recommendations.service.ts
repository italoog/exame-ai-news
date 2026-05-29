import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retorna recomendações personalizadas baseadas no histórico de leitura do usuário.
   */
  async getForUser(userId: string, limit = 6): Promise<unknown[]> {
    const history = await this.prisma.readHistory.findMany({
      where: { userId },
      include: {
        article: {
          select: { categoryId: true, tags: { select: { tagId: true } } },
        },
      },
      orderBy: { readAt: 'desc' },
      take: 20,
    })

    const readArticleIds = history.map((h) => h.articleId)
    const categoryIds = [...new Set(history.map((h) => h.article.categoryId))]
    const tagIds = [
      ...new Set(history.flatMap((h) => h.article.tags.map((t) => t.tagId))),
    ]

    const recommended = await this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        id: { notIn: readArticleIds },
        OR: [
          { categoryId: { in: categoryIds } },
          { tags: { some: { tagId: { in: tagIds } } } },
        ],
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
        _count: { select: { comments: true, favorites: true } },
      },
      orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
    })

    if (recommended.length < limit) {
      const popular = await this.prisma.article.findMany({
        where: {
          status: 'PUBLISHED',
          id: { notIn: [...readArticleIds, ...recommended.map((r) => r.id)] },
        },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { include: { tag: true } },
          _count: { select: { comments: true, favorites: true } },
        },
        orderBy: { viewCount: 'desc' },
        take: limit - recommended.length,
      })
      return [...recommended, ...popular]
    }

    return recommended
  }

  /**
   * Retorna artigos mais populares por contagem de visualizações.
   */
  async getPopular(limit = 6): Promise<unknown[]> {
    return this.prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
        _count: { select: { comments: true, favorites: true } },
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
    })
  }

  /**
   * Retorna artigos similares ao artigo informado (mesma categoria ou tags).
   */
  async getSimilar(articleId: string, limit = 4): Promise<unknown[]> {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      select: {
        categoryId: true,
        tags: { select: { tagId: true } },
      },
    })

    if (!article) return []

    const tagIds = article.tags.map((t) => t.tagId)

    return this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: articleId },
        OR: [
          { categoryId: article.categoryId },
          { tags: { some: { tagId: { in: tagIds } } } },
        ],
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
    })
  }

  /**
   * Registra ou atualiza a leitura de um artigo no histórico do usuário.
   */
  async trackReadHistory(userId: string, articleId: string): Promise<void> {
    await this.prisma.readHistory.upsert({
      where: { userId_articleId: { userId, articleId } },
      create: { userId, articleId },
      update: { readAt: new Date() },
    })
  }
}
