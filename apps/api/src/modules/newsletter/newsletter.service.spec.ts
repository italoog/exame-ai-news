import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { ConflictException } from '@nestjs/common'
import { NewsletterService } from './newsletter.service'
import { PrismaService } from '../../database/prisma.service'
import { EmailService } from '../auth/email.service'

const mockPrismaService = {
  newsletterSubscriber: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}

const mockEmailService = {
  sendNewsletterWelcome: jest.fn(),
}

describe('NewsletterService', () => {
  let service: NewsletterService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile()

    service = module.get<NewsletterService>(NewsletterService)
    jest.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // subscribe()
  // ─────────────────────────────────────────────
  describe('subscribe', () => {
    it('deve cadastrar novo subscriber e retornar mensagem de sucesso', async () => {
      mockPrismaService.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrismaService.newsletterSubscriber.create.mockResolvedValue({
        email: 'novo@exame.com',
      })
      mockEmailService.sendNewsletterWelcome.mockResolvedValue(undefined)

      const result = await service.subscribe({ email: 'novo@exame.com' })

      expect(result.message).toContain('sucesso')
      expect(mockPrismaService.newsletterSubscriber.create).toHaveBeenCalledWith({
        data: { email: 'novo@exame.com' },
      })
    })

    it('deve lançar ConflictException quando e-mail já está inscrito', async () => {
      mockPrismaService.newsletterSubscriber.findUnique.mockResolvedValue({
        email: 'existente@exame.com',
      })

      await expect(service.subscribe({ email: 'existente@exame.com' })).rejects.toThrow(
        ConflictException,
      )
      expect(mockPrismaService.newsletterSubscriber.create).not.toHaveBeenCalled()
    })

    it('deve disparar e-mail de boas-vindas sem bloquear a resposta (fire-and-forget)', async () => {
      mockPrismaService.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrismaService.newsletterSubscriber.create.mockResolvedValue({ email: 'a@b.com' })
      mockEmailService.sendNewsletterWelcome.mockResolvedValue(undefined)

      await service.subscribe({ email: 'a@b.com' })

      // sendNewsletterWelcome deve ter sido chamado (mesmo que async)
      expect(mockEmailService.sendNewsletterWelcome).toHaveBeenCalledWith('a@b.com')
    })

    it('não deve falhar quando o e-mail de boas-vindas rejeita', async () => {
      mockPrismaService.newsletterSubscriber.findUnique.mockResolvedValue(null)
      mockPrismaService.newsletterSubscriber.create.mockResolvedValue({ email: 'a@b.com' })
      mockEmailService.sendNewsletterWelcome.mockRejectedValue(new Error('SMTP error'))

      await expect(service.subscribe({ email: 'a@b.com' })).resolves.not.toThrow()
    })
  })
})
