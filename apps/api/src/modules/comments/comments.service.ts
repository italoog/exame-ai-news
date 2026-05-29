import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import type { CreateCommentDto } from './dto/create-comment.dto'
import { Role } from '@prisma/client'

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByArticle(articleId: string) {
    return this.prisma.comment.findMany({
      where: { articleId, parentId: null, status: 'ACTIVE' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        replies: {
          where: { status: 'ACTIVE' },
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(articleId: string, dto: CreateCommentDto, userId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } })
    if (!article) throw new NotFoundException('Artigo não encontrado')

    return this.prisma.comment.create({
      data: { content: dto.content, articleId, userId, parentId: dto.parentId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    })
  }

  async update(id: string, content: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })
    if (!comment) throw new NotFoundException('Comentário não encontrado')
    if (comment.userId !== userId) throw new ForbiddenException('Sem permissão')

    return this.prisma.comment.update({
      where: { id },
      data: { content },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    })
  }

  async remove(id: string, userId: string, userRole: Role) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })
    if (!comment) throw new NotFoundException('Comentário não encontrado')
    if (comment.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Sem permissão')
    }

    return this.prisma.comment.update({ where: { id }, data: { status: 'DELETED' } })
  }

  async toggleLike(commentId: string, userId: string) {
    const existing = await this.prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    })

    if (existing) {
      await this.prisma.commentLike.delete({
        where: { userId_commentId: { userId, commentId } },
      })
      await this.prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
      })
      return { liked: false }
    }

    await this.prisma.commentLike.create({ data: { userId, commentId } })
    await this.prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    })
    return { liked: true }
  }
}
