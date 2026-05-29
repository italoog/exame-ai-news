import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(data: {
    eventType: string
    articleId?: string
    userId?: string
    ip?: string
    userAgent?: string
  }) {
    return this.prisma.analyticsEvent.create({ data })
  }

  async getDashboard() {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const [totalArticles, totalUsers, totalViews, articlesPublishedToday, topArticles] =
      await Promise.all([
        this.prisma.article.count({ where: { status: 'PUBLISHED' } }),
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.article.aggregate({ _sum: { viewCount: true } }),
        this.prisma.article.count({
          where: { status: 'PUBLISHED', publishedAt: { gte: startOfToday } },
        }),
        this.prisma.article.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { viewCount: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            viewCount: true,
            category: { select: { name: true, slug: true } },
          },
        }),
      ])

    return {
      totalArticles,
      totalUsers,
      totalViews: totalViews._sum.viewCount ?? 0,
      articlesPublishedToday,
      topArticles,
    }
  }

  async getTopArticles(limit = 10) {
    return this.prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { viewCount: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        publishedAt: true,
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true, favorites: true } },
      },
    })
  }
}
