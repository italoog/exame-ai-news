import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(articleId: string, userId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_articleId: { userId, articleId } },
    })

    if (existing) {
      await this.prisma.favorite.delete({
        where: { userId_articleId: { userId, articleId } },
      })
      return { favorited: false }
    }

    await this.prisma.favorite.create({ data: { userId, articleId } })
    return { favorited: true }
  }

  async findByUser(userId: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              summary: true,
              coverImage: true,
              publishedAt: true,
              readTime: true,
              author: { select: { id: true, name: true, avatar: true } },
              category: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ])
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  async check(articleId: string, userId: string) {
    const fav = await this.prisma.favorite.findUnique({
      where: { userId_articleId: { userId, articleId } },
    })
    return { favorited: !!fav }
  }
}
