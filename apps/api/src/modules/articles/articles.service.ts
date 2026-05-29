import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { AiService } from '../ai/ai.service'
import { NotificationsService } from '../notifications/notifications.service'
import type { CreateArticleDto } from './dto/create-article.dto'
import type { UpdateArticleDto } from './dto/update-article.dto'
import type { ArticleFiltersDto } from './dto/article-filters.dto'
import { ArticleStatus, Role } from '@prisma/client'

const ARTICLE_SELECT = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  aiSummary: true,
  coverImage: true,
  status: true,
  featured: true,
  publishedAt: true,
  readTime: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true, avatar: true } },
  category: { select: { id: true, name: true, slug: true, color: true } },
  tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
  _count: { select: { comments: true, favorites: true } },
} as const

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(filters: ArticleFiltersDto, userRole?: Role, userId?: string) {
    const { page = 1, limit = 12, category, tag, search, status } = filters
    const skip = (page - 1) * limit

    const isEditorOrAdmin = userRole === Role.EDITOR || userRole === Role.ADMIN
    const isRedator = userRole === Role.REDATOR

    // EDITOR/ADMIN vîm tudo; REDATOR vê publicados + próprios; USER só publicados
    const baseStatusFilter = status
      ? { status: status as ArticleStatus }
      : isEditorOrAdmin
        ? {}
        : isRedator && userId
          ? { OR: [{ status: ArticleStatus.PUBLISHED }, { authorId: userId }] }
          : { status: ArticleStatus.PUBLISHED }

    const where = {
      ...baseStatusFilter,
      ...(category && { category: { slug: category } }),
      ...(tag && { tags: { some: { tag: { slug: tag } } } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { summary: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: ARTICLE_SELECT,
      }),
      this.prisma.article.count({ where }),
    ])

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  }

  async findBySlug(slug: string, userId?: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      select: {
        ...ARTICLE_SELECT,
        content: true,
        ...(userId && {
          favorites: { where: { userId }, select: { userId: true } },
        }),
      },
    })

    if (!article) throw new NotFoundException('Artigo não encontrado')
    if (article.status !== ArticleStatus.PUBLISHED) {
      throw new NotFoundException('Artigo não encontrado')
    }

    // Increment view count asynchronously
    this.prisma.article
      .update({ where: { slug }, data: { viewCount: { increment: 1 } } })
      .catch(() => null)

    return {
      ...article,
      isFavorited: userId
        ? ((article as unknown as { favorites?: { userId: string }[] }).favorites?.length ?? 0) > 0
        : false,
    }
  }

  async findByIdForEdit(id: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { ...ARTICLE_SELECT, content: true },
    })

    if (!article) throw new NotFoundException('Artigo não encontrado')
    // REDATOR só vê próprios artigos
    if (userRole === Role.REDATOR && article.authorId !== userId) {
      throw new ForbiddenException('Você só pode editar seus próprios artigos')
    }

    return article
  }

  async findTrending(limit = 10) {
    return this.prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED },
      orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
      select: ARTICLE_SELECT,
    })
  }

  async findFeatured() {
    return this.prisma.article.findMany({
      where: { status: ArticleStatus.PUBLISHED, featured: true },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: ARTICLE_SELECT,
    })
  }

  async create(dto: CreateArticleDto, authorId: string) {
    const slug = await this.generateUniqueSlug(dto.title)
    const { tags, ...rest } = dto
    const tagIds = tags && tags.length > 0 ? await this.resolveTagIds(tags) : []

    const article = await this.prisma.article.create({
      data: {
        ...rest,
        slug,
        authorId,
        ...(tagIds.length > 0 && {
          tags: {
            create: tagIds.map((id) => ({ tag: { connect: { id } } })),
          },
        }),
      },
      select: ARTICLE_SELECT,
    })

    if (article.status === ArticleStatus.PUBLISHED) {
      void this.aiService.enqueueAiSummary(article.id, article.title, dto.content)
    }

    return article
  }

  async update(id: string, dto: UpdateArticleDto, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException('Artigo não encontrado')
    // REDATOR e EDITOR só editam os próprios; ADMIN edita tudo
    if (article.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Você só pode editar seus próprios artigos')
    }

    const { tags, ...rest } = dto
    const tagIds = tags !== undefined ? await this.resolveTagIds(tags) : undefined
    return this.prisma.article.update({
      where: { id },
      data: {
        ...rest,
        ...(tagIds !== undefined && {
          tags: {
            deleteMany: {},
            create: tagIds.map((id) => ({ tag: { connect: { id } } })),
          },
        }),
      },
      select: ARTICLE_SELECT,
    })
  }

  async publish(id: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException('Artigo não encontrado')
    // Apenas EDITOR e ADMIN publicam — REDATOR precisa de aprovação
    if (userRole === Role.REDATOR) {
      throw new ForbiddenException('Redatores não podem publicar diretamente. Solicite revisão a um editor.')
    }
    if (article.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Você só pode publicar seus próprios artigos')
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.PUBLISHED, publishedAt: new Date() },
      select: ARTICLE_SELECT,
    })

    void this.aiService.enqueueAiSummary(updated.id, updated.title, article.content)

    if (updated.featured) {
      this.notificationsService.sendBreakingNews({
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        category: updated.category.name,
      })
    }

    return updated
  }

  async unpublish(id: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException('Artigo não encontrado')
    // Apenas EDITOR e ADMIN despublicam
    if (userRole === Role.REDATOR) {
      throw new ForbiddenException('Redatores não podem despublicar artigos.')
    }
    if (article.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Você só pode despublicar seus próprios artigos')
    }

    return this.prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.DRAFT, publishedAt: null },
      select: ARTICLE_SELECT,
    })
  }

  async archive(id: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException('Artigo não encontrado')
    // REDATOR só arquiva os próprios; EDITOR/ADMIN arquivam qualquer um
    if (userRole === Role.REDATOR && article.authorId !== userId) {
      throw new ForbiddenException('Você só pode arquivar seus próprios artigos')
    }

    return this.prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.ARCHIVED },
      select: ARTICLE_SELECT,
    })
  }

  async remove(id: string, userId: string, userRole: Role) {
    const article = await this.prisma.article.findUnique({ where: { id } })
    if (!article) throw new NotFoundException('Artigo não encontrado')
    if (article.authorId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Sem permissão')
    }

    return this.prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.ARCHIVED },
      select: ARTICLE_SELECT,
    })
  }

  /** Recebe nomes/slugs de tags, faz upsert e retorna os IDs */
  private async resolveTagIds(tagNames: string[]): Promise<string[]> {
    const ids: string[] = []
    for (const raw of tagNames) {
      const slug = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      if (!slug) continue
      const tag = await this.prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name: raw.trim(), slug },
      })
      ids.push(tag.id)
    }
    return ids
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 80)

    const existing = await this.prisma.article.findUnique({ where: { slug: base } })
    if (!existing) return base

    const timestamp = Date.now().toString().slice(-6)
    return `${base}-${timestamp}`
  }
}
