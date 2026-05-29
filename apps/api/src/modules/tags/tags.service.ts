import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } })
  }

  async findPopular(limit = 20) {
    return this.prisma.tag.findMany({
      take: limit,
      orderBy: { articles: { _count: 'desc' } },
      include: { _count: { select: { articles: true } } },
    })
  }

  async upsertMany(tags: string[]) {
    return Promise.all(
      tags.map((name) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        return this.prisma.tag.upsert({
          where: { slug },
          update: {},
          create: { name, slug },
        })
      }),
    )
  }
}
