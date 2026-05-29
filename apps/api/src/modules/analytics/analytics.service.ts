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
    const [totalArticles, totalUsers, totalViews, recentEvents] = await Promise.all([
      this.prisma.article.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.article.aggregate({ _sum: { viewCount: true } }),
      this.prisma.analyticsEvent.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ])

    return {
      totalArticles,
      totalUsers,
      totalViews: totalViews._sum.viewCount ?? 0,
      eventsLast24h: recentEvents,
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
