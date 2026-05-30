import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { Role } from '@prisma/client'
import { CommentsService } from './comments.service'
import { PrismaService } from '../../database/prisma.service'

const mockCommentBase = {
  id: 'comment-1',
  content: 'Ótimo artigo!',
  articleId: 'article-1',
  userId: 'user-1',
  parentId: null,
  status: 'ACTIVE',
  likeCount: 0,
  createdAt: new Date('2024-01-01'),
  user: { id: 'user-1', name: 'João', avatar: null },
}

const mockPrismaService = {
  article: { findUnique: jest.fn() },
  comment: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  commentLike: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
}

describe('CommentsService', () => {
  let service: CommentsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile()

    service = module.get<CommentsService>(CommentsService)
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // findByArticle()
  // ─────────────────────────────────────────────
  describe('findByArticle', () => {
    it('deve retornar comentários raiz (parentId=null, status=ACTIVE) do artigo', async () => {
      mockPrismaService.comment.findMany.mockResolvedValue([mockCommentBase])

      const result = await service.findByArticle('article-1')

      expect(result).toHaveLength(1)
      const callWhere = mockPrismaService.comment.findMany.mock.calls[0][0].where
      expect(callWhere).toMatchObject({ articleId: 'article-1', parentId: null, status: 'ACTIVE' })
    })
  })

  // ─────────────────────────────────────────────
  // create()
  // ─────────────────────────────────────────────
  describe('create', () => {
    it('deve criar comentário quando artigo existe', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({ id: 'article-1' })
      mockPrismaService.comment.create.mockResolvedValue(mockCommentBase)

      const result = await service.create('article-1', { content: 'Ótimo artigo!' }, 'user-1')

      expect(result).toEqual(mockCommentBase)
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ content: 'Ótimo artigo!', articleId: 'article-1', userId: 'user-1' }),
        }),
      )
    })

    it('deve lançar NotFoundException quando artigo não existe', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null)

      await expect(
        service.create('inexistente', { content: 'texto' }, 'user-1'),
      ).rejects.toThrow(NotFoundException)
    })
  })

  // ─────────────────────────────────────────────
  // update()
  // ─────────────────────────────────────────────
  describe('update', () => {
    it('deve atualizar conteúdo quando usuário é o dono', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockCommentBase)
      mockPrismaService.comment.update.mockResolvedValue({ ...mockCommentBase, content: 'Editado' })

      const result = await service.update('comment-1', 'Editado', 'user-1')

      expect(result.content).toBe('Editado')
    })

    it('deve lançar ForbiddenException quando usuário não é dono', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockCommentBase)

      await expect(service.update('comment-1', 'texto', 'outro-user')).rejects.toThrow(
        ForbiddenException,
      )
    })

    it('deve lançar NotFoundException quando comentário não existe', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(service.update('inexistente', 'texto', 'user-1')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  // ─────────────────────────────────────────────
  // remove()
  // ─────────────────────────────────────────────
  describe('remove', () => {
    it('deve marcar como DELETED quando usuário é dono', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockCommentBase)
      mockPrismaService.comment.update.mockResolvedValue({ ...mockCommentBase, status: 'DELETED' })

      await service.remove('comment-1', 'user-1', Role.USER)

      expect(mockPrismaService.comment.update).toHaveBeenCalledWith({
        where: { id: 'comment-1' },
        data: { status: 'DELETED' },
      })
    })

    it('deve permitir ADMIN remover comentário de outro usuário', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockCommentBase)
      mockPrismaService.comment.update.mockResolvedValue({ ...mockCommentBase, status: 'DELETED' })

      await expect(service.remove('comment-1', 'admin-id', Role.ADMIN)).resolves.not.toThrow()
    })

    it('deve lançar ForbiddenException quando USER tenta remover comentário de outro', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(mockCommentBase)

      await expect(service.remove('comment-1', 'outro-user', Role.USER)).rejects.toThrow(
        ForbiddenException,
      )
    })

    it('deve lançar NotFoundException quando comentário não existe', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null)

      await expect(service.remove('inexistente', 'user-1', Role.USER)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  // ─────────────────────────────────────────────
  // toggleLike()
  // ─────────────────────────────────────────────
  describe('toggleLike', () => {
    it('deve adicionar like quando ainda não existe e retornar liked: true', async () => {
      mockPrismaService.commentLike.findUnique.mockResolvedValue(null)
      mockPrismaService.commentLike.create.mockResolvedValue({})
      mockPrismaService.comment.update.mockResolvedValue({})

      const result = await service.toggleLike('comment-1', 'user-1')

      expect(result).toEqual({ liked: true })
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { likeCount: { increment: 1 } } }),
      )
    })

    it('deve remover like quando já existe e retornar liked: false', async () => {
      mockPrismaService.commentLike.findUnique.mockResolvedValue({ userId: 'user-1', commentId: 'comment-1' })
      mockPrismaService.commentLike.delete.mockResolvedValue({})
      mockPrismaService.comment.update.mockResolvedValue({})

      const result = await service.toggleLike('comment-1', 'user-1')

      expect(result).toEqual({ liked: false })
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { likeCount: { decrement: 1 } } }),
      )
    })
  })
})
